// app/(dashboard)/tools/[tool]/page.tsx
import { notFound } from "next/navigation";
import ThumbnailGenerator from "@/components/dashboard/tools/thumbnail-generator";
// import ThumbnailGenerator from "@/components/tools/thumbnail-generator";
// import BackgroundRemover from "@/components/tools/background-remover";
// import ImageOptimizer from "@/components/tools/image-optimizer";

// ツールの定義
const tools = {
  thumbnail: {
    title: "サムネイル生成",
    description: "AIを使用してブログやSNS向けのサムネイルを生成",
    component: ThumbnailGenerator,
  },
  "remove-bg": {
    title: "背景削除",
    description: "画像から背景を自動で削除",
    component: ThumbnailGenerator,
  },
  optimize: {
    title: "画像最適化",
    description: "画像を最適化してサイズを縮小",
    component: ThumbnailGenerator,
  },
} as const;

// 型の定義
type ToolType = keyof typeof tools;

interface ToolPageProps {
  params: {
    tool: string;
  };
}

export default function ToolPage({ params }: ToolPageProps) {
  // ツールの存在チェック
  const tool = tools[params.tool as ToolType];
  if (!tool) {
    notFound();
  }

  const ToolComponent = tool.component;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">{tool.title}</h2>
          <p className="text-muted-foreground">{tool.description}</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <ToolComponent />
      </div>
    </div>
  );
}
