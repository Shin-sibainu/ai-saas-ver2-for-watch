/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Image as ImageIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function ImageGenerator() {
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [generatedImage, setGenerateImage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) {
      toast({
        title: "入力エラー",
        description: "キーワードを入力してください。",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/generate-thumbnail", {
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

      setGenerateImage(data.imageUrl);
      toast({
        title: "生成完了",
        description: "画像の生成が完了しました。",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "エラー",
        description: "画像の生成に失敗しました。",
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
            <Label htmlFor="title">キーワード</Label>
            <Input
              id="title"
              placeholder="作成したい画像のキーワードを入力（例：海、山、都会、自然など）"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              disabled={loading}
            />
          </div>
          <Button disabled={loading} type="submit" className="w-full">
            <ImageIcon className="mr-2 h-4 w-4" />
            {loading ? "生成中..." : "画像を作成"}
          </Button>
        </form>
      </div>

      {generatedImage && (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg border bg-background">
            <div className="aspect-video relative">
              <img
                src={generatedImage}
                alt="Generated image"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          <Button variant="secondary" className="w-full">
            <Download className="mr-2 h-4 w-4" />
            ダウンロード
          </Button>
        </div>
      )}
    </div>
  );
}
