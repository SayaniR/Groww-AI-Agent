import React, { cloneElement, isValidElement, useEffect, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Loader2,
  Square,
  ArrowLeft,
  Pause,
  Play,
  AlertTriangle,
  X,
  OctagonX,
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useLocation, useNavigate } from "react-router-dom";

// -----------------------------------------------------
// Groww tokens
// -----------------------------------------------------

const C = {
  primary: "#00D09C",
  primarySoft: "#E3FBF3",
  ink: "#000000",
  slate: "#6B7280",
  slateLight: "#9AA1A9",
  border: "#E3E6E8",
  chipBorder: "#D8DBDD",
  bgSection: "#F7F8FA",
  urgent: "#F5A623",
  urgentSoft: "#FFF6E8",
  red: "#E5484D",
  redSoft: "#FDEEEE",
};

const FONT_DISPLAY =
  "'Inter Tight', -apple-system, BlinkMacSystemFont, sans-serif";

const FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const CAP_COLORS = {
  large: "#5B67F1",
  mid: "#4AA3DE",
  small: "#00C896",
};

const SECTOR_COLORS = {
  auto: "#00C896",
  banks: "#AEBE5A",
  power: "#FFC629",
  telecom: "#F5A03C",
};

const GAIN = "#00B386";
const LOSS = "#E2483C";

// -----------------------------------------------------
// Helpers
// -----------------------------------------------------

function formatINR(n) {
  const num = Number(n) || 0;
  return num.toLocaleString("en-IN");
}

function formatINR2(n) {
  const num = Number(n) || 0;

  return num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// -----------------------------------------------------
// Shared "Current (Invested)" column header row
// -----------------------------------------------------

function CurrentInvestedHeader({ leftLabel }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
      }}
    >
      <span
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#000000",
        }}
      >
        {leftLabel}
      </span>

      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <ChevronLeft size={13} color={C.slate} />
        <ChevronRight
          size={13}
          color={C.slate}
          style={{ marginRight: 5 }}
        />

        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#000000",
            borderBottom: `1.5px dashed ${C.slateLight}`,
            paddingBottom: 2,
          }}
        >
          Current (Invested)
        </span>
      </span>
    </div>
  );
}

// -----------------------------------------------------
// Activity progress indicator
// -----------------------------------------------------

