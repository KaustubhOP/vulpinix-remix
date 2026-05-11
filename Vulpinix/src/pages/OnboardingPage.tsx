import { useState } from "react";
import { useNavigate } from "react-router";
import { API_BASE } from "../config/api";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Building2,
  Phone,
  Globe,
  MapPin,
  Briefcase,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { VulpinixLogo } from "../components/VulpinixLogo";

const INDUSTRIES = [
  "E-Commerce", "Food & Beverage", "Fashion & Apparel", "Technology",
  "Healthcare", "Education", "Real Estate", "Finance & Banking",
  "Travel & Hospitality", "Beauty & Wellness", "Automotive", "Entertainment",
  "Retail", "Sports & Fitness", "Non-Profit", "Other",
];

const BUSINESS_TYPES = [
  { label: "Startup", icon: "🚀" },
  { label: "Small Business", icon: "🏪" },
  { label: "Agency", icon: "🏢" },
  { label: "Enterprise", icon: "🏛️" },
  { label: "Freelancer", icon: "💼" },
  { label: "Creator / Influencer", icon: "🎥" },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    company: "",
    phone: "",
    industry: "",
    location: "",
    website: "",
    businessType: "",
  });

  const userInfo = (() => {
    try { return JSON.parse(localStorage.getItem("userInfo") || "{}"); }
    catch { return {}; }
  })();

  const firstName = userInfo.name?.split(" ")[0] || "there";

  const update = (key: string, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.company || !form.businessType || !form.industry) {
      toast.error("Please fill in the required fields (business name, type & industry).");
      return;
    }
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        const res = await fetch(`${API_BASE}/api/users/profile`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (data.success) {
          // Merge updated fields into local userInfo
          const updated = { ...userInfo, ...data.user };
          localStorage.setItem("userInfo", JSON.stringify(updated));
        }
      } else {
        // Offline fallback — save to localStorage only
        const updated = { ...userInfo, ...form };
        localStorage.setItem("userInfo", JSON.stringify(updated));
      }

      toast.success("Welcome to Vulpinix! 🎉", {
        description: "Your account is all set up.",
      });
      navigate("/upload");
    } catch (err) {
      console.error("Onboarding save error:", err);
      // Even on error, persist locally and continue
      const updated = { ...userInfo, ...form };
      localStorage.setItem("userInfo", JSON.stringify(updated));
      navigate("/upload");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    const updated = { ...userInfo, onboardingCompleted: true };
    localStorage.setItem("userInfo", JSON.stringify(updated));
    navigate("/upload");
  };

  const TOTAL_STEPS = 2;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#07080f",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "'Inter', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background blobs */}
      <div style={{ position: "fixed", top: -150, left: -150, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(109,40,217,0.25) 0%, transparent 70%)", filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -100, right: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)", filter: "blur(80px)", pointerEvents: "none" }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 520,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 24,
          padding: "40px 36px",
          boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03) inset",
        }}
      >
        {/* Top gradient line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.5), rgba(6,182,212,0.4), transparent)", borderRadius: "24px 24px 0 0" }} />

        {/* Logo */}
        <VulpinixLogo size="md" style={{ justifyContent: "center", marginBottom: 28 }} />

        {/* Progress bar */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "rgba(160,160,190,0.6)", fontWeight: 600 }}>
              Step {step} of {TOTAL_STEPS}
            </span>
            <span style={{ fontSize: 12, color: "#a78bfa", fontWeight: 700 }}>
              {Math.round((step / TOTAL_STEPS) * 100)}%
            </span>
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden" }}>
            <motion.div
              animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              style={{ height: "100%", background: "linear-gradient(90deg, #7c3aed, #06b6d4)", borderRadius: 999 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* ── STEP 1: Business Basics ── */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 6, letterSpacing: "-0.025em" }}>
                  Hey {firstName}, let's set up your profile ✦
                </h1>
                <p style={{ fontSize: 13, color: "rgba(160,160,190,0.6)", lineHeight: 1.55 }}>
                  Tell us a bit about your business so we can tailor your experience.
                </p>
              </div>

              {/* Business Name */}
              <label style={labelStyle}>Business / Brand Name *</label>
              <div style={{ position: "relative", marginBottom: 14 }}>
                <Building2 size={16} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "rgba(130,130,170,0.5)" }} />
                <input
                  style={inputStyle}
                  placeholder="e.g. Acme Corp"
                  value={form.company}
                  onChange={e => update("company", e.target.value)}
                />
              </div>

              {/* Phone */}
              <label style={labelStyle}>Phone Number</label>
              <div style={{ position: "relative", marginBottom: 14 }}>
                <Phone size={16} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "rgba(130,130,170,0.5)" }} />
                <input
                  style={inputStyle}
                  placeholder="+91 98765 43210"
                  type="tel"
                  value={form.phone}
                  onChange={e => update("phone", e.target.value)}
                />
              </div>

              {/* Location */}
              <label style={labelStyle}>City / Location</label>
              <div style={{ position: "relative", marginBottom: 14 }}>
                <MapPin size={16} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "rgba(130,130,170,0.5)" }} />
                <input
                  style={inputStyle}
                  placeholder="e.g. Mumbai, India"
                  value={form.location}
                  onChange={e => update("location", e.target.value)}
                />
              </div>

              {/* Website */}
              <label style={labelStyle}>Website (optional)</label>
              <div style={{ position: "relative", marginBottom: 24 }}>
                <Globe size={16} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "rgba(130,130,170,0.5)" }} />
                <input
                  style={inputStyle}
                  placeholder="https://yourwebsite.com"
                  type="url"
                  value={form.website}
                  onChange={e => update("website", e.target.value)}
                />
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!form.company}
                style={submitStyle(!!form.company)}
              >
                Continue <ArrowRight size={16} />
              </button>
            </motion.div>
          )}

          {/* ── STEP 2: Business Type & Industry ── */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 6, letterSpacing: "-0.025em" }}>
                  Almost done! 🎯
                </h1>
                <p style={{ fontSize: 13, color: "rgba(160,160,190,0.6)", lineHeight: 1.55 }}>
                  Select your business type and industry to help us optimise your campaigns.
                </p>
              </div>

              {/* Business Type */}
              <label style={labelStyle}>I am a... *</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
                {BUSINESS_TYPES.map(bt => (
                  <button
                    key={bt.label}
                    type="button"
                    onClick={() => update("businessType", bt.label)}
                    style={{
                      padding: "10px 8px",
                      borderRadius: 10,
                      border: `1px solid ${form.businessType === bt.label ? "rgba(124,58,237,0.6)" : "rgba(255,255,255,0.08)"}`,
                      background: form.businessType === bt.label ? "rgba(124,58,237,0.15)" : "rgba(255,255,255,0.03)",
                      color: form.businessType === bt.label ? "#c4b5fd" : "rgba(200,200,220,0.6)",
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.2s",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{bt.icon}</div>
                    {bt.label}
                  </button>
                ))}
              </div>

              {/* Industry */}
              <label style={labelStyle}>Industry *</label>
              <div style={{ position: "relative", marginBottom: 24 }}>
                <Briefcase size={16} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "rgba(130,130,170,0.5)", zIndex: 1 }} />
                <select
                  style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                  value={form.industry}
                  onChange={e => update("industry", e.target.value)}
                >
                  <option value="" disabled>Select your industry</option>
                  {INDUSTRIES.map(ind => (
                    <option key={ind} value={ind} style={{ background: "#0f1020" }}>{ind}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    flex: 1,
                    padding: "13px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.04)",
                    color: "rgba(200,200,220,0.7)",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!form.businessType || !form.industry || isSubmitting}
                  style={{ ...submitStyle(!!(form.businessType && form.industry) && !isSubmitting), flex: 2 }}
                >
                  {isSubmitting ? (
                    <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "ob-spin 0.7s linear infinite" }} />
                  ) : (
                    <><Sparkles size={16} /> Launch Dashboard</>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skip link */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button
            onClick={handleSkip}
            style={{ background: "none", border: "none", color: "rgba(130,130,170,0.45)", fontSize: 12, cursor: "pointer", fontFamily: "'Inter', sans-serif", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#a78bfa")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(130,130,170,0.45)")}
          >
            Skip for now →
          </button>
        </div>

        {/* Secure badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 20, fontSize: 11, color: "rgba(120,120,150,0.35)" }}>
          <CheckCircle2 size={12} style={{ color: "#10b981" }} />
          Your data is encrypted and never sold
        </div>
      </motion.div>

      <style>{`
        @keyframes ob-spin { to { transform: rotate(360deg); } }
        option { background: #0f1020; color: #e2e8f0; }
      `}</style>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  color: "rgba(180,180,210,0.7)",
  marginBottom: 6,
  textTransform: "uppercase",
  letterSpacing: "0.07em",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: 10,
  padding: "12px 14px 12px 38px",
  fontSize: 14,
  color: "#fff",
  fontFamily: "'Inter', sans-serif",
  outline: "none",
  boxSizing: "border-box",
};

const submitStyle = (enabled: boolean): React.CSSProperties => ({
  width: "100%",
  padding: "13px",
  border: "none",
  borderRadius: 12,
  background: enabled
    ? "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)"
    : "rgba(255,255,255,0.05)",
  color: enabled ? "#fff" : "rgba(200,200,220,0.3)",
  fontFamily: "'Inter', sans-serif",
  fontSize: 14,
  fontWeight: 700,
  cursor: enabled ? "pointer" : "not-allowed",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  transition: "all 0.25s",
  boxShadow: enabled ? "0 8px 24px rgba(124,58,237,0.35)" : "none",
});
