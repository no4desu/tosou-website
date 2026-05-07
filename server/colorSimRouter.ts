import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { generateImage } from "./_core/imageGeneration";
import { storagePut } from "./storage";

export const colorSimRouter = router({
  /**
   * 写真をアップロードしてS3に保存し、URLを返す
   */
  uploadPhoto: publicProcedure
    .input(
      z.object({
        base64: z.string(), // data:image/...;base64,... 形式
        mimeType: z.string().default("image/jpeg"),
      })
    )
    .mutation(async ({ input }) => {
      // base64データからBufferに変換
      const base64Data = input.base64.replace(/^data:[^;]+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const ext = input.mimeType.includes("png") ? "png" : "jpg";
      const key = `uploads/house-${Date.now()}.${ext}`;
      const { url } = await storagePut(key, buffer, input.mimeType);

      return { url };
    }),

  /**
   * アップロードした写真に対してAIで外壁・屋根の色を変更したシミュレーション画像を生成
   */
  simulate: publicProcedure
    .input(
      z.object({
        photoUrl: z.string().url(),
        wallColor: z.string(), // 例: "クリームホワイト (#F5F0E8)"
        roofColor: z.string(), // 例: "チャコールグレー (#3D3D3D)"
      })
    )
    .mutation(async ({ input }) => {
      const prompt = `外壁塗装のカラーシミュレーション。この住宅の外壁の色を「${input.wallColor}」に、屋根の色を「${input.roofColor}」に変更してください。建物の形状・構造・窓・ドア・植栽はそのままに、外壁と屋根の塗装色だけを変えてください。リアルで自然な仕上がりにしてください。`;

      const result = await generateImage({
        prompt,
        originalImages: [
          {
            url: input.photoUrl,
            mimeType: "image/jpeg",
          },
        ],
      });

      return { url: result.url };
    }),
});
