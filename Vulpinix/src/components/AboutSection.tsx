import { Sparkles, Share2, BarChart3, Zap, Globe, Target, Layers } from "lucide-react";
import { useEffect, useRef } from "react";

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Captions",
      description: "Harness advanced neural networks to craft high-conversion captions that resonate with your specific audience segments.",
      color: "#a78bfa",
      glow: "rgba(139,92,246,0.3)"
    },
    {
      icon: Share2,
      title: "Multi-Platform Sync",
      description: "Scale your reach effortlessly. Publish and manage your presence across Instagram, Facebook, LinkedIn, and more from one bridge.",
      color: "#38bdf8",
      glow: "rgba(6,182,212,0.3)"
    },
    {
      icon: BarChart3,
      title: "Predictive Analytics",
      description: "Go beyond basic tracking. Get AI-driven insights that predict engagement trends and suggest the optimal time to publish.",
      color: "#818cf8",
      glow: "rgba(129,140,248,0.3)"
    }
  ];

  const highlights = [
    { icon: Zap,    text: "Instant Generation" },
    { icon: Globe,  text: "Global Reach" },
    { icon: Target, text: "Targeted Insights" },
    { icon: Layers, text: "Unified Workflow" },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{ position: "relative", padding: "120px 24px", overflow: "hidden", background: "transparent" }}
    >
      {/* Background accents */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "10%", right: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,51,255,0.1) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "5%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)", filter: "blur(50px)" }} />
      </div>

      {/* Top divider shimmer */}
      <div className="vx-divider-shimmer" style={{ marginBottom: 80 }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 60, alignItems: "center" }}>

          {/* ── Left: slide from left ── */}
          <div className="vx-reveal-left" style={{ flex: 1 }}>
            {/* "The Future of Social" pill */}
            <div
              className="vx-badge-animated"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "6px 16px", borderRadius: 99, background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.25)", marginBottom: 24 }}
            >
              <span style={{ color: "#22d3ee", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>The Future of Social</span>
            </div>

            <h2
              className="vx-heading-underline"
              style={{ fontSize: "clamp(2.2rem,4vw,3.2rem)", fontWeight: 800, color: "#fff", lineHeight: 1.1, marginBottom: 28 }}
            >
              What is&nbsp;
              <span style={{ background: "linear-gradient(90deg, #c4b5fd, #67e8f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Vulpinix AI 1.0?
              </span>
            </h2>

            <p style={{ fontSize: "1.15rem", color: "rgba(156,163,175,0.9)", lineHeight: 1.8, marginBottom: 40, maxWidth: 520 }}>
              Vulpinix AI is your intelligent marketing co-pilot. Built for the modern digital landscape, it bridges the gap between content creation and strategic publishing through deep AI integration.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {highlights.map((item, i) => (
                <div
                  key={i}
                  className={`vx-reveal vx-delay-${i + 1}`}
                  style={{ display: "flex", alignItems: "center", gap: 12, transition: "all 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateX(4px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateX(0)"; }}
                >
                  <div
                    style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", flexShrink: 0 }}
                    onMouseEnter={e => { (e.currentTarget.firstElementChild as SVGElement)?.setAttribute("style", "transform:scale(1.1)"); }}
                  >
                    <item.icon size={16} style={{ color: "#67e8f9", transition: "transform 0.2s" }} />
                  </div>
                  <span style={{ color: "#d1d5db", fontSize: 14, fontWeight: 500 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: feature cards slide from right, staggered ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {features.map((feature, index) => (
              <div
                key={index}
                className={`vx-reveal-right vx-delay-${index + 1}`}
                style={{ position: "relative", background: "rgba(13,15,46,0.6)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "32px", backdropFilter: "blur(20px)", transition: "all 0.35s ease", cursor: "default", overflow: "hidden" }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(-6px)";
                  el.style.borderColor = `rgba(139,92,246,0.4)`;
                  el.style.boxShadow = `inset 0 0 30px rgba(99,51,255,0.05), 0 0 30px rgba(99,51,255,0.1)`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(0)";
                  el.style.borderColor = "rgba(255,255,255,0.08)";
                  el.style.boxShadow = "none";
                }}
              >
                {/* Corner glow */}
                <div style={{ position: "absolute", top: -50, right: -50, width: 150, height: 150, background: `radial-gradient(circle, ${feature.glow} 0%, transparent 70%)`, opacity: 0.5, zIndex: 0 }} />

                <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 24, alignItems: "start" }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg, ${feature.color}, rgba(255,255,255,0.1))`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 20px rgba(0,0,0,0.2)", flexShrink: 0, transition: "transform 0.3s" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "rotate(8deg) scale(1.08)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "rotate(0) scale(1)"}
                  >
                    <feature.icon size={26} style={{ color: "#fff" }} />
                  </div>
                  <div>
                    <h4 style={{ color: "#fff", fontSize: "1.25rem", fontWeight: 700, marginBottom: 12 }}>{feature.title}</h4>
                    <p style={{ color: "rgba(156,163,175,0.8)", fontSize: "0.95rem", lineHeight: 1.6 }}>{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Bottom divider */}
      <div className="vx-divider-shimmer" style={{ marginTop: 80 }} />
    </section>
  );
}
