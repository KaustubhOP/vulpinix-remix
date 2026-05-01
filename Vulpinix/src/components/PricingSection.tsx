import { Check } from "lucide-react";
import { useNavigate } from "react-router";

export function PricingSection() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const isAuthenticated = !!localStorage.getItem("userInfo") || localStorage.getItem("isAuthenticated") === "true";
    if (isAuthenticated) {
      navigate("/upload");
    } else {
      const isReturning = !!localStorage.getItem("userEmail") || !!localStorage.getItem("returningUser");
      navigate(isReturning ? "/login" : "/signup");
    }
  };

  const plans = [
    {
      name: "Basic",
      price: "$49",
      period: "/month",
      features: ["Up to 10 posts per month", "AI-powered captions", "2 social platforms", "Basic analytics", "Email support"],
      popular: false,
    },
    {
      name: "Pro",
      price: "$99",
      period: "/month",
      features: ["Up to 50 posts per month", "AI-powered captions", "All social platforms", "Advanced analytics", "Priority support", "Team collaboration"],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$299",
      period: "/month",
      features: ["Unlimited posts", "AI-powered captions", "All social platforms", "Real-time analytics", "24/7 dedicated support", "Team collaboration", "Custom integrations", "White-label options"],
      popular: false,
    },
  ];

  return (
    <section id="pricing" style={{ padding: "120px 24px", position: "relative", overflow: "hidden" }}>
      <div className="vx-divider-shimmer" style={{ marginBottom: 80 }} />

      {/* Bg glow */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(99,51,255,0.08) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Heading */}
        <div className="vx-reveal" style={{ textAlign: "center", marginBottom: 70 }}>
          <div style={{ color: "#22d3ee", fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14 }}>Pricing</div>
          <h2
            className="vx-heading-underline vx-gradient-text-anim"
            style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, display: "inline-block" }}
          >
            Choose Your Plan
          </h2>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28, alignItems: "start" }}>
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`vx-reveal vx-delay-${index + 1}${plan.popular ? " vx-pro-card" : ""}`}
              style={{
                position: "relative",
                background: plan.popular
                  ? "linear-gradient(135deg, rgba(99,51,255,0.2), rgba(6,214,199,0.12))"
                  : "rgba(13,15,46,0.7)",
                border: plan.popular ? "1px solid rgba(99,51,255,0.5)" : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 28,
                padding: 36,
                backdropFilter: "blur(24px)",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.35s ease, border-color 0.35s, box-shadow 0.35s",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-8px)";
                if (!plan.popular) el.style.borderColor = "rgba(99,51,255,0.4)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(0)";
                if (!plan.popular) el.style.borderColor = "rgba(255,255,255,0.08)";
              }}
            >
              {plan.popular && (
                <div style={{ position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)" }}>
                  <div
                    className="vx-popular-badge"
                    style={{ padding: "5px 18px", borderRadius: 999, color: "#fff", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}
                  >
                    ✦ Most Popular
                  </div>
                </div>
              )}

              <div style={{ marginBottom: 28 }}>
                <h3 style={{ color: "#fff", fontSize: 22, fontWeight: 800, marginBottom: 10 }}>{plan.name}</h3>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 48, fontWeight: 900, color: "#fff" }}>{plan.price}</span>
                  <span style={{ color: "rgba(156,163,175,0.7)", fontSize: 15 }}>{plan.period}</span>
                </div>
              </div>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
                {plan.features.map((feature, fi) => (
                  <li key={fi} className={`vx-reveal vx-delay-${fi + 1}`} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{ width: 20, height: 20, borderRadius: "50%", background: "linear-gradient(135deg, #6333ff, #06d6c7)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, animation: "countPulse 0.4s ease both", animationDelay: `${fi * 0.05}s` }}
                    >
                      <Check size={12} style={{ color: "#fff" }} />
                    </div>
                    <span style={{ color: "rgba(209,213,219,0.85)", fontSize: 14 }}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={handleGetStarted}
                style={{
                  marginTop: "auto",
                  width: "100%",
                  padding: "14px",
                  borderRadius: 14,
                  border: plan.popular ? "none" : "1px solid rgba(99,51,255,0.3)",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 15,
                  color: "#fff",
                  background: plan.popular
                    ? "linear-gradient(135deg, #6333ff, #06d6c7)"
                    : "rgba(99,51,255,0.1)",
                  boxShadow: plan.popular ? "0 8px 24px rgba(99,51,255,0.4)" : "none",
                  transition: "all 0.25s",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(-2px)";
                  el.style.boxShadow = "0 12px 32px rgba(99,51,255,0.55)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = plan.popular ? "0 8px 24px rgba(99,51,255,0.4)" : "none";
                }}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="vx-divider-shimmer" style={{ marginTop: 80 }} />
    </section>
  );
}