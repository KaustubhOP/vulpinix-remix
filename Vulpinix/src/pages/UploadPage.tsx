import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import './UploadPage.css';

interface UploadedFile {
  file: File;
  preview?: string;
}

interface AIAnalysis {
  caption: string;
  hashtags: string[];
  platforms: string[];
}

interface Platform {
  id: string;
  name: string;
  enabled: boolean;
  recommendedTime: string;
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm', 'video/x-matroska', 'video/x-flv', 'video/x-ms-wmv'];
const ALLOWED_FILE_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];
const ALLOWED_EXTENSIONS = '.jpg,.jpeg,.png,.gif,.webp,.heic,.heif,.mp4,.mov,.avi,.webm,.mkv,.flv,.wmv';

export default function UploadPage() {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);

  // Auth guard: redirect to /auth if not logged in
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!userInfo && isAuthenticated !== "true") {
      navigate("/auth", { replace: true });
    }
  }, [navigate]);

  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis>({
    caption: "",
    hashtags: [],
    platforms: ["Instagram", "LinkedIn", "Facebook"]
  });
  
  const [generatingCaption, setGeneratingCaption] = useState(false);
  
  const [platforms, setPlatforms] = useState<Platform[]>([
    { id: "instagram", name: "Instagram", enabled: true, recommendedTime: "6:00 PM — Peak" },
    { id: "facebook", name: "Facebook", enabled: true, recommendedTime: "1:00 PM — Active" },
    { id: "youtube", name: "YouTube", enabled: false, recommendedTime: "3:00 PM — Best" },
    { id: "linkedin", name: "LinkedIn", enabled: true, recommendedTime: "8:00 AM — Pro" },
    { id: "twitter", name: "Twitter", enabled: false, recommendedTime: "12:00 PM — Lunch" },
  ]);

  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // For reach counter
  const [reachNum, setReachNum] = useState(0);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
    e.target.value = '';
  };

  const handleFile = (file: File) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type.toLowerCase())) {
      toast.error('Invalid file type');
      return;
    }
    const preview = URL.createObjectURL(file);
    setUploadedFile({ file, preview });
    startAnalysis();
  };

  const startAnalysis = () => {
    setAnalyzing(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setAnalyzing(false);
          setAnalysisComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const generateWithGemini = async () => {
    setGeneratingCaption(true);
    toast.info("Generating captions...");
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); 
      setAiAnalysis({
        caption: "Elevate your marketing game with AI-powered solutions! 🌟 Transform your strategy. 🚀",
        hashtags: ["#DigitalMarketing", "#AIAutomation", "#VulpinixAI"],
        platforms: platforms.filter(p=>p.enabled).map(p=>p.name)
      });
      setGeneratingCaption(false);
      toast.success("AI captions generated!");
    } catch (error) {
      setGeneratingCaption(false);
      toast.error("Failed to generate AI captions.");
    }
  };

  const handleAiCaptionChoice = () => {
    generateWithGemini();
  };

  const handleAiCaptionBypass = () => {
    setAiAnalysis({ caption: "", hashtags: [], platforms: platforms.filter(p=>p.enabled).map(p=>p.name) });
    toast.info("You can now enter your caption manually");
  };

  const togglePlatform = (id: string) => {
    setPlatforms(platforms.map(p => 
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ));
  };

  const estimatedReach = platforms.filter(p => p.enabled).length * 2500;
  
  useEffect(() => {
    let current = 0;
    const timer = setInterval(() => {
      current += Math.ceil(estimatedReach / 60);
      if(current >= estimatedReach){
         current = estimatedReach;
         clearInterval(timer);
      }
      setReachNum(current);
    }, 30);
    return () => clearInterval(timer);
  }, [estimatedReach]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollBar = document.getElementById('scrollBar');
      if(scrollBar) {
         const s = document.documentElement;
         // Handle potential division by zero on very short pages
         if(s.scrollHeight - s.clientHeight > 0) {
             const p = (s.scrollTop / (s.scrollHeight - s.clientHeight)) * 100;
             scrollBar.style.width = p + '%';
         }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLaunch = () => {
    if(!uploadedFile) {
      toast.error("Please upload a file first");
      return;
    }
    const adCreativeData = { 
      caption: aiAnalysis.caption, 
      hashtags: aiAnalysis.hashtags, 
      platforms: platforms.filter(p=>p.enabled).map(p=>p.name) 
    };
    localStorage.setItem("adCreativeData", JSON.stringify(adCreativeData));
    navigate("/create-ad");
  };

  // Convert step progress
  const stepUpload = uploadedFile ? true : false;
  const stepCaption = aiAnalysis.caption.trim().length > 0;
  const stepPlatforms = platforms.some(p => p.enabled);
  const stepSchedule = scheduleDate !== "" || stepPlatforms;

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

       <div className="page">
          <button className="back" onClick={() => navigate("/")}>← Back to Dashboard</button>

          <div className="steps">
            <div className="step-item">
              <div className={`step-dot ${stepUpload ? 'done' : 'active'}`}>1<span className="step-label">Upload</span></div>
            </div>
            <div className={`step-line ${stepUpload ? 'filled' : ''}`}></div>
            <div className="step-item">
              <div className={`step-dot ${stepCaption ? 'done' : (!stepUpload ? 'inactive' : 'active')}`}>2<span className="step-label">Caption</span></div>
            </div>
            <div className={`step-line ${stepCaption ? 'filled' : ''}`}></div>
            <div className="step-item">
              <div className={`step-dot ${stepPlatforms ? 'done' : (!stepCaption ? 'inactive' : 'active')}`}>3<span className="step-label">Platforms</span></div>
            </div>
            <div className={`step-line ${stepPlatforms ? 'filled' : ''}`}></div>
            <div className="step-item">
              <div className={`step-dot ${stepSchedule ? 'done' : (!stepPlatforms ? 'inactive' : 'active')}`}>4<span className="step-label">Schedule</span></div>
            </div>
            <div className={`step-line ${stepSchedule ? 'filled' : ''}`}></div>
            <div className="step-item">
              <div className={`step-dot ${stepSchedule ? 'active' : 'inactive'}`}>5<span className="step-label">Publish</span></div>
            </div>
          </div>

          <div className="page-header">
            <div className="page-eyebrow"><span className="eyebrow-dot"></span>VULPINIX AI 1.0</div>
            <div className="page-title">Upload & Publish<br/>Content</div>
            <div className="page-sub">Let AI optimize and distribute your content across all platforms simultaneously</div>
          </div>

          <div className="section-card delay-0">
            <div className="card-glow"></div>
            <div className="section-label"><span className="section-label-dot"></span>01 — Content File</div>
            
            { uploadedFile ? (
              <div className="file-preview">
                 <div className="file-thumb-placeholder">
                   {uploadedFile.file.type.startsWith('image/') ? '🖼' : '🎬'}
                 </div>
                 <div className="file-info">
                   <div className="file-name">{uploadedFile.file.name}</div>
                   <div className="file-size">{(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB · {progress < 100 ? 'Uploading...' : 'Completed'}</div>
                   <div className="file-progress"><div className="file-progress-fill" style={{ width: `${progress}%` }}></div></div>
                 </div>
                 <button className="file-remove" onClick={() => {
                    setUploadedFile(null);
                    setAnalyzing(false);
                    setAnalysisComplete(false);
                    setProgress(0);
                 }}>×</button>
              </div>
            ) : (
              <div 
                 className={`upload-zone ${dragActive ? 'dragover' : ''}`}
                 onDragEnter={handleDrag}
                 onDragLeave={handleDrag}
                 onDragOver={handleDrag}
                 onDrop={handleDrop}
                 onClick={() => fileInputRef.current?.click()}
              >
                 <div className="upload-icon-wrap">⬆</div>
                 <div className="upload-title">Drop your content here</div>
                 <div className="upload-sub">or click to browse files</div>
                 <div className="upload-types">
                   <span className="upload-type">JPG</span>
                   <span className="upload-type">PNG</span>
                   <span className="upload-type">MP4</span>
                   <span className="upload-type">MOV</span>
                   <span className="upload-type">GIF</span>
                 </div>
                 <input type="file" ref={fileInputRef} className="hidden" style={{display:'none'}} onChange={handleChange} accept={ALLOWED_EXTENSIONS} />
              </div>
            )}
          </div>

          <div className="section-card delay-1">
            <div className="card-glow"></div>
            <div className="section-label"><span className="section-label-dot"></span>02 — AI Intelligence</div>
            <div className="ai-header">
              <div className="ai-orb">✦</div>
              <div className="ai-title">AI Caption Generation</div>
              <div className="ai-sub">Would you like our AI to craft engaging captions and hashtags for your content?</div>
            </div>
            <div className="ai-btns">
              <button className="btn-ai btn-ai-yes" onClick={handleAiCaptionChoice} disabled={generatingCaption || !uploadedFile}>
                {generatingCaption ? '✦ Generating...' : '✦ Yes, Generate with AI'}
              </button>
              <button className="btn-ai btn-ai-no" onClick={handleAiCaptionBypass}>✎ Write Manually</button>
            </div>
            <div className="input-row">
              <div className="input-group">
                <div className="input-label">✦ Caption</div>
                <div style={{position:'relative'}}>
                  <textarea 
                     className="input-field" 
                     rows={3} 
                     placeholder="Your AI-generated caption appears here..."
                     value={aiAnalysis.caption}
                     onChange={(e) => setAiAnalysis({...aiAnalysis, caption: e.target.value})}
                  ></textarea>
                  <span className="input-icon">✎</span>
                </div>
              </div>
              <div className="input-group">
                <div className="input-label" style={{color:'rgba(0,212,200,0.7)'}}># Hashtags</div>
                <div style={{position:'relative'}}>
                  <textarea 
                     className="input-field" 
                     rows={3} 
                     placeholder="#ai #marketing #vulpinix..." 
                     style={{borderColor:'rgba(0,212,200,0.15)'}}
                     value={aiAnalysis.hashtags.join(' ')}
                     onChange={(e) => {
                        const val = e.target.value.split(' ').filter(v => v);
                        setAiAnalysis({...aiAnalysis, hashtags: val});
                     }}
                  ></textarea>
                  <span className="input-icon" style={{color:'rgba(0,212,200,0.5)'}}>#</span>
                </div>
              </div>
            </div>
          </div>

          <div className="section-card delay-2">
            <div className="card-glow"></div>
            <div className="section-label"><span className="section-label-dot"></span>03 — Distribution</div>
            <div className="platform-grid">
              {platforms.map(plat => {
                 let iconBg = "";
                 let iconSymbol = "";
                 if(plat.id === 'instagram') { iconBg = 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)'; iconSymbol = '📸'; }
                 if(plat.id === 'facebook') { iconBg = 'rgba(24,119,242,0.2)'; iconSymbol = '👍'; }
                 if(plat.id === 'youtube') { iconBg = 'rgba(255,0,0,0.15)'; iconSymbol = '▶'; }
                 if(plat.id === 'linkedin') { iconBg = 'rgba(0,119,181,0.2)'; iconSymbol = 'in'; }
                 if(plat.id === 'twitter') { iconBg = 'rgba(29,161,242,0.15)'; iconSymbol = '𝕏'; }
                 
                 return (
                 <div key={plat.id} className={`plat-card ${plat.enabled ? 'active' : ''}`} data-p={plat.id} onClick={() => togglePlatform(plat.id)}>
                    <div className="plat-top">
                      <div className="plat-icon" style={{background: iconBg}}>{iconSymbol}</div>
                      <button className="plat-toggle" onClick={(e) => { e.stopPropagation(); togglePlatform(plat.id); }}></button>
                    </div>
                    <div className="plat-name">{plat.name}</div>
                    <div className="plat-time">{plat.recommendedTime}</div>
                 </div>
                 )
              })}
            </div>
          </div>

          <div className="section-card delay-3">
            <div className="card-glow"></div>
            <div className="section-label"><span className="section-label-dot"></span>04 — Timing</div>
            <div className="schedule-grid">
               <div className="input-with-icon">
                 <div className="input-label" style={{fontSize:'11px',color:'var(--muted)',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'.5px'}}>📅 Date</div>
                 <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} placeholder="dd/mm/yyyy" />
               </div>
               <div className="input-with-icon">
                 <div className="input-label" style={{fontSize:'11px',color:'var(--muted)',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'.5px'}}>⏰ Time</div>
                 <input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} placeholder="--:--" />
               </div>
            </div>
            <div className="publish-row">
               <button className="btn-publish btn-now" onClick={handleLaunch}>⚡ Publish Now</button>
               <button className="btn-publish btn-schedule" onClick={() => { if(!uploadedFile) toast.error("Upload a file first"); else toast.success("Scheduled successfully!"); }}>🕐 Schedule Post</button>
            </div>
          </div>

          <div className="section-card delay-4">
            <div className="card-glow"></div>
            <div className="section-label"><span className="section-label-dot"></span>05 — Summary</div>
            <div className="summary-inner">
               <div className="summary-img-wrap">
                  <div className="summary-img-glow"></div>
                  { uploadedFile?.preview ? (
                     <img src={uploadedFile.preview} className="summary-img" alt="preview" />
                  ) : (
                     <div className="summary-img-placeholder">
                        <span style={{fontSize:'32px'}}>🖼</span>
                        <span style={{fontSize:'12px',color:'var(--muted)'}}>Content Preview</span>
                     </div>
                  )}
               </div>
               <div className="plat-tags">
                 {platforms.filter(p=>p.enabled).map((p) => {
                    let icon = "";
                    if(p.id==='instagram') icon='📸';
                    if(p.id==='facebook') icon='👍';
                    if(p.id==='linkedin') icon='in';
                    if(p.id==='youtube') icon='▶';
                    if(p.id==='twitter') icon='𝕏';
                    return <div className="plat-tag" key={p.id}>{icon} {p.name}</div>
                 })}
               </div>
               <div className="stat-grid">
                 <div className="stat-card">
                    <div className="stat-label">Est. Reach</div>
                    <div className="stat-val">{reachNum.toLocaleString()}</div>
                    <div className="stat-sub" style={{color:'rgba(0,212,200,0.7)'}}>↑ people</div>
                 </div>
                 <div className="stat-card">
                    <div className="stat-label">AI Score</div>
                    <div className="stat-val">94<span style={{fontSize:'14px',color:'var(--muted)'}}>/100</span></div>
                    <div className="stat-bar"><div className="stat-bar-fill" style={{width:'94%'}}></div></div>
                 </div>
                 <div className="stat-card">
                    <div className="stat-label">Cost</div>
                    <div className="stat-val" style={{color:'#34d399'}}>Free</div>
                    <div className="stat-sub" style={{color:'rgba(52,211,153,0.6)'}}>✓ Included</div>
                 </div>
               </div>
            </div>
          </div>
       </div>

       <div className="float-submit">
         <button className="submit-btn" onClick={handleLaunch}>
           <span className="submit-icon">🚀</span>
           Launch Campaign
         </button>
       </div>
    </div>
  );
}
