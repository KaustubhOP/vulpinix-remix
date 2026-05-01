import { Instagram, Facebook, Linkedin, TrendingUp, Heart, MessageCircle } from "lucide-react";

export function AnalyticsSection() {
  const platforms = [
    { name: "Instagram", icon: Instagram, color: "from-pink-500 to-purple-500", barColor: "#a78bfa", likes: 8.4, likesSuffix: "M", likesDecimals: 1, comments: 1.2, commentsSuffix: "M", commentsDecimals: 1, bars: [28, 42, 35, 50, 38] },
    { name: "Facebook",  icon: Facebook,  color: "from-blue-600 to-blue-400",  barColor: "#38bdf8", likes: 3.2, likesSuffix: "M", likesDecimals: 1, comments: 890, commentsSuffix: "K", commentsDecimals: 0, bars: [22, 34, 44, 30, 40] },
    { name: "LinkedIn",  icon: Linkedin,  color: "from-blue-500 to-cyan-500",  barColor: "#4ade80", likes: 540, likesSuffix: "K", likesDecimals: 0, comments: 120, commentsSuffix: "K", commentsDecimals: 0, bars: [20, 26, 32, 24, 36] },
  ];

  const stats = [
    { icon: TrendingUp,    label: "Total Engagement", value: 82,    suffix: "%", decimals: 0, delta: "↑ 12% this week", from: "purple-600/20", border: "purple-500/30", iconColor: "#a78bfa" },
    { icon: Heart,         label: "Total Likes",      value: 12.1,  suffix: "M", decimals: 1, delta: "↑ 8% this week",  from: "cyan-600/20",  border: "cyan-500/30",  iconColor: "#22d3ee" },
    { icon: MessageCircle, label: "Total Comments",   value: 2.2,   suffix: "M", decimals: 1, delta: "↑ 15% this week", from: "blue-600/20",  border: "blue-500/30",  iconColor: "#60a5fa" },
  ];

  const statBgs = [
    { bg: "rgba(124,58,237,0.12)", border: "rgba(124,58,237,0.3)" },
    { bg: "rgba(6,182,212,0.12)",  border: "rgba(6,182,212,0.3)" },
    { bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.3)" },
  ];

  return (
    <section style={{ padding: "120px 24px", position: "relative" }}>
      <div className="vx-divider-shimmer" style={{ marginBottom: 80 }} />

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Heading */}
        <div className="vx-reveal" style={{ textAlign: "center", marginBottom: 60 }}>
          <div
            style={{ color: "#22d3ee", fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14 }}
            className="vx-cursor"
          >
            Analytics
          </div>
          <h2 className="vx-heading-underline" style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, color: "#fff", display: "inline-block" }}>
            Smart Analytics Dashboard
          </h2>
        </div>

        {/* Card */}
        <div
          className="vx-reveal"
          style={{ background: "rgba(13,15,46,0.7)", border: "1px solid rgba(99,51,255,0.2)", backdropFilter: "blur(24px)", borderRadius: 28, padding: "40px", boxShadow: "0 32px 80px rgba(99,51,255,0.12)" }}
        >
          {/* Top stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40 }}>
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`vx-reveal vx-delay-${i + 1}`}
                style={{ background: statBgs[i].bg, border: `1px solid ${statBgs[i].border}`, borderRadius: 16, padding: 24, transition: "transform 0.2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "translateY(0)"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <s.icon size={20} style={{ color: s.iconColor }} />
                  <span style={{ color: "rgba(156,163,175,0.8)", fontSize: 13 }}>{s.label}</span>
                </div>
                <div
                  data-count-target={String(s.value)}
                  data-count-suffix={s.suffix}
                  data-count-decimals={String(s.decimals || 0)}
                  style={{ fontSize: 32, fontWeight: 800, color: "#fff" }}
                >
                  {s.value.toLocaleString()}{s.suffix}
                </div>
                <div className="vx-delta" style={{ color: "#4ade80", fontSize: 13, marginTop: 6 }}>{s.delta}</div>
              </div>
            ))}
          </div>

          {/* Platform breakdown */}
          <div>
            <h4 style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Platform Performance</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {platforms.map((platform, index) => (
                <div
                  key={index}
                  className={`vx-reveal-left vx-delay-${index + 1}`}
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px 24px", transition: "all 0.25s ease", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "rgba(255,255,255,0.06)";
                    el.style.borderColor = "rgba(6,182,212,0.3)";
                    el.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "rgba(255,255,255,0.03)";
                    el.style.borderColor = "rgba(255,255,255,0.07)";
                    el.style.transform = "translateX(0)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.color} p-2.5`} style={{ width: 48, height: 48, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <platform.icon size={22} style={{ color: "#fff" }} />
                    </div>
                    <span style={{ color: "#fff", fontSize: 17, fontWeight: 600 }}>{platform.name}</span>
                  </div>

                  <div style={{ display: "flex", gap: 32 }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ color: "rgba(156,163,175,0.7)", fontSize: 12, marginBottom: 4 }}>Likes</div>
                      <div
                        data-count-target={String(platform.likes)}
                        data-count-suffix={platform.likesSuffix}
                        data-count-decimals={String(platform.likesDecimals)}
                        style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}
                      >
                        {platform.likes.toLocaleString()}{platform.likesSuffix}
                      </div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ color: "rgba(156,163,175,0.7)", fontSize: 12, marginBottom: 4 }}>Comments</div>
                      <div
                        data-count-target={String(platform.comments)}
                        data-count-suffix={platform.commentsSuffix}
                        data-count-decimals={String(platform.commentsDecimals)}
                        style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}
                      >
                        {platform.comments.toLocaleString()}{platform.commentsSuffix}
                      </div>
                    </div>
                  </div>

                  {/* Mini bar chart — grows from bottom */}
                  <div className="vx-chart-group" style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 50 }}>
                    {platform.bars.map((h, i) => (
                      <div
                        key={i}
                        className="vx-chart-bar"
                        style={{ width: 8, height: h, borderRadius: 4, background: `linear-gradient(to top, ${platform.barColor}, rgba(6,182,212,0.7))`, transitionDelay: `${i * 0.06}s`, transformOrigin: "bottom" }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="vx-divider-shimmer" style={{ marginTop: 80 }} />
    </section>
  );
}