function ActivityTrace({ lines = [] }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {lines.map((line, index) => {
        const isLast = index === lines.length - 1;

        return (
          <div
            key={`${line}-${index}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              minHeight: 26,
            }}
          >
            <div
              style={{
                width: 16,
                display: "flex",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {isLast ? (
                <Loader2
                  size={14}
                  color={C.slateLight}
                  style={{
                    animation: "gw-spin 1s linear infinite",
                  }}
                />
              ) : (
                <Check
                  size={14}
                  color={C.primary}
                  strokeWidth={3}
                />
              )}
            </div>

            <span
              style={{
                fontSize: 12.5,
                color: isLast ? "#000000" : C.slate,
                fontWeight: isLast ? 500 : 400,
              }}
            >
              {line}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// -----------------------------------------------------
// Generic activity card
// -----------------------------------------------------

function ActivityCard({
  title,
  progressLines,
  result,
  duration = 2500,
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div
      style={{
        border: `1.5px solid ${C.border}`,
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
        background: "#FFFFFF",
      }}
    >
      {/* Card header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: loading ? 10 : 12,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          <span
            style={{
              fontSize: 13.5,
              fontWeight: 700,
              color: "#000000",
            }}
          >
            {title}
          </span>

          {!loading && (
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: C.primary,
                background: C.primarySoft,
                borderRadius: 999,
                padding: "3px 8px",
              }}
            >
              Done
            </span>
          )}
        </div>
      </div>

      {/* Progress state */}
      {loading ? (
        <div
          style={{
            background: C.bgSection,
            borderRadius: 10,
            padding: "9px 11px",
          }}
        >
          <ActivityTrace lines={progressLines} />
        </div>
      ) : (
        <div
          style={{
            animation: "gw-result-in 300ms ease",
          }}
        >
          {result}
        </div>
      )}
    </div>
  );
}

function BuySellActivityCard({
  title,
  status = "running",
  progressLines = [],
  result = null,
  paused: pausedProp,
  onPauseChange,
}) {
  const [internalPaused, setInternalPaused] = useState(false);
  const isControlled = pausedProp !== undefined;
  const paused = isControlled ? pausedProp : internalPaused;

  const togglePause = () => {
    const next = !paused;
    if (onPauseChange) onPauseChange(next);
    if (!isControlled) setInternalPaused(next);
  };

  // Inject `paused` into the result element so children like BuySellResult
  // can react to it without each caller having to wire it manually.
  const resultWithPaused =
    result && isValidElement(result)
      ? cloneElement(result, { paused, ...result.props })
      : result;

  return (
    <div
      style={{
        fontFamily: FONT,
        maxWidth: 480,
        margin: "0 auto",
        marginBottom: 12,
        background: "#FFFFFF",
        border: `1px solid ${C.border}`,
        borderRadius: 18,
        padding: 20,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 19, fontWeight: 800, color: C.ink }}>
            {title}
          </span>

          {status === "done" && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: C.primarySoft,
                color: C.primary,
                fontSize: 11.5,
                fontWeight: 800,
                borderRadius: 999,
                padding: "3px 10px",
              }}
            >
              <Check size={11} strokeWidth={3} />
              Done
            </span>
          )}
        </div>

        <button
          onClick={togglePause}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            border: `1px solid ${C.border}`,
            borderRadius: 999,
            background: "#FFFFFF",
            padding: "7px 14px",
            fontSize: 13,
            fontWeight: 700,
            color: C.ink,
            cursor: "pointer",
            fontFamily: FONT,
          }}
        >
          {paused ? (
            <>
              <Play size={13} />
              Resume
            </>
          ) : (
            <>
              <Pause size={13} />
              Pause
            </>
          )}
        </button>
      </div>

      {/* Progress checklist — shown until a result is available */}
      {!result && progressLines.length > 0 && (
        <div>
          {progressLines.map((line, i) => (
            <div
              key={line}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13.5,
                color: i === 0 ? C.ink : C.slate,
                fontWeight: i === 0 ? 700 : 500,
                marginBottom: 10,
                opacity: paused ? 0.5 : 1,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: i === 0 ? C.primary : C.border,
                  flexShrink: 0,
                }}
              />
              {line}
            </div>
          ))}
        </div>
      )}

      {/* Result content, rendered without its own card chrome */}
      {result && (
        <div style={{ opacity: paused ? 0.55 : 1, transition: "opacity 0.2s ease" }}>
          {resultWithPaused}
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------
// Buy / Sell result
// -----------------------------------------------------

function ResultItem({ name, detail, amount }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "8px 0",
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#000" }}>
          {name}
        </div>
        <div style={{ fontSize: 11.5, color: C.slate, marginTop: 2 }}>
          {detail}
        </div>
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#000" }}>
        {amount}
      </div>
    </div>
  );
}

function BuySellResult({ budget = 50000, paused = false }) {
  const [allocated, setAllocated] = useState(32000);
  const [expanded, setExpanded] = useState(true);
  // 'pending' | 'approved' | 'rejected'
  const [decision, setDecision] = useState("pending");
  const [showAction, setShowAction] = useState(false);

  const pendingAmount = 7000;
  const stockName = "HDFC Bank";

  const evaluating = ["Tata Motors", "Reliance", "HDFC Bank"];

  // Simulate the agent finishing its evaluation before it surfaces the
  // decision that needs the user's review.
  useEffect(() => {
    const timer = setTimeout(() => setShowAction(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleApprove = () => {
    setAllocated((a) => Math.min(budget, a + pendingAmount));
    setDecision("approved");
    setExpanded(false);
  };

  const handleReject = () => {
    setDecision("rejected");
    setExpanded(false);
  };

  const progressPct = Math.min(100, (allocated / budget) * 100);

  return (
    <div
      style={{
        fontFamily: FONT,
        opacity: paused ? 0.55 : 1,
        pointerEvents: paused ? "none" : "auto",
        transition: "opacity 0.2s ease",
      }}
    >
      {/* Selected stocks */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 14,
        }}
      >
        <Check size={16} color={C.primary} strokeWidth={3} />
        <span style={{ fontSize: 14.5, fontWeight: 700, color: "#000" }}>
          Selected 4 stocks
        </span>
      </div>

      {/* Progress */}
      <div style={{ fontSize: 13, color: C.slate, marginBottom: 8 }}>
        {paused ? "Paused — " : "Investing in progress — "}
        <span style={{ color: "#000", fontWeight: 600 }}>
          ₹{formatINR(allocated)}
        </span>{" "}
        / ₹{formatINR(budget)} allocated
      </div>

      <div
        style={{
          height: 8,
          background: C.bgSection,
          borderRadius: 999,
          overflow: "hidden",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: `${progressPct}%`,
            height: "100%",
            background: C.primary,
            borderRadius: 999,
            transition: "width 0.4s ease",
          }}
        />
      </div>

      {/* Currently evaluating */}
      {decision === "pending" && (
        <div style={{ fontSize: 13.5, marginBottom: 14, color: "#000" }}>
          <span style={{ fontWeight: 800 }}>Currently evaluating: </span>
          <span style={{ color: C.slate }}>{evaluating.join(" · ")}</span>
        </div>
      )}

      {/* Next action - pending state (appears once evaluation completes) */}
      {decision === "pending" && showAction && (
        <div
          style={{
            border: `2px solid ${C.urgent}`,
            borderRadius: 12,
            overflow: "hidden",
            pointerEvents: paused ? "none" : "auto",
            boxShadow: paused ? "none" : `0 0 0 3px ${C.urgentSoft}`,
            animation: "buySellPopIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <style>{`
            @keyframes buySellPopIn {
              0% { opacity: 0; transform: translateY(6px) scale(0.98); }
              100% { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: C.urgentSoft,
              padding: "7px 16px",
              borderBottom: `1px solid ${C.urgent}33`,
            }}
          >
            <AlertTriangle size={13} color={C.urgent} strokeWidth={2.5} />
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 800,
                letterSpacing: 0.3,
                color: C.urgent,
                textTransform: "uppercase",
              }}
            >
              Action required
            </span>
          </div>

          <button
            onClick={() => setExpanded((v) => !v)}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "none",
              background: "#FFFFFF",
              padding: "14px 16px",
              cursor: "pointer",
              fontFamily: FONT,
              textAlign: "left",
            }}
          >
            <span style={{ fontSize: 14.5, fontWeight: 800, color: "#000" }}>
              Your review is needed: allocate ₹
              {formatINR(pendingAmount)} to {stockName}?
            </span>
            {expanded ? (
              <ChevronUp size={16} color={C.slate} />
            ) : (
              <ChevronDown size={16} color={C.slate} />
            )}
          </button>

          {expanded && (
            <div style={{ padding: "0 16px 16px 16px" }}>
              <div
                style={{
                  fontSize: 12.5,
                  color: C.slate,
                  marginBottom: 8,
                }}
              >
                Why I'm recommending it
              </div>

              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                  marginBottom: 10,
                }}
              >
                {[
                  "Strengthens your banking exposure",
                  "Fits your moderate-risk profile",
                  "Keeps HDFC Bank at 14% of your portfolio — within your 15% limit",
                ].map((line) => (
                  <li
                    key={line}
                    style={{
                      fontSize: 13.5,
                      color: "#000",
                      marginBottom: 6,
                      paddingLeft: 14,
                      position: "relative",
                    }}
                  >
                    <span style={{ position: "absolute", left: 0 }}>•</span>
                    {line}
                  </li>
                ))}
              </ul>

              <div
                style={{
                  fontSize: 12.5,
                  color: C.slate,
                  marginBottom: 14,
                }}
              >
                Your rule: Ask before any purchase above ₹5,000
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={handleApprove}
                  disabled={paused}
                  style={{
                    flex: 1,
                    background: C.primary,
                    border: "none",
                    borderRadius: 10,
                    padding: "13px 0",
                    fontSize: 14.5,
                    fontWeight: 800,
                    color: "#FFFFFF",
                    cursor: paused ? "default" : "pointer",
                    fontFamily: FONT,
                  }}
                >
                  Approve ₹{formatINR(pendingAmount)}
                </button>

                <button
                  onClick={handleReject}
                  disabled={paused}
                  style={{
                    flex: 1,
                    background: C.primarySoft,
                    border: "none",
                    borderRadius: 10,
                    padding: "13px 0",
                    fontSize: 14.5,
                    fontWeight: 800,
                    color: C.primary,
                    cursor: paused ? "default" : "pointer",
                    fontFamily: FONT,
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Approved state */}
      {decision === "approved" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: C.primarySoft,
            borderRadius: 10,
            padding: "12px 14px",
            fontSize: 13.5,
            fontWeight: 700,
            color: "#000",
          }}
        >
          <Check size={15} color={C.primary} strokeWidth={3} />
          Approved ₹{formatINR(pendingAmount)} to {stockName}
        </div>
      )}

      {/* Rejected state */}
      {decision === "rejected" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#FDEEEE",
            borderRadius: 10,
            padding: "12px 14px",
            fontSize: 13.5,
            fontWeight: 700,
            color: "#000",
          }}
        >
          <X size={15} color={C.red} strokeWidth={3} />
          Allocation rejected
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------
// Metric row
// -----------------------------------------------------

