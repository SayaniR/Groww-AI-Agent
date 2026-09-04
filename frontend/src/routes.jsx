import { Routes, Route } from "react-router-dom";
import Grantscreen from "./pages/Grantscreen";
import PaymentScreen from "./pages/Paymentscreen";
import ActivityScreen from "./pages/Activityscreen";
import LockScreenNotification from "./pages/Lockscreen";
import NotificationRedirectScreen from "./pages/Oversightscreen";
import RecoveryScreen from "./pages/Recoveryscreen";

// import Home from "./pages/Home";
// import ScreenTwo from "./pages/ScreenTwo";
// import ScreenThree from "./pages/ScreenThree";
// import ScreenFour from "./pages/ScreenFour";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Grantscreen />} />
            <Route path="/payment" element={<PaymentScreen />} />
            <Route path="/activity" element={<ActivityScreen />} />
            <Route path="/lock" element={<LockScreenNotification />} />
            <Route path="/sell" element={<NotificationRedirectScreen />} />
            <Route path="/error" element={<RecoveryScreen />} />
            {/* <Route path="/screen-two" element={<ScreenTwo />} />
            <Route path="/screen-three" element={<ScreenThree />} />
            <Route path="/screen-four" element={<ScreenFour />} /> */}
        </Routes>
    );
};

export default AppRoutes;