/* eslint-disable @next/next/no-img-element */
// https://platform.stability.ai/docs/api-reference
// https://platform.stability.ai/account/credits
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
// import { toast } from "@/hooks/use-toast";
import { generateImage } from "@/actions/image";
import { useActionState } from "react";
import { GenerateImageState } from "@/types/actions";
import { toast } from "@/hooks/use-toast";
import SubmitButton from "./submit-button";

const initialState: GenerateImageState = {
  status: "idle",
};

export default function ImageGenerator() {
  const [state, formAction] = useActionState(generateImage, initialState);

  const handleDownload = () => {
    if (!state.imageUrl) {
      return;
    }

    try {
      const base64Data = state.imageUrl.split(",")[1];
      const blob = new Blob([Buffer.from(base64Data, "base64")], {
        type: "image/png",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${state.keyword}.png`; // ファイル名にキーワードを使用
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
        <form
          action={async (formData) => {
            event?.preventDefault();
            formAction(formData);
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="keyword">キーワード</Label>
            <Input
              id="keyword"
              name="keyword"
              placeholder="作成したい画像のキーワードを入力（例：海、山、都会、自然など）"
              required
            />
          </div>
          {/* submit button */}
          <SubmitButton />
        </form>
      </div>

      {/* image preview */}
      {state.imageUrl && state.status !== "loading" && (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg border bg-background">
            <div className="aspect-video relative">
              <img
                src={state.imageUrl}
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
