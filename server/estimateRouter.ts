import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import nodemailer from "nodemailer";

// 見積もりフォームの入力スキーマ
const estimateInputSchema = z.object({
  workType: z.string().min(1, "工事内容を選択してください"),
  houseType: z.string().min(1, "建物の種類を選択してください"),
  area: z.string().min(1, "延床面積を選択してください"),
  timing: z.string().min(1, "ご希望の時期を選択してください"),
  name: z.string().min(1, "お名前を入力してください"),
  phone: z.string().min(1, "電話番号を入力してください"),
  email: z.string().optional().or(z.literal("")),
  address: z.string().min(1, "住所を入力してください"),
  budget: z.string().optional(),
  notes: z.string().optional(),
  contactMethod: z.string().optional(),
});

type EstimateInput = z.infer<typeof estimateInputSchema>;

// メール本文を生成
function buildEmailBody(data: EstimateInput): string {
  return `
【新規お見積もり依頼】有限会社ホシ造形 ホームページより

━━━━━━━━━━━━━━━━━━━━━━━━
■ 工事内容
━━━━━━━━━━━━━━━━━━━━━━━━
工事種別：${data.workType}
建物の種類：${data.houseType}
延床面積：${data.area}
ご希望時期：${data.timing}

━━━━━━━━━━━━━━━━━━━━━━━━
■ お客様情報
━━━━━━━━━━━━━━━━━━━━━━━━
お名前：${data.name}
電話番号：${data.phone}
メールアドレス：${data.email || "未記入"}
住所：${data.address}

━━━━━━━━━━━━━━━━━━━━━━━━
■ ご希望・備考
━━━━━━━━━━━━━━━━━━━━━━━━
ご予算：${data.budget || "未記入"}
ご連絡方法のご希望：${data.contactMethod || "未記入"}
メッセージ：
${data.notes || "なし"}

━━━━━━━━━━━━━━━━━━━━━━━━
このメールはホームページの見積もりフォームから自動送信されました。
有限会社ホシ造形 ホームページ
━━━━━━━━━━━━━━━━━━━━━━━━
`.trim();
}

// SMTP経由でメール送信
async function sendEstimateEmail(data: EstimateInput): Promise<boolean> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const toEmail = process.env.OWNER_EMAIL || "hoshi-k@agate.plala.or.jp";

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn("[Email] SMTP not configured, skipping email send");
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: `"有限会社ホシ造形 ホームページ" <${smtpUser}>`,
      to: toEmail,
      subject: `【見積もり依頼】${data.name} 様より（${data.workType}）`,
      text: buildEmailBody(data),
    });

    console.log(`[Email] Estimate email sent to ${toEmail}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send estimate email:", error);
    return false;
  }
}

export const estimateRouter = router({
  submit: publicProcedure
    .input(estimateInputSchema)
    .mutation(async ({ input }) => {
      // 1. Manusオーナー通知（プッシュ通知）
      const notificationContent = [
        `お名前：${input.name}`,
        `電話番号：${input.phone}`,
        `住所：${input.address}`,
        `工事内容：${input.workType}`,
        `建物：${input.houseType}（${input.area}）`,
        `ご希望時期：${input.timing}`,
        `ご予算：${input.budget || "未記入"}`,
        `連絡方法：${input.contactMethod || "未記入"}`,
        `メッセージ：${input.notes || "なし"}`,
      ].join("\n");

      await notifyOwner({
        title: `【新規見積もり依頼】${input.name} 様（${input.workType}）`,
        content: notificationContent,
      }).catch((err) => {
        console.warn("[Notify] Owner notification failed:", err);
      });

      // 2. メール送信（SMTP設定がある場合）
      await sendEstimateEmail(input);

      return {
        success: true,
        message: "お見積もりのご依頼を受け付けました。2営業日以内にご連絡いたします。",
      };
    }),
});
