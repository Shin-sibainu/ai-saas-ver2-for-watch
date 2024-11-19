export type GenerateImageState = {
  imageUrl?: string;
  error?: string;
  status: "idle" | "loading" | "error" | "success";
  keyword?: string;
};
