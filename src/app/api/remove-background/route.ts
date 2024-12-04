// app/api/generate-thumbnail/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";
import sharp from "sharp";

//https://platform.stability.ai/docs/api-reference

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        {
          error: "No Image Provided",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 入力画像の最適化
    const optimizedInput = await sharp(buffer)
      .resize(1280, 720, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .toBuffer();

    const apiFormData = new FormData();
    apiFormData.append("image", optimizedInput, {
      filename: "image.png",
      contentType: "image/png",
    });
    apiFormData.append("output_format", "png");

    const response = await axios.post(
      "https://api.stability.ai/v2beta/stable-image/edit/remove-background",
      apiFormData,
      {
        headers: {
          ...apiFormData.getHeaders(),
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: "image/*",
        },
        responseType: "arraybuffer",
      }
    );

    if (response.status !== 200) {
      throw new Error(`API error: ${response.status}`);
    }

    // レスポンス画像の最適化
    const optimizedOutput = await sharp(response.data)
      .resize(1280, 720, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .png({ quality: 80, compressionLevel: 9 })
      .toBuffer();

    // Base64エンコード
    const base64Image = optimizedOutput.toString("base64");
    const resultImageUrl = `data:image/png;base64,${base64Image}`;

    return NextResponse.json({ imageUrl: resultImageUrl });
  } catch (error) {
    console.error("Error removing background:", error);
    return NextResponse.json(
      { error: "Failed to remove background" },
      { status: 500 }
    );
  }
}
