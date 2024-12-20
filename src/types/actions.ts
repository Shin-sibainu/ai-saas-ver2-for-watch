export type GenerateImageState = {
  imageUrl?: string;
  error?: string;
  status: "idle" | "loading" | "error" | "success";
  keyword?: string;
};

export type RemoveBackgroundState = {
  originalImage?: string;
  processedImage?: string;
  error?: string;
  status: "idle" | "loading" | "error" | "success";
};
