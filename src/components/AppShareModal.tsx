import { useState } from "react";
export default function AppShareModal({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const appUrl = window.location.origin;
  const appName = "Realty Buyers — Maricopa County";
  const appDesc = "Real estate listings, foreclosures, liens, FSBO, legal resources & mortgage calculator for Maricopa County, AZ.";
  const copy = () => { navigator.clipboard.writeText(appUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const downloadInstructions = () => {
    const lines = [
      "REALTY BUYERS - MARICOPA COUNTY",
      "Created by Global Resources Management Group, LLC",
      "================================================",
      "",
      "ONE-CLICK LAUNCH (Windows):",
      "1. Find Launch Realty Buyers App.bat on your Desktop",
      "2. Double-click it — app opens automatically in Chrome",
      "3. No commands needed — fully automatic!",
      "",
      "MANUAL START (if needed):",
      "1. Open PowerShell",
      "2. Type: cd C:\\Users\\brianallicat\\realty-buyers-search",
      "3. Type: npm run dev",
      "4. Open Chrome: http://localhost:3001",
      "",
      "NEED NODE.JS?",
      "Download free from: https://nodejs.org (LTS version)",
      "",
      "APP FEATURES:",
      "- Real estate listings: Under $1M, Over $1M, Ultra Luxury $6M+",
      "- Foreclosures & Liens (Maricopa County public records)",
      "- FSBO Listings from Zillow",
      "- Legal Resources: Definitions, Laws, IRS Forms",
      "- Agreement Templates with fill-in-the-blank editor",
      "- Advanced Mortgage Calculator with live bank rates",
      "",
      "================================================",
      "App URL: http://localhost:3001",
      "================================================",
    ];
    const blob = new Blob([lines.join("\r\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "Realty-Buyers-Instructions.txt"; a.click();
    URL.revokeObjectURL(url);
  };
  const shareLinks = [
    { label: "📧 Email", color: "#58a6ff", action: () => window.open("mailto:?subject=" + encodeURIComponent(appName) + "&body=" + encodeURIComponent(appDesc + "\n\n" + appUrl)) },
    { label: "💬 SMS", color: "#3fb950", action: () => window.open("sms:?body=" + encodeURIComponent(appName + " - " + appUrl)) },
    { label: "🟢 WhatsApp", color: "#25d366", action: () => window.open("https://wa.me/?text=" + encodeURIComponent(appName + "\n" + appDesc + "\n" + appUrl)) },
    { label: "✈️ Telegram", color: "#2aabee", action: () => window.open("https://t.me/share/url?url=" + encodeURIComponent(appUrl) + "&text=" + encodeURIComponent(appName)) },
    { label: "🐦 Twitter/X", color: "#1da1f2", action: () => window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(appName) + "&url=" + encodeURIComponent(appUrl)) },
    { label: "💼 LinkedIn", color: "#0077b5", action: () => window.open("https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(appUrl)) },
  ];
  const sections = [
    { label: "Dashboard", view: "real_estate_dashboard", icon: "📊" },
    { label: "Foreclosures", view: "foreclosures", icon: "🔨" },
    { label: "Liens", view: "liens", icon: "📋" },
    { label: "FSBO Listings", view: "fsbo_listings", icon: "🏠" },
    { label: "Listings Under $1M", view: "listings_under_1m", icon: "🏷️" },
    { label: "Listings Over $1M", view: "listings_over_1m", icon: "💎" },
    { label: "Ultra Luxury $6M+", view: "ultra_luxury_listings", icon: "👑" },
    { label: "RE Definitions", view: "legal_definitions", icon: "📖" },
    { label: "State/Federal Laws", view: "legal_laws", icon: "⚖️" },
    { label: "IRS & Tax Rules", view: "legal_irs", icon: "🏛️" },
    { label: "Agreement Templates", view: "legal_agreements", icon: "📄" },
    { label: "Mortgage Calculator", view: "calculator", icon: "🏦" },
  ];
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px",backdropFilter:"blur(4px)"}}>
      <div style={{background:"#0d1117",border:"1px solid #21262d",borderRadius:"20px",width:"100%",maxWidth:"680px",maxHeight:"90vh",overflow:"auto",boxShadow:"0 25px 60px rgba(0,0,0,0.6)"}}>
        <div style={{padding:"24px 28px 20px",background:"linear-gradient(135deg,#0d1f3c,#0d1117)",borderBottom:"1px solid #21262d",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:"16px"}}>
            <div style={{width:"56px",height:"56px",borderRadius:"14px",background:"linear-gradient(135deg,#1a3a6b,#2563eb)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(37,99,235,0.4)",flexShrink:0}}>
              <svg width="32" height="32" viewBox="0 0 36 36" fill="none"><path d="M18 4L32 14V32H22V22H14V32H4V14L18 4Z" fill="white" opacity="0.95"/><circle cx="18" cy="16" r="3" fill="#60a5fa"/></svg>
            </div>
            <div>
              <div style={{color:"#f0f6fc",fontSize:"20px",fontWeight:800}}>Realty Buyers</div>
              <div style={{color:"#58a6ff",fontSize:"13px",fontWeight:500}}>Maricopa County, AZ</div>
              <div style={{color:"#8b949e",fontSize:"11px",marginTop:"2px"}}>Public Records • Listings • Legal Tools • Calculator</div>
              <div style={{color:"#93c5fd",fontSize:"10px",fontWeight:700,marginTop:"3px"}}>Created by Global Resources Management Group, LLC</div>
            </div>
          </div>
          <button onClick={onClose} style={{background:"#21262d",border:"1px solid #30363d",color:"#8b949e",width:"36px",height:"36px",borderRadius:"10px",cursor:"pointer",fontSize:"18px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>✕</button>
        </div>
        <div style={{padding:"24px 28px",display:"flex",flexDirection:"column",gap:"20px"}}>
          <div>
            <div style={{color:"#8b949e",fontSize:"12px",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:"10px"}}>One-Click Launch</div>
            <div style={{background:"linear-gradient(135deg,rgba(37,99,235,0.12),rgba(88,166,255,0.06))",border:"1px solid rgba(59,130,246,0.3)",borderRadius:"12px",padding:"16px"}}>
              <div style={{color:"#93c5fd",fontSize:"13px",fontWeight:700,marginBottom:"10px"}}>🖥️ Windows — Zero Setup Required</div>
              <div style={{color:"#c9d1d9",fontSize:"13px",lineHeight:"1.8"}}>
                <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"6px"}}>
                  <span style={{background:"#2563eb",color:"#fff",borderRadius:"50%",width:"22px",height:"22px",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:700,flexShrink:0}}>1</span>
                  <span>Find <strong style={{color:"#f0f6fc"}}>"Launch Realty Buyers App.bat"</strong> on your Desktop</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"6px"}}>
                  <span style={{background:"#2563eb",color:"#fff",borderRadius:"50%",width:"22px",height:"22px",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:700,flexShrink:0}}>2</span>
                  <span><strong style={{color:"#f0f6fc"}}>Double-click it</strong> — app starts and opens in Chrome automatically</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                  <span style={{background:"#3fb950",color:"#fff",borderRadius:"50%",width:"22px",height:"22px",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:700,flexShrink:0}}>✓</span>
                  <span style={{color:"#3fb950",fontWeight:600}}>That's it — no typing, no commands needed!</span>
                </div>
              </div>
            </div>
            <div style={{display:"flex",gap:"8px",marginTop:"10px"}}>
              <button onClick={downloadInstructions} style={{flex:1,padding:"12px",background:"linear-gradient(135deg,#1a3a6b,#2563eb)",border:"1px solid #3b82f6",borderRadius:"10px",color:"#fff",cursor:"pointer",fontSize:"13px",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}>⬇️ Download Instructions (.txt)</button>
              <button onClick={() => window.open(appUrl,"_blank")} style={{padding:"12px 18px",background:"#161b22",border:"1px solid #3fb950",borderRadius:"10px",color:"#3fb950",cursor:"pointer",fontSize:"13px",fontWeight:700}}>🚀 Open App</button>
            </div>
          </div>
          <div>
            <div style={{color:"#8b949e",fontSize:"12px",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:"10px"}}>App Link</div>
            <div style={{display:"flex",gap:"8px"}}>
              <div style={{flex:1,background:"#161b22",border:"1px solid #30363d",borderRadius:"10px",padding:"12px 16px",color:"#58a6ff",fontSize:"14px",fontFamily:"monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{appUrl}</div>
              <button onClick={copy} style={{padding:"12px 20px",background:copied?"#3fb950":"#f0a500",color:"#0d1117",border:"none",borderRadius:"10px",cursor:"pointer",fontSize:"13px",fontWeight:700,flexShrink:0,transition:"background 0.2s"}}>{copied?"✓ Copied!":"📋 Copy"}</button>
            </div>
          </div>
          <div>
            <div style={{color:"#8b949e",fontSize:"12px",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:"10px"}}>Share App</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"8px"}}>
              {shareLinks.map(s => (
                <button key={s.label} onClick={s.action} style={{padding:"12px",background:"#161b22",border:"1px solid " + s.color + "40",borderRadius:"10px",color:s.color,cursor:"pointer",fontSize:"13px",fontWeight:600,textAlign:"center"}}
                  onMouseEnter={e=>{e.currentTarget.style.background=s.color+"20";e.currentTarget.style.borderColor=s.color}}
                  onMouseLeave={e=>{e.currentTarget.style.background="#161b22";e.currentTarget.style.borderColor=s.color+"40"}}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{color:"#8b949e",fontSize:"12px",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:"10px"}}>Quick Navigation</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"6px"}}>
              {sections.map(s => (
                <button key={s.view} onClick={() => { onClose(); if (s.view === "calculator") { window.dispatchEvent(new CustomEvent("openCalculator")); } else { window.dispatchEvent(new CustomEvent("navigateTo",{detail:s.view})); } }}
                  style={{padding:"10px 12px",background:"#161b22",border:"1px solid #21262d",borderRadius:"8px",color:"#c9d1d9",cursor:"pointer",fontSize:"13px",textAlign:"left",display:"flex",alignItems:"center",gap:"8px"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="#58a6ff";e.currentTarget.style.color="#58a6ff"}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="#21262d";e.currentTarget.style.color="#c9d1d9"}}>
                  <span>{s.icon}</span>{s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}