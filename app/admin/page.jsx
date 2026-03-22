"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "thename2026";

const RUOLI = [
  "Art Director", "Photographer", "Model", "Graphic Designer", "AI Artist",
  "Make-up Artist", "Screenwriter", "Event Planner", "Illustrator",
  "Fashion Stylist", "Videomaker", "Fashion Designer", "Digital Artist",
  "Creative Producer", "Casting Director", "Copywriter", "Set Designer",
  "Content Creator / Social Media Manager",
];

// ── Entry point ──────────────────────────────────────────────────
export default function AdminPage() {
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
          <input
            type="password"
            placeholder="Password"
            value={pwd}
            onChange={(e) => { setPwd(e.target.value); setPwdError(false); }}
            onKeyDown={(e) => e.key === "Enter" && login()}
            style={{ ...d.input, ...(pwdError ? { borderColor: "#ff4444" } : {}) }}
            autoFocus
          />
          {pwdError && <p style={d.errorText}>Password errata.</p>}
          <button onClick={login} style={{ ...d.btnPrimary, width: "100%", marginTop: 16 }}>
            ACCEDI
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={d.wrap}>
      {/* Top bar */}
      <div style={d.topBar}>
        <div style={d.topBarLogo}>
          <span style={d.logoItalic}>the[name]</span>
          <span style={d.logoDot}> · </span>
          <span style={d.logoAdmin}>admin</span>
        </div>
        <button onClick={() => setAuthed(false)} style={d.logoutBtn}>← ESCI</button>
      </div>

      {/* Tabs */}
      <div style={d.tabs}>
        {[
          { id: "candidature", label: "CANDIDATURE" },
          { id: "network", label: "NETWORK" },
          { id: "seekers", label: "RICHIESTE SEEKER" },
          { id: "documenti", label: "DOCUMENTI" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{ ...d.tabBtn, ...(tab === t.id ? d.tabActive : {}) }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={d.content}>
        {tab === "candidature" && <CandidaturesTab />}
        {tab === "network"     && <NetworkTab />}
        {tab === "seekers"     && <SeekersTab />}
        {tab === "documenti"   && <DocumentiTab />}
      </div>
    </div>
  );
}

// ── TAB: CANDIDATURE ─────────────────────────────────────────────
function CandidaturesTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("candidatures")
      .select("*")
      .order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  const acceptAndPromote = async (id) => {
    const res = await fetch("/api/candidatures", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "approved", promote: true }),
    });
    const json = await res.json();
    if (!res.ok) {
      alert("Errore: " + (json.error || "operazione fallita"));
      return;
    }
    await load();
  };

  const rejectItem = async (id) => {
    const res = await fetch("/api/candidatures", {
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
        {[
          { id: "all", label: "Tutte" },
          { id: "pending", label: "In attesa" },
          { id: "approved", label: "Approvate" },
          { id: "rejected", label: "Rifiutate" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{ ...d.filterBtn, ...(filter === f.id ? d.filterActive : {}) }}
          >
            {f.label} <span style={d.filterCount}>{counts[f.id]}</span>
          </button>
        ))}
      </div>

      {loading ? <Loading /> : filtered.length === 0 ? (
        <EmptyBox text="Nessuna candidatura in questa categoria." />
      ) : (
        <div style={d.list}>
          {filtered.map((item) => (
            <div key={item.id} style={d.listItem}>
              <div style={d.listItemHeader} onClick={() => setExpanded(expanded === item.id ? null : item.id)}>
                <div style={d.listItemLeft}>
                  {item.foto_url
                    ? <img src={item.foto_url} alt={item.nome} style={d.miniAvatar} />
                    : <AvatarFallback name={item.nome} />
                  }
                  <div>
                    <span style={d.listItemName}>{item.nome}</span>
                    <span style={d.listItemMeta}>{item.ruoli} · {item.citta} · {item.aree}</span>
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
                    <Detail label="Data" value={new Date(item.created_at).toLocaleDateString("it-IT")} />
                    <Detail label="Preferenze" value={item.preferenze} span={2} />
                    <Detail label="Esigenze" value={item.esigenze} span={2} />
                  </div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
                    {item.portfolio && <a href={item.portfolio} target="_blank" rel="noopener noreferrer" style={d.linkBtn}>Portfolio →</a>}
                    {item.foto_url && <a href={item.foto_url} target="_blank" rel="noopener noreferrer" style={d.linkBtn}>Foto →</a>}
                  </div>
                  {item.status === "pending" && (
                    <div style={d.actionRow}>
                      <button onClick={() => acceptAndPromote(item.id)} style={d.approveBtn}>✓ Accetta al network</button>
                      <button onClick={() => rejectItem(item.id)} style={d.rejectBtn}>✕ Rifiuta</button>
                    </div>
                  )}
                  {item.status === "approved" && <p style={{ fontSize: 12, color: "#c8d622", marginTop: 8 }}>✓ Accettato — profilo aggiunto al network</p>}
                  {item.status === "rejected" && (
                    <button onClick={() => acceptAndPromote(item.id)} style={d.btnSecondary}>Rimetti in attesa</button>
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

// ── TAB: NETWORK (Creativi) ──────────────────────────────────────
function NetworkTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/creatives");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Errore caricamento network:", e);
      setItems([]);
    }
    setLoading(false);
  };

  const toggleVisible = async (id, current) => {
    await supabase.from("creatives").update({ visible: !current }).eq("id", id);
    await load();
  };

  return (
    <div>
      <SectionTitle title="Network" subtitle="Creativi selezionati nel network the[name]" />
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <button onClick={() => setShowAdd(true)} style={d.btnPrimary}>+ AGGIUNGI CREATIVO</button>
      </div>

      {loading ? <Loading /> : items.length === 0 ? (
        <EmptyBox text="Nessun creativo ancora. Approva candidature o aggiungine uno manualmente." />
      ) : (
        <div style={d.list}>
          {items.map((item) => (
            <div key={item.id} style={d.listItem}>
              <div style={{ ...d.listItemHeader, cursor: "default" }}>
                <div style={d.listItemLeft}>
                  {item.foto_url
                    ? <img src={item.foto_url} alt={item.nome} style={d.miniAvatar} />
                    : <AvatarFallback name={item.nome} />
                  }
                  <div>
                    <span style={d.listItemName}>{item.nome}</span>
                    <span style={d.listItemMeta}>{item.ruolo} · {item.citta}</span>
                  </div>
                </div>
                <div style={d.listItemRight}>
                  <Chip label={item.visible ? "Visibile" : "Nascosto"} color={item.visible ? "#c8d622" : "#666"} />
                  <Chip label={item.availability === "available" ? "Disponibile" : "Non disp."} color={item.availability === "available" ? "#4ade80" : "#666"} />
                  <button onClick={() => setEditing(item)} style={d.editBtn}>Modifica</button>
                  <button onClick={() => toggleVisible(item.id, item.visible)} style={d.toggleBtn}>
                    {item.visible ? "Nascondi" : "Mostra"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(editing || showAdd) && (
        <CreativeEditModal
          creative={editing}
          onClose={() => { setEditing(null); setShowAdd(false); }}
          onSaved={() => { setEditing(null); setShowAdd(false); load(); }}
        />
      )}
    </div>
  );
}

// ── TAB: RICHIESTE SEEKER ─────────────────────────────────────────
function SeekersTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [matchData, setMatchData] = useState({});
  const [matchLoading, setMatchLoading] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("seeker_requests")
      .select("*")
      .order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    await supabase.from("seeker_requests").update({ status }).eq("id", id);
    await load();
  };

  const doMatch = async (item) => {
    if (matchData[item.id]) {
      setMatchData((prev) => { const n = { ...prev }; delete n[item.id]; return n; });
      return;
    }
    setMatchLoading(item.id);

    const cercaRuoli = (item.cerca || "")
      .split(/[,·\n]/)
      .map((s) => s.trim())
      .filter(Boolean);

    let query = supabase.from("creatives").select("*").eq("visible", true);
    if (cercaRuoli.length > 0) {
      query = query.in("ruolo", cercaRuoli);
    }

    const { data } = await query.order("availability", { ascending: false });
    setMatchData((prev) => ({ ...prev, [item.id]: data || [] }));
    setMatchLoading(null);
  };

  return (
    <div>
      <SectionTitle title="Richieste Seeker" subtitle="Richieste in arrivo dai seeker — fai il match con i creativi" />

      {loading ? <Loading /> : items.length === 0 ? (
        <EmptyBox text="Nessuna richiesta ancora." />
      ) : (
        <div style={d.list}>
          {items.map((item) => (
            <div key={item.id} style={d.listItem}>
              <div style={d.listItemHeader} onClick={() => setExpanded(expanded === item.id ? null : item.id)}>
                <div style={d.listItemLeft}>
                  <div>
                    <span style={d.listItemName}>{item.azienda || item.nome}</span>
                    <span style={d.listItemMeta}>
                      {item.nome} · cerca: <strong style={{ color: "#c8d622" }}>{item.cerca}</strong> · {new Date(item.created_at).toLocaleDateString("it-IT")}
                    </span>
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
                    <button
                      onClick={() => doMatch(item)}
                      style={d.matchBtn}
                      disabled={matchLoading === item.id}
                    >
                      {matchLoading === item.id
                        ? "Ricerca in corso…"
                        : matchData[item.id]
                        ? "✕ Chiudi match"
                        : "⚡ MATCH — trova creativi compatibili"}
                    </button>
                    <a
                      href={`mailto:${item.email}?subject=Re: Richiesta creativo — ${item.cerca}`}
                      style={d.emailBtn}
                    >
                      ✉ Rispondi
                    </a>
                    {item.status !== "handled" && (
                      <button onClick={() => updateStatus(item.id, "handled")} style={d.btnSecondary}>
                        Segna gestita
                      </button>
                    )}
                  </div>

                  {matchData[item.id] && (
                    <div style={d.matchResults}>
                      <p style={d.matchResultsTitle}>
                        {matchData[item.id].length === 0
                          ? "Nessun creativo disponibile per questo ruolo."
                          : `${matchData[item.id].length} creativ${matchData[item.id].length === 1 ? "o" : "i"} compatibil${matchData[item.id].length === 1 ? "e" : "i"}`}
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {matchData[item.id].map((c) => (
                          <div key={c.id} style={d.matchCard}>
                            <div style={d.listItemLeft}>
                              {c.foto_url
                                ? <img src={c.foto_url} alt={c.nome} style={d.miniAvatar} />
                                : <AvatarFallback name={c.nome} small />
                              }
                              <div>
                                <span style={{ ...d.listItemName, color: "#f5f0eb" }}>{c.nome}</span>
                                <span style={d.listItemMeta}>{c.ruolo} · {c.citta}</span>
                              </div>
                            </div>
                            <div style={d.listItemRight}>
                              <Chip
                                label={c.availability === "available" ? "Disponibile" : "Non disp."}
                                color={c.availability === "available" ? "#c8d622" : "#666"}
                              />
                              {c.portfolio && (
                                <a href={c.portfolio} target="_blank" rel="noopener noreferrer" style={d.linkBtn}>
                                  Portfolio →
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
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

// ── TAB: DOCUMENTI ───────────────────────────────────────────────
function DocumentiTab() {
  const [activeDoc, setActiveDoc] = useState("booking");
  const [creatives, setCreatives] = useState([]);

  useEffect(() => {
    supabase.from("creatives").select("id, nome, ruolo, citta").eq("visible", true)
      .order("nome", { ascending: true })
      .then(({ data }) => setCreatives(data || []));
  }, []);

  const docs = [
    { id: "booking", label: "01 · BOOKING CONFIRMATION" },
    { id: "quotation", label: "02 · PRODUCTION QUOTATION" },
    { id: "nda", label: "03 · NDA" },
    { id: "licensing", label: "04 · IMAGE LICENSING" },
  ];

  return (
    <div>
      <SectionTitle title="Documenti" subtitle="GENERA DOCUMENTI PROFESSIONALI THE[NAME]" />

      <div style={d.docTabs}>
        {docs.map((doc) => (
          <button
            key={doc.id}
            onClick={() => setActiveDoc(doc.id)}
            style={{ ...d.docTabBtn, ...(activeDoc === doc.id ? d.docTabActive : {}) }}
          >
            {doc.label}
          </button>
        ))}
      </div>

      {activeDoc === "booking"   && <BookingConfirmation creatives={creatives} />}
      {activeDoc === "quotation" && <ProductionQuotation creatives={creatives} />}
      {activeDoc === "nda"       && <NDAForm creatives={creatives} />}
      {activeDoc === "licensing" && <ImageLicensing creatives={creatives} />}
    </div>
  );
}

// ── Booking Confirmation form ────────────────────────────────────
function BookingConfirmation({ creatives }) {
  const [today, setToday] = useState("");
  const [docNum, setDocNum] = useState("");

  useEffect(() => {
    const now = new Date();
    setToday(now.toISOString().split("T")[0]);
    setDocNum(`BC-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);
  }, []);

  // Usiamo refs invece di state → nessun re-render mentre si scrive
  const refs = {
    docNumber:        useRef(null),
    docDate:          useRef(null),
    projectName:      useRef(null),
    serviceDate:      useRef(null),
    serviceLocation:  useRef(null),
    creativeName:     useRef(null),
    creativeRole:     useRef(null),
    creativeCity:     useRef(null),
    clientName:       useRef(null),
    clientCompany:    useRef(null),
    clientEmail:      useRef(null),
    fee:              useRef(null),
    agencyFeePercent: useRef(null),
    agencyFee:        useRef(null),
    totalGross:       useRef(null),
    notes:            useRef(null),
  };

  const handleCreativeSelect = (id) => {
    if (!id) return;
    const c = creatives.find((x) => x.id === id);
    if (c) {
      if (refs.creativeName.current) refs.creativeName.current.value = c.nome || "";
      if (refs.creativeRole.current) refs.creativeRole.current.value = c.ruolo || "";
      if (refs.creativeCity.current) refs.creativeCity.current.value = c.citta || "";
    }
  };

  const recalcFee = () => {
    const fee = parseFloat(refs.fee.current?.value) || 0;
    const pct = parseFloat(refs.agencyFeePercent.current?.value) || 20;
    const agencyFee = (fee * pct / 100).toFixed(2);
    const total = (fee + parseFloat(agencyFee)).toFixed(2);
    if (refs.agencyFee.current) refs.agencyFee.current.value = agencyFee;
    if (refs.totalGross.current) refs.totalGross.current.value = total;
  };

  const getVal = (key) => refs[key]?.current?.value || "";

  const fmt = (dateStr) => {
    if (!dateStr) return "—";
    const [y, m, d] = dateStr.split("-");
    if (!y || !m || !d) return dateStr;
    return `${d}/${m}/${y}`;
  };

  const generatePDF = () => {
    const f = {};
    Object.keys(refs).forEach(k => { f[k] = getVal(k); });
    const html = buildBookingHTML(f, fmt);
    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  };

  const inp = { width: "100%", padding: "10px 12px", background: "#1a1714", border: "1px solid #2a2520", color: "#f5f0eb", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", borderRadius: 2 };
  const lbl = { fontSize: 9, letterSpacing: "1px", textTransform: "uppercase", color: "#7a7068", display: "block", marginBottom: 6 };

  return (
    <div style={d.docWrap}>
      <p style={d.docDesc}>Contratto di ingaggio tra agenzia e cliente per creativi selezionati</p>

      <div style={d.docSection}>
        <p style={d.docSectionLabel}>AUTO-COMPILA DA CREATIVO NEL NETWORK</p>
        <select onChange={(e) => handleCreativeSelect(e.target.value)} style={d.docSelect} defaultValue="">
          <option value="">-- Seleziona creativo --</option>
          {creatives.map((c) => (
            <option key={c.id} value={c.id}>{c.nome} · {c.ruolo} · {c.citta}</option>
          ))}
        </select>
      </div>

      <div style={d.docSection}>
        <p style={d.docSectionLabel}>INTESTAZIONE</p>
        <div style={d.docGrid}>
          <div><label style={lbl}>N. DOCUMENTO</label><input ref={refs.docNumber} defaultValue={docNum} style={inp} /></div>
          <div><label style={lbl}>DATA</label><input ref={refs.docDate} defaultValue={today} type="date" style={inp} /></div>
        </div>
      </div>

      <div style={d.docSection}>
        <p style={d.docSectionLabel}>PROGETTO</p>
        <div style={d.docGrid}>
          <div><label style={lbl}>NOME PROGETTO</label><input ref={refs.projectName} defaultValue="" style={inp} placeholder="Es. Campagna SS26" /></div>
          <div><label style={lbl}>DATA SERVIZIO</label><input ref={refs.serviceDate} defaultValue="" type="date" style={inp} /></div>
          <div style={{ gridColumn: "span 2" }}><label style={lbl}>LOCATION</label><input ref={refs.serviceLocation} defaultValue="" style={inp} placeholder="Es. Milano, Studio XYZ" /></div>
        </div>
      </div>

      <div style={d.docSection}>
        <p style={d.docSectionLabel}>CREATIVO</p>
        <div style={d.docGrid}>
          <div><label style={lbl}>NOME</label><input ref={refs.creativeName} defaultValue="" style={inp} placeholder="Nome Cognome" /></div>
          <div><label style={lbl}>RUOLO</label><input ref={refs.creativeRole} defaultValue="" style={inp} placeholder="Es. Photographer" /></div>
          <div><label style={lbl}>CITTÀ</label><input ref={refs.creativeCity} defaultValue="" style={inp} placeholder="Es. Milano" /></div>
        </div>
      </div>

      <div style={d.docSection}>
        <p style={d.docSectionLabel}>CLIENTE</p>
        <div style={d.docGrid}>
          <div><label style={lbl}>NOME</label><input ref={refs.clientName} defaultValue="" style={inp} placeholder="Nome Cognome" /></div>
          <div><label style={lbl}>AZIENDA</label><input ref={refs.clientCompany} defaultValue="" style={inp} placeholder="Brand S.r.l." /></div>
          <div style={{ gridColumn: "span 2" }}><label style={lbl}>EMAIL</label><input ref={refs.clientEmail} defaultValue="" type="email" style={inp} placeholder="email@brand.com" /></div>
        </div>
      </div>

      <div style={d.docSection}>
        <p style={d.docSectionLabel}>COMPENSO E FEE AGENZIA (20%)</p>
        <div style={d.docGrid}>
          <div><label style={lbl}>FEE CREATIVO (€)</label><input ref={refs.fee} defaultValue="" style={inp} placeholder="Es. 1500" onBlur={recalcFee} /></div>
          <div><label style={lbl}>% FEE THE[NAME]</label><input ref={refs.agencyFeePercent} defaultValue="20" style={inp} onBlur={recalcFee} /></div>
          <div><label style={lbl}>FEE THE[NAME] (€) — calcolata auto</label><input ref={refs.agencyFee} defaultValue="" style={{ ...inp, opacity: 0.6 }} readOnly /></div>
          <div><label style={lbl}>TOTALE LORDO (€) — calcolato auto</label><input ref={refs.totalGross} defaultValue="" style={{ ...inp, opacity: 0.6 }} readOnly /></div>
        </div>
        <p style={{ fontSize: 10, color: "#7a7068", marginTop: 10 }}>Inserisci la fee del creativo e clicca fuori dal campo — il totale si calcola automaticamente.</p>
      </div>

      <div style={d.docSection}>
        <p style={d.docSectionLabel}>NOTE</p>
        <textarea ref={refs.notes} rows={3} style={{ ...inp, resize: "vertical", width: "100%" }} placeholder="Note aggiuntive, condizioni speciali…" defaultValue="" />
      </div>

      <button onClick={generatePDF} style={{ ...d.btnPrimary, marginTop: 8 }}>
        ↓ GENERA E STAMPA PDF
      </button>
    </div>
  );
}

function buildBookingHTML(form, fmt) {
  if (!fmt) {
    fmt = (dateStr) => {
      if (!dateStr) return "—";
      const [y, m, d] = dateStr.split("-");
      if (!y || !m || !d) return dateStr;
      return `${d}/${m}/${y}`;
    };
  }
  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<title>Booking Confirmation — ${form.docNumber}</title>
<style>
  @page { margin: 40px; }
  body { font-family: Arial, sans-serif; color: #0d0b0a; background: #fff; max-width: 700px; margin: 0 auto; padding: 40px; }
  .logo { font-family: Georgia, serif; font-size: 36px; font-weight: 300; font-style: italic; margin-bottom: 4px; }
  .sub { font-size: 9px; letter-spacing: 3px; text-transform: uppercase; color: #7a7068; margin-bottom: 40px; }
  .doc-title { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #7a7068; margin-bottom: 4px; }
  .doc-num { font-size: 22px; font-weight: 300; margin-bottom: 40px; }
  .section { margin-bottom: 32px; }
  .section-label { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: #7a7068; margin-bottom: 12px; border-bottom: 1px solid #e8e0d8; padding-bottom: 6px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .field-label { font-size: 9px; letter-spacing: 1px; text-transform: uppercase; color: #7a7068; margin-bottom: 4px; }
  .field-value { font-size: 14px; color: #0d0b0a; }
  .fee-box { background: #f5f0eb; padding: 20px 24px; margin-top: 8px; }
  .fee-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #e0d8d0; font-size: 13px; }
  .fee-row:last-child { border-bottom: none; font-weight: 600; font-size: 15px; padding-top: 12px; }
  .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #e8e0d8; font-size: 10px; color: #aaa; letter-spacing: 1px; }
  .sign-row { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 60px; }
  .sign-line { border-bottom: 1px solid #0d0b0a; padding-bottom: 4px; margin-top: 40px; font-size: 11px; color: #7a7068; letter-spacing: 1px; }
</style>
</head>
<body>
  <div class="logo">the[name]</div>
  <div class="sub">Network · Production Agency</div>
  <div class="doc-title">Booking Confirmation</div>
  <div class="doc-num">${form.docNumber} · ${fmt(form.docDate)}</div>

  <div class="section">
    <div class="section-label">Progetto</div>
    <div class="grid">
      <div><div class="field-label">Nome progetto</div><div class="field-value">${form.projectName || "—"}</div></div>
      <div><div class="field-label">Data servizio</div><div class="field-value">${fmt(form.serviceDate)}</div></div>
      <div style="grid-column:span 2"><div class="field-label">Location</div><div class="field-value">${form.serviceLocation || "—"}</div></div>
    </div>
  </div>

  <div class="section">
    <div class="section-label">Creativo</div>
    <div class="grid">
      <div><div class="field-label">Nome</div><div class="field-value">${form.creativeName || "—"}</div></div>
      <div><div class="field-label">Ruolo</div><div class="field-value">${form.creativeRole || "—"}</div></div>
      <div><div class="field-label">Città</div><div class="field-value">${form.creativeCity || "—"}</div></div>
    </div>
  </div>

  <div class="section">
    <div class="section-label">Cliente</div>
    <div class="grid">
      <div><div class="field-label">Nome</div><div class="field-value">${form.clientName || "—"}</div></div>
      <div><div class="field-label">Azienda</div><div class="field-value">${form.clientCompany || "—"}</div></div>
      <div style="grid-column:span 2"><div class="field-label">Email</div><div class="field-value">${form.clientEmail || "—"}</div></div>
    </div>
  </div>

  <div class="section">
    <div class="section-label">Compenso e Fee Agenzia</div>
    <div class="fee-box">
      <div class="fee-row"><span>Compenso creativo</span><span>€ ${form.fee || "—"}</span></div>
      <div class="fee-row"><span>Fee the[name] (${form.agencyFeePercent || 20}%)</span><span>€ ${form.agencyFee || "—"}</span></div>
      <div class="fee-row"><span>Totale dovuto</span><span>€ ${form.totalGross || "—"}</span></div>
    </div>
  </div>

  ${form.notes ? `<div class="section">
    <div class="section-label">Note</div>
    <div class="field-value">${form.notes}</div>
  </div>` : ""}

  <div class="sign-row">
    <div><div class="field-label">the[name]</div><div class="sign-line">Firma</div></div>
    <div><div class="field-label">${form.clientName || "Cliente"}</div><div class="sign-line">Firma</div></div>
  </div>

  <div class="footer">the[name] · Unfold the unseen. Find the[name]. Be the[name]. · info.findthename@gmail.com</div>
</body>
</html>`;
}

// ── Helpers condivisi per i form documenti ───────────────────────
function DocFormSection({ label, children }) {
  return (
    <div style={{ marginBottom: 32, paddingBottom: 32, borderBottom: "1px solid #1e1c1a" }}>
      <p style={{ fontSize: 9, letterSpacing: "2px", textTransform: "uppercase", color: "#7a7068", marginBottom: 16 }}>{label}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>{children}</div>
    </div>
  );
}
function DI({ label, refEl, placeholder = "", type = "text", span = 1, readOnly = false }) {
  const inp = { width: "100%", padding: "10px 12px", background: readOnly ? "#111" : "#1a1714", border: "1px solid #2a2520", color: readOnly ? "#7a7068" : "#f5f0eb", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", borderRadius: 2 };
  return (
    <div style={{ gridColumn: `span ${span}` }}>
      <label style={{ fontSize: 9, letterSpacing: "1px", textTransform: "uppercase", color: "#7a7068", display: "block", marginBottom: 6 }}>{label}</label>
      <input ref={refEl} type={type} defaultValue="" placeholder={placeholder} style={inp} readOnly={readOnly} />
    </div>
  );
}
function DT({ label, refEl, placeholder = "", span = 2 }) {
  const inp = { width: "100%", padding: "10px 12px", background: "#1a1714", border: "1px solid #2a2520", color: "#f5f0eb", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", borderRadius: 2, resize: "vertical", minHeight: 80 };
  return (
    <div style={{ gridColumn: `span ${span}` }}>
      <label style={{ fontSize: 9, letterSpacing: "1px", textTransform: "uppercase", color: "#7a7068", display: "block", marginBottom: 6 }}>{label}</label>
      <textarea ref={refEl} defaultValue="" placeholder={placeholder} style={inp} />
    </div>
  );
}
function pdfHeader(title, docNum, docDate) {
  return `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"><title>${title}</title><style>
    @page{margin:40px}body{font-family:Arial,sans-serif;color:#0d0b0a;max-width:700px;margin:0 auto;padding:40px}
    .logo{font-family:Georgia,serif;font-size:36px;font-weight:300;font-style:italic;margin-bottom:4px}
    .sub{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#7a7068;margin-bottom:40px}
    .doc-title{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#7a7068;margin-bottom:4px}
    .doc-num{font-size:22px;font-weight:300;margin-bottom:40px}
    .sec{margin-bottom:28px}.sec-label{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#7a7068;border-bottom:1px solid #e8e0d8;padding-bottom:6px;margin-bottom:12px}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .fl{font-size:9px;letter-spacing:1px;text-transform:uppercase;color:#7a7068;margin-bottom:4px}
    .fv{font-size:14px;color:#0d0b0a;margin-bottom:0}
    .fee-box{background:#f5f0eb;padding:20px 24px;margin-top:8px}
    .fee-row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #e0d8d0;font-size:13px}
    .fee-row:last-child{border-bottom:none;font-weight:600;font-size:15px;padding-top:12px}
    .sign-row{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:60px}
    .sign-line{border-bottom:1px solid #0d0b0a;margin-top:40px;font-size:11px;color:#7a7068;letter-spacing:1px}
    .footer{margin-top:60px;padding-top:20px;border-top:1px solid #e8e0d8;font-size:10px;color:#aaa;letter-spacing:1px}
  </style></head><body>
  <div class="logo">the[name]</div>
  <div class="sub">Network · Production Agency</div>
  <div class="doc-title">${title}</div>
  <div class="doc-num">${docNum} · ${docDate}</div>`;
}
function fmtDate(s) { if(!s) return "—"; const [y,m,d]=s.split("-"); return (d&&m&&y)?`${d}/${m}/${y}`:s; }
function pdfField(label, value) { return `<div><div class="fl">${label}</div><div class="fv">${value||"—"}</div></div>`; }

// ── 02 · Production Quotation ────────────────────────────────────
function ProductionQuotation({ creatives }) {
  const [today, setToday] = useState("");
  useEffect(() => { setToday(new Date().toISOString().split("T")[0]); }, []);

  const rDocNum = useRef(null); const rDocDate = useRef(null);
  const rClientName = useRef(null); const rClientContact = useRef(null); const rClientEmail = useRef(null);
  const rProjectName = useRef(null); const rProjectDesc = useRef(null);
  const rArtDir = useRef(null); const rPhoto = useRef(null); const rVideo = useRef(null);
  const rStylist = useRef(null); const rMua = useRef(null); const rModels = useRef(null);
  const rLocation = useRef(null); const rEquipment = useRef(null); const rOther = useRef(null);
  const rTotalProd = useRef(null); const rAgencyPct = useRef(null); const rAgencyFee = useRef(null);
  const rTotalNet = useRef(null); const rVat = useRef(null); const rTotalGross = useRef(null);
  const rUsageRights = useRef(null); const rTerritory = useRef(null); const rDuration = useRef(null);
  const rNotes = useRef(null);

  const g = (ref) => ref?.current?.value || "";

  const recalc = () => {
    const items = [rArtDir, rPhoto, rVideo, rStylist, rMua, rModels, rLocation, rEquipment, rOther];
    const total = items.reduce((s, ref) => s + (parseFloat(ref?.current?.value) || 0), 0);
    const pct = parseFloat(rAgencyPct?.current?.value) || 20;
    const agency = total * pct / 100;
    const net = total + agency;
    const vat = net * 0.22;
    const gross = net + vat;
    if (rTotalProd.current) rTotalProd.current.value = total.toFixed(2);
    if (rAgencyFee.current) rAgencyFee.current.value = agency.toFixed(2);
    if (rTotalNet.current) rTotalNet.current.value = net.toFixed(2);
    if (rVat.current) rVat.current.value = vat.toFixed(2);
    if (rTotalGross.current) rTotalGross.current.value = gross.toFixed(2);
  };

  const generatePDF = () => {
    const html = pdfHeader("Production Quotation", g(rDocNum) || "QT-", fmtDate(g(rDocDate))) + `
      <div class="sec"><div class="sec-label">Cliente e Progetto</div><div class="grid">
        ${pdfField("Cliente", g(rClientName))}${pdfField("Referente", g(rClientContact))}
        ${pdfField("Email", g(rClientEmail))}${pdfField("Progetto", g(rProjectName))}
      </div></div>
      ${g(rProjectDesc) ? `<div class="sec"><div class="sec-label">Brief</div><p style="font-size:14px;line-height:1.7">${g(rProjectDesc)}</p></div>` : ""}
      <div class="sec"><div class="sec-label">Budget Voci (€ escluso IVA)</div><div class="grid">
        ${pdfField("Direzione Artistica", "€ " + g(rArtDir))}${pdfField("Fotografo / Post", "€ " + g(rPhoto))}
        ${pdfField("Video / Post", "€ " + g(rVideo))}${pdfField("Stylist", "€ " + g(rStylist))}
        ${pdfField("Make-up & Hair", "€ " + g(rMua))}${pdfField("Modelli/e", "€ " + g(rModels))}
        ${pdfField("Location", "€ " + g(rLocation))}${pdfField("Attrezzatura", "€ " + g(rEquipment))}
        ${g(rOther) ? pdfField("Altro", "€ " + g(rOther)) : ""}
      </div></div>
      <div class="sec"><div class="sec-label">Riepilogo</div>
        <div class="fee-box">
          <div class="fee-row"><span>Totale produzione</span><span>€ ${g(rTotalProd)}</span></div>
          <div class="fee-row"><span>Agency fee the[name] (${g(rAgencyPct) || 20}%)</span><span>€ ${g(rAgencyFee)}</span></div>
          <div class="fee-row"><span>Totale imponibile</span><span>€ ${g(rTotalNet)}</span></div>
          <div class="fee-row"><span>IVA 22%</span><span>€ ${g(rVat)}</span></div>
          <div class="fee-row"><span>TOTALE IVA INCLUSA</span><span>€ ${g(rTotalGross)}</span></div>
        </div>
      </div>
      <div class="sec"><div class="sec-label">Diritti di utilizzo</div><div class="grid">
        ${pdfField("Utilizzi", g(rUsageRights))}${pdfField("Territorio", g(rTerritory))}${pdfField("Durata", g(rDuration))}
      </div></div>
      ${g(rNotes) ? `<div class="sec"><div class="sec-label">Note</div><p style="font-size:14px">${g(rNotes)}</p></div>` : ""}
      <div class="sign-row">
        <div><div class="fl">the[name]</div><div class="sign-line">Firma</div></div>
        <div><div class="fl">${g(rClientName) || "Cliente"}</div><div class="sign-line">Firma</div></div>
      </div>
      <div class="footer">the[name] · info.findthename@gmail.com</div></body></html>`;
    const win = window.open("", "_blank"); win.document.write(html); win.document.close(); setTimeout(() => win.print(), 500);
  };

  const inp = { width: "100%", padding: "10px 12px", background: "#1a1714", border: "1px solid #2a2520", color: "#f5f0eb", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", borderRadius: 2 };
  const roInp = { ...inp, background: "#111", color: "#7a7068" };
  const lbl = { fontSize: 9, letterSpacing: "1px", textTransform: "uppercase", color: "#7a7068", display: "block", marginBottom: 6 };
  const sec = { marginBottom: 32, paddingBottom: 32, borderBottom: "1px solid #1e1c1a" };
  const grid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 };

  return (
    <div style={d.docWrap}>
      <p style={d.docDesc}>Preventivo di produzione dettagliato per brand e clienti</p>
      <div style={sec}><p style={d.docSectionLabel}>INTESTAZIONE</p><div style={grid}>
        <div><label style={lbl}>N. PREVENTIVO</label><input ref={rDocNum} defaultValue="" placeholder="QT-2025-001" style={inp}/></div>
        <div><label style={lbl}>DATA</label><input ref={rDocDate} defaultValue={today} type="date" style={inp}/></div>
      </div></div>
      <div style={sec}><p style={d.docSectionLabel}>CLIENTE E PROGETTO</p><div style={grid}>
        <div><label style={lbl}>CLIENTE / BRAND</label><input ref={rClientName} defaultValue="" placeholder="Brand S.r.l." style={inp}/></div>
        <div><label style={lbl}>REFERENTE</label><input ref={rClientContact} defaultValue="" placeholder="Nome Cognome" style={inp}/></div>
        <div style={{gridColumn:"span 2"}}><label style={lbl}>EMAIL</label><input ref={rClientEmail} defaultValue="" type="email" placeholder="email@brand.com" style={inp}/></div>
        <div><label style={lbl}>NOME PROGETTO</label><input ref={rProjectName} defaultValue="" placeholder="Campagna SS26" style={inp}/></div>
        <div style={{gridColumn:"span 2"}}><label style={lbl}>BRIEF / DESCRIZIONE</label><textarea ref={rProjectDesc} defaultValue="" rows={3} style={{...inp, resize:"vertical"}}/></div>
      </div></div>
      <div style={sec}><p style={d.docSectionLabel}>VOCI DI BUDGET (€ escluso IVA)</p>
        <p style={{fontSize:10,color:"#7a7068",marginBottom:16}}>Inserisci gli importi e clicca fuori dal campo — i totali si calcolano automaticamente.</p>
        <div style={grid}>
          <div><label style={lbl}>DIREZIONE ARTISTICA</label><input ref={rArtDir} defaultValue="" placeholder="0" style={inp} onBlur={recalc}/></div>
          <div><label style={lbl}>FOTOGRAFO + POST</label><input ref={rPhoto} defaultValue="" placeholder="0" style={inp} onBlur={recalc}/></div>
          <div><label style={lbl}>VIDEO + POST</label><input ref={rVideo} defaultValue="" placeholder="0" style={inp} onBlur={recalc}/></div>
          <div><label style={lbl}>STYLIST</label><input ref={rStylist} defaultValue="" placeholder="0" style={inp} onBlur={recalc}/></div>
          <div><label style={lbl}>MAKE-UP & HAIR</label><input ref={rMua} defaultValue="" placeholder="0" style={inp} onBlur={recalc}/></div>
          <div><label style={lbl}>MODELLI/E</label><input ref={rModels} defaultValue="" placeholder="0" style={inp} onBlur={recalc}/></div>
          <div><label style={lbl}>LOCATION</label><input ref={rLocation} defaultValue="" placeholder="0" style={inp} onBlur={recalc}/></div>
          <div><label style={lbl}>ATTREZZATURA</label><input ref={rEquipment} defaultValue="" placeholder="0" style={inp} onBlur={recalc}/></div>
          <div style={{gridColumn:"span 2"}}><label style={lbl}>ALTRO</label><input ref={rOther} defaultValue="" placeholder="0" style={inp} onBlur={recalc}/></div>
        </div>
      </div>
      <div style={sec}><p style={d.docSectionLabel}>RIEPILOGO (auto-calcolato)</p><div style={grid}>
        <div><label style={lbl}>TOTALE PRODUZIONE (€)</label><input ref={rTotalProd} defaultValue="" style={roInp} readOnly/></div>
        <div><label style={lbl}>% FEE THE[NAME]</label><input ref={rAgencyPct} defaultValue="20" style={inp} onBlur={recalc}/></div>
        <div><label style={lbl}>FEE THE[NAME] (€)</label><input ref={rAgencyFee} defaultValue="" style={roInp} readOnly/></div>
        <div><label style={lbl}>TOTALE IMPONIBILE (€)</label><input ref={rTotalNet} defaultValue="" style={roInp} readOnly/></div>
        <div><label style={lbl}>IVA 22% (€)</label><input ref={rVat} defaultValue="" style={roInp} readOnly/></div>
        <div><label style={lbl}>TOTALE IVA INCLUSA (€)</label><input ref={rTotalGross} defaultValue="" style={roInp} readOnly/></div>
      </div></div>
      <div style={sec}><p style={d.docSectionLabel}>DIRITTI DI UTILIZZO</p><div style={grid}>
        <div style={{gridColumn:"span 2"}}><label style={lbl}>UTILIZZI CONCESSI</label><input ref={rUsageRights} defaultValue="" placeholder="Social, Web, Stampa" style={inp}/></div>
        <div><label style={lbl}>TERRITORIO</label><input ref={rTerritory} defaultValue="" placeholder="Italia" style={inp}/></div>
        <div><label style={lbl}>DURATA</label><input ref={rDuration} defaultValue="" placeholder="12 mesi" style={inp}/></div>
      </div></div>
      <div style={sec}><p style={d.docSectionLabel}>NOTE</p>
        <textarea ref={rNotes} defaultValue="" rows={3} style={{...inp, width:"100%", resize:"vertical"}} placeholder="Note aggiuntive..."/>
      </div>
      <button onClick={generatePDF} style={{...d.btnPrimary, marginTop:8}}>↓ GENERA E STAMPA PDF</button>
    </div>
  );
}

// ── 03 · NDA ─────────────────────────────────────────────────────
function NDAForm({ creatives }) {
  const [today, setToday] = useState("");
  useEffect(() => { setToday(new Date().toISOString().split("T")[0]); }, []);

  const rDocNum = useRef(null); const rDocDate = useRef(null);
  const rParty1Name = useRef(null); const rParty1Email = useRef(null);
  const rParty2Name = useRef(null); const rParty2Email = useRef(null);
  const rProjectName = useRef(null); const rProjectDesc = useRef(null);
  const rDuration = useRef(null); const rJurisdiction = useRef(null); const rNotes = useRef(null);

  const g = (ref) => ref?.current?.value || "";

  const handleCreativeSelect = (id) => {
    if (!id) return;
    const c = creatives.find((x) => x.id === id);
    if (c && rParty2Name.current) rParty2Name.current.value = c.nome || "";
  };

  const generatePDF = () => {
    const html = pdfHeader("Accordo di Riservatezza — NDA", g(rDocNum) || "NDA-", fmtDate(g(rDocDate))) + `
      <div class="sec"><div class="sec-label">Parti</div><div class="grid">
        ${pdfField("Parte Divulgante", g(rParty1Name))}${pdfField("Email", g(rParty1Email))}
        ${pdfField("Parte Ricevente", g(rParty2Name))}${pdfField("Email", g(rParty2Email))}
      </div></div>
      <div class="sec"><div class="sec-label">Progetto</div><div class="grid">
        ${pdfField("Nome progetto", g(rProjectName))}
        ${g(rProjectDesc) ? `<div style="grid-column:span 2">${pdfField("Descrizione", g(rProjectDesc))}</div>` : ""}
      </div></div>
      <div class="sec"><div class="sec-label">Condizioni</div>
        <p style="font-size:14px;line-height:1.8;color:#333;">Le parti si impegnano a mantenere riservate tutte le informazioni condivise nell'ambito della collaborazione descritta, per una durata di <strong>${g(rDuration) || "2"} anni</strong> dalla firma del presente accordo.</p>
      </div>
      <div class="grid" style="margin-bottom:28px">
        ${pdfField("Durata riservatezza", g(rDuration) + " anni")}${pdfField("Foro competente", g(rJurisdiction) || "Firenze")}
      </div>
      ${g(rNotes) ? `<div class="sec"><div class="sec-label">Note</div><p style="font-size:14px">${g(rNotes)}</p></div>` : ""}
      <div class="sign-row">
        <div><div class="fl">${g(rParty1Name) || "Parte Divulgante"}</div><div class="sign-line">Firma e data</div></div>
        <div><div class="fl">${g(rParty2Name) || "Parte Ricevente"}</div><div class="sign-line">Firma e data</div></div>
      </div>
      <div class="footer">the[name] · info.findthename@gmail.com</div></body></html>`;
    const win = window.open("", "_blank"); win.document.write(html); win.document.close(); setTimeout(() => win.print(), 500);
  };

  const inp = { width: "100%", padding: "10px 12px", background: "#1a1714", border: "1px solid #2a2520", color: "#f5f0eb", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", borderRadius: 2 };
  const lbl = { fontSize: 9, letterSpacing: "1px", textTransform: "uppercase", color: "#7a7068", display: "block", marginBottom: 6 };
  const sec = { marginBottom: 32, paddingBottom: 32, borderBottom: "1px solid #1e1c1a" };
  const grid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 };

  return (
    <div style={d.docWrap}>
      <p style={d.docDesc}>Accordo di riservatezza per brief, strategie e materiali inediti</p>
      <div style={sec}><p style={d.docSectionLabel}>AUTO-COMPILA DA CREATIVO NEL NETWORK</p>
        <select onChange={(e) => handleCreativeSelect(e.target.value)} style={d.docSelect} defaultValue="">
          <option value="">-- Seleziona creativo (parte ricevente) --</option>
          {creatives.map((c) => <option key={c.id} value={c.id}>{c.nome} · {c.ruolo}</option>)}
        </select>
      </div>
      <div style={sec}><p style={d.docSectionLabel}>INTESTAZIONE</p><div style={grid}>
        <div><label style={lbl}>N. DOCUMENTO</label><input ref={rDocNum} defaultValue="" placeholder="NDA-2025-001" style={inp}/></div>
        <div><label style={lbl}>DATA</label><input ref={rDocDate} defaultValue={today} type="date" style={inp}/></div>
      </div></div>
      <div style={sec}><p style={d.docSectionLabel}>PARTE DIVULGANTE (chi condivide le info)</p><div style={grid}>
        <div><label style={lbl}>NOME / AZIENDA</label><input ref={rParty1Name} defaultValue="" placeholder="Brand S.r.l." style={inp}/></div>
        <div><label style={lbl}>EMAIL</label><input ref={rParty1Email} defaultValue="" type="email" placeholder="email@brand.com" style={inp}/></div>
      </div></div>
      <div style={sec}><p style={d.docSectionLabel}>PARTE RICEVENTE (creativo)</p><div style={grid}>
        <div><label style={lbl}>NOME</label><input ref={rParty2Name} defaultValue="" placeholder="Nome Cognome" style={inp}/></div>
        <div><label style={lbl}>EMAIL</label><input ref={rParty2Email} defaultValue="" type="email" placeholder="email@studio.com" style={inp}/></div>
      </div></div>
      <div style={sec}><p style={d.docSectionLabel}>PROGETTO</p><div style={grid}>
        <div style={{gridColumn:"span 2"}}><label style={lbl}>NOME PROGETTO</label><input ref={rProjectName} defaultValue="" placeholder="Campagna SS26" style={inp}/></div>
        <div style={{gridColumn:"span 2"}}><label style={lbl}>DESCRIZIONE COLLABORAZIONE</label><textarea ref={rProjectDesc} defaultValue="" rows={3} style={{...inp, resize:"vertical"}}/></div>
      </div></div>
      <div style={sec}><p style={d.docSectionLabel}>CONDIZIONI</p><div style={grid}>
        <div><label style={lbl}>DURATA RISERVATEZZA (anni)</label><input ref={rDuration} defaultValue="2" style={inp}/></div>
        <div><label style={lbl}>FORO COMPETENTE</label><input ref={rJurisdiction} defaultValue="Firenze" style={inp}/></div>
      </div></div>
      <div style={sec}><p style={d.docSectionLabel}>NOTE</p>
        <textarea ref={rNotes} defaultValue="" rows={3} style={{...inp, width:"100%", resize:"vertical"}} placeholder="Note aggiuntive..."/>
      </div>
      <button onClick={generatePDF} style={{...d.btnPrimary, marginTop:8}}>↓ GENERA E STAMPA PDF</button>
    </div>
  );
}

// ── 04 · Image Licensing ─────────────────────────────────────────
function ImageLicensing({ creatives }) {
  const [today, setToday] = useState("");
  useEffect(() => { setToday(new Date().toISOString().split("T")[0]); }, []);

  const rDocNum = useRef(null); const rDocDate = useRef(null);
  const rTalentName = useRef(null); const rTalentEmail = useRef(null);
  const rClientName = useRef(null); const rClientEmail = useRef(null);
  const rProjectName = useRef(null); const rContentDesc = useRef(null);
  const rShootDate = useRef(null); const rFileCount = useRef(null); const rFileFormats = useRef(null);
  const rUsageMedia = useRef(null); const rTerritory = useRef(null); const rDuration = useRef(null);
  const rExclusivity = useRef(null); const rLicenseFee = useRef(null); const rPaymentDue = useRef(null);
  const rJurisdiction = useRef(null); const rNotes = useRef(null);

  const g = (ref) => ref?.current?.value || "";

  const handleCreativeSelect = (id) => {
    if (!id) return;
    const c = creatives.find((x) => x.id === id);
    if (c && rTalentName.current) rTalentName.current.value = c.nome || "";
  };

  const generatePDF = () => {
    const html = pdfHeader("Image Licensing Agreement", g(rDocNum) || "LIC-", fmtDate(g(rDocDate))) + `
      <div class="sec"><div class="sec-label">Parti</div><div class="grid">
        ${pdfField("Licenziante (Creativo)", g(rTalentName))}${pdfField("Email creativo", g(rTalentEmail))}
        ${pdfField("Licenziatario (Cliente)", g(rClientName))}${pdfField("Email cliente", g(rClientEmail))}
      </div></div>
      <div class="sec"><div class="sec-label">Materiale Licenziato</div><div class="grid">
        ${pdfField("Progetto", g(rProjectName))}${pdfField("Data produzione", fmtDate(g(rShootDate)))}
        <div style="grid-column:span 2">${pdfField("Descrizione contenuto", g(rContentDesc))}</div>
        ${pdfField("N. file", g(rFileCount))}${pdfField("Formati", g(rFileFormats))}
      </div></div>
      <div class="sec"><div class="sec-label">Termini di Utilizzo</div><div class="grid">
        <div style="grid-column:span 2">${pdfField("Media / Canali", g(rUsageMedia))}</div>
        ${pdfField("Territorio", g(rTerritory))}${pdfField("Durata", g(rDuration))}
        ${pdfField("Esclusiva", g(rExclusivity) || "No")}
      </div></div>
      <div class="sec"><div class="sec-label">Corrispettivo</div>
        <div class="fee-box">
          <div class="fee-row"><span>Fee licenza</span><span>€ ${g(rLicenseFee) || "—"}</span></div>
          <div class="fee-row"><span>Scadenza pagamento</span><span>${fmtDate(g(rPaymentDue))}</span></div>
        </div>
      </div>
      <div class="grid" style="margin-bottom:28px">${pdfField("Foro competente", g(rJurisdiction) || "Firenze")}</div>
      ${g(rNotes) ? `<div class="sec"><div class="sec-label">Note</div><p style="font-size:14px">${g(rNotes)}</p></div>` : ""}
      <div class="sign-row">
        <div><div class="fl">${g(rTalentName) || "Creativo"}</div><div class="sign-line">Firma e data</div></div>
        <div><div class="fl">${g(rClientName) || "Cliente"}</div><div class="sign-line">Firma e data</div></div>
      </div>
      <div class="footer">the[name] · info.findthename@gmail.com</div></body></html>`;
    const win = window.open("", "_blank"); win.document.write(html); win.document.close(); setTimeout(() => win.print(), 500);
  };

  const inp = { width: "100%", padding: "10px 12px", background: "#1a1714", border: "1px solid #2a2520", color: "#f5f0eb", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", borderRadius: 2 };
  const lbl = { fontSize: 9, letterSpacing: "1px", textTransform: "uppercase", color: "#7a7068", display: "block", marginBottom: 6 };
  const sec = { marginBottom: 32, paddingBottom: 32, borderBottom: "1px solid #1e1c1a" };
  const grid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 };

  return (
    <div style={d.docWrap}>
      <p style={d.docDesc}>Licenza di utilizzo immagini e contenuti prodotti dai creativi</p>
      <div style={sec}><p style={d.docSectionLabel}>AUTO-COMPILA DA CREATIVO NEL NETWORK</p>
        <select onChange={(e) => handleCreativeSelect(e.target.value)} style={d.docSelect} defaultValue="">
          <option value="">-- Seleziona creativo (licenziante) --</option>
          {creatives.map((c) => <option key={c.id} value={c.id}>{c.nome} · {c.ruolo}</option>)}
        </select>
      </div>
      <div style={sec}><p style={d.docSectionLabel}>INTESTAZIONE</p><div style={grid}>
        <div><label style={lbl}>N. LICENZA</label><input ref={rDocNum} defaultValue="" placeholder="LIC-2025-001" style={inp}/></div>
        <div><label style={lbl}>DATA</label><input ref={rDocDate} defaultValue={today} type="date" style={inp}/></div>
      </div></div>
      <div style={sec}><p style={d.docSectionLabel}>LICENZIANTE (CREATIVO)</p><div style={grid}>
        <div><label style={lbl}>NOME</label><input ref={rTalentName} defaultValue="" placeholder="Nome Cognome" style={inp}/></div>
        <div><label style={lbl}>EMAIL</label><input ref={rTalentEmail} defaultValue="" type="email" placeholder="email@creativo.com" style={inp}/></div>
      </div></div>
      <div style={sec}><p style={d.docSectionLabel}>LICENZIATARIO (CLIENTE)</p><div style={grid}>
        <div><label style={lbl}>NOME / AZIENDA</label><input ref={rClientName} defaultValue="" placeholder="Brand S.r.l." style={inp}/></div>
        <div><label style={lbl}>EMAIL</label><input ref={rClientEmail} defaultValue="" type="email" placeholder="email@brand.com" style={inp}/></div>
      </div></div>
      <div style={sec}><p style={d.docSectionLabel}>MATERIALE LICENZIATO</p><div style={grid}>
        <div><label style={lbl}>NOME PROGETTO</label><input ref={rProjectName} defaultValue="" placeholder="Campagna SS26" style={inp}/></div>
        <div><label style={lbl}>DATA PRODUZIONE</label><input ref={rShootDate} defaultValue="" type="date" style={inp}/></div>
        <div style={{gridColumn:"span 2"}}><label style={lbl}>DESCRIZIONE CONTENUTO</label><textarea ref={rContentDesc} defaultValue="" rows={3} style={{...inp, resize:"vertical"}}/></div>
        <div><label style={lbl}>NUMERO FILE</label><input ref={rFileCount} defaultValue="" placeholder="Es. 30" style={inp}/></div>
        <div><label style={lbl}>FORMATI</label><input ref={rFileFormats} defaultValue="" placeholder="JPG, TIFF, RAW" style={inp}/></div>
      </div></div>
      <div style={sec}><p style={d.docSectionLabel}>TERMINI DI UTILIZZO</p><div style={grid}>
        <div style={{gridColumn:"span 2"}}><label style={lbl}>MEDIA / CANALI</label><input ref={rUsageMedia} defaultValue="" placeholder="Social, Web, Stampa" style={inp}/></div>
        <div><label style={lbl}>TERRITORIO</label><input ref={rTerritory} defaultValue="" placeholder="Italia" style={inp}/></div>
        <div><label style={lbl}>DURATA</label><input ref={rDuration} defaultValue="" placeholder="12 mesi" style={inp}/></div>
        <div><label style={lbl}>ESCLUSIVA</label>
          <select ref={rExclusivity} defaultValue="No" style={{...inp, cursor:"pointer"}}>
            <option value="No">No</option><option value="Si">Si</option>
          </select>
        </div>
      </div></div>
      <div style={sec}><p style={d.docSectionLabel}>CORRISPETTIVO</p><div style={grid}>
        <div><label style={lbl}>FEE LICENZA (€)</label><input ref={rLicenseFee} defaultValue="" placeholder="Es. 2000" style={inp}/></div>
        <div><label style={lbl}>SCADENZA PAGAMENTO</label><input ref={rPaymentDue} defaultValue="" type="date" style={inp}/></div>
        <div><label style={lbl}>FORO COMPETENTE</label><input ref={rJurisdiction} defaultValue="Firenze" style={inp}/></div>
      </div></div>
      <div style={sec}><p style={d.docSectionLabel}>NOTE</p>
        <textarea ref={rNotes} defaultValue="" rows={3} style={{...inp, width:"100%", resize:"vertical"}} placeholder="Note aggiuntive..."/>
      </div>
      <button onClick={generatePDF} style={{...d.btnPrimary, marginTop:8}}>↓ GENERA E STAMPA PDF</button>
    </div>
  );
}

function CreativeEditModal({ creative, onClose, onSaved }) {
  const isNew = !creative;
  const [form, setForm] = useState({
    nome: creative?.nome || "",
    ruolo: creative?.ruolo || "",
    citta: creative?.citta || "",
    bio: creative?.bio || "",
    portfolio: creative?.portfolio || "",
    foto_url: creative?.foto_url || "",
    availability: creative?.availability || "available",
    visible: creative?.visible ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const save = async () => {
    if (!form.nome || !form.ruolo) { setError("Nome e ruolo sono obbligatori."); return; }
    setSaving(true);
    setError(null);
    const payload = { ...form, tags: [form.ruolo] };
    const res = await fetch("/api/creatives", {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(isNew ? payload : { ...payload, id: creative.id }),
    });
    const json = await res.json();
    if (!res.ok) { setError(json.error || "Errore durante il salvataggio."); setSaving(false); return; }
    setSaving(false);
    onSaved();
  };

  return (
    <div style={d.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={d.modal}>
        <button onClick={onClose} style={d.closeBtn}>✕</button>
        <h2 style={d.modalTitle}>{isNew ? "Nuovo creativo" : `Modifica — ${creative.nome}`}</h2>
        <div style={d.formGrid}>
          <MField label="Nome *" value={form.nome} onChange={(v) => set("nome", v)} />
          <div>
            <label style={d.label}>Ruolo *</label>
            <select value={form.ruolo} onChange={(e) => set("ruolo", e.target.value)} style={d.input}>
              <option value="">Seleziona ruolo</option>
              {RUOLI.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <MField label="Città" value={form.citta} onChange={(v) => set("citta", v)} />
          <div>
            <label style={d.label}>Disponibilità</label>
            <select value={form.availability} onChange={(e) => set("availability", e.target.value)} style={d.input}>
              <option value="available">Disponibile</option>
              <option value="unavailable">Non disponibile</option>
            </select>
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <label style={d.label}>Bio</label>
            <textarea value={form.bio} onChange={(e) => set("bio", e.target.value)} rows={3} style={{ ...d.input, resize: "vertical" }} />
          </div>
          <MField label="Portfolio URL" value={form.portfolio} onChange={(v) => set("portfolio", v)} span={2} />
          <MField label="Foto URL" value={form.foto_url} onChange={(v) => set("foto_url", v)} span={2} />
          <div>
            <label style={d.label}>Visibile</label>
            <select value={form.visible ? "yes" : "no"} onChange={(e) => set("visible", e.target.value === "yes")} style={d.input}>
              <option value="yes">Sì</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>
        {error && <p style={d.errorText}>{error}</p>}
        <button onClick={save} disabled={saving} style={{ ...d.btnPrimary, width: "100%", marginTop: 20 }}>
          {saving ? "Salvataggio…" : isNew ? "Crea creativo" : "Salva modifiche"}
        </button>
      </div>
    </div>
  );
}

// ── Componenti piccoli ───────────────────────────────────────────
function SectionTitle({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 32, fontWeight: 300, color: "#f5f0eb", margin: "0 0 4px" }}>{title}</h2>
      <p style={{ fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", color: "#7a7068", margin: 0 }}>{subtitle}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending:  { label: "In attesa", bg: "#3a2f00", color: "#c8d622" },
    approved: { label: "Approvata", bg: "#0a2a1e", color: "#4ade80" },
    rejected: { label: "Rifiutata", bg: "#2a0a0a", color: "#f87171" },
    new:      { label: "Nuova",     bg: "#0a1a2a", color: "#60a5fa" },
    handled:  { label: "Gestita",   bg: "#1a1a1a", color: "#6b7280" },
  };
  const cfg = map[status] || map.pending;
  return <span style={{ fontSize: 10, letterSpacing: 1, padding: "3px 10px", borderRadius: 99, background: cfg.bg, color: cfg.color, fontWeight: 500 }}>{cfg.label}</span>;
}

function Chip({ label, color }) {
  return <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 99, border: `1px solid ${color}33`, color, letterSpacing: 1 }}>{label}</span>;
}

function Detail({ label, value, span = 1 }) {
  return (
    <div style={{ gridColumn: `span ${span}` }}>
      <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "1px", color: "#7a7068", margin: "0 0 3px" }}>{label}</p>
      <p style={{ fontSize: 13, color: "#e8e0d8", margin: 0 }}>{value || "—"}</p>
    </div>
  );
}

function DocField({ label, value, onChange, type = "text", span = 1 }) {
  return (
    <div style={{ gridColumn: `span ${span}` }}>
      <label style={{ fontSize: 9, letterSpacing: "1px", textTransform: "uppercase", color: "#7a7068", display: "block", marginBottom: 6 }}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} style={d.docInput} />
    </div>
  );
}

function MField({ label, value, onChange, span = 1 }) {
  return (
    <div style={{ gridColumn: `span ${span}` }}>
      <label style={d.label}>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} style={d.input} />
    </div>
  );
}

function AvatarFallback({ name, small }) {
  const size = small ? 28 : 36;
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "#1a2a1a", color: "#c8d622", display: "flex", alignItems: "center", justifyContent: "center", fontSize: small ? 10 : 12, fontWeight: 600, flexShrink: 0 }}>
      {(name || "?").slice(0, 2).toUpperCase()}
    </div>
  );
}

function Loading() {
  return <p style={{ fontSize: 13, color: "#7a7068", textAlign: "center", padding: "2rem" }}>Caricamento…</p>;
}

function EmptyBox({ text }) {
  return (
    <div style={{ textAlign: "center", padding: "3rem", border: "1px dashed #2a2a2a", borderRadius: 8 }}>
      <p style={{ fontSize: 13, color: "#7a7068", margin: 0 }}>{text}</p>
    </div>
  );
}

function ComingSoon({ label }) {
  return (
    <div style={{ textAlign: "center", padding: "4rem 2rem", border: "1px dashed #2a2a2a", borderRadius: 8 }}>
      <p style={{ fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", color: "#7a7068", margin: "0 0 8px" }}>Prossimamente</p>
      <p style={{ fontSize: 18, fontFamily: "Georgia, serif", fontStyle: "italic", color: "#f5f0eb", margin: 0 }}>{label}</p>
    </div>
  );
}

// ── Stili dark theme ─────────────────────────────────────────────
const d = {
  loginWrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0d0b0a" },
  loginBox: { background: "#141210", padding: "2.5rem", borderRadius: 4, width: 360, border: "1px solid #2a2520" },
  loginLogo: { fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 300, fontStyle: "italic", color: "#f5f0eb", marginBottom: 4 },
  loginSub: { fontSize: 9, letterSpacing: "2px", textTransform: "uppercase", color: "#7a7068", marginBottom: 32 },

  wrap: { minHeight: "100vh", background: "#0d0b0a", color: "#f5f0eb" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 48px", borderBottom: "1px solid #1e1c1a" },
  topBarLogo: { display: "flex", alignItems: "baseline", gap: 0 },
  logoItalic: { fontFamily: "Georgia, serif", fontSize: 20, fontStyle: "italic", fontWeight: 300, color: "#f5f0eb" },
  logoDot: { color: "#7a7068" },
  logoAdmin: { fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "#7a7068" },
  logoutBtn: { fontSize: 10, letterSpacing: "1px", textTransform: "uppercase", color: "#7a7068", background: "none", border: "none", cursor: "pointer" },

  tabs: { display: "flex", gap: 0, borderBottom: "1px solid #1e1c1a", padding: "0 48px" },
  tabBtn: { padding: "16px 24px", border: "none", background: "none", fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", color: "#7a7068", cursor: "pointer", borderBottom: "2px solid transparent", marginBottom: -1 },
  tabActive: { color: "#f5f0eb", borderBottomColor: "#c8d622" },

  content: { padding: "40px 48px", maxWidth: 1100 },

  filterBar: { display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" },
  filterBtn: { padding: "6px 14px", borderRadius: 2, border: "1px solid #2a2520", background: "none", fontSize: 10, letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "#7a7068" },
  filterActive: { border: "1px solid #c8d622", color: "#c8d622" },
  filterCount: { background: "rgba(255,255,255,0.08)", borderRadius: 99, padding: "1px 6px", fontSize: 10 },

  list: { display: "flex", flexDirection: "column", gap: 1 },
  listItem: { border: "1px solid #1e1c1a", background: "#0f0d0c" },
  listItemHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", cursor: "pointer" },
  listItemLeft: { display: "flex", alignItems: "center", gap: 12 },
  listItemRight: { display: "flex", alignItems: "center", gap: 10, flexShrink: 0, flexWrap: "wrap" },
  listItemName: { fontSize: 14, fontWeight: 500, display: "block", color: "#f5f0eb" },
  listItemMeta: { fontSize: 11, color: "#7a7068", display: "block", marginTop: 2 },
  listItemBody: { padding: "0 20px 20px", borderTop: "1px solid #1e1c1a" },
  detailGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px", margin: "16px 0" },
  actionRow: { display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap", alignItems: "center" },

  miniAvatar: { width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0 },
  chevron: { fontSize: 9, color: "#7a7068", marginLeft: 4 },
  linkBtn: { fontSize: 11, color: "#c8d622", textDecoration: "none", letterSpacing: "1px" },

  approveBtn: { padding: "8px 18px", border: "1px solid #c8d622", background: "none", color: "#c8d622", fontSize: 10, letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer" },
  rejectBtn: { padding: "8px 18px", border: "1px solid #f87171", background: "none", color: "#f87171", fontSize: 10, letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer" },
  editBtn: { padding: "5px 12px", border: "1px solid #2a2520", background: "none", fontSize: 10, letterSpacing: "1px", cursor: "pointer", color: "#7a7068" },
  toggleBtn: { padding: "5px 12px", border: "1px solid #2a2520", background: "none", fontSize: 10, letterSpacing: "1px", cursor: "pointer", color: "#7a7068" },
  emailBtn: { padding: "8px 18px", border: "1px solid #60a5fa", background: "none", color: "#60a5fa", fontSize: 10, letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer", textDecoration: "none" },

  matchBtn: { padding: "10px 20px", border: "1px solid #c8d622", background: "#c8d622", color: "#0d0b0a", fontSize: 10, letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer", fontWeight: 700 },
  matchResults: { marginTop: 20, padding: 16, background: "#0a0908", border: "1px solid #2a2520", borderRadius: 4 },
  matchResultsTitle: { fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", color: "#c8d622", margin: "0 0 12px" },
  matchCard: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#111", border: "1px solid #1e1c1a" },

  btnPrimary: { padding: "10px 24px", border: "1px solid #c8d622", background: "none", color: "#c8d622", fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" },
  btnSecondary: { padding: "8px 18px", border: "1px solid #2a2520", background: "none", color: "#7a7068", fontSize: 10, letterSpacing: "1px", cursor: "pointer" },

  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" },
  modal: { background: "#0f0d0c", border: "1px solid #2a2520", padding: "2rem", width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto", position: "relative" },
  closeBtn: { position: "absolute", top: 16, right: 16, background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#7a7068" },
  modalTitle: { fontSize: 16, fontWeight: 500, margin: "0 0 20px", color: "#f5f0eb" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  label: { fontSize: 10, letterSpacing: "1px", textTransform: "uppercase", color: "#7a7068", display: "block", marginBottom: 6 },
  input: { width: "100%", padding: "9px 12px", background: "#1a1714", border: "1px solid #2a2520", color: "#f5f0eb", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit" },
  errorText: { fontSize: 12, color: "#f87171", marginTop: 8 },

  docWrap: { maxWidth: 700 },
  docDesc: { fontSize: 12, color: "#7a7068", marginBottom: 32, letterSpacing: "0.5px" },
  docTabs: { display: "flex", gap: 8, marginBottom: 40, flexWrap: "wrap" },
  docTabBtn: { padding: "10px 20px", border: "1px solid #2a2520", background: "none", color: "#7a7068", fontSize: 10, letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer" },
  docTabActive: { border: "1px solid #c8d622", color: "#c8d622" },
  docSection: { marginBottom: 32, paddingBottom: 32, borderBottom: "1px solid #1e1c1a" },
  docSectionLabel: { fontSize: 9, letterSpacing: "2px", textTransform: "uppercase", color: "#7a7068", marginBottom: 16 },
  docGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
  docSelect: { width: "100%", padding: "12px 16px", background: "#1a1714", border: "1px solid #2a2520", color: "#f5f0eb", fontSize: 13, outline: "none", cursor: "pointer" },
  docInput: { width: "100%", padding: "10px 12px", background: "#1a1714", border: "1px solid #2a2520", color: "#f5f0eb", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", borderRadius: 2 },
};
