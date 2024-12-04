import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImageIcon, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export const LoadingDots = () => {
  return (
    <span className="inline-flex items-center">
      <span className="animate-bounce mx-0.5 h-1 w-1 rounded-full bg-white"></span>
      <span
        className="animate-bounce mx-0.5 h-1 w-1 rounded-full bg-white"
        style={{ animationDelay: "0.2s" }}
      ></span>
      <span
        className="animate-bounce mx-0.5 h-1 w-1 rounded-full bg-white"
        style={{ animationDelay: "0.4s" }}
      ></span>
    </span>
  );
};

export const LoadingSpinner = () => {
  return (
    <div className="inline-flex items-center">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      <span>生成中</span>
      <LoadingDots />
    </div>
  );
};

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <div className="relative">
      <Button
        type="submit"
        className={cn(
          "w-full min-h-[2.5rem] transition-all duration-200",
          pending && "bg-primary/80"
        )}
        disabled={pending}
      >
        {pending ? (
          <LoadingSpinner />
        ) : (
          <>
            <ImageIcon className="mr-2 h-4 w-4" />
            画像を生成
          </>
        )}
      </Button>

      {/* オプション: ホバー時のツールチップ */}
      {pending && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
          AIが画像を生成中...
        </div>
      )}
    </div>
  );
};

export default SubmitButton;
