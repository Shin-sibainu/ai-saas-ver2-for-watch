/* eslint-disable @next/next/no-img-element */
// https://platform.stability.ai/docs/api-reference
// https://platform.stability.ai/account/credits
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Image as ImageIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

export default function ImageGenerator() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); // 進行状況を管理
  const [keyword, setKeyword] = useState("");
  const [generatedImage, setGenerateImage] = useState("");

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 5;
      });
    }, 200);

    return () => clearInterval(interval);
  };

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
    simulateProgress(); // プログレス開始

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
      setProgress(100); // 完了時に100%に
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
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 500); // プログレスバーを少し表示してから消す
    }
  };

  const handleDownload = () => {
    try {
      const base64Data = generatedImage.split(",")[1];
      const blob = new Blob([Buffer.from(base64Data, "base64")], {
        type: "image/png",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${keyword}.png`; // ファイル名にキーワードを使用
      document.body.appendChild(link);
      link.click();

      // 一時的なリンクを削除
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "ダウンロード完了",
        description: "画像のダウンロードが完了しました。",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "エラー",
        description: "ダウンロードに失敗しました。",
        variant: "destructive",
      });
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
            {loading ? "生成中..." : "画像を生成"}
          </Button>
        </form>

        {/* ローディング時のプログレスバー */}
        {loading && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full h-2" />
            <p className="text-sm text-muted-foreground text-center">
              画像を生成中です... {progress}%
            </p>
          </div>
        )}
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
          <Button
            onClick={handleDownload}
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
