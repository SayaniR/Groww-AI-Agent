import React, { useEffect, useState, useRef } from "react";
import { Check, X, Plus, Sparkles } from "lucide-react";

// ---- Groww brand token system ----
const C = {
  primary: "#00D09C",
  primaryHover: "#00B386",
  primarySoft: "#E3FBF3",
  primarySoftBorder: "#00D09C",
  ink: "#000000",
  slate: "#6B7280",
  slateLight: "#9AA1A9",
  border: "#E3E6E8",
  chipBorder: "#D8DBDD",
  bgSection: "#FFFFFF",
  sliderTrack: "#D1D5D7",
};

// Headlines / Display
const FONT_DISPLAY =
  "'Inter Tight', -apple-system, BlinkMacSystemFont, sans-serif";

// Body / Interface
const FONT =
  "Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

function formatINR(n) {
  if (n === "" || n === null || n === undefined) return "";

  const num = Number(n);

  if (Number.isNaN(num)) return "";

  return num.toLocaleString("en-IN");
}

function SegToggle({ value, onChange }) {
  const opts = [
    { key: "yes", label: "Yes" },
    { key: "no", label: "No" },
  ];

  return (
    <div
      style={{
        display: "inline-flex",
        border: `1.5px solid ${C.border}`,
        borderRadius: 999,
        padding: 2,
        gap: 2,
      }}
    >
      {opts.map((o) => {
        const active = value === o.key;

        const bg =
          o.key === "yes"
            ? C.primary
            : o.key === "ask"
              ? "#000000"
              : "#E9EBEC";

        const text = active
          ? o.key === "no"
            ? "#6B7280"
            : "#FFFFFF"
          : "#9AA1A9";

        return (
          <button
            key={o.key}
            onClick={() => onChange(o.key)}
            style={{
              border: "none",
              borderRadius: 999,
              padding: "5px 10px",
              fontSize: 11.5,
              fontWeight: 700,
              background: active ? bg : "transparent",
              color: text,
              cursor: "pointer",
              minWidth: 40,
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function PermissionRow({
  perm,
  onChangeState,
  onChangeThreshold,
  onToggleExpand,
  onRemove,
  maxThreshold,
}) {
  const showThresholdLine =
    perm.state === "yes" && perm.hasThreshold;

  const thresholdLabel =
    perm.thresholdType === "₹"
      ? perm.threshold === 0
        ? "Set spending limit"
        : `up to ₹${formatINR(perm.threshold)}`
      : perm.threshold === 0
        ? "Set limit"
        : `up to ${perm.threshold}%`;

  const isAtMax =
    maxThreshold !== Infinity &&
    perm.threshold >= maxThreshold;

  return (
    <div
      style={{
        border: `1.5px solid ${C.border}`,
        borderRadius: 12,
        padding: "12px 14px",
        marginBottom: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                fontSize: 13.5,
                fontWeight: 600,
                color: "#000000",
              }}
            >
              {perm.label}
            </span>

            {perm.custom && (
              <span
                onClick={onRemove}
                style={{
                  color: C.slateLight,
                  display: "inline-flex",
                  cursor: "pointer",
                }}
              >
                <X size={13} strokeWidth={2.5} />
              </span>
            )}
          </div>

          {showThresholdLine && (
            <button
              onClick={onToggleExpand}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginTop: 3,
                padding: 0,
                border: "none",
                background: "none",
                fontSize: 11.5,
                color: C.slate,
                cursor: "pointer",
              }}
            >
              {thresholdLabel}

              <span style={{ fontSize: 10 }}>
                {perm.expanded ? "▾" : "▸"}
              </span>
            </button>
          )}
        </div>

        <SegToggle
          value={perm.state}
          onChange={onChangeState}
        />
      </div>

      {showThresholdLine && perm.expanded && (
        <div
          style={{
            marginTop: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            background: C.bgSection,
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            padding: "8px 12px",
          }}
        >
          {/* Decrease */}
          <button
            onClick={() =>
              onChangeThreshold(
                Math.max(
                  perm.min,
                  perm.threshold - perm.step
                )
              )
            }
            disabled={perm.threshold <= perm.min}
            style={{
              width: 28,
              height: 28,
              borderRadius: 999,
              border: `1.5px solid ${C.border}`,
              background:
                perm.threshold <= perm.min
                  ? "#F5F5F5"
                  : "#fff",
              fontSize: 16,
              fontWeight: 700,
              cursor:
                perm.threshold <= perm.min
                  ? "default"
                  : "pointer",
              color:
                perm.threshold <= perm.min
                  ? "#B7BABD"
                  : "#000000",
            }}
          >
            −
          </button>

          {/* Current threshold */}
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#000000",
              minWidth: 90,
              textAlign: "center",
            }}
          >
            {perm.thresholdType === "₹"
              ? `₹${formatINR(perm.threshold)}`
              : `${perm.threshold}%`}
          </span>

          {/* Increase */}
          <button
            onClick={() => {
              const nextValue =
                perm.threshold + perm.step;

              onChangeThreshold(
                Math.min(nextValue, maxThreshold)
              );
            }}
            disabled={isAtMax}
            style={{
              width: 28,
              height: 28,
              borderRadius: 999,
              border: `1.5px solid ${C.border}`,
              background: isAtMax
                ? "#F5F5F5"
                : "#fff",
              fontSize: 16,
              fontWeight: 700,
              cursor: isAtMax
                ? "default"
                : "pointer",
              color: isAtMax
                ? "#B7BABD"
                : "#000000",
            }}
          >
            +
          </button>
        </div>
      )}
    </div>
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
        onKeyDown={(e) =>
          e.key === "Enter" && submit()
        }
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
          background: val.trim()
            ? accent
            : C.border,
          color: "#fff",
          borderRadius: 8,
          padding: "6px 10px",
          fontSize: 12.5,
          fontWeight: 700,
          cursor: val.trim()
            ? "pointer"
            : "default",
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
      <div
        style={{
          fontSize: 14.5,
          fontWeight: 700,
          color: C.ink,
        }}
      >
        {title}
      </div>

      {sub && (
        <div
          style={{
            fontSize: 12.5,
            color: C.slate,
            marginTop: 2,
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

export default function GrantScreen() {
  const [goal, setGoal] = useState("");
  const [additionalInstruction, setAdditionalInstruction] =
    useState("");

  const [risk, setRisk] = useState("Moderate");
  const [amount, setAmount] = useState(50000);
  const [horizon, setHorizon] = useState("Long-term");

  const [sectorMode, setSectorMode] = useState("all");

  const [sectorLimits, setSectorLimits] = useState([
    {
      id: "equity",
      label: "Equity",
      enabled: false,
      min: 0,
      max: 100,
      expanded: false,
    },
    {
      id: "banking",
      label: "Banking & Financials",
      enabled: false,
      min: 0,
      max: 100,
      expanded: false,
    },
    {
      id: "energy",
      label: "Energy",
      enabled: false,
      min: 0,
      max: 100,
      expanded: false,
    },
    {
      id: "commodities",
      label: "Commodities",
      enabled: false,
      min: 0,
      max: 100,
      expanded: false,
    },
  ]);

  const [permissions, setPermissions] = useState([
    {
      id: "research",
      label: "Research & compare stocks",
      state: "yes",
      hasThreshold: false,
    },

    {
      id: "analyze",
      label: "Analyze my portfolio",
      state: "yes",
      hasThreshold: false,
    },

    {
      id: "rebalance",
      label: "Rebalance allocation",
      state: "yes",
      hasThreshold: false,
    },

    {
      id: "buy",
      label: "Buy stocks",
      state: "yes",
      hasThreshold: true,
      thresholdType: "₹",
      threshold: 0,
      min: 0,
      step: 1000,
      expanded: false,
    },

    {
      id: "sell",
      label: "Sell holdings",
      state: "yes",
      hasThreshold: true,
      thresholdType: "₹",
      threshold: 0,
      min: 0,
      step: 1000,
      expanded: false,
    },
  ]);

  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const setPermState = (id, state) => {
    setPermissions((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, state }
          : p
      )
    );
  };

  const setPermThreshold = (id, threshold) => {
    setPermissions((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, threshold }
          : p
      )
    );
  };

  const toggleExpand = (id) => {
    setPermissions((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              expanded: !p.expanded,
            }
          : p
      )
    );
  };

  const addPermission = (label) => {
    setPermissions((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        label,
        state: "yes",
        hasThreshold: false,
        custom: true,
      },
    ]);
  };

  const removePermission = (id) => {
    setPermissions((prev) =>
      prev.filter((p) => p.id !== id)
    );
  };

  const risks = ["Low", "Moderate", "High"];

  const horizons = [
    {
      key: "Short-term",
      sub: "< 1 yr",
    },
    {
      key: "Medium-term",
      sub: "1–3 yrs",
    },
    {
      key: "Long-term",
      sub: "3+ yrs",
    },
  ];

  const quickAdds = [5000, 10000, 50000];

  const canSubmit =
    goal.trim().length > 0 &&
    Number(amount) > 0 &&
    confirmed;

  /*
   * Keep Buy threshold within the investment amount.
   *
   * Example:
   * Amount = ₹50,000
   * Buy threshold = ₹40,000
   *
   * User changes Amount → ₹20,000
   * Buy threshold automatically becomes ₹20,000.
   */
  useEffect(() => {
    const currentAmount = Number(amount) || 0;

    setPermissions((prev) =>
      prev.map((p) => {
        if (p.id !== "buy") {
          return p;
        }

        return {
          ...p,
          threshold: Math.min(
            p.threshold,
            currentAmount
          ),
        };
      })
    );
  }, [amount]);

  const toggleSector = (id) => {
    setSectorMode("custom");

    setSectorLimits((prev) =>
      prev.map((sector) =>
        sector.id === id
          ? {
              ...sector,
              enabled: !sector.enabled,
            }
          : sector
      )
    );
  };

  const toggleSectorExpand = (id) => {
    setSectorLimits((prev) =>
      prev.map((sector) =>
        sector.id === id
          ? {
              ...sector,
              expanded: !sector.expanded,
            }
          : sector
      )
    );
  };

  const setSectorMin = (id, value) => {
    setSectorLimits((prev) =>
      prev.map((sector) => {
        if (sector.id !== id) return sector;

        return {
          ...sector,
          min: Math.min(
            Number(value),
            sector.max
          ),
        };
      })
    );
  };

  const setSectorMax = (id, value) => {
    setSectorLimits((prev) =>
      prev.map((sector) => {
        if (sector.id !== id) return sector;

        return {
          ...sector,
          max: Math.max(
            Number(value),
            sector.min
          ),
        };
      })
    );
  };

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

        .sector-range::-webkit-slider-runnable-track {
          background: transparent;
          height: 6px;
        }

        .sector-range::-moz-range-track {
          background: transparent;
          height: 6px;
        }

        .sector-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          margin-top: -6px;
          border-radius: 50%;
          background: ${C.primary};
          border: 2px solid #FFFFFF;
          box-shadow: 0 0 0 1.5px ${C.primary};
          cursor: pointer;
          pointer-events: auto;
          transition:
            background 0.15s ease,
            transform 0.15s ease;
        }

        .sector-range::-webkit-slider-thumb:hover {
          background: ${C.primaryHover};
          box-shadow: 0 0 0 1.5px ${C.primaryHover};
          transform: scale(1.08);
        }

        .sector-range::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: ${C.primary};
          border: 2px solid #FFFFFF;
          box-shadow: 0 0 0 1.5px ${C.primary};
          cursor: pointer;
          pointer-events: auto;
          transition:
            background 0.15s ease,
            transform 0.15s ease;
        }

        .sector-range::-moz-range-thumb:hover {
          background: ${C.primaryHover};
          box-shadow: 0 0 0 1.5px ${C.primaryHover};
          transform: scale(1.08);
        }

        .sector-range-min {
          z-index: 3 !important;
        }

        .sector-range-max {
          z-index: 2 !important;
        }
      `}</style>

      {/* Status bar */}
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

      {/* Header */}
      <div
        style={{
          padding: "14px 0 16px 0",
        }}
      >
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
            <Sparkles
              size={16}
              color={C.primary}
              strokeWidth={2.2}
            />
          </div>

          <span
            style={{
              fontSize: 12.5,
              fontWeight: 700,
              color: C.slate,
            }}
          >
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
          Add your personal agent
        </div>

        <div
          style={{
            fontSize: 13,
            color: C.slate,
            marginTop: 4,
          }}
        >
          Set the goal and the boundaries. You can
          change these anytime.
        </div>
      </div>

      {/* Goal */}
      <div style={{ marginBottom: 20 }}>
        <SectionLabel title="What is your goal?" />

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
          onFocus={(e) =>
            (e.target.style.borderColor =
              C.primary)
          }
          onBlur={(e) =>
            (e.target.style.borderColor =
              C.border)
          }
        />
      </div>

      {/* Risk */}
      <div style={{ marginBottom: 20 }}>
        <SectionLabel title="Risk category" />

        <div
          style={{
            display: "flex",
            gap: 8,
          }}
        >
          {risks.map((r) => (
            <button
              key={r}
              onClick={() => setRisk(r)}
              style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: 10,
                border: `1.5px solid ${
                  risk === r
                    ? C.primary
                    : C.border
                }`,
                background:
                  risk === r
                    ? C.primarySoft
                    : "#fff",
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
            value={
              amount === ""
                ? ""
                : formatINR(amount)
            }
            onChange={(e) => {
              const digits =
                e.target.value.replace(
                  /[^0-9]/g,
                  ""
                );

              setAmount(
                digits === ""
                  ? ""
                  : Number(digits)
              );
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

        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
          }}
        >
          {quickAdds.map((q) => (
            <button
              key={q}
              onClick={() =>
                setAmount(
                  (prev) =>
                    (Number(prev) || 0) + q
                )
              }
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

        <div
          style={{
            display: "flex",
            gap: 8,
          }}
        >
          {horizons.map((h) => (
            <button
              key={h.key}
              onClick={() =>
                setHorizon(h.key)
              }
              style={{
                flex: 1,
                padding: "10px 4px",
                borderRadius: 10,
                border: `1.5px solid ${
                  horizon === h.key
                    ? C.primary
                    : C.border
                }`,
                background:
                  horizon === h.key
                    ? C.primarySoft
                    : "#fff",
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

              <div
                style={{
                  fontSize: 10.5,
                  color: C.slate,
                }}
              >
                {h.sub}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          height: 1,
          background: C.border,
          margin: "4px 0 20px",
        }}
      />

      {/* Sector limits */}
      <div style={{ marginBottom: 22 }}>
        <SectionLabel
          title="Sector limits"
          sub="Where the agent can invest, and how concentrated it can get."
        />

        <div
          style={{
            border: `1.5px solid ${C.border}`,
            borderRadius: 12,
            padding: "4px 14px",
          }}
        >
          {/* No sector preferences */}
          <div
            onClick={() => {
              setSectorMode("all");

              setSectorLimits((prev) =>
                prev.map((sector) => ({
                  ...sector,
                  enabled: false,
                }))
              );
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 0",
              borderBottom: `1px solid ${C.border}`,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                minWidth: 20,
                borderRadius: 5,
                border: `1.5px solid ${
                  sectorMode === "all"
                    ? C.primary
                    : C.chipBorder
                }`,
                background:
                  sectorMode === "all"
                    ? C.primary
                    : "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {sectorMode === "all" && (
                <Check
                  size={13}
                  color="#FFFFFF"
                  strokeWidth={3}
                />
              )}
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: "#000000",
                }}
              >
                No sector preferences
              </div>

              <div
                style={{
                  fontSize: 11.5,
                  color: C.slate,
                  marginTop: 2,
                }}
              >
                The agent can invest across any sector.
              </div>
            </div>
          </div>

          {/* Sector rows */}
          {sectorLimits.map((sector, index) => (
            <div
              key={sector.id}
              style={{
                borderBottom:
                  index !==
                  sectorLimits.length - 1
                    ? `1px solid ${C.border}`
                    : "none",
                padding: "12px 0",
              }}
            >
              {/* Main row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                {/* Checkbox */}
                <button
                  onClick={() =>
                    toggleSector(sector.id)
                  }
                  style={{
                    width: 20,
                    height: 20,
                    minWidth: 20,
                    borderRadius: 5,
                    border: `1.5px solid ${
                      sector.enabled
                        ? C.primary
                        : C.chipBorder
                    }`,
                    background:
                      sector.enabled
                        ? C.primary
                        : "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    padding: 0,
                    transition:
                      "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (sector.enabled) {
                      e.currentTarget.style.background =
                        C.primaryHover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (sector.enabled) {
                      e.currentTarget.style.background =
                        C.primary;
                    }
                  }}
                >
                  {sector.enabled && (
                    <Check
                      size={13}
                      color="#FFFFFF"
                      strokeWidth={3}
                    />
                  )}
                </button>

                {/* Sector name */}
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: sector.enabled
                      ? "#000000"
                      : C.slate,
                  }}
                >
                  {sector.label}
                </div>

                {/* Range summary */}
                {sector.enabled && (
                  <button
                    onClick={() =>
                      toggleSectorExpand(
                        sector.id
                      )
                    }
                    style={{
                      border: "none",
                      background: "none",
                      padding: 0,
                      fontFamily: FONT,
                      fontSize: 11.5,
                      color: C.slate,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    {sector.min}%–{sector.max}%

                    <span
                      style={{
                        fontSize: 10,
                      }}
                    >
                      {sector.expanded
                        ? "▾"
                        : "▸"}
                    </span>
                  </button>
                )}
              </div>

              {/* Dual-ended range */}
              {sector.enabled &&
                sector.expanded && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: "12px",
                      borderRadius: 10,
                      background: "#F8F9F9",
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems: "center",
                        marginBottom: 12,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11.5,
                          color: C.slate,
                        }}
                      >
                        Minimum
                      </span>

                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#000000",
                        }}
                      >
                        {sector.min}% –{" "}
                        {sector.max}%
                      </span>

                      <span
                        style={{
                          fontSize: 11.5,
                          color: C.slate,
                        }}
                      >
                        Maximum
                      </span>
                    </div>

                    {/* Dual slider */}
                    <div
                      style={{
                        position: "relative",
                        height: 24,
                      }}
                    >
                      {/* Gray track */}
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          top: 9,
                          height: 6,
                          borderRadius: 999,
                          background:
                            C.sliderTrack,
                        }}
                      />

                      {/* Selected range */}
                      <div
                        style={{
                          position: "absolute",
                          left: `${sector.min}%`,
                          right: `${100 - sector.max}%`,
                          top: 9,
                          height: 6,
                          borderRadius: 999,
                          background:
                            C.primary,
                          pointerEvents: "none",
                        }}
                      />

                      {/* Minimum */}
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={sector.min}
                        onChange={(e) =>
                          setSectorMin(
                            sector.id,
                            Number(
                              e.target.value
                            )
                          )
                        }
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          width: "100%",
                          height: 24,
                          margin: 0,
                          padding: 0,
                          background:
                            "transparent",
                          appearance: "none",
                          WebkitAppearance:
                            "none",
                          pointerEvents:
                            "none",
                          zIndex: 3,
                        }}
                        className="sector-range sector-range-min"
                      />

                      {/* Maximum */}
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={sector.max}
                        onChange={(e) =>
                          setSectorMax(
                            sector.id,
                            Number(
                              e.target.value
                            )
                          )
                        }
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          width: "100%",
                          height: 24,
                          margin: 0,
                          padding: 0,
                          background:
                            "transparent",
                          appearance: "none",
                          WebkitAppearance:
                            "none",
                          pointerEvents:
                            "none",
                          zIndex: 2,
                        }}
                        className="sector-range sector-range-max"
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        marginTop: 2,
                        fontSize: 10,
                        color: C.slateLight,
                      }}
                    >
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>

      {/* Permissions */}
      <div style={{ marginBottom: 8 }}>
        <SectionLabel
          title="Permissions"
          sub="Yes = agent handles it. No = it never does this."
        />

        {permissions.map((perm) => (
          <PermissionRow
            key={perm.id}
            perm={perm}
            onChangeState={(s) =>
              setPermState(perm.id, s)
            }
            onChangeThreshold={(v) =>
              setPermThreshold(
                perm.id,
                v
              )
            }
            onToggleExpand={() =>
              toggleExpand(perm.id)
            }
            onRemove={() =>
              removePermission(perm.id)
            }
            maxThreshold={
              perm.id === "buy"
                ? Number(amount) || 0
                : Infinity
            }
          />
        ))}

        <div style={{ marginTop: 6 }}>
          <TagInput
            placeholder="Add a permission (ex: Buy ETFs)"
            accent={C.primary}
            onAdd={(v) =>
              addPermission(v)
            }
          />
        </div>
      </div>

      {/* Additional instructions */}
      <div
        style={{
          marginTop: 22,
          marginBottom: 20,
        }}
      >
        <SectionLabel
          title="Additional instructions"
          sub="Tell your agent anything else it should keep in mind."
        />

        <textarea
          value={additionalInstruction}
          onChange={(e) =>
            setAdditionalInstruction(
              e.target.value
            )
          }
          rows={3}
          placeholder="e.g. Prefer fundamentally strong companies and avoid highly volatile stocks."
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
          onFocus={(e) =>
            (e.target.style.borderColor =
              C.primary)
          }
          onBlur={(e) =>
            (e.target.style.borderColor =
              C.border)
          }
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

        <Row
          label="Goal"
          value={goal || "—"}
        />

        <Row
          label="Additional instructions"
          value={
            additionalInstruction || "—"
          }
        />

        <Row
          label="Budget"
          value={
            amount
              ? `₹${formatINR(amount)}`
              : "—"
          }
        />

        <Row
          label="Risk"
          value={risk}
        />

        <Row
          label="Horizon"
          value={horizon}
        />

        <Row
          label="Sectors"
          value={
            sectorMode === "all"
              ? "No sector preferences"
              : sectorLimits
                  .filter(
                    (sector) =>
                      sector.enabled
                  )
                  .map(
                    (sector) =>
                      `${sector.label}: ${sector.min}%–${sector.max}%`
                  )
                  .join(", ") || "—"
          }
        />

        {/* Confirmation */}
        <div
          onClick={() =>
            setConfirmed((v) => !v)
          }
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            paddingTop: 14,
            borderTop: `1px solid ${C.border}`,
            cursor: "pointer",
            marginTop: 10,
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              minWidth: 20,
              borderRadius: 5,
              marginTop: 1,
              background: confirmed
                ? C.primary
                : "#FFFFFF",
              border: `1.5px solid ${
                confirmed
                  ? C.primary
                  : C.chipBorder
              }`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {confirmed && (
              <Check
                size={13}
                color="#FFFFFF"
                strokeWidth={3.2}
              />
            )}
          </div>

          <span
            style={{
              fontSize: 12.5,
              color: "#000000",
              lineHeight: 1.4,
            }}
          >
            I've reviewed these goals, limits
            and permissions, and I authorize the
            agent to act within them.
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
            <Check
              size={16}
              strokeWidth={3}
            />

            Access granted — agent is starting
          </div>
        ) : (
          <button
            disabled={!canSubmit}
            onClick={() =>
              setSubmitted(true)
            }
            style={{
              width: "100%",
              padding: "14px 0",
              borderRadius: 14,
              border: "none",
              background: canSubmit
                ? C.primary
                : "#EFEFEF",
              color: canSubmit
                ? "#FFFFFF"
                : "#B7BABD",
              fontWeight: 700,
              fontSize: 15,
              fontFamily: FONT,
              cursor: canSubmit
                ? "pointer"
                : "default",
            }}
            onMouseEnter={(e) => {
              if (canSubmit) {
                e.currentTarget.style.background =
                  C.primaryHover;
              }
            }}
            onMouseLeave={(e) => {
              if (canSubmit) {
                e.currentTarget.style.background =
                  C.primary;
              }
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
      <span
        style={{
          color: "#6B7280",
        }}
      >
        {label}
      </span>

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