import { useState } from "react";
import { useNavigate } from "react-router-dom";
//import { supabase } from "../core/config/supabase";

export default function ProfileSetup() {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState(5);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStart = async () => {
    if (!nombre.trim()) return;

    setLoading(true);

    // Por ahora, guardamos en localStorage mientras configuramos auth
    localStorage.setItem(
      "alfanica_nino",
      JSON.stringify({
        nombre,
        edad,
        id: "temp_" + Date.now(),
      }),
    );

    setLoading(false);
    navigate("/levels");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-200 to-green-200 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🦜</div>
          <h1 className="text-4xl font-bold text-orange-500">¡AlfaNica!</h1>
          <p className="text-gray-600 mt-2">
            Aprende jugando con el Guardabarranco
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              ¿Cómo te llamas?
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:border-orange-500 text-center text-xl"
              placeholder="Escribe tu nombre"
              maxLength={20}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">
              ¿Cuántos años tienes?
            </label>
            <select
              value={edad}
              onChange={(e) => setEdad(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:border-orange-500"
            >
              {[3, 4, 5, 6, 7, 8].map((e) => (
                <option key={e} value={e}>
                  {e} años
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleStart}
            disabled={!nombre.trim() || loading}
            className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl text-xl mt-4 hover:bg-orange-600 transition disabled:opacity-50"
          >
            {loading ? "Cargando..." : "🚀 ¡Comenzar!"}
          </button>
        </div>
      </div>
    </div>
  );
}
