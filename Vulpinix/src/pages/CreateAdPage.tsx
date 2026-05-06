import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Target, 
  DollarSign, 
  MapPin, 
  Users, 
  Languages, 
  Zap, 
  TrendingUp, 
  ChevronRight, 
  Sparkles,
  Globe,
  Plus,
  X,
  ChevronDown,
  Check
} from "lucide-react";
import { toast } from "sonner";

interface AudienceOption {
  id: string;
  name: string;
  icon: string;
  selected: boolean;
}

export default function CreateAdPage() {
  const navigate = useNavigate();
  
  // Campaign Details
  const [campaignName, setCampaignName] = useState("");
  const [campaignObjective, setCampaignObjective] = useState("brand-awareness");
  const [isObjDropdownOpen, setIsObjDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Budget Configuration
  const [budgetType, setBudgetType] = useState<"daily" | "campaign">("daily");
  const [budget, setBudget] = useState(5000);
  const [currency, setCurrency] = useState("₹");
  const [campaignDuration, setCampaignDuration] = useState(7);
  
  // Location Targeting
  const [locationType, setLocationType] = useState<"worldwide" | "india" | "custom">("india");
  const [customLocations, setCustomLocations] = useState<string[]>(["Mumbai", "Delhi"]);
  const [locationSearch, setLocationSearch] = useState("");
  
  // Audience Selection
  const [audiences, setAudiences] = useState<AudienceOption[]>([
    { id: "gaming", name: "Gaming", icon: "🎮", selected: false },
    { id: "travel", name: "Travel", icon: "✈️", selected: false },
    { id: "business", name: "Business", icon: "💼", selected: true },
    { id: "shopping", name: "Shopping", icon: "🛍️", selected: false },
    { id: "students", name: "Students", icon: "🎓", selected: false },
    { id: "fitness", name: "Fitness", icon: "🏋️", selected: false },
    { id: "entertainment", name: "Entertainment", icon: "🎵", selected: false },
    { id: "tech", name: "Tech", icon: "📱", selected: true },
  ]);
  
  // Language Preferences
  const [languages, setLanguages] = useState([
    { id: "en", name: "English", selected: true },
    { id: "hi", name: "Hindi", selected: true },
    { id: "mr", name: "Marathi", selected: false },
    { id: "ta", name: "Tamil", selected: false },
    { id: "te", name: "Telugu", selected: false },
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsObjDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleAudience = (id: string) => {
    setAudiences(audiences.map(a => a.id === id ? { ...a, selected: !a.selected } : a));
  };

  const removeLocation = (location: string) => {
    setCustomLocations(customLocations.filter(l => l !== location));
  };

  const addLocation = (location: string) => {
    if (location && !customLocations.includes(location)) {
      setCustomLocations([...customLocations, location]);
      setLocationSearch("");
    }
  };

  const estimatedReachBase = Math.floor(budget * 2.5 * (budgetType === "campaign" ? 0.1 : 1));
  const selectedAudiences = audiences.filter(a => a.selected);
  const selectedLanguages = languages.filter(l => l.selected);

  const objectives = [
    { value: "brand-awareness", label: "Brand Awareness", desc: "Reach maximum people" },
    { value: "traffic", label: "Traffic", desc: "Get more website visits" },
    { value: "engagement", label: "Engagement", desc: "More likes & comments" },
    { value: "leads", label: "Leads", desc: "Find interested customers" },
    { value: "sales", label: "Sales", desc: "Drive direct conversions" },
  ];

  const currentObjective = objectives.find(o => o.value === campaignObjective) || objectives[0];

  const handleContinueToPreview = () => {
    if (!campaignName) {
      toast.error("Please enter a campaign name");
      return;
    }
    
    const totalAmount = budgetType === "daily" ? budget * campaignDuration : budget;
    const savedCreative = localStorage.getItem("adCreativeData");
    let platforms = ["Instagram", "Facebook", "YouTube"];
    if (savedCreative) {
      try {
        const creativeData = JSON.parse(savedCreative);
        platforms = creativeData.platforms || platforms;
      } catch {}
    }
    
    const campaignData = {
      name: campaignName,
      objective: currentObjective.label,
      platforms: platforms,
      budgetType: budgetType === "daily" ? "Daily" : "Campaign",
      budget: `${currency}${budget.toLocaleString()}`,
      totalAmount: `${currency}${totalAmount.toLocaleString()}`,
      duration: `${campaignDuration} Days`,
      locations: locationType === "worldwide" ? ["Worldwide"] : 
                 locationType === "india" ? ["India"] : 
                 customLocations,
      audience: selectedAudiences.map(a => a.name),
      languages: selectedLanguages.map(l => l.name)
    };
    
    localStorage.setItem("campaignData", JSON.stringify(campaignData));
    navigate("/ad-preview");
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
        color: "var(--vx-text-primary)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Background Decor */}
      <div style={{ position: "absolute", top: "10%", left: "-10%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(167, 139, 250, 0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "-10%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(56, 189, 248, 0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 820, margin: "0 auto", position: "relative", zIndex: 1 }}>
        
        {/* Header Section */}
        <div style={{ marginBottom: 60 }}>
          <button 
            onClick={() => navigate("/upload")}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "var(--vx-text-muted)", cursor: "pointer", fontSize: 14, fontWeight: 600, marginBottom: 20, padding: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--vx-text-primary)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--vx-text-muted)"}
          >
            <ArrowLeft size={16} /> Back to Content
          </button>
          
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 12px", borderRadius: 99, background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--vx-text-muted)" }}>
              <Zap size={12} fill="currentColor" /> Campaign Setup
            </div>
          </div>
          
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.04em", margin: 0, lineHeight: 1 }}>
            Configure Your <span style={{ background: "linear-gradient(135deg, #a78bfa, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Campaign</span>
          </h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }}>
          
          {/* Step 1: Specs */}
          <div style={{ background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", borderRadius: 24, padding: "32px", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, var(--vx-border), transparent)" }} />
            
            <div style={{ display: "flex", gap: 24, alignItems: "flex-start", marginBottom: 32 }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--vx-text-primary)", flexShrink: 0 }}>
                <Target size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Campaign Specs</h3>
                <p style={{ color: "var(--vx-text-muted)", fontSize: 14 }}>Name your campaign and choose your primary objective.</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <label style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--vx-text-muted)" }}>Campaign Name</label>
                <input 
                  type="text" 
                  value={campaignName}
                  onChange={e => setCampaignName(e.target.value)}
                  placeholder="e.g. Summer Collection Launch"
                  style={{ background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", borderRadius: 12, padding: "14px 18px", color: "var(--vx-text-primary)", fontSize: 15, fontWeight: 500, outline: "none" }}
                />
              </div>

              {/* Custom Objective Dropdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <label style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--vx-text-muted)" }}>Campaign Objective</label>
                <div ref={dropdownRef} style={{ position: "relative" }}>
                  <div 
                    onClick={() => setIsObjDropdownOpen(!isObjDropdownOpen)}
                    style={{ 
                      background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", borderRadius: 12, padding: "14px 18px", 
                      color: "var(--vx-text-primary)", fontSize: 15, fontWeight: 600, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" 
                    }}
                  >
                    <span>{currentObjective.label}</span>
                    <ChevronDown size={18} style={{ transform: isObjDropdownOpen ? "rotate(180deg)" : "rotate(0)", transition: "0.3s" }} />
                  </div>
                  
                  <AnimatePresence>
                    {isObjDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        style={{ 
                          position: "absolute", top: "100%", left: 0, right: 0, marginTop: 8, background: "#0c0d18", 
                          border: "1px solid var(--vx-border)", borderRadius: 16, overflow: "hidden", zIndex: 100, boxShadow: "0 20px 40px rgba(0,0,0,0.4)" 
                        }}
                      >
                        {objectives.map(o => (
                          <div 
                            key={o.value} 
                            onClick={() => { setCampaignObjective(o.value); setIsObjDropdownOpen(false); }}
                            style={{ 
                              padding: "14px 18px", cursor: "pointer", transition: "0.2s", 
                              background: campaignObjective === o.value ? "rgba(255,255,255,0.05)" : "transparent",
                              display: "flex", justifyContent: "space-between", alignItems: "center"
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                            onMouseLeave={e => e.currentTarget.style.background = campaignObjective === o.value ? "rgba(255,255,255,0.05)" : "transparent"}
                          >
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--vx-text-primary)" }}>{o.label}</div>
                              <div style={{ fontSize: 11, color: "var(--vx-text-muted)" }}>{o.desc}</div>
                            </div>
                            {campaignObjective === o.value && <Check size={16} style={{ color: "#38bdf8" }} />}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Budget */}
          <div style={{ background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", borderRadius: 24, padding: "32px" }}>
            <div style={{ display: "flex", gap: 24, alignItems: "flex-start", marginBottom: 32 }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--vx-text-primary)", flexShrink: 0 }}>
                <DollarSign size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Budget & Schedule</h3>
                <p style={{ color: "var(--vx-text-muted)", fontSize: 14 }}>Allocate your spend and define the campaign duration.</p>
              </div>
            </div>

            <div style={{ background: "var(--vx-bg-input)", borderRadius: 24, padding: "32px", border: "1px solid var(--vx-border)", marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 32 }}>
                <button onClick={() => setBudgetType("daily")} style={{ padding: "10px 20px", borderRadius: 12, border: "1px solid var(--vx-border)", background: budgetType === "daily" ? "var(--vx-text-primary)" : "transparent", color: budgetType === "daily" ? "var(--vx-bg-primary)" : "var(--vx-text-muted)", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "0.2s" }}>Daily Budget</button>
                <button onClick={() => setBudgetType("campaign")} style={{ padding: "10px 20px", borderRadius: 12, border: "1px solid var(--vx-border)", background: budgetType === "campaign" ? "var(--vx-text-primary)" : "transparent", color: budgetType === "campaign" ? "var(--vx-bg-primary)" : "var(--vx-text-muted)", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "0.2s" }}>Total Budget</button>
              </div>

              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <div style={{ fontSize: 48, fontWeight: 800, color: "var(--vx-text-primary)", letterSpacing: "-0.04em" }}>{currency}{budget.toLocaleString()}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--vx-text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>{budgetType === "daily" ? "Estimated Daily Spend" : "Total Campaign Budget"}</div>
              </div>

              <input 
                type="range" min="500" max="100000" step="500" value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                style={{ width: "100%", height: 6, borderRadius: 3, background: "var(--vx-border)", appearance: "none", outline: "none", cursor: "pointer" }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--vx-bg-input)", padding: "16px 24px", borderRadius: 16, border: "1px solid var(--vx-border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: "var(--vx-text-primary)" }}>Duration</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--vx-text-muted)" }}>{campaignDuration} Days</span>
              </div>
              <input 
                type="range" min="1" max="60" value={campaignDuration}
                onChange={e => setCampaignDuration(Number(e.target.value))}
                style={{ width: "200px" }}
              />
            </div>
          </div>

          {/* Step 3: Audience & Location */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
            
            {/* Location with Map Graphic */}
            <div style={{ background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", borderRadius: 32, padding: "40px", position: "relative", overflow: "hidden" }}>
              
              {/* Stylized Map Graphic in Background */}
              <div style={{ position: "absolute", top: 0, right: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.15 }}>
                <svg viewBox="0 0 800 400" style={{ width: "100%", height: "100%" }}>
                  <path d="M150,150 Q200,100 250,150 T350,150 T450,150 T550,150 T650,150" fill="none" stroke="var(--vx-text-primary)" strokeWidth="0.5" strokeDasharray="4 4" />
                  <circle cx="200" cy="150" r="3" fill="#38bdf8" />
                  <circle cx="300" cy="180" r="3" fill="#a78bfa" />
                  <circle cx="500" cy="120" r="3" fill="#38bdf8" />
                  <circle cx="600" cy="220" r="3" fill="#a78bfa" />
                  {/* Simplistic World Outlines */}
                  <path d="M100,200 L120,180 L150,190 L180,170 L200,190 L220,180 L250,200 L230,220 L200,210 L180,230 L150,220 L120,240 Z" fill="rgba(255,255,255,0.05)" />
                  <path d="M400,150 L430,130 L470,140 L500,120 L530,140 L550,160 L530,190 L500,200 L470,180 L430,190 L410,170 Z" fill="rgba(255,255,255,0.05)" />
                </svg>
              </div>

              <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 24, position: "relative", zIndex: 1 }}>
                <MapPin size={24} style={{ color: "var(--vx-text-primary)" }} />
                <h3 style={{ fontSize: 20, fontWeight: 800 }}>Location Targeting</h3>
              </div>
              
              <div style={{ display: "flex", gap: 8, marginBottom: 20, position: "relative", zIndex: 1 }}>
                <button onClick={() => setLocationType("worldwide")} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid var(--vx-border)", background: locationType === "worldwide" ? "var(--vx-text-primary)" : "var(--vx-bg-input)", color: locationType === "worldwide" ? "var(--vx-bg-primary)" : "var(--vx-text-primary)", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Worldwide</button>
                <button onClick={() => setLocationType("india")} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid var(--vx-border)", background: locationType === "india" ? "var(--vx-text-primary)" : "var(--vx-bg-input)", color: locationType === "india" ? "var(--vx-bg-primary)" : "var(--vx-text-primary)", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>India</button>
                <button onClick={() => setLocationType("custom")} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid var(--vx-border)", background: locationType === "custom" ? "var(--vx-text-primary)" : "var(--vx-bg-input)", color: locationType === "custom" ? "var(--vx-bg-primary)" : "var(--vx-text-primary)", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Custom</button>
              </div>

              {locationType === "custom" && (
                <div style={{ position: "relative", zIndex: 1 }}>
                  <input 
                    type="text" 
                    placeholder="Search locations..."
                    value={locationSearch}
                    onChange={e => setLocationSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addLocation(locationSearch)}
                    style={{ width: "100%", background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", borderRadius: 12, padding: "12px 16px", color: "var(--vx-text-primary)", outline: "none", marginBottom: 12 }}
                  />
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {customLocations.map(loc => (
                      <div key={loc} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid var(--vx-border)", fontSize: 12, fontWeight: 600 }}>
                        {loc} <X size={14} style={{ cursor: "pointer" }} onClick={() => removeLocation(loc)} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {locationType !== "custom" && (
                <div style={{ color: "var(--vx-text-muted)", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
                  <Globe size={16} /> Targeted to {locationType === "worldwide" ? "all regions" : "India only"}
                </div>
              )}
            </div>

            {/* Audience */}
            <div style={{ background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", borderRadius: 24, padding: "32px" }}>
              <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 24 }}>
                <Users size={24} style={{ color: "var(--vx-text-primary)" }} />
                <h3 style={{ fontSize: 20, fontWeight: 800 }}>Target Audience</h3>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                {audiences.map(aud => (
                  <button 
                    key={aud.id}
                    onClick={() => toggleAudience(aud.id)}
                    style={{ 
                      aspectRatio: "1/1", borderRadius: 16, border: "1px solid var(--vx-border)", 
                      background: aud.selected ? "var(--vx-text-primary)" : "var(--vx-bg-input)", 
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer", transition: "0.2s" 
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{aud.icon}</span>
                    <span style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", color: aud.selected ? "var(--vx-bg-primary)" : "var(--vx-text-muted)" }}>{aud.name}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Action Footer */}
          <div style={{ background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", borderRadius: 32, padding: "40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 32 }}>
            <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: 20, background: "rgba(167, 139, 250, 0.1)", border: "1px solid rgba(167, 139, 250, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#a78bfa" }}>
                <Sparkles size={32} />
              </div>
              <div>
                <h4 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Daily Estimated Reach</h4>
                <div style={{ fontSize: 28, fontWeight: 800, color: "var(--vx-text-primary)" }}>
                  {estimatedReachBase.toLocaleString()} <span style={{ fontSize: 14, color: "var(--vx-text-muted)", fontWeight: 600 }}>People</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleContinueToPreview}
              style={{ padding: "18px 40px", borderRadius: 16, background: "var(--vx-text-primary)", color: "var(--vx-bg-primary)", border: "none", fontWeight: 800, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, transition: "transform 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              Continue to Preview <ChevronRight size={20} />
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
