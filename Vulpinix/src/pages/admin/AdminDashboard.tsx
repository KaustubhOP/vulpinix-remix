import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router";
import {
  ShieldAlert, CheckCircle2, XCircle, Clock, AlertCircle,
  LogOut, Search, Lock, User, Eye, EyeOff, ArrowRight,
  Instagram, Facebook, Youtube, Linkedin, Twitter, Globe,
  Bell, X, ChevronLeft, ChevronRight, MessageSquare,
  MapPin, Phone, Mail, DollarSign, Calendar, Tag, Users,
  Shield, CreditCard, ReceiptText, Building2
} from "lucide-react";
import { toast } from "sonner";

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────────────────── */
type CampaignStatus = "pending" | "in_review" | "approved" | "rejected";
interface Campaign {
  id: string;
  businessName: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  businessGoal?: string;
  businessCategory?: string;
  adImage?: string;
  name: string;
  platforms: string[];
  platform?: string;
  budget: string;
  currency?: string;
  duration?: string;
  estimatedReach?: string;
  startDatePreference?: string;
  dateSubmitted: string;
  status: CampaignStatus;
  rejectionReason?: string;
  adminMessage?: string;
  analytics?: Record<string, number>;
  targeting?: { location?: string[]; audience?: string[]; ageRange?: string; gender?: string; interests?: string[] };
  socialHandles?: { instagram?: string; facebook?: string; twitter?: string; linkedin?: string };
  adContentDescription?: string;
  adCaption?: string;
  adCopyText?: string;
  callToAction?: string;
  content?: { mediaUrl?: string; caption?: string; hashtags?: string[] };
  paymentAmount?: string;
  paymentStatus?: string;
  paymentId?: string;
  transactionId?: string;
  paymentDate?: string;
  payment?: { paymentId?: string; transactionId?: string; amount?: string; method?: string; timestamp?: string };
}