function MetricRow({
  color,
  label,
  sub,
  primary,
  primaryColor,
  secondary,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        gap: 12,
        padding: "13px 0",
      }}
    >
      <div
        style={{
          width: 4,
          borderRadius: 4,
          background: color,
          alignSelf: "stretch",
        }}
      />

      <div
        style={{
          flex: 1,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#000000",
          }}
        >
          {label}
        </div>

        {sub && (
          <div
            style={{
              fontSize: 11.5,
              color: C.slate,
              marginTop: 2,
            }}
          >
            {sub}
          </div>
        )}
      </div>

      <div
        style={{
          textAlign: "right",
        }}
      >
        <div
          style={{
            fontSize: 13.5,
            fontWeight: 700,
            color: primaryColor || "#000000",
          }}
        >
          {primary}
        </div>

        {secondary && (
          <div
            style={{
              fontSize: 11.5,
              color: C.slate,
              marginTop: 2,
            }}
          >
            {secondary}
          </div>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------------------
// Market cap result
// -----------------------------------------------------

function MarketCapResult() {
  const rows = [
    {
      key: "large",
      label: "Large cap",
      stocks: 5,
      pct: 70.72,
      pctLabel: "70.72%",
      current: 68491.49,
      invested: 57094.13,
    },
    {
      key: "mid",
      label: "Mid cap",
      stocks: 2,
      pct: 29.28,
      pctLabel: "29.28%",
      current: 28361.58,
      invested: 25668.94,
    },
    {
      key: "small",
      label: "Small cap",
      stocks: 0,
      pct: 0,
      pctLabel: "0.0%",
      current: 0,
      invested: 0,
    },
  ];

  return (
    <div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          fontFamily: FONT_DISPLAY,
          color: "#000000",
          marginBottom: 16,
        }}
      >
        Market cap
      </div>

      <div
        style={{
          display: "flex",
          height: 20,
          borderRadius: 999,
          overflow: "hidden",
          gap: 2,
          marginBottom: 16,
        }}
      >
        {rows
          .filter((r) => r.pct > 0)
          .map((r) => (
            <div
              key={r.key}
              style={{
                width: `${r.pct}%`,
                background: CAP_COLORS[r.key],
              }}
            />
          ))}
      </div>

      <CurrentInvestedHeader leftLabel="Market cap" />

      {rows.map((r) => {
        const gain = r.current - r.invested;

        return (
          <MetricRow
            key={r.key}
            color={CAP_COLORS[r.key]}
            label={r.label}
            sub={`${r.stocks} stock${
              r.stocks === 1 ? "" : "s"
            } • ${r.pctLabel}`}
            primary={`₹${formatINR2(r.current)}`}
            primaryColor={
              r.stocks === 0
                ? "#000000"
                : gain >= 0
                  ? GAIN
                  : LOSS
            }
            secondary={`₹${formatINR2(r.invested)}`}
          />
        );
      })}
    </div>
  );
}

