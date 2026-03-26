"use client";
// VERSION: FINAL-v5 — fix candidature a 0 + fix torna alla home

import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "thename2025";

const RUOLI = [
  "Art Director","Photographer","Model","Graphic Designer","AI Artist",
  "Make-up Artist","Screenwriter","Event Planner","Illustrator",
  "Fashion Stylist","Videomaker","Fashion Designer","Digital Artist",
  "Creative Producer","Casting Director","Copywriter","Set Designer",
  "Content Creator / Social Media Manager",
];

function safeDate(str) {
  if (!str) return "—";
  try {
    const d = String(str).split("T")[0];
    const [y, m, dd] = d.split("-");
    if (!y || !m || !dd) return "—";
    return `${dd}/${m}/${y}`;
  } catch { return "—"; }
}

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <AdminApp />;
}

function AdminApp() {
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState("");
  const [pwdError, setPwdError] = useState(false);
  const [tab, setTab] = useState("candidature");

  const login = () => {
    if (pwd === ADMIN_PASSWORD) setAuthed(true);
    else setPwdError(true);
  };

  if (!authed) {
    return (
      <div style={d.loginWrap}>
        <div style={d.loginBox}>
          <div style={d.loginLogo}>the[name]</div>
          <div style={d.loginSub}>admin access</div>
          <input type="password" placeholder="Password" value={pwd}
            onChange={(e) => { setPwd(e.target.value); setPwdError(false); }}
            onKeyDown={(e) => e.key === "Enter" && login()}
            style={{ ...d.input, ...(pwdError ? { borderColor: "#ff4444" } : {}) }}
            autoFocus />
          {pwdError && <p style={d.errorText}>Password errata.</p>}
          <button onClick={login} style={{ ...d.btnPrimary, width:"100%", marginTop:16 }}>ACCEDI</button>
        </div>
      </div>
    );
  }

  return (
    <div style={d.wrap}>
      <div style={d.topBar}>
        <div style={d.topBarLogo}>
          <span style={d.logoItalic}>the[name]</span>
          <span style={d.logoDot}> · </span>
          <span style={d.logoAdmin}>admin</span>
        </div>
        {/* FIX: torna alla home invece di mostrare il login */}
        <button onClick={() => { window.location.href = "/"; }} style={d.logoutBtn}>← ESCI</button>
      </div>
      <div style={d.tabs}>
        {[
          { id:"candidature", label:"CANDIDATURE" },
          { id:"network",     label:"NETWORK" },
          { id:"seekers",     label:"RICHIESTE SEEKER" },
          { id:"documenti",   label:"DOCUMENTI" },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ ...d.tabBtn, ...(tab === t.id ? d.tabActive : {}) }}>
            {t.label}
          </button>
        ))}
      </div>
      <div style={d.content}>
        {tab === "candidature" && <CandidaturesTab />}
        {tab === "network"     && <NetworkTab />}
        {tab === "seekers"     && <SeekersTab />}
        {tab === "documenti"   && <DocumentiTab />}
      </div>
    </div>
  );
}

