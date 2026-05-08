/*
 * Design: Contemporary Craft
 * Home page: Hero + Stats + Services + Cases preview + Color Sim CTA + Testimonials + FAQ
 * Colors: White bg, Charcoal text, Orange accent
 * Fonts: Zen Kaku Gothic New (headings), Noto Sans JP (body), Oswald (numbers)
 */
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronDown, ChevronUp, Star, CheckCircle, ArrowRight, Palette, FileText } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

// Count-up hook
function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// Intersection observer hook
function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// Stat card
function StatCard({ value, unit, label }: { value: number; unit: string; label: string }) {
  const { ref, inView } = useInView();
  const count = useCountUp(value, 1800, inView);
  return (
    <div ref={ref} className="text-center">
      <div className="stat-number text-5xl md:text-6xl leading-none">
        {count}<span className="text-2xl md:text-3xl ml-1">{unit}</span>
      </div>
      <div className="text-sm text-muted-foreground mt-2" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>{label}</div>
    </div>
  );
}

// FAQ item
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100">
      <button
        className="w-full flex items-center justify-between py-4 text-left font-medium text-foreground hover:text-primary transition-colors"
        onClick={() => setOpen(!open)}
        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
      >
        <span className="pr-4">{q}</span>
        {open ? <ChevronUp size={20} className="flex-shrink-0 text-primary" /> : <ChevronDown size={20} className="flex-shrink-0 text-muted-foreground" />}
      </button>
      {open && (
        <div className="pb-4 text-muted-foreground text-sm leading-relaxed" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
          {a}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const cases = [
    {
      title: "外壁・屋根の全面塗装",
      location: "会津若松市 K様邸",
      cost: "約85万円",
      period: "14日間",
      paint: "フッ素塗料",
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    },
    {
      title: "外壁サイディング塗装",
      location: "南会津郡 M様邸",
      cost: "約62万円",
      period: "10日間",
      paint: "シリコン塗料",
      img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80",
    },
    {
      title: "屋根の遮熱塗装",
      location: "下郷町 T様邸",
      cost: "約38万円",
      period: "7日間",
      paint: "遮熱シリコン",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
    },
  ];

  const faqs = [
    {
      q: "見積もりは本当に無料ですか？",
      a: "はい、現地調査・お見積もりは完全無料です。見積もり後にキャンセルいただいても費用は一切かかりません。お気軽にご依頼ください。",
    },
    {
      q: "カラーシミュレーションとはどのようなサービスですか？",
      a: "お客様のご自宅の写真をLINEでお送りいただくと、弊社スタッフが実際に使用する塗料の色を使ってシミュレーション画像を作成し、ご返信します。完成後のイメージを事前に確認できるため、色選びの失敗を防げます。",
    },
    {
      q: "工事中は家にいる必要がありますか？",
      a: "基本的に在宅の必要はありません。ただし、工事開始日と完了日はご確認いただけると安心です。近隣へのご挨拶も弊社が行います。",
    },
    {
      q: "対応エリアを教えてください。",
      a: "福島県南会津郡下郷町を中心に、半径約50km圏内（会津若松市、南会津町、白河市の一部など）に対応しています。エリア外の場合もお気軽にご相談ください。",
    },
    {
      q: "塗装の時期はいつが最適ですか？",
      a: "外壁塗装は気温5℃以上・湿度85%以下の環境が適しています。会津エリアでは春（4〜6月）と秋（9〜11月）が最適な時期です。ただし、冬季以外は基本的に施工可能です。",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663391814188/EJsBmmUprBSu7jWnjJJ9Cq/hero_painting-gxnWCYiXysuzDiBqR434DC.webp)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 100%)' }} />

        <div className="container relative z-10 py-20">
          <div
            className="max-w-xl"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
            }}
          >
            <div className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 mb-4" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
              会津・下郷エリア対応
            </div>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4"
              style={{ fontFamily: 'Zen Kaku Gothic New, sans-serif' }}
            >
              お家を、<br />
              新しく。<br />
              <span className="text-primary">地元の職人が</span><br />
              丁寧に塗ります。
            </h1>
            <p className="text-gray-200 text-base md:text-lg mb-8 leading-relaxed" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
              福島県下郷町を中心に50km圏内の外壁・屋根塗装を専門に行っています。
              無料カラーシミュレーション・無料見積もり実施中。
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/color-simulation">
                <button className="btn-cta flex items-center gap-2 text-base w-full sm:w-auto justify-center">
                  <Palette size={18} />
                  無料カラーシミュレーション
                </button>
              </Link>
              <Link href="/estimate">
                <button className="flex items-center gap-2 text-base bg-white text-foreground font-bold px-6 py-3 rounded-sm hover:bg-gray-100 transition-all w-full sm:w-auto justify-center" style={{ fontFamily: 'Zen Kaku Gothic New, sans-serif' }}>
                  <FileText size={18} />
                  無料見積もりを依頼する
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Diagonal bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }} />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard value={150} unit="棟+" label="累計施工実績" />
            <StatCard value={98} unit="%" label="お客様満足度" />
            <StatCard value={15} unit="年" label="地域での実績" />
            <StatCard value={0} unit="円" label="見積もり・診断費用" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16" style={{ backgroundColor: '#F7F7F5' }}>
        <div className="container">
          <div className="text-center mb-12">
            <div className="text-primary text-sm font-bold mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>SERVICES</div>
            <h2 className="text-3xl md:text-4xl font-black text-foreground" style={{ fontFamily: 'Zen Kaku Gothic New, sans-serif' }}>
              サービス内容
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🏠",
                title: "外壁塗装",
                desc: "シリコン・フッ素・無機塗料など、お客様のご予算と希望に合わせた最適な塗料をご提案。下地処理から仕上げまで丁寧に施工します。",
                price: "30万円〜",
              },
              {
                icon: "🏗️",
                title: "屋根塗装",
                desc: "遮熱・防水性能の高い塗料で屋根を保護。会津の厳しい冬にも耐える施工品質を提供します。",
                price: "20万円〜",
              },
              {
                icon: "🎨",
                title: "カラーシミュレーション",
                desc: "LINEでご自宅の写真をお送りいただくだけで、完成後のカラーイメージをシミュレーション画像でご確認いただけます。",
                price: "完全無料",
              },
            ].map((service) => (
              <div key={service.title} className="bg-white p-6 rounded-sm shadow-sm card-hover">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: 'Zen Kaku Gothic New, sans-serif' }}>{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>{service.desc}</p>
                <div className="text-primary font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>{service.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cases Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="text-primary text-sm font-bold mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>CASES</div>
              <h2 className="text-3xl md:text-4xl font-black text-foreground" style={{ fontFamily: 'Zen Kaku Gothic New, sans-serif' }}>
                施工事例
              </h2>
            </div>
            <Link href="/cases">
              <span className="text-primary text-sm font-bold flex items-center gap-1 cursor-pointer hover:gap-2 transition-all" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
                すべて見る <ArrowRight size={16} />
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cases.map((c) => (
              <div key={c.title} className="bg-white rounded-sm overflow-hidden shadow-sm card-hover border border-gray-100">
                <div className="aspect-video overflow-hidden">
                  <img src={c.img} alt={c.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-foreground mb-1" style={{ fontFamily: 'Zen Kaku Gothic New, sans-serif' }}>{c.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>{c.location}</p>
                  <div className="flex flex-wrap gap-2">
                    {[c.cost, c.period, c.paint].map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-sm" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Color Simulation CTA */}
      <section className="py-16" style={{ backgroundColor: '#2D2D2D' }}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-primary text-sm font-bold mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>COLOR SIMULATION</div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4" style={{ fontFamily: 'Zen Kaku Gothic New, sans-serif' }}>
                塗り替え後の<br />
                イメージを確認してから<br />
                決められます。
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-6" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
                LINEでご自宅の写真をお送りいただくだけで、弊社スタッフが実際の塗料色を使ったシミュレーション画像を作成してご返信します。色選びで後悔しないために、ぜひご活用ください。
              </p>
              <div className="flex flex-col gap-3">
                {["写真を送るだけ、簡単3ステップ", "完全無料・見積もり不要", "最短当日〜翌日にご返信"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-gray-300 text-sm" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
                    <CheckCircle size={16} className="text-primary flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link href="/color-simulation">
                  <button className="btn-cta flex items-center gap-2 text-base">
                    <Palette size={18} />
                    カラーシミュレーションを依頼する
                  </button>
                </Link>
              </div>
            </div>
            <div className="rounded-sm overflow-hidden shadow-2xl">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663391814188/EJsBmmUprBSu7jWnjJJ9Cq/color_simulation-CSWEuS3fQPDZg5uqsKCyeM.webp"
                alt="カラーシミュレーションの様子"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Before/After Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <div className="text-primary text-sm font-bold mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>BEFORE / AFTER</div>
            <h2 className="text-3xl md:text-4xl font-black text-foreground" style={{ fontFamily: 'Zen Kaku Gothic New, sans-serif' }}>
              施工前後の変化
            </h2>
            <p className="text-muted-foreground text-sm mt-2" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
              外壁塗替えで、お家の印象が大きく変わります。
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Before */}
              <div className="rounded-sm overflow-hidden shadow-lg">
                <div className="relative">
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663391814188/EJsBmmUprBSu7jWnjJJ9Cq/before_painting-8Gn2sd56bepH2QEGRz6FUc.webp"
                    alt="外壁塗装 施工前"
                    className="w-full object-cover"
                    style={{ aspectRatio: '4/3' }}
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className="inline-block px-3 py-1 text-sm font-black text-white rounded-sm"
                      style={{ backgroundColor: '#585858', fontFamily: 'Oswald, sans-serif', letterSpacing: '0.05em' }}
                    >
                      BEFORE
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3">
                  <p className="text-sm text-muted-foreground" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
                    塗膜の劣化・色褪せ・汚れが目立つ状態
                  </p>
                </div>
              </div>
              {/* After */}
              <div className="rounded-sm overflow-hidden shadow-lg">
                <div className="relative">
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663391814188/EJsBmmUprBSu7jWnjJJ9Cq/after_painting_v2_7518cd5c.png"
                    alt="外壁塗装 施工後"
                    className="w-full object-cover"
                    style={{ aspectRatio: '4/3' }}
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className="inline-block px-3 py-1 text-sm font-black text-white rounded-sm"
                      style={{ backgroundColor: '#F97316', fontFamily: 'Oswald, sans-serif', letterSpacing: '0.05em' }}
                    >
                      AFTER
                    </span>
                  </div>
                </div>
                <div className="bg-orange-50 px-4 py-3">
                  <p className="text-sm text-foreground font-medium" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
                    新築のような美しい仕上がりに
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16" style={{ backgroundColor: '#F7F7F5' }}>
        <div className="container">
          <div className="text-center mb-12">
            <div className="text-primary text-sm font-bold mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>REVIEWS</div>
            <h2 className="text-3xl md:text-4xl font-black text-foreground" style={{ fontFamily: 'Zen Kaku Gothic New, sans-serif' }}>
              お客様の声
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "K様（会津若松市）",
                text: "カラーシミュレーションのおかげで、仕上がりのイメージが事前にしっかり確認できました。実際の仕上がりもイメージ通りで大満足です。",
                stars: 5,
              },
              {
                name: "M様（南会津郡）",
                text: "LINEで気軽に相談できたのがよかったです。見積もりも分かりやすく、追加費用もなく安心して依頼できました。",
                stars: 5,
              },
              {
                name: "T様（下郷町）",
                text: "近所の業者さんで、何かあったときにすぐ来てもらえるのが安心です。施工も丁寧で、近所の方にも褒めていただきました。",
                stars: 5,
              },
            ].map((review) => (
              <div key={review.name} className="bg-white p-6 rounded-sm shadow-sm card-hover">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: review.stars }).map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-foreground text-sm leading-relaxed mb-4" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
                  「{review.text}」
                </p>
                <div className="text-muted-foreground text-xs font-bold" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>{review.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container max-w-3xl">
          <div className="text-center mb-12">
            <div className="text-primary text-sm font-bold mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>FAQ</div>
            <h2 className="text-3xl md:text-4xl font-black text-foreground" style={{ fontFamily: 'Zen Kaku Gothic New, sans-serif' }}>
              よくある質問
            </h2>
          </div>
          <div>
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-primary">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4" style={{ fontFamily: 'Zen Kaku Gothic New, sans-serif' }}>
            まずは無料で相談してみませんか？
          </h2>
          <p className="text-orange-100 text-base mb-8 max-w-xl mx-auto" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
            見積もり・カラーシミュレーションは完全無料。LINEで写真を送るだけでOKです。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://line.me/R/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-line flex items-center gap-2 justify-center text-base"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.105.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
              </svg>
              LINEで無料相談する
            </a>
            <Link href="/estimate">
              <button className="bg-white text-primary font-bold px-6 py-3 rounded-sm hover:bg-gray-100 transition-all flex items-center gap-2 justify-center text-base" style={{ fontFamily: 'Zen Kaku Gothic New, sans-serif' }}>
                <FileText size={18} />
                見積もりフォームへ
              </button>
            </Link>
          </div>
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
