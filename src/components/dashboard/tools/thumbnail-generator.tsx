/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
// components/tools/thumbnail-generator.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Download, Image as ImageIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// import Image from "next/image";

export default function ThumbnailGenerator() {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("認証が分かるようにしたいです。");
  const [title, setTitle] = useState("Clerkで認証機能を実装してみよう");

  const [generatedImage, setGenerateImage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/generate-thumbnail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          prompt,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setGenerateImage(data.imageUrl);
      toast({
        title: "生成完了",
        description: "サムネイルの生成が完了しました。",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "エラー",
        description: "サムネイルの生成に失敗しました。",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">タイトル</Label>
            <Input
              id="title"
              placeholder="ブログのタイトルを入力"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prompt">プロンプト</Label>
            <Textarea
              id="prompt"
              placeholder="画像の詳細な説明を入力（例：明るい色調、モダンなデザイン、シンプルなレイアウト）"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              className="min-h-[100px]"
            />
          </div>
          <Button disabled={loading} type="submit" className="w-full">
            <ImageIcon className="mr-2 h-4 w-4" />
            {loading ? "生成中..." : "サムネイルを生成"}
          </Button>
        </form>
      </div>

      {generatedImage && (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg border bg-background">
            <div className="aspect-video relative">
              <img
                src={generatedImage}
                alt="Generated thumbnail"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          <Button
            // onClick={handleDownload}
            variant="secondary"
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            ダウンロード
          </Button>
        </div>
      )}
    </div>
  );
}
