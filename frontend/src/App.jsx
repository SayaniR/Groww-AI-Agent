import { IPhoneMockup } from "react-device-mockup";
import AppRoutes from "./routes";
import "./App.css";

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
        </div>
    );
}

export default App;