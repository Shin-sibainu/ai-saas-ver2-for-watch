// app/(dashboard)/tools/[tool]/page.tsx
import { notFound } from "next/navigation";
import ImageGenerator from "@/components/dashboard/tools/image-generator";
import { PageHeader } from "@/components/dashboard/page-header";
import { PageContainer } from "@/components/dashboard/page-container";
// import ThumbnailGenerator from "@/components/tools/thumbnail-generator";
// import BackgroundRemover from "@/components/tools/background-remover";
// import ImageOptimizer from "@/components/tools/image-optimizer";

// ツールの定義
const tools = {
  "image-generator": {
    title: "画像生成",
    description: "AIを使用してお好みの画像を生成してみよう",
    component: ImageGenerator,
  },
  "remove-bg": {
    title: "背景削除",
    description: "画像から背景を自動で削除",
    component: ImageGenerator,
  },
  optimize: {
    title: "画像最適化",
    description: "画像を最適化してサイズを縮小",
    component: ImageGenerator,
  },
} as const;

// 型の定義
type ToolType = keyof typeof tools;

export default async function ToolPage({
  params,
}: {
  params: Promise<{ tool: string }>;
}) {
  // paramsをawaitする
  const toolType = (await params).tool as ToolType;
  const tool = tools[toolType];

  if (!tool) {
    notFound();
  }

  const ToolComponent = tool.component;

  return (
    <PageContainer>
      <PageHeader title={tool.title} description={tool.description} />
      <div className="max-w-2xl">
        <ToolComponent />
      </div>
    </PageContainer>
  );
}
