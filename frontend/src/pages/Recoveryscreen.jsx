import React, { useState } from "react";
import {
  ArrowLeft,
  AlertTriangle,
  Check,
  RefreshCw,
  Circle,
  SlidersHorizontal,
  OctagonX,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// -----------------------------------------------------
// Groww tokens (identical to the other screens)
// -----------------------------------------------------

const C = {
  primary: "#00D09C",
  primarySoft: "#E3FBF3",
  ink: "#000000",
  slate: "#6B7280",
  slateLight: "#9AA1A9",
  border: "#E3E6E8",
  bgSection: "#F7F8FA",
  urgent: "#F5A623",
  urgentSoft: "#FFF6E8",
  red: "#E5484D",
  redSoft: "#FDEEEE",
};

const FONT_DISPLAY = "'Inter Tight', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

function formatINR(n) {
  const num = Number(n) || 0;
  return num.toLocaleString("en-IN");
}

// -----------------------------------------------------
// A single recovery action — icon, title, helper text, one tap
// -----------------------------------------------------

function ActionButton({ icon, title, helper, tone = "neutral", onClick, disabled, done }) {
  const toneStyles = {
    primary: { border: C.primary, bg: done ? C.primarySoft : "#FFFFFF", iconBg: C.primarySoft },
    neutral: { border: C.border, bg: "#FFFFFF", iconBg: C.bgSection },
    destructive: { border: C.red, bg: "#FFFFFF", iconBg: C.redSoft },
  }[tone];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        border: `1.5px solid ${done ? C.primary : toneStyles.border}`,
        background: toneStyles.bg,
        borderRadius: 12,
        padding: "13px 14px",
        marginBottom: 8,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled && !done ? 0.5 : 1,
        fontFamily: FONT,
        textAlign: "left",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 999,
          background: done ? C.primarySoft : toneStyles.iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {done ? <Check size={16} color={C.primary} strokeWidth={3} /> : icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#000000" }}>{title}</div>
        <div style={{ fontSize: 11.5, color: C.slate, marginTop: 2, lineHeight: 1.4 }}>{helper}</div>
      </div>
    </button>
  );
}

// -----------------------------------------------------
// Main screen
// -----------------------------------------------------

export default function RecoveryScreen({
  stockName = "HDFC Bank",
  currentPct = 18,
  limitPct = 15,
  totalHeld = 9000,
}) {
  const navigate = useNavigate();

  const [resolvedAction, setResolvedAction] = useState(null); // 'rebalance' | 'keep' | 'stop' | null
  const [showWhy, setShowWhy] = useState(false);
  const [showStopConfirm, setShowStopConfirm] = useState(false);

  const excessAmount = Math.round((totalHeld * (currentPct - limitPct)) / currentPct);
  const anyResolved = resolvedAction !== null;

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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800&display=swap');
        @keyframes gw-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes gw-sheet-up { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>

      {/* Sticky header */}
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
          onClick={() => navigate(-1)}
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
          <ArrowLeft size={23} color="#000000" strokeWidth={2} />
        </button>
        <div style={{ fontSize: 17, fontWeight: 800, color: "#000000", fontFamily: FONT_DISPLAY }}>
          Portfolio alert
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 24px", boxSizing: "border-box" }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          {/* Status card — detection logic unchanged */}
          <div
            style={{
              border: `1.5px solid ${C.red}`,
              borderRadius: 18,
              padding: 20,
              marginBottom: 16,
              background: "#FFFFFF",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: C.redSoft,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <AlertTriangle size={19} color={C.red} strokeWidth={2.2} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 800,
                    letterSpacing: 0.4,
                    color: C.red,
                    textTransform: "uppercase",
                    marginBottom: 2,
                  }}
                >
                  Agent paused
                </div>
                <div style={{ fontSize: 16.5, fontWeight: 800, color: "#000000" }}>
                  Cumulative allocation exceeded
                </div>
              </div>
            </div>

            <div style={{ fontSize: 13.5, color: "#000000", lineHeight: 1.5, marginBottom: 14 }}>
              <span style={{ fontWeight: 700 }}>{stockName}</span> now totals ₹{formatINR(totalHeld)} —{" "}
              <span style={{ fontWeight: 700, color: C.red }}>{currentPct}%</span> of your portfolio,
              above your {limitPct}% limit for Banking & Financials sector.
            </div>

            {/* <div style={{ fontSize: 12, fontWeight: 700, color: C.slate, marginBottom: 8 }}>
              TWO SEPARATE PURCHASES, EACH INDIVIDUALLY WITHIN YOUR RULES
            </div> */}
            <div style={{ marginBottom: 14 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderTop: `1px solid ${C.border}`,
                }}
              >
                <span style={{ fontSize: 12.5, color: "#000000" }}>Purchase 1</span>
                <span style={{ fontSize: 12.5, color: C.slate }}>₹7,000 — approved by you</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderTop: `1px solid ${C.border}`,
                }}
              >
                <span style={{ fontSize: 12.5, color: "#000000" }}>Purchase 2</span>
                <span style={{ fontSize: 12.5, color: C.slate }}>₹2,000 — auto-approved (under ₹5,000)</span>
              </div>
            </div>

            {/* <div
              style={{
                borderLeft: `3px solid ${C.urgent}`,
                background: C.urgentSoft,
                borderRadius: "0 8px 8px 0",
                padding: "10px 12px",
                fontSize: 12.5,
                color: "#000000",
                fontStyle: "italic",
                lineHeight: 1.5,
              }}
            >
              "I checked each order against its own limit, but not the combined effect on this
              stock. That's what let this happen."
            </div> */}
          </div>

          {/* What you can do */}
          <div style={{ fontSize: 13, fontWeight: 700, color: "#000000", marginBottom: 8 }}>
            What you can do
          </div>

          <ActionButton
            icon={<RefreshCw size={15} color={C.primary} strokeWidth={2.3} />}
            title="Rebalance allocation"
            helper={`Sell ₹${formatINR(excessAmount)} of ${stockName} to bring it back to your ${limitPct}% limit`}
            tone="primary"
            done={resolvedAction === "rebalance"}
            disabled={anyResolved && resolvedAction !== "rebalance"}
            onClick={() => setResolvedAction("rebalance")}
          />

          <ActionButton
            icon={<Circle size={15} color={C.slate} strokeWidth={2.3} />}
            title="Keep as is"
            helper="Leave the position where it is. I'll still ask before touching it again"
            tone="neutral"
            done={resolvedAction === "keep"}
            disabled={anyResolved && resolvedAction !== "keep"}
            onClick={() => setResolvedAction("keep")}
          />

          <ActionButton
            icon={<SlidersHorizontal size={15} color={C.slate} strokeWidth={2.3} />}
            title="Edit permissions"
            helper="Update the agent's limits or authority before it continues"
            tone="neutral"
            disabled={anyResolved}
            onClick={() => navigate("/", { state: { amount: "50000" } })}
          />

          <ActionButton
            icon={<OctagonX size={15} color={C.red} strokeWidth={2.3} />}
            title="Stop agent"
            helper="End this delegation. You'll need to grant new access to resume"
            tone="destructive"
            done={resolvedAction === "stop"}
            disabled={anyResolved && resolvedAction !== "stop"}
            onClick={() => setShowStopConfirm(true)}
          />

          {resolvedAction && (
            <div
              style={{
                marginTop: 8,
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: C.primarySoft,
                borderRadius: 10,
                padding: "12px 14px",
                fontSize: 13,
                fontWeight: 700,
                color: "#000000",
                animation: "gw-fade-in 0.2s ease",
              }}
            >
              <Check size={15} color={C.primary} strokeWidth={3} />
              {resolvedAction === "rebalance" &&
                `Rebalancing — selling ₹${formatINR(excessAmount)} of ${stockName}`}
              {resolvedAction === "keep" && "Keeping the position as is"}
              {resolvedAction === "stop" && "Agent stopped — no further action will be taken"}
            </div>
          )}

          {/* Why did you do this? */}
          {/* <button
            onClick={() => setShowWhy((v) => !v)}
            style={{
              width: "100%",
              textAlign: "left",
              border: "none",
              background: "transparent",
              padding: "12px 0 0 0",
              borderTop: `1px solid ${C.border}`,
              fontSize: 13,
              fontWeight: 700,
              color: "#000000",
              cursor: "pointer",
              fontFamily: FONT,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            "Why did you do this?"
            {showWhy ? <ChevronUp size={15} color={C.slate} /> : <ChevronDown size={15} color={C.slate} />}
          </button>
          {showWhy && (
            <div style={{ marginTop: 10, fontSize: 12.5, color: "#000000", lineHeight: 1.7 }}>
              <div>
                <span style={{ fontWeight: 700 }}>Goal fit — </span>
                Matches your long-term growth goal
              </div>
              <div>
                <span style={{ fontWeight: 700 }}>Risk fit — </span>
                Within your moderate-risk profile at the time of each purchase
              </div>
              <div>
                <span style={{ fontWeight: 700 }}>Rule check — </span>
                <span style={{ color: C.primary }}>✓</span> Each order was under ₹5,000 or approved
                &nbsp;·&nbsp;
                <span style={{ color: C.red }}>✗</span> Combined stock allocation now exceeds {limitPct}%
              </div>
              <div style={{ marginTop: 4 }}>
                <span style={{ fontWeight: 700 }}>What I've changed — </span>
                I will now check total stock allocation after every purchase, not only the size of
                the current order.
              </div>
            </div>
          )} */}
        </div>
      </div>

      {/* Stop confirmation — the one action that still gets a second check */}
      {showStopConfirm && (
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
          onClick={() => setShowStopConfirm(false)}
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
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
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
              <div style={{ fontSize: 17, fontWeight: 800, color: "#000000" }}>Stop agent?</div>
            </div>
            <div style={{ fontSize: 13, color: C.slate, lineHeight: 1.5, marginBottom: 20 }}>
              This ends the current delegation entirely. {stockName} will stay at {currentPct}% until
              you grant new authority.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowStopConfirm(false)}
                style={{
                  flex: 1,
                  background: C.bgSection,
                  color: "#000000",
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
                onClick={() => {
                  setResolvedAction("stop");
                  setShowStopConfirm(false);
                }}
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
      )}
    </div>
  );
}