// ── CANDIDATURE ──────────────────────────────────────────────────
function CandidaturesTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => { load(); }, []);

  // FIX: usa /api/candidatures invece di supabase diretto (anon key bloccata da RLS)
  const load = async () => {
    setLoading(true);
    try {
      const data = await fetch("/api/candidatures").then(r => r.json());
      setItems(Array.isArray(data) ? data : []);
    } catch(e) { console.error(e); setItems([]); }
    setLoading(false);
  };

  const acceptAndPromote = async (id) => {
    const res = await fetch("/api/candidatures", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "approved", promote: true }),
    });
    const json = await res.json();
    if (!res.ok) { alert("Errore: " + (json.error || "operazione fallita")); return; }
    await load();
  };

  const rejectItem = async (id) => {
    await fetch("/api/candidatures", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "rejected" }),
    });
    await load();
  };

  const counts = {
    all: items.length,
    pending: items.filter((i) => i.status === "pending").length,
    approved: items.filter((i) => i.status === "approved").length,
    rejected: items.filter((i) => i.status === "rejected").length,
  };
  const filtered = filter === "all" ? items : items.filter((i) => i.status === filter);

  return (
    <div>
      <SectionTitle title="Candidature" subtitle="Gestisci le candidature al network" />
      <div style={d.filterBar}>
        {[{id:"all",label:"Tutte"},{id:"pending",label:"In attesa"},{id:"approved",label:"Approvate"},{id:"rejected",label:"Rifiutate"}].map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            style={{ ...d.filterBtn, ...(filter === f.id ? d.filterActive : {}) }}>
            {f.label} <span style={d.filterCount}>{counts[f.id]}</span>
          </button>
        ))}
      </div>
      {loading ? <Loading /> : filtered.length === 0 ? <EmptyBox text="Nessuna candidatura in questa categoria." /> : (
        <div style={d.list}>
          {filtered.map((item) => (
            <div key={item.id} style={d.listItem}>
              <div style={d.listItemHeader} onClick={() => setExpanded(expanded === item.id ? null : item.id)}>
                <div style={d.listItemLeft}>
                  {item.foto_url ? <img src={item.foto_url} alt={item.nome} style={d.miniAvatar} /> : <AvatarFallback name={item.nome} />}
                  <div>
                    <span style={d.listItemName}>{item.nome}</span>
                    <span style={d.listItemMeta}>{item.ruoli} · {item.citta}</span>
                  </div>
                </div>
                <div style={d.listItemRight}>
                  <StatusBadge status={item.status || "pending"} />
                  <span style={d.chevron}>{expanded === item.id ? "▲" : "▼"}</span>
                </div>
              </div>
              {expanded === item.id && (
                <div style={d.listItemBody}>
                  <div style={d.detailGrid}>
                    <Detail label="Età" value={item.eta} />
                    <Detail label="Città" value={item.citta} />
                    <Detail label="Email" value={item.email} />
                    <Detail label="Aree" value={item.aree} />
                    <Detail label="Travel" value={item.travel} />
                    <Detail label="Assistente" value={item.assistente} />
                    <Detail label="Budget" value={item.budget} />
                    <Detail label="Disponibilità" value={item.disponibilita} />
                    <Detail label="Data" value={safeDate(item.created_at)} />
                    <Detail label="Preferenze" value={item.preferenze} span={2} />
                    <Detail label="Esigenze" value={item.esigenze} span={2} />
                  </div>
                  <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:16 }}>
                    {item.portfolio && <a href={item.portfolio} target="_blank" rel="noopener noreferrer" style={d.linkBtn}>Portfolio →</a>}
                    {item.foto_url && <a href={item.foto_url} target="_blank" rel="noopener noreferrer" style={d.linkBtn}>Foto →</a>}
                  </div>
                  {item.status === "pending" && (
                    <div style={d.actionRow}>
                      <button onClick={() => acceptAndPromote(item.id)} style={d.approveBtn}>✓ Accetta al network</button>
                      <button onClick={() => rejectItem(item.id)} style={d.rejectBtn}>✕ Rifiuta</button>
                    </div>
                  )}
                  {item.status === "approved" && <p style={{ fontSize:12, color:"#c8d622", marginTop:8 }}>✓ Accettato — profilo aggiunto al network</p>}
                  {item.status === "rejected" && <button onClick={() => acceptAndPromote(item.id)} style={d.btnSecondary}>Rimetti in attesa</button>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── NETWORK ──────────────────────────────────────────────────────
function NetworkTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetch("/api/creatives").then(r => r.json());
      setItems(Array.isArray(data) ? data : []);
    } catch { setItems([]); }
    setLoading(false);
  };

  const toggleVisible = async (id, current) => {
    await supabase.from("creatives").update({ visible: !current }).eq("id", id);
    await load();
  };

  return (
    <div>
      <SectionTitle title="Network" subtitle="Creativi selezionati nel network the[name]" />
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:20 }}>
        <button onClick={() => setShowAdd(true)} style={d.btnPrimary}>+ AGGIUNGI CREATIVO</button>
      </div>
      {loading ? <Loading /> : items.length === 0 ? <EmptyBox text="Nessun creativo ancora." /> : (
        <div style={d.list}>
          {items.map((item) => (
            <div key={item.id} style={d.listItem}>
              <div style={{ ...d.listItemHeader, cursor:"default" }}>
                <div style={d.listItemLeft}>
                  {item.foto_url ? <img src={item.foto_url} alt={item.nome} style={d.miniAvatar} /> : <AvatarFallback name={item.nome} />}
                  <div>
                    <span style={d.listItemName}>{item.nome}</span>
                    <span style={d.listItemMeta}>{item.ruolo} · {item.citta}</span>
                  </div>
                </div>
                <div style={d.listItemRight}>
                  <Chip label={item.visible ? "Visibile" : "Nascosto"} color={item.visible ? "#c8d622" : "#666"} />
                  <Chip label={item.availability === "available" ? "Disponibile" : "Non disp."} color={item.availability === "available" ? "#4ade80" : "#666"} />
                  <button onClick={() => setEditing(item)} style={d.editBtn}>Modifica</button>
                  <button onClick={() => toggleVisible(item.id, item.visible)} style={d.toggleBtn}>{item.visible ? "Nascondi" : "Mostra"}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {(editing || showAdd) && (
        <CreativeEditModal creative={editing}
          onClose={() => { setEditing(null); setShowAdd(false); }}
          onSaved={() => { setEditing(null); setShowAdd(false); load(); }} />
      )}
    </div>
  );
}

// ── SEEKERS ──────────────────────────────────────────────────────
function SeekersTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [matchData, setMatchData] = useState({});
  const [matchLoading, setMatchLoading] = useState(null);

  useEffect(() => { load(); }, []);

  // FIX: usa /api/seeker-requests invece di supabase diretto
  const load = async () => {
    setLoading(true);
    try {
      const data = await fetch("/api/seeker-requests").then(r => r.json());
      setItems(Array.isArray(data) ? data : []);
    } catch(e) { console.error(e); setItems([]); }
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    await fetch("/api/seeker-requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await load();
  };

  const doMatch = async (item) => {
    if (matchData[item.id]) {
      setMatchData((prev) => { const n = {...prev}; delete n[item.id]; return n; });
      return;
    }
    setMatchLoading(item.id);
    const ruoli = (item.cerca||"").split(/[,·\n]/).map(s=>s.trim()).filter(Boolean);
    let q = supabase.from("creatives").select("*").eq("visible", true);
    if (ruoli.length > 0) q = q.in("ruolo", ruoli);
    const { data } = await q.order("availability", { ascending: false });
    setMatchData((prev) => ({ ...prev, [item.id]: data||[] }));
    setMatchLoading(null);
  };

  return (
    <div>
      <SectionTitle title="Richieste Seeker" subtitle="Richieste in arrivo dai seeker — fai il match con i creativi" />
      {loading ? <Loading /> : items.length === 0 ? <EmptyBox text="Nessuna richiesta ancora." /> : (
        <div style={d.list}>
          {items.map((item) => (
            <div key={item.id} style={d.listItem}>
              <div style={d.listItemHeader} onClick={() => setExpanded(expanded === item.id ? null : item.id)}>
                <div style={d.listItemLeft}>
                  <div>
                    <span style={d.listItemName}>{item.azienda || item.nome}</span>
                    <span style={d.listItemMeta}>{item.nome} · cerca: <strong style={{color:"#c8d622"}}>{item.cerca}</strong> · {safeDate(item.created_at)}</span>
                  </div>
                </div>
                <div style={d.listItemRight}>
                  <StatusBadge status={item.status || "new"} />
                  <span style={d.chevron}>{expanded === item.id ? "▲" : "▼"}</span>
                </div>
              </div>
              {expanded === item.id && (
                <div style={d.listItemBody}>
                  <div style={d.detailGrid}>
                    <Detail label="Nome" value={item.nome} />
                    <Detail label="Email" value={item.email} />
                    <Detail label="Azienda" value={item.azienda} />
                    <Detail label="Cerca" value={item.cerca} />
                    <Detail label="Tipo progetto" value={item.progetto} />
                    <Detail label="Budget" value={item.budget} />
                    <Detail label="Date" value={item.date_start ? `${item.date_start} → ${item.date_end}` : "—"} />
                    <Detail label="Note" value={item.note} span={2} />
                  </div>
                  <div style={d.actionRow}>
                    <button onClick={() => doMatch(item)} style={d.matchBtn} disabled={matchLoading === item.id}>
                      {matchLoading === item.id ? "Ricerca…" : matchData[item.id] ? "✕ Chiudi match" : "⚡ MATCH"}
                    </button>
                    <a href={`mailto:${item.email}?subject=Re: Richiesta — ${item.cerca}`} style={d.emailBtn}>✉ Rispondi</a>
                    {item.status !== "handled" && <button onClick={() => updateStatus(item.id, "handled")} style={d.btnSecondary}>Segna gestita</button>}
                  </div>
                  {matchData[item.id] && (
                    <div style={d.matchResults}>
                      <p style={d.matchResultsTitle}>
                        {matchData[item.id].length === 0 ? "Nessun creativo disponibile." : `${matchData[item.id].length} creativo/i compatibile/i`}
                      </p>
                      {matchData[item.id].map((c) => (
                        <div key={c.id} style={d.matchCard}>
                          <div style={d.listItemLeft}>
                            {c.foto_url ? <img src={c.foto_url} alt={c.nome} style={d.miniAvatar} /> : <AvatarFallback name={c.nome} small />}
                            <div>
                              <span style={{...d.listItemName, color:"#f5f0eb"}}>{c.nome}</span>
                              <span style={d.listItemMeta}>{c.ruolo} · {c.citta}</span>
                            </div>
                          </div>
                          <div style={d.listItemRight}>
                            <Chip label={c.availability === "available" ? "Disponibile" : "Non disp."} color={c.availability === "available" ? "#c8d622" : "#666"} />
                            {c.portfolio && <a href={c.portfolio} target="_blank" rel="noopener noreferrer" style={d.linkBtn}>Portfolio →</a>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── DOCUMENTI ────────────────────────────────────────────────────
function DocumentiTab() {
  const [activeDoc, setActiveDoc] = useState("booking");
  const [creatives, setCreatives] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    supabase.from("creatives").select("id, nome, ruolo, citta").eq("visible", true)
      .order("nome", { ascending: true })
      .then(({ data }) => setCreatives(data || []));
  }, []);

  if (!mounted) return null;

  const docs = [
    { id:"booking",   label:"01 · BOOKING CONFIRMATION" },
    { id:"quotation", label:"02 · PRODUCTION QUOTATION" },
    { id:"nda",       label:"03 · NDA" },
    { id:"licensing", label:"04 · IMAGE LICENSING" },
  ];

  return (
    <div>
      <SectionTitle title="Documenti" subtitle="GENERA DOCUMENTI PROFESSIONALI THE[NAME]" />
      <div style={d.docTabs}>
        {docs.map((doc) => (
          <button key={doc.id} onClick={() => setActiveDoc(doc.id)}
            style={{ ...d.docTabBtn, ...(activeDoc === doc.id ? d.docTabActive : {}) }}>
            {doc.label}
          </button>
        ))}
      </div>
      {activeDoc === "booking"   && <BookingForm   key="booking"   creatives={creatives} />}
      {activeDoc === "quotation" && <QuotationForm key="quotation" creatives={creatives} />}
      {activeDoc === "nda"       && <NDAForm       key="nda"       creatives={creatives} />}
      {activeDoc === "licensing" && <LicensingForm key="licensing" creatives={creatives} />}
    </div>
  );
}

const S = {
  inp:  { width:"100%", padding:"10px 12px", background:"#1a1714", border:"1px solid #2a2520", color:"#f5f0eb", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit", borderRadius:2 },
  ro:   { width:"100%", padding:"10px 12px", background:"#111",    border:"1px solid #2a2520", color:"#7a7068", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit", borderRadius:2 },
  lbl:  { fontSize:9, letterSpacing:"1px", textTransform:"uppercase", color:"#7a7068", display:"block", marginBottom:6 },
  sec:  { marginBottom:32, paddingBottom:32, borderBottom:"1px solid #1e1c1a" },
  grid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 },
};

function todayISO() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`;
}
function fmtDate(s) {
  if (!s) return "—";
  const [y,m,dd] = s.split("-");
  return (dd&&m&&y) ? `${dd}/${m}/${y}` : s;
}
function pdfField(l,v) { return `<div><div class="fl">${l}</div><div class="fv">${v||"—"}</div></div>`; }
function pdfBase(title, num, date) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
    @page{margin:40px}body{font-family:Arial,sans-serif;color:#0d0b0a;max-width:700px;margin:0 auto;padding:40px}
    .logo{font-family:Georgia,serif;font-size:36px;font-weight:300;font-style:italic;margin-bottom:4px}
    .sub{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#7a7068;margin-bottom:40px}
    .t{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#7a7068;margin-bottom:4px}
    .n{font-size:22px;font-weight:300;margin-bottom:40px}
    .s{margin-bottom:28px}.sl{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#7a7068;border-bottom:1px solid #e8e0d8;padding-bottom:6px;margin-bottom:12px}
    .g{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .fl{font-size:9px;letter-spacing:1px;text-transform:uppercase;color:#7a7068;margin-bottom:4px}
    .fv{font-size:14px;color:#0d0b0a}
    .fb{background:#f5f0eb;padding:20px 24px;margin-top:8px}
    .fr{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #e0d8d0;font-size:13px}
    .fr:last-child{border-bottom:none;font-weight:600;font-size:15px;padding-top:12px}
    .sg{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:60px}
    .sl2{border-bottom:1px solid #0d0b0a;margin-top:40px;font-size:11px;color:#7a7068}
    .ft{margin-top:60px;padding-top:20px;border-top:1px solid #e8e0d8;font-size:10px;color:#aaa}
  </style></head><body>
  <div class="logo">the[name]</div><div class="sub">Network · Production Agency</div>
  <div class="t">${title}</div><div class="n">${num} · ${date}</div>`;
}
function openPDF(html) {
  const w = window.open("","_blank");
  w.document.write(html + `<div class="ft">the[name] · info.findthename@gmail.com</div></body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 500);
}

function BookingForm({ creatives }) {
  const rNum  = useRef(null); const rDate = useRef(null);
  const rPN   = useRef(null); const rSD   = useRef(null); const rLoc  = useRef(null);
  const rCN   = useRef(null); const rCR   = useRef(null); const rCC   = useRef(null);
  const rClN  = useRef(null); const rClC  = useRef(null); const rClE  = useRef(null);
  const rFee  = useRef(null); const rPct  = useRef(null);
  const rAF   = useRef(null); const rTot  = useRef(null);
  const rNote = useRef(null);

  useEffect(() => {
    const now = new Date();
    if (rDate.current) rDate.current.value = todayISO();
    if (rNum.current)  rNum.current.value  = `BC-${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
  }, []);

  const g = r => r?.current?.value || "";
  const onCreative = e => {
    const c = creatives.find(x => x.id === e.target.value);
    if (!c) return;
    if (rCN.current) rCN.current.value = c.nome||"";
    if (rCR.current) rCR.current.value = c.ruolo||"";
    if (rCC.current) rCC.current.value = c.citta||"";
  };
  const recalc = () => {
    const fee = parseFloat(g(rFee))||0;
    const pct = parseFloat(g(rPct))||20;
    const af  = (fee*pct/100).toFixed(2);
    const tot = (fee+parseFloat(af)).toFixed(2);
    if (rAF.current)  rAF.current.value  = af;
    if (rTot.current) rTot.current.value = tot;
  };
  const pdf = () => openPDF(pdfBase("Booking Confirmation", g(rNum), fmtDate(g(rDate))) + `
    <div class="s"><div class="sl">Progetto</div><div class="g">
      <div>${pdfField("Nome progetto",g(rPN))}</div><div>${pdfField("Data servizio",fmtDate(g(rSD)))}</div>
      <div style="grid-column:span 2">${pdfField("Location",g(rLoc))}</div>
    </div></div>
    <div class="s"><div class="sl">Creativo</div><div class="g">
      <div>${pdfField("Nome",g(rCN))}</div><div>${pdfField("Ruolo",g(rCR))}</div><div>${pdfField("Città",g(rCC))}</div>
    </div></div>
    <div class="s"><div class="sl">Cliente</div><div class="g">
      <div>${pdfField("Nome",g(rClN))}</div><div>${pdfField("Azienda",g(rClC))}</div>
      <div style="grid-column:span 2">${pdfField("Email",g(rClE))}</div>
    </div></div>
    <div class="s"><div class="sl">Compenso e Fee Agenzia</div><div class="fb">
      <div class="fr"><span>Compenso creativo</span><span>€ ${g(rFee)||"—"}</span></div>
      <div class="fr"><span>Fee the[name] (${g(rPct)||20}%)</span><span>€ ${g(rAF)||"—"}</span></div>
      <div class="fr"><span>Totale dovuto</span><span>€ ${g(rTot)||"—"}</span></div>
    </div></div>
    ${g(rNote)?`<div class="s"><div class="sl">Note</div><p style="font-size:14px">${g(rNote)}</p></div>`:""}
    <div class="sg">
      <div><div class="fl">the[name]</div><div class="sl2">Firma</div></div>
      <div><div class="fl">${g(rClN)||"Cliente"}</div><div class="sl2">Firma</div></div>
    </div>`);

  return (
    <div style={d.docWrap}>
      <p style={d.docDesc}>Contratto di ingaggio tra agenzia e cliente</p>
      <div style={S.sec}><p style={d.docSectionLabel}>AUTO-COMPILA DA CREATIVO</p>
        <select onChange={onCreative} style={d.docSelect}>
          <option value="">-- Seleziona creativo --</option>
          {creatives.map(c => <option key={c.id} value={c.id}>{c.nome} · {c.ruolo} · {c.citta}</option>)}
        </select>
      </div>
      <div style={S.sec}><p style={d.docSectionLabel}>INTESTAZIONE</p><div style={S.grid}>
        <div><label style={S.lbl}>N. DOCUMENTO</label><input ref={rNum} style={S.inp} /></div>
        <div><label style={S.lbl}>DATA</label><input ref={rDate} type="date" style={S.inp} /></div>
      </div></div>
      <div style={S.sec}><p style={d.docSectionLabel}>PROGETTO</p><div style={S.grid}>
        <div><label style={S.lbl}>NOME PROGETTO</label><input ref={rPN} style={S.inp} placeholder="Campagna SS26" /></div>
        <div><label style={S.lbl}>DATA SERVIZIO</label><input ref={rSD} type="date" style={S.inp} /></div>
        <div style={{gridColumn:"span 2"}}><label style={S.lbl}>LOCATION</label><input ref={rLoc} style={S.inp} placeholder="Milano, Studio XYZ" /></div>
      </div></div>
      <div style={S.sec}><p style={d.docSectionLabel}>CREATIVO</p><div style={S.grid}>
        <div><label style={S.lbl}>NOME</label><input ref={rCN} style={S.inp} placeholder="Nome Cognome" /></div>
        <div><label style={S.lbl}>RUOLO</label><input ref={rCR} style={S.inp} placeholder="Photographer" /></div>
        <div><label style={S.lbl}>CITTÀ</label><input ref={rCC} style={S.inp} placeholder="Milano" /></div>
      </div></div>
      <div style={S.sec}><p style={d.docSectionLabel}>CLIENTE</p><div style={S.grid}>
        <div><label style={S.lbl}>NOME</label><input ref={rClN} style={S.inp} placeholder="Nome Cognome" /></div>
        <div><label style={S.lbl}>AZIENDA</label><input ref={rClC} style={S.inp} placeholder="Brand S.r.l." /></div>
        <div style={{gridColumn:"span 2"}}><label style={S.lbl}>EMAIL</label><input ref={rClE} type="email" style={S.inp} placeholder="email@brand.com" /></div>
      </div></div>
      <div style={S.sec}><p style={d.docSectionLabel}>COMPENSO E FEE AGENZIA</p><div style={S.grid}>
        <div><label style={S.lbl}>FEE CREATIVO (€)</label><input ref={rFee} style={S.inp} placeholder="1500" onBlur={recalc} /></div>
        <div><label style={S.lbl}>% FEE THE[NAME]</label><input ref={rPct} defaultValue="20" style={S.inp} onBlur={recalc} /></div>
        <div><label style={S.lbl}>FEE THE[NAME] (€) — auto</label><input ref={rAF} readOnly style={S.ro} /></div>
        <div><label style={S.lbl}>TOTALE LORDO (€) — auto</label><input ref={rTot} readOnly style={S.ro} /></div>
      </div>
      <p style={{fontSize:10,color:"#7a7068",marginTop:8}}>Inserisci la fee e clicca fuori — il totale si calcola in automatico.</p>
      </div>
      <div style={S.sec}><p style={d.docSectionLabel}>NOTE</p>
        <textarea ref={rNote} rows={3} style={{...S.inp,resize:"vertical",width:"100%"}} placeholder="Note aggiuntive…" />
      </div>
      <button onClick={pdf} style={{...d.btnPrimary,marginTop:8}}>↓ GENERA E STAMPA PDF</button>
    </div>
  );
}

function QuotationForm({ creatives }) {
  const rNum   = useRef(null); const rDate  = useRef(null);
  const rClN   = useRef(null); const rClRef = useRef(null); const rClE   = useRef(null);
  const rPN    = useRef(null); const rPD    = useRef(null);
  const rAD    = useRef(null); const rPH    = useRef(null); const rVID   = useRef(null);
  const rSTY   = useRef(null); const rMUA   = useRef(null); const rMOD   = useRef(null);
  const rLOC   = useRef(null); const rEQ    = useRef(null); const rOTH   = useRef(null);
  const rTP    = useRef(null); const rAP    = useRef(null); const rAF    = useRef(null);
  const rTN    = useRef(null); const rVAT   = useRef(null); const rTG    = useRef(null);
  const rUSG   = useRef(null); const rTER   = useRef(null); const rDUR   = useRef(null);
  const rNote  = useRef(null);

  useEffect(() => { if (rDate.current) rDate.current.value = todayISO(); }, []);

  const g = r => r?.current?.value || "";
  const recalc = () => {
    const items = [rAD,rPH,rVID,rSTY,rMUA,rMOD,rLOC,rEQ,rOTH];
    const tot  = items.reduce((s,r) => s+(parseFloat(r?.current?.value)||0), 0);
    const pct  = parseFloat(g(rAP))||20;
    const af   = tot*pct/100;
    const net  = tot+af;
    const vat  = net*0.22;
    const gros = net+vat;
    if(rTP.current)  rTP.current.value  = tot.toFixed(2);
    if(rAF.current)  rAF.current.value  = af.toFixed(2);
    if(rTN.current)  rTN.current.value  = net.toFixed(2);
    if(rVAT.current) rVAT.current.value = vat.toFixed(2);
    if(rTG.current)  rTG.current.value  = gros.toFixed(2);
  };
  const pdf = () => openPDF(pdfBase("Production Quotation", g(rNum)||"QT-", fmtDate(g(rDate))) + `
    <div class="s"><div class="sl">Cliente e Progetto</div><div class="g">
      ${pdfField("Cliente",g(rClN))}${pdfField("Referente",g(rClRef))}
      ${pdfField("Email",g(rClE))}${pdfField("Progetto",g(rPN))}
    </div></div>
    ${g(rPD)?`<div class="s"><div class="sl">Brief</div><p style="font-size:14px">${g(rPD)}</p></div>`:""}
    <div class="s"><div class="sl">Budget Voci (€ escluso IVA)</div><div class="g">
      ${pdfField("Direzione Artistica","€ "+g(rAD))}${pdfField("Fotografo / Post","€ "+g(rPH))}
      ${pdfField("Video / Post","€ "+g(rVID))}${pdfField("Stylist","€ "+g(rSTY))}
      ${pdfField("Make-up & Hair","€ "+g(rMUA))}${pdfField("Modelli/e","€ "+g(rMOD))}
      ${pdfField("Location","€ "+g(rLOC))}${pdfField("Attrezzatura","€ "+g(rEQ))}
      ${g(rOTH)?pdfField("Altro","€ "+g(rOTH)):""}
    </div></div>
    <div class="s"><div class="sl">Riepilogo</div><div class="fb">
      <div class="fr"><span>Totale produzione</span><span>€ ${g(rTP)}</span></div>
      <div class="fr"><span>Agency fee the[name] (${g(rAP)||20}%)</span><span>€ ${g(rAF)}</span></div>
      <div class="fr"><span>Totale imponibile</span><span>€ ${g(rTN)}</span></div>
      <div class="fr"><span>IVA 22%</span><span>€ ${g(rVAT)}</span></div>
      <div class="fr"><span>TOTALE IVA INCLUSA</span><span>€ ${g(rTG)}</span></div>
    </div></div>
    <div class="s"><div class="sl">Diritti di utilizzo</div><div class="g">
      ${pdfField("Utilizzi",g(rUSG))}${pdfField("Territorio",g(rTER))}${pdfField("Durata",g(rDUR))}
    </div></div>
    ${g(rNote)?`<div class="s"><div class="sl">Note</div><p style="font-size:14px">${g(rNote)}</p></div>`:""}
    <div class="sg">
      <div><div class="fl">the[name]</div><div class="sl2">Firma</div></div>
      <div><div class="fl">${g(rClN)||"Cliente"}</div><div class="sl2">Firma</div></div>
    </div>`);

  return (
    <div style={d.docWrap}>
      <p style={d.docDesc}>Preventivo di produzione dettagliato per brand e clienti</p>
      <div style={S.sec}><p style={d.docSectionLabel}>INTESTAZIONE</p><div style={S.grid}>
        <div><label style={S.lbl}>N. PREVENTIVO</label><input ref={rNum} style={S.inp} placeholder="QT-2025-001" /></div>
        <div><label style={S.lbl}>DATA</label><input ref={rDate} type="date" style={S.inp} /></div>
      </div></div>
      <div style={S.sec}><p style={d.docSectionLabel}>CLIENTE E PROGETTO</p><div style={S.grid}>
        <div><label style={S.lbl}>CLIENTE / BRAND</label><input ref={rClN} style={S.inp} placeholder="Brand S.r.l." /></div>
        <div><label style={S.lbl}>REFERENTE</label><input ref={rClRef} style={S.inp} placeholder="Nome Cognome" /></div>
        <div style={{gridColumn:"span 2"}}><label style={S.lbl}>EMAIL</label><input ref={rClE} type="email" style={S.inp} placeholder="email@brand.com" /></div>
        <div><label style={S.lbl}>NOME PROGETTO</label><input ref={rPN} style={S.inp} placeholder="Campagna SS26" /></div>
        <div style={{gridColumn:"span 2"}}><label style={S.lbl}>BRIEF</label><textarea ref={rPD} rows={3} style={{...S.inp,resize:"vertical"}} /></div>
      </div></div>
      <div style={S.sec}><p style={d.docSectionLabel}>VOCI DI BUDGET (€ escluso IVA)</p>
        <p style={{fontSize:10,color:"#7a7068",marginBottom:16}}>Inserisci gli importi e clicca fuori — i totali si calcolano automaticamente.</p>
        <div style={S.grid}>
          <div><label style={S.lbl}>DIREZIONE ARTISTICA</label><input ref={rAD}  style={S.inp} placeholder="0" onBlur={recalc} /></div>
          <div><label style={S.lbl}>FOTOGRAFO + POST</label>   <input ref={rPH}  style={S.inp} placeholder="0" onBlur={recalc} /></div>
          <div><label style={S.lbl}>VIDEO + POST</label>        <input ref={rVID} style={S.inp} placeholder="0" onBlur={recalc} /></div>
          <div><label style={S.lbl}>STYLIST</label>             <input ref={rSTY} style={S.inp} placeholder="0" onBlur={recalc} /></div>
          <div><label style={S.lbl}>MAKE-UP & HAIR</label>      <input ref={rMUA} style={S.inp} placeholder="0" onBlur={recalc} /></div>
          <div><label style={S.lbl}>MODELLI/E</label>           <input ref={rMOD} style={S.inp} placeholder="0" onBlur={recalc} /></div>
          <div><label style={S.lbl}>LOCATION</label>            <input ref={rLOC} style={S.inp} placeholder="0" onBlur={recalc} /></div>
          <div><label style={S.lbl}>ATTREZZATURA</label>        <input ref={rEQ}  style={S.inp} placeholder="0" onBlur={recalc} /></div>
          <div style={{gridColumn:"span 2"}}><label style={S.lbl}>ALTRO</label><input ref={rOTH} style={S.inp} placeholder="0" onBlur={recalc} /></div>
        </div>
      </div>
      <div style={S.sec}><p style={d.docSectionLabel}>RIEPILOGO (auto-calcolato)</p><div style={S.grid}>
        <div><label style={S.lbl}>TOTALE PRODUZIONE (€)</label>  <input ref={rTP}  readOnly style={S.ro} /></div>
        <div><label style={S.lbl}>% FEE THE[NAME]</label>        <input ref={rAP}  defaultValue="20" style={S.inp} onBlur={recalc} /></div>
        <div><label style={S.lbl}>FEE THE[NAME] (€)</label>      <input ref={rAF}  readOnly style={S.ro} /></div>
        <div><label style={S.lbl}>TOTALE IMPONIBILE (€)</label>  <input ref={rTN}  readOnly style={S.ro} /></div>
        <div><label style={S.lbl}>IVA 22% (€)</label>            <input ref={rVAT} readOnly style={S.ro} /></div>
        <div><label style={S.lbl}>TOTALE IVA INCLUSA (€)</label> <input ref={rTG}  readOnly style={S.ro} /></div>
      </div></div>
      <div style={S.sec}><p style={d.docSectionLabel}>DIRITTI DI UTILIZZO</p><div style={S.grid}>
        <div style={{gridColumn:"span 2"}}><label style={S.lbl}>UTILIZZI CONCESSI</label><input ref={rUSG} style={S.inp} placeholder="Social, Web, Stampa" /></div>
        <div><label style={S.lbl}>TERRITORIO</label><input ref={rTER} style={S.inp} placeholder="Italia" /></div>
        <div><label style={S.lbl}>DURATA</label>    <input ref={rDUR} style={S.inp} placeholder="12 mesi" /></div>
      </div></div>
      <div style={S.sec}><p style={d.docSectionLabel}>NOTE</p>
        <textarea ref={rNote} rows={3} style={{...S.inp,width:"100%",resize:"vertical"}} placeholder="Note aggiuntive..." />
      </div>
      <button onClick={pdf} style={{...d.btnPrimary,marginTop:8}}>↓ GENERA E STAMPA PDF</button>
    </div>
  );
}

function NDAForm({ creatives }) {
  const rNum  = useRef(null); const rDate = useRef(null);
  const rP1N  = useRef(null); const rP1E  = useRef(null);
  const rP2N  = useRef(null); const rP2E  = useRef(null);
  const rPN   = useRef(null); const rPD   = useRef(null);
  const rDur  = useRef(null); const rJur  = useRef(null); const rNote = useRef(null);

  useEffect(() => { if (rDate.current) rDate.current.value = todayISO(); }, []);

  const g = r => r?.current?.value || "";
  const onCreative = e => {
    const c = creatives.find(x => x.id === e.target.value);
    if (c && rP2N.current) rP2N.current.value = c.nome||"";
  };
  const pdf = () => openPDF(pdfBase("Accordo di Riservatezza — NDA", g(rNum)||"NDA-", fmtDate(g(rDate))) + `
    <div class="s"><div class="sl">Parti</div><div class="g">
      ${pdfField("Parte Divulgante",g(rP1N))}${pdfField("Email",g(rP1E))}
      ${pdfField("Parte Ricevente",g(rP2N))}${pdfField("Email",g(rP2E))}
    </div></div>
    <div class="s"><div class="sl">Progetto</div><div class="g">
      ${pdfField("Nome progetto",g(rPN))}
      ${g(rPD)?`<div style="grid-column:span 2">${pdfField("Descrizione",g(rPD))}</div>`:""}
    </div></div>
    <div class="s"><div class="sl">Condizioni</div>
      <p style="font-size:14px;line-height:1.8">Le parti si impegnano a mantenere riservate tutte le informazioni condivise per una durata di <strong>${g(rDur)||"2"} anni</strong> dalla firma.</p>
    </div>
    <div class="g" style="margin-bottom:28px">
      ${pdfField("Durata riservatezza",g(rDur)+" anni")}${pdfField("Foro competente",g(rJur)||"Firenze")}
    </div>
    ${g(rNote)?`<div class="s"><div class="sl">Note</div><p style="font-size:14px">${g(rNote)}</p></div>`:""}
    <div class="sg">
      <div><div class="fl">${g(rP1N)||"Parte Divulgante"}</div><div class="sl2">Firma e data</div></div>
      <div><div class="fl">${g(rP2N)||"Parte Ricevente"}</div><div class="sl2">Firma e data</div></div>
    </div>`);

  return (
    <div style={d.docWrap}>
      <p style={d.docDesc}>Accordo di riservatezza per brief, strategie e materiali inediti</p>
      <div style={S.sec}><p style={d.docSectionLabel}>AUTO-COMPILA DA CREATIVO</p>
        <select onChange={onCreative} style={d.docSelect}>
          <option value="">-- Seleziona creativo (parte ricevente) --</option>
          {creatives.map(c => <option key={c.id} value={c.id}>{c.nome} · {c.ruolo}</option>)}
        </select>
      </div>
      <div style={S.sec}><p style={d.docSectionLabel}>INTESTAZIONE</p><div style={S.grid}>
        <div><label style={S.lbl}>N. DOCUMENTO</label><input ref={rNum} style={S.inp} placeholder="NDA-2025-001" /></div>
        <div><label style={S.lbl}>DATA</label><input ref={rDate} type="date" style={S.inp} /></div>
      </div></div>
      <div style={S.sec}><p style={d.docSectionLabel}>PARTE DIVULGANTE</p><div style={S.grid}>
        <div><label style={S.lbl}>NOME / AZIENDA</label><input ref={rP1N} style={S.inp} placeholder="Brand S.r.l." /></div>
        <div><label style={S.lbl}>EMAIL</label>          <input ref={rP1E} type="email" style={S.inp} placeholder="email@brand.com" /></div>
      </div></div>
      <div style={S.sec}><p style={d.docSectionLabel}>PARTE RICEVENTE</p><div style={S.grid}>
        <div><label style={S.lbl}>NOME</label>  <input ref={rP2N} style={S.inp} placeholder="Nome Cognome" /></div>
        <div><label style={S.lbl}>EMAIL</label> <input ref={rP2E} type="email" style={S.inp} placeholder="email@studio.com" /></div>
      </div></div>
      <div style={S.sec}><p style={d.docSectionLabel}>PROGETTO</p><div style={S.grid}>
        <div style={{gridColumn:"span 2"}}><label style={S.lbl}>NOME PROGETTO</label><input ref={rPN} style={S.inp} placeholder="Campagna SS26" /></div>
        <div style={{gridColumn:"span 2"}}><label style={S.lbl}>DESCRIZIONE</label><textarea ref={rPD} rows={3} style={{...S.inp,resize:"vertical"}} /></div>
      </div></div>
      <div style={S.sec}><p style={d.docSectionLabel}>CONDIZIONI</p><div style={S.grid}>
        <div><label style={S.lbl}>DURATA (anni)</label>   <input ref={rDur} defaultValue="2" style={S.inp} /></div>
        <div><label style={S.lbl}>FORO COMPETENTE</label> <input ref={rJur} defaultValue="Firenze" style={S.inp} /></div>
      </div></div>
      <div style={S.sec}><p style={d.docSectionLabel}>NOTE</p>
        <textarea ref={rNote} rows={3} style={{...S.inp,width:"100%",resize:"vertical"}} placeholder="Note aggiuntive..." />
      </div>
      <button onClick={pdf} style={{...d.btnPrimary,marginTop:8}}>↓ GENERA E STAMPA PDF</button>
    </div>
  );
}

function LicensingForm({ creatives }) {
  const rNum  = useRef(null); const rDate = useRef(null);
  const rTN   = useRef(null); const rTE   = useRef(null);
  const rClN  = useRef(null); const rClE  = useRef(null);
  const rPN   = useRef(null); const rDesc = useRef(null);
  const rSD   = useRef(null); const rFC   = useRef(null); const rFF  = useRef(null);
  const rMED  = useRef(null); const rTER  = useRef(null); const rDUR = useRef(null);
  const rEXC  = useRef(null); const rFEE  = useRef(null); const rPD  = useRef(null);
  const rJUR  = useRef(null); const rNote = useRef(null);

  useEffect(() => { if (rDate.current) rDate.current.value = todayISO(); }, []);

  const g = r => r?.current?.value || "";
  const onCreative = e => {
    const c = creatives.find(x => x.id === e.target.value);
    if (c && rTN.current) rTN.current.value = c.nome||"";
  };
  const pdf = () => openPDF(pdfBase("Image Licensing Agreement", g(rNum)||"LIC-", fmtDate(g(rDate))) + `
    <div class="s"><div class="sl">Parti</div><div class="g">
      ${pdfField("Licenziante (Creativo)",g(rTN))}${pdfField("Email creativo",g(rTE))}
      ${pdfField("Licenziatario (Cliente)",g(rClN))}${pdfField("Email cliente",g(rClE))}
    </div></div>
    <div class="s"><div class="sl">Materiale Licenziato</div><div class="g">
      ${pdfField("Progetto",g(rPN))}${pdfField("Data produzione",fmtDate(g(rSD)))}
      <div style="grid-column:span 2">${pdfField("Descrizione contenuto",g(rDesc))}</div>
      ${pdfField("N. file",g(rFC))}${pdfField("Formati",g(rFF))}
    </div></div>
    <div class="s"><div class="sl">Termini di Utilizzo</div><div class="g">
      <div style="grid-column:span 2">${pdfField("Media / Canali",g(rMED))}</div>
      ${pdfField("Territorio",g(rTER))}${pdfField("Durata",g(rDUR))}
      ${pdfField("Esclusiva",g(rEXC)||"No")}
    </div></div>
    <div class="s"><div class="sl">Corrispettivo</div><div class="fb">
      <div class="fr"><span>Fee licenza</span><span>€ ${g(rFEE)||"—"}</span></div>
      <div class="fr"><span>Scadenza pagamento</span><span>${fmtDate(g(rPD))}</span></div>
    </div></div>
    <div class="g" style="margin-bottom:28px">${pdfField("Foro competente",g(rJUR)||"Firenze")}</div>
    ${g(rNote)?`<div class="s"><div class="sl">Note</div><p style="font-size:14px">${g(rNote)}</p></div>`:""}
    <div class="sg">
      <div><div class="fl">${g(rTN)||"Creativo"}</div><div class="sl2">Firma e data</div></div>
      <div><div class="fl">${g(rClN)||"Cliente"}</div><div class="sl2">Firma e data</div></div>
    </div>`);

  return (
    <div style={d.docWrap}>
      <p style={d.docDesc}>Licenza di utilizzo immagini e contenuti prodotti dai creativi</p>
      <div style={S.sec}><p style={d.docSectionLabel}>AUTO-COMPILA DA CREATIVO</p>
        <select onChange={onCreative} style={d.docSelect}>
          <option value="">-- Seleziona creativo (licenziante) --</option>
          {creatives.map(c => <option key={c.id} value={c.id}>{c.nome} · {c.ruolo}</option>)}
        </select>
      </div>
      <div style={S.sec}><p style={d.docSectionLabel}>INTESTAZIONE</p><div style={S.grid}>
        <div><label style={S.lbl}>N. LICENZA</label><input ref={rNum} style={S.inp} placeholder="LIC-2025-001" /></div>
        <div><label style={S.lbl}>DATA</label><input ref={rDate} type="date" style={S.inp} /></div>
      </div></div>
      <div style={S.sec}><p style={d.docSectionLabel}>LICENZIANTE (CREATIVO)</p><div style={S.grid}>
        <div><label style={S.lbl}>NOME</label>  <input ref={rTN} style={S.inp} placeholder="Nome Cognome" /></div>
        <div><label style={S.lbl}>EMAIL</label> <input ref={rTE} type="email" style={S.inp} placeholder="email@creativo.com" /></div>
      </div></div>
      <div style={S.sec}><p style={d.docSectionLabel}>LICENZIATARIO (CLIENTE)</p><div style={S.grid}>
        <div><label style={S.lbl}>NOME / AZIENDA</label><input ref={rClN} style={S.inp} placeholder="Brand S.r.l." /></div>
        <div><label style={S.lbl}>EMAIL</label>          <input ref={rClE} type="email" style={S.inp} placeholder="email@brand.com" /></div>
      </div></div>
      <div style={S.sec}><p style={d.docSectionLabel}>MATERIALE LICENZIATO</p><div style={S.grid}>
        <div><label style={S.lbl}>NOME PROGETTO</label>   <input ref={rPN}  style={S.inp} placeholder="Campagna SS26" /></div>
        <div><label style={S.lbl}>DATA PRODUZIONE</label> <input ref={rSD}  type="date" style={S.inp} /></div>
        <div style={{gridColumn:"span 2"}}><label style={S.lbl}>DESCRIZIONE CONTENUTO</label><textarea ref={rDesc} rows={3} style={{...S.inp,resize:"vertical"}} /></div>
        <div><label style={S.lbl}>NUMERO FILE</label> <input ref={rFC} style={S.inp} placeholder="Es. 30" /></div>
        <div><label style={S.lbl}>FORMATI</label>      <input ref={rFF} style={S.inp} placeholder="JPG, TIFF, RAW" /></div>
      </div></div>
      <div style={S.sec}><p style={d.docSectionLabel}>TERMINI DI UTILIZZO</p><div style={S.grid}>
        <div style={{gridColumn:"span 2"}}><label style={S.lbl}>MEDIA / CANALI</label><input ref={rMED} style={S.inp} placeholder="Social, Web, Stampa" /></div>
        <div><label style={S.lbl}>TERRITORIO</label><input ref={rTER} style={S.inp} placeholder="Italia" /></div>
        <div><label style={S.lbl}>DURATA</label>    <input ref={rDUR} style={S.inp} placeholder="12 mesi" /></div>
        <div><label style={S.lbl}>ESCLUSIVA</label>
          <select ref={rEXC} style={{...S.inp,cursor:"pointer"}}>
            <option value="No">No</option><option value="Si">Si</option>
          </select>
        </div>
      </div></div>
      <div style={S.sec}><p style={d.docSectionLabel}>CORRISPETTIVO</p><div style={S.grid}>
        <div><label style={S.lbl}>FEE LICENZA (€)</label>    <input ref={rFEE} style={S.inp} placeholder="2000" /></div>
        <div><label style={S.lbl}>SCADENZA PAGAMENTO</label> <input ref={rPD}  type="date" style={S.inp} /></div>
        <div><label style={S.lbl}>FORO COMPETENTE</label>    <input ref={rJUR} defaultValue="Firenze" style={S.inp} /></div>
      </div></div>
      <div style={S.sec}><p style={d.docSectionLabel}>NOTE</p>
        <textarea ref={rNote} rows={3} style={{...S.inp,width:"100%",resize:"vertical"}} placeholder="Note aggiuntive..." />
      </div>
      <button onClick={pdf} style={{...d.btnPrimary,marginTop:8}}>↓ GENERA E STAMPA PDF</button>
    </div>
  );
}

function CreativeEditModal({ creative, onClose, onSaved }) {
  const isNew = !creative;
  const [form, setForm] = useState({
    nome: creative?.nome||"", ruolo: creative?.ruolo||"", citta: creative?.citta||"",
    bio: creative?.bio||"", portfolio: creative?.portfolio||"", foto_url: creative?.foto_url||"",
    availability: creative?.availability||"available", visible: creative?.visible??true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const set = (k,v) => setForm(p => ({...p,[k]:v}));

  const save = async () => {
    if (!form.nome||!form.ruolo) { setError("Nome e ruolo sono obbligatori."); return; }
    setSaving(true); setError(null);
    const payload = {...form, tags:[form.ruolo]};
    const res = await fetch("/api/creatives", {
      method: isNew?"POST":"PATCH",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(isNew?payload:{...payload,id:creative.id}),
    });
    const json = await res.json();
    if (!res.ok) { setError(json.error||"Errore."); setSaving(false); return; }
    setSaving(false); onSaved();
  };

  return (
    <div style={d.overlay} onClick={e => e.target===e.currentTarget&&onClose()}>
      <div style={d.modal}>
        <button onClick={onClose} style={d.closeBtn}>✕</button>
        <h2 style={d.modalTitle}>{isNew?"Nuovo creativo":`Modifica — ${creative.nome}`}</h2>
        <div style={d.formGrid}>
          <MField label="Nome *" value={form.nome} onChange={v=>set("nome",v)} />
          <div>
            <label style={d.label}>Ruolo *</label>
            <select value={form.ruolo} onChange={e=>set("ruolo",e.target.value)} style={d.input}>
              <option value="">Seleziona ruolo</option>
              {RUOLI.map(r=><option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <MField label="Città" value={form.citta} onChange={v=>set("citta",v)} />
          <div>
            <label style={d.label}>Disponibilità</label>
            <select value={form.availability} onChange={e=>set("availability",e.target.value)} style={d.input}>
              <option value="available">Disponibile</option>
              <option value="unavailable">Non disponibile</option>
            </select>
          </div>
          <div style={{gridColumn:"span 2"}}>
            <label style={d.label}>Bio</label>
            <textarea value={form.bio} onChange={e=>set("bio",e.target.value)} rows={3} style={{...d.input,resize:"vertical"}} />
          </div>
          <MField label="Portfolio URL" value={form.portfolio} onChange={v=>set("portfolio",v)} span={2} />
          <MField label="Foto URL" value={form.foto_url} onChange={v=>set("foto_url",v)} span={2} />
          <div>
            <label style={d.label}>Visibile</label>
            <select value={form.visible?"yes":"no"} onChange={e=>set("visible",e.target.value==="yes")} style={d.input}>
              <option value="yes">Sì</option><option value="no">No</option>
            </select>
          </div>
        </div>
        {error && <p style={d.errorText}>{error}</p>}
        <button onClick={save} disabled={saving} style={{...d.btnPrimary,width:"100%",marginTop:20}}>
          {saving?"Salvataggio…":isNew?"Crea creativo":"Salva modifiche"}
        </button>
      </div>
    </div>
  );
}

function SectionTitle({title,subtitle}) {
  return <div style={{marginBottom:28}}>
    <h2 style={{fontFamily:"Georgia,serif",fontStyle:"italic",fontSize:32,fontWeight:300,color:"#f5f0eb",margin:"0 0 4px"}}>{title}</h2>
    <p style={{fontSize:10,letterSpacing:"2px",textTransform:"uppercase",color:"#7a7068",margin:0}}>{subtitle}</p>
  </div>;
}
function StatusBadge({status}) {
  const map={pending:{label:"In attesa",bg:"#3a2f00",color:"#c8d622"},approved:{label:"Approvata",bg:"#0a2a1e",color:"#4ade80"},rejected:{label:"Rifiutata",bg:"#2a0a0a",color:"#f87171"},new:{label:"Nuova",bg:"#0a1a2a",color:"#60a5fa"},handled:{label:"Gestita",bg:"#1a1a1a",color:"#6b7280"}};
  const c=map[status]||map.pending;
  return <span style={{fontSize:10,letterSpacing:1,padding:"3px 10px",borderRadius:99,background:c.bg,color:c.color,fontWeight:500}}>{c.label}</span>;
}
function Chip({label,color}) { return <span style={{fontSize:10,padding:"3px 10px",borderRadius:99,border:`1px solid ${color}33`,color,letterSpacing:1}}>{label}</span>; }
function Detail({label,value,span=1}) {
  return <div style={{gridColumn:`span ${span}`}}>
    <p style={{fontSize:9,textTransform:"uppercase",letterSpacing:"1px",color:"#7a7068",margin:"0 0 3px"}}>{label}</p>
    <p style={{fontSize:13,color:"#e8e0d8",margin:0}}>{value||"—"}</p>
  </div>;
}
function MField({label,value,onChange,span=1}) {
  return <div style={{gridColumn:`span ${span}`}}>
    <label style={d.label}>{label}</label>
    <input value={value} onChange={e=>onChange(e.target.value)} style={d.input} />
  </div>;
}
function AvatarFallback({name,small}) {
  const sz=small?28:36;
  return <div style={{width:sz,height:sz,borderRadius:"50%",background:"#1a2a1a",color:"#c8d622",display:"flex",alignItems:"center",justifyContent:"center",fontSize:small?10:12,fontWeight:600,flexShrink:0}}>{(name||"?").slice(0,2).toUpperCase()}</div>;
}
function Loading() { return <p style={{fontSize:13,color:"#7a7068",textAlign:"center",padding:"2rem"}}>Caricamento…</p>; }
function EmptyBox({text}) { return <div style={{textAlign:"center",padding:"3rem",border:"1px dashed #2a2a2a",borderRadius:8}}><p style={{fontSize:13,color:"#7a7068",margin:0}}>{text}</p></div>; }

const d = {
  loginWrap:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0d0b0a"},
  loginBox:{background:"#141210",padding:"2.5rem",borderRadius:4,width:360,border:"1px solid #2a2520"},
  loginLogo:{fontFamily:"Georgia,serif",fontSize:28,fontWeight:300,fontStyle:"italic",color:"#f5f0eb",marginBottom:4},
  loginSub:{fontSize:9,letterSpacing:"2px",textTransform:"uppercase",color:"#7a7068",marginBottom:32},
  wrap:{minHeight:"100vh",background:"#0d0b0a",color:"#f5f0eb"},
  topBar:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 48px",borderBottom:"1px solid #1e1c1a"},
  topBarLogo:{display:"flex",alignItems:"baseline",gap:0},
  logoItalic:{fontFamily:"Georgia,serif",fontSize:20,fontStyle:"italic",fontWeight:300,color:"#f5f0eb"},
  logoDot:{color:"#7a7068"},
  logoAdmin:{fontSize:11,letterSpacing:"2px",textTransform:"uppercase",color:"#7a7068"},
  logoutBtn:{fontSize:10,letterSpacing:"1px",textTransform:"uppercase",color:"#7a7068",background:"none",border:"none",cursor:"pointer"},
  tabs:{display:"flex",gap:0,borderBottom:"1px solid #1e1c1a",padding:"0 48px"},
  tabBtn:{padding:"16px 24px",border:"none",background:"none",fontSize:10,letterSpacing:"2px",textTransform:"uppercase",color:"#7a7068",cursor:"pointer",borderBottom:"2px solid transparent",marginBottom:-1},
  tabActive:{color:"#f5f0eb",borderBottomColor:"#c8d622"},
  content:{padding:"40px 48px",maxWidth:1100},
  filterBar:{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"},
  filterBtn:{padding:"6px 14px",borderRadius:2,border:"1px solid #2a2520",background:"none",fontSize:10,letterSpacing:"1px",textTransform:"uppercase",cursor:"pointer",display:"flex",alignItems:"center",gap:6,color:"#7a7068"},
  filterActive:{border:"1px solid #c8d622",color:"#c8d622"},
  filterCount:{background:"rgba(255,255,255,0.08)",borderRadius:99,padding:"1px 6px",fontSize:10},
  list:{display:"flex",flexDirection:"column",gap:1},
  listItem:{border:"1px solid #1e1c1a",background:"#0f0d0c"},
  listItemHeader:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 20px",cursor:"pointer"},
  listItemLeft:{display:"flex",alignItems:"center",gap:12},
  listItemRight:{display:"flex",alignItems:"center",gap:10,flexShrink:0,flexWrap:"wrap"},
  listItemName:{fontSize:14,fontWeight:500,display:"block",color:"#f5f0eb"},
  listItemMeta:{fontSize:11,color:"#7a7068",display:"block",marginTop:2},
  listItemBody:{padding:"0 20px 20px",borderTop:"1px solid #1e1c1a"},
  detailGrid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px 20px",margin:"16px 0"},
  actionRow:{display:"flex",gap:8,marginTop:12,flexWrap:"wrap",alignItems:"center"},
  miniAvatar:{width:36,height:36,borderRadius:"50%",objectFit:"cover",flexShrink:0},
  chevron:{fontSize:9,color:"#7a7068",marginLeft:4},
  linkBtn:{fontSize:11,color:"#c8d622",textDecoration:"none",letterSpacing:"1px"},
  approveBtn:{padding:"8px 18px",border:"1px solid #c8d622",background:"none",color:"#c8d622",fontSize:10,letterSpacing:"1px",textTransform:"uppercase",cursor:"pointer"},
  rejectBtn:{padding:"8px 18px",border:"1px solid #f87171",background:"none",color:"#f87171",fontSize:10,letterSpacing:"1px",textTransform:"uppercase",cursor:"pointer"},
  editBtn:{padding:"5px 12px",border:"1px solid #2a2520",background:"none",fontSize:10,letterSpacing:"1px",cursor:"pointer",color:"#7a7068"},
  toggleBtn:{padding:"5px 12px",border:"1px solid #2a2520",background:"none",fontSize:10,letterSpacing:"1px",cursor:"pointer",color:"#7a7068"},
  emailBtn:{padding:"8px 18px",border:"1px solid #60a5fa",background:"none",color:"#60a5fa",fontSize:10,letterSpacing:"1px",textTransform:"uppercase",cursor:"pointer",textDecoration:"none"},
  matchBtn:{padding:"10px 20px",border:"1px solid #c8d622",background:"#c8d622",color:"#0d0b0a",fontSize:10,letterSpacing:"1px",textTransform:"uppercase",cursor:"pointer",fontWeight:700},
  matchResults:{marginTop:20,padding:16,background:"#0a0908",border:"1px solid #2a2520",borderRadius:4},
  matchResultsTitle:{fontSize:10,letterSpacing:"2px",textTransform:"uppercase",color:"#c8d622",margin:"0 0 12px"},
  matchCard:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:"#111",border:"1px solid #1e1c1a"},
  btnPrimary:{padding:"10px 24px",border:"1px solid #c8d622",background:"none",color:"#c8d622",fontSize:10,letterSpacing:"2px",textTransform:"uppercase",cursor:"pointer"},
  btnSecondary:{padding:"8px 18px",border:"1px solid #2a2520",background:"none",color:"#7a7068",fontSize:10,letterSpacing:"1px",cursor:"pointer"},
  overlay:{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"},
  modal:{background:"#0f0d0c",border:"1px solid #2a2520",padding:"2rem",width:"100%",maxWidth:560,maxHeight:"90vh",overflowY:"auto",position:"relative"},
  closeBtn:{position:"absolute",top:16,right:16,background:"none",border:"none",fontSize:18,cursor:"pointer",color:"#7a7068"},
  modalTitle:{fontSize:16,fontWeight:500,margin:"0 0 20px",color:"#f5f0eb"},
  formGrid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14},
  label:{fontSize:10,letterSpacing:"1px",textTransform:"uppercase",color:"#7a7068",display:"block",marginBottom:6},
  input:{width:"100%",padding:"9px 12px",background:"#1a1714",border:"1px solid #2a2520",color:"#f5f0eb",fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:"inherit"},
  errorText:{fontSize:12,color:"#f87171",marginTop:8},
  docWrap:{maxWidth:700},
  docDesc:{fontSize:12,color:"#7a7068",marginBottom:32,letterSpacing:"0.5px"},
  docTabs:{display:"flex",gap:8,marginBottom:40,flexWrap:"wrap"},
  docTabBtn:{padding:"10px 20px",border:"1px solid #2a2520",background:"none",color:"#7a7068",fontSize:10,letterSpacing:"1px",textTransform:"uppercase",cursor:"pointer"},
  docTabActive:{border:"1px solid #c8d622",color:"#c8d622"},
  docSection:{marginBottom:32,paddingBottom:32,borderBottom:"1px solid #1e1c1a"},
  docSectionLabel:{fontSize:9,letterSpacing:"2px",textTransform:"uppercase",color:"#7a7068",marginBottom:16},
  docGrid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20},
  docSelect:{width:"100%",padding:"12px 16px",background:"#1a1714",border:"1px solid #2a2520",color:"#f5f0eb",fontSize:13,outline:"none",cursor:"pointer"},
};