/* ─────────────────────────────────────────────────────────────────────────────
   CSS STYLES (injected — pure @keyframes, no JS library required)
───────────────────────────────────────────────────────────────────────────── */
const ADMIN_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  @keyframes adNavSlide   { from { opacity:0; transform:translateY(-20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes adFadeUpStat { from { opacity:0; transform:translateY(24px);  } to { opacity:1; transform:translateY(0); } }
  @keyframes adRowFadeUp  { from { opacity:0; transform:translateY(16px);  } to { opacity:1; transform:translateY(0); } }
  @keyframes adShimmer    {
    0%   { background-position: -400% center; }
    100% { background-position:  400% center; }
  }
  @keyframes adPulseGlow  { 0%,100%{box-shadow:0 0 0 0 rgba(99,51,255,.0);} 50%{box-shadow:0 0 0 6px rgba(99,51,255,.18);} }
  @keyframes adFloat      { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-14px);} }
  @keyframes adOrb1       { 0%,100%{transform:translate(0,0) scale(1);}      50%{transform:translate(30px,-20px) scale(1.05);} }
  @keyframes adOrb2       { 0%,100%{transform:translate(0,0) scale(1);}      50%{transform:translate(-20px,16px) scale(.97);} }
  @keyframes adModalIn    {
    from { opacity:0; transform:scale(.88) translateY(18px); }
    to   { opacity:1; transform:scale(1)   translateY(0);    }
  }
  @keyframes adNewRow     {
    0%  { background-color: rgba(251,191,36,.12); }
    100%{ background-color: transparent; }
  }

  /* root */
  .vx-admin { font-family:'DM Sans',ui-sans-serif,sans-serif; background:#080b14; min-height:100vh; color:#e2e8f0; overflow-x:hidden; }

  /* grid bg */
  .vx-admin__grid {
    position:fixed; inset:0; pointer-events:none; z-index:0;
    background-image:linear-gradient(rgba(139,92,246,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,.04) 1px,transparent 1px);
    background-size:60px 60px;
  }
  .vx-admin__orb1 {
    position:fixed; top:-80px; left:8%; width:420px; height:420px; border-radius:50%;
    background:radial-gradient(circle,rgba(99,51,255,.18) 0%,transparent 70%);
    filter:blur(80px); pointer-events:none; z-index:0; animation:adOrb1 12s ease-in-out infinite;
  }
  .vx-admin__orb2 {
    position:fixed; bottom:-60px; right:6%; width:340px; height:340px; border-radius:50%;
    background:radial-gradient(circle,rgba(6,214,199,.13) 0%,transparent 70%);
    filter:blur(70px); pointer-events:none; z-index:0; animation:adOrb2 14s ease-in-out infinite;
  }

  /* navbar */
  .vx-admin__nav {
    position:sticky; top:0; z-index:50;
    background:rgba(8,11,20,.92); backdrop-filter:blur(20px);
    animation:adNavSlide .5s ease both;
  }
  .vx-admin__nav-border {
    height:1px;
    background:linear-gradient(90deg,transparent,#6333ff,#06d6c7,transparent);
    background-size:200% auto; animation:adShimmer 3.5s linear infinite;
  }
  .vx-admin__nav-inner {
    max-width:1280px; margin:0 auto; padding:0 28px;
    height:64px; display:flex; align-items:center; justify-content:space-between;
  }
  .vx-admin__logo { display:flex; align-items:center; gap:10px; }
  .vx-admin__logo-icon {
    width:34px; height:34px; border-radius:10px;
    background:linear-gradient(135deg,#6333ff,#06d6c7);
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 0 18px rgba(99,51,255,.45);
    font-weight:900; font-size:15px; color:#fff; flex-shrink:0;
  }
  .vx-admin__logo-name {
    font-family:'Syne',sans-serif; font-weight:800; font-size:17px;
    background:linear-gradient(90deg,#c4b5fd,#67e8f9); -webkit-background-clip:text;
    -webkit-text-fill-color:transparent; background-clip:text;
  }
  .vx-admin__badge {
    display:inline-flex; align-items:center; gap:5px;
    padding:3px 10px; border-radius:999px;
    background:rgba(99,51,255,.15); border:1px solid rgba(99,51,255,.35);
    font-size:11px; font-weight:600; color:#a78bfa; letter-spacing:.04em;
  }
  .vx-admin__badge-dot {
    width:6px; height:6px; border-radius:50%;
    background:#4ade80; box-shadow:0 0 6px #4ade80;
  }
  .vx-admin__nav-right { display:flex; align-items:center; gap:14px; }
  .vx-admin__bell-btn {
    position:relative; width:36px; height:36px; border-radius:10px;
    background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1);
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; color:rgba(180,180,220,.7); transition:all .2s;
  }
  .vx-admin__bell-btn:hover { background:rgba(99,51,255,.15); color:#fff; border-color:rgba(99,51,255,.4); }
  .vx-admin__bell-dot {
    position:absolute; top:5px; right:5px; width:8px; height:8px;
    border-radius:50%; background:#ef4444; border:2px solid #080b14;
    box-shadow:0 0 6px #ef4444;
  }
  .vx-admin__admin-name { font-size:13px; color:rgba(180,180,220,.65); }
  .vx-admin__logout-btn {
    display:flex; align-items:center; gap:6px; padding:7px 14px; border-radius:9px;
    background:rgba(239,68,68,.08); border:1px solid rgba(239,68,68,.25);
    color:rgba(252,165,165,.85); font-size:13px; font-weight:600; cursor:pointer;
    transition:all .2s;
  }
  .vx-admin__logout-btn:hover { background:rgba(239,68,68,.18); color:#fff; border-color:rgba(239,68,68,.5); }

  /* main */
  .vx-admin__main { position:relative; z-index:1; max-width:1280px; margin:0 auto; padding:36px 28px 80px; }
  .vx-admin__title { font-family:'Syne',sans-serif; font-weight:800; font-size:32px; color:#fff; margin-bottom:4px; }
  .vx-admin__sub   { font-size:14px; color:rgba(180,180,220,.5); margin-bottom:32px; }

  /* search bar */
  .vx-admin__search-wrap { position:relative; margin-bottom:28px; max-width:400px; }
  .vx-admin__search-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:rgba(180,180,220,.4); }
  .vx-admin__search {
    width:100%; padding:10px 14px 10px 40px;
    background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08);
    border-radius:12px; font-family:'DM Sans',sans-serif; font-size:14px;
    color:#e2e8f0; outline:none; transition:all .2s;
  }
  .vx-admin__search::placeholder { color:rgba(180,180,220,.3); }
  .vx-admin__search:focus { border-color:rgba(99,51,255,.5); box-shadow:0 0 12px rgba(99,51,255,.15); }

  /* stats row */
  .vx-admin__stats { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-bottom:36px; }
  @media(max-width:768px){ .vx-admin__stats{grid-template-columns:repeat(2,1fr);} }
  .vx-admin__stat-card {
    background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.08);
    border-radius:16px; padding:22px 20px; cursor:default;
    transition:all .2s ease; animation:adFadeUpStat .6s ease both;
  }
  .vx-admin__stat-card:hover { transform:translateY(-2px); border-color:rgba(139,92,246,.3); box-shadow:0 8px 32px rgba(99,51,255,.1); }
  .vx-admin__stat-dot { width:8px; height:8px; border-radius:50%; margin-bottom:14px; }
  .vx-admin__stat-label { font-size:11px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:rgba(180,180,220,.5); margin-bottom:6px; }
  .vx-admin__stat-num { font-family:'Syne',sans-serif; font-weight:800; font-size:38px; color:#fff; line-height:1; }

  /* filter tabs */
  .vx-admin__filters { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:24px; }
  .vx-admin__filter-btn {
    padding:7px 18px; border-radius:999px; font-size:13px; font-weight:600;
    border:1px solid rgba(255,255,255,.1); background:rgba(255,255,255,.03);
    color:rgba(180,180,220,.6); cursor:pointer; transition:all .2s; text-transform:capitalize;
  }
  .vx-admin__filter-btn:hover { background:rgba(99,51,255,.12); color:#e2e8f0; border-color:rgba(99,51,255,.3); }
  .vx-admin__filter-btn--active {
    background:linear-gradient(135deg,#6333ff,#06d6c7);
    color:#fff; border-color:transparent; box-shadow:0 0 14px rgba(99,51,255,.3);
  }

  /* table container */
  .vx-admin__table-wrap {
    background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07);
    border-radius:18px; overflow:hidden;
  }
  .vx-admin__table { width:100%; border-collapse:collapse; }
  .vx-admin__thead { background:rgba(255,255,255,.04); }
  .vx-admin__th {
    padding:12px 16px; text-align:left; font-size:10px; font-weight:700;
    letter-spacing:.1em; text-transform:uppercase; color:rgba(180,180,220,.4);
    white-space:nowrap;
  }
  .vx-admin__tr {
    border-top:1px solid rgba(255,255,255,.05);
    transition:background .15s ease;
    animation:adRowFadeUp .5s ease both;
  }
  .vx-admin__tr:hover { background:rgba(139,92,246,.06); }
  .vx-admin__td { padding:14px 16px; vertical-align:middle; }
  .vx-admin__avatar {
    width:36px; height:36px; border-radius:10px;
    background:linear-gradient(135deg,#6333ff55,#06d6c722);
    border:1px solid rgba(99,51,255,.3);
    display:flex; align-items:center; justify-content:center;
    font-family:'Syne',sans-serif; font-weight:700; font-size:14px; color:#a78bfa;
    flex-shrink:0;
  }
  .vx-admin__user-name { font-size:13px; font-weight:600; color:#e2e8f0; }
  .vx-admin__user-email { font-size:11px; color:rgba(180,180,220,.45); margin-top:1px; }
  .vx-admin__td-muted { font-size:13px; color:rgba(180,180,220,.65); }
  .vx-admin__platform-pill {
    display:inline-flex; align-items:center; gap:4px;
    padding:3px 9px; border-radius:999px; border:1px solid rgba(255,255,255,.08);
    background:rgba(255,255,255,.04); font-size:11px; color:rgba(180,180,220,.7);
  }

  /* status badges */
  .vx-admin__status { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:999px; font-size:11px; font-weight:700; letter-spacing:.04em; white-space:nowrap; }
  .vx-admin__status-dot { width:6px; height:6px; border-radius:50%; }
  .vx-admin__status--pending  { background:rgba(251,191,36,.12); border:1px solid rgba(251,191,36,.3); color:#fbbf24; }
  .vx-admin__status--in_review{ background:rgba(59,130,246,.12); border:1px solid rgba(59,130,246,.3); color:#60a5fa; }
  .vx-admin__status--approved { background:rgba(16,185,129,.12); border:1px solid rgba(16,185,129,.3); color:#34d399; }
  .vx-admin__status--rejected { background:rgba(239,68,68,.12);  border:1px solid rgba(239,68,68,.3);  color:#f87171; }

  /* action buttons */
  .vx-admin__actions { display:flex; gap:6px; flex-wrap:wrap; }
  .vx-admin__btn {
    padding:6px 12px; border-radius:8px; font-size:12px; font-weight:600;
    cursor:pointer; border:1px solid; transition:all .2s; display:flex; align-items:center; gap:5px;
  }
  .vx-admin__btn:hover { transform:translateY(-1px); }
  .vx-admin__btn:active { transform:scale(.97); }
  .vx-admin__btn--view    { background:rgba(99,51,255,.1);  border-color:rgba(99,51,255,.3);  color:#a78bfa; }
  .vx-admin__btn--view:hover { background:rgba(99,51,255,.2); border-color:rgba(99,51,255,.6); }
  .vx-admin__btn--approve { background:rgba(16,185,129,.1); border-color:rgba(16,185,129,.3); color:#34d399; }
  .vx-admin__btn--approve:hover { background:rgba(16,185,129,.2); box-shadow:0 0 12px rgba(16,185,129,.25); }
  .vx-admin__btn--approve:disabled { opacity:.4; cursor:not-allowed; transform:none; }
  .vx-admin__btn--reject  { background:rgba(239,68,68,.1);  border-color:rgba(239,68,68,.3);  color:#f87171; }
  .vx-admin__btn--reject:hover { background:rgba(239,68,68,.2); box-shadow:0 0 12px rgba(239,68,68,.2); }
  .vx-admin__btn--reject:disabled { opacity:.4; cursor:not-allowed; transform:none; }
  .vx-admin__btn--msg     { background:rgba(59,130,246,.1); border-color:rgba(59,130,246,.3); color:#60a5fa; }
  .vx-admin__btn--msg:hover { background:rgba(59,130,246,.2); }

  /* empty state */
  .vx-admin__empty { padding:80px 20px; text-align:center; }
  .vx-admin__empty-icon { width:64px; height:64px; border-radius:16px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); display:flex; align-items:center; justify-content:center; margin:0 auto 16px; color:rgba(180,180,220,.3); }

  /* ── DETAIL MODAL ── */
  .vx-admin__overlay {
    position:fixed; inset:0; z-index:100;
    background:rgba(5,7,15,.85); backdrop-filter:blur(12px);
    display:flex; align-items:center; justify-content:center; padding:20px;
  }
  .vx-admin__modal {
    position:relative; width:100%; max-width:700px; max-height:90vh;
    background:#0e1120; border-radius:20px; overflow:hidden;
    display:flex; flex-direction:column;
    animation:adModalIn .35s cubic-bezier(.22,1,.36,1) both;
    border:1px solid rgba(255,255,255,.08);
  }
  .vx-admin__modal-topbar {
    height:3px;
    background:linear-gradient(90deg,#6333ff,#06d6c7);
  }
  .vx-admin__modal-header {
    padding:22px 24px 16px; display:flex; align-items:center; justify-content:space-between;
    border-bottom:1px solid rgba(255,255,255,.07);
  }
  .vx-admin__modal-title { font-family:'Syne',sans-serif; font-weight:700; font-size:18px; color:#fff; }
  .vx-admin__modal-close {
    width:32px; height:32px; border-radius:8px; background:rgba(255,255,255,.06);
    border:1px solid rgba(255,255,255,.1); display:flex; align-items:center; justify-content:center;
    cursor:pointer; color:rgba(180,180,220,.6); transition:all .2s;
  }
  .vx-admin__modal-close:hover { background:rgba(239,68,68,.15); color:#f87171; border-color:rgba(239,68,68,.3); }

  /* tabs */
  .vx-admin__tabs { display:flex; gap:6px; padding:14px 24px; border-bottom:1px solid rgba(255,255,255,.07); overflow-x:auto; }
  .vx-admin__tab {
    padding:7px 16px; border-radius:999px; font-size:12px; font-weight:600;
    border:1px solid rgba(255,255,255,.1); background:rgba(255,255,255,.03);
    color:rgba(180,180,220,.6); cursor:pointer; transition:all .2s; white-space:nowrap;
  }
  .vx-admin__tab:hover { background:rgba(99,51,255,.12); color:#e2e8f0; }
  .vx-admin__tab--active { background:linear-gradient(135deg,#6333ff,#06d6c7); color:#fff; border-color:transparent; }

  /* modal body */
  .vx-admin__modal-body { flex:1; overflow-y:auto; padding:24px; scrollbar-width:thin; scrollbar-color:rgba(99,51,255,.3) transparent; }
  .vx-admin__field-row { display:flex; flex-wrap:wrap; gap:16px; margin-bottom:16px; }
  .vx-admin__field { flex:1; min-width:180px; }
  .vx-admin__field-label { font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:rgba(180,180,220,.4); margin-bottom:5px; }
  .vx-admin__field-val { font-size:14px; color:#e2e8f0; }
  .vx-admin__section-title { font-family:'Syne',sans-serif; font-weight:600; font-size:13px; color:rgba(180,180,220,.7); letter-spacing:.06em; text-transform:uppercase; margin-bottom:14px; padding-bottom:8px; border-bottom:1px solid rgba(255,255,255,.07); }
  .vx-admin__tag { display:inline-flex; align-items:center; padding:3px 10px; border-radius:999px; background:rgba(99,51,255,.12); border:1px solid rgba(99,51,255,.25); font-size:11px; color:#a78bfa; margin:2px; }
  .vx-admin__receipt {
    background:rgba(16,185,129,.06); border:1px solid rgba(16,185,129,.2);
    border-radius:14px; padding:20px;
  }
  .vx-admin__receipt-badge {
    display:inline-flex; align-items:center; gap:6px; padding:5px 12px; border-radius:999px;
    background:rgba(16,185,129,.15); border:1px solid rgba(16,185,129,.3);
    font-size:12px; font-weight:700; color:#34d399; margin-bottom:16px;
  }
  .vx-admin__receipt-row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid rgba(255,255,255,.05); font-size:13px; }
  .vx-admin__receipt-row:last-child { border-bottom:none; }
  .vx-admin__receipt-key { color:rgba(180,180,220,.5); }
  .vx-admin__receipt-val { color:#e2e8f0; font-weight:500; font-family:monospace; font-size:12px; }

  /* modal action bar */
  .vx-admin__modal-actions {
    padding:16px 24px; border-top:1px solid rgba(255,255,255,.07);
    display:flex; gap:10px; flex-wrap:wrap;
  }
  .vx-admin__modal-btn-approve {
    flex:1; padding:11px 20px; border-radius:11px; border:none; cursor:pointer; font-weight:700; font-size:14px; color:#fff;
    background:linear-gradient(135deg,#6333ff,#06d6c7);
    transition:all .2s; display:flex; align-items:center; justify-content:center; gap:6px;
  }
  .vx-admin__modal-btn-approve:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(99,51,255,.4); }
  .vx-admin__modal-btn-approve:disabled { opacity:.4; cursor:not-allowed; transform:none; box-shadow:none; }
  .vx-admin__modal-btn-reject {
    flex:1; padding:11px 20px; border-radius:11px; cursor:pointer; font-weight:700; font-size:14px; color:#f87171;
    background:rgba(239,68,68,.1); border:1px solid rgba(239,68,68,.3);
    transition:all .2s; display:flex; align-items:center; justify-content:center; gap:6px;
  }
  .vx-admin__modal-btn-reject:hover { transform:translateY(-2px); background:rgba(239,68,68,.2); box-shadow:0 8px 24px rgba(239,68,68,.2); }
  .vx-admin__modal-btn-reject:disabled { opacity:.4; cursor:not-allowed; transform:none; box-shadow:none; }
  .vx-admin__reject-inline { margin-top:12px; display:flex; gap:8px; flex-wrap:wrap; }
  .vx-admin__reject-textarea {
    flex:1; min-width:200px; padding:10px 14px; border-radius:10px; font-family:'DM Sans',sans-serif; font-size:13px;
    background:rgba(255,255,255,.05); border:1px solid rgba(239,68,68,.3); color:#e2e8f0;
    resize:none; outline:none; height:48px;
    transition:border-color .2s;
  }
  .vx-admin__reject-textarea:focus { border-color:rgba(239,68,68,.6); }
  .vx-admin__reject-confirm {
    padding:10px 16px; border-radius:10px; background:#ef4444; border:none;
    color:#fff; font-weight:700; font-size:13px; cursor:pointer; transition:all .2s; white-space:nowrap;
  }
  .vx-admin__reject-confirm:hover { background:#dc2626; transform:translateY(-1px); }

  /* login screen */
  .vx-admin__login { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:20px; background:#080b14; position:relative; overflow:hidden; }
  .vx-admin__login-card {
    position:relative; z-index:1; width:100%; max-width:420px;
    background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.08);
    border-radius:24px; padding:40px; backdrop-filter:blur(20px);
    box-shadow:0 32px 80px rgba(0,0,0,.5);
  }
  .vx-admin__login-topbar { position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#6333ff,#06d6c7); border-radius:24px 24px 0 0; }
  .vx-admin__login-icon {
    width:60px; height:60px; border-radius:16px; margin:0 auto 22px;
    background:linear-gradient(135deg,#6333ff,#06d6c7);
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 0 30px rgba(99,51,255,.4);
  }
  .vx-admin__login-title { font-family:'Syne',sans-serif; font-weight:800; font-size:26px; color:#fff; text-align:center; margin-bottom:6px; }
  .vx-admin__login-sub { font-size:13px; color:rgba(180,180,220,.5); text-align:center; margin-bottom:28px; }
  .vx-admin__input-wrap { position:relative; margin-bottom:16px; }
  .vx-admin__input-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:rgba(180,180,220,.4); }
  .vx-admin__input {
    width:100%; padding:12px 14px 12px 42px;
    background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1);
    border-radius:12px; font-family:'DM Sans',sans-serif; font-size:14px;
    color:#e2e8f0; outline:none; transition:all .2s;
    box-sizing:border-box;
  }
  .vx-admin__input::placeholder { color:rgba(180,180,220,.3); }
  .vx-admin__input:focus { border-color:rgba(99,51,255,.6); box-shadow:0 0 12px rgba(99,51,255,.2); }
  .vx-admin__show-pwd { position:absolute; right:13px; top:50%; transform:translateY(-50%); cursor:pointer; color:rgba(180,180,220,.4); background:none; border:none; padding:0; }
  .vx-admin__login-btn {
    width:100%; padding:13px; border-radius:12px; border:none; cursor:pointer; font-weight:700; font-size:15px;
    color:#fff; background:linear-gradient(135deg,#6333ff,#06d6c7);
    margin-top:8px; transition:all .2s; display:flex; align-items:center; justify-content:center; gap:8px;
  }
  .vx-admin__login-btn:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(99,51,255,.45); }
  .vx-admin__login-btn:disabled { opacity:.6; cursor:not-allowed; transform:none; box-shadow:none; }
  .vx-admin__back-btn { width:100%; margin-top:14px; background:none; border:none; cursor:pointer; font-size:13px; color:rgba(180,180,220,.4); transition:color .2s; }
  .vx-admin__back-btn:hover { color:rgba(180,180,220,.8); }

  /* ad creative preview */
  .vx-admin__ad-preview { border-radius:14px; overflow:hidden; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); margin-bottom:16px; max-height:300px; display:flex; align-items:center; justify-content:center; }
  .vx-admin__ad-preview img { width:100%; height:100%; object-fit:cover; max-height:300px; }
  .vx-admin__ad-no-media { padding:40px; text-align:center; color:rgba(180,180,220,.3); font-size:13px; }
  .vx-admin__caption-block { background:rgba(99,51,255,.08); border-left:3px solid #6333ff; border-radius:0 10px 10px 0; padding:12px 14px; font-size:13px; color:#c4b5fd; font-style:italic; margin-bottom:14px; }
  @media(max-width:640px){
    .vx-admin__table-wrap{ overflow-x:auto; }
    .vx-admin__modal { max-height:95vh; }
    .vx-admin__stats { grid-template-columns:repeat(2,1fr); }
  }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   ANIMATED COUNTER HOOK
───────────────────────────────────────────────────────────────────────────── */
function useCounter(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

/* ─────────────────────────────────────────────────────────────────────────────
   PLATFORM ICON HELPER
───────────────────────────────────────────────────────────────────────────── */
function PlatformIcon({ p }: { p: string }) {
  const s = p.toLowerCase();
  if (s.includes("instagram")) return <Instagram size={12} />;
  if (s.includes("facebook"))  return <Facebook size={12} />;
  if (s.includes("youtube"))   return <Youtube size={12} />;
  if (s.includes("twitter") || s.includes("x")) return <Twitter size={12} />;
  if (s.includes("linkedin"))  return <Linkedin size={12} />;
  return <Globe size={12} />;
}

/* ─────────────────────────────────────────────────────────────────────────────
   STATUS CONFIG
───────────────────────────────────────────────────────────────────────────── */
const STATUS_CONFIG: Record<CampaignStatus, { label: string; dotColor: string; cls: string }> = {
  pending:   { label: "Pending",   dotColor: "#fbbf24", cls: "vx-admin__status--pending" },
  in_review: { label: "In Review", dotColor: "#60a5fa", cls: "vx-admin__status--in_review" },
  approved:  { label: "Approved",  dotColor: "#34d399", cls: "vx-admin__status--approved" },
  rejected:  { label: "Rejected",  dotColor: "#f87171", cls: "vx-admin__status--rejected" },
};

/* ─────────────────────────────────────────────────────────────────────────────
   DETAIL MODAL
───────────────────────────────────────────────────────────────────────────── */
const TABS = ["User & Business", "Campaign Details", "Ad Creative", "Payment Info"] as const;
type Tab = typeof TABS[number];

function DetailModal({
  campaign,
  onClose,
  onApprove,
  onReject,
}: {
  campaign: Campaign;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}) {
  const [tab, setTab] = useState<Tab>("User & Business");
  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const initials = (campaign.userName || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const pmt = campaign.payment;

  return (
    <div className="vx-admin__overlay" onClick={onClose}>
      <div className="vx-admin__modal" onClick={e => e.stopPropagation()}>
        <div className="vx-admin__modal-topbar" />

        {/* Header */}
        <div className="vx-admin__modal-header">
          <div>
            <div className="vx-admin__modal-title">{campaign.name}</div>
            <div style={{ fontSize: 12, color: "rgba(180,180,220,.5)", marginTop: 2 }}>{campaign.businessName}</div>
          </div>
          <button className="vx-admin__modal-close" onClick={onClose}><X size={16} /></button>
        </div>

        {/* Tabs */}
        <div className="vx-admin__tabs">
          {TABS.map(t => (
            <button key={t} className={`vx-admin__tab${tab === t ? " vx-admin__tab--active" : ""}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        {/* Body */}
        <div className="vx-admin__modal-body">

          {tab === "User & Business" && (
            <div>
              {/* Avatar + name */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
                <div className="vx-admin__avatar" style={{ width: 52, height: 52, fontSize: 18, borderRadius: 14 }}>{initials}</div>
                <div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 17, color: "#fff" }}>{campaign.userName || "Unknown"}</div>
                  <div style={{ fontSize: 12, color: "rgba(180,180,220,.5)" }}>{campaign.userEmail || "—"}</div>
                </div>
              </div>
              <div className="vx-admin__section-title">Contact</div>
              <div className="vx-admin__field-row">
                <div className="vx-admin__field">
                  <div className="vx-admin__field-label"><Mail size={10} style={{ display:"inline", marginRight:4 }} />Email</div>
                  <div className="vx-admin__field-val">{campaign.userEmail || "—"}</div>
                </div>
                <div className="vx-admin__field">
                  <div className="vx-admin__field-label"><Phone size={10} style={{ display:"inline", marginRight:4 }} />Phone</div>
                  <div className="vx-admin__field-val">{campaign.userPhone || "—"}</div>
                </div>
              </div>
              <div className="vx-admin__section-title" style={{ marginTop: 20 }}>Business</div>
              <div className="vx-admin__field-row">
                <div className="vx-admin__field">
                  <div className="vx-admin__field-label"><Building2 size={10} style={{ display:"inline", marginRight:4 }} />Business Name</div>
                  <div className="vx-admin__field-val">{campaign.businessName || "—"}</div>
                </div>
                <div className="vx-admin__field">
                  <div className="vx-admin__field-label"><Tag size={10} style={{ display:"inline", marginRight:4 }} />Category</div>
                  <div className="vx-admin__field-val">{campaign.businessCategory || "—"}</div>
                </div>
              </div>
              <div className="vx-admin__field">
                <div className="vx-admin__field-label">Business Goal</div>
                <div className="vx-admin__field-val">{campaign.businessGoal || "—"}</div>
              </div>
            </div>
          )}

          {tab === "Campaign Details" && (
            <div>
              <div className="vx-admin__section-title">Platform & Budget</div>
              <div className="vx-admin__field-row">
                <div className="vx-admin__field">
                  <div className="vx-admin__field-label">Platforms</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                    {(campaign.platforms || []).map(p => (
                      <span key={p} className="vx-admin__platform-pill"><PlatformIcon p={p} />{p}</span>
                    ))}
                  </div>
                </div>
                <div className="vx-admin__field">
                  <div className="vx-admin__field-label"><DollarSign size={10} style={{ display:"inline", marginRight:4 }} />Budget</div>
                  <div className="vx-admin__field-val">{campaign.budget}</div>
                </div>
              </div>
              <div className="vx-admin__field-row">
                <div className="vx-admin__field">
                  <div className="vx-admin__field-label"><Clock size={10} style={{ display:"inline", marginRight:4 }} />Duration</div>
                  <div className="vx-admin__field-val">{campaign.duration || "—"}</div>
                </div>
                <div className="vx-admin__field">
                  <div className="vx-admin__field-label"><Calendar size={10} style={{ display:"inline", marginRight:4 }} />Start Preference</div>
                  <div className="vx-admin__field-val">{campaign.startDatePreference || "—"}</div>
                </div>
              </div>

              <div className="vx-admin__section-title" style={{ marginTop: 20 }}>Targeting</div>
              <div className="vx-admin__field-row">
                <div className="vx-admin__field">
                  <div className="vx-admin__field-label">Age Range</div>
                  <div className="vx-admin__field-val">{campaign.targeting?.ageRange || "—"}</div>
                </div>
                <div className="vx-admin__field">
                  <div className="vx-admin__field-label">Gender</div>
                  <div className="vx-admin__field-val" style={{ textTransform: "capitalize" }}>{campaign.targeting?.gender || "All"}</div>
                </div>
              </div>
              <div className="vx-admin__field" style={{ marginBottom: 12 }}>
                <div className="vx-admin__field-label"><MapPin size={10} style={{ display:"inline", marginRight:4 }} />Locations</div>
                <div style={{ marginTop: 6 }}>
                  {(campaign.targeting?.location || []).map(l => <span key={l} className="vx-admin__tag">{l}</span>)}
                  {(!campaign.targeting?.location?.length) && <span style={{ fontSize: 13, color: "rgba(180,180,220,.4)" }}>—</span>}
                </div>
              </div>
              <div className="vx-admin__field" style={{ marginBottom: 12 }}>
                <div className="vx-admin__field-label"><Users size={10} style={{ display:"inline", marginRight:4 }} />Interests</div>
                <div style={{ marginTop: 6 }}>
                  {(campaign.targeting?.interests || []).map(i => <span key={i} className="vx-admin__tag">{i}</span>)}
                  {(!campaign.targeting?.interests?.length) && <span style={{ fontSize: 13, color: "rgba(180,180,220,.4)" }}>—</span>}
                </div>
              </div>

              {campaign.socialHandles && Object.values(campaign.socialHandles).some(Boolean) && (
                <>
                  <div className="vx-admin__section-title" style={{ marginTop: 20 }}>Social Handles</div>
                  <div className="vx-admin__field-row">
                    {Object.entries(campaign.socialHandles).map(([key, val]) => val ? (
                      <div key={key} className="vx-admin__field">
                        <div className="vx-admin__field-label" style={{ textTransform: "capitalize" }}>{key}</div>
                        <div className="vx-admin__field-val" style={{ color: "#a78bfa" }}>@{val}</div>
                      </div>
                    ) : null)}
                  </div>
                </>
              )}
            </div>
          )}

          {tab === "Ad Creative" && (
            <div>
              <div className="vx-admin__section-title">Creative Preview</div>
              <div className="vx-admin__ad-preview">
                {campaign.adImage
                  ? <img src={campaign.adImage} alt="Ad preview" />
                  : <div className="vx-admin__ad-no-media">No media attached</div>
                }
              </div>
              {campaign.adCaption && (
                <>
                  <div className="vx-admin__field-label" style={{ marginBottom: 6 }}>Ad Caption</div>
                  <div className="vx-admin__caption-block">"{campaign.adCaption}"</div>
                </>
              )}
              <div className="vx-admin__field-row">
                <div className="vx-admin__field">
                  <div className="vx-admin__field-label">Ad Description</div>
                  <div className="vx-admin__field-val">{campaign.adContentDescription || campaign.adCopyText || "—"}</div>
                </div>
                <div className="vx-admin__field">
                  <div className="vx-admin__field-label">Call To Action</div>
                  <div className="vx-admin__field-val">{campaign.callToAction || "—"}</div>
                </div>
              </div>
            </div>
          )}

          {tab === "Payment Info" && (
            <div>
              <div className="vx-admin__receipt">
                <div className="vx-admin__receipt-badge">
                  <CheckCircle2 size={13} /> Payment Confirmed ✓
                </div>
                {[
                  ["Amount Paid",     campaign.paymentAmount || pmt?.amount || "—"],
                  ["Payment ID",      campaign.paymentId     || pmt?.paymentId     || "—"],
                  ["Transaction ID",  campaign.transactionId || pmt?.transactionId || "—"],
                  ["Payment Method",  pmt?.method || "—"],
                  ["Date & Time",     campaign.paymentDate
                      ? new Date(campaign.paymentDate).toLocaleString()
                      : pmt?.timestamp ? new Date(pmt.timestamp).toLocaleString() : "—"],
                  ["Status",          campaign.paymentStatus || "paid"],
                ].map(([k, v]) => (
                  <div key={k} className="vx-admin__receipt-row">
                    <span className="vx-admin__receipt-key">{k}</span>
                    <span className="vx-admin__receipt-val">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Action bar */}
        <div className="vx-admin__modal-actions">
          <button
            className="vx-admin__modal-btn-approve"
            disabled={campaign.status === "approved"}
            onClick={() => { onApprove(campaign.id); onClose(); }}
          >
            <CheckCircle2 size={15} /> Approve
          </button>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
            <button
              className="vx-admin__modal-btn-reject"
              disabled={campaign.status === "rejected"}
              onClick={() => setShowReject(r => !r)}
            >
              <XCircle size={15} /> {showReject ? "Cancel" : "Reject"}
            </button>
            {showReject && (
              <div className="vx-admin__reject-inline">
                <textarea
                  className="vx-admin__reject-textarea"
                  placeholder="Reason for rejection..."
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                />
                <button
                  className="vx-admin__reject-confirm"
                  onClick={() => {
                    if (!rejectReason.trim()) { toast.error("Reason required"); return; }
                    onReject(campaign.id, rejectReason);
                    onClose();
                  }}
                >
                  Confirm
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────────────────────────────────────── */
function StatCard({ label, value, dotColor, delay }: { label: string; value: number; dotColor: string; delay: number }) {
  const animated = useCounter(value);
  return (
    <div className="vx-admin__stat-card" style={{ animationDelay: `${delay}s` }}>
      <div className="vx-admin__stat-dot" style={{ background: dotColor, boxShadow: `0 0 8px ${dotColor}88` }} />
      <div className="vx-admin__stat-label">{label}</div>
      <div className="vx-admin__stat-num">{animated}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const navigate = useNavigate();

  // ── Auth state ─────────────────────────────────────────────────────────────
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem("adminAuthenticated") === "true");
  const [adminInfo, setAdminInfo] = useState<{ name: string } | null>(null);
  const [adminId, setAdminId] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // ── Dashboard state ────────────────────────────────────────────────────────
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filter, setFilter] = useState<CampaignStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // ── Load campaigns ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) return;
    loadCampaigns();
  }, [isAuthenticated]);

  const loadCampaigns = async () => {
    // Try MongoDB first
    const token = sessionStorage.getItem("adminToken");
    if (token) {
      try {
        const res = await fetch("http://localhost:5000/api/admin/campaigns", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.campaigns)) {
          setCampaigns(data.campaigns);
          return;
        }
      } catch {
        // fall through to localStorage
      }
    }
    // Fallback: localStorage
    const raw = localStorage.getItem("userCampaigns");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) { setCampaigns(parsed); return; }
      const legacy: Campaign[] = [
        ...(parsed.inReview || []).map((c: Campaign) => ({ ...c, status: "in_review" as CampaignStatus })),
        ...(parsed.history  || []).map((c: Campaign) => ({ ...c, status: (c.status as string) === "active" ? "approved" as CampaignStatus : c.status })),
      ];
      setCampaigns(legacy);
    } catch { /* ignore */ }
  };

  // ── Login ──────────────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminId || !adminPassword) { toast.error("Please enter credentials"); return; }
    setIsLoggingIn(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId, password: adminPassword }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        sessionStorage.setItem("adminAuthenticated", "true");
        sessionStorage.setItem("adminToken", data.token);
        setAdminInfo({ name: data.admin?.name || "Admin" });
        setIsAuthenticated(true);
        toast.success(`Welcome, ${data.admin?.name || "Admin"}!`);
      } else {
        // Fallback for dev without backend
        if (adminId === "admin" && adminPassword === "admin") {
          sessionStorage.setItem("adminAuthenticated", "true");
          setAdminInfo({ name: "Administrator" });
          setIsAuthenticated(true);
          toast.success("Welcome, Administrator!");
        } else {
          toast.error(data.message || "Invalid credentials");
        }
      }
    } catch {
      // Backend offline — use local credentials
      if (adminId === "admin" && adminPassword === "admin") {
        sessionStorage.setItem("adminAuthenticated", "true");
        setAdminInfo({ name: "Administrator" });
        setIsAuthenticated(true);
        toast.success("Welcome, Administrator! (offline mode)");
      } else {
        toast.error("Backend unavailable. Try admin / admin for demo.");
      }
    }
    setIsLoggingIn(false);
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    sessionStorage.removeItem("adminAuthenticated");
    sessionStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    toast.info("Logged out safely");
    navigate("/");
  };

  // ── Status update ──────────────────────────────────────────────────────────
  const updateStatus = async (id: string, status: CampaignStatus, reason?: string) => {
    const token = sessionStorage.getItem("adminToken");
    // Try API
    if (token) {
      try {
        await fetch(`http://localhost:5000/api/admin/campaigns/${id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ status, rejectionReason: reason }),
        });
      } catch { /* offline — update locally only */ }
    }
    // Update local state + localStorage
    const updated = campaigns.map(c => {
      if (c.id !== id) return c;
      const next: Campaign = { ...c, status };
      if (reason) next.rejectionReason = reason;
      if (status === "approved" && !c.analytics?.impressions) {
        next.analytics = {
          impressions: Math.floor(Math.random() * 50000) + 10000,
          reach: Math.floor(Math.random() * 30000) + 5000,
          clicks: Math.floor(Math.random() * 3000) + 500,
          ctr: parseFloat((Math.random() * 3.3 + 1.2).toFixed(2)),
          conversions: Math.floor(Math.random() * 200) + 20,
          adSpend: Math.floor(Math.random() * 5000) + 1000,
          roas: parseFloat((Math.random() * 4 + 1.5).toFixed(2)),
        };
      }
      return next;
    });
    setCampaigns(updated);
    localStorage.setItem("userCampaigns", JSON.stringify(updated));
    if (status === "approved") toast.success("Campaign approved ✓");
    else if (status === "rejected") toast.error("Campaign rejected");
    else toast.info(`Status → ${status.replace("_", " ")}`);
  };

  // ── Derived data ───────────────────────────────────────────────────────────
  const filtered = campaigns.filter(c => {
    const matchFilter = filter === "all" || c.status === filter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || c.name?.toLowerCase().includes(q) || c.businessName?.toLowerCase().includes(q) || c.userEmail?.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const stats = [
    { label: "Total Submissions", value: campaigns.length, dotColor: "#94a3b8" },
    { label: "Pending Review",    value: campaigns.filter(c => c.status === "pending").length, dotColor: "#fbbf24" },
    { label: "Approved",          value: campaigns.filter(c => c.status === "approved").length, dotColor: "#34d399" },
    { label: "Rejected",          value: campaigns.filter(c => c.status === "rejected").length, dotColor: "#f87171" },
  ];

  const pendingCount = campaigns.filter(c => c.status === "pending").length;

  /* ── LOGIN SCREEN ── */
  if (!isAuthenticated) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: ADMIN_STYLES }} />
        <div className="vx-admin__login">
          <div className="vx-admin__grid" />
          <div style={{ position: "absolute", top: "20%", left: "15%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,51,255,.15) 0%,transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "15%", right: "10%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle,rgba(6,214,199,.12) 0%,transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />

          <motion.div className="vx-admin__login-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
            <div className="vx-admin__login-topbar" />
            <div className="vx-admin__login-icon"><ShieldAlert size={28} color="#fff" /></div>
            <div className="vx-admin__login-title">Admin Portal</div>
            <div className="vx-admin__login-sub">Sign in to review and manage campaigns</div>

            <form onSubmit={handleLogin}>
              <div className="vx-admin__input-wrap">
                <User size={16} className="vx-admin__input-icon" />
                <input className="vx-admin__input" placeholder="Admin ID" value={adminId} onChange={e => setAdminId(e.target.value)} />
              </div>
              <div className="vx-admin__input-wrap">
                <Lock size={16} className="vx-admin__input-icon" />
                <input className="vx-admin__input" type={showPassword ? "text" : "password"} placeholder="Password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} />
                <button type="button" className="vx-admin__show-pwd" onClick={() => setShowPassword(s => !s)}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <button type="submit" className="vx-admin__login-btn" disabled={isLoggingIn}>
                {isLoggingIn ? <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "adOrb1 .8s linear infinite" }} /> : <><span>Sign In to Portal</span><ArrowRight size={16} /></>}
              </button>
            </form>
            <button className="vx-admin__back-btn" onClick={() => navigate("/")}>← Return to Main Website</button>
          </motion.div>
        </div>
      </>
    );
  }

  /* ── DASHBOARD ── */
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: ADMIN_STYLES }} />
      <div className="vx-admin">
        <div className="vx-admin__grid" />
        <div className="vx-admin__orb1" />
        <div className="vx-admin__orb2" />

        {/* Navbar */}
        <nav className="vx-admin__nav">
          <div className="vx-admin__nav-inner">
            <div className="vx-admin__logo">
              <span className="vx-admin__logo-icon">V</span>
              <span className="vx-admin__logo-name">Vulpinix AI</span>
              <span className="vx-admin__badge"><span className="vx-admin__badge-dot" />Admin Panel</span>
            </div>
            <div className="vx-admin__nav-right">
              <span className="vx-admin__admin-name">{adminInfo?.name || "Administrator"}</span>
              <button className="vx-admin__bell-btn" aria-label="Notifications">
                <Bell size={16} />
                {pendingCount > 0 && <span className="vx-admin__bell-dot" />}
              </button>
              <button className="vx-admin__logout-btn" onClick={handleLogout}>
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>
          <div className="vx-admin__nav-border" />
        </nav>

        {/* Main */}
        <div className="vx-admin__main">
          <h1 className="vx-admin__title">Campaign Queue</h1>
          <p className="vx-admin__sub">Review user submissions and manage campaign approvals.</p>

          {/* Stats */}
          <div className="vx-admin__stats">
            {stats.map((s, i) => <StatCard key={s.label} label={s.label} value={s.value} dotColor={s.dotColor} delay={i * 0.08} />)}
          </div>

          {/* Search */}
          <div className="vx-admin__search-wrap">
            <Search size={15} className="vx-admin__search-icon" />
            <input className="vx-admin__search" placeholder="Search by name, business, email…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>

          {/* Filter tabs */}
          <div className="vx-admin__filters">
            {(["all", "pending", "in_review", "approved", "rejected"] as const).map(f => (
              <button key={f} className={`vx-admin__filter-btn${filter === f ? " vx-admin__filter-btn--active" : ""}`} onClick={() => setFilter(f)}>
                {f.replace("_", " ")}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="vx-admin__table-wrap">
            {filtered.length === 0 ? (
              <div className="vx-admin__empty">
                <div className="vx-admin__empty-icon"><ShieldAlert size={28} /></div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "rgba(180,180,220,.7)", marginBottom: 6 }}>No campaigns found</div>
                <div style={{ fontSize: 13, color: "rgba(180,180,220,.4)" }}>Waiting for users to submit new content.</div>
              </div>
            ) : (
              <table className="vx-admin__table">
                <thead className="vx-admin__thead">
                  <tr>
                    {["", "User", "Business", "Platform", "Budget", "Submitted", "Status", "Actions"].map(h => (
                      <th key={h} className="vx-admin__th">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, idx) => {
                    const sc = STATUS_CONFIG[c.status] || STATUS_CONFIG.pending;
                    const initials = (c.userName || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
                    return (
                      <tr key={c.id} className="vx-admin__tr" style={{ animationDelay: `${idx * 0.04}s` }}>
                        <td className="vx-admin__td">
                          <div className="vx-admin__avatar">{initials}</div>
                        </td>
                        <td className="vx-admin__td">
                          <div className="vx-admin__user-name">{c.userName || "—"}</div>
                          <div className="vx-admin__user-email">{c.userEmail || "—"}</div>
                        </td>
                        <td className="vx-admin__td vx-admin__td-muted">{c.businessName}</td>
                        <td className="vx-admin__td">
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                            {(c.platforms || []).slice(0, 2).map(p => (
                              <span key={p} className="vx-admin__platform-pill"><PlatformIcon p={p} /></span>
                            ))}
                            {(c.platforms || []).length > 2 && <span className="vx-admin__platform-pill">+{c.platforms.length - 2}</span>}
                          </div>
                        </td>
                        <td className="vx-admin__td vx-admin__td-muted">{c.budget}</td>
                        <td className="vx-admin__td vx-admin__td-muted" style={{ whiteSpace: "nowrap" }}>
                          {new Date(c.dateSubmitted).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })}
                        </td>
                        <td className="vx-admin__td">
                          <span className={`vx-admin__status ${sc.cls}`}>
                            <span className="vx-admin__status-dot" style={{ background: sc.dotColor }} />
                            {sc.label}
                          </span>
                        </td>
                        <td className="vx-admin__td">
                          <div className="vx-admin__actions">
                            <button className="vx-admin__btn vx-admin__btn--view" onClick={() => setSelectedCampaign(c)}>
                              <Eye size={11} /> View
                            </button>
                            <button className="vx-admin__btn vx-admin__btn--approve" disabled={c.status === "approved"} onClick={() => updateStatus(c.id, "approved")}>
                              <CheckCircle2 size={11} /> Approve
                            </button>
                            <button className="vx-admin__btn vx-admin__btn--reject" disabled={c.status === "rejected"} onClick={() => {
                              const reason = prompt("Rejection reason:");
                              if (reason) updateStatus(c.id, "rejected", reason);
                            }}>
                              <XCircle size={11} /> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedCampaign && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, zIndex: 100 }}>
              <DetailModal
                campaign={selectedCampaign}
                onClose={() => setSelectedCampaign(null)}
                onApprove={id => { updateStatus(id, "approved"); setSelectedCampaign(null); }}
                onReject={(id, reason) => { updateStatus(id, "rejected", reason); setSelectedCampaign(null); }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