// -----------------------------------------------------
// Sector allocation result
// -----------------------------------------------------

function SectorAllocationResult() {
  const rows = [
    {
      key: "auto",
      label: "Auto Manufacturers",
      stocks: 2,
      pct: 36.89,
      current: 16733.85,
      invested: 13345.29,
    },
    {
      key: "banks",
      label: "Banks",
      stocks: 1,
      pct: 25.51,
      current: 11572.0,
      invested: 9570.0,
    },
    {
      key: "power",
      label: "Power",
      stocks: 1,
      pct: 8.24,
      current: 3735.76,
      invested: 5343.45,
    },
    {
      key: "telecom",
      label: "Telecom",
      stocks: 1,
      pct: 29.36,
      current: 13314.7,
      invested: 9702.0,
    },
  ];

  const pieData = rows.map((r) => ({
    name: r.label,
    value: r.pct,
  }));

  return (
    <div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          fontFamily: FONT_DISPLAY,
          color: "#000000",
          marginBottom: 16,
        }}
      >
        Sector allocation
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 130,
            height: 130,
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                innerRadius={39}
                outerRadius={62}
                startAngle={90}
                endAngle={-270}
                stroke="#FFFFFF"
                strokeWidth={2}
              >
                {rows.map((r) => (
                  <Cell
                    key={r.key}
                    fill={SECTOR_COLORS[r.key]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <CurrentInvestedHeader leftLabel="Sector" />

      {rows.map((r) => {
        const gain = r.current - r.invested;

        return (
          <MetricRow
            key={r.key}
            color={SECTOR_COLORS[r.key]}
            label={r.label}
            sub={`${r.stocks} stock${
              r.stocks === 1 ? "" : "s"
            } • ${r.pct.toFixed(2)}%`}
            primary={`₹${formatINR2(r.current)}`}
            primaryColor={gain >= 0 ? GAIN : LOSS}
            secondary={`₹${formatINR2(r.invested)}`}
          />
        );
      })}
    </div>
  );
}

// -----------------------------------------------------
// Research result
// -----------------------------------------------------

function ResearchResult() {
  const picks = [
    {
      name: "HDFC Bank",
      change: "+1.2%",
      reason:
        "Strong earnings and fits your banking exposure.",
    },
    {
      name: "Reliance",
      change: "+0.6%",
      reason:
        "Diversified exposure aligned with moderate risk.",
    },
    {
      name: "Tata Motors",
      change: "+2.1%",
      reason:
        "Long-term growth opportunity.",
    },
  ];

  return (
    <div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: C.slate,
          marginBottom: 6,
        }}
      >
        AGENT'S SHORTLIST
      </div>

      {picks.map((pick) => (
        <div
          key={pick.name}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
            padding: "9px 0",
            borderTop: `1px solid ${C.border}`,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                color: "#000000",
              }}
            >
              {pick.name}
            </div>

            <div
              style={{
                fontSize: 11,
                color: C.slate,
                marginTop: 2,
              }}
            >
              {pick.reason}
            </div>
          </div>

          <div
            style={{
              fontSize: 12.5,
              fontWeight: 700,
              color: C.primary,
              whiteSpace: "nowrap",
            }}
          >
            {pick.change}
          </div>
        </div>
      ))}
    </div>
  );
}

