// app/api/generate-thumbnail/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";
import sharp from "sharp";

//https://platform.stability.ai/docs/api-reference

export async function POST(req: Request) {
  try {
    const { keyword } = await req.json();

    const fullPrompt = `Create a simple and modern image of ${keyword}. Style: clean minimal design, soft gradient background, centered composition, high contrast, generous whitespace. Focus on simple recognizable elements, no text. Make it visually appealing and easy to understand`;

    // FormDataオブジェクトの作成
    const formData = new FormData();
    formData.append("prompt", fullPrompt);
    formData.append("output_format", "png");
    formData.append("width", "1280");
    formData.append("height", "720");
    formData.append("steps", "30");
    formData.append("cfg_scale", "7");

    const response = await axios.postForm(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: "image/*",
        },
        responseType: "arraybuffer",
      }
    );

    if (response.status !== 200) {
      throw new Error(`API error: ${response.status}`);
    }

    // 画像の最適化
    const optimizedImage = await sharp(response.data)
      .resize(1280, 720, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .png({ quality: 80, compressionLevel: 9 })
      .toBuffer();

    // Base64エンコードしてクライアントに返す
    const base64Image = optimizedImage.toString("base64");
    const imageUrl = `data:image/png;base64,${base64Image}`;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
