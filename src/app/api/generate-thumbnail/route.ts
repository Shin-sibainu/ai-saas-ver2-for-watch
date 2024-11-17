// app/api/generate-thumbnail/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";

//https://platform.stability.ai/docs/api-reference

export async function POST(req: Request) {
  try {
    const { title } = await req.json();

    const fullPrompt = `Create a simple and modern thumbnail representing "${title}". Style: minimal design with single centered element, soft gradient background, clean composition, high contrast, generous whitespace. Must be instantly recognizable, no text, no people, no complex patterns. Focus on basic geometric shapes and iconic symbols with subtle shadows. Perfect for quick visual understanding`;

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

    // Base64エンコードしてクライアントに返す
    const base64Image = Buffer.from(response.data).toString("base64");
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