// -----------------------------------------------------
// Rebalance result
// -----------------------------------------------------

function RebalanceResult({ budget }) {
  const [view, setView] = useState("current");

  const rows = [
    {
      key: "auto",
      label: "Auto Manufacturers",
      current: 36.89,
      suggested: 25,
    },
    {
      key: "banks",
      label: "Banks",
      current: 25.51,
      suggested: 30,
    },
    {
      key: "power",
      label: "Power",
      current: 8.24,
      suggested: 5,
    },
    {
      key: "telecom",
      label: "Telecom",
      current: 29.36,
      suggested: 40,
    },
  ];

  const active =
    view === "current" ? "current" : "suggested";

  const pieData = rows.map((r) => ({
    name: r.label,
    value: r[active],
  }));

  return (
    <div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: C.slate,
          marginBottom: 8,
        }}
      >
        SUGGESTED ALLOCATION
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 4,
        }}
      >
        <div
          style={{
            width: 130,
            height: 130,
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                innerRadius={39}
                outerRadius={62}
                startAngle={90}
                endAngle={-270}
                stroke="#FFFFFF"
                strokeWidth={2}
              >
                {rows.map((r) => (
                  <Cell
                    key={r.key}
                    fill={SECTOR_COLORS[r.key]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <button
        onClick={() =>
          setView((v) =>
            v === "current"
              ? "suggested"
              : "current"
          )
        }
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          border: "none",
          background: "transparent",
          padding: 0,
          marginBottom: 4,
          cursor: "pointer",
          fontFamily: FONT,
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#000000",
          }}
        >
          Allocation
        </span>

        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <ChevronLeft size={13} color={C.slate} />

          <ChevronRight
            size={13}
            color={C.slate}
            style={{ marginRight: 5 }}
          />

          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#000000",
              borderBottom: `1.5px dashed ${C.slateLight}`,
              paddingBottom: 2,
            }}
          >
            {view === "current" ? "Current" : "Suggested"}
          </span>
        </span>
      </button>

      {rows.map((r) => (
        <MetricRow
          key={r.key}
          color={SECTOR_COLORS[r.key]}
          label={r.label}
          sub={`${r[active].toFixed(2)}% of portfolio`}
          primary={`₹${formatINR(
            Math.round(
              (budget * r[active]) / 100
            )
          )}`}
          secondary={
            view === "suggested"
              ? `was ${r.current.toFixed(2)}%`
              : `suggests ${r.suggested.toFixed(2)}%`
          }
        />
      ))}
    </div>
  );
}

