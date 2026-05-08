/**
 * AIカラーシミュレーションページ
 * - 写真アップロード → 外壁・屋根の色を選択 → AIでシミュレーション画像を生成
 */
import { useState, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Upload, Loader2, RefreshCw, Download, ChevronRight, ImageIcon, Palette, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const WALL_COLORS = [
  { name: "クリームホワイト", hex: "#F5F0E8", label: "上品な白系" },
  { name: "ライトベージュ", hex: "#E8DCC8", label: "温かみのある" },
  { name: "サンドベージュ", hex: "#D4B896", label: "ナチュラル系" },
  { name: "テラコッタ", hex: "#C4714A", label: "個性的な赤系" },
  { name: "オリーブグリーン", hex: "#7A8C5E", label: "自然な緑系" },
  { name: "スレートブルー", hex: "#6B7FA3", label: "落ち着いた青系" },
  { name: "ライトグレー", hex: "#C8C8C8", label: "モダンな灰系" },
  { name: "チャコールグレー", hex: "#5A5A5A", label: "スタイリッシュ" },
  { name: "ディープネイビー", hex: "#2C3E6B", label: "高級感のある紺" },
  { name: "ウォームブラウン", hex: "#8B6347", label: "落ち着いた茶系" },
  { name: "ピュアホワイト", hex: "#FAFAFA", label: "清潔感のある白" },
  { name: "アイボリー", hex: "#FFFFF0", label: "やさしい白系" },
];

const ROOF_COLORS = [
  { name: "チャコールブラック", hex: "#2D2D2D", label: "引き締まる黒系" },
  { name: "ダークグレー", hex: "#4A4A4A", label: "重厚感のある灰" },
  { name: "スレートグレー", hex: "#6B6B6B", label: "定番の灰系" },
  { name: "ブルーグレー", hex: "#5B7A8C", label: "爽やかな青灰" },
  { name: "ブリックレッド", hex: "#8B3A3A", label: "伝統的な赤茶" },
  { name: "ダークブラウン", hex: "#4A2E1A", label: "落ち着いた茶系" },
  { name: "フォレストグリーン", hex: "#2D4A2D", label: "自然な濃緑" },
  { name: "ネイビーブルー", hex: "#1E2D5C", label: "高級感のある紺" },
  { name: "テラコッタ", hex: "#A0522D", label: "温かみのある赤" },
  { name: "シルバーグレー", hex: "#9E9E9E", label: "モダンな銀系" },
  { name: "ブラック", hex: "#1A1A1A", label: "シックな黒" },
  { name: "ミッドナイトブルー", hex: "#191970", label: "深みのある青" },
];

type Step = "upload" | "select" | "result";
type WallColor = typeof WALL_COLORS[0];
type RoofColor = typeof ROOF_COLORS[0];

export default function ColorSimulation() {
  const [step, setStep] = useState<Step>("upload");
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [selectedWall, setSelectedWall] = useState<WallColor>(WALL_COLORS[0]);
  const [selectedRoof, setSelectedRoof] = useState<RoofColor>(ROOF_COLORS[0]);
  const [activeTab, setActiveTab] = useState<"wall" | "roof">("wall");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = trpc.colorSim.uploadPhoto.useMutation();
  const simulateMutation = trpc.colorSim.simulate.useMutation();

  const handleFileChange = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("画像ファイルを選択してください");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("ファイルサイズは10MB以下にしてください");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewDataUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    const base64Reader = new FileReader();
    base64Reader.onload = async (e) => {
      try {
        const base64 = e.target?.result as string;
        const result = await uploadMutation.mutateAsync({ base64, mimeType: file.type });
        setUploadedPhotoUrl(result.url);
        setStep("select");
        toast.success("写真のアップロードが完了しました");
      } catch {
        toast.error("アップロードに失敗しました。もう一度お試しください。");
      }
    };
    base64Reader.readAsDataURL(file);
  }, [uploadMutation]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  }, [handleFileChange]);

  const handleSimulate = async () => {
    if (!uploadedPhotoUrl) return;
    setStep("result");
    setResultUrl(null);
    try {
      const result = await simulateMutation.mutateAsync({
        photoUrl: uploadedPhotoUrl,
        wallColor: `${selectedWall.name} (${selectedWall.hex})`,
        roofColor: `${selectedRoof.name} (${selectedRoof.hex})`,
      });
      setResultUrl(result.url ?? null);
    } catch {
      toast.error("シミュレーションに失敗しました。もう一度お試しください。");
      setStep("select");
    }
  };

  const handleReset = () => {
    setStep("upload");
    setUploadedPhotoUrl(null);
    setPreviewDataUrl(null);
    setResultUrl(null);
    setSelectedWall(WALL_COLORS[0]);
    setSelectedRoof(ROOF_COLORS[0]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F5]">
      <Navbar />

      {/* ページヘッダー */}
      <section className="bg-white border-b border-gray-100 py-10">
        <div className="container max-w-4xl">
          <div className="text-primary text-sm font-bold mb-2" style={{ fontFamily: "Oswald, sans-serif" }}>
            AI COLOR SIMULATION
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-3" style={{ fontFamily: "Zen Kaku Gothic New, sans-serif" }}>
            AIカラーシミュレーション
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed" style={{ fontFamily: "Noto Sans JP, sans-serif" }}>
            ご自宅の写真をアップロードするだけで、AIが外壁・屋根の色を変えたシミュレーション画像を自動生成します。
          </p>
        </div>
      </section>

      {/* ステップインジケーター */}
      <section className="bg-white border-b border-gray-100 py-4">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-2 text-sm flex-wrap">
            {[
              { key: "upload", label: "① 写真をアップロード" },
              { key: "select", label: "② 色を選択" },
              { key: "result", label: "③ シミュレーション結果" },
            ].map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                {i > 0 && <ChevronRight size={14} className="text-gray-300" />}
                <span
                  className={`font-medium ${step === s.key ? "text-primary" : "text-gray-300"}`}
                  style={{ fontFamily: "Noto Sans JP, sans-serif" }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="flex-1 py-10">
        <div className="container max-w-4xl">

          {/* STEP 1: アップロード */}
          {step === "upload" && (
            <div className="bg-white rounded-sm shadow-sm p-8">
              <h2 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: "Zen Kaku Gothic New, sans-serif" }}>
                ご自宅の写真をアップロード
              </h2>
              <p className="text-muted-foreground text-sm mb-6" style={{ fontFamily: "Noto Sans JP, sans-serif" }}>
                外壁・屋根が写っている正面からの写真が最適です。JPG・PNG形式、10MB以下。
              </p>
              <div
                className={`border-2 border-dashed rounded-sm p-12 text-center cursor-pointer transition-colors ${
                  uploadMutation.isPending
                    ? "border-primary bg-orange-50"
                    : "border-gray-200 hover:border-primary hover:bg-orange-50"
                }`}
                onClick={() => !uploadMutation.isPending && fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                {uploadMutation.isPending ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 size={48} className="text-primary animate-spin" />
                    <p className="text-primary font-medium" style={{ fontFamily: "Noto Sans JP, sans-serif" }}>
                      アップロード中...
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <Upload size={48} className="text-gray-300" />
                    <div>
                      <p className="text-foreground font-bold text-lg mb-1" style={{ fontFamily: "Zen Kaku Gothic New, sans-serif" }}>
                        クリックまたはドラッグ＆ドロップ
                      </p>
                      <p className="text-muted-foreground text-sm" style={{ fontFamily: "Noto Sans JP, sans-serif" }}>
                        JPG・PNG・WEBP形式 / 最大10MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileChange(file);
                }}
              />
              <div className="mt-6 bg-orange-50 border border-orange-100 rounded-sm p-4">
                <p className="text-sm font-bold text-foreground mb-2" style={{ fontFamily: "Noto Sans JP, sans-serif" }}>
                  📸 きれいなシミュレーションのコツ
                </p>
                <ul className="text-sm text-muted-foreground space-y-1" style={{ fontFamily: "Noto Sans JP, sans-serif" }}>
                  <li>・ 正面から撮影した外観写真が最適です</li>
                  <li>・ 外壁と屋根が両方写っているとより正確です</li>
                  <li>・ 晴れた日中に撮影した明るい写真を使用してください</li>
                  <li>・ 木や車が邪魔しない角度から撮影してください</li>
                </ul>
              </div>
            </div>
          )}

          {/* STEP 2: 色選択 */}
          {step === "select" && (
            <div className="space-y-6">
              <div className="bg-white rounded-sm shadow-sm p-6">
                <h2 className="text-xl font-bold text-foreground mb-4" style={{ fontFamily: "Zen Kaku Gothic New, sans-serif" }}>
                  アップロードした写真
                </h2>
                {previewDataUrl && (
                  <img src={previewDataUrl} alt="アップロードした写真" className="w-full max-h-64 object-contain rounded-sm bg-gray-50" />
                )}
                <button
                  onClick={handleReset}
                  className="mt-3 text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                  style={{ fontFamily: "Noto Sans JP, sans-serif" }}
                >
                  <RefreshCw size={14} /> 別の写真を使う
                </button>
              </div>

              <div className="bg-white rounded-sm shadow-sm p-6">
                <h2 className="text-xl font-bold text-foreground mb-4" style={{ fontFamily: "Zen Kaku Gothic New, sans-serif" }}>
                  塗装色を選択
                </h2>
                <div className="flex border-b border-gray-100 mb-6">
                  {[
                    { key: "wall" as const, label: "外壁の色", icon: <ImageIcon size={16} /> },
                    { key: "roof" as const, label: "屋根の色", icon: <Palette size={16} /> },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-colors ${
                        activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                      style={{ fontFamily: "Noto Sans JP, sans-serif" }}
                    >
                      {tab.icon} {tab.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3 mb-5 p-3 bg-gray-50 rounded-sm">
                  <div className="w-8 h-8 rounded-sm border border-gray-200 flex-shrink-0"
                    style={{ backgroundColor: activeTab === "wall" ? selectedWall.hex : selectedRoof.hex }} />
                  <div>
                    <p className="text-sm font-bold text-foreground" style={{ fontFamily: "Noto Sans JP, sans-serif" }}>
                      選択中：{activeTab === "wall" ? selectedWall.name : selectedRoof.name}
                    </p>
                    <p className="text-xs text-muted-foreground" style={{ fontFamily: "Noto Sans JP, sans-serif" }}>
                      {activeTab === "wall" ? selectedWall.label : selectedRoof.label}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {(activeTab === "wall" ? WALL_COLORS : ROOF_COLORS).map((color) => {
                    const isSelected = activeTab === "wall"
                      ? selectedWall.name === color.name
                      : selectedRoof.name === color.name;
                    return (
                      <button
                        key={color.name}
                        onClick={() => activeTab === "wall" ? setSelectedWall(color) : setSelectedRoof(color)}
                        className={`relative flex flex-col items-center gap-1.5 p-2 rounded-sm border-2 transition-all ${
                          isSelected ? "border-primary shadow-md scale-105" : "border-transparent hover:border-gray-200"
                        }`}
                        title={color.name}
                      >
                        <div className="w-10 h-10 rounded-sm border border-gray-200" style={{ backgroundColor: color.hex }} />
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                            <CheckCircle size={10} className="text-white" strokeWidth={3} />
                          </div>
                        )}
                        <span className="text-xs text-center leading-tight text-foreground" style={{ fontFamily: "Noto Sans JP, sans-serif", fontSize: "10px" }}>
                          {color.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-sm shadow-sm p-6">
                <h3 className="text-base font-bold text-foreground mb-4" style={{ fontFamily: "Zen Kaku Gothic New, sans-serif" }}>
                  選択した色の組み合わせ
                </h3>
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 flex items-center gap-3 p-3 bg-gray-50 rounded-sm">
                    <div className="w-8 h-8 rounded-sm border border-gray-200 flex-shrink-0" style={{ backgroundColor: selectedWall.hex }} />
                    <div>
                      <p className="text-xs text-muted-foreground" style={{ fontFamily: "Noto Sans JP, sans-serif" }}>外壁</p>
                      <p className="text-sm font-bold text-foreground" style={{ fontFamily: "Noto Sans JP, sans-serif" }}>{selectedWall.name}</p>
                    </div>
                  </div>
                  <div className="flex-1 flex items-center gap-3 p-3 bg-gray-50 rounded-sm">
                    <div className="w-8 h-8 rounded-sm border border-gray-200 flex-shrink-0" style={{ backgroundColor: selectedRoof.hex }} />
                    <div>
                      <p className="text-xs text-muted-foreground" style={{ fontFamily: "Noto Sans JP, sans-serif" }}>屋根</p>
                      <p className="text-sm font-bold text-foreground" style={{ fontFamily: "Noto Sans JP, sans-serif" }}>{selectedRoof.name}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleSimulate}
                  className="btn-cta w-full flex items-center justify-center gap-2 text-base py-4"
                >
                  <Palette size={20} />
                  AIでシミュレーション画像を生成する
                </button>
                <p className="text-xs text-muted-foreground text-center mt-2" style={{ fontFamily: "Noto Sans JP, sans-serif" }}>
                  ※ 生成には10〜30秒ほどかかります
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: 結果 */}
          {step === "result" && (
            <div className="space-y-6">
              {simulateMutation.isPending && (
                <div className="bg-white rounded-sm shadow-sm p-12 text-center">
                  <Loader2 size={56} className="text-primary animate-spin mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: "Zen Kaku Gothic New, sans-serif" }}>
                    AIがシミュレーション画像を生成中...
                  </h2>
                  <p className="text-muted-foreground text-sm" style={{ fontFamily: "Noto Sans JP, sans-serif" }}>
                    外壁：{selectedWall.name} ／ 屋根：{selectedRoof.name}
                  </p>
                  <p className="text-muted-foreground text-xs mt-2" style={{ fontFamily: "Noto Sans JP, sans-serif" }}>
                    10〜30秒ほどかかります。そのままお待ちください。
                  </p>
                </div>
              )}

              {resultUrl && (
                <>
                  <div className="bg-white rounded-sm shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "Zen Kaku Gothic New, sans-serif" }}>
                        シミュレーション結果
                      </h2>
                      <a
                        href={resultUrl}
                        download="color-simulation.png"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-primary font-bold hover:underline"
                        style={{ fontFamily: "Noto Sans JP, sans-serif" }}
                      >
                        <Download size={16} /> 保存
                      </a>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1" style={{ fontFamily: "Noto Sans JP, sans-serif" }}>
                          <span className="bg-gray-500 text-white px-2 py-0.5 rounded-sm text-xs">BEFORE</span> 現在の状態
                        </div>
                        {previewDataUrl && (
                          <img src={previewDataUrl} alt="施工前" className="w-full rounded-sm border border-gray-100 object-cover" style={{ aspectRatio: "4/3" }} />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-primary mb-2 flex items-center gap-1" style={{ fontFamily: "Noto Sans JP, sans-serif" }}>
                          <span className="bg-primary text-white px-2 py-0.5 rounded-sm text-xs">AFTER</span> 塗装後のイメージ
                        </div>
                        <img src={resultUrl} alt="シミュレーション結果" className="w-full rounded-sm border border-orange-100 object-cover" style={{ aspectRatio: "4/3" }} />
                      </div>
                    </div>
                    <div className="flex gap-3 p-3 bg-orange-50 rounded-sm flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-sm border border-gray-200" style={{ backgroundColor: selectedWall.hex }} />
                        <span className="text-xs text-foreground" style={{ fontFamily: "Noto Sans JP, sans-serif" }}>外壁：{selectedWall.name}</span>
                      </div>
                      <span className="text-gray-300">|</span>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-sm border border-gray-200" style={{ backgroundColor: selectedRoof.hex }} />
                        <span className="text-xs text-foreground" style={{ fontFamily: "Noto Sans JP, sans-serif" }}>屋根：{selectedRoof.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setStep("select")}
                      className="flex items-center justify-center gap-2 bg-white border-2 border-primary text-primary font-bold px-6 py-4 rounded-sm hover:bg-orange-50 transition-all text-base"
                      style={{ fontFamily: "Zen Kaku Gothic New, sans-serif" }}
                    >
                      <RefreshCw size={18} /> 別の色で試す
                    </button>
                    <a
                      href="https://line.me/R/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-line flex items-center justify-center gap-2 text-base py-4"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.105.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                      </svg>
                      このカラーでLINE相談する
                    </a>
                  </div>
                  <div className="text-center">
                    <button
                      onClick={handleReset}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      style={{ fontFamily: "Noto Sans JP, sans-serif" }}
                    >
                      最初からやり直す
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />

      <a href="https://line.me/R/" target="_blank" rel="noopener noreferrer" className="fixed-line-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.105.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
        </svg>
        LINEで相談
      </a>
    </div>
  );
}
