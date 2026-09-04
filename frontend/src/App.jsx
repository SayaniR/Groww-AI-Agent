import { IPhoneMockup } from "react-device-mockup";
import AppRoutes from "./routes";
import "./App.css";
import { useNavigate } from "react-router-dom";
const DEMO_SCENARIOS = [
  { label: "Lock screen notification", route: "/lock" },
  // { label: "Error: order failed", route: "/error" },
  // { label: "Recovery: allocation exceeded", route: "/recovery" },
];


function DemoControls() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        width: 220,
        border: "1px solid #E3E6E8",
        borderRadius: 14,
        padding: 16,
        background: "#FAFAFA",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 0.6,
          color: "#9AA1A9",
          marginBottom: 10,
        }}
      >
        DEMO CONTROLS
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {DEMO_SCENARIOS.map((s) => (
          <button
            key={s.route}
            onClick={() => navigate(s.route)}
            style={{
              textAlign: "left",
              border: "1px solid #E3E6E8",
              background: "#FFFFFF",
              borderRadius: 10,
              padding: "9px 12px",
              fontSize: 12.5,
              fontWeight: 600,
              color: "#000000",
              cursor: "pointer",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div style={{ height: 1, background: "#E3E6E8", margin: "12px 0" }} />
      <button
        onClick={() => navigate("/")}
        style={{
          width: "100%",
          textAlign: "center",
          border: "1px solid #E3E6E8",
          background: "transparent",
          borderRadius: 10,
          padding: "8px 12px",
          fontSize: 12,
          fontWeight: 600,
          color: "#6B7280",
          cursor: "pointer",
        }}
      >
        ↺ Reset to start
      </button>
    </div>
  );
}
 

function App() {
    const isDesktop = window.innerWidth > 768;

    const AppContent = (
        <div className="mobile-app-container">
            <AppRoutes />
        </div>
    );

    if (!isDesktop) {
        return AppContent;
    }

    return (
        <div className="desktop-preview">
            <IPhoneMockup
                screenWidth={390}
                screenType="island"
                frameColor="#000000"
            >
                {AppContent}
            </IPhoneMockup>
            <div
                style={{
                    position: "fixed",
                    left: 40,
                    top: "50%",
                    transform: "translateY(-50%)",
                }}
            >
                <DemoControls />
            </div>
        </div>
    );
}

export default App;