// -----------------------------------------------------
// Stop agent confirmation modal
// -----------------------------------------------------

function StopAgentModal({ onCancel, onConfirm }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        zIndex: 100,
        fontFamily: FONT,
        animation: "gw-fade-in 150ms ease",
        borderRadius: "inherit",
        overflow: "hidden",
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 480,
          background: "#FFFFFF",
          borderRadius: "18px 18px 0 0",
          padding: "22px 20px calc(20px + env(safe-area-inset-bottom))",
          boxSizing: "border-box",
          animation: "gw-sheet-up 200ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div
          style={{
            width: 40,
            height: 8,
            display: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: C.redSoft,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <OctagonX size={16} color={C.red} strokeWidth={2.5} />
          </div>

          <div style={{ fontSize: 17, fontWeight: 800, color: "#000000" }}>
            Stop agent?
          </div>
        </div>

        <div
          style={{
            fontSize: 13,
            color: C.slate,
            lineHeight: 1.5,
            marginBottom: 20,
          }}
        >
          This will immediately stop all delegated actions, including any
          pending buy/sell decisions. You'll need to grant permissions again
          to restart the agent.
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              background: C.primarySoft,
              color: C.primary,
              border: "none",
              borderRadius: 10,
              padding: "13px 0",
              fontSize: 14.5,
              fontWeight: 800,
              cursor: "pointer",
              fontFamily: FONT,
            }}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              background: C.red,
              color: "#FFFFFF",
              border: "none",
              borderRadius: 10,
              padding: "13px 0",
              fontSize: 14.5,
              fontWeight: 800,
              cursor: "pointer",
              fontFamily: FONT,
            }}
          >
            Yes, stop agent
          </button>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------
