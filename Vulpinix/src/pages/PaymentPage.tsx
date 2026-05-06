import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import PaymentSuccessModal from "../components/PaymentSuccessModal";
import './SharedFlow.css';

type PaymentMethod = "upi" | "card" | "wallet" | null;

export default function PaymentPage() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // OTP state
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Card payment state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  // UPI state
  const [upiId, setUpiId] = useState("");

  // Get user phone from localStorage
  const savedUserInfo = localStorage.getItem("userInfo");
  const userPhone = savedUserInfo ? JSON.parse(savedUserInfo).phone : "+91 98765 43210";

  // Load Campaign data from localStorage
  const [campaignData, setCampaignData] = useState({
    name: "Summer Sale Campaign",
    platforms: ["Instagram", "Facebook", "YouTube"],
    budgetType: "Daily",
    budget: "₹5,000",
    totalAmount: "₹35,000",
    locations: ["Mumbai", "Delhi"],
    audience: ["Business", "Tech"],
    languages: ["English", "Hindi"],
    estimatedReach: "125,000 - 180,000",
    duration: "7 Days"
  });

  useEffect(() => {
    const savedCampaign = localStorage.getItem("campaignData");
    if (savedCampaign) {
      setCampaignData(JSON.parse(savedCampaign));
    }
  }, []);

  // Validation functions
  const validateCardNumber = (number: string): boolean => {
    const cleaned = number.replace(/\s/g, "");
    if (cleaned.length !== 16) {
      toast.error("Card number must be 16 digits");
      return false;
    }
    if (!/^\d+$/.test(cleaned)) {
      toast.error("Card number must contain only digits");
      return false;
    }
    return true;
  };

  const validateExpiryDate = (expiry: string): boolean => {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      toast.error("Expiry date must be in MM/YY format");
      return false;
    }
    const [month, year] = expiry.split("/").map(Number);
    if (month < 1 || month > 12) {
      toast.error("Invalid month in expiry date");
      return false;
    }
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      toast.error("Card has expired");
      return false;
    }
    return true;
  };

  const validateCVV = (cvvValue: string): boolean => {
    if (cvvValue.length < 3 || cvvValue.length > 4) {
      toast.error("CVV must be 3 or 4 digits");
      return false;
    }
    if (!/^\d+$/.test(cvvValue)) {
      toast.error("CVV must contain only digits");
      return false;
    }
    return true;
  };

  const validateCardName = (name: string): boolean => {
    if (name.trim().length < 3) {
      toast.error("Please enter valid cardholder name");
      return false;
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      toast.error("Cardholder name must contain only letters");
      return false;
    }
    return true;
  };

  const validateUPI = (upi: string): boolean => {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    if (!upiRegex.test(upi)) {
      toast.error("Please enter valid UPI ID (e.g., name@bank)");
      return false;
    }
    return true;
  };

  const handleSendOtp = () => {
    if (!selectedMethod) {
      toast.error("Please select a payment method");
      return;
    }

    let isValid = false;
    if (selectedMethod === "card") {
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        toast.error("Please fill all card details");
        return;
      }
      isValid = validateCardNumber(cardNumber) && 
                validateCardName(cardName) && 
                validateExpiryDate(expiryDate) && 
                validateCVV(cvv);
    } else if (selectedMethod === "upi") {
      if (!upiId) {
        toast.error("Please enter UPI ID");
        return;
      }
      isValid = validateUPI(upiId);
    } else if (selectedMethod === "wallet") {
      isValid = true;
    }

    if (!isValid) return;

    setIsSendingOtp(true);
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
    setTimeout(() => {
      setGeneratedOtp(newOtp);
      setShowOtpInput(true);
      setIsSendingOtp(false);
      toast.success("OTP Sent Successfully!", {
        description: `OTP sent to ${userPhone}. For demo, use: ${newOtp}`,
        duration: 10000,
      });
    }, 1500);
  };

  const handleVerifyOtp = () => {
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }
    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }
    if (otp !== generatedOtp) {
      toast.error("Invalid OTP. Please try again.");
      return;
    }

    setIsOtpVerified(true);
    toast.success("OTP Verified Successfully!", {
      description: "You can now proceed with the payment.",
    });
  };

  const handlePayment = async () => {
    if (!isOtpVerified) {
      toast.error("Please verify OTP first");
      return;
    }

    setIsProcessing(true);

    setTimeout(async () => {
      setIsProcessing(false);

      const savedUserInfo = localStorage.getItem("userInfo");
      const userInfo = savedUserInfo ? JSON.parse(savedUserInfo) : {};
      const savedAdImage = localStorage.getItem("adPreviewImage") || "";

      const uploadData   = JSON.parse(localStorage.getItem("uploadData")   || "{}");
      const createAdData = JSON.parse(localStorage.getItem("createAdData") || "{}");

      const paymentId     = `PAY-${Date.now()}`;
      const transactionId = `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      const paymentDate   = new Date().toISOString();

      const newCampaign = {
        id: Date.now().toString(),
        businessName:    userInfo.company || userInfo.name || "My Business",
        userEmail:       userInfo.email || localStorage.getItem("userEmail") || "No email provided",
        userName:        userInfo.name  || "Anonymous User",
        userPhone:       userInfo.phone || "",
        businessGoal:    uploadData.businessGoal     || "",
        businessCategory:uploadData.businessCategory || "",
        adImage:         savedAdImage,
        name:            campaignData.name,
        platforms:       campaignData.platforms,
        platform:        campaignData.platforms?.[0] || "",
        budget:          campaignData.budget,
        budgetType:      campaignData.budgetType,
        currency:        "INR",
        duration:        campaignData.duration,
        estimatedReach:  campaignData.estimatedReach,
        startDatePreference: uploadData.startDatePreference || "",
        adContentDescription: uploadData.adDescription || createAdData.adDescription || "",
        adCaption:       createAdData.caption  || uploadData.caption  || "",
        adCopyText:      createAdData.copyText || uploadData.copyText || "",
        callToAction:    createAdData.callToAction || uploadData.callToAction || "",
        creativeFiles:   uploadData.creativeFiles || [],
        targeting: {
          location:  campaignData.locations || [],
          audience:  campaignData.audience  || [],
          ageRange:  uploadData.ageRange    || "",
          gender:    uploadData.gender      || "all",
          interests: uploadData.interests   || [],
          devices:   ["mobile", "desktop"],
        },
        language:    campaignData.languages || ["English"],
        socialHandles: {
          instagram: uploadData.instagram || "",
          facebook:  uploadData.facebook  || "",
          twitter:   uploadData.twitter   || "",
          linkedin:  uploadData.linkedin  || "",
        },
        content: {
          mediaUrl: savedAdImage,
          caption:  createAdData.caption || uploadData.caption || "",
          hashtags: uploadData.hashtags  || [],
        },
        links: {
          website: userInfo.website || uploadData.website || "",
          social:  "",
        },
        payment: {
          paymentId,
          transactionId,
          amount:    campaignData.totalAmount || campaignData.budget,
          method:    selectedMethod || "",
          timestamp: new Date(),
        },
        paymentAmount:  campaignData.totalAmount || campaignData.budget,
        paymentStatus:  "paid",
        paymentId,
        transactionId,
        paymentDate,
        status:          "pending" as "pending" | "in_review" | "approved" | "rejected",
        dateSubmitted:   new Date().toISOString().split("T")[0],
        rejectionReason: "",
        adminMessage:    "",
        analytics: {
          impressions: 0, reach: 0, clicks: 0,
          ctr: 0, conversions: 0, adSpend: 0, roas: 0,
        },
      };

      const existingRaw = localStorage.getItem("userCampaigns");
      let campaigns: typeof newCampaign[] = [];
      if (existingRaw) {
        const parsed = JSON.parse(existingRaw);
        if (Array.isArray(parsed)) {
          campaigns = parsed;
        } else {
          const legacy = [...(parsed.inReview || []), ...(parsed.history || [])];
          campaigns = legacy.map((c: Record<string, unknown>) => ({
            ...newCampaign,
            ...c,
            status: (c.status === "review" ? "in_review" : c.status) as "pending" | "in_review" | "approved" | "rejected",
          }));
        }
      }
      campaigns.unshift(newCampaign);
      localStorage.setItem("userCampaigns", JSON.stringify(campaigns));

      try {
        const response = await fetch("http://localhost:5000/api/campaign/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...newCampaign,
            campaignName: newCampaign.name,
            // Strip base64 blobs — MongoDB has a 16MB document limit
            // Keep a lightweight indicator so admin knows media was uploaded
            adImage: savedAdImage ? "[media-uploaded-locally]" : "",
            content: {
              ...newCampaign.content,
              mediaUrl: savedAdImage ? "[media-uploaded-locally]" : "",
            },
            creativeFiles: (newCampaign.creativeFiles || []).map((f: any) => ({
              ...f,
              url: f.url ? "[file-uploaded-locally]" : "",
            })),
          }),
        });
        const data = await response.json();
        if (data.token) {
          localStorage.setItem("userCampaignToken", data.token);
        }
      } catch {
        console.warn("Backend not available — campaign saved locally only.");
      }

      const existingNotifs = localStorage.getItem("adminNotifications");
      const notifs = existingNotifs ? JSON.parse(existingNotifs) : [];
      const hasWelcomeNotif = notifs.some((n: { type: string }) => n.type === "submission_received");
      if (!hasWelcomeNotif) {
        notifs.unshift({
          id: Date.now().toString(),
          type: "submission_received",
          message: "✅ We received your campaign submission! Our team will review it within 12 hours.",
          timestamp: new Date().toISOString(),
          dismissed: false,
        });
        localStorage.setItem("adminNotifications", JSON.stringify(notifs));
      }

      toast.success("Payment Successful! 🎉", {
        description: "Your campaign is submitted for review.",
        duration: 4000,
      });

      setShowSuccessModal(true);
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) return v.slice(0, 2) + "/" + v.slice(2, 4);
    return v;
  };

  // Scroll progress bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollBar = document.getElementById('scrollBarPayment');
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

  return (
    <>
      <PaymentSuccessModal
        isOpen={showSuccessModal}
        onConfirm={() => navigate("/dashboard/campaigns")}
      />
      <div className="upload-page-wrapper">
        <div className="scroll-bar" id="scrollBarPayment"></div>
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
          <button className="back" onClick={() => navigate("/ad-preview")}>← Back to Campaign Preview</button>

          <div className="page-header">
            <div className="page-eyebrow"><span className="eyebrow-dot"></span>SECURE CHECKOUT</div>
            <div className="page-title">Complete Your<br/>Payment</div>
            <div className="page-sub">Secure payment to activate your AI-powered ad campaign</div>
          </div>

          <div style={{display:'grid', gap:'20px', gridTemplateColumns:'1fr', width:'100%'}}>
            
            {/* SECTION 1 — Campaign Summary */}
            <div className="section-card delay-0" style={{width:'100%'}}>
              <div className="card-glow"></div>
              <div className="section-label"><span className="section-label-dot"></span>01 — Campaign Summary</div>

              <div className="stat-grid" style={{gridTemplateColumns:'repeat(2,1fr)', marginBottom:'20px'}}>
                <div className="stat-card">
                  <div className="stat-label">Budget</div>
                  <div className="stat-val" style={{fontSize:'18px'}}>{campaignData.budget}</div>
                  <div className="stat-sub">{campaignData.budgetType}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Duration</div>
                  <div className="stat-val" style={{fontSize:'18px', color:'var(--teal)'}}>{campaignData.duration}</div>
                  <div className="stat-sub">run time</div>
                </div>
                <div className="stat-card" style={{gridColumn:'1 / -1', background:'rgba(99,51,255,0.06)', borderColor:'rgba(99,51,255,0.2)'}}>
                  <div className="stat-label" style={{color:'#a78bfa'}}>Total Amount</div>
                  <div className="stat-val" style={{fontSize:'26px', color:'#fff'}}>{campaignData.totalAmount}</div>
                </div>
              </div>

              {[
                { label: '🎯 Campaign Name', value: campaignData.name },
                { label: '📈 Estimated Reach', value: campaignData.estimatedReach },
              ].map(row => (
                <div key={row.label} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid var(--border)'}}>
                  <span style={{fontSize:'12px', color:'var(--muted)'}}>{row.label}</span>
                  <span style={{fontSize:'14px', color:'#fff', fontFamily:"'Inter', sans-serif", fontWeight:600}}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* SECTION 2 — Payment Method */}
            <div className="section-card delay-1" style={{width:'100%'}}>
              <div className="card-glow"></div>
              <div className="section-label"><span className="section-label-dot"></span>02 — Payment Method</div>

              <div className="platform-grid" style={{gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', marginBottom:'24px'}}>
                <div className={`plat-card ${selectedMethod === 'upi' ? 'active' : ''}`} onClick={() => setSelectedMethod('upi')} style={{textAlign:'center'}}>
                  <div style={{fontSize:'28px', marginBottom:'8px'}}>📱</div>
                  <div className="plat-name">UPI</div>
                  <div className="plat-time">GPay, PhonePe, etc.</div>
                </div>
                <div className={`plat-card ${selectedMethod === 'card' ? 'active' : ''}`} onClick={() => setSelectedMethod('card')} style={{textAlign:'center'}}>
                  <div style={{fontSize:'28px', marginBottom:'8px'}}>💳</div>
                  <div className="plat-name">Card</div>
                  <div className="plat-time">Credit or Debit</div>
                </div>
                <div className={`plat-card ${selectedMethod === 'wallet' ? 'active' : ''}`} onClick={() => setSelectedMethod('wallet')} style={{textAlign:'center', position:'relative'}}>
                  <div style={{position:'absolute', top:'6px', right:'6px', background:'rgba(234,179,8,0.2)', color:'#facc15', fontSize:'9px', padding:'2px 6px', borderRadius:'10px'}}>Soon</div>
                  <div style={{fontSize:'28px', marginBottom:'8px', opacity:0.5}}>👜</div>
                  <div className="plat-name" style={{opacity:0.5}}>Wallet</div>
                  <div className="plat-time" style={{opacity:0.5}}>Paytm, etc.</div>
                </div>
              </div>

              {selectedMethod === 'upi' && (
                <div className="input-group">
                  <label className="input-label">Enter UPI ID</label>
                  <input className="input-field" placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} />
                </div>
              )}

              {selectedMethod === 'card' && (
                <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                  <div className="input-group">
                    <label className="input-label">Card Number</label>
                    <input className="input-field" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={e => setCardNumber(formatCardNumber(e.target.value))} maxLength={19} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Cardholder Name</label>
                    <input className="input-field" placeholder="John Doe" value={cardName} onChange={e => setCardName(e.target.value.toUpperCase())} />
                  </div>
                  <div style={{display:'flex', gap:'12px'}}>
                    <div className="input-group" style={{flex:1}}>
                      <label className="input-label">Expiry</label>
                      <input className="input-field" placeholder="MM/YY" value={expiryDate} onChange={e => setExpiryDate(formatExpiryDate(e.target.value))} maxLength={5} />
                    </div>
                    <div className="input-group" style={{flex:1}}>
                      <label className="input-label">CVV</label>
                      <input type="password" className="input-field" placeholder="123" value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, ""))} maxLength={3} />
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === 'wallet' && (
                <div style={{textAlign:'center', padding:'20px', color:'var(--muted)'}}>
                  Wallet payments coming soon!
                </div>
              )}
            </div>

            {/* SECTION 3 — OTP Verification */}
            {selectedMethod && selectedMethod !== "wallet" && (
              <div className="section-card delay-2" style={{width:'100%', borderColor: isOtpVerified ? 'rgba(52,211,153,0.3)' : 'var(--border)'}}>
                <div className="card-glow"></div>
                <div className="section-label" style={{color: isOtpVerified ? '#34d399' : 'var(--muted)'}}>
                  <span className="section-label-dot" style={{background: isOtpVerified ? '#34d399' : 'linear-gradient(135deg, var(--purple), var(--teal))'}}></span>
                  03 — Verification
                </div>

                {!showOtpInput ? (
                  <div style={{textAlign:'center'}}>
                    <p style={{fontSize:'13px', color:'var(--muted)', marginBottom:'16px'}}>
                      For security, we'll send an OTP to verify your payment.
                    </p>
                    <button className="btn-ai btn-ai-yes" onClick={handleSendOtp} disabled={isSendingOtp} style={{width:'100%'}}>
                      {isSendingOtp ? 'Sending OTP...' : `Send OTP`}
                    </button>
                  </div>
                ) : !isOtpVerified ? (
                  <div style={{textAlign:'center'}}>
                    <div className="input-group" style={{marginBottom:'16px'}}>
                      <label className="input-label" style={{justifyContent:'center'}}>Enter 6-Digit OTP</label>
                      <input className="input-field" style={{textAlign:'center', fontSize:'24px', letterSpacing:'8px', padding:'12px'}} placeholder="000000" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ""))} maxLength={6} />
                    </div>
                    <div style={{display:'flex', gap:'10px'}}>
                      <button className="btn-ai btn-ai-no" onClick={handleSendOtp} style={{flex:1}}>Resend</button>
                      <button className="btn-ai btn-ai-yes" onClick={handleVerifyOtp} style={{flex:2}}>Verify</button>
                    </div>
                  </div>
                ) : (
                  <div style={{textAlign:'center', color:'#34d399', fontSize:'14px', fontWeight:600}}>
                    ✓ OTP Verified Successfully!
                  </div>
                )}
              </div>
            )}
            
            {/* Trust Banner */}
            <div className="section-card delay-3" style={{width:'100%', background:'linear-gradient(135deg, rgba(6,214,199,0.08), rgba(99,51,255,0.08))', borderColor:'rgba(6,214,199,0.3)'}}>
              <div className="card-glow"></div>
              <div className="section-label" style={{color:'#06d6c7'}}>
                <span className="section-label-dot" style={{background:'#06d6c7'}}></span>
                04 — Your Savings with AI
              </div>

              <div className="stat-grid" style={{gridTemplateColumns:'repeat(2,1fr)'}}>
                <div className="stat-card" style={{border:'1px solid rgba(6,214,199,0.2)'}}>
                  <div className="stat-label">💰 Money Saved</div>
                  <div className="stat-val" style={{fontSize:'22px', color:'#06d6c7'}}>~₹45,000</div>
                  <div className="stat-sub">on agency & creative fees</div>
                </div>
                <div className="stat-card" style={{border:'1px solid rgba(167,139,250,0.2)'}}>
                  <div className="stat-label">⏳ Time Saved</div>
                  <div className="stat-val" style={{fontSize:'22px', color:'#a78bfa'}}>~14 Days</div>
                  <div className="stat-sub">on editing & campaign setup</div>
                </div>
              </div>
            </div>

            <div style={{background:'rgba(52,211,153,0.05)', border:'1px solid rgba(52,211,153,0.2)', borderRadius:'12px', padding:'12px 16px', fontSize:'12px', color:'var(--muted)', display:'flex', gap:'8px', alignItems:'center', justifyContent:'center'}}>
              <span style={{color:'#34d399'}}>🔒</span>
              <span>100% Secure & Encrypted Payments powered by trusted gateways.</span>
            </div>

          </div>

          <div style={{height:'120px'}}></div>

          <div className="float-submit">
            <button className="submit-btn" onClick={handlePayment} disabled={!selectedMethod || selectedMethod === "wallet" || isProcessing}>
              <span className="submit-icon">🚀</span>
              {isProcessing ? 'Processing...' : 'Pay & Launch Campaign'}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

