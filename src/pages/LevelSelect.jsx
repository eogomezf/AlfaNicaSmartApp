import { useNavigate } from "react-router-dom";
import { useState } from "react";

const niveles = [
  {
    id: 1,
    nombre: "Descubriendo Letras",
    icono: "🔤",
    color: "from-red-400 to-orange-400",
    actividades: 8,
    bloqueado: false,
  },
  {
    id: 2,
    nombre: "Ruta del Guardabarranco",
    icono: "🦜",
    color: "from-green-400 to-teal-400",
    actividades: 8,
    bloqueado: false,
  },
  {
    id: 3,
    nombre: "Sendero de Palabras",
    icono: "📖",
    color: "from-blue-400 to-indigo-400",
    actividades: 8,
    bloqueado: true,
  },
  {
    id: 4,
    nombre: "Volcán de Historias",
    icono: "🌋",
    color: "from-purple-400 to-pink-400",
    actividades: 8,
    bloqueado: true,
  },
  {
    id: 5,
    nombre: "Alas de Futuro",
    icono: "🦅",
    color: "from-yellow-400 to-orange-400",
    actividades: 8,
    bloqueado: true,
  },
];

export default function LevelSelect() {
  const navigate = useNavigate();
  const [nino] = useState(() => {
    // Inicialización lazy - mejor práctica para localStorage
    const saved = localStorage.getItem("alfanica_nino");
    return saved ? JSON.parse(saved) : null;
  });

  const handleLevelClick = (nivel) => {
    if (nivel.bloqueado) return;
    if (nivel.id === 1) navigate("/nivel1/escucha-letra");
    if (nivel.id === 2) navigate("/nivel2/puente-silabas");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-100 p-4">
      {/* Header */}
      <div className="text-center pt-4 pb-8">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <div className="text-left">
            <p className="text-gray-600 text-sm">Bienvenido,</p>
            <p className="text-2xl font-bold text-orange-500">
              {nino?.name || nino?.nombre || "Amiguito"}! 🎉
            </p>
          </div>
          <div className="bg-white rounded-full p-3 shadow-md">
            <span className="text-2xl">🦜</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-700 mt-4">
          🌲 Mapa de Aventuras
        </h1>
        <p className="text-gray-500">
          ¡Completa cada nivel para desbloquear el siguiente!
        </p>
      </div>

      {/* Grid de niveles */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {niveles.map((nivel) => (
          <div
            key={nivel.id}
            onClick={() => handleLevelClick(nivel)}
            className={`
              relative bg-gradient-to-br ${nivel.color} rounded-2xl p-6 shadow-lg 
              cursor-pointer transition-all transform hover:scale-105
              ${nivel.bloqueado ? "opacity-50 grayscale cursor-not-allowed" : "hover:shadow-2xl"}
            `}
          >
            {nivel.bloqueado && (
              <div className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1">
                <span className="text-sm">🔒</span>
              </div>
            )}
            <div className="text-5xl text-center mb-3">{nivel.icono}</div>
            <h2 className="text-xl font-bold text-white text-center">
              {nivel.nombre}
            </h2>
            <div className="flex justify-center gap-2 mt-3">
              {[...Array(nivel.actividades)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-white rounded-full opacity-60"
                ></div>
              ))}
            </div>
            <p className="text-white/80 text-center text-sm mt-3">
              {nivel.actividades} actividades
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
