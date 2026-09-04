import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Flashlight, Camera, Sparkles } from "lucide-react";

// ---- Groww brand tokens (matches GrantScreen / ActivityScreen) ----
const C = {
  primary: "#00D09C",
  primarySoft: "#E3FBF3",
};
const FONT_DISPLAY = "'Inter Tight', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT =
  "Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

/**
 * Lock screen showing a single Groww Agent notification.
 * Rendered as its own route (e.g. <Route path="/lock" element={<LockScreenNotification />} />)
 * so it slots into the same device-mockup frame as every other screen — App.jsx
 * doesn't need to know about "locked" state at all, AppRoutes drives it.
 *
 * Tapping the notification navigates straight to the checkpoint that triggered it,
 * rather than just the Activity screen's default state.
 */
export default function LockScreenNotification({
  targetRoute = "/sell",
  checkpointId = "buy-hdfc",
  appName = "GROWW AGENT",
  title = "Approval needed",
  body = "Sell ₹7,000 of HDFC Bank? Tap to review.",
  timestamp = "now",
}) {
  const navigate = useNavigate();
  const [pressed, setPressed] = useState(null);

  const handleTap = () => {
    navigate(`${targetRoute}?checkpoint=${checkpointId}`);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        fontFamily: FONT,
        background:
          "radial-gradient(120% 90% at 50% 0%, #2B2540 0%, #14121F 55%, #0A0910 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;600;700&display=swap');
      `}</style>

      {/* status icons */}
      {/* <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 4,
          padding: "12px 20px 0 20px",
          fontSize: 11,
          color: "rgba(255,255,255,0.7)",
          fontWeight: 600,
        }}
      >
        <span>●●●●</span>
      </div> */}

      {/* big clock */}
      <div style={{ textAlign: "center", marginTop: 28 }}>
        <Lock size={16} color="rgba(255,255,255,0.85)" strokeWidth={2} />
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 300,
            fontSize: 76,
            color: "#FFFFFF",
            lineHeight: 1,
            marginTop: 10,
            letterSpacing: -1,
          }}
        >
          13:41
        </div>
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 600,
            fontSize: 17,
            color: "rgba(255,255,255,0.85)",
            marginTop: 6,
          }}
        >
          Thursday, 27 August
        </div>
      </div>

      {/* notification banner */}
      {/* <div style={{ flex: 1, padding: "28px 14px 0 14px" }}>
        <button
          onClick={handleTap}
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          onMouseLeave={() => setPressed(false)}
          style={{
            width: "100%",
            textAlign: "left",
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(255,255,255,0.14)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRadius: 18,
            padding: "14px 14px",
            cursor: "pointer",
            transform: pressed ? "scale(0.98)" : "scale(1)",
            transition: "transform 120ms ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                background: C.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Sparkles size={13} color="#FFFFFF" strokeWidth={2.4} />
            </div>
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                color: "rgba(255,255,255,0.75)",
                letterSpacing: 0.4,
                flex: 1,
              }}
            >
              {appName}
            </span>
            <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.55)" }}>{timestamp}</span>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#FFFFFF", marginBottom: 2 }}>
            {title}
          </div>
          <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.88)", lineHeight: 1.4 }}>
            {body}
          </div>
        </button>
      </div> */}
```jsx
{/* notification banners */}
<div style={{ flex: 1, padding: "28px 14px 0 14px" }}>
  {/* Sell notification */}
  <button
    onClick={() => navigate(`/sell?checkpoint=buy-hdfc`)}
    onMouseDown={() => setPressed("sell")}
    onMouseUp={() => setPressed(false)}
    onMouseLeave={() => setPressed(false)}
    style={{
      width: "100%",
      textAlign: "left",
      border: "1px solid rgba(255,255,255,0.18)",
      background: "rgba(255,255,255,0.14)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderRadius: 18,
      padding: "14px 14px",
      cursor: "pointer",
      transform: pressed === "sell" ? "scale(0.98)" : "scale(1)",
      transition: "transform 120ms ease",
      marginBottom: 10,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          background: C.primary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Sparkles size={13} color="#FFFFFF" strokeWidth={2.4} />
      </div>

      <span
        style={{
          fontSize: 11.5,
          fontWeight: 700,
          color: "rgba(255,255,255,0.75)",
          letterSpacing: 0.4,
          flex: 1,
        }}
      >
        GROWW AGENT
      </span>

      <span
        style={{
          fontSize: 11.5,
          color: "rgba(255,255,255,0.55)",
        }}
      >
        now
      </span>
    </div>

    <div
      style={{
        fontSize: 15,
        fontWeight: 700,
        color: "#FFFFFF",
        marginBottom: 2,
      }}
    >
      Approval needed
    </div>

    <div
      style={{
        fontSize: 13.5,
        color: "rgba(255,255,255,0.88)",
        lineHeight: 1.4,
      }}
    >
      Sell ₹7,000 of HDFC Bank? Tap to review.
    </div>
  </button>

  {/* Error notification */}
  <button
    onClick={() => navigate(`/error?checkpoint=agent-error`)}
    onMouseDown={() => setPressed("error")}
    onMouseUp={() => setPressed(false)}
    onMouseLeave={() => setPressed(false)}
    style={{
      width: "100%",
      textAlign: "left",
      border: "1px solid rgba(255,255,255,0.18)",
      background: "rgba(255,255,255,0.14)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderRadius: 18,
      padding: "14px 14px",
      cursor: "pointer",
      transform: pressed === "error" ? "scale(0.98)" : "scale(1)",
      transition: "transform 120ms ease",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          background: "#FF5C5C",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Sparkles size={13} color="#FFFFFF" strokeWidth={2.4} />
      </div>

      <span
        style={{
          fontSize: 11.5,
          fontWeight: 700,
          color: "rgba(255,255,255,0.75)",
          letterSpacing: 0.4,
          flex: 1,
        }}
      >
        GROWW AGENT
      </span>

      <span
        style={{
          fontSize: 11.5,
          color: "rgba(255,255,255,0.55)",
        }}
      >
        now
      </span>
    </div>

    <div
      style={{
        fontSize: 15,
        fontWeight: 700,
        color: "#FFFFFF",
        marginBottom: 2,
      }}
    >
      Action needed
    </div>

    <div
      style={{
        fontSize: 13.5,
        color: "rgba(255,255,255,0.88)",
        lineHeight: 1.4,
      }}
    >
      Your allocation limit has been exceeded. Tap to review.
    </div>
  </button>
</div>

      {/* bottom controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 30px 18px 30px",
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 999,
            background: "rgba(255,255,255,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Flashlight size={18} color="#FFFFFF" />
        </div>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 999,
            background: "rgba(255,255,255,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Camera size={18} color="#FFFFFF" />
        </div>
      </div>

      {/* home indicator */}
      <div style={{ display: "flex", justifyContent: "center", paddingBottom: 8 }}>
        <div
          style={{
            width: 120,
            height: 4,
            borderRadius: 999,
            background: "rgba(255,255,255,0.7)",
          }}
        />
      </div>
    </div>
  );
}