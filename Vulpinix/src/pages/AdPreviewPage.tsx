import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import './SharedFlow.css';

type Platform = "instagram-feed" | "instagram-story" | "facebook-feed" | "youtube";
type Gender = "all" | "male" | "female" | "custom";

interface DeviceOption {
  id: string;
  name: string;
  icon: string;
  selected: boolean;
}

interface InterestOption {
  id: string;
  name: string;
  icon: string;
  selected: boolean;
}

export default function AdPreviewPage() {
  const navigate = useNavigate();

  // Platform Selection
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("instagram-feed");

  // Load preview image from localStorage
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  useEffect(() => {
    const savedImage = localStorage.getItem("adPreviewImage");
    if (savedImage) setPreviewImage(savedImage);
  }, []);

  // Load Ad Creative Data from localStorage
  const [adCreative, setAdCreative] = useState({
    caption: "Discover the future of digital marketing with AI-powered automation. Transform your content strategy today! 🚀",
    hashtags: ["#DigitalMarketing", "#AIAutomation", "#VulpinixAI", "#MarketingTech"],
    cta: "Learn More"
  });
  useEffect(() => {
    const savedCreative = localStorage.getItem("adCreativeData");
    if (savedCreative) {
      const data = JSON.parse(savedCreative);
      setAdCreative(prev => ({
        caption: data.caption || prev.caption,
        hashtags: data.hashtags || prev.hashtags,
        cta: "Learn More"
      }));
    }
  }, []);

  // Load Campaign Data
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
    const savedCampaign = localStorage.getItem("campaignData");
    if (savedCampaign) setCampaignData(JSON.parse(savedCampaign));
  }, []);

  // Advanced Targeting
  const [ageMin, setAgeMin] = useState(18);
  const [ageMax, setAgeMax] = useState(45);
  const [gender, setGender] = useState<Gender>("all");

  const [interests, setInterests] = useState<InterestOption[]>([
    { id: "gaming", name: "Gaming", icon: "🎮", selected: false },
    { id: "travel", name: "Travel", icon: "✈️", selected: true },
    { id: "startups", name: "Startups", icon: "🚀", selected: true },
    { id: "technology", name: "Technology", icon: "💻", selected: true },
    { id: "shopping", name: "Shopping", icon: "🛍️", selected: false },
    { id: "fitness", name: "Fitness", icon: "🏋️", selected: false },
  ]);

  const [devices, setDevices] = useState<DeviceOption[]>([
    { id: "mobile", name: "Mobile", icon: "📱", selected: true },
    { id: "desktop", name: "Desktop", icon: "🖥️", selected: true },
    { id: "tablet", name: "Tablet", icon: "⬛", selected: false },
  ]);

  const toggleInterest = (id: string) =>
    setInterests(interests.map(i => i.id === id ? { ...i, selected: !i.selected } : i));

  const toggleDevice = (id: string) =>
    setDevices(devices.map(d => d.id === id ? { ...d, selected: !d.selected } : d));

  // AI Predictions
  const aiPredictions = {
    estimatedReach: "125K – 180K",
    clickThroughRate: "3.2% – 4.8%",
    costPerClick: "₹12 – ₹18",
    performanceScore: 92
  };

  const handleSaveDraft = () => {
    toast.success("Campaign Saved as Draft", {
      description: "You can continue editing anytime from your dashboard."
    });
  };

  const handleProceedToPayment = () => {
    toast.success("Proceeding to Payment", {
      description: "Redirecting to secure payment gateway..."
    });
    navigate('/payment');
  };

  // Scroll progress bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollBar = document.getElementById('scrollBarAP');
      if (scrollBar) {
        const s = document.documentElement;
        if (s.scrollHeight - s.clientHeight > 0) {
          const p = (s.scrollTop / (s.scrollHeight - s.clientHeight)) * 100;
          scrollBar.style.width = p + '%';
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderAdPreview = () => {
    const imgSrc = previewImage;

    if (selectedPlatform === "instagram-feed") return (
      <div className="ad-mock-frame">
        <div className="ad-mock-header">
          <div className="ad-mock-avatar"></div>
          <div>
            <div className="ad-mock-name">vulpinix.ai</div>
            <div className="ad-mock-sponsored">Sponsored</div>
          </div>
        </div>
        <div className="ad-mock-image">
          {imgSrc
            ? <img src={imgSrc} alt="Ad Preview" style={{width:'100%',height:'100%',objectFit:'cover'}} />
            : <div className="ad-mock-placeholder"><span style={{fontSize:'40px'}}>✦</span><span>Your Ad Image</span></div>
          }
        </div>
        <div className="ad-mock-body">
          <div className="ad-mock-actions">❤ &nbsp; 💬 &nbsp; ✈</div>
          <p className="ad-mock-caption"><strong>vulpinix.ai</strong> {adCreative.caption}</p>
          <p className="ad-mock-hashtags">{adCreative.hashtags.join(" ")}</p>
        </div>
        <div className="ad-mock-cta"><button className="ad-mock-cta-btn">{adCreative.cta}</button></div>
      </div>
    );

    if (selectedPlatform === "instagram-story") return (
      <div className="ad-mock-frame ad-mock-story">
        <div className="ad-mock-story-bg">
          {imgSrc && <img src={imgSrc} alt="Story" style={{width:'100%',height:'100%',objectFit:'cover',position:'absolute',inset:0}} />}
          <div className="ad-mock-story-overlay">
            <div className="ad-mock-header" style={{color:'#fff'}}>
              <div className="ad-mock-avatar"></div>
              <span className="ad-mock-name">vulpinix.ai</span>
            </div>
            <div style={{textAlign:'center', color: '#fff', padding: '20px'}}>
              <div style={{fontSize:'40px', marginBottom:'12px'}}>✦</div>
              <div style={{fontFamily:"'Inter', sans-serif", fontWeight:700, fontSize:'18px', marginBottom:'8px'}}>Story Ad</div>
              <div style={{fontSize:'13px', opacity:0.85}}>{adCreative.caption.substring(0, 80)}...</div>
            </div>
            <button className="ad-mock-cta-btn" style={{background:'rgba(255,255,255,0.9)', color:'#04060f', borderRadius:'25px'}}>{adCreative.cta}</button>
          </div>
        </div>
      </div>
    );

    if (selectedPlatform === "facebook-feed") return (
      <div className="ad-mock-frame">
        <div className="ad-mock-header">
          <div className="ad-mock-avatar"></div>
          <div>
            <div className="ad-mock-name">Vulpinix AI</div>
            <div className="ad-mock-sponsored">Sponsored · 🌍</div>
          </div>
        </div>
        <div className="ad-mock-body" style={{borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
          <p className="ad-mock-caption">{adCreative.caption}</p>
          <p className="ad-mock-hashtags">{adCreative.hashtags.join(" ")}</p>
        </div>
        <div className="ad-mock-image" style={{aspectRatio:'16/9', height:'auto'}}>
          {imgSrc
            ? <img src={imgSrc} alt="Ad Preview" style={{width:'100%',height:'100%',objectFit:'cover'}} />
            : <div className="ad-mock-placeholder"><span style={{fontSize:'40px'}}>✦</span><span>Your Ad Image</span></div>
          }
        </div>
        <div className="ad-mock-body">
          <div style={{fontSize:'12px', color:'var(--muted)', marginBottom:'10px'}}>👍 ❤️ 234 &nbsp;·&nbsp; 45 Comments</div>
          <button className="ad-mock-cta-btn" style={{width:'100%'}}>{adCreative.cta}</button>
        </div>
      </div>
    );

    if (selectedPlatform === "youtube") return (
      <div className="ad-mock-frame">
        <div className="ad-mock-image" style={{aspectRatio:'16/9', height:'auto', position:'relative'}}>
          {imgSrc
            ? <img src={imgSrc} alt="Ad Preview" style={{width:'100%',height:'100%',objectFit:'cover'}} />
            : <div className="ad-mock-placeholder"><span style={{fontSize:'40px'}}>▶</span><span>Video Ad Preview</span></div>
          }
          <div style={{position:'absolute', bottom:'8px', right:'8px', background:'rgba(0,0,0,0.8)', borderRadius:'4px', padding:'2px 6px', fontSize:'12px', color:'#fff'}}>0:15</div>
        </div>
        <div className="ad-mock-body">
          <div style={{display:'flex', gap:'12px', alignItems:'flex-start'}}>
            <div className="ad-mock-avatar" style={{flexShrink:0}}></div>
            <div>
              <div className="ad-mock-name">{adCreative.caption.substring(0, 60)}...</div>
              <div className="ad-mock-sponsored" style={{marginBottom:'10px', marginTop:'4px'}}>vulpinix.ai · Ad · 1.2K views</div>
              <button className="ad-mock-cta-btn">{adCreative.cta}</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="upload-page-wrapper">
      <div className="scroll-bar" id="scrollBarAP"></div>
      <div className="cosmos">
        <div className="orb orb1"></div>
        <div className="orb orb2"></div>
        <div className="orb orb3"></div>
      </div>
      <div className="grid-bg"></div>
      <div className="depth-ring"></div>
      <div className="depth-ring"></div>
      <div className="depth-ring"></div>

      <div className="page" style={{maxWidth:'860px'}}>
        <button className="back" onClick={() => navigate("/create-ad")}>← Back to Campaign Setup</button>

        <div className="page-header">
          <div className="page-eyebrow"><span className="eyebrow-dot"></span>VULPINIX AI 1.0</div>
          <div className="page-title">Ad Preview &<br/>Final Targeting</div>
          <div className="page-sub">Review your campaign details and refine your audience before launching</div>
        </div>

        {/* SECTION 1 — Ad Creative Preview */}
        <div className="section-card delay-0" style={{width:'100%'}}>
          <div className="card-glow"></div>
          <div className="section-label"><span className="section-label-dot"></span>01 — Ad Creative Preview</div>

          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', flexWrap:'wrap', gap:'12px'}}>
            <div className="input-group" style={{flex:1, minWidth:'200px', position:'relative'}}>
              <select
                className="input-field"
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value as Platform)}
              >
                <option value="instagram-feed">📸 Instagram Feed</option>
                <option value="instagram-story">📱 Instagram Story</option>
                <option value="facebook-feed">👍 Facebook Feed</option>
                <option value="youtube">▶ YouTube</option>
              </select>
            </div>
            <button className="btn-ai btn-ai-no" style={{flex:'none', padding:'10px 16px', fontSize:'12px'}} onClick={() => navigate("/upload")}>
              ✎ Edit Creative
            </button>
          </div>

          <div style={{display:'flex', justifyContent:'center'}}>
            {renderAdPreview()}
          </div>
        </div>

        {/* SECTION 2 — Advanced Audience Targeting */}
        <div className="section-card delay-1" style={{width:'100%'}}>
          <div className="card-glow"></div>
          <div className="section-label"><span className="section-label-dot"></span>02 — Refine Your Audience</div>

          {/* Age Range */}
          <div style={{marginBottom:'24px'}}>
            <div className="input-label" style={{marginBottom:'10px'}}>👤 Age Range: {ageMin} – {ageMax}</div>
            <div style={{display:'flex', gap:'16px', alignItems:'center'}}>
              <div style={{flex:1}}>
                <div style={{fontSize:'11px', color:'var(--muted)', marginBottom:'6px'}}>Min: {ageMin}</div>
                <input type="range" min={13} max={65} step={1} value={ageMin}
                  onChange={(e) => setAgeMin(Math.min(Number(e.target.value), ageMax - 1))} />
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:'11px', color:'var(--muted)', marginBottom:'6px'}}>Max: {ageMax}</div>
                <input type="range" min={13} max={65} step={1} value={ageMax}
                  onChange={(e) => setAgeMax(Math.max(Number(e.target.value), ageMin + 1))} />
              </div>
            </div>
          </div>

          {/* Gender */}
          <div style={{marginBottom:'24px'}}>
            <div className="input-label" style={{marginBottom:'10px'}}>⚤ Gender</div>
            <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
              {(["all", "male", "female", "custom"] as Gender[]).map(g => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`btn-ai ${gender === g ? 'btn-ai-yes' : 'btn-ai-no'}`}
                  style={{flex:'none', padding:'10px 20px', fontSize:'12px', textTransform:'capitalize'}}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div style={{marginBottom:'24px'}}>
            <div className="input-label" style={{marginBottom:'10px'}}>🎯 Interest Expansion</div>
            <div className="plat-tags" style={{justifyContent:'flex-start'}}>
              {interests.map(interest => (
                <button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className="plat-tag"
                  style={interest.selected
                    ? {background:'var(--purple)', color:'#fff', borderColor:'var(--purple)', cursor:'pointer'}
                    : {cursor:'pointer', color:'var(--muted)', background:'rgba(255,255,255,0.03)'}
                  }
                >
                  {interest.icon} {interest.name}
                </button>
              ))}
            </div>
          </div>

          {/* Device Targeting */}
          <div>
            <div className="input-label" style={{marginBottom:'10px'}}>📡 Device Targeting</div>
            <div className="platform-grid" style={{gridTemplateColumns:'repeat(3, 1fr)'}}>
              {devices.map(device => (
                <div
                  key={device.id}
                  className={`plat-card ${device.selected ? 'active' : ''}`}
                  onClick={() => toggleDevice(device.id)}
                  style={{textAlign:'center', padding:'16px'}}
                >
                  <div style={{fontSize:'28px', marginBottom:'8px'}}>{device.icon}</div>
                  <div className="plat-name" style={{textAlign:'center', fontSize:'12px'}}>{device.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 3 — AI Performance Prediction */}
        <div className="section-card delay-2" style={{width:'100%'}}>
          <div className="card-glow"></div>
          <div className="section-label"><span className="section-label-dot"></span>03 — AI Performance Prediction</div>

          <div className="ai-header" style={{marginBottom:'20px'}}>
            <div className="ai-orb" style={{width:'56px', height:'56px', fontSize:'22px'}}>✦</div>
            <div className="ai-title" style={{fontSize:'16px'}}>Estimated Campaign Results</div>
          </div>

          <div className="stat-grid" style={{gridTemplateColumns:'repeat(2, 1fr)', gap:'12px', marginBottom:'16px'}}>
            <div className="stat-card">
              <div className="stat-label">👥 Est. Reach</div>
              <div className="stat-val" style={{fontSize:'20px'}}>{aiPredictions.estimatedReach}</div>
              <div className="stat-sub" style={{color:'rgba(0,212,200,0.7)'}}>people</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">🖱 Click-Through Rate</div>
              <div className="stat-val" style={{fontSize:'20px', color:'var(--teal)'}}>{aiPredictions.clickThroughRate}</div>
              <div className="stat-sub">estimated CTR</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">💰 Cost Per Click</div>
              <div className="stat-val" style={{fontSize:'20px'}}>{aiPredictions.costPerClick}</div>
              <div className="stat-sub">avg CPC</div>
            </div>
            <div className="stat-card" style={{border:'1px solid rgba(52,211,153,0.3)', background:'rgba(52,211,153,0.04)'}}>
              <div className="stat-label">📈 Performance Score</div>
              <div className="stat-val" style={{fontSize:'20px', color:'#34d399'}}>{aiPredictions.performanceScore}<span style={{fontSize:'13px', color:'var(--muted)'}}>/100</span></div>
              <div className="stat-bar"><div className="stat-bar-fill" style={{width:`${aiPredictions.performanceScore}%`, background:'linear-gradient(90deg, #34d399, #06d6c7)'}}></div></div>
            </div>
          </div>

          <div style={{background:'rgba(0,212,200,0.05)', border:'1px solid rgba(0,212,200,0.15)', borderRadius:'12px', padding:'12px 16px', fontSize:'12px', color:'var(--muted)', display:'flex', gap:'8px', alignItems:'flex-start'}}>
            <span style={{flexShrink:0}}>ⓘ</span>
            <span>Predictions are AI-based estimates and may vary based on market conditions and competition.</span>
          </div>
        </div>

        {/* SECTION 4 — Campaign Summary */}
        <div className="section-card delay-3" style={{width:'100%'}}>
          <div className="card-glow"></div>
          <div className="section-label"><span className="section-label-dot"></span>04 — Campaign Summary</div>

          <div className="summary-inner">
            <div className="stat-grid" style={{gridTemplateColumns:'repeat(3,1fr)', width:'100%', marginBottom:'20px'}}>
              <div className="stat-card">
                <div className="stat-label">Budget</div>
                <div className="stat-val" style={{fontSize:'18px'}}>{campaignData.budget}</div>
                <div className="stat-sub">{campaignData.budgetType}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Duration</div>
                <div className="stat-val" style={{fontSize:'18px', color:'var(--teal)'}}>{campaignData.duration}</div>
                <div className="stat-sub">campaign run</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total Spend</div>
                <div className="stat-val" style={{fontSize:'18px', color:'#34d399'}}>{campaignData.totalAmount || '—'}</div>
                <div className="stat-sub">estimated</div>
              </div>
            </div>

            {/* Summary rows */}
            {[
              { label: '🎯 Campaign Name', value: campaignData.name, nav: '/create-ad' },
              { label: '📌 Objective', value: campaignData.objective, nav: '/create-ad' },
            ].map(row => (
              <div key={row.label} style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid var(--border)'}}>
                <span style={{fontSize:'12px', color:'var(--muted)'}}>{row.label}</span>
                <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                  <span style={{fontSize:'14px', color:'#fff', fontFamily:"'Inter', sans-serif", fontWeight:600}}>{row.value}</span>
                  <button className="btn-ai btn-ai-no" style={{padding:'4px 10px', fontSize:'11px', flex:'none'}} onClick={() => navigate(row.nav)}>Edit</button>
                </div>
              </div>
            ))}

            <div style={{width:'100%', padding:'12px 0', borderBottom:'1px solid var(--border)'}}>
              <div style={{fontSize:'12px', color:'var(--muted)', marginBottom:'8px'}}>🌐 Platforms</div>
              <div className="plat-tags" style={{justifyContent:'flex-start', margin:0}}>
                {campaignData.platforms.map(p => <div key={p} className="plat-tag">{p}</div>)}
              </div>
            </div>

            <div style={{width:'100%', padding:'12px 0', borderBottom:'1px solid var(--border)'}}>
              <div style={{fontSize:'12px', color:'var(--muted)', marginBottom:'8px'}}>📍 Locations</div>
              <div className="plat-tags" style={{justifyContent:'flex-start', margin:0}}>
                {campaignData.locations.map(l => <div key={l} className="plat-tag" style={{background:'rgba(99,51,255,0.1)', borderColor:'rgba(99,51,255,0.25)', color:'#a78bfa'}}>📍 {l}</div>)}
              </div>
            </div>

            <div style={{width:'100%', padding:'12px 0', borderBottom:'1px solid var(--border)'}}>
              <div style={{fontSize:'12px', color:'var(--muted)', marginBottom:'8px'}}>👥 Audience</div>
              <div className="plat-tags" style={{justifyContent:'flex-start', margin:0}}>
                {campaignData.audience.map(a => <div key={a} className="plat-tag" style={{background:'rgba(0,212,200,0.1)', borderColor:'rgba(0,212,200,0.2)', color:'var(--teal)'}}>{a}</div>)}
              </div>
            </div>

            <div style={{width:'100%', padding:'12px 0'}}>
              <div style={{fontSize:'12px', color:'var(--muted)', marginBottom:'8px'}}>🌍 Languages</div>
              <div className="plat-tags" style={{justifyContent:'flex-start', margin:0}}>
                {campaignData.languages.map(l => <div key={l} className="plat-tag">{l}</div>)}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{display:'flex', gap:'12px', flexWrap:'wrap', justifyContent:'center', width:'100%', marginBottom:'120px'}}>
          <button className="btn-ai btn-ai-no" style={{padding:'14px 24px', fontSize:'14px'}} onClick={() => navigate("/create-ad")}>
            ← Back to Edit
          </button>
          <button className="btn-ai btn-ai-no" style={{padding:'14px 24px', fontSize:'14px', borderColor:'rgba(0,212,200,0.3) !important', color:'var(--teal)'}} onClick={handleSaveDraft}>
            💾 Save as Draft
          </button>
        </div>
      </div>

      {/* Floating CTA */}
      <div className="float-submit">
        <button className="submit-btn" onClick={handleProceedToPayment}>
          <span className="submit-icon">💳</span>
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}

