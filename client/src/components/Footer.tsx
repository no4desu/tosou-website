/*
 * Design: Contemporary Craft
 * Footer: Dark charcoal background with white text
 */
import { Link } from "wouter";
import { Phone, MapPin, Clock, Printer } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#2D2D2D' }} className="text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
                <span className="text-white font-bold text-sm" style={{ fontFamily: 'Oswald, sans-serif' }}>H</span>
              </div>
              <div>
                <div className="font-bold text-white text-sm" style={{ fontFamily: 'Zen Kaku Gothic New, sans-serif' }}>有限会社ホシ造形</div>
                <div className="text-xs text-gray-400">会津・下郷エリア対応</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              福島県南会津郡下郷町を中心に、50km圏内の一般住宅の外壁・屋根塗装を専門に行っています。地域に根ざした誠実な施工をお約束します。
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm" style={{ fontFamily: 'Zen Kaku Gothic New, sans-serif' }}>お問い合わせ</h3>
            <div className="flex flex-col gap-3">
              <a href="tel:0241-67-3607" className="flex items-center gap-2 text-gray-300 hover:text-primary transition-colors text-sm">
                <Phone size={16} />
                <span style={{ fontFamily: 'Oswald, sans-serif' }} className="text-base font-bold">0241-67-3607</span>
              </a>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Printer size={16} className="flex-shrink-0" />
                <span style={{ fontFamily: 'Oswald, sans-serif' }}>FAX：0241-67-3610</span>
              </div>
              <div className="flex items-start gap-2 text-gray-400 text-sm">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>福島県南会津郡下郷町</span>
              </div>
              <div className="flex items-start gap-2 text-gray-400 text-sm">
                <Clock size={16} className="mt-0.5 flex-shrink-0" />
                <span>受付時間：8:00〜18:00（日祝除く）</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm" style={{ fontFamily: 'Zen Kaku Gothic New, sans-serif' }}>サービス</h3>
            <ul className="flex flex-col gap-2">
              {[
                { href: "/cases", label: "施工事例" },
                { href: "/color-simulation", label: "無料カラーシミュレーション" },
                { href: "/estimate", label: "無料見積もり依頼" },
                { href: "/sns", label: "Instagram・TikTok（SNS）" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-gray-400 hover:text-primary transition-colors text-sm cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <a
                href="https://line.me/R/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-line inline-flex items-center gap-2 text-sm"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.105.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                </svg>
                LINEで相談する
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500 text-xs">
          © 2024 有限会社ホシ造形 All rights reserved.
        </div>
      </div>
    </footer>
  );
}
