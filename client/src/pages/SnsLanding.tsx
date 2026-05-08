/**
 * SNS集客用 リンクインバイオページ (/sns)
 * Instagram・TikTokのプロフィールURLに設定するページ
 * - スマートフォン最適化
 * - 主要CTAへのワンタップ導線
 * - 動画・ビフォーアフター画像ギャラリー
 */
import { useState, useRef } from "react";
import { Link } from "wouter";
import {
  Palette,
  FileText,
  Phone,
  MapPin,
  Star,
  ChevronRight,
  Play,
  Camera,
  MessageCircle,
  Pause,
} from "lucide-react";

// Instagram・TikTokのアイコン（SVG）
function InstagramIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function TikTokIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
    </svg>
  );
}

function LineIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.105.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
    </svg>
  );
}

const REVIEWS = [
  { name: "K様（会津若松市）", text: "カラーシミュレーションで仕上がりが事前に確認できて安心でした。", stars: 5 },
  { name: "M様（南会津郡）", text: "LINEで気軽に相談できて、見積もりも分かりやすかったです。", stars: 5 },
  { name: "T様（下郷町）", text: "近所の業者さんで何かあればすぐ来てもらえるのが安心です。", stars: 5 },
];

// 動画プレーヤーコンポーネント
function VideoPlayer({ src, label, thumbnail }: { src: string; label: string; thumbnail: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <div className="relative rounded-xl overflow-hidden bg-black" style={{ aspectRatio: "9/16" }}>
      <video
        ref={videoRef}
        src={src}
        poster={thumbnail}
        className="w-full h-full object-cover"
        playsInline
        loop
        onEnded={() => setPlaying(false)}
      />
      {/* オーバーレイ */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
        style={{ background: playing ? "transparent" : "rgba(0,0,0,0.4)" }}
        onClick={togglePlay}
      >
        {!playing && (
          <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center shadow-lg">
            <Play size={24} className="text-white ml-1" />
          </div>
        )}
        {playing && (
          <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">
            <Pause size={14} className="text-white" />
          </div>
        )}
      </div>
      {/* ラベル */}
      <div className="absolute bottom-0 left-0 right-0 px-3 py-2" style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.8))" }}>
        <p className="text-white text-xs font-bold">{label}</p>
      </div>
    </div>
  );
}

