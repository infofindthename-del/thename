"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const RUOLI = [
  "Art Director", "Photographer", "Model", "Graphic Designer", "AI Artist",
  "Make-up Artist", "Screenwriter", "Event Planner", "Illustrator",
  "Fashion Stylist", "Videomaker", "Fashion Designer", "Digital Artist",
  "Creative Producer", "Casting Director", "Copywriter", "Set Designer",
  "Content Creator / Social Media Manager",
];

// ── Componente principale ────────────────────────────────────────
export default function CreativeMatch() {
  const [selected, setSelected] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeCreative, setActiveCreative] = useState(null);

  const toggle = (ruolo) =>
    setSelected((prev) =>
      prev.includes(ruolo) ? prev.filter((r) => r !== ruolo) : [...prev, ruolo]
    );

  const cerca = async () => {
    if (selected.length === 0) return;
    setLoading(true);
    setSearched(true);

    // Cerca per ruolo (campo affidabile) invece dei tags inconsistenti
    const { data, error } = await supabase
      .from("creatives")
      .select("id, nome, ruolo, citta, bio, tags, foto_url, availability, portfolio")
      .eq("visible", true)
      .in("ruolo", selected);

    if (error) {
      console.error("Errore Supabase:", error);
      setResults([]);
    } else {
      // Ordina: disponibili prima, poi per nome
      const sorted = (data || []).sort((a, b) => {
        if (a.availability === "available" && b.availability !== "available") return -1;
        if (b.availability === "available" && a.availability !== "available") return 1;
        return (a.nome || "").localeCompare(b.nome || "");
      });
      setResults(sorted);
    }
    setLoading(false);
  };

  const reset = () => {
    setSelected([]);
    setResults([]);
    setSearched(false);
    setShowForm(false);
    setActiveCreative(null);
  };

  const openForm = (creative = null) => {
    setActiveCreative(creative);
    setShowForm(true);
  };

  return (
    <div style={styles.wrap}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Trova il creativo giusto</h1>
        <p style={styles.subtitle}>Seleziona uno o più ruoli per il tuo progetto</p>
      </div>

      {/* Selezione ruoli */}
      <div style={styles.tagsWrap}>
        {RUOLI.map((ruolo) => (
          <button
            key={ruolo}
            onClick={() => toggle(ruolo)}
            style={{ ...styles.tag, ...(selected.includes(ruolo) ? styles.tagActive : {}) }}
          >
            {ruolo}
          </button>
        ))}
      </div>

      {/* Azioni */}
      <div style={styles.actions}>
        <button
          onClick={cerca}
          disabled={selected.length === 0 || loading}
          style={{ ...styles.btnPrimary, opacity: selected.length === 0 ? 0.4 : 1 }}
        >
          {loading ? "Ricerca in corso…" : `Cerca creativo${selected.length > 1 ? "i" : ""}`}
        </button>
        {searched && (
          <button onClick={reset} style={styles.btnSecondary}>Ricomincia</button>
        )}
      </div>

      {/* Risultati */}
      {searched && !loading && (
        <div style={styles.resultsSection}>
          {results.length === 0 ? (
            <div style={styles.empty}>
              <p style={styles.emptyTitle}>Nessun creativo trovato</p>
              <p style={styles.emptyText}>
                Prova a selezionare ruoli diversi o{" "}
                <span
                  onClick={() => openForm()}
                  style={{ color: "#0F6E56", cursor: "pointer", textDecoration: "underline" }}
                >
                  inviaci una richiesta
                </span>
                .
              </p>
            </div>
          ) : (
            <>
              <p style={styles.resultsLabel}>
                {results.length} creativ{results.length === 1 ? "o" : "i"} trovat{results.length === 1 ? "o" : "i"}
              </p>
              <div style={styles.grid}>
                {results.map((c, i) => (
                  <CreativeCard
                    key={c.id}
                    creative={c}
                    rank={i}
                    onContact={() => openForm(c)}
                  />
                ))}
              </div>

              {/* Richiesta generica */}
              <div style={styles.generalRequest}>
                <p style={styles.generalRequestText}>
                  Non trovi esattamente quello che cerchi?
                </p>
                <button onClick={() => openForm()} style={styles.btnSecondary}>
                  Invia una richiesta →
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Form modale */}
      {showForm && (
        <SeekerForm
          creative={activeCreative}
          selectedRoles={selected}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

// ── Card singolo creativo ────────────────────────────────────────
function CreativeCard({ creative, rank, onContact }) {
  const { nome, ruolo, citta, bio, foto_url, availability, portfolio } = creative;
  const initials = nome
    ? nome.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "??";
  const isTop = rank === 0;

  return (
    <div style={{ ...styles.card, ...(isTop ? styles.cardTop : {}) }}>
      {isTop && <div style={styles.badge}>Miglior match</div>}

      <div style={styles.cardHeader}>
        {foto_url ? (
          <img src={foto_url} alt={nome} style={styles.avatar} />
        ) : (
          <div style={styles.avatarFallback}>{initials}</div>
        )}
        <div style={{ flex: 1 }}>
          <p style={styles.cardName}>{nome}</p>
          <p style={styles.cardRole}>{ruolo}</p>
          {citta && <p style={styles.cardCity}>{citta}</p>}
        </div>
        <div style={styles.cardRight}>
          <span style={{
            ...styles.availability,
            background: availability === "available" ? "#E1F5EE" : "#F1EFE8",
            color: availability === "available" ? "#085041" : "#5F5E5A",
          }}>
            {availability === "available" ? "Disponibile" : "Non disponibile"}
          </span>
        </div>
      </div>

      {bio && <p style={styles.cardBio}>{bio}</p>}

      <div style={styles.cardFooter}>
        {portfolio && (
          <a
            href={portfolio}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.portfolioLink}
          >
            Portfolio →
          </a>
        )}
        <button onClick={onContact} style={styles.contactBtn}>
          Contatta
        </button>
      </div>
    </div>
  );
}

// ── Form richiesta seeker ────────────────────────────────────────
function SeekerForm({ creative, selectedRoles, onClose }) {
  const [form, setForm] = useState({
    nome: "", azienda: "", email: "",
    progetto: "", dateStart: "", dateEnd: "",
    budget: "", note: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const submit = async () => {
    if (!form.nome || !form.email || !form.azienda) {
      setError("Nome, azienda e email sono obbligatori.");
      return;
    }
    setLoading(true);
    setError(null);

    const payload = {
      ...form,
      cerca: creative
        ? `${creative.ruolo} — ${creative.nome}`
        : selectedRoles.join(", "),
      creative_id: creative?.id || null,
    };

    try {
      const res = await fetch("/api/seeker-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Errore nell'invio");
      setSent(true);
    } catch {
      setError("Errore nell'invio. Riprova o scrivici a info.findthename@gmail.com");
    }
    setLoading(false);
  };

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <button onClick={onClose} style={styles.closeBtn}>✕</button>

        {sent ? (
          <div style={styles.sentWrap}>
            <div style={styles.sentIcon}>✓</div>
            <h2 style={styles.sentTitle}>Richiesta inviata!</h2>
            <p style={styles.sentText}>
              Ti risponderemo entro 48 ore all'indirizzo <strong>{form.email}</strong>.
            </p>
            <button onClick={onClose} style={styles.btnPrimary}>Chiudi</button>
          </div>
        ) : (
          <>
            <h2 style={styles.modalTitle}>
              {creative ? `Contatta ${creative.nome}` : "Invia una richiesta"}
            </h2>
            {creative && (
              <p style={styles.modalSubtitle}>
                {creative.ruolo} · {creative.citta}
              </p>
            )}

            <div style={styles.formGrid}>
              <FormInput label="Nome *" value={form.nome} onChange={(v) => set("nome", v)} />
              <FormInput label="Azienda *" value={form.azienda} onChange={(v) => set("azienda", v)} />
              <FormInput label="Email *" type="email" value={form.email} onChange={(v) => set("email", v)} span={2} />
              <FormInput label="Tipo di progetto" value={form.progetto} onChange={(v) => set("progetto", v)} span={2} />
              <FormInput label="Data inizio" type="date" value={form.dateStart} onChange={(v) => set("dateStart", v)} />
              <FormInput label="Data fine" type="date" value={form.dateEnd} onChange={(v) => set("dateEnd", v)} />
              <FormInput label="Budget indicativo" value={form.budget} onChange={(v) => set("budget", v)} span={2} />
              <FormTextarea label="Note aggiuntive" value={form.note} onChange={(v) => set("note", v)} />
            </div>

            {error && <p style={styles.errorText}>{error}</p>}

            <button
              onClick={submit}
              disabled={loading}
              style={{ ...styles.btnPrimary, width: "100%", marginTop: 16 }}
            >
              {loading ? "Invio in corso…" : "Invia richiesta"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function FormInput({ label, value, onChange, type = "text", span = 1 }) {
  return (
    <div style={{ gridColumn: `span ${span}` }}>
      <label style={styles.label}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.input}
      />
    </div>
  );
}

function FormTextarea({ label, value, onChange }) {
  return (
    <div style={{ gridColumn: "span 2" }}>
      <label style={styles.label}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        style={{ ...styles.input, resize: "vertical" }}
      />
    </div>
  );
}

// ── Stili ────────────────────────────────────────────────────────
const styles = {
  wrap: { maxWidth: 800, margin: "0 auto", padding: "2rem 1rem", fontFamily: "inherit" },
  header: { marginBottom: "1.5rem" },
  title: { fontSize: 28, fontWeight: 600, margin: 0, marginBottom: 6 },
  subtitle: { fontSize: 15, color: "#6b7280", margin: 0 },
  tagsWrap: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "1.5rem" },
  tag: {
    padding: "8px 16px", borderRadius: 99, border: "1px solid #e5e7eb",
    background: "#fff", color: "#374151", fontSize: 13, fontWeight: 500, cursor: "pointer",
    transition: "all 0.15s",
  },
  tagActive: { background: "#0F6E56", borderColor: "#0F6E56", color: "#fff" },
  actions: { display: "flex", gap: 10, marginBottom: "2rem", alignItems: "center" },
  btnPrimary: {
    padding: "10px 24px", borderRadius: 8, border: "none", background: "#0F6E56",
    color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer",
  },
  btnSecondary: {
    padding: "10px 20px", borderRadius: 8, border: "1px solid #e5e7eb",
    background: "#fff", color: "#6b7280", fontSize: 14, cursor: "pointer",
  },
  resultsSection: { marginTop: "0.5rem" },
  resultsLabel: {
    fontSize: 12, fontWeight: 500, textTransform: "uppercase",
    letterSpacing: "0.06em", color: "#9ca3af", marginBottom: "1rem",
  },
  grid: { display: "flex", flexDirection: "column", gap: 12 },
  card: {
    border: "1px solid #e5e7eb", borderRadius: 12, padding: "1.25rem",
    background: "#fff", position: "relative",
  },
  cardTop: { borderColor: "#0F6E56", borderWidth: 1.5 },
  badge: {
    position: "absolute", top: -10, left: 16, background: "#0F6E56", color: "#fff",
    fontSize: 11, fontWeight: 500, padding: "2px 10px", borderRadius: 99,
  },
  cardHeader: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10 },
  avatar: { width: 48, height: 48, borderRadius: "50%", objectFit: "cover", flexShrink: 0 },
  avatarFallback: {
    width: 48, height: 48, borderRadius: "50%", background: "#E1F5EE", color: "#085041",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 14, fontWeight: 600, flexShrink: 0,
  },
  cardName: { fontSize: 15, fontWeight: 600, margin: 0, marginBottom: 2 },
  cardRole: { fontSize: 13, color: "#6b7280", margin: 0 },
  cardCity: { fontSize: 12, color: "#9ca3af", margin: 0, marginTop: 2 },
  cardRight: { marginLeft: "auto", flexShrink: 0 },
  availability: { fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 99 },
  cardBio: { fontSize: 13, color: "#4b5563", lineHeight: 1.6, margin: "0 0 10px" },
  cardFooter: { display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10, marginTop: 8 },
  portfolioLink: { fontSize: 13, color: "#0F6E56", textDecoration: "none" },
  contactBtn: {
    padding: "7px 18px", borderRadius: 7, border: "none", background: "#0F6E56",
    color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer",
  },
  generalRequest: {
    marginTop: 32, padding: "1.5rem", border: "1px dashed #e5e7eb", borderRadius: 12,
    display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
  },
  generalRequestText: { fontSize: 14, color: "#6b7280", margin: 0 },
  empty: { textAlign: "center", padding: "3rem 1rem", border: "1px dashed #e5e7eb", borderRadius: 12 },
  emptyTitle: { fontSize: 15, fontWeight: 500, margin: "0 0 6px" },
  emptyText: { fontSize: 13, color: "#9ca3af", margin: 0 },
  // Modal
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100,
    display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
  },
  modal: {
    background: "#fff", borderRadius: 16, padding: "2rem", width: "100%", maxWidth: 560,
    maxHeight: "90vh", overflowY: "auto", position: "relative",
  },
  closeBtn: {
    position: "absolute", top: 16, right: 16, background: "none", border: "none",
    fontSize: 18, cursor: "pointer", color: "#9ca3af",
  },
  modalTitle: { fontSize: 20, fontWeight: 600, margin: "0 0 4px" },
  modalSubtitle: { fontSize: 13, color: "#9ca3af", margin: "0 0 24px" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  label: { fontSize: 12, fontWeight: 500, color: "#374151", display: "block", marginBottom: 4 },
  input: {
    width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #e5e7eb",
    fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit",
  },
  errorText: { fontSize: 13, color: "#dc2626", marginTop: 8 },
  sentWrap: { textAlign: "center", padding: "2rem 1rem" },
  sentIcon: {
    width: 56, height: 56, borderRadius: "50%", background: "#E1F5EE", color: "#0F6E56",
    fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 16px",
  },
  sentTitle: { fontSize: 20, fontWeight: 600, margin: "0 0 8px" },
  sentText: { fontSize: 14, color: "#6b7280", margin: "0 0 24px" },
};
