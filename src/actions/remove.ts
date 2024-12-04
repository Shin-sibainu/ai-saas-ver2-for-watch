"use server";

import { RemoveBackgroundState } from "@/types/actions";

export async function removeBackground(
  prevState: RemoveBackgroundState,
  formData: FormData
): Promise<RemoveBackgroundState> {
  const image = formData.get("image") as File;

  if (!image) {
    return {
      status: "error",
      error: "画像ファイルを選択してください。",
    };
  }

  try {
    const response = await fetch(
      `${process.env.BASE_URL}/api/remove-background`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to remove image");
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return {
      status: "success",
      originalImage: URL.createObjectURL(image),
      processedImage: data.imageUrl,
    };
  } catch (error) {
    return {
      status: "error",
      error:
        error instanceof Error ? error.message : "画像の生成に失敗しました。",
    };
  }
}
