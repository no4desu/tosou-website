import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// notifyOwnerをモック
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

// nodemailerをモック（SMTP未設定環境）
vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn().mockReturnValue({
      sendMail: vi.fn().mockResolvedValue({ messageId: "test-id" }),
    }),
  },
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

const validInput = {
  workType: "外壁塗装",
  houseType: "一戸建て",
  area: "80〜120㎡（3LDK程度）",
  timing: "1〜3ヶ月以内",
  name: "テスト 太郎",
  phone: "0241-67-3607",
  email: "test@example.com",
  address: "福島県南会津郡下郷町",
  budget: "50〜80万円",
  notes: "テストメッセージ",
  contactMethod: "電話",
};

describe("estimate.submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("正常な入力でsuccessを返す", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.estimate.submit(validInput);
    expect(result.success).toBe(true);
    expect(result.message).toContain("受け付けました");
  });

  it("必須項目が空の場合はエラーを返す", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.estimate.submit({ ...validInput, name: "" })
    ).rejects.toThrow();
  });

  it("電話番号が空の場合はエラーを返す", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.estimate.submit({ ...validInput, phone: "" })
    ).rejects.toThrow();
  });
});
