import { Routes, Route } from "react-router-dom";
import Grantscreen from "./pages/Grantscreen";

// import Home from "./pages/Home";
// import ScreenTwo from "./pages/ScreenTwo";
// import ScreenThree from "./pages/ScreenThree";
// import ScreenFour from "./pages/ScreenFour";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Grantscreen />} />
            {/* <Route path="/screen-two" element={<ScreenTwo />} />
            <Route path="/screen-three" element={<ScreenThree />} />
            <Route path="/screen-four" element={<ScreenFour />} /> */}
        </Routes>
    );
};

export default AppRoutes;