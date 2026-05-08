/*
 * Design: Contemporary Craft
 * Estimate page: 3-step form for quote request
 */
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

type FormData = {
  // Step 1
  workType: string[];
  houseType: string;
  area: string;
  // Step 2
  name: string;
  phone: string;
  email: string;
  address: string;
  // Step 3
  timing: string;
  budget: string;
  notes: string;
};

const initialForm: FormData = {
  workType: [],
  houseType: "",
  area: "",
  name: "",
  phone: "",
  email: "",
  address: "",
  timing: "",
  budget: "",
  notes: "",
};

export default function Estimate() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = trpc.estimate.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("お見積もりのご依頼を受け付けました。2営業日以内にご連絡いたします。");
    },
    onError: (err) => {
      toast.error("送信に失敗しました。お電話にてご連絡ください。");
      console.error("[Estimate] Submit error:", err);
    },
  });

  const toggleWorkType = (type: string) => {
    setForm((prev) => ({
      ...prev,
      workType: prev.workType.includes(type)
        ? prev.workType.filter((t) => t !== type)
        : [...prev.workType, type],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate({
      workType: form.workType.join("・") || "未選択",
      houseType: form.houseType,
      area: form.area,
      timing: form.timing || "未定",
      name: form.name,
      phone: form.phone,
      email: form.email,
      address: form.address,
      budget: form.budget,
      notes: form.notes,
    });
  };

  const canProceedStep1 = form.workType.length > 0 && form.houseType && form.area;
  const canProceedStep2 = form.name && form.phone && form.address;

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center max-w-md px-4">
            <div className="flex justify-center mb-6">
              <CheckCircle size={64} className="text-primary" />
            </div>
            <h2 className="text-3xl font-black text-foreground mb-4" style={{ fontFamily: 'Zen Kaku Gothic New, sans-serif' }}>
              ご依頼ありがとうございます
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed mb-8" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
              お見積もりのご依頼を受け付けました。<br />
              2営業日以内に担当者よりご連絡いたします。<br />
              お急ぎの場合はお電話にてご連絡ください。
            </p>
            <a href="tel:0241-67-3607" className="btn-cta inline-block text-base">
              0241-67-3607
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="py-12" style={{ backgroundColor: '#2D2D2D' }}>
        <div className="container text-center">
          <div className="text-primary text-sm font-bold mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>FREE ESTIMATE</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Zen Kaku Gothic New, sans-serif' }}>
            無料見積もり依頼
          </h1>
          <p className="text-gray-400 text-base" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
            3ステップで簡単入力。現地調査・お見積もりは完全無料です。
          </p>
        </div>
      </section>

      {/* Step indicator */}
      <section className="bg-white border-b border-gray-100 py-4">
        <div className="container">
          <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
            {[
              { n: 1, label: "工事内容" },
              { n: 2, label: "お客様情報" },
              { n: 3, label: "ご希望・備考" },
            ].map((s, i) => (
              <div key={s.n} className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      step >= s.n ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
                    }`}
                    style={{ fontFamily: 'Oswald, sans-serif' }}
                  >
                    {step > s.n ? <CheckCircle size={16} /> : s.n}
                  </div>
                  <span
                    className={`text-sm font-medium hidden sm:block ${step >= s.n ? "text-foreground" : "text-muted-foreground"}`}
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    {s.label}
                  </span>
                </div>
                {i < 2 && <ChevronRight size={16} className="text-gray-300" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 flex-1" style={{ backgroundColor: '#F7F7F5' }}>
        <div className="container max-w-2xl">
          <form onSubmit={handleSubmit}>
            {/* Step 1 */}
            {step === 1 && (
              <div className="bg-white rounded-sm shadow-sm p-6 md:p-8">
                <h2 className="text-2xl font-black text-foreground mb-6" style={{ fontFamily: 'Zen Kaku Gothic New, sans-serif' }}>
                  工事内容を教えてください
                </h2>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-foreground mb-3" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
                    ご希望の工事（複数選択可）<span className="text-primary ml-1">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["外壁塗装", "屋根塗装", "外壁＋屋根セット", "防水工事", "付帯部塗装", "その他"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleWorkType(type)}
                        className={`py-3 px-4 rounded-sm border-2 text-sm font-medium transition-all text-left ${
                          form.workType.includes(type)
                            ? "border-primary bg-orange-50 text-primary"
                            : "border-gray-200 text-foreground hover:border-gray-300"
                        }`}
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        {form.workType.includes(type) && <span className="mr-1">✓</span>}
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-foreground mb-3" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
                    建物の種類<span className="text-primary ml-1">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {["一戸建て", "マンション", "アパート"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, houseType: type }))}
                        className={`py-3 px-4 rounded-sm border-2 text-sm font-medium transition-all ${
                          form.houseType === type
                            ? "border-primary bg-orange-50 text-primary"
                            : "border-gray-200 text-foreground hover:border-gray-300"
                        }`}
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        {form.houseType === type && "✓ "}
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-bold text-foreground mb-3" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
                    建物の延床面積（目安）<span className="text-primary ml-1">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["〜80㎡（2LDK程度）", "80〜120㎡（3LDK程度）", "120〜160㎡（4LDK程度）", "160㎡以上", "わからない"].map((area) => (
                      <button
                        key={area}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, area }))}
                        className={`py-3 px-4 rounded-sm border-2 text-sm font-medium transition-all text-left ${
                          form.area === area
                            ? "border-primary bg-orange-50 text-primary"
                            : "border-gray-200 text-foreground hover:border-gray-300"
                        }`}
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        {form.area === area && "✓ "}
                        {area}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!canProceedStep1}
                  className="btn-cta w-full text-base disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  次へ進む
                </button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="bg-white rounded-sm shadow-sm p-6 md:p-8">
                <h2 className="text-2xl font-black text-foreground mb-6" style={{ fontFamily: 'Zen Kaku Gothic New, sans-serif' }}>
                  お客様情報を入力してください
                </h2>

                <div className="flex flex-col gap-5 mb-8">
                  {[
                    { key: "name", label: "お名前", placeholder: "山田 太郎", required: true, type: "text" },
                    { key: "phone", label: "電話番号", placeholder: "0241-67-3607", required: true, type: "tel" },
                    { key: "email", label: "メールアドレス", placeholder: "example@email.com", required: false, type: "email" },
                    { key: "address", label: "施工場所の住所", placeholder: "福島県南会津郡下郷町○○", required: true, type: "text" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-bold text-foreground mb-2" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
                        {field.label}
                        {field.required && <span className="text-primary ml-1">*</span>}
                      </label>
                      <input
                        type={field.type}
                        value={form[field.key as keyof FormData] as string}
                        onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full border-2 border-gray-200 rounded-sm px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 border-2 border-gray-200 text-foreground font-bold rounded-sm hover:border-gray-300 transition-colors text-sm"
                    style={{ fontFamily: 'Zen Kaku Gothic New, sans-serif' }}
                  >
                    戻る
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!canProceedStep2}
                    className="flex-[2] btn-cta text-base disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    次へ進む
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="bg-white rounded-sm shadow-sm p-6 md:p-8">
                <h2 className="text-2xl font-black text-foreground mb-6" style={{ fontFamily: 'Zen Kaku Gothic New, sans-serif' }}>
                  ご希望・備考を教えてください
                </h2>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-foreground mb-3" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
                    施工のご希望時期
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["できるだけ早く", "1〜3ヶ月以内", "3〜6ヶ月以内", "半年以上先", "まずは見積もりだけ"].map((timing) => (
                      <button
                        key={timing}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, timing }))}
                        className={`py-3 px-4 rounded-sm border-2 text-sm font-medium transition-all text-left ${
                          form.timing === timing
                            ? "border-primary bg-orange-50 text-primary"
                            : "border-gray-200 text-foreground hover:border-gray-300"
                        }`}
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        {form.timing === timing && "✓ "}
                        {timing}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-foreground mb-3" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
                    ご予算の目安
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["〜50万円", "50〜80万円", "80〜120万円", "120万円以上", "わからない"].map((budget) => (
                      <button
                        key={budget}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, budget }))}
                        className={`py-3 px-4 rounded-sm border-2 text-sm font-medium transition-all text-left ${
                          form.budget === budget
                            ? "border-primary bg-orange-50 text-primary"
                            : "border-gray-200 text-foreground hover:border-gray-300"
                        }`}
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        {form.budget === budget && "✓ "}
                        {budget}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-bold text-foreground mb-2" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
                    その他ご要望・ご質問
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="気になる点、ご要望などがあればお気軽にご記入ください。"
                    rows={4}
                    className="w-full border-2 border-gray-200 rounded-sm px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors resize-none"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  />
                </div>

                {/* Confirmation summary */}
                <div className="bg-gray-50 rounded-sm p-4 mb-6 text-sm" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
                  <div className="font-bold text-foreground mb-2">入力内容の確認</div>
                  <div className="text-muted-foreground space-y-1">
                    <div>工事内容：{form.workType.join("、")}</div>
                    <div>建物：{form.houseType}（{form.area}）</div>
                    <div>お名前：{form.name}</div>
                    <div>電話番号：{form.phone}</div>
                    <div>住所：{form.address}</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 border-2 border-gray-200 text-foreground font-bold rounded-sm hover:border-gray-300 transition-colors text-sm"
                    style={{ fontFamily: 'Zen Kaku Gothic New, sans-serif' }}
                  >
                    戻る
                  </button>
                  <button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="flex-[2] btn-cta text-base disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitMutation.isPending ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        送信中...
                      </>
                    ) : (
                      "見積もりを依頼する（無料）"
                    )}
                  </button>
                </div>
                <p className="text-center text-muted-foreground text-xs mt-3" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
                  ご入力いただいた情報は見積もり以外の目的には使用しません。
                </p>
              </div>
            )}
          </form>
        </div>
      </section>

      <Footer />

      {/* Fixed LINE button */}
      <a
        href="https://line.me/R/"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed-line-btn"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.105.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
        </svg>
        LINEで相談
      </a>
    </div>
  );
}