// Main Activity Screen
// -----------------------------------------------------

export default function ActivityScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  /*
   * GrantScreen should pass its configuration through
   * navigate("/activity", { state: { ... } })
   */

  const grantData = (location.state && location.state.grantData) || {};

  const budget = Number(grantData.amount) || 50000;

  const permissions = grantData.permissions || [];

  const permissionState = (id) => {
    const permission = permissions.find(
      (p) => p.id === id
    );

    return permission?.state === "yes";
  };

  const canResearch = permissionState("research");
  const canAnalyze = permissionState("analyze");
  const canRebalance = permissionState("rebalance");
  const canBuy = permissionState("buy");
  const canSell = permissionState("sell");

  const hasAnyActivity =
    canResearch ||
    canAnalyze ||
    canRebalance ||
    canBuy ||
    canSell;

  // -----------------------------------------------------
  // Stop agent state
  // -----------------------------------------------------

  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const [agentStopped, setAgentStopped] = useState(false);

  const handleConfirmStop = () => {
    setAgentStopped(true);
    setShowStopConfirm(false);
  };

  return (
    <div
      style={{
        fontFamily: FONT,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#FFFFFF",
        position: "relative",
      }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800&display=swap');

          @keyframes gw-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes gw-result-in {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes gw-fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes gw-sheet-up {
            from { transform: translateY(24px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>

      {/* -------------------------------------------------
          Sticky header
      -------------------------------------------------- */}

      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          height: 58,
          minHeight: 58,
          background: "#FFFFFF",
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          boxSizing: "border-box",
        }}
      >
        <button
          onClick={() => navigate(-2)}
          aria-label="Go back"
          style={{
            width: 34,
            height: 34,
            border: "none",
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            cursor: "pointer",
            marginRight: 5,
          }}
        >
          <ArrowLeft
            size={23}
            color="#000000"
            strokeWidth={2}
          />
        </button>

        <div
          style={{
            fontSize: 17,
            fontWeight: 800,
            color: "#000000",
            fontFamily: FONT_DISPLAY,
          }}
        >
          Agent Activity Log
        </div>
      </div>

      {/* -------------------------------------------------
          Scrollable content
      -------------------------------------------------- */}

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 16px 24px",
          boxSizing: "border-box",
          opacity: agentStopped ? 0.5 : 1,
          pointerEvents: agentStopped ? "none" : "auto",
          transition: "opacity 0.2s ease",
        }}
      >
        {/* Intro */}
        <div
          style={{
            padding: "16px 0 14px",
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#000000",
              fontFamily: FONT_DISPLAY,
            }}
          >
            {hasAnyActivity
              ? "Your agent is working"
              : "No actions delegated"}
          </div>

          <div
            style={{
              fontSize: 12.5,
              color: C.slate,
              marginTop: 4,
              lineHeight: 1.4,
            }}
          >
            {hasAnyActivity
              ? "Here's what your agent is evaluating within your approved boundaries."
              : "Return to the previous screen to grant the agent some permissions."}
          </div>
        </div>

        {/* -------------------------------------------------
            BUY / SELL — ALWAYS FIRST
        -------------------------------------------------- */}

        {(canBuy || canSell) && (
          <BuySellActivityCard
            title="Buy / Sell"
            progressLines={
              canBuy && canSell
                ? [
                    "Reviewing your portfolio",
                    "Evaluating buy opportunities",
                    "Checking sell candidates",
                  ]
                : canBuy
                  ? [
                      "Reviewing your portfolio",
                      "Scanning for buy opportunities",
                      "Checking your investment limits",
                    ]
                  : [
                      "Reviewing your holdings",
                      "Identifying sell candidates",
                      "Checking your permissions",
                    ]
            }
            result={
              <BuySellResult
                budget={budget}
                buyEnabled={canBuy}
                sellEnabled={canSell}
              />
            }
          />
        )}

        {/* -------------------------------------------------
            ANALYZE
        -------------------------------------------------- */}

        {canAnalyze && (
          <ActivityCard
            title="Portfolio Analysis"
            progressLines={[
              "Reviewing your existing holdings",
              "Checking portfolio allocation",
              "Analyzing portfolio performance",
            ]}
            result={
              <div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      border: `1px solid ${C.border}`,
                      borderRadius: 12,
                      padding: 12,
                    }}
                  >
                    <MarketCapResult />
                  </div>

                  <div
                    style={{
                      border: `1px solid ${C.border}`,
                      borderRadius: 12,
                      padding: 12,
                    }}
                  >
                    <SectorAllocationResult />
                  </div>
                </div>
              </div>
            }
          />
        )}

        {/* -------------------------------------------------
            RESEARCH
        -------------------------------------------------- */}

        {canResearch && (
          <ActivityCard
            title="Research & compare stocks"
            progressLines={[
              "Scanning the Nifty 500",
              "Comparing company fundamentals",
              "Ranking opportunities against your goal",
            ]}
            result={<ResearchResult />}
          />
        )}

        {/* -------------------------------------------------
            REBALANCE
        -------------------------------------------------- */}

        {canRebalance && (
          <ActivityCard
            title="Rebalance allocation"
            progressLines={[
              "Checking diversification",
              "Evaluating current allocation",
              "Calculating suggested allocation",
            ]}
            result={
              <RebalanceResult
                budget={budget}
              />
            }
          />
        )}

        {!hasAnyActivity && (
          <div
            style={{
              border: `1.5px solid ${C.border}`,
              borderRadius: 14,
              padding: 18,
              textAlign: "center",
              color: C.slate,
              fontSize: 12.5,
            }}
          >
            No agent activity has been enabled.
          </div>
        )}
      </div>

      {/* -------------------------------------------------
          Sticky footer — Stop agent
      -------------------------------------------------- */}

      {hasAnyActivity && (
        <div
          style={{
            position: "sticky",
            bottom: 0,
            zIndex: 20,
            background: "#FFFFFF",
            borderTop: `1px solid ${C.border}`,
            padding: "12px 16px calc(12px + env(safe-area-inset-bottom))",
            boxSizing: "border-box",
          }}
        >
          {agentStopped ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "13px 0",
                borderRadius: 10,
                background: C.bgSection,
                fontSize: 14,
                fontWeight: 700,
                color: C.slate,
              }}
            >
              <OctagonX size={15} color={C.slate} />
              Agent stopped
            </div>
          ) : (
            <button
              onClick={() => setShowStopConfirm(true)}
              style={{
                width: "100%",
                background: C.primarySoft,
                color: C.primary,
                border: "none",
                borderRadius: 10,
                padding: "13px 0",
                fontSize: 14.5,
                fontWeight: 800,
                cursor: "pointer",
                fontFamily: FONT,
              }}
            >
              Stop agent
            </button>
          )}
        </div>
      )}

      {/* -------------------------------------------------
          Stop confirmation modal
      -------------------------------------------------- */}

      {showStopConfirm && (
        <StopAgentModal
          onCancel={() => setShowStopConfirm(false)}
          onConfirm={handleConfirmStop}
        />
      )}
    </div>
  );
}