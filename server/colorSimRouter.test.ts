import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock the imageGeneration and storage modules
vi.mock("./_core/imageGeneration", () => ({
  generateImage: vi.fn().mockResolvedValue({ url: "https://cdn.example.com/generated/test.png" }),
}));

vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ key: "uploads/house-test.jpg", url: "https://cdn.example.com/uploads/house-test.jpg" }),
}));

import { colorSimRouter } from "./colorSimRouter";
import { generateImage } from "./_core/imageGeneration";
import { storagePut } from "./storage";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("colorSimRouter.uploadPhoto", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("base64画像をS3にアップロードしてURLを返す", async () => {
    const ctx = createPublicContext();
    const caller = colorSimRouter.createCaller(ctx);

    // 1x1 pixel PNG in base64
    const base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

    const result = await caller.uploadPhoto({ base64, mimeType: "image/png" });

    expect(storagePut).toHaveBeenCalledOnce();
    expect(result.url).toBe("https://cdn.example.com/uploads/house-test.jpg");
  });

  it("base64プレフィックスなしでも処理できる", async () => {
    const ctx = createPublicContext();
    const caller = colorSimRouter.createCaller(ctx);

    const base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

    const result = await caller.uploadPhoto({ base64, mimeType: "image/png" });

    expect(storagePut).toHaveBeenCalledOnce();
    expect(result.url).toBeDefined();
  });
});

describe("colorSimRouter.simulate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("外壁・屋根の色指定でAI画像生成を呼び出し結果URLを返す", async () => {
    const ctx = createPublicContext();
    const caller = colorSimRouter.createCaller(ctx);

    const result = await caller.simulate({
      photoUrl: "https://cdn.example.com/uploads/house-test.jpg",
      wallColor: "クリームホワイト (#F5F0E8)",
      roofColor: "チャコールブラック (#2D2D2D)",
    });

    expect(generateImage).toHaveBeenCalledOnce();
    const callArgs = vi.mocked(generateImage).mock.calls[0][0];
    expect(callArgs.prompt).toContain("クリームホワイト");
    expect(callArgs.prompt).toContain("チャコールブラック");
    expect(callArgs.originalImages).toHaveLength(1);
    expect(callArgs.originalImages![0].url).toBe("https://cdn.example.com/uploads/house-test.jpg");
    expect(result.url).toBe("https://cdn.example.com/generated/test.png");
  });

  it("無効なURLはバリデーションエラーになる", async () => {
    const ctx = createPublicContext();
    const caller = colorSimRouter.createCaller(ctx);

    await expect(
      caller.simulate({
        photoUrl: "not-a-valid-url",
        wallColor: "クリームホワイト (#F5F0E8)",
        roofColor: "チャコールブラック (#2D2D2D)",
      })
    ).rejects.toThrow();
  });
});
