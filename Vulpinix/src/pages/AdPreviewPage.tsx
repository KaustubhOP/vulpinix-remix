import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Smartphone, 
  Monitor, 
  Tablet, 
  TrendingUp, 
  Target, 
  CreditCard, 
  Save, 
  Instagram, 
  Facebook, 
  Youtube, 
  Globe,
  Zap,
  ChevronRight,
  Eye,
  MousePointer2,
  PieChart,
  BarChart3,
  Sparkles,
  DollarSign,
  Users,
  ChevronDown,
  Check
} from "lucide-react";
import { toast } from "sonner";
import { VulpinixLogo } from "../components/VulpinixLogo";

type Platform = "instagram-feed" | "instagram-story" | "facebook-feed" | "youtube";

export default function AdPreviewPage() {
  const navigate = useNavigate();

  // Platform Selection
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("instagram-feed");
  const [isPlatformDropdownOpen, setIsPlatformDropdownOpen] = useState(false);
  const platformDropdownRef = useRef<HTMLDivElement>(null);

  // Load Data from localStorage
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [adCreative, setAdCreative] = useState({
    caption: "Discover the future of digital marketing with AI-powered automation. Transform your content strategy today! 🚀",
    hashtags: ["#DigitalMarketing", "#AIAutomation", "#VulpinixAI"],
    cta: "Learn More"
  });
  const [campaignData, setCampaignData] = useState({
    name: "Summer Sale Campaign",
    objective: "Brand Awareness",
    platforms: ["Instagram", "Facebook", "YouTube"],
    budgetType: "Daily",
    budget: "₹5,000",
    totalAmount: "₹35,000",
    duration: "7 Days",
    locations: ["Mumbai", "Delhi"],
    audience: ["Business", "Tech"],
    languages: ["English", "Hindi"]
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (platformDropdownRef.current && !platformDropdownRef.current.contains(event.target as Node)) {
        setIsPlatformDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const savedImage = localStorage.getItem("adPreviewImage");
    if (savedImage) setPreviewImage(savedImage);

    const savedCreative = localStorage.getItem("adCreativeData");
    if (savedCreative) {
      try {
        const data = JSON.parse(savedCreative);
        setAdCreative({
          caption: data.caption || adCreative.caption,
          hashtags: data.hashtags || adCreative.hashtags,
          cta: "Learn More"
        });
      } catch {}
    }

    const savedCampaign = localStorage.getItem("campaignData");
    if (savedCampaign) {
      try {
        setCampaignData(JSON.parse(savedCampaign));
      } catch {}
    }
  }, []);

  const handleSaveDraft = () => {
    toast.success("Campaign Saved as Draft", {
      description: "You can continue editing anytime from your dashboard.",
      icon: <Save size={18} style={{ color: "#a78bfa" }} />
    });
  };

  const handleProceedToPayment = () => {
    toast.success("Proceeding to Payment", {
      description: "Redirecting to secure payment gateway...",
      icon: <CreditCard size={18} style={{ color: "#38bdf8" }} />
    });
    navigate('/payment');
  };

  const platforms = [
    { id: "instagram-feed", label: "Instagram Feed", icon: Instagram, color: "#e1306c" },
    { id: "instagram-story", label: "Instagram Story", icon: Smartphone, color: "#833ab4" },
    { id: "facebook-feed", label: "Facebook Feed", icon: Facebook, color: "#1877f2" },
    { id: "youtube", label: "YouTube Ad", icon: Youtube, color: "#ff0000" },
  ];

  const currentPlatform = platforms.find(p => p.id === selectedPlatform) || platforms[0];

  const renderAdPreview = () => {
    const commonStyle = { 
      background: "var(--vx-bg-card)", 
      border: "1px solid var(--vx-border)", 
      borderRadius: 24, 
      width: "100%", 
      maxWidth: 360, 
      overflow: "hidden", 
      boxShadow: "0 30px 60px rgba(0,0,0,0.5)" 
    };

    if (selectedPlatform === "instagram-feed") return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={commonStyle}>
        <div style={{ padding: 12, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)", border: "2px solid var(--vx-bg-card)" }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>vulpinix.ai</div>
            <div style={{ fontSize: 11, color: "var(--vx-text-muted)" }}>Sponsored</div>
          </div>
        </div>
        <div style={{ aspectRatio: "1/1", background: "var(--vx-bg-input)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {previewImage ? (
            <img src={previewImage} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Ad" />
          ) : (
            <div style={{ textAlign: "center", color: "var(--vx-text-muted)" }}>
              <Zap size={32} style={{ marginBottom: 10, opacity: 0.3 }} />
              <div style={{ fontSize: 12 }}>Visual Preview Ready</div>
            </div>
          )}
        </div>
        <div style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 16 }}>
              <span style={{ cursor: "pointer" }}>❤️</span>
              <span style={{ cursor: "pointer" }}>💬</span>
              <span style={{ cursor: "pointer" }}>✈️</span>
            </div>
            <span style={{ cursor: "pointer" }}>🔖</span>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.5, margin: 0 }}>
            <span style={{ fontWeight: 700, marginRight: 6 }}>vulpinix.ai</span>
            {adCreative.caption.substring(0, 120)}...
          </p>
          <p style={{ fontSize: 12, color: "#38bdf8", marginTop: 8 }}>{adCreative.hashtags.join(" ")}</p>
        </div>
        <button style={{ width: "100%", padding: "14px", background: "var(--vx-text-primary)", color: "var(--vx-bg-primary)", border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
          {adCreative.cta}
        </button>
      </motion.div>
    );

    if (selectedPlatform === "instagram-story") return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ ...commonStyle, maxWidth: 270, aspectRatio: "9/16", position: "relative", overflow: "hidden", background: "#000", borderRadius: 28 }}
      >
        {/* Full-bleed background */}
        <div style={{ position: "absolute", inset: 0 }}>
          {previewImage ? (
            <img src={previewImage} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Ad" />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(160deg, #2d0a5e 0%, #0f1a4a 45%, #0a2e1a 100%)" }}>
              {/* Decorative blobs */}
              <div style={{ position: "absolute", top: "25%", left: "50%", transform: "translate(-50%,-50%)", width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.5) 0%, transparent 70%)" }} />
              <div style={{ position: "absolute", top: "55%", left: "30%", width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle, rgba(56,189,248,0.35) 0%, transparent 70%)" }} />
              {/* Central brand mark */}
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-60%)", textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>⚡</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>Vulpinix AI</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 4, fontWeight: 500 }}>AI-Powered Marketing</div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom scrim gradient */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0) 100%)", zIndex: 2 }} />

        {/* Progress bars */}
        <div style={{ position: "absolute", top: 12, left: 10, right: 10, display: "flex", gap: 3, zIndex: 10 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ flex: 1, height: 2, borderRadius: 2, background: "rgba(255,255,255,0.3)", overflow: "hidden" }}>
              <div style={{ width: i === 0 ? "100%" : i === 1 ? "45%" : "0%", height: "100%", background: "#fff", borderRadius: 2 }} />
            </div>
          ))}
        </div>

        {/* Header row */}
        <div style={{ position: "absolute", top: 22, left: 10, right: 10, display: "flex", alignItems: "center", gap: 8, zIndex: 10 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(45deg,#f09433,#e6683c,#bc1888)", padding: 1.5 }}>
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "linear-gradient(135deg,#a78bfa,#38bdf8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff" }}>V</div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", lineHeight: 1 }}>vulpinix.ai</div>
            <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.6)", marginTop: 1.5 }}>Sponsored</div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", cursor: "pointer" }}>⋯</span>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", cursor: "pointer" }}>✕</span>
          </div>
        </div>

        {/* Bottom content */}
        <div style={{ position: "absolute", bottom: 44, left: 14, right: 14, zIndex: 10 }}>
          <p style={{ fontSize: 13.5, fontWeight: 700, color: "#fff", margin: "0 0 6px", lineHeight: 1.45, textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>
            {adCreative.caption.substring(0, 72)}…
          </p>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", marginBottom: 12 }}>
            {adCreative.hashtags.slice(0, 2).join("  ")}
          </div>
          {/* Link pill button */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 16px", borderRadius: 99, background: "rgba(255,255,255,0.18)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.25)", cursor: "pointer" }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>↑ Learn More</span>
          </div>
        </div>

        {/* Instagram-style reply bar */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8, zIndex: 10 }}>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.12)", borderRadius: 99, padding: "6px 12px", border: "1px solid rgba(255,255,255,0.18)", backdropFilter: "blur(6px)" }}>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>Send message</span>
          </div>
          <span style={{ fontSize: 16, cursor: "pointer" }}>❤️</span>
        </div>
      </motion.div>
    );


    if (selectedPlatform === "facebook-feed") return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={commonStyle}>
        {/* FB Header */}
        <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#a78bfa,#38bdf8)", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Vulpinix AI</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 10, color: "var(--vx-text-muted)" }}>Sponsored</span>
              <span style={{ fontSize: 10, color: "var(--vx-text-muted)" }}>·</span>
              <span style={{ fontSize: 10, color: "#1877f2" }}>🌐</span>
            </div>
          </div>
          <div style={{ fontSize: 18, color: "var(--vx-text-muted)", cursor: "pointer" }}>···</div>
        </div>
        {/* Caption */}
        <div style={{ padding: "0 14px 10px" }}>
          <p style={{ fontSize: 13, lineHeight: 1.5, margin: 0 }}>
            {adCreative.caption.substring(0, 100)}...{" "}
            <span style={{ color: "var(--vx-text-muted)", fontSize: 12 }}>See more</span>
          </p>
        </div>
        {/* Image — 1.91:1 Facebook ratio */}
        <div style={{ aspectRatio: "1.91/1", background: "var(--vx-bg-input)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {previewImage ? (
            <img src={previewImage} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Ad" />
          ) : (
            <div style={{ textAlign: "center", color: "var(--vx-text-muted)" }}>
              <Globe size={28} style={{ marginBottom: 8, opacity: 0.3 }} />
              <div style={{ fontSize: 11 }}>Ad Visual</div>
            </div>
          )}
        </div>
        {/* CTA strip */}
        <div style={{ padding: "10px 14px", background: "var(--vx-bg-input)", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--vx-border)" }}>
          <div>
            <div style={{ fontSize: 10, color: "var(--vx-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>vulpinix.ai</div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>AI-Powered Marketing</div>
          </div>
          <button style={{ padding: "8px 16px", borderRadius: 8, background: "#1877f2", color: "#fff", border: "none", fontWeight: 700, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>
            Learn More
          </button>
        </div>
        {/* Reactions bar */}
        <div style={{ padding: "10px 14px", display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--vx-border)" }}>
          {["👍 Like", "💬 Comment", "↗️ Share"].map(a => (
            <button key={a} style={{ flex: 1, background: "none", border: "none", color: "var(--vx-text-muted)", fontSize: 12, fontWeight: 600, cursor: "pointer", padding: "4px 0" }}>{a}</button>
          ))}
        </div>
      </motion.div>
    );

    if (selectedPlatform === "youtube") return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ ...commonStyle, maxWidth: 380 }}>
        {/* Video area 16:9 */}
        <div style={{ aspectRatio: "16/9", background: "#0a0a0a", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {previewImage ? (
            <img src={previewImage} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Ad" />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#1a0a2e,#0a1a3a)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 0, height: 0, borderTop: "14px solid transparent", borderBottom: "14px solid transparent", borderLeft: "22px solid #fff", marginLeft: 4 }} />
              </div>
            </div>
          )}
          {/* Skip Ad button */}
          <div style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(0,0,0,0.75)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "5px 10px", borderRadius: 4, display: "flex", alignItems: "center", gap: 4 }}>
            Skip Ad ▶
          </div>
          {/* Ad badge */}
          <div style={{ position: "absolute", top: 8, left: 8, background: "#ffdd44", color: "#000", fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 3, letterSpacing: "0.05em" }}>
            AD
          </div>
          {/* Video progress bar */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "rgba(255,255,255,0.2)" }}>
            <div style={{ width: "32%", height: "100%", background: "#ff0000" }} />
          </div>
        </div>
        {/* Channel info */}
        <div style={{ padding: "12px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#a78bfa,#38bdf8)", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>
              {adCreative.caption.substring(0, 55)}...
            </div>
            <div style={{ fontSize: 11, color: "var(--vx-text-muted)", marginTop: 3 }}>Vulpinix AI · Sponsored</div>
          </div>
        </div>
        {/* CTA */}
        <div style={{ padding: "0 14px 14px" }}>
          <button style={{ width: "100%", padding: "10px", borderRadius: 8, background: "#ff0000", color: "#fff", border: "none", fontWeight: 800, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Youtube size={16} /> Visit Website
          </button>
        </div>
      </motion.div>
    );

    return (
      <div style={{ ...commonStyle, padding: 40, textAlign: "center" }}>
        <Sparkles size={48} style={{ color: "#38bdf8", marginBottom: 20 }} />
        <h4 style={{ margin: 0 }}>{currentPlatform.label}</h4>
        <p style={{ color: "var(--vx-text-muted)", fontSize: 13, marginTop: 8 }}>Preview unavailable.</p>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        background: "var(--vx-bg-primary)",
        minHeight: "100vh",
        padding: "100px 24px 120px",
        color: "var(--vx-text-primary)"
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ marginBottom: 60 }}>
          <button 
            onClick={() => navigate("/create-ad")}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "var(--vx-text-muted)", cursor: "pointer", fontSize: 14, fontWeight: 600, marginBottom: 20, padding: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--vx-text-primary)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--vx-text-muted)"}
          >
            <ArrowLeft size={16} /> Edit Targeting
          </button>
          
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.04em", margin: 0 }}>
            Review & <span style={{ background: "linear-gradient(135deg, #a78bfa, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Launch</span>
          </h1>
          <p style={{ color: "var(--vx-text-secondary)", fontSize: 16, marginTop: 12 }}>Final check of your creative and audience reach.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 40 }}>
          
          {/* Left Column: Preview */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <div style={{ background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", borderRadius: 24, padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Ad Preview</h3>
                
                {/* Custom Platform Dropdown */}
                <div ref={platformDropdownRef} style={{ position: "relative" }}>
                  <div 
                    onClick={() => setIsPlatformDropdownOpen(!isPlatformDropdownOpen)}
                    style={{ 
                      background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", borderRadius: 10, padding: "8px 14px", 
                      color: "var(--vx-text-primary)", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" 
                    }}
                  >
                    <currentPlatform.icon size={14} style={{ color: currentPlatform.color }} />
                    <span>{currentPlatform.label}</span>
                    <ChevronDown size={14} style={{ transform: isPlatformDropdownOpen ? "rotate(180deg)" : "rotate(0)", transition: "0.3s" }} />
                  </div>
                  
                  <AnimatePresence>
                    {isPlatformDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        style={{ 
                          position: "absolute", top: "100%", right: 0, marginTop: 8, background: "#0c0d18", 
                          border: "1px solid var(--vx-border)", borderRadius: 12, overflow: "hidden", zIndex: 100, minWidth: 180, boxShadow: "0 15px 30px rgba(0,0,0,0.5)" 
                        }}
                      >
                        {platforms.map(p => (
                          <div 
                            key={p.id} 
                            onClick={() => { setSelectedPlatform(p.id as Platform); setIsPlatformDropdownOpen(false); }}
                            style={{ 
                              padding: "10px 14px", cursor: "pointer", transition: "0.2s", 
                              background: selectedPlatform === p.id ? "rgba(255,255,255,0.05)" : "transparent",
                              display: "flex", alignItems: "center", gap: 10
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                            onMouseLeave={e => e.currentTarget.style.background = selectedPlatform === p.id ? "rgba(255,255,255,0.05)" : "transparent"}
                          >
                            <p.icon size={14} style={{ color: p.color }} />
                            <span style={{ fontSize: 12, fontWeight: 600 }}>{p.label}</span>
                            {selectedPlatform === p.id && <Check size={12} style={{ color: "#38bdf8", marginLeft: "auto" }} />}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              
              <div style={{ display: "flex", justifyContent: "center", perspective: "1000px" }}>
                {renderAdPreview()}
              </div>
            </div>

            {/* AI Insights */}
            <div style={{ background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", borderRadius: 24, padding: "24px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, background: "radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, transparent 70%)" }} />
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
                <Zap size={20} style={{ color: "#38bdf8" }} /> AI Reach Analysis
              </h3>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div style={{ background: "var(--vx-bg-input)", padding: "20px", borderRadius: 20, border: "1px solid var(--vx-border)" }}>
                  <div style={{ color: "var(--vx-text-muted)", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Est. Reach</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "var(--vx-text-primary)" }}>180K+</div>
                  <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginTop: 4 }}>↑ High Velocity</div>
                </div>
                <div style={{ background: "var(--vx-bg-input)", padding: "20px", borderRadius: 20, border: "1px solid var(--vx-border)" }}>
                  <div style={{ color: "var(--vx-text-muted)", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Est. CTR</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "var(--vx-text-primary)" }}>4.2%</div>
                  <div style={{ fontSize: 11, color: "var(--vx-text-muted)", fontWeight: 700, marginTop: 4 }}>Predicted Avg.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Summary */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <div style={{ background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", borderRadius: 24, padding: "32px" }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 32 }}>Campaign Summary</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {[
                  { icon: Target, label: "Objective", value: campaignData.objective },
                  { icon: DollarSign, label: "Total Budget", value: campaignData.totalAmount },
                  { icon: Globe, label: "Locations", value: campaignData.locations.join(", ") },
                  { icon: Users, label: "Target Audience", value: campaignData.audience.join(", ") },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px", background: "var(--vx-bg-input)", borderRadius: 16, border: "1px solid var(--vx-border)" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid var(--vx-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--vx-text-muted)" }}>
                      <item.icon size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--vx-text-muted)" }}>{item.label}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--vx-text-primary)" }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 40, padding: 24, borderRadius: 24, background: "rgba(167, 139, 250, 0.05)", border: "1px dashed rgba(167, 139, 250, 0.3)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "var(--vx-text-muted)" }}>Platform Distribution</span>
                  <PieChart size={16} style={{ color: "#a78bfa" }} />
                </div>
                <div style={{ display: "flex", gap: 6, height: 6, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ flex: 4, background: "#38bdf8" }} />
                  <div style={{ flex: 3, background: "#a78bfa" }} />
                  <div style={{ flex: 3, background: "#10b981" }} />
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#38bdf8" }} /> Instagram
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#a78bfa" }} /> Facebook
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} /> YouTube
                  </div>
                </div>
              </div>
            </div>

            {/* Launch Actions */}
            <div style={{ display: "flex", gap: 16 }}>
              <button 
                onClick={handleSaveDraft}
                style={{ flex: 1, padding: "18px", borderRadius: 20, background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", color: "var(--vx-text-primary)", fontWeight: 800, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
              >
                <Save size={18} /> Save Draft
              </button>
              <button 
                onClick={handleProceedToPayment}
                style={{ flex: 2, padding: "18px", borderRadius: 20, background: "var(--vx-text-primary)", color: "var(--vx-bg-primary)", border: "none", fontWeight: 800, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
              >
                Confirm & Launch <CreditCard size={20} />
              </button>
            </div>
          </div>

        </div>

        <footer style={{ marginTop: 80, textAlign: "center", borderTop: "1px solid var(--vx-border)", paddingTop: 40 }}>
          <VulpinixLogo size="sm" />
          <p style={{ color: "var(--vx-text-muted)", fontSize: 12, marginTop: 16, letterSpacing: "0.05em", fontWeight: 600 }}>
            VULPINIX PLATFORM 1.0 — FINAL REVIEW STAGE
          </p>
        </footer>
      </div>
    </motion.div>
  );
}
