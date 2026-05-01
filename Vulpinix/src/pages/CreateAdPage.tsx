import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import './UploadPage.css';

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
    { id: "es", name: "Spanish", selected: false },
    { id: "fr", name: "French", selected: false },
  ]);

  const toggleAudience = (id: string) => {
    setAudiences(audiences.map(a => a.id === id ? { ...a, selected: !a.selected } : a));
  };

  const toggleLanguage = (id: string) => {
    setLanguages(languages.map(l => l.id === id ? { ...l, selected: !l.selected } : l));
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

  // Counter animation logic
  const [reachNum, setReachNum] = useState(0);
  
  useEffect(() => {
    let current = 0;
    const timer = setInterval(() => {
      current += Math.ceil(estimatedReachBase / 20);
      if(current >= estimatedReachBase){
         current = estimatedReachBase;
         clearInterval(timer);
      }
      setReachNum(current);
    }, 25);
    return () => clearInterval(timer);
  }, [estimatedReachBase]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollBar = document.getElementById('scrollBar');
      if(scrollBar) {
         const s = document.documentElement;
         if(s.scrollHeight - s.clientHeight > 0) {
             const p = (s.scrollTop / (s.scrollHeight - s.clientHeight)) * 100;
             scrollBar.style.width = p + '%';
         }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleContinueToPreview = () => {
    const totalAmount = budgetType === "daily" ? budget * campaignDuration : budget;
    const savedCreative = localStorage.getItem("adCreativeData");
    let platforms = ["Instagram", "Facebook", "YouTube"];
    if (savedCreative) {
      const creativeData = JSON.parse(savedCreative);
      platforms = creativeData.platforms || platforms;
    }
    
    const campaignData = {
      name: campaignName || "Summer Sale Campaign",
      objective: campaignObjective === "brand-awareness" ? "Brand Awareness" : 
                 campaignObjective === "conversions" ? "Conversions" : 
                 campaignObjective === "traffic" ? "Traffic" : "Brand Awareness",
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

  const objectives = [
    { value: "brand-awareness", label: "Brand Awareness" },
    { value: "traffic", label: "Traffic" },
    { value: "engagement", label: "Engagement" },
    { value: "leads", label: "Leads" },
    { value: "sales", label: "Sales / Conversions" },
  ];

  return (
    <div className="upload-page-wrapper">
       <div className="scroll-bar" id="scrollBar"></div>
       <div className="cosmos">
         <div className="orb orb1"></div>
         <div className="orb orb2"></div>
         <div className="orb orb3"></div>
       </div>
       <div className="grid-bg"></div>
       <div className="depth-ring"></div>
       <div className="depth-ring"></div>
       <div className="depth-ring"></div>

       <div className="page" style={{maxWidth: '800px'}}>
          <button className="back" onClick={() => navigate("/upload")}>← Back to Upload</button>

          <div className="page-header">
            <div className="page-eyebrow"><span className="eyebrow-dot"></span>VULPINIX AI 1.0</div>
            <div className="page-title">Create Ad<br/>Campaign</div>
            <div className="page-sub">Define your goals, audience, and budget with precision</div>
          </div>

          {/* SECTION 1 - Campaign Details */}
          <div className="section-card delay-0">
            <div className="card-glow"></div>
            <div className="section-label"><span className="section-label-dot"></span>01 — Campaign Specs</div>
            
            <div className="input-row" style={{gridTemplateColumns: '1fr'}}>
              <div className="input-group">
                <div className="input-label">📝 Campaign Name</div>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Eg: Summer Sale Campaign"
                  className="input-field"
                />
              </div>
              
              <div className="input-group" style={{marginTop: '12px'}}>
                <div className="input-label" style={{color: 'rgba(0,212,200,0.7)'}}>🎯 Objective</div>
                <select
                  value={campaignObjective}
                  onChange={(e) => setCampaignObjective(e.target.value)}
                  className="input-field"
                  style={{borderColor: 'rgba(0,212,200,0.15)'}}
                >
                  {objectives.map(obj => (
                    <option key={obj.value} value={obj.value}>{obj.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2 - Budget */}
          <div className="section-card delay-1">
            <div className="card-glow"></div>
            <div className="section-label"><span className="section-label-dot"></span>02 — Budget & Config</div>
            
            <div className="ai-btns">
              <button 
                className={`btn-ai ${budgetType === 'daily' ? 'btn-ai-yes' : 'btn-ai-no'}`}
                onClick={() => setBudgetType("daily")}
              >
                🌞 Daily Budget
              </button>
              <button 
                className={`btn-ai ${budgetType === 'campaign' ? 'btn-ai-yes' : 'btn-ai-no'}`}
                onClick={() => setBudgetType("campaign")}
              >
                📦 Campaign Budget
              </button>
            </div>

            <div style={{display:'flex', gap:'8px', marginBottom:'24px', justifyContent:'center'}}>
               <button onClick={() => setCurrency("₹")} className={`plat-tag ${currency === '₹' ? 'active' : ''}`} style={currency === '₹' ? {background:'var(--purple)', color:'#fff', borderColor:'var(--purple)'} : {cursor: 'pointer'}}>₹ INR</button>
               <button onClick={() => setCurrency("$")} className={`plat-tag ${currency === '$' ? 'active' : ''}`} style={currency === '$' ? {background:'var(--teal)', color:'#fff', borderColor:'var(--teal)'} : {cursor: 'pointer'}}>$ USD</button>
            </div>

            <div style={{textAlign:'center', marginBottom:'32px'}}>
              <div style={{fontFamily:"'Syne', sans-serif", fontSize:'42px', fontWeight:700, color:'#fff', marginBottom:'4px'}}>{currency}{budget.toLocaleString()}</div>
              <div style={{fontSize:'12px', color:'var(--muted)'}}>{budgetType === "daily" ? "per day" : "total campaign budget"}</div>
            </div>

            <div style={{marginBottom: '24px'}}>
              <input
                type="range"
                min="100"
                max="500000"
                step="100"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
              />
            </div>

            <div style={{marginBottom: '16px'}}>
               <div style={{display:'flex', justifyContent:'space-between', marginBottom:'8px'}}>
                 <div className="input-label" style={{margin:0}}>⏳ Duration: {campaignDuration} Days</div>
                 <div style={{fontSize:'12px', color:'var(--teal)'}}>
                   {budgetType === "daily" 
                     ? `Total: ${currency}${(budget * campaignDuration).toLocaleString()}`
                     : `Daily avg: ${currency}${Math.floor(budget / campaignDuration).toLocaleString()}`}
                 </div>
               </div>
               <input
                 type="range"
                 min="1"
                 max="90"
                 step="1"
                 value={campaignDuration}
                 onChange={(e) => setCampaignDuration(Number(e.target.value))}
               />
            </div>
          </div>

          {/* SECTION 3 - Locations */}
          <div className="section-card delay-2">
            <div className="card-glow"></div>
            <div className="section-label"><span className="section-label-dot"></span>03 — Targeting</div>
            
            <div className="platform-grid" style={{gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '16px'}}>
              <div className={`plat-card ${locationType === 'worldwide' ? 'active' : ''}`} onClick={() => setLocationType('worldwide')}>
                 <div className="plat-top" style={{justifyContent:'center', marginBottom:0}}>
                    <div className="plat-icon" style={{background:'rgba(255,255,255,0.05)', fontSize:'22px'}}>🌍</div>
                 </div>
                 <div className="plat-name" style={{textAlign:'center', marginTop:'8px'}}>Worldwide</div>
              </div>
              <div className={`plat-card ${locationType === 'india' ? 'active' : ''}`} onClick={() => setLocationType('india')}>
                 <div className="plat-top" style={{justifyContent:'center', marginBottom:0}}>
                    <div className="plat-icon" style={{background:'rgba(255,255,255,0.05)', fontSize:'22px'}}>🇮🇳</div>
                 </div>
                 <div className="plat-name" style={{textAlign:'center', marginTop:'8px'}}>India</div>
              </div>
              <div className={`plat-card ${locationType === 'custom' ? 'active' : ''}`} onClick={() => setLocationType('custom')}>
                 <div className="plat-top" style={{justifyContent:'center', marginBottom:0}}>
                    <div className="plat-icon" style={{background:'rgba(255,255,255,0.05)', fontSize:'22px'}}>📍</div>
                 </div>
                 <div className="plat-name" style={{textAlign:'center', marginTop:'8px'}}>Custom</div>
              </div>
            </div>

            {locationType === "custom" && (
               <div>
                  <div className="input-group" style={{marginBottom: '12px'}}>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Search city, area, or pin code (Press Enter)"
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      onKeyPress={(e) => {
                         if (e.key === "Enter") {
                           e.preventDefault();
                           addLocation(locationSearch);
                         }
                      }}
                    />
                    <span className="input-icon" onClick={() => addLocation(locationSearch)}>🔍</span>
                  </div>
                  <div className="plat-tags" style={{justifyContent:'flex-start'}}>
                    {customLocations.map(loc => (
                       <div key={loc} className="plat-tag" style={{cursor: 'pointer'}} onClick={() => removeLocation(loc)}>📍 {loc} ✕</div>
                    ))}
                  </div>
               </div>
            )}
          </div>

          {/* SECTION 4 - Audience */}
          <div className="section-card delay-3">
            <div className="card-glow"></div>
            <div className="section-label"><span className="section-label-dot"></span>04 — Audience</div>
            
            <div className="platform-grid" style={{gridTemplateColumns: 'repeat(4, 1fr)'}}>
               {audiences.map(aud => (
                  <div key={aud.id} className={`plat-card ${aud.selected ? 'active' : ''}`} onClick={() => toggleAudience(aud.id)} style={{padding:'12px'}}>
                     <div style={{fontSize:'32px', textAlign:'center', marginBottom:'8px'}}>{aud.icon}</div>
                     <div className="plat-name" style={{textAlign:'center', fontSize:'11px'}}>{aud.name}</div>
                  </div>
               ))}
            </div>
            
            <button className="btn-ai btn-ai-no" style={{marginTop:'16px', width:'100%'}}>+ Custom Audience</button>
          </div>

          {/* SECTION 5 - Languages */}
          <div className="section-card delay-4">
            <div className="card-glow"></div>
            <div className="section-label"><span className="section-label-dot"></span>05 — Language</div>
            
            <div className="plat-tags">
               {languages.map(lang => (
                  <button 
                     key={lang.id} 
                     onClick={() => toggleLanguage(lang.id)}
                     className={`plat-tag ${lang.selected ? 'active' : ''}`}
                     style={lang.selected ? {background:'var(--purple)', color:'#fff', borderColor:'var(--purple)'} : {cursor: 'pointer'}}
                  >
                     {lang.name}
                  </button>
               ))}
            </div>
            <div style={{fontSize:'12px', color:'var(--muted)', textAlign:'center', marginTop:'12px'}}>
               ✦ AI will generate captions and ad creatives up to {languages.filter(l=>l.selected).length} selected languages.
            </div>
          </div>

          {/* SECTION 6 - Summary */}
           <div className="section-card delay-4">
             <div className="card-glow"></div>
             <div className="section-label"><span className="section-label-dot"></span>06 — Insights</div>
             <div className="summary-inner">
                <div className="ai-header" style={{marginBottom:'16px'}}>
                  <div className="ai-orb" style={{width:'50px',height:'50px',fontSize:'20px'}}>💡</div>
                  <div className="ai-title">AI Campaign Insights</div>
                </div>

                <div style={{textAlign:'left', width:'100%', marginBottom:'24px', display:'flex', flexDirection:'column', gap:'10px'}}>
                   <div style={{background:'rgba(99,51,255,0.1)', border:'1px solid rgba(99,51,255,0.2)', padding:'12px', borderRadius:'12px', display:'flex', gap:'12px', alignItems:'flex-start'}}>
                      <span style={{fontSize:'18px'}}>🎯</span>
                      <div style={{fontSize:'13px', color:'var(--text)', lineHeight:'1.5'}}>
                         {selectedAudiences.length > 0 
                           ? `Your ${selectedAudiences[0].name} audience performs best at ${currency}${budgetType === "daily" ? Math.floor(budget * 0.16) : Math.floor(budget * 0.016)}/day.`
                           : "Select audience to see performance insights."}
                      </div>
                   </div>
                   <div style={{background:'rgba(0,212,200,0.1)', border:'1px solid rgba(0,212,200,0.2)', padding:'12px', borderRadius:'12px', display:'flex', gap:'12px', alignItems:'flex-start'}}>
                      <span style={{fontSize:'18px'}}>📈</span>
                      <div style={{fontSize:'13px', color:'var(--text)', lineHeight:'1.5'}}>
                         {selectedLanguages.length > 1 
                           ? `Multiple languages boost your CTR by estimated ${selectedLanguages.length * 11}%.`
                           : "Add more languages to multiply your engagement rate."}
                      </div>
                   </div>
                </div>

                <div className="stat-grid">
                  <div className="stat-card">
                     <div className="stat-label">Est. Reach</div>
                     <div className="stat-val">{reachNum.toLocaleString()}</div>
                     <div className="stat-sub" style={{color:'rgba(0,212,200,0.7)'}}>↑ High Quality</div>
                  </div>
                  <div className="stat-card">
                     <div className="stat-label">Audiences</div>
                     <div className="stat-val">{selectedAudiences.length}</div>
                     <div className="stat-sub">Targeted Groups</div>
                  </div>
                  <div className="stat-card">
                     <div className="stat-label">Languages</div>
                     <div className="stat-val" style={{color:'#34d399'}}>{selectedLanguages.length}</div>
                     <div className="stat-sub" style={{color:'rgba(52,211,153,0.6)'}}>Localizations</div>
                  </div>
                </div>
             </div>
           </div>

       </div>

       <div className="float-submit">
         <button className="submit-btn" onClick={handleContinueToPreview}>
           <span className="submit-icon">🚀</span>
           Continue to Ad Preview
         </button>
       </div>
    </div>
  );
}