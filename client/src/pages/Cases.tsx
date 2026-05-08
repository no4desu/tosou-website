/*
 * Design: Contemporary Craft
 * Cases page: Gallery of painting projects with filter
 */
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

const cases = [
  {
    id: 1,
    title: "外壁・屋根の全面塗装",
    location: "会津若松市 K様邸",
    cost: "約85万円",
    period: "14日間",
    paint: "フッ素塗料",
    category: "外壁＋屋根",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663391814188/EJsBmmUprBSu7jWnjJJ9Cq/after_wall_fresh-5RN7oJk7jy5JABJWu6QHF2.webp",
    desc: "外壁の色褪せとひび割れが気になるとのことで、フッ素塗料を使用した全面塗装を実施。耐久性が高く、次回の塗り替えまで15〜20年の長寿命を実現しました。",
  },
  {
    id: 2,
    title: "外壁サイディング塗装",
    location: "南会津郡 M様邸",
    cost: "約62万円",
    period: "10日間",
    paint: "シリコン塗料",
    category: "外壁",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663391814188/EJsBmmUprBSu7jWnjJJ9Cq/work_roller_wall-LcZ5RG5gAMncv7QUoLbQWp.webp",
    desc: "サイディング外壁の目地シーリングの打ち替えと塗装を同時施工。防水性能を回復させ、外観も明るいクリーム色に一新しました。",
  },
  {
    id: 3,
    title: "屋根の遮熱塗装",
    location: "下郷町 T様邸",
    cost: "約38万円",
    period: "7日間",
    paint: "遮熱シリコン",
    category: "屋根",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663391814188/EJsBmmUprBSu7jWnjJJ9Cq/after_roof_fresh-jmbKuqwN2Qvm7UoRp6YTTB.webp",
    desc: "夏場の室内温度が高いとのご相談から、遮熱シリコン塗料による屋根塗装を実施。施工後は室内温度が約3〜5℃低下し、冷房費の節約にもつながりました。",
  },
  {
    id: 4,
    title: "外壁の防水塗装リフォーム",
    location: "会津若松市 Y様邸",
    cost: "約55万円",
    period: "12日間",
    paint: "弾性シリコン",
    category: "外壁",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663391814188/EJsBmmUprBSu7jWnjJJ9Cq/work_scaffold-aoTFTJKnM6VQ9LSvCpNbzj.webp",
    desc: "外壁のひび割れから雨水が浸入しているとのことで、弾性シリコン塗料を使用した防水塗装を実施。クラック補修も同時に行い、雨漏りを完全に解消しました。",
  },
  {
    id: 5,
    title: "外壁・付帯部の全面塗装",
    location: "南会津町 S様邸",
    cost: "約78万円",
    period: "16日間",
    paint: "フッ素塗料",
    category: "外壁＋屋根",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663391814188/EJsBmmUprBSu7jWnjJJ9Cq/work_brush_detail-e98wtruDEbJ5JrvLRsZ7sG.webp",
    desc: "雨樋・破風板・軒天などの付帯部も含めた全面塗装を実施。外観が大きく改善され、近所からも「きれいになった」とお声をいただきました。",
  },
  {
    id: 6,
    title: "スレート屋根の塗装",
    location: "下郷町 H様邸",
    cost: "約32万円",
    period: "6日間",
    paint: "シリコン塗料",
    category: "屋根",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663391814188/EJsBmmUprBSu7jWnjJJ9Cq/before_roof_aged-DXykVkST3qt6CDdY5JiRWC.webp",
    desc: "スレート屋根の苔・藻の発生と色褪せが進んでいたため、高圧洗浄後にシリコン塗料で塗装。縁切り（タスペーサー）施工も行い、雨漏りリスクを低減しました。",
  },
];

const categories = ["すべて", "外壁", "屋根", "外壁＋屋根"];

export default function Cases() {
  const [activeCategory, setActiveCategory] = useState("すべて");

  const filtered = activeCategory === "すべて"
    ? cases
    : cases.filter((c) => c.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="py-12" style={{ backgroundColor: '#2D2D2D' }}>
        <div className="container text-center">
          <div className="text-primary text-sm font-bold mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>CASES</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Zen Kaku Gothic New, sans-serif' }}>
            施工事例
          </h1>
          <p className="text-gray-400 text-base" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
            会津・下郷エリアでの実際の施工事例をご紹介します。
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="bg-white border-b border-gray-100 py-4">
        <div className="container">
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-sm text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-foreground hover:bg-gray-200"
                }`}
                style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Cases grid */}
      <section className="py-12 flex-1" style={{ backgroundColor: '#F7F7F5' }}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c) => (
              <div key={c.id} className="bg-white rounded-sm overflow-hidden shadow-sm card-hover border border-gray-100">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={c.img}
                    alt={c.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-black text-foreground mb-1 text-lg" style={{ fontFamily: 'Zen Kaku Gothic New, sans-serif' }}>{c.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>{c.location}</p>
                  <p className="text-foreground text-sm leading-relaxed mb-4" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>{c.desc}</p>
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

      {/* CTA */}
      <section className="py-12 bg-white">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-black text-foreground mb-4" style={{ fontFamily: 'Zen Kaku Gothic New, sans-serif' }}>
            あなたのお家も、きれいにしませんか？
          </h2>
          <p className="text-muted-foreground text-base mb-6" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
            無料見積もり・カラーシミュレーションをお気軽にご依頼ください。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/estimate">
              <button className="btn-cta text-base">無料見積もりを依頼する</button>
            </Link>
            <Link href="/color-simulation">
              <button className="px-6 py-3 border-2 border-primary text-primary font-bold rounded-sm hover:bg-orange-50 transition-colors text-base" style={{ fontFamily: 'Zen Kaku Gothic New, sans-serif' }}>
                カラーシミュレーションを試す
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
