import { Routes, Route } from "react-router-dom";
import ProfileSetup from "./pages/ProfileSetup";
import LevelSelect from "./pages/LevelSelect";
import Nivel1 from "./pages/Nivel1";
import EscuchaLetra from "./pages/Nivel1/EscuchaLetra";
import UneImagen from "./pages/Nivel1/UneImagen";
import TrazaLetra from "./pages/Nivel1/TrazaLetra";
import MemoriaLetras from "./pages/Nivel1/MemoriaLetras";
import OrdenaLetras from "./pages/Nivel1/OrdenaLetras";
import BuscaLetra from "./pages/Nivel1/BuscaLetra";
import CompletaPalabra from "./pages/Nivel1/CompletaPalabra";
import CantaAprende from "./pages/Nivel1/CantaAprende";

import Nivel2 from "./pages/Nivel2";
import PuenteSilabas from "./pages/Nivel2/PuenteSilabas";
import FrutasMagicas from "./pages/Nivel2/FrutasMagicas";

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<ProfileSetup />} />
        <Route path="/levels" element={<LevelSelect />} />

        <Route path="/nivel1" element={<Nivel1 />} />
        <Route path="/nivel1/:actividad" element={<Nivel1 />} />
        <Route path="/nivel1/escucha-letra" element={<EscuchaLetra />} />
        <Route path="/nivel1/une-imagen" element={<UneImagen />} />
        <Route path="/nivel1/traza-letra" element={<TrazaLetra />} />
        <Route path="/nivel1/memoria" element={<MemoriaLetras />} />
        <Route path="/nivel1/ordena-letras" element={<OrdenaLetras />} />
        <Route path="/nivel1/busca-letra" element={<BuscaLetra />} />
        <Route path="/nivel1/completa-palabra" element={<CompletaPalabra />} />
        <Route path="/nivel1/canta-aprende" element={<CantaAprende />} />

        <Route path="/nivel2" element={<Nivel2 />} />
        <Route path="/nivel2/:actividad" element={<Nivel2 />} />
        <Route path="/nivel2/puente-silabas" element={<PuenteSilabas />} />
        <Route path="/nivel2/frutas-magicas" element={<FrutasMagicas />} />
      </Routes>
    </div>
  );
}

export default App;
