import { Routes, Route } from "react-router-dom";
import LevelSelect from "./pages/LevelSelect";
// import Nivel1 from "./pages/Nivel1";
// import Nivel2 from "./pages/Nivel2";
import ProfileSetup from "./pages/ProfileSetup";

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<ProfileSetup />} />
        <Route path="/levels" element={<LevelSelect />} />
        {/*<Route path="/nivel1/:actividad" element={<Nivel1 />} />
        <Route path="/nivel2/:actividad" element={<Nivel2 />} /> */}
      </Routes>
    </div>
  );
}

export default App;
