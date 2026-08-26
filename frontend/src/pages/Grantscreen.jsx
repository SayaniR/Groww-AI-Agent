import React, { useState, useRef } from "react";
import { Check, X, Plus, Clock3, Sparkles } from "lucide-react";

// ---- Groww brand token system ----
const C = {
  primary: "#00D09C", // Groww Green (official)
  primarySoft: "#E3FBF3",
  primarySoftBorder: "#00D09C",
  ink: "#000000", // body/label/value text stays black
  slate: "#6B7280",
  slateLight: "#9AA1A9",
  border: "#E3E6E8",
  chipBorder: "#D8DBDD",
  bgSection: "#FFFFFF",
};

// Headlines / Display
const FONT_DISPLAY = "'Inter Tight', -apple-system, BlinkMacSystemFont, sans-serif";
// Body / Interface — Roboto on Android, system default on iOS
const FONT =
  "Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

function formatINR(n) {
  if (n === "" || n === null || n === undefined) return "";
  const num = Number(n);
  if (Number.isNaN(num)) return "";
  return num.toLocaleString("en-IN");
}

function Chip({ label, checked, onToggle, onRemove, tone = "granted" }) {
  const isGranted = tone === "granted";
  const activeBg = isGranted ? C.primary : "#F2F3F4";
  const activeBorder = isGranted ? C.primary : "#000000";
  const activeText = isGranted ? "#FFFFFF" : "#000000";
  const inactiveText = C.slateLight;

  return (
    <button
      onClick={onToggle}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 12px",
        borderRadius: 999,
        border: `1.5px solid ${checked ? activeBorder : C.border}`,
        background: checked ? activeBg : "#FFFFFF",
        color: checked ? activeText : inactiveText,
        fontSize: 13,
        fontWeight: 600,
        whiteSpace: "nowrap",
        transition: "all 120ms ease",
        cursor: "pointer",
      }}
    >
      {checked ? (
        isGranted ? (
          <Check size={14} strokeWidth={3} />
        ) : (
          <Clock3 size={14} strokeWidth={2.5} />
        )
      ) : (
        <Plus size={14} strokeWidth={2.5} />
      )}
      <span>{label}</span>
      {onRemove && checked && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          style={{
            marginLeft: 2,
            opacity: 0.85,
            display: "inline-flex",
          }}
        >
          <X size={13} strokeWidth={2.5} />
        </span>
      )}
    </button>
  );
}

function TagInput({ placeholder, onAdd, accent }) {
  const [val, setVal] = useState("");
  const ref = useRef(null);
  const submit = () => {
    const v = val.trim();
    if (!v) return;
    onAdd(v);
    setVal("");
    ref.current?.focus();
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        border: `1.5px solid ${C.border}`,
        borderRadius: 10,
        background: C.bgSection,
        padding: "10px 12px",
      }}
    >
      <input
        ref={ref}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder={placeholder}
        style={{
          flex: 1,
          border: "none",
          outline: "none",
          background: "transparent",
          fontSize: 13.5,
          color: C.ink,
          fontFamily: FONT,
        }}
      />
      <button
        onClick={submit}
        style={{
          border: "none",
          background: val.trim() ? accent : C.border,
          color: "#fff",
          borderRadius: 8,
          padding: "6px 10px",
          fontSize: 12.5,
          fontWeight: 700,
          cursor: val.trim() ? "pointer" : "default",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <Plus size={13} strokeWidth={3} />
        Add
      </button>
    </div>
  );
}

