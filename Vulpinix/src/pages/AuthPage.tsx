import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useGoogleAuthSimple } from "../hooks/useGoogleAuthSimple";

type AuthMode = "login" | "signup";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [authMode, setAuthMode] = useState<AuthMode>(
    location.pathname.includes("signup") ? "signup" : "login"
  );

  useEffect(() => {
    if (location.pathname.includes("signup")) setAuthMode("signup");
    else if (location.pathname.includes("login")) setAuthMode("login");
  }, [location.pathname]);

  const [showLoginPwd, setShowLoginPwd] = useState(false);
  const [showSignupPwd, setShowSignupPwd] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupData, setSignupData] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [termsChecked, setTermsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pwdScore, setPwdScore] = useState(0);
  const [pwdHint, setPwdHint] = useState("Use 8+ characters, numbers & symbols");

  // Mark returning user
  useEffect(() => { localStorage.setItem("returningUser", "true"); }, []);

  // Redirect if already authenticated
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (userInfo || isAuthenticated === "true") navigate("/upload", { replace: true });
  }, [navigate]);

  const handleGoogleSuccess = useCallback((googleUser: any) => {
    toast.success(
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-green-400" />
        <div>
          <p className="font-semibold">Welcome, {googleUser.name}!</p>
          <p className="text-xs text-gray-400 mt-0.5">Signed in via Google · {googleUser.email}</p>
        </div>
      </div>,
      { duration: 5000 }
    );
    const userData = {
      name: googleUser.name, email: googleUser.email, picture: googleUser.picture,
      emailVerified: googleUser.email_verified, authProvider: "google", googleId: googleUser.sub,
    };
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("authProvider", "google");
    localStorage.setItem("userInfo", JSON.stringify(userData));
    localStorage.setItem("socialLinks", JSON.stringify({ instagram: "", facebook: "", youtube: "", twitter: "", linkedin: "" }));
    setTimeout(() => navigate("/upload"), 1000);
  }, [navigate]);

  const handleGoogleError = useCallback((error: string) => {
    toast.error("Google Sign-In Failed", { description: error });
  }, []);

  const { isGoogleLoaded, initializeGoogle } = useGoogleAuthSimple();

  useEffect(() => {
    if (isGoogleLoaded) initializeGoogle("google-signin-button", handleGoogleSuccess, handleGoogleError);
  }, [isGoogleLoaded, initializeGoogle, handleGoogleSuccess, handleGoogleError]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) { toast.error("Please fill all fields"); return; }
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", loginEmail);
      toast.success("Welcome back!", { description: "Successfully logged in." });
      navigate("/upload");
    }, 1500);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupData.firstName || !signupData.email || !signupData.password) { toast.error("Please fill required fields"); return; }
    if (!termsChecked) { toast.error("Please accept the Terms of Service"); return; }
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userInfo", JSON.stringify({ name: `${signupData.firstName} ${signupData.lastName}`.trim(), ...signupData }));
      localStorage.setItem("socialLinks", JSON.stringify({ instagram: "", facebook: "", youtube: "", twitter: "", linkedin: "" }));
      toast.success("Account Created! 🎉", { description: "Welcome to VULPINIX AI" });
      navigate("/upload");
    }, 1500);
  };

  const checkPasswordStrength = (v: string) => {
    let sc = 0;
    if (v.length >= 8) sc++;
    if (/[A-Z]/.test(v)) sc++;
    if (/[0-9]/.test(v)) sc++;
    if (/[^A-Za-z0-9]/.test(v)) sc++;
    setPwdScore(sc);
    const hints = ["Too short — add more characters", "Weak — add uppercase letters", "Medium — add numbers or symbols", "Strong password ✓"];
    setPwdHint(v ? hints[Math.max(0, sc - 1)] : "Use 8+ characters, numbers & symbols");
  };

  const getBarClass = (barIdx: number) => {
    if (!signupData.password) return "";
    const cls = pwdScore <= 1 ? "bar-w" : pwdScore === 2 ? "bar-m" : "bar-s";
    return barIdx < pwdScore ? cls : "";
  };

  const pwdHintColor = () => {
    if (!signupData.password) return "rgba(160,160,210,0.5)";
    if (pwdScore <= 1) return "#ef4444";
    if (pwdScore === 2) return "#f59e0b";
    return "#10b981";
  };

  const sw = (mode: AuthMode) => {
    setAuthMode(mode);
    navigate(mode === "login" ? "/login" : "/signup", { replace: true });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { min-height: 100vh; font-family: 'DM Sans', sans-serif; background: var(--vx-bg-primary); color: #fff; overflow-x: hidden; }

        /* BACKGROUND */
        .vx-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
        .vx-bg-left { position: absolute; width: 650px; height: 650px; border-radius: 50%; background: radial-gradient(circle, rgba(99,51,255,0.25) 0%, transparent 70%); top: -150px; left: -200px; filter: blur(70px); animation: vxDrift 15s ease-in-out infinite; }
        .vx-bg-right { position: absolute; width: 550px; height: 550px; border-radius: 50%; background: radial-gradient(circle, rgba(6,214,199,0.18) 0%, transparent 70%); bottom: -100px; right: -100px; filter: blur(70px); animation: vxDrift 18s ease-in-out infinite reverse; }
        .vx-bg-mid { position: absolute; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(255,45,120,0.07) 0%, transparent 70%); top: 40%; left: 40%; filter: blur(80px); animation: vxDrift 22s ease-in-out infinite 3s; }
        @keyframes vxDrift { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(30px,40px); } }

        .vx-grid { position: fixed; inset: 0; z-index: 0; pointer-events: none; background-image: linear-gradient(rgba(99,51,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,51,255,0.05) 1px, transparent 1px); background-size: 52px 52px; animation: vxGridDrift 35s linear infinite; }
        @keyframes vxGridDrift { from { background-position: 0 0; } to { background-position: 52px 52px; } }

        .vx-ring { position: fixed; border-radius: 50%; border: 1px solid rgba(99,51,255,0.05); top: 50%; left: 50%; pointer-events: none; z-index: 0; animation: vxRingBreath 12s ease-in-out infinite; }
        .vx-r1 { width: 900px; height: 900px; margin: -450px 0 0 -450px; }
        .vx-r2 { width: 1200px; height: 1200px; margin: -600px 0 0 -600px; animation-delay: -4s; border-color: rgba(6,214,199,0.03); animation-duration: 16s; }
        @keyframes vxRingBreath { 0%, 100% { transform: scale(1); opacity: .4; } 50% { transform: scale(1.03); opacity: .8; } }

        .vx-scanline { position: fixed; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(99,51,255,0.5), rgba(6,214,199,0.4), transparent); animation: vxScan 12s linear infinite; z-index: 1; pointer-events: none; }
        @keyframes vxScan { 0% { top: -1px; opacity: 0; } 5% { opacity: 1; } 95% { opacity: 1; } 100% { top: 100%; opacity: 0; } }

        /* LAYOUT */
        .vx-page { position: relative; z-index: 1; min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; }

        /* LEFT PANEL */
        .vx-left { background: linear-gradient(160deg, rgba(99,51,255,0.12) 0%, rgba(6,214,199,0.06) 100%); border-right: 1px solid rgba(99,51,255,0.18); padding: 48px; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden; }
        .vx-left::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(99,51,255,0.6), rgba(6,214,199,0.4), transparent); }

        .vx-logo { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .vx-logo-mark { width: 44px; height: 44px; border-radius: 14px; background: linear-gradient(135deg, #6333ff, #06d6c7); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: #fff; box-shadow: 0 0 30px rgba(99,51,255,0.5); animation: vxLogoPulse 3s ease-in-out infinite; flex-shrink: 0; }
        @keyframes vxLogoPulse { 0%, 100% { box-shadow: 0 0 20px rgba(99,51,255,0.4); } 50% { box-shadow: 0 0 50px rgba(99,51,255,0.8), 0 0 80px rgba(6,214,199,0.3); } }
        .vx-logo-name { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: #fff; }
        .vx-logo-name span { background: linear-gradient(135deg, #a78bfa, #06d6c7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

        .vx-left-mid { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 48px 0; }
        .vx-eyebrow { font-size: 11px; font-weight: 600; color: #06d6c7; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 14px; display: flex; align-items: center; gap: 6px; }
        .vx-left-title { font-family: 'Syne', sans-serif; font-size: 36px; font-weight: 800; color: #fff; line-height: 1.15; margin-bottom: 14px; }
        .vx-left-title span { background: linear-gradient(135deg, #a78bfa, #06d6c7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .vx-left-sub { font-size: 15px; color: rgba(210,210,240,0.7); line-height: 1.7; margin-bottom: 32px; }

        .vx-feat-list { display: flex; flex-direction: column; gap: 13px; margin-bottom: 32px; }
        .vx-feat-item { display: flex; align-items: center; gap: 12px; }
        .vx-feat-check { width: 28px; height: 28px; border-radius: 8px; background: rgba(6,214,199,0.12); border: 1px solid rgba(6,214,199,0.3); display: flex; align-items: center; justify-content: center; color: #06d6c7; font-size: 13px; font-weight: 700; flex-shrink: 0; }
        .vx-feat-text { font-size: 14px; color: rgba(220,220,255,0.85); }

        /* Mini dashboard */
        .vx-dash { background: rgba(8,10,24,0.92); border: 1px solid rgba(99,51,255,0.22); border-radius: 16px; padding: 16px; animation: vxFloatDash 5s ease-in-out infinite; box-shadow: 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05); }
        @keyframes vxFloatDash { 0%, 100% { transform: translateY(0) rotate(-0.5deg); } 50% { transform: translateY(-8px) rotate(0.5deg); } }
        .vx-dash-top { font-size: 10px; color: rgba(160,160,210,0.5); margin-bottom: 12px; display: flex; align-items: center; gap: 6px; text-transform: uppercase; letter-spacing: .5px; }
        .vx-live-dot { width: 6px; height: 6px; border-radius: 50%; background: #34d399; animation: vxLivePulse 1.5s infinite; flex-shrink: 0; }
        @keyframes vxLivePulse { 0%, 100% { opacity: 1; } 50% { opacity: .3; } }
        .vx-dash-row { display: flex; gap: 10px; margin-bottom: 12px; }
        .vx-dash-m { flex: 1; background: rgba(99,51,255,0.08); border: 1px solid rgba(99,51,255,0.15); border-radius: 10px; padding: 10px; }
        .vx-dash-m.teal { background: rgba(6,214,199,0.06); border-color: rgba(6,214,199,0.15); }
        .vx-dash-val { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; color: #fff; }
        .vx-dash-lbl { font-size: 10px; color: rgba(160,160,210,0.5); margin-top: 2px; }
        .vx-dash-delta { font-size: 10px; color: #34d399; margin-top: 3px; }
        .vx-plat-bars { display: flex; flex-direction: column; gap: 7px; }
        .vx-pb-row { display: flex; align-items: center; gap: 8px; }
        .vx-pb-name { font-size: 11px; color: rgba(160,160,210,0.6); min-width: 72px; }
        .vx-pb-wrap { flex: 1; height: 4px; background: rgba(255,255,255,0.06); border-radius: 20px; overflow: hidden; }
        .vx-pb-fill { height: 100%; border-radius: 20px; animation: vxBarGrow 2s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes vxBarGrow { from { width: 0; } to { width: var(--w); } }
        .vx-pb1 { background: linear-gradient(90deg, #833ab4, #fd1d1d); --w: 78%; animation-delay: .3s; }
        .vx-pb2 { background: linear-gradient(90deg, #1877f2, #42b8ff); --w: 54%; animation-delay: .5s; }
        .vx-pb3 { background: linear-gradient(90deg, #0077b5, #00a0dc); --w: 42%; animation-delay: .7s; }
        .vx-pb-pct { font-size: 10px; color: rgba(160,160,210,0.5); min-width: 28px; text-align: right; }
        .vx-left-bottom { font-size: 12px; color: rgba(160,160,210,0.35); }

        /* RIGHT PANEL */
        .vx-right { padding: 48px 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(4,5,14,0.5); }
        .vx-auth-box { width: 100%; max-width: 420px; }

        /* TABS */
        .vx-tabs { display: flex; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 4px; margin-bottom: 32px; }
        .vx-tab { flex: 1; padding: 12px; border-radius: 10px; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; border: none; background: none; color: rgba(255,255,255,0.45); transition: all .3s cubic-bezier(0.16,1,0.3,1); }
        .vx-tab.active { background: linear-gradient(135deg, #6333ff, #06d6c7); color: #fff !important; box-shadow: 0 4px 24px rgba(99,51,255,0.45); }
        .vx-tab:hover:not(.active) { color: rgba(255,255,255,0.75); }

        /* HEADING */
        .vx-auth-title { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: #fff; margin-bottom: 6px; line-height: 1.2; }
        .vx-auth-sub { font-size: 14px; color: rgba(190,190,230,0.65); margin-bottom: 28px; line-height: 1.5; }

        /* SOCIAL BTN */
        .vx-social-row { display: flex; flex-direction: column; gap: 10px; margin-bottom: 22px; }
        .vx-soc-btn { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 14px 20px; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all .25s; border: none; position: relative; overflow: hidden; }
        .vx-soc-btn::after { content: ''; position: absolute; inset: 0; background: rgba(255,255,255,0); transition: background .2s; }
        .vx-soc-btn:hover::after { background: rgba(255,255,255,0.05); }
        .vx-soc-btn:hover { transform: translateY(-2px); }
        .vx-soc-btn:active { transform: scale(0.98); }
        .vx-soc-google { background: rgba(66,133,244,0.18); border: 1.5px solid rgba(66,133,244,0.45) !important; color: #ffffff !important; }
        .vx-soc-google:hover { background: rgba(66,133,244,0.28); box-shadow: 0 8px 30px rgba(66,133,244,0.3); }
        .vx-soc-apple { background: rgba(255,255,255,0.09); border: 1.5px solid rgba(255,255,255,0.22) !important; color: #ffffff !important; }
        .vx-soc-apple:hover { background: rgba(255,255,255,0.15); box-shadow: 0 8px 30px rgba(255,255,255,0.08); }
        .vx-soc-icon { width: 20px; height: 20px; flex-shrink: 0; }
        .vx-soc-label { color: #ffffff !important; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; }

        /* DIVIDER */
        .vx-divider { display: flex; align-items: center; gap: 12px; margin-bottom: 22px; }
        .vx-div-line { flex: 1; height: 1px; background: rgba(255,255,255,0.1); }
        .vx-div-text { font-size: 12px; color: rgba(180,180,220,0.5); white-space: nowrap; text-transform: uppercase; letter-spacing: .4px; }

        /* FIELDS */
        .vx-field { margin-bottom: 16px; }
        .vx-field-label { font-size: 13px; font-weight: 500; color: rgba(220,220,255,0.9); margin-bottom: 7px; display: block; }
        .vx-field-wrap { position: relative; }
        .vx-input { width: 100%; background: rgba(255,255,255,0.07); border: 1.5px solid rgba(255,255,255,0.13); border-radius: 12px; padding: 14px 46px 14px 16px; font-size: 14px; color: #ffffff; font-family: 'DM Sans', sans-serif; outline: none; transition: all .25s; }
        .vx-input::placeholder { color: rgba(160,160,210,0.38); }
        .vx-input:focus { background: rgba(99,51,255,0.1); border-color: rgba(99,51,255,0.6); box-shadow: 0 0 0 3px rgba(99,51,255,0.15); }
        .vx-field-ico { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: rgba(160,160,210,0.55); cursor: pointer; font-size: 15px; transition: color .2s; user-select: none; background: none; border: none; padding: 0; }
        .vx-field-ico:hover { color: #a78bfa; }
        .vx-name-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .vx-name-row .vx-input { padding: 14px 16px; }

        /* PASSWORD STRENGTH */
        .vx-pwd-bars { display: flex; gap: 4px; margin-top: 8px; }
        .vx-pwd-bar { flex: 1; height: 3px; border-radius: 20px; background: rgba(255,255,255,0.08); transition: background .35s; }
        .bar-w { background: #ef4444; }
        .bar-m { background: #f59e0b; }
        .bar-s { background: #10b981; }
        .vx-pwd-hint { font-size: 11px; margin-top: 5px; transition: color .3s; }

        /* FORGOT */
        .vx-forgot-row { display: flex; justify-content: flex-end; margin: -4px 0 18px; }
        .vx-forgot-link { font-size: 13px; color: #a78bfa; cursor: pointer; transition: color .2s; background: none; border: none; font-family: 'DM Sans', sans-serif; font-weight: 500; }
        .vx-forgot-link:hover { color: #06d6c7; }

        /* TERMS */
        .vx-terms-row { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 20px; }
        .vx-cb { width: 18px; height: 18px; border-radius: 6px; border: 1.5px solid rgba(99,51,255,0.45); background: rgba(99,51,255,0.08); flex-shrink: 0; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .25s; margin-top: 2px; font-size: 11px; color: transparent; }
        .vx-cb.on { background: linear-gradient(135deg, #6333ff, #06d6c7); border-color: transparent; color: #fff; }
        .vx-terms-txt { font-size: 13px; color: rgba(190,190,230,0.7); line-height: 1.55; }
        .vx-terms-txt a { color: #a78bfa; cursor: pointer; text-decoration: underline; }
        .vx-terms-txt a:hover { color: #06d6c7; }

        /* SUBMIT */
        .vx-submit { width: 100%; padding: 15px 24px; background: linear-gradient(135deg, #6333ff, #06d6c7); border: none; border-radius: 13px; font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #ffffff !important; cursor: pointer; transition: all .25s; display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 20px; position: relative; overflow: hidden; letter-spacing: .2px; }
        .vx-submit::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, transparent, rgba(255,255,255,0.1), transparent); transform: translateX(-100%); transition: transform .55s; }
        .vx-submit:hover::before { transform: translateX(100%); }
        .vx-submit:hover { box-shadow: 0 10px 44px rgba(99,51,255,0.55), 0 0 60px rgba(6,214,199,0.15); transform: translateY(-2px); }
        .vx-submit:active { transform: scale(0.97); }
        .vx-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .vx-arr { transition: transform .25s; font-size: 17px; }
        .vx-submit:hover .vx-arr { transform: translateX(5px); }

        /* SWITCH */
        .vx-switch-text { text-align: center; font-size: 14px; color: rgba(180,180,220,0.6); }
        .vx-switch-text span { color: #a78bfa; cursor: pointer; font-weight: 600; transition: color .2s; }
        .vx-switch-text span:hover { color: #06d6c7; }

        /* SECURE */
        .vx-secure { display: flex; align-items: center; justify-content: center; gap: 7px; margin-top: 22px; font-size: 11px; color: rgba(160,160,210,0.38); }
        .vx-sec-dot { width: 6px; height: 6px; border-radius: 50%; background: #10b981; animation: vxSecPulse 2s infinite; flex-shrink: 0; }
        @keyframes vxSecPulse { 0%, 100% { opacity: 1; } 50% { opacity: .3; } }

        /* SPINNER */
        .vx-spin { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* RESPONSIVE */
        @media (max-width: 800px) {
          .vx-page { grid-template-columns: 1fr; }
          .vx-left { display: none; }
          .vx-right { padding: 36px 24px; min-height: 100vh; justify-content: flex-start; padding-top: 60px; }
          .vx-auth-box { max-width: 100%; }
        }

        /* Google button override */
        #google-signin-button { display: flex !important; justify-content: center !important; align-items: center !important; width: 100% !important; height: 100% !important; }
        #google-signin-button iframe { margin: 0 auto !important; }
      `}</style>

      {/* BACKGROUND */}
      <div className="vx-bg">
        <div className="vx-bg-left"></div>
        <div className="vx-bg-right"></div>
        <div className="vx-bg-mid"></div>
      </div>
      <div className="vx-grid"></div>
      <div className="vx-ring vx-r1"></div>
      <div className="vx-ring vx-r2"></div>
      <div className="vx-scanline"></div>

      <div className="vx-page">

        {/* ── LEFT PANEL ── */}
        <div className="vx-left">
          <div className="vx-logo" onClick={() => navigate("/")}>
            <div className="vx-logo-mark">V</div>
            <div className="vx-logo-name">Vulpinix <span>AI</span></div>
          </div>

          <div className="vx-left-mid">
            <div className="vx-eyebrow">✦ AI-Powered Marketing Platform</div>
            <div className="vx-left-title">Automate Your<br /><span>Digital Marketing</span><br />with AI Power</div>
            <div className="vx-left-sub">Upload content, let AI craft captions, our expert team publishes — you watch the analytics grow in real time.</div>

            <div className="vx-feat-list">
              {["AI-generated captions for every platform", "Live analytics — reach, clicks, ROAS & more", "Expert team reviews before publishing", "Instagram, Facebook, LinkedIn & Google Ads"].map((text, i) => (
                <div className="vx-feat-item" key={i}>
                  <div className="vx-feat-check">✓</div>
                  <div className="vx-feat-text">{text}</div>
                </div>
              ))}
            </div>

            {/* Mini Dashboard */}
            <div className="vx-dash">
              <div className="vx-dash-top">
                <div className="vx-live-dot"></div>
                Live Performance Dashboard
              </div>
              <div className="vx-dash-row">
                <div className="vx-dash-m">
                  <div className="vx-dash-val">124K</div>
                  <div className="vx-dash-lbl">Total Reach</div>
                  <div className="vx-dash-delta">↑ 32% this week</div>
                </div>
                <div className="vx-dash-m teal">
                  <div className="vx-dash-val">8.4%</div>
                  <div className="vx-dash-lbl">Engagement</div>
                  <div className="vx-dash-delta">↑ 1.2%</div>
                </div>
              </div>
              <div className="vx-plat-bars">
                {[
                  { name: "Instagram", cls: "vx-pb1", pct: "78%" },
                  { name: "Facebook", cls: "vx-pb2", pct: "54%" },
                  { name: "LinkedIn", cls: "vx-pb3", pct: "42%" },
                ].map((p) => (
                  <div className="vx-pb-row" key={p.name}>
                    <div className="vx-pb-name">{p.name}</div>
                    <div className="vx-pb-wrap"><div className={`vx-pb-fill ${p.cls}`}></div></div>
                    <div className="vx-pb-pct">{p.pct}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="vx-left-bottom">© 2026 Vulpinix Productions · Pune, India</div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="vx-right">
          <div className="vx-auth-box">

            {/* TABS */}
            <div className="vx-tabs">
              <button className={`vx-tab${authMode === "login" ? " active" : ""}`} onClick={() => sw("login")}>Sign In</button>
              <button className={`vx-tab${authMode === "signup" ? " active" : ""}`} onClick={() => sw("signup")}>Create Account</button>
            </div>

            {/* ── LOGIN PANEL ── */}
            {authMode === "login" && (
              <form onSubmit={handleLogin}>
                <div className="vx-auth-title">Welcome back 👋</div>
                <div className="vx-auth-sub">Sign in to your Vulpinix AI account to continue</div>

                <div className="vx-social-row">
                  {/* Google (real auth) */}
                  <div style={{ position: "relative", height: "52px" }}>
                    <button type="button" className="vx-soc-btn vx-soc-google" style={{ width: "100%", height: "100%" }}>
                      <svg className="vx-soc-icon" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      <span className="vx-soc-label">Continue with Google</span>
                    </button>
                    <div id="google-signin-button" style={{ position: "absolute", inset: 0, zIndex: 10, opacity: 0 }} />
                  </div>
                  <button type="button" className="vx-soc-btn vx-soc-apple">
                    <svg className="vx-soc-icon" viewBox="0 0 24 24" fill="white">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    <span className="vx-soc-label">Continue with Apple</span>
                  </button>
                </div>

                <div className="vx-divider">
                  <div className="vx-div-line"></div>
                  <div className="vx-div-text">or continue with email</div>
                  <div className="vx-div-line"></div>
                </div>

                <div className="vx-field">
                  <label className="vx-field-label">Email Address</label>
                  <div className="vx-field-wrap">
                    <input className="vx-input" type="email" placeholder="you@example.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} autoComplete="email" />
                    <span className="vx-field-ico">✉</span>
                  </div>
                </div>

                <div className="vx-field">
                  <label className="vx-field-label">Password</label>
                  <div className="vx-field-wrap">
                    <input className="vx-input" type={showLoginPwd ? "text" : "password"} placeholder="Enter your password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} autoComplete="current-password" />
                    <button type="button" className="vx-field-ico" onClick={() => setShowLoginPwd(!showLoginPwd)}>{showLoginPwd ? "🙈" : "👁"}</button>
                  </div>
                </div>

                <div className="vx-forgot-row">
                  <button type="button" className="vx-forgot-link">Forgot password?</button>
                </div>

                <button type="submit" className="vx-submit" disabled={isLoading}>
                  {isLoading ? <div className="vx-spin"></div> : <>Sign In to Vulpinix <span className="vx-arr">→</span></>}
                </button>

                <div className="vx-switch-text">
                  Don't have an account? <span onClick={() => sw("signup")}>Create one free →</span>
                </div>
              </form>
            )}

            {/* ── SIGNUP PANEL ── */}
            {authMode === "signup" && (
              <form onSubmit={handleSignup}>
                <div className="vx-auth-title">Create Account ✦</div>
                <div className="vx-auth-sub">Join 500+ marketers on Vulpinix AI — free to start</div>

                <div className="vx-social-row">
                  <button type="button" className="vx-soc-btn vx-soc-google">
                    <svg className="vx-soc-icon" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span className="vx-soc-label">Sign up with Google</span>
                  </button>
                  <button type="button" className="vx-soc-btn vx-soc-apple">
                    <svg className="vx-soc-icon" viewBox="0 0 24 24" fill="white">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    <span className="vx-soc-label">Sign up with Apple</span>
                  </button>
                </div>

                <div className="vx-divider">
                  <div className="vx-div-line"></div>
                  <div className="vx-div-text">or continue with email</div>
                  <div className="vx-div-line"></div>
                </div>

                <div className="vx-name-row">
                  <div className="vx-field">
                    <label className="vx-field-label">First Name</label>
                    <input className="vx-input" type="text" placeholder="First name" value={signupData.firstName} onChange={e => setSignupData({ ...signupData, firstName: e.target.value })} />
                  </div>
                  <div className="vx-field">
                    <label className="vx-field-label">Last Name</label>
                    <input className="vx-input" type="text" placeholder="Last name" value={signupData.lastName} onChange={e => setSignupData({ ...signupData, lastName: e.target.value })} />
                  </div>
                </div>

                <div className="vx-field">
                  <label className="vx-field-label">Email Address</label>
                  <div className="vx-field-wrap">
                    <input className="vx-input" type="email" placeholder="you@example.com" value={signupData.email} onChange={e => setSignupData({ ...signupData, email: e.target.value })} autoComplete="email" />
                    <span className="vx-field-ico">✉</span>
                  </div>
                </div>

                <div className="vx-field">
                  <label className="vx-field-label">Password</label>
                  <div className="vx-field-wrap">
                    <input className="vx-input" type={showSignupPwd ? "text" : "password"} placeholder="Create a strong password" value={signupData.password}
                      onChange={e => { setSignupData({ ...signupData, password: e.target.value }); checkPasswordStrength(e.target.value); }} />
                    <button type="button" className="vx-field-ico" onClick={() => setShowSignupPwd(!showSignupPwd)}>{showSignupPwd ? "🙈" : "👁"}</button>
                  </div>
                  <div className="vx-pwd-bars">
                    {[0, 1, 2, 3].map(i => <div key={i} className={`vx-pwd-bar ${getBarClass(i)}`}></div>)}
                  </div>
                  <div className="vx-pwd-hint" style={{ color: pwdHintColor() }}>{pwdHint}</div>
                </div>

                <div className="vx-terms-row">
                  <div className={`vx-cb${termsChecked ? " on" : ""}`} onClick={() => setTermsChecked(!termsChecked)}>
                    {termsChecked ? "✓" : ""}
                  </div>
                  <div className="vx-terms-txt">I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a> of Vulpinix AI</div>
                </div>

                <button type="submit" className="vx-submit" disabled={isLoading}>
                  {isLoading ? <div className="vx-spin"></div> : <>Create Free Account <span className="vx-arr">→</span></>}
                </button>

                <div className="vx-switch-text">
                  Already have an account? <span onClick={() => sw("login")}>Sign in →</span>
                </div>
              </form>
            )}

            <div className="vx-secure">
              <div className="vx-sec-dot"></div>
              256-bit SSL encrypted · Your data is always safe
            </div>

          </div>
        </div>
      </div>
    </>
  );
}