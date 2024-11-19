"use server";

import { GenerateImageState } from "@/types/actions";

export async function generateImage(
  state: GenerateImageState,
  formData: FormData
): Promise<GenerateImageState> {
  const keyword = formData.get("keyword");

  if (!keyword || typeof keyword !== "string") {
    return {
      status: "error",
      error: "キーワードを入力してください。",
    };
  }

  try {
    const response = await fetch(`${process.env.BASE_URL}/api/generate-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ keyword }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate image");
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return {
      status: "success",
      imageUrl: data.imageUrl,
      keyword: keyword,
    };
  } catch (error) {
    return {
      status: "error",
      error:
        error instanceof Error ? error.message : "画像の生成に失敗しました。",
    };
  }
}
