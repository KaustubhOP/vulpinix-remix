import { Button } from "./ui/button";
import { Play, Instagram, Facebook, Linkedin, Twitter, Menu, X, Sparkles, Zap, BarChart2, ArrowRight, Star } from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "../hooks/useTheme";

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
      style={{ background: "var(--vx-bg-primary)" }}
    >
      {/* ══════════ NAVBAR ══════════ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        transition: "all 0.35s ease",
        background: scrolled ? "var(--vx-bg-nav)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        boxShadow: scrolled ? (isDark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 32px rgba(99,51,255,0.1)") : "none",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, position: "relative" }}>

          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", transition: "filter 0.2s" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.filter = "drop-shadow(0 0 8px rgba(99,51,255,0.6))"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.filter = "none"}
          >
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #6333ff, #06d6c7)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(99,51,255,0.5)" }}>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 15 }}>V</span>
            </div>
            <span style={{ fontSize: 17, fontWeight: 700, background: "linear-gradient(90deg, #c4b5fd, #67e8f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "0.02em" }}>
              Vulpinix AI
            </span>
          </button>

          {/* Desktop Nav Links */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }} className="md:flex hidden">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="vx-nav-link"
                style={{ padding: "8px 16px", fontSize: 14, fontWeight: 500, color: isDark ? "rgba(209,213,219,0.9)" : "#1e2140", textDecoration: "none", borderRadius: 8, transition: "color 0.2s, background 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = isDark ? "#fff" : "#5b21b6"; (e.currentTarget as HTMLElement).style.background = "rgba(99,51,255,0.08)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = isDark ? "rgba(209,213,219,0.9)" : "#1e2140"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {userInfo && (
              <button onClick={() => navigate("/profile")} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(99,51,255,0.6)", background: "linear-gradient(135deg, #6333ff, #06d6c7)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>
                  {userInfo?.picture
                    ? <img src={userInfo.picture} alt={userInfo.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : getUserInitials()
                  }
                </div>
              </button>
            )}

            {/* Theme Toggle */}
            <button
              className="vx-theme-toggle"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              id="theme-toggle-btn"
            >
              {isDark ? "☀️" : "🌙"}
            </button>

            <button
              onClick={handleGetStarted}
              style={{ padding: "8px 20px", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer", border: "none", color: "#fff", background: "linear-gradient(135deg, #6333ff, #06d6c7)", boxShadow: "0 0 20px rgba(99,51,255,0.4)", transition: "all 0.25s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 32px rgba(99,51,255,0.7)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(99,51,255,0.4)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              Get Started
            </button>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: isDark ? "#9ca3af" : "#374151", padding: 6 }} className="md:hidden block">
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Shimmer border */}
          <div className={`vx-nav-shimmer${scrolled ? " vx-nav-scrolled" : ""}`} />
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(99,51,255,0.1)"}`, background: isDark ? "rgba(8,11,20,0.98)" : "rgba(240,242,255,0.98)", backdropFilter: "blur(20px)", padding: "12px 24px 16px" }}>
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)} style={{ display: "block", padding: "10px 12px", fontSize: 14, color: isDark ? "#d1d5db" : "#1e2140", textDecoration: "none", borderRadius: 8, marginBottom: 2 }}>
                {link.label}
              </a>
            ))}
            <div style={{ paddingTop: 8, borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(99,51,255,0.08)"}`, marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <button className="vx-theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                {isDark ? "☀️" : "🌙"}
              </button>
              <span style={{ fontSize: 13, color: isDark ? "rgba(180,180,220,0.6)" : "#6b7280" }}>
                {isDark ? "Light mode" : "Dark mode"}
              </span>
            </div>
          </div>
        )}
      </nav>

      {/* ══════════ HERO CONTENT ══════════ */}
      <div style={{ position: "relative", zIndex: 10, flex: 1, display: "flex", alignItems: "center", padding: "100px 24px 60px", maxWidth: 1280, margin: "0 auto", width: "100%", gap: 60 }}>

        {/* ── LEFT ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Badge */}
          <div
            className="vx-badge-animated"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, border: "1px solid rgba(99,51,255,0.4)", background: "rgba(99,51,255,0.08)", backdropFilter: "blur(8px)", marginBottom: 28 }}
          >
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px #4ade80", animation: "pulse 2s infinite" }} />
            <Sparkles size={13} style={{ color: "#a78bfa" }} />
            <span style={{ color: "#c4b5fd", fontSize: 13, fontWeight: 500 }}>Introducing Vulpinix AI 1.0</span>
          </div>

          {/* Headline — word by word */}
          <h1 style={{ fontSize: "clamp(2rem,5vw,3.8rem)", fontWeight: 800, color: "#fff", lineHeight: 1.1, marginBottom: 24, letterSpacing: "-0.02em" }}>
            {line1.map((w, i) => (
              <span key={w} className="vx-word" style={{ animationDelay: `${i * 0.1}s`, marginRight: "0.25em" }}>{w}</span>
            ))}
            <br />
            <span className="vx-gradient-text-anim" style={{ display: "inline-block", animationDelay: "0.25s" }}>
              Digital Marketing
            </span>
            <br />
            {line3.map((w, i) => (
              <span key={w} className="vx-word" style={{ animationDelay: `${(i + 3) * 0.1}s`, marginRight: "0.25em" }}>{w}</span>
            ))}
          </h1>

          {/* Subheadline */}
          <p style={{ fontSize: "clamp(1rem,2vw,1.15rem)", color: isDark ? "rgba(156,163,175,0.9)" : "#374151", lineHeight: 1.7, marginBottom: 36, maxWidth: 480, opacity: 0, animation: "wordFadeUp 0.6s 0.6s both" }}>
            Upload your content, let our AI craft captions, schedule posts, and deliver deep analytics — all from one seamless platform.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}>
            <button
              onClick={handleGetStarted}
              style={{ padding: "14px 28px", background: "linear-gradient(135deg, #6333ff, #06d6c7)", border: "none", borderRadius: 12, color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 0 30px rgba(99,51,255,0.5), 0 4px 20px rgba(0,0,0,0.3)", transition: "all 0.25s", opacity: 0, animation: "wordFadeUp 0.6s 0.7s both" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 44px rgba(99,51,255,0.75), 0 8px 24px rgba(0,0,0,0.3)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(99,51,255,0.5), 0 4px 20px rgba(0,0,0,0.3)"; }}
            >
              <Zap size={16} />
              Get Started Free
              <ArrowRight size={16} />
            </button>

            <button
              style={{ padding: "14px 24px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, color: "#e5e7eb", fontWeight: 600, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, backdropFilter: "blur(8px)", transition: "all 0.25s", opacity: 0, animation: "wordFadeUp 0.6s 0.8s both" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,51,255,0.5)"; (e.currentTarget as HTMLElement).style.background = "rgba(99,51,255,0.08)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
            >
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #6333ff, #06d6c7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Play size={11} style={{ color: "#fff", marginLeft: 2 }} fill="#fff" />
              </div>
              Watch Demo
            </button>
          </div>

          {/* Stats row with counters */}
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            {stats.map((s, i) => (
              <div key={s.label} style={{ textAlign: "center", opacity: 0, animation: `wordFadeUp 0.5s ${0.9 + i * 0.1}s both` }}>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff", lineHeight: 1, display: "flex", alignItems: "baseline", gap: 1, justifyContent: "center" }}>
                  <span
                    data-count-target={s.value}
                    data-count-suffix={s.suffix}
                    style={{ color: "#a78bfa" }}
                  >
                    {s.value}{s.suffix}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Floating dashboard card ── */}
        <div ref={cardRef} className="hidden md:flex" style={{ flex: "0 0 420px", position: "relative", height: 480, alignItems: "center", justifyContent: "center" }}>

          {/* Glow */}
          <div style={{ position: "absolute", inset: "-20px", background: "radial-gradient(ellipse at center, rgba(99,51,255,0.25) 0%, rgba(6,214,199,0.15) 50%, transparent 70%)", filter: "blur(30px)" }} />

          {/* Main floating card */}
          <div
            className="vx-card-float"
            style={{ position: "relative", zIndex: 2, width: "100%", background: "rgba(13,15,46,0.85)", border: "1px solid rgba(99,51,255,0.3)", borderRadius: 24, padding: 24, backdropFilter: "blur(24px)", boxShadow: "0 40px 80px rgba(99,51,255,0.2), 0 32px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)" }}
          >
            {/* Card header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Performance Dashboard</div>
                <div style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }}>Last 7 days</div>
              </div>
              <div style={{ padding: "4px 10px", background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 999, color: "#4ade80", fontSize: 12, fontWeight: 600 }}>↑ 32% this week</div>
            </div>

            {/* Mini metric cards with count-up */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[
                { label: "Total Reach",     rawVal: 124000, display: "124K",  suffix: "",  color: "#a78bfa", icon: "📊" },
                { label: "Engagement",      rawVal: 8.4,    display: "8.4%",  suffix: "%", color: "#38bdf8", icon: "⚡", decimals: 1 },
                { label: "Posts Scheduled", rawVal: 12,     display: "12",    suffix: "",  color: "#4ade80", icon: "📅" },
                { label: "New Followers",   rawVal: 890,    display: "+890",  suffix: "",  prefix: "+", color: "#fb923c", icon: "👥" },
              ].map((m) => (
                <div key={m.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "12px 14px" }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{m.icon}</div>
                  <div
                    data-count-target={String(m.rawVal)}
                    data-count-suffix={m.suffix || ""}
                    data-count-prefix={m.prefix || ""}
                    data-count-decimals={String(m.decimals || 0)}
                    style={{ color: m.color, fontWeight: 700, fontSize: 18 }}
                  >
                    {m.display}
                  </div>
                  <div style={{ color: "#6b7280", fontSize: 11, marginTop: 2 }}>{m.label}</div>
                </div>
              ))}
            </div>

            {/* Platform bars — animated width */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: "#9ca3af", fontSize: 12, marginBottom: 10 }}>Platform Performance</div>
              {platforms.map((p) => (
                <div key={p.name} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ color: "#d1d5db", fontSize: 12 }}>{p.name}</span>
                    <span style={{ color: p.color, fontSize: 12, fontWeight: 600 }}>{p.pct}%</span>
                  </div>
                  <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 999 }}>
                    <div
                      className="vx-bar-animated"
                      style={{ "--bar-target": `${p.pct}%`, height: "100%", background: `linear-gradient(90deg, ${p.color}, rgba(6,182,212,0.7))`, borderRadius: 999 } as React.CSSProperties}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* AI badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "rgba(99,51,255,0.12)", border: "1px solid rgba(99,51,255,0.25)", borderRadius: 12 }}>
              <Sparkles size={14} style={{ color: "#a78bfa" }} />
              <span style={{ color: "#c4b5fd", fontSize: 12, fontWeight: 500 }}>AI generated 3 captions ready to publish</span>
            </div>
          </div>

          {/* Floating mini badges */}
          <div style={{ position: "absolute", top: 20, left: -30, zIndex: 5, background: "rgba(13,15,46,0.9)", border: "1px solid rgba(74,222,128,0.4)", borderRadius: 12, padding: "8px 14px", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", gap: 6, animation: "float 4s ease-in-out infinite", animationDelay: "1s", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
            <Star size={12} style={{ color: "#fbbf24" }} fill="#fbbf24" />
            <span style={{ color: "#e5e7eb", fontSize: 12, fontWeight: 600 }}>4.9 / 5.0 Rating</span>
          </div>

          <div style={{ position: "absolute", bottom: 30, right: -25, zIndex: 5, background: "rgba(13,15,46,0.9)", border: "1px solid rgba(99,51,255,0.4)", borderRadius: 12, padding: "8px 14px", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", gap: 6, animation: "float 5s ease-in-out infinite", animationDelay: "0.5s", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
            <BarChart2 size={12} style={{ color: "#38bdf8" }} />
            <span style={{ color: "#e5e7eb", fontSize: 12, fontWeight: 600 }}>Live Analytics</span>
          </div>

          {/* Floating social icons */}
          <div style={{ position: "absolute", left: -64, top: "35%", display: "flex", flexDirection: "column", gap: 12, zIndex: 5 }} className="hidden xl:flex">
            {[
              { Icon: Instagram, color: "rgba(168,85,247,0.8)",  bg: "rgba(168,85,247,0.1)", delay: "0s" },
              { Icon: Facebook,  color: "rgba(59,130,246,0.8)",   bg: "rgba(59,130,246,0.1)", delay: "0.8s" },
              { Icon: Linkedin,  color: "rgba(6,182,212,0.8)",    bg: "rgba(6,182,212,0.1)",  delay: "1.6s" },
              { Icon: Twitter,   color: "rgba(168,85,247,0.8)",   bg: "rgba(168,85,247,0.1)", delay: "2.4s" },
            ].map(({ Icon, color, bg, delay }, i) => (
              <div
                key={i}
                className="vx-social-icon"
                style={{ width: 40, height: 40, borderRadius: 12, border: `1.5px solid ${color}`, background: bg, backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", animation: `float 3.5s ease-in-out infinite`, animationDelay: delay }}
              >
                <Icon size={18} style={{ color }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: "linear-gradient(to bottom, transparent, rgba(8,11,20,0.8))", pointerEvents: "none", zIndex: 5 }} />
    </section>
  );
}