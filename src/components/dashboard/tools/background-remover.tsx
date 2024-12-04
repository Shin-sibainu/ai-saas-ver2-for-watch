/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useActionState, useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { RemoveBackgroundState } from "@/types/actions";
import { removeBackground } from "@/actions/remove";
import { LoadingSpinner } from "./submit-button";
import { Layers } from "lucide-react";

const initialState: RemoveBackgroundState = {
  status: "idle",
};

const BackgroundRemover = () => {
  const [state, formAction, pending] = useActionState(
    removeBackground,
    initialState
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDownload = () => {
    if (!state.processedImage) return;

    try {
      const base64Data = state.processedImage.split(",")[1];
      const blob = new Blob([Buffer.from(base64Data, "base64")], {
        type: "image/png",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "background-removed.png";
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "完了",
        description: "画像のダウンロードが完了しました",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "エラー",
        description: "ダウンロードに失敗しました",
        variant: "destructive",
      });
    }
  };

  // コンポーネントがアンマウントされる時にURLを解放
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <form action={formAction} className="flex flex-col gap-2">
          <div className="space-y-2">
            <Label htmlFor="image">ファイルアップロード</Label>
            <Input
              ref={fileInputRef}
              onChange={handleFileChange}
              name="image"
              type="file"
              accept="image/*"
              className="w-full"
              required
            />
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? (
              <LoadingSpinner />
            ) : (
              <>
                <Layers className="mr-2 h-4 w-4" />
                背景を削除
              </>
            )}
          </Button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {previewUrl && (
            <div className="space-y-2">
              <p className="text-sm font-medium">元の画像:</p>
              <img
                src={previewUrl}
                alt="Original"
                className="w-full rounded-lg shadow"
              />
            </div>
          )}

          {state.processedImage && (
            <div className="space-y-2">
              <p className="text-sm font-medium">処理後の画像:</p>
              <img
                src={state.processedImage}
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
