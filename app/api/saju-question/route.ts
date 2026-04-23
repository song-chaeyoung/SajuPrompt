import { buildSajuPrompt } from "@/shared/lib/openai/build-saju-prompt";
import {
  getDefaultOpenAIModel,
  getOpenAIClient,
} from "@/shared/lib/openai/get-openai-client";
import { hasCoreRequiredFields } from "@/shared/lib/saju-question-form/validation";
import type {
  AnalysisMode,
  BirthProfile,
  GoalInfo,
  GoalInputMode,
  SajuQuestionFormData,
} from "@/shared/types/saju-question-form";
import OpenAI from "openai";

export const runtime = "nodejs";

interface GenerateQuestionRequestBody {
  form?: unknown;
  stream?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isAnalysisMode(value: unknown): value is AnalysisMode {
  return value === "self" || value === "compatibility";
}

function isGoalInputMode(value: unknown): value is GoalInputMode {
  return value === "preset" || value === "custom";
}

function isBirthProfile(value: unknown): value is BirthProfile {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.name === "string" &&
    typeof value.birthPlace === "string" &&
    (value.calendarType === "solar" || value.calendarType === "lunar") &&
    typeof value.birthDate === "string" &&
    typeof value.birthTime === "string" &&
    typeof value.isBirthTimeUnknown === "boolean" &&
    (value.gender === "male" ||
      value.gender === "female" ||
      value.gender === "other" ||
      value.gender === "unknown")
  );
}

function isGoalInfo(value: unknown): value is GoalInfo {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.situation === "string" &&
    isGoalInputMode(value.situationInputMode) &&
    typeof value.purpose === "string" &&
    isGoalInputMode(value.purposeInputMode) &&
    (value.style === "balanced" ||
      value.style === "direct" ||
      value.style === "empathetic") &&
    typeof value.customRequest === "string" &&
    isGoalInputMode(value.customRequestInputMode)
  );
}

type GoalInputModeField =
  | "situationInputMode"
  | "purposeInputMode"
  | "customRequestInputMode";

function normalizeGoalInputMode(
  value: unknown,
  fieldName: GoalInputModeField,
): GoalInputMode {
  if (isGoalInputMode(value)) {
    return value;
  }

  console.warn(`[saju-question] normalized goal.${fieldName} to "preset".`);
  return "preset";
}

function normalizeGoalInfo(value: unknown): GoalInfo | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    typeof value.situation !== "string" ||
    typeof value.purpose !== "string" ||
    (value.style !== "balanced" &&
      value.style !== "direct" &&
      value.style !== "empathetic") ||
    typeof value.customRequest !== "string"
  ) {
    return null;
  }

  const goal: GoalInfo = {
    situation: value.situation,
    situationInputMode: normalizeGoalInputMode(
      value.situationInputMode,
      "situationInputMode",
    ),
    purpose: value.purpose,
    purposeInputMode: normalizeGoalInputMode(
      value.purposeInputMode,
      "purposeInputMode",
    ),
    style: value.style,
    customRequest: value.customRequest,
    customRequestInputMode: normalizeGoalInputMode(
      value.customRequestInputMode,
      "customRequestInputMode",
    ),
  };

  return isGoalInfo(goal) ? goal : null;
}

function parseForm(value: unknown): SajuQuestionFormData | null {
  if (!isRecord(value)) {
    return null;
  }

  const goal = normalizeGoalInfo(value.goal);

  if (
    !isAnalysisMode(value.mode) ||
    !isBirthProfile(value.me) ||
    !isBirthProfile(value.partner) ||
    !goal
  ) {
    return null;
  }

  return {
    mode: value.mode,
    me: value.me,
    partner: value.partner,
    goal,
  };
}

function isStreamEnabled(value: unknown): boolean {
  return value === true;
}

function extractQuestionContent(content: unknown): string {
  if (typeof content === "string") {
    return content.trim();
  }

  if (!Array.isArray(content)) {
    return "";
  }

  const textParts = content.flatMap((part) => {
    if (!isRecord(part)) {
      return [];
    }

    if (part.type === "text" && typeof part.text === "string") {
      return [part.text];
    }

    return [];
  });

  return textParts.join("\n").trim();
}

