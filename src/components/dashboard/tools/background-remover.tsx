/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

const BackgroundRemover = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        setProcessedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBackground = async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    try {
      // File オブジェクトを作成
      const response = await fetch(originalImage);
      const blob = await response.blob();
      const file = new File([blob], "image.png", { type: "image/png" });

      // FormData を作成
      const formData = new FormData();
      formData.append("image", file);

      const apiResponse = await fetch("/api/remove-background", {
        method: "POST",
        body: formData,
      });

      const data = await apiResponse.json();
      if (data.error) throw new Error(data.error);

      setProcessedImage(data.imageUrl);
      toast({
        title: "完了",
        description: "背景を削除しました",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "エラー",
        description: "背景の削除に失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;

    const link = document.createElement("a");
    link.href = processedImage;
    link.download = "background-removed.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <div className="space-y-2">
            <Label htmlFor="image">ファイルアップロード</Label>
            <Input
              ref={fileInputRef}
              name="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>
          <Button
            onClick={handleRemoveBackground}
            disabled={!originalImage || isProcessing}
          >
            {isProcessing ? "処理中..." : "背景を削除"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {originalImage && (
            <div className="space-y-2">
              <p className="text-sm font-medium">元の画像:</p>
              <img
                src={originalImage}
                alt="Original"
                className="w-full rounded-lg shadow"
              />
            </div>
          )}

          {processedImage && (
            <div className="space-y-2">
              <p className="text-sm font-medium">処理後の画像:</p>
              <img
                src={processedImage}
                alt="Processed"
                className="w-full rounded-lg shadow"
                style={{ background: "repeating-chedckered-pattern" }}
              />
              <Button
                onClick={handleDownload}
                variant="outline"
                className="w-full"
              >
                ダウンロード
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackgroundRemover;
