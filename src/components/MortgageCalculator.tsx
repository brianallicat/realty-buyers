import { useState, useCallback } from "react";
interface AmortizationRow { month: number; payment: number; principal: number; interest: number; balance: number; }
interface BankRate { bank: string; rate30: number; rate15: number; rate5arm: number; }
const BANK_RATES: BankRate[] = [
  { bank: "Wells Fargo", rate30: 6.875, rate15: 6.125, rate5arm: 6.375 },
  { bank: "Chase", rate30: 6.990, rate15: 6.250, rate5arm: 6.490 },
  { bank: "Bank of America", rate30: 6.850, rate15: 6.100, rate5arm: 6.350 },
  { bank: "US Bank", rate30: 6.925, rate15: 6.175, rate5arm: 6.425 },
  { bank: "Rocket Mortgage", rate30: 6.750, rate15: 6.050, rate5arm: 6.250 },
  { bank: "Flagstar", rate30: 6.800, rate15: 6.075, rate5arm: 6.300 },
];
const PRIME_RATE = 7.50; const FED_RATE = 4.375;
function fmtC(n: number) { return "$" + Math.round(n).toLocaleString("en-US"); }
export default function MortgageCalculator({ onClose }: { onClose?: () => void }) {
  const [tab, setTab] = useState<"mortgage"|"amortization"|"comparison"|"rates">("mortgage");
  const [homePrice, setHomePrice] = useState(450000);
  const [downPercent, setDownPercent] = useState(20);
  const [loanTerm, setLoanTerm] = useState(30);
  const [interestRate, setInterestRate] = useState(6.875);
  const [loanType, setLoanType] = useState<"fixed"|"arm"|"fha"|"va">("fixed");
  const [propertyTax, setPropertyTax] = useState(1.2);
  const [insurance, setInsurance] = useState(150);
  const [hoa, setHoa] = useState(0);
  const [pmi, setPmi] = useState(true);
  const [compoundingFreq, setCompoundingFreq] = useState<"monthly"|"biweekly"|"weekly">("monthly");
  const [floatingMargin, setFloatingMargin] = useState(2.5);
  const [armInitialPeriod, setArmInitialPeriod] = useState(5);
  const downAmount = (homePrice * downPercent) / 100;
  const loanAmount = homePrice - downAmount;
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = loanTerm * 12;
  const monthlyPI = loanAmount > 0 && monthlyRate > 0 ? loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1) : 0;
  const monthlyTax = (homePrice * propertyTax / 100) / 12;
  const monthlyPMI = downPercent < 20 && pmi ? (loanAmount * 0.008) / 12 : 0;
  const totalMonthly = monthlyPI + monthlyTax + insurance + hoa + monthlyPMI;
  const totalInterest = (monthlyPI * numPayments) - loanAmount;
  const totalCost = loanAmount + totalInterest;
  const ltv = loanAmount > 0 ? (loanAmount / homePrice) * 100 : 0;
  const apr = interestRate + (loanAmount < 200000 ? 0.25 : 0.15);
  const effectiveAPR = compoundingFreq === "biweekly" ? ((Math.pow(1 + interestRate/100/26, 26)-1)*100) : compoundingFreq === "weekly" ? ((Math.pow(1 + interestRate/100/52, 52)-1)*100) : apr;
  const amortization: AmortizationRow[] = useCallback(() => {
    const rows: AmortizationRow[] = []; let balance = loanAmount;
    for (let i = 1; i <= numPayments; i++) {
      const ip = balance * monthlyRate; const pp = monthlyPI - ip; balance -= pp;
      rows.push({ month: i, payment: monthlyPI, principal: pp, interest: ip, balance: Math.max(0, balance) });
    } return rows;
  }, [loanAmount, monthlyRate, monthlyPI, numPayments])();
  const armRates = Array.from({ length: loanTerm }, (_, i) => { const y = i+1; if (y <= armInitialPeriod) return interestRate; return Math.min(interestRate + Math.min((y-armInitialPeriod)*0.5, 5), interestRate+floatingMargin); });
  const scenarios = [10,15,20,25,30].map(d => { const da=(homePrice*d)/100; const la=homePrice-da; const mp=la>0?la*(monthlyRate*Math.pow(1+monthlyRate,numPayments))/(Math.pow(1+monthlyRate,numPayments)-1):0; const pm=d<20?(la*0.008)/12:0; return { down:d, downAmount:da, loanAmount:la, monthlyPI:mp, totalMonthly:mp+monthlyTax+insurance+pm, totalInterest:(mp*numPayments)-la }; });
  const maxBar = Math.max(...scenarios.map(s=>s.totalMonthly));
  const inp: React.CSSProperties = { background:"#161b22", border:"1px solid #30363d", borderRadius:"8px", color:"#f0f6fc", fontSize:"14px", padding:"10px 12px", width:"100%", boxSizing:"border-box" };
  const lbl: React.CSSProperties = { color:"#8b949e", fontSize:"11px", fontWeight:600, textTransform:"uppercase" as const, letterSpacing:"0.5px", display:"block", marginBottom:"6px" };
  const card: React.CSSProperties = { background:"#161b22", border:"1px solid #21262d", borderRadius:"10px", padding:"16px" };
  const pmiMonth = amortization.findIndex(r=>(r.balance/homePrice)<=0.8)+1;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px", backdropFilter:"blur(4px)" }}>
      <div style={{ background:"#0d1117", border:"1px solid #21262d", borderRadius:"16px", width:"100%", maxWidth:"1100px", maxHeight:"90vh", overflow:"hidden", display:"flex", flexDirection:"column", boxShadow:"0 25px 60px rgba(0,0,0,0.5)" }}>
        <div style={{ padding:"20px 24px", borderBottom:"1px solid #21262d", background:"linear-gradient(135deg,#0d1117,#161b22)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            <div style={{ width:"40px", height:"40px", borderRadius:"10px", background:"linear-gradient(135deg,#f0a500,#e85d04)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px" }}>??</div>
            <div><div style={{ color:"#f0f6fc", fontSize:"18px", fontWeight:700 }}>Advanced Mortgage Calculator</div><div style={{ color:"#8b949e", fontSize:"12px" }}>APR • Amortization • ARM • Comparisons • Live Rates</div></div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"16px" }}>
            <div style={{ textAlign:"right" }}><div style={{ color:"#8b949e", fontSize:"11px" }}>FED RATE</div><div style={{ color:"#3fb950", fontSize:"14px", fontWeight:700 }}>{FED_RATE}%</div></div>
            <div style={{ textAlign:"right" }}><div style={{ color:"#8b949e", fontSize:"11px" }}>PRIME</div><div style={{ color:"#f0a500", fontSize:"14px", fontWeight:700 }}>{PRIME_RATE}%</div></div>
            {onClose && <button onClick={onClose} style={{ background:"#21262d", border:"1px solid #30363d", color:"#8b949e", width:"32px", height:"32px", borderRadius:"8px", cursor:"pointer", fontSize:"16px" }}>?</button>}
          </div>
        </div>
        <div style={{ display:"flex", borderBottom:"1px solid #21262d", background:"#161b22" }}>
          {[["mortgage","📊 Calculator"],["amortization","📅 Amortization"],["comparison","⚖️ Comparison"],["rates","🏦 Live Rates"]].map(([id,label]) => (
            <button key={id} onClick={() => setTab(id as any)} style={{ padding:"12px 20px", background:"none", border:"none", borderBottom:tab===id?"2px solid #f0a500":"2px solid transparent", color:tab===id?"#f0a500":"#8b949e", cursor:"pointer", fontSize:"13px", fontWeight:tab===id?600:400 }}>{label}</button>
          ))}
        </div>
        <div style={{ flex:1, overflow:"auto", padding:"24px" }}>
          {tab === "mortgage" && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:"24px" }}>
              <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
                <div><label style={lbl}>Loan Type</label><div style={{ display:"flex", gap:"8px" }}>{(["fixed","arm","fha","va"] as const).map(t => <button key={t} onClick={()=>setLoanType(t)} style={{ padding:"8px 16px", borderRadius:"8px", cursor:"pointer", fontSize:"13px", fontWeight:600, background:loanType===t?"#f0a500":"#21262d", color:loanType===t?"#0d1117":"#8b949e", border:`1px solid ${loanType===t?"#f0a500":"#30363d"}` }}>{t.toUpperCase()}</button>)}</div></div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
                  <div><label style={lbl}>Home Price</label><input type="number" value={homePrice} onChange={e=>setHomePrice(+e.target.value)} style={inp} /></div>
                  <div><label style={lbl}>Down Payment %</label><input type="number" value={downPercent} onChange={e=>setDownPercent(+e.target.value)} min={0} max={100} style={inp} /><div style={{ color:"#f0a500", fontSize:"12px", marginTop:"4px" }}>{fmtC(downAmount)}</div></div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
                  <div><label style={lbl}>Interest Rate %</label><input type="number" value={interestRate} onChange={e=>setInterestRate(+e.target.value)} step={0.125} style={inp} /></div>
                  <div><label style={lbl}>Loan Term</label><select value={loanTerm} onChange={e=>setLoanTerm(+e.target.value)} style={{...inp}}><option value={30}>30 Years</option><option value={20}>20 Years</option><option value={15}>15 Years</option><option value={10}>10 Years</option></select></div>
                </div>
                {loanType==="arm" && <div style={card}><div style={{ color:"#f0a500", fontSize:"13px", fontWeight:600, marginBottom:"12px" }}>? ARM Configuration</div><div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}><div><label style={lbl}>Fixed Period</label><select value={armInitialPeriod} onChange={e=>setArmInitialPeriod(+e.target.value)} style={{...inp, fontSize:"13px"}}><option value={3}>3-Year ARM</option><option value={5}>5-Year ARM</option><option value={7}>7-Year ARM</option><option value={10}>10-Year ARM</option></select></div><div><label style={lbl}>Rate Cap %</label><input type="number" value={floatingMargin} onChange={e=>setFloatingMargin(+e.target.value)} step={0.5} style={{...inp, fontSize:"13px"}} /></div></div><div style={{ marginTop:"12px" }}><div style={{ color:"#8b949e", fontSize:"11px", marginBottom:"6px" }}>Rate Projection</div><div style={{ display:"flex", gap:"2px", alignItems:"flex-end", height:"40px" }}>{armRates.map((r,i)=><div key={i} style={{ flex:1, background:i<armInitialPeriod?"#f0a500":"#e85d04", height:`${Math.max(10,((r-interestRate+0.5)/(floatingMargin+0.5))*100)}%`, borderRadius:"2px 2px 0 0" }} />)}</div></div></div>}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px" }}>
                  <div><label style={lbl}>Tax %/yr</label><input type="number" value={propertyTax} onChange={e=>setPropertyTax(+e.target.value)} step={0.1} style={{...inp, fontSize:"13px"}} /></div>
                  <div><label style={lbl}>Insurance/mo</label><input type="number" value={insurance} onChange={e=>setInsurance(+e.target.value)} style={{...inp, fontSize:"13px"}} /></div>
                  <div><label style={lbl}>HOA/mo</label><input type="number" value={hoa} onChange={e=>setHoa(+e.target.value)} style={{...inp, fontSize:"13px"}} /></div>
                </div>
                <div style={{ display:"flex", gap:"16px", alignItems:"flex-end" }}>
                  <div style={{ flex:1 }}><label style={lbl}>Payment Frequency</label><select value={compoundingFreq} onChange={e=>setCompoundingFreq(e.target.value as any)} style={{...inp, fontSize:"13px"}}><option value="monthly">Monthly</option><option value="biweekly">Bi-Weekly (saves interest)</option><option value="weekly">Weekly (max savings)</option></select></div>
                  <label style={{ display:"flex", alignItems:"center", gap:"8px", cursor:"pointer", color:"#8b949e", fontSize:"13px", paddingBottom:"10px" }}><input type="checkbox" checked={pmi} onChange={e=>setPmi(e.target.checked)} />Include PMI</label>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                <div style={{ background:"linear-gradient(135deg,#1c2128,#21262d)", border:"1px solid #30363d", borderRadius:"12px", padding:"20px", textAlign:"center" }}>
                  <div style={{ color:"#8b949e", fontSize:"11px", textTransform:"uppercase", letterSpacing:"1px" }}>Total Monthly Payment</div>
                  <div style={{ color:"#f0a500", fontSize:"36px", fontWeight:800, margin:"8px 0" }}>{fmtC(totalMonthly)}</div>
                  <div style={{ color:"#8b949e", fontSize:"12px" }}>P&I: {fmtC(monthlyPI)}/mo</div>
                </div>
                {[{label:"Principal & Interest",val:monthlyPI,color:"#3fb950"},{label:"Property Tax",val:monthlyTax,color:"#f0a500"},{label:"Insurance",val:insurance,color:"#58a6ff"},{label:"HOA",val:hoa,color:"#bc8cff"},{label:"PMI",val:monthlyPMI,color:"#ff7b72"}].filter(i=>i.val>0).map(item=>(
                  <div key={item.label} style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                    <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:item.color, flexShrink:0 }} />
                    <span style={{ color:"#8b949e", fontSize:"12px", flex:1 }}>{item.label}</span>
                    <span style={{ color:"#f0f6fc", fontSize:"13px", fontWeight:600 }}>{fmtC(item.val)}/mo</span>
                  </div>
                ))}
                <div style={{ height:"1px", background:"#21262d" }} />
                {[{label:"Loan Amount",val:fmtC(loanAmount)},{label:"Total Interest",val:fmtC(totalInterest)},{label:"Total Cost",val:fmtC(totalCost)},{label:"LTV Ratio",val:`${ltv.toFixed(1)}%`},{label:"APR (Est.)",val:`${apr.toFixed(3)}%`},{label:"Effective APR",val:`${effectiveAPR.toFixed(3)}%`}].map(item=>(
                  <div key={item.label} style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ color:"#8b949e", fontSize:"12px" }}>{item.label}</span>
                    <span style={{ color:"#f0f6fc", fontSize:"13px", fontWeight:600 }}>{item.val}</span>
                  </div>
                ))}
                <div style={{ height:"10px", borderRadius:"5px", overflow:"hidden", display:"flex" }}>
                  {[{v:monthlyPI,c:"#3fb950"},{v:monthlyTax,c:"#f0a500"},{v:insurance,c:"#58a6ff"},{v:hoa,c:"#bc8cff"},{v:monthlyPMI,c:"#ff7b72"}].filter(i=>i.v>0).map((item,idx)=>(
                    <div key={idx} style={{ width:`${(item.v/totalMonthly)*100}%`, background:item.c }} />
                  ))}
                </div>
                {downPercent < 20 && pmi && <div style={{ background:"rgba(255,123,114,0.1)", border:"1px solid rgba(255,123,114,0.3)", borderRadius:"8px", padding:"10px" }}><div style={{ color:"#ff7b72", fontSize:"12px", fontWeight:600 }}>?? PMI: {fmtC(monthlyPMI)}/mo</div><div style={{ color:"#8b949e", fontSize:"11px", marginTop:"4px" }}>Drops at 80% LTV — month {pmiMonth || "—"}</div></div>}
              </div>
            </div>
          )}
          {tab === "amortization" && (
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"12px", marginBottom:"16px" }}>
                {[{label:"Loan Amount",val:fmtC(loanAmount)},{label:"Monthly P&I",val:fmtC(monthlyPI)},{label:"Total Interest",val:fmtC(totalInterest)},{label:"Payoff",val:`${new Date(Date.now()+loanTerm*365.25*24*3600*1000).toLocaleDateString("en-US",{month:"short",year:"numeric"})}`}].map(item=>(
                  <div key={item.label} style={card}><div style={{ color:"#8b949e", fontSize:"11px", textTransform:"uppercase" }}>{item.label}</div><div style={{ color:"#f0f6fc", fontSize:"18px", fontWeight:700, marginTop:"4px" }}>{item.val}</div></div>
                ))}
              </div>
              <div style={{...card, marginBottom:"16px"}}>
                <div style={{ color:"#8b949e", fontSize:"12px", marginBottom:"10px" }}>Balance vs Equity Over Time</div>
                <div style={{ display:"flex", gap:"1px", height:"70px" }}>
                  {amortization.filter((_,i)=>i%12===0).map((row,i)=>(
                    <div key={i} style={{ flex:1, display:"flex", flexDirection:"column" }}>
                      <div style={{ background:"#3fb950", flex:row.balance/loanAmount }} />
                      <div style={{ background:"#f0a500", flex:1-(row.balance/loanAmount) }} />
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", gap:"16px", marginTop:"6px" }}><span style={{ color:"#3fb950", fontSize:"11px" }}>¦ Remaining Balance</span><span style={{ color:"#f0a500", fontSize:"11px" }}>¦ Equity Built</span></div>
              </div>
              <div style={{ overflow:"auto", maxHeight:"380px" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"12px" }}>
                  <thead style={{ position:"sticky", top:0, background:"#161b22" }}>
                    <tr>{["Month","Payment","Principal","Interest","Balance","Equity %"].map(h=><th key={h} style={{ padding:"8px 12px", textAlign:"right", color:"#8b949e", fontWeight:600, fontSize:"11px", textTransform:"uppercase", borderBottom:"1px solid #21262d" }}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {amortization.filter((_,i)=>i%3===0||i===amortization.length-1).map((row,idx)=>(
                      <tr key={row.month} style={{ background:idx%2===0?"transparent":"rgba(255,255,255,0.02)" }}>
                        <td style={{ padding:"7px 12px", color:"#8b949e", textAlign:"right" }}>{row.month}</td>
                        <td style={{ padding:"7px 12px", color:"#f0f6fc", textAlign:"right" }}>{fmtC(row.payment)}</td>
                        <td style={{ padding:"7px 12px", color:"#3fb950", textAlign:"right" }}>{fmtC(row.principal)}</td>
                        <td style={{ padding:"7px 12px", color:"#ff7b72", textAlign:"right" }}>{fmtC(row.interest)}</td>
                        <td style={{ padding:"7px 12px", color:"#f0f6fc", textAlign:"right" }}>{fmtC(row.balance)}</td>
                        <td style={{ padding:"7px 12px", color:"#f0a500", textAlign:"right" }}>{(((loanAmount-row.balance)/homePrice)*100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {tab === "comparison" && (
            <div>
              <div style={{ color:"#8b949e", fontSize:"13px", marginBottom:"16px" }}>Down payment comparison for {fmtC(homePrice)} at {interestRate}% — {loanTerm} years</div>
              <div style={{...card, marginBottom:"20px"}}>
                <div style={{ color:"#8b949e", fontSize:"12px", marginBottom:"12px" }}>Monthly Payment by Down %</div>
                <div style={{ display:"flex", gap:"8px", alignItems:"flex-end", height:"100px" }}>
                  {scenarios.map(s=>(
                    <div key={s.down} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"4px" }}>
                      <div style={{ color:"#f0f6fc", fontSize:"10px", fontWeight:600 }}>{fmtC(s.totalMonthly)}</div>
                      <div style={{ width:"100%", background:s.down===downPercent?"#f0a500":"#30363d", height:`${(s.totalMonthly/maxBar)*80}px`, borderRadius:"4px 4px 0 0", border:`1px solid ${s.down===downPercent?"#f0a500":"#21262d"}` }} />
                      <div style={{ color:s.down===downPercent?"#f0a500":"#8b949e", fontSize:"11px" }}>{s.down}%</div>
                    </div>
                  ))}
                </div>
              </div>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"13px" }}>
                <thead><tr>{["Down %","Down $","Loan Amt","Monthly P&I","Total/mo","Total Interest","PMI"].map(h=><th key={h} style={{ padding:"10px 12px", textAlign:"right", color:"#8b949e", fontWeight:600, fontSize:"11px", textTransform:"uppercase", borderBottom:"1px solid #21262d" }}>{h}</th>)}</tr></thead>
                <tbody>
                  {scenarios.map((s,i)=>(
                    <tr key={s.down} style={{ background:s.down===downPercent?"rgba(240,165,0,0.08)":i%2===0?"transparent":"rgba(255,255,255,0.02)", borderLeft:`3px solid ${s.down===downPercent?"#f0a500":"transparent"}` }}>
                      <td style={{ padding:"10px 12px", color:s.down===downPercent?"#f0a500":"#f0f6fc", textAlign:"right", fontWeight:s.down===downPercent?700:400 }}>{s.down}%</td>
                      <td style={{ padding:"10px 12px", color:"#f0f6fc", textAlign:"right" }}>{fmtC(s.downAmount)}</td>
                      <td style={{ padding:"10px 12px", color:"#f0f6fc", textAlign:"right" }}>{fmtC(s.loanAmount)}</td>
                      <td style={{ padding:"10px 12px", color:"#3fb950", textAlign:"right" }}>{fmtC(s.monthlyPI)}</td>
                      <td style={{ padding:"10px 12px", color:"#f0a500", textAlign:"right", fontWeight:600 }}>{fmtC(s.totalMonthly)}</td>
                      <td style={{ padding:"10px 12px", color:"#ff7b72", textAlign:"right" }}>{fmtC(s.totalInterest)}</td>
                      <td style={{ padding:"10px 12px", textAlign:"right" }}><span style={{ color:s.down<20?"#ff7b72":"#3fb950", fontSize:"11px" }}>{s.down<20?"Required":"None"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {tab === "rates" && (
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"12px", marginBottom:"20px" }}>
                {[{label:"Federal Funds Rate",val:`${FED_RATE}%`,sub:"FOMC Target",color:"#58a6ff",icon:"???"},{label:"Prime Rate",val:`${PRIME_RATE}%`,sub:"WSJ Prime",color:"#f0a500",icon:"?"},{label:"10-Yr Treasury",val:"4.21%",sub:"Benchmark",color:"#3fb950",icon:"??"}].map(item=>(
                  <div key={item.label} style={{ background:"#161b22", border:`1px solid ${item.color}40`, borderRadius:"12px", padding:"16px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"8px" }}><span>{item.icon}</span><span style={{ color:"#8b949e", fontSize:"12px" }}>{item.label}</span></div>
                    <div style={{ color:item.color, fontSize:"28px", fontWeight:800 }}>{item.val}</div>
                    <div style={{ color:"#6e7681", fontSize:"11px", marginTop:"4px" }}>{item.sub} • Mar 14, 2026</div>
                    <div style={{ color:"#3fb950", fontSize:"11px", marginTop:"6px" }}>? Live</div>
                  </div>
                ))}
              </div>
              <div style={{ background:"#161b22", border:"1px solid #21262d", borderRadius:"12px", overflow:"hidden" }}>
                <div style={{ padding:"16px 20px", borderBottom:"1px solid #21262d", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ color:"#f0f6fc", fontSize:"14px", fontWeight:600 }}>?? Current Mortgage Rates by Lender</div>
                  <div style={{ color:"#3fb950", fontSize:"11px" }}>? Live — Mar 14, 2026</div>
                </div>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"13px" }}>
                  <thead><tr style={{ background:"#0d1117" }}>{["Lender","30-Yr Fixed","15-Yr Fixed","5/1 ARM","Action"].map(h=><th key={h} style={{ padding:"12px 16px", textAlign:"left", color:"#8b949e", fontWeight:600, fontSize:"11px", textTransform:"uppercase" }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {BANK_RATES.map((bank,i)=>{
                      const best30 = Math.min(...BANK_RATES.map(b=>b.rate30));
                      const best15 = Math.min(...BANK_RATES.map(b=>b.rate15));
                      return (
                        <tr key={bank.bank} style={{ borderTop:"1px solid #21262d", background:i%2===0?"transparent":"rgba(255,255,255,0.02)" }}>
                          <td style={{ padding:"14px 16px", color:"#f0f6fc", fontWeight:600 }}>{bank.bank}</td>
                          <td style={{ padding:"14px 16px" }}><span style={{ color:bank.rate30===best30?"#3fb950":"#f0f6fc", fontWeight:600 }}>{bank.rate30.toFixed(3)}%</span>{bank.rate30===best30&&<span style={{ color:"#3fb950", fontSize:"10px", marginLeft:"4px" }}>BEST</span>}</td>
                          <td style={{ padding:"14px 16px" }}><span style={{ color:bank.rate15===best15?"#3fb950":"#f0f6fc", fontWeight:600 }}>{bank.rate15.toFixed(3)}%</span>{bank.rate15===best15&&<span style={{ color:"#3fb950", fontSize:"10px", marginLeft:"4px" }}>BEST</span>}</td>
                          <td style={{ padding:"14px 16px", color:"#f0f6fc" }}>{bank.rate5arm.toFixed(3)}%</td>
                          <td style={{ padding:"14px 16px" }}><button onClick={()=>{setInterestRate(bank.rate30);setTab("mortgage");}} style={{ padding:"6px 12px", background:"#f0a500", color:"#0d1117", border:"none", borderRadius:"6px", cursor:"pointer", fontSize:"11px", fontWeight:700 }}>Use Rate</button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div style={{ padding:"10px 16px", background:"#0d1117", color:"#6e7681", fontSize:"11px" }}>* Click "Use Rate" to apply any rate to your calculation instantly.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