function SectionLabel({ title, sub }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 14.5, fontWeight: 700, color: C.ink }}>
        {title}
      </div>
      {sub && (
        <div style={{ fontSize: 12.5, color: C.slate, marginTop: 2 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export default function GrantScreen() {
  const [goal, setGoal] = useState(
    "Build my portfolio toward long-term growth."
  );
  const [risk, setRisk] = useState("Moderate");
  const [amount, setAmount] = useState(50000);
  const [horizon, setHorizon] = useState("Long-term");

  const [granted, setGranted] = useState([
    { label: "Research stocks", checked: true },
    { label: "Compare stocks", checked: true },
    { label: "Analyze my portfolio", checked: true },
    { label: "Select investments", checked: true },
    { label: "Buy stocks (≤ ₹5,000/order)", checked: true },
    { label: "Rebalance allocation", checked: true },
  ]);

  const [restricted, setRestricted] = useState([
    { label: "Sell existing holdings", checked: true },
    { label: "Orders above ₹5,000", checked: true },
    { label: "Exceed daily ₹20,000 cap", checked: true },
    { label: "Change my rules", checked: true },
  ]);

  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggle = (list, setList, idx) =>
    setList(
      list.map((t, i) => (i === idx ? { ...t, checked: !t.checked } : t))
    );

  const addTag = (list, setList, label, tone) =>
    setList([...list, { label, checked: true, custom: true }]);

  const removeTag = (list, setList, idx) =>
    setList(list.filter((_, i) => i !== idx));

  const risks = ["Low", "Moderate", "High"];
  const horizons = [
    { key: "Short-term", sub: "< 1 yr" },
    { key: "Medium-term", sub: "1–3 yrs" },
    { key: "Long-term", sub: "3+ yrs" },
  ];

  const quickAdds = [5000, 10000, 50000];

  const activeGranted = granted.filter((g) => g.checked);
  const activeRestricted = restricted.filter((r) => r.checked);

  const canSubmit =
    goal.trim().length > 0 && Number(amount) > 0 && confirmed;

  return (
    <div
      style={{
        fontFamily: FONT,
        width: "100%",
        height: "100%",
        overflowY: "auto",
        background: "#FFFFFF",
        padding: "0 20px 24px 20px",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800&display=swap');
      `}</style>
      
          <div
            style={{
              padding: "10px 0 0 0",
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11,
              color: C.slateLight,
              fontWeight: 600,
            }}
          >
            <span>9:41</span>
            <span>●●●●</span>
          </div>

          {/* header */}
          <div style={{ padding: "14px 0 16px 0" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: C.primarySoft,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Sparkles size={16} color={C.primary} strokeWidth={2.2} />
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: C.slate }}>
                GROWW AGENT
              </span>
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#000000",
                fontFamily: FONT_DISPLAY,
              }}
            >
              Give your agent a job
            </div>
            <div style={{ fontSize: 13, color: C.slate, marginTop: 4 }}>
              Set the goal and the boundaries. You can change these anytime.
            </div>
          </div>
          {/* Goal */}
          <div style={{ marginBottom: 20 }}>
            <SectionLabel title="What's the goal?" />
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              rows={2}
              placeholder="e.g. Build my portfolio toward long-term growth"
              style={{
                width: "100%",
                resize: "none",
                border: `1.5px solid ${C.border}`,
                borderRadius: 12,
                padding: "12px 14px",
                fontSize: 14,
                color: C.ink,
                fontFamily: FONT,
                outline: "none",
                boxSizing: "border-box",
                lineHeight: 1.4,
              }}
              onFocus={(e) => (e.target.style.borderColor = C.primary)}
              onBlur={(e) => (e.target.style.borderColor = C.border)}
            />
          </div>

          {/* Risk */}
          <div style={{ marginBottom: 20 }}>
            <SectionLabel title="Risk category" />
            <div style={{ display: "flex", gap: 8 }}>
              {risks.map((r) => (
                <button
                  key={r}
                  onClick={() => setRisk(r)}
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    borderRadius: 10,
                    border: `1.5px solid ${
                      risk === r ? C.primary : C.border
                    }`,
                    background: risk === r ? C.primarySoft : "#fff",
                    color: "#000000",
                    fontWeight: 700,
                    fontSize: 13.5,
                    cursor: "pointer",
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div style={{ marginBottom: 20 }}>
            <SectionLabel title="Amount to invest" />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "18px 14px",
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  fontSize: 30,
                  fontWeight: 700,
                  color: "#000000",
                  marginRight: 6,
                  fontFamily: FONT_DISPLAY,
                }}
              >
                ₹
              </span>
              <input
                value={amount === "" ? "" : formatINR(amount)}
                onChange={(e) => {
                  const digits = e.target.value.replace(/[^0-9]/g, "");
                  setAmount(digits === "" ? "" : Number(digits));
                }}
                placeholder="0"
                inputMode="numeric"
                style={{
                  width: "100%",
                  textAlign: "center",
                  border: "none",
                  outline: "none",
                  fontSize: 30,
                  fontWeight: 700,
                  color: "#000000",
                  fontFamily: FONT_DISPLAY,
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              {quickAdds.map((q) => (
                <button
                  key={q}
                  onClick={() => setAmount((prev) => (Number(prev) || 0) + q)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 999,
                    border: `1px solid ${C.chipBorder}`,
                    background: "#FFFFFF",
                    color: "#000000",
                    fontWeight: 600,
                    fontSize: 13.5,
                    cursor: "pointer",
                  }}
                >
                  + ₹{q.toLocaleString("en-IN")}
                </button>
              ))}
            </div>
          </div>

          {/* Time horizon */}
          <div style={{ marginBottom: 22 }}>
            <SectionLabel title="Time horizon" />
            <div style={{ display: "flex", gap: 8 }}>
              {horizons.map((h) => (
                <button
                  key={h.key}
                  onClick={() => setHorizon(h.key)}
                  style={{
                    flex: 1,
                    padding: "10px 4px",
                    borderRadius: 10,
                    border: `1.5px solid ${
                      horizon === h.key ? C.primary : C.border
                    }`,
                    background: horizon === h.key ? C.primarySoft : "#fff",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: "#000000",
                    }}
                  >
                    {h.key}
                  </div>
                  <div style={{ fontSize: 10.5, color: C.slate }}>
                    {h.sub}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div
            style={{ height: 1, background: C.border, margin: "4px 0 20px" }}
          />

          {/* Agent can */}
          <div style={{ marginBottom: 22 }}>
            <SectionLabel
              title="Agent can do this on its own"
              sub="Tap to include or remove a permission."
            />
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 10,
              }}
            >
              {granted.map((t, i) => (
                <Chip
                  key={t.label}
                  label={t.label}
                  checked={t.checked}
                  tone="granted"
                  onToggle={() => toggle(granted, setGranted, i)}
                  onRemove={
                    t.custom ? () => removeTag(granted, setGranted, i) : null
                  }
                />
              ))}
            </div>
            <TagInput
              placeholder="Add a permission (ex: Buy ETFs)"
              accent={C.primary}
              onAdd={(v) => addTag(granted, setGranted, v)}
            />
          </div>

          {/* Needs approval */}
          <div style={{ marginBottom: 8 }}>
            <SectionLabel
              title="Needs your approval first"
              sub="The agent will always ask before doing these."
            />
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 10,
              }}
            >
              {restricted.map((t, i) => (
                <Chip
                  key={t.label}
                  label={t.label}
                  checked={t.checked}
                  tone="restricted"
                  onToggle={() => toggle(restricted, setRestricted, i)}
                  onRemove={
                    t.custom
                      ? () => removeTag(restricted, setRestricted, i)
                      : null
                  }
                />
              ))}
            </div>
            <TagInput
              placeholder="Add a rule (ex: Ask before ETFs)"
              accent="#000000"
              onAdd={(v) => addTag(restricted, setRestricted, v)}
            />
          </div>

          {/* Contract preview */}
          <div
            style={{
              marginTop: 22,
              background: "#FFFFFF",
              border: `1.5px solid ${C.border}`,
              borderRadius: 14,
              padding: 16,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.slate,
                letterSpacing: 0.3,
                marginBottom: 10,
              }}
            >
              DELEGATION CONTRACT PREVIEW
            </div>
            <Row label="Goal" value={goal || "—"} />
            <Row
              label="Budget"
              value={amount ? `₹${formatINR(amount)}` : "—"}
            />
            <Row label="Risk" value={risk} />
            <Row label="Horizon" value={horizon} />
            

            {/* Confirmation checkbox */}
            <div
              onClick={() => setConfirmed((v) => !v)}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                paddingTop: 14,
                borderTop: `1px solid ${C.border}`,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  minWidth: 20,
                  borderRadius: 5,
                  marginTop: 1,
                  background: confirmed ? C.primary : "#FFFFFF",
                  border: `1.5px solid ${
                    confirmed ? C.primary : C.chipBorder
                  }`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {confirmed && (
                  <Check size={13} color="#FFFFFF" strokeWidth={3.2} />
                )}
              </div>
              <span style={{ fontSize: 12.5, color: "#000000", lineHeight: 1.4 }}>
                I've reviewed these goals, limits and permissions, and I
                authorize the agent to act within them.
              </span>
            </div>
          </div>

          {/* CTA */}
          <div
            style={{
              marginTop: 20,
              paddingTop: 16,
              borderTop: `1px solid ${C.border}`,
            }}
          >
            {submitted ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "14px 0",
                  borderRadius: 14,
                  background: C.primarySoft,
                  color: "#000000",
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                <Check size={16} strokeWidth={3} />
                Access granted — agent is starting
              </div>
            ) : (
              <button
                disabled={!canSubmit}
                onClick={() => setSubmitted(true)}
                style={{
                  width: "100%",
                  padding: "14px 0",
                  borderRadius: 14,
                  border: "none",
                  background: canSubmit ? C.primary : "#EFEFEF",
                  color: canSubmit ? "#FFFFFF" : "#B7BABD",
                  fontWeight: 700,
                  fontSize: 15,
                  fontFamily: FONT,
                  cursor: canSubmit ? "pointer" : "default",
                }}
              >
                Grant access
              </button>
            )}
          </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        fontSize: 12.5,
        padding: "4px 0",
      }}
    >
      <span style={{ color: "#6B7280" }}>{label}</span>
      <span
        style={{
          color: "#1B1D1F",
          fontWeight: 600,
          textAlign: "right",
          maxWidth: "70%",
        }}
      >
        {value}
      </span>
    </div>
  );
}