function extractQuestionFromCompletion(completion: unknown): string {
  if (!isRecord(completion) || !Array.isArray(completion.choices)) {
    return "";
  }

  const firstChoice = completion.choices[0];

  if (!isRecord(firstChoice) || !isRecord(firstChoice.message)) {
    return "";
  }

  return extractQuestionContent(firstChoice.message.content);
}

function extractDeltaContent(chunk: unknown): string {
  if (!isRecord(chunk) || !Array.isArray(chunk.choices)) {
    return "";
  }

  const firstChoice = chunk.choices[0];

  if (!isRecord(firstChoice) || !isRecord(firstChoice.delta)) {
    return "";
  }

  return extractQuestionContent(firstChoice.delta.content);
}

function toSSEEvent(data: unknown): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

function mapOpenAIError(error: unknown): { status: number; message: string } {
  if (error instanceof OpenAI.APIError) {
    const status = error.status ?? 500;

    if (status >= 400 && status < 500) {
      return {
        status,
        message:
          error.message || "요청값을 확인해 주세요. 질문문 생성 요청이 유효하지 않습니다.",
      };
    }

    return {
      status,
      message: error.message || "질문문 생성 중 OpenAI 서버 오류가 발생했습니다.",
    };
  }

  return {
    status: 500,
    message: "질문문 생성 중 서버 오류가 발생했습니다.",
  };
}

export async function POST(request: Request) {
  let parsedBody: GenerateQuestionRequestBody;

  try {
    parsedBody = (await request.json()) as GenerateQuestionRequestBody;
  } catch {
    return Response.json(
      { message: "잘못된 요청 본문입니다." },
      { status: 400 },
    );
  }

  if (!isRecord(parsedBody.form)) {
    return Response.json(
      { message: "요청 형식이 올바르지 않습니다." },
      { status: 400 },
    );
  }

  const form = parseForm(parsedBody.form);

  if (!form) {
    return Response.json(
      { message: "요청 형식이 올바르지 않습니다." },
      { status: 400 },
    );
  }

  if (!hasCoreRequiredFields(form)) {
    return Response.json(
      { message: "생년월일, 출생지, 현재 상황, 질문 목적을 먼저 입력해 주세요." },
      { status: 400 },
    );
  }

  const { systemPrompt, userPrompt } = buildSajuPrompt(form);
  const streamEnabled = isStreamEnabled(parsedBody.stream);

  try {
    const client = getOpenAIClient();
    const model = getDefaultOpenAIModel();
    const messages = [
      {
        role: "system" as const,
        content: systemPrompt,
      },
      {
        role: "user" as const,
        content: userPrompt,
      },
    ];

    if (streamEnabled) {
      const stream = await client.chat.completions.create({
        model,
        messages,
        stream: true,
      });
      const encoder = new TextEncoder();
      let fullQuestion = "";

      const readableStream = new ReadableStream<Uint8Array>({
        async start(controller) {
          try {
            controller.enqueue(encoder.encode(toSSEEvent({ type: "start" })));

            for await (const chunk of stream) {
              const delta = extractDeltaContent(chunk);

              if (!delta) {
                continue;
              }

              fullQuestion += delta;
              controller.enqueue(
                encoder.encode(toSSEEvent({ type: "delta", content: delta })),
              );
            }

            const question = fullQuestion.trim();

            if (!question) {
              throw new Error("생성된 질문문이 비어 있습니다. 다시 시도해 주세요.");
            }

            controller.enqueue(
              encoder.encode(toSSEEvent({ type: "done", question })),
            );
          } catch (error) {
            const { message } = mapOpenAIError(error);
            controller.enqueue(
              encoder.encode(toSSEEvent({ type: "error", message })),
            );
          } finally {
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
          }
        },
      });

      return new Response(readableStream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    }

    const completion = await client.chat.completions.create({
      model,
      messages,
    });
    const question = extractQuestionFromCompletion(completion);

    if (!question) {
      return Response.json(
        { message: "생성된 질문문이 비어 있습니다. 다시 시도해 주세요." },
        { status: 500 },
      );
    }

    return Response.json({ question });
  } catch (error) {
    console.error("[saju-question] generation failed", error);
    const { status, message } = mapOpenAIError(error);

    return Response.json({ message }, { status });
  }
}
