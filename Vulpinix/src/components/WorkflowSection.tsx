import { Upload, Sparkles, Users, LineChart, ArrowRight } from "lucide-react";

export function WorkflowSection() {
  const steps = [
    { number: "01", icon: Upload,    title: "Upload Content",         description: "Upload your media files and content ideas" },
    { number: "02", icon: Sparkles,  title: "AI Generates Captions",  description: "Our AI creates engaging, optimized captions" },
    { number: "03", icon: Users,     title: "Vulpinix Team Publishes", description: "Our team reviews and publishes your content" },
    { number: "04", icon: LineChart, title: "Get Analytics Reports",   description: "Receive detailed performance analytics" },
  ];

  const gradientColors = ["#a78bfa", "#38bdf8", "#4ade80", "#fb923c"];

  return (
    <section id="workflow" style={{ padding: "120px 24px", position: "relative", overflow: "hidden" }}>
      {/* Top line */}
      <div className="vx-divider-shimmer" style={{ marginBottom: 80 }} />

      <div style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* Heading */}
        <div className="vx-reveal" style={{ textAlign: "center", marginBottom: 80 }}>
          <div style={{ color: "#22d3ee", fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14 }}>Workflow</div>
          <h2
            className="vx-heading-underline"
            style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, color: "#fff", display: "inline-block" }}
          >
            How It Works
          </h2>
        </div>

        {/* Connecting line — draws left to right on scroll */}
        <div style={{ position: "relative" }}>
          <div
            className="vx-reveal"
            style={{ position: "absolute", top: 80, left: "8%", right: "8%", height: 1, background: "linear-gradient(90deg, #6333ff, #06d6c7)", transformOrigin: "left", zIndex: 0, display: "none" }}
          />
          {/* Desktop grid */}
          <div className="hidden lg:grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 28, position: "relative", zIndex: 1 }}>
            {steps.map((step, index) => (
              <div
                key={index}
                className={`vx-reveal vx-step-card vx-delay-${index + 1}`}
                style={{ position: "relative" }}
              >
                <div
                  style={{ background: "rgba(13,15,46,0.7)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", borderRadius: 24, padding: 32, transition: "all 0.35s ease", textAlign: "center" }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "translateY(-8px)";
                    el.style.borderColor = `rgba(99,51,255,0.4)`;
                    el.style.boxShadow = `0 24px 60px rgba(99,51,255,0.15)`;
                    const num = el.querySelector(".vx-step-num") as HTMLElement;
                    if (num) { num.style.opacity = "1"; num.style.textShadow = "0 0 20px rgba(99,51,255,0.7)"; }
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "translateY(0)";
                    el.style.borderColor = "rgba(255,255,255,0.08)";
                    el.style.boxShadow = "none";
                    const num = el.querySelector(".vx-step-num") as HTMLElement;
                    if (num) { num.style.opacity = "0.25"; num.style.textShadow = "none"; }
                  }}
                >
                  <div
                    className="vx-step-num"
                    style={{ fontSize: 56, fontWeight: 900, background: `linear-gradient(135deg, ${gradientColors[index]}, #06d6c7)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 12, opacity: 0.25, transition: "opacity 0.3s, text-shadow 0.3s", lineHeight: 1 }}
                  >
                    {step.number}
                  </div>
                  <div
                    className="vx-step-icon"
                    style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg, ${gradientColors[index]}, #06d6c7)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: `0 8px 24px ${gradientColors[index]}44`, transition: "transform 0.3s" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "rotate(360deg)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "rotate(0)"}
                  >
                    <step.icon size={24} style={{ color: "#fff" }} />
                  </div>
                  <h4 style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{step.title}</h4>
                  <p style={{ color: "rgba(156,163,175,0.8)", fontSize: 14, lineHeight: 1.6 }}>{step.description}</p>
                </div>

                {/* Arrow connector */}
                {index < steps.length - 1 && (
                  <div style={{ position: "absolute", top: "50%", right: -20, zIndex: 20, transform: "translateY(-50%)" }}>
                    <ArrowRight size={20} style={{ color: "#06d6c7" }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile/Tablet */}
          <div className="lg:hidden" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {steps.map((step, index) => (
              <div key={index} className={`vx-reveal vx-delay-${index + 1}`}>
                <div style={{ background: "rgba(13,15,46,0.7)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", borderRadius: 20, padding: 24 }}>
                  <div style={{ display: "flex", alignItems: "start", gap: 16 }}>
                    <div style={{ fontSize: 42, fontWeight: 900, background: `linear-gradient(135deg, ${gradientColors[index]}, #06d6c7)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", opacity: 0.3, lineHeight: 1, flexShrink: 0 }}>
                      {step.number}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg, ${gradientColors[index]}, #06d6c7)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, boxShadow: `0 6px 16px ${gradientColors[index]}44` }}>
                        <step.icon size={22} style={{ color: "#fff" }} />
                      </div>
                      <h4 style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{step.title}</h4>
                      <p style={{ color: "rgba(156,163,175,0.8)", fontSize: 14, lineHeight: 1.6 }}>{step.description}</p>
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
                    <ArrowRight size={18} style={{ color: "#06d6c7", transform: "rotate(90deg)" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="vx-divider-shimmer" style={{ marginTop: 80 }} />
    </section>
  );
}
