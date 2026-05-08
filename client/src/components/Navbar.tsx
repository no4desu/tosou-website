/*
 * Design: Contemporary Craft
 * Navbar: Sticky white header with charcoal text, orange CTA button
 * Mobile: Hamburger menu
 */
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const navLinks = [
    { href: "/", label: "ホーム" },
    { href: "/cases", label: "施工事例" },
    { href: "/color-simulation", label: "カラーシミュレーション" },
    { href: "/estimate", label: "無料見積もり" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
                <span className="text-white font-bold text-sm" style={{ fontFamily: 'Oswald, sans-serif' }}>H</span>
              </div>
              <div>
                <div className="font-bold text-foreground leading-tight text-sm" style={{ fontFamily: 'Zen Kaku Gothic New, sans-serif' }}>
                  有限会社ホシ造形
                </div>
                <div className="text-xs text-muted-foreground leading-tight">会津・下郷エリア対応</div>
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer ${
                    location === link.href ? "text-primary" : "text-foreground"
                  }`}
                  style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a href="tel:0241-67-3607" className="flex items-center gap-1.5 text-sm font-bold text-foreground hover:text-primary transition-colors">
              <Phone size={16} />
              <span style={{ fontFamily: 'Oswald, sans-serif' }}>0241-67-3607</span>
            </a>
            <Link href="/estimate">
              <button className="btn-cta text-sm px-4 py-2">無料見積もり</button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="メニュー"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="container py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`block text-base font-medium py-2 border-b border-gray-50 cursor-pointer ${
                    location === link.href ? "text-primary" : "text-foreground"
                  }`}
                  onClick={() => setIsOpen(false)}
                  style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            <a href="tel:0241-67-3607" className="flex items-center gap-2 text-base font-bold text-foreground py-2">
              <Phone size={18} />
              0241-67-3607
            </a>
            <Link href="/estimate">
              <button className="btn-cta w-full text-center" onClick={() => setIsOpen(false)}>
                無料見積もりを依頼する
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