export default function SnsLanding() {
  const [activeReview, setActiveReview] = useState(0);
  const [activeTab, setActiveTab] = useState<"video" | "before_after" | "work">("video");

  const beforeAfterImages = [
    {
      before: "https://d2xsxph8kpxj0f.cloudfront.net/310519663391814188/EJsBmmUprBSu7jWnjJJ9Cq/before_wall_aged-cxJY2QFoNYjUUjFuUxsBz4.webp",
      after: "https://d2xsxph8kpxj0f.cloudfront.net/310519663391814188/EJsBmmUprBSu7jWnjJJ9Cq/after_wall_fresh-5RN7oJk7jy5JABJWu6QHF2.webp",
      label: "外壁塗装",
    },
    {
      before: "https://d2xsxph8kpxj0f.cloudfront.net/310519663391814188/EJsBmmUprBSu7jWnjJJ9Cq/before_roof_aged-DXykVkST3qt6CDdY5JiRWC.webp",
      after: "https://d2xsxph8kpxj0f.cloudfront.net/310519663391814188/EJsBmmUprBSu7jWnjJJ9Cq/after_roof_fresh-jmbKuqwN2Qvm7UoRp6YTTB.webp",
      label: "屋根塗装",
    },
  ];

  const workImages = [
    {
      src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663391814188/EJsBmmUprBSu7jWnjJJ9Cq/work_roller_wall-LcZ5RG5gAMncv7QUoLbQWp.webp",
      label: "ローラー塗装",
    },
    {
      src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663391814188/EJsBmmUprBSu7jWnjJJ9Cq/work_scaffold-aoTFTJKnM6VQ9LSvCpNbzj.webp",
      label: "足場作業",
    },
    {
      src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663391814188/EJsBmmUprBSu7jWnjJJ9Cq/work_brush_detail-e98wtruDEbJ5JrvLRsZ7sG.webp",
      label: "細部仕上げ",
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{ backgroundColor: "#1A1A1A", fontFamily: "Noto Sans JP, sans-serif" }}
    >
      {/* プロフィールヘッダー */}
      <div className="w-full max-w-md px-5 pt-10 pb-6 text-center">
        <div
          className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-3xl font-black border-4 border-orange-500"
          style={{ backgroundColor: "#F97316", fontFamily: "Zen Kaku Gothic New, sans-serif" }}
        >
          塗
        </div>
        <h1
          className="text-xl font-black text-white mb-1"
          style={{ fontFamily: "Zen Kaku Gothic New, sans-serif" }}
        >
          有限会社ホシ造形
        </h1>
        <p className="text-gray-400 text-sm mb-1">会津・下郷エリア対応の外壁・屋根塗装専門店</p>
        <div className="flex items-center justify-center gap-1 text-gray-500 text-xs">
          <MapPin size={12} />
          <span>福島県南会津郡下郷町 / 50km圏内対応</span>
        </div>

        {/* SNSフォローボタン */}
        <div className="flex justify-center gap-3 mt-4">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-xs font-bold transition-opacity hover:opacity-80"
            style={{ background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" }}
          >
            <InstagramIcon size={14} /> フォローする
          </a>
          <a
            href="https://www.tiktok.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-xs font-bold bg-black border border-gray-600 transition-opacity hover:opacity-80"
          >
            <TikTokIcon size={14} /> フォローする
          </a>
        </div>
      </div>

      {/* メインCTAボタン群 */}
      <div className="w-full max-w-md px-5 space-y-3 pb-6">
        <a
          href="https://line.me/R/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between w-full px-5 py-4 rounded-xl text-white font-bold text-base transition-transform active:scale-95"
          style={{ backgroundColor: "#06C755" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
              <LineIcon size={20} />
            </div>
            <div className="text-left">
              <div className="text-sm font-black">LINEで無料相談する</div>
              <div className="text-xs text-green-100">写真を送るだけ・即返信</div>
            </div>
          </div>
          <ChevronRight size={18} className="text-white/70" />
        </a>

        <Link href="/color-simulation">
          <div
            className="flex items-center justify-between w-full px-5 py-4 rounded-xl text-white font-bold text-base cursor-pointer transition-transform active:scale-95"
            style={{ backgroundColor: "#F97316" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                <Palette size={20} />
              </div>
              <div className="text-left">
                <div className="text-sm font-black">AIカラーシミュレーション</div>
                <div className="text-xs text-orange-100">写真をアップして色を試す・無料</div>
              </div>
            </div>
            <ChevronRight size={18} className="text-white/70" />
          </div>
        </Link>

        <Link href="/estimate">
          <div className="flex items-center justify-between w-full px-5 py-4 rounded-xl font-bold text-base cursor-pointer transition-transform active:scale-95 border border-gray-600"
            style={{ backgroundColor: "#2A2A2A", color: "#FFFFFF" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#3A3A3A" }}>
                <FileText size={20} className="text-orange-400" />
              </div>
              <div className="text-left">
                <div className="text-sm font-black">無料見積もりを依頼する</div>
                <div className="text-xs text-gray-400">3分で入力完了・完全無料</div>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-500" />
          </div>
        </Link>

        <Link href="/cases">
          <div className="flex items-center justify-between w-full px-5 py-4 rounded-xl font-bold text-base cursor-pointer transition-transform active:scale-95 border border-gray-600"
            style={{ backgroundColor: "#2A2A2A", color: "#FFFFFF" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#3A3A3A" }}>
                <Camera size={20} className="text-orange-400" />
              </div>
              <div className="text-left">
                <div className="text-sm font-black">施工事例を見る</div>
                <div className="text-xs text-gray-400">ビフォーアフター写真多数</div>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-500" />
          </div>
        </Link>

        <a
          href="tel:0241-67-3607"
          className="flex items-center justify-between w-full px-5 py-4 rounded-xl font-bold text-base transition-transform active:scale-95 border border-gray-600"
          style={{ backgroundColor: "#2A2A2A", color: "#FFFFFF" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#3A3A3A" }}>
              <Phone size={20} className="text-orange-400" />
            </div>
            <div className="text-left">
              <div className="text-sm font-black">電話で相談する</div>
              <div className="text-xs text-gray-400">0241-67-3607（平日9〜18時）</div>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-500" />
        </a>
      </div>

      {/* 実績バッジ */}
      <div className="w-full max-w-md px-5 pb-6">
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "150棟+", label: "累計施工実績" },
            { value: "98%", label: "お客様満足度" },
            { value: "無料", label: "見積もり・診断" },
          ].map((badge) => (
            <div
              key={badge.label}
              className="rounded-xl p-3 text-center border border-gray-700"
              style={{ backgroundColor: "#242424" }}
            >
              <div
                className="text-xl font-black text-orange-400 leading-none mb-1"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                {badge.value}
              </div>
              <div className="text-xs text-gray-400">{badge.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== 動画・画像コンテンツセクション ===== */}
      <div className="w-full max-w-md px-5 pb-6">
        <div className="rounded-xl border border-gray-700 overflow-hidden" style={{ backgroundColor: "#242424" }}>
          {/* タブ切り替え */}
          <div className="flex border-b border-gray-700">
            {[
              { key: "video", label: "施工動画" },
              { key: "before_after", label: "ビフォーアフター" },
              { key: "work", label: "作業写真" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className="flex-1 py-3 text-xs font-bold transition-colors"
                style={{
                  color: activeTab === tab.key ? "#F97316" : "#9CA3AF",
                  borderBottom: activeTab === tab.key ? "2px solid #F97316" : "2px solid transparent",
                  backgroundColor: "transparent",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4">
            {/* 施工動画タブ */}
            {activeTab === "video" && (
              <div className="grid grid-cols-2 gap-3">
                <VideoPlayer
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663391814188/EJsBmmUprBSu7jWnjJJ9Cq/video_before_after_9d340d96.mp4"
                  label="外壁塗装 ビフォーアフター"
                  thumbnail="https://d2xsxph8kpxj0f.cloudfront.net/310519663391814188/EJsBmmUprBSu7jWnjJJ9Cq/before_wall_aged-cxJY2QFoNYjUUjFuUxsBz4.webp"
                />
                <VideoPlayer
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663391814188/EJsBmmUprBSu7jWnjJJ9Cq/video_work_timelapse_7ccdd27a.mp4"
                  label="塗装作業 タイムラプス"
                  thumbnail="https://d2xsxph8kpxj0f.cloudfront.net/310519663391814188/EJsBmmUprBSu7jWnjJJ9Cq/work_scaffold-aoTFTJKnM6VQ9LSvCpNbzj.webp"
                />
                <div className="col-span-2 text-center pt-1">
                  <p className="text-gray-500 text-xs">▶ タップで再生</p>
                </div>
              </div>
            )}

            {/* ビフォーアフタータブ */}
            {activeTab === "before_after" && (
              <div className="space-y-4">
                {beforeAfterImages.map((item) => (
                  <div key={item.label}>
                    <p className="text-orange-400 text-xs font-bold mb-2">{item.label}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative rounded-lg overflow-hidden">
                        <img src={item.before} alt="施工前" className="w-full object-cover" style={{ aspectRatio: "4/3" }} />
                        <div className="absolute top-2 left-2 bg-gray-800/90 text-white text-xs font-black px-2 py-0.5 rounded">
                          BEFORE
                        </div>
                      </div>
                      <div className="relative rounded-lg overflow-hidden">
                        <img src={item.after} alt="施工後" className="w-full object-cover" style={{ aspectRatio: "4/3" }} />
                        <div className="absolute top-2 left-2 bg-orange-500/90 text-white text-xs font-black px-2 py-0.5 rounded">
                          AFTER
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 作業写真タブ */}
            {activeTab === "work" && (
              <div className="grid grid-cols-3 gap-2">
                {workImages.map((img) => (
                  <div key={img.label} className="relative rounded-lg overflow-hidden">
                    <img src={img.src} alt={img.label} className="w-full object-cover" style={{ aspectRatio: "4:5" }} />
                    <div className="absolute bottom-0 left-0 right-0 px-1.5 py-1" style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.8))" }}>
                      <p className="text-white text-xs font-bold">{img.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* お客様の声 */}
      <div className="w-full max-w-md px-5 pb-6">
        <div
          className="rounded-xl p-4 border border-gray-700"
          style={{ backgroundColor: "#242424" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle size={16} className="text-orange-400" />
            <span className="text-white text-sm font-bold">お客様の声</span>
          </div>
          <div className="space-y-1 mb-3">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => setActiveReview(i)}
                className={`w-full text-left p-3 rounded-lg transition-colors text-sm ${
                  activeReview === i
                    ? "bg-orange-500/20 border border-orange-500/40"
                    : "border border-gray-700 hover:border-gray-500"
                }`}
                style={{ backgroundColor: activeReview === i ? undefined : "#2A2A2A" }}
              >
                <div className="flex items-center gap-1 mb-1">
                  {Array.from({ length: REVIEWS[i].stars }).map((_, s) => (
                    <Star key={s} size={10} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-xs leading-relaxed">「{REVIEWS[i].text}」</p>
                <p className="text-gray-500 text-xs mt-1">{REVIEWS[i].name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ホームページへのリンク */}
      <div className="w-full max-w-md px-5 pb-10">
        <Link href="/">
          <div className="text-center text-gray-600 text-xs hover:text-gray-400 transition-colors cursor-pointer">
            公式ホームページはこちら →
          </div>
        </Link>
      </div>
    </div>
  );
}
