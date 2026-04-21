import { buildSajuPrompt } from "@/shared/lib/openai/build-saju-prompt";
import type {
  AnalysisMode,
  BirthProfile,
  GoalInfo,
  SajuQuestionFormData,
} from "@/shared/types/saju-question-form";

interface GenerateQuestionRequestBody {
  form?: unknown;
}

interface OpenAIErrorPayload {
  error?: {
    message?: string;
  };
}

interface OpenAICompletionChoice {
  message?: {
    content?: unknown;
  };
}

interface OpenAICompletionsPayload {
  choices?: OpenAICompletionChoice[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isAnalysisMode(value: unknown): value is AnalysisMode {
  return value === "self" || value === "compatibility";
}

function isBirthProfile(value: unknown): value is BirthProfile {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.name === "string" &&
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
    typeof value.purpose === "string" &&
    (value.style === "balanced" ||
      value.style === "direct" ||
      value.style === "empathetic") &&
    typeof value.customRequest === "string"
  );
}

function parseForm(value: unknown): SajuQuestionFormData | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    !isAnalysisMode(value.mode) ||
    !isBirthProfile(value.me) ||
    !isBirthProfile(value.partner) ||
    !isGoalInfo(value.goal)
  ) {
    return null;
  }

  return {
    mode: value.mode,
    me: value.me,
    partner: value.partner,
    goal: value.goal,
  };
}

function hasCoreRequiredFields(form: SajuQuestionFormData): boolean {
  if (!form.me.birthDate || !form.goal.situation || !form.goal.purpose) {
    return false;
  }

  if (form.mode === "compatibility" && !form.partner.birthDate) {
    return false;
  }

  return true;
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

function extractQuestionFromPayload(payload: unknown): string {
  if (!isRecord(payload) || !Array.isArray(payload.choices)) {
    return "";
  }

  const firstChoice = payload.choices[0];

  if (!isRecord(firstChoice) || !isRecord(firstChoice.message)) {
    return "";
  }

  return extractQuestionContent(firstChoice.message.content);
}

function getOpenAIConfig() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  return {
    apiKey,
    model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
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
      { message: "생년월일, 현재 상황, 질문 목적을 먼저 입력해 주세요." },
      { status: 400 },
    );
  }

  const { systemPrompt, userPrompt } = buildSajuPrompt(form);

  try {
    const { apiKey, model } = getOpenAIConfig();
    const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
      }),
    });
    const payload = (await openAIResponse
      .json()
      .catch(() => null)) as OpenAICompletionsPayload | OpenAIErrorPayload | null;

    if (!openAIResponse.ok) {
      const message =
        isRecord(payload) &&
        isRecord(payload.error) &&
        typeof payload.error.message === "string"
          ? payload.error.message
          : "질문문 생성 중 서버 오류가 발생했습니다.";

      return Response.json({ message }, { status: 500 });
    }

    const question = extractQuestionFromPayload(payload);

    if (!question) {
      return Response.json(
        { message: "생성된 질문문이 비어 있습니다. 다시 시도해 주세요." },
        { status: 500 },
      );
    }

    return Response.json({ question });
  } catch (error) {
    console.error("[saju-question] generation failed", error);

    return Response.json(
      { message: "질문문 생성 중 서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
