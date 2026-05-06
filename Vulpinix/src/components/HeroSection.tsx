import { Button } from "./ui/button";
import { Play, Instagram, Facebook, Linkedin, Twitter, Menu, X, Sparkles, Zap, BarChart2, ArrowRight, Star, Upload } from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "../hooks/useTheme";
import { VulpinixLogo } from "./VulpinixLogo";

export function HeroSection() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [userInfo, setUserInfo]   = useState<any>(null);
  const [scrolled, setScrolled]   = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [barsReady, setBarsReady] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedUserInfo = localStorage.getItem("userInfo");
    if (savedUserInfo) {
      try { setUserInfo(JSON.parse(savedUserInfo)); } catch {}
    }
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    // progress bars animate on mount
    setTimeout(() => setBarsReady(true), 500);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleGetStarted = () => {
    const isAuthenticated = !!localStorage.getItem("userInfo") || localStorage.getItem("isAuthenticated") === "true";
    if (isAuthenticated) {
      navigate("/upload");
    } else {
      const isReturning = !!localStorage.getItem("userEmail") || !!localStorage.getItem("returningUser");
      navigate(isReturning ? "/login" : "/signup");
    }
  };

  const getUserInitials = () => {
    if (!userInfo?.name) return "U";
    const parts = userInfo.name.split(" ");
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : userInfo.name[0].toUpperCase();
  };

  const navLinks = [
    { label: "About",        href: "#about" },
    { label: "How It Works", href: "#workflow" },
    { label: "Pricing",      href: "#pricing" },
    { label: "Blogs",        href: "/blogs" },
  ];

  const stats = [
    { value: "500", suffix: "+", label: "Marketers" },
    { value: "30",  suffix: "",  label: "Countries" },
    { value: "10",  suffix: "M+",label: "Posts" },
    { value: "98",  suffix: "%", label: "Satisfaction" },
  ];

  const platforms = [
    { name: "Instagram", pct: 78, color: "#a78bfa" },
    { name: "Facebook",  pct: 54, color: "#38bdf8" },
    { name: "LinkedIn",  pct: 42, color: "#4ade80" },
  ];

  // Word-by-word heading words
  const line1 = ["Automate", "Your"];
  const line3 = ["with", "AI", "Power"];

  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "transparent" }}
    >
      <style>{`
        @keyframes float-main {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-badge-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }
        @keyframes float-badge-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        @keyframes float-badge-3 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-18px) scale(1.05); }
        }
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .anim-float-main { animation: float-main 7s ease-in-out infinite; }
        .anim-badge-1 { animation: float-badge-1 5s ease-in-out infinite 0.5s; }
        .anim-badge-2 { animation: float-badge-2 6.5s ease-in-out infinite 1.2s; }
        .anim-badge-3 { animation: float-badge-3 6s ease-in-out infinite 2s; }
        .anim-pulse { animation: pulse-subtle 3s ease-in-out infinite; }
      `}</style>
      {/* ══════════ NAVBAR ══════════ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        transition: "all 0.3s ease",
        background: scrolled ? "var(--vx-bg-card)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--vx-border)" : "1px solid transparent",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px", display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", position: "relative" }}>
          
          {/* Left: Logo */}
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <VulpinixLogo size="md" onClick={() => navigate("/")} />
          </div>

          {/* Middle: Desktop Nav Links */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }} className="md:flex hidden">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="vx-nav-link"
                style={{ padding: "8px 16px", fontSize: 14, fontWeight: 500, color: "var(--vx-text-secondary)", textDecoration: "none", borderRadius: 8, transition: "color 0.2s, background 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--vx-text-primary)"; (e.currentTarget as HTMLElement).style.background = "var(--vx-bg-input)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--vx-text-secondary)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Action Area */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12 }}>
            {/* Theme Toggle */}
            <button
              className="vx-theme-toggle"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              id="theme-toggle-btn"
              style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, background: "transparent", border: "1px solid transparent", cursor: "pointer", color: "var(--vx-text-secondary)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--vx-text-primary)"; (e.currentTarget as HTMLElement).style.background = "var(--vx-bg-input)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--vx-text-secondary)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              {isDark ? "☀️" : "🌙"}
            </button>

            {userInfo && (
              <button onClick={() => navigate("/profile")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", border: "1px solid var(--vx-border)", background: "var(--vx-bg-card)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--vx-text-primary)", fontWeight: 700, fontSize: 13 }}>
                  {userInfo?.picture
                    ? <img src={userInfo.picture} alt={userInfo.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : getUserInitials()
                  }
                </div>
              </button>
            )}

            <button
              onClick={handleGetStarted}
              style={{ padding: "8px 20px", borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer", border: "1px solid var(--vx-border)", color: "var(--vx-bg-primary)", background: "var(--vx-text-primary)", transition: "all 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.9"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
            >
              Get Started
            </button>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ display: "none", background: "transparent", border: "none", cursor: "pointer", color: "var(--vx-text-primary)", padding: 8 }} className="md:hidden block">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div style={{ borderTop: "1px solid var(--vx-border)", background: "var(--vx-bg-primary)", padding: "12px 24px 16px" }} className="md:hidden">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)} style={{ display: "block", padding: "12px 16px", fontSize: 15, fontWeight: 500, color: "var(--vx-text-primary)", textDecoration: "none", borderRadius: 8, marginBottom: 4 }}>
                {link.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* ══════════ HERO CONTENT ══════════ */}
      <div style={{ position: "relative", zIndex: 10, flex: 1, display: "flex", alignItems: "center", padding: "100px 24px 60px", maxWidth: 1280, margin: "0 auto", width: "100%", gap: 60 }}>

        {/* ── LEFT ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Badge */}
          <div
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 12px", borderRadius: 6, border: "1px solid var(--vx-border)", background: "var(--vx-bg-card)", marginBottom: 28 }}
          >
            <span style={{ background: "var(--vx-text-primary)", color: "var(--vx-bg-primary)", padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700, letterSpacing: "0.05em" }}>NEW</span>
            <span style={{ color: "var(--vx-text-secondary)", fontSize: 12, fontWeight: 500 }}>Smart Automation Engine</span>
          </div>

          {/* Headline — word by word */}
          <h1 className="vx-gradient-text-anim" style={{ fontSize: "clamp(2rem,5vw,3.8rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 24, letterSpacing: "-0.02em" }}>
            Automate Your
            <br />
            Digital Marketing
            <br />
            with AI Power
          </h1>

          {/* Subheadline */}
          <p style={{ fontSize: "clamp(1rem,2vw,1.15rem)", color: "var(--vx-text-secondary)", lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
            Upload your content, let our AI craft captions, schedule posts, and deliver deep analytics — all from one seamless platform.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}>
            <button
              onClick={handleGetStarted}
              style={{ padding: "14px 28px", background: "var(--vx-text-primary)", border: "1px solid transparent", borderRadius: 8, color: "var(--vx-bg-primary)", fontWeight: 700, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.25s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.opacity = "0.9"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.opacity = "1"; }}
            >
              <Zap size={16} />
              Get Started Free
              <ArrowRight size={16} />
            </button>

            <button
              style={{ padding: "14px 24px", background: "transparent", border: "1px solid var(--vx-border)", borderRadius: 8, color: "var(--vx-text-primary)", fontWeight: 600, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.25s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--vx-border-hover)"; (e.currentTarget as HTMLElement).style.background = "var(--vx-bg-card)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--vx-border)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--vx-text-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Play size={11} style={{ color: "var(--vx-bg-primary)", marginLeft: 2 }} fill="var(--vx-bg-primary)" />
              </div>
              Watch Demo
            </button>
          </div>

          {/* Stats row with counters */}
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            {stats.map((s, i) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--vx-text-primary)", lineHeight: 1, display: "flex", alignItems: "baseline", gap: 1, justifyContent: "center" }}>
                  <span style={{ color: "var(--vx-text-primary)" }}>
                    {s.value}{s.suffix}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Floating App Graphic ── */}
        <div ref={cardRef} className="hidden md:flex" style={{ flex: "0 0 500px", position: "relative", height: 540, alignItems: "center", justifyContent: "center" }}>

          {/* Main floating card - Mobile App Graphic */}
          <div
            className="anim-float-main"
            style={{ position: "relative", zIndex: 2, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {/* The Mobile Frame */}
            <div style={{ position: "relative", width: 280, height: 480, background: "var(--vx-bg-primary)", border: "8px solid var(--vx-bg-input)", borderRadius: 40, boxShadow: "0 24px 48px rgba(0,0,0,0.2)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              {/* Dynamic Island / Top Notch */}
              <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", width: 90, height: 22, background: "var(--vx-bg-input)", borderRadius: 12, zIndex: 10 }} />
              
              {/* Mock App Header */}
              <div style={{ padding: "40px 20px 16px", borderBottom: "1px solid var(--vx-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 800, fontSize: 18, color: "var(--vx-text-primary)" }}>Vulpinix App</span>
                <Menu size={20} style={{ color: "var(--vx-text-primary)" }} />
              </div>

              {/* Mock Social Feed inside Mobile */}
              <div style={{ flex: 1, padding: 16, background: "var(--vx-bg-card)", overflow: "hidden" }}>
                {/* Post Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(45deg, #f09433, #dc2743)", padding: 2 }}>
                     <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "var(--vx-bg-primary)" }} />
                  </div>
                  <div className="anim-pulse">
                    <div style={{ width: 90, height: 10, background: "var(--vx-text-primary)", borderRadius: 4, marginBottom: 6 }} />
                    <div style={{ width: 50, height: 8, background: "var(--vx-text-secondary)", borderRadius: 4 }} />
                  </div>
                </div>

                {/* Post Image */}
                <div style={{ width: "100%", height: 200, background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(56,189,248,0.15))", borderRadius: 14, marginBottom: 16, border: "1px solid var(--vx-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                   <Play size={28} style={{ color: "#a78bfa", opacity: 0.8 }} fill="#a78bfa" />
                </div>

                {/* Post Actions */}
                <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
                  <Star size={18} style={{ color: "#f43f5e" }} fill="#f43f5e" />
                  <Menu size={18} style={{ color: "var(--vx-text-primary)" }} />
                  <ArrowRight size={18} style={{ color: "var(--vx-text-primary)", marginLeft: "auto" }} />
                </div>

                {/* Post Text Placeholder */}
                <div className="anim-pulse" style={{ animationDelay: "0.5s" }}>
                  <div style={{ width: "95%", height: 10, background: "var(--vx-text-primary)", borderRadius: 4, marginBottom: 8 }} />
                  <div style={{ width: "80%", height: 10, background: "var(--vx-text-secondary)", borderRadius: 4, marginBottom: 8 }} />
                  <div style={{ width: "50%", height: 10, background: "var(--vx-text-secondary)", borderRadius: 4 }} />
                </div>
              </div>
            </div>

            {/* Floating Badges outside the phone */}
            <div className="anim-badge-1" style={{ position: "absolute", top: 80, left: -10, background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", padding: "12px 18px", borderRadius: 16, display: "flex", alignItems: "center", gap: 10, boxShadow: "var(--vx-shadow-card)", zIndex: 5 }}>
              <div style={{ background: "rgba(56,189,248,0.1)", padding: 8, borderRadius: 10 }}>
                <Linkedin size={20} color="#0A66C2" fill="#0A66C2" />
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: "var(--vx-text-primary)" }}>Auto-Sync</span>
            </div>

            <div className="anim-badge-2" style={{ position: "absolute", bottom: 100, right: -30, background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", padding: "12px 18px", borderRadius: 16, display: "flex", alignItems: "center", gap: 10, boxShadow: "var(--vx-shadow-card)", zIndex: 5 }}>
              <div style={{ background: "rgba(244,63,94,0.1)", padding: 8, borderRadius: 10 }}>
                <Star size={20} color="#f43f5e" fill="#f43f5e" />
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: "var(--vx-text-primary)" }}>+2.4k Likes</span>
            </div>

            <div className="anim-badge-3" style={{ position: "absolute", top: 160, right: -10, background: "linear-gradient(135deg, #8b5cf6, #38bdf8)", color: "#fff", padding: "10px 20px", borderRadius: 999, fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 12px 24px rgba(56,189,248,0.3)", zIndex: 5 }}>
              <Sparkles size={16} color="#fff" /> AI Generated
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade removed */}
    </section>
  );
}