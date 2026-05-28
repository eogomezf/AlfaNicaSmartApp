// src/pages/Nivel2/index.jsx
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
//import { motion } from "framer-motion";

const actividades = [
  {
    id: "puente-silabas",
    titulo: "🌉 Puente de Sílabas",
    descripcion: "Construye el puente ordenando las sílabas",
    icono: "🌉",
    color: "bg-cyan-500",
    requerido: null,
    clavePuntaje: "alfanica_puntaje_puente-silabas",
  },
  {
    id: "frutas-magicas",
    titulo: "🍎 Frutas Mágicas",
    descripcion: "Recolecta solo las frutas con la sílaba correcta",
    icono: "🍎",
    color: "bg-red-500",
    requerido: "puente-silabas",
    clavePuntaje: "alfanica_puntaje_frutas-magicas",
  },
  {
    id: "canto-guardabarranco",
    titulo: "🎵 Canto del Guardabarranco",
    descripcion: "Escucha y repite la sílaba",
    icono: "🦜",
    color: "bg-green-500",
    requerido: "frutas-magicas",
    clavePuntaje: "alfanica_puntaje_canto-guardabarranco",
  },
  {
    id: "carrera-rio",
    titulo: "🚣 Carrera del Río",
    descripcion: "Forma la sílaba antes de que termine el tiempo",
    icono: "🚣",
    color: "bg-blue-500",
    requerido: "canto-guardabarranco",
    clavePuntaje: "alfanica_puntaje_carrera-rio",
  },
  {
    id: "huevos-sorpresa",
    titulo: "🥚 Huevos Sorpresa",
    descripcion: "Encuentra los pares de sílabas",
    icono: "🥚",
    color: "bg-yellow-500",
    requerido: "carrera-rio",
    clavePuntaje: "alfanica_puntaje_huevos-sorpresa",
  },
  {
    id: "rompecabezas-bosque",
    titulo: "🧩 Rompecabezas del Bosque",
    descripcion: "Une las letras para formar sílabas",
    icono: "🧩",
    color: "bg-purple-500",
    requerido: "huevos-sorpresa",
    clavePuntaje: "alfanica_puntaje_rompecababezas-bosque",
  },
  {
    id: "cueva-secreta",
    titulo: "🕳️ La Cueva Secreta",
    descripcion: "Elige la sílaba inicial de cada imagen",
    icono: "🕳️",
    color: "bg-indigo-500",
    requerido: "rompecabezas-bosque",
    clavePuntaje: "alfanica_puntaje_cueva-secreta",
  },
  {
    id: "tesoro-guardabarranco",
    titulo: "💎 Tesoro del Guardabarranco",
    descripcion: "Explora el mapa y encuentra los cofres",
    icono: "💎",
    color: "bg-amber-500",
    requerido: "cueva-secreta",
    clavePuntaje: "alfanica_puntaje_tesoro-guardabarranco",
  },
];

// Función para cargar progreso y puntajes
const cargarProgresoInicial = () => {
  const savedProgress = {};
  let puntajeTotal = 0;

  for (let i = 0; i < actividades.length; i++) {
    const act = actividades[i];
    const completadaKey = `alfanica_actividad_${act.id}_completada`;
    const completada = localStorage.getItem(completadaKey) === "true";
    savedProgress[act.id] = completada;

    if (completada) {
      const puntajeActividad = localStorage.getItem(act.clavePuntaje);
      if (puntajeActividad) {
        puntajeTotal += parseInt(puntajeActividad, 10);
      }
    }
  }

  return {
    completadas: savedProgress,
    puntajeTotal: puntajeTotal,
  };
};

export default function Nivel2() {
  const navigate = useNavigate();

  const [progreso] = useState(cargarProgresoInicial);

  const actividadesEstado = useMemo(() => {
    return actividades.map((act) => {
      const isCompleted = progreso.completadas[act.id] || false;
      const isUnlocked =
        act.requerido === null || progreso.completadas[act.requerido] === true;
      return { ...act, completada: isCompleted, desbloqueada: isUnlocked };
    });
  }, [progreso]);

  const actividadesCompletadas = actividadesEstado.filter(
    (a) => a.completada,
  ).length;
  const porcentaje = (actividadesCompletadas / actividades.length) * 100;

  const handleActividadClick = (actividad) => {
    if (!actividad.desbloqueada) {
      const actividadRequerida = actividades.find(
        (a) => a.id === actividad.requerido,
      );
      alert(
        `🔒 Para desbloquear "${actividad.titulo}", primero completa "${actividadRequerida?.titulo}"`,
      );
      return;
    }

    // Navegar según la actividad
    // navigate(`/nivel1/${actividad.id}`);
    if (actividad.id === "puente-silabas") navigate("/nivel2/puente-silabas");
    else if (actividad.id === "frutas-magicas")
      navigate("/nivel2/frutas-magicas");
    else if (actividad.id === "canto-guardabarranco")
      navigate("/nivel2/canto-guardabarranco");
    else if (actividad.id === "carrera-rio") navigate("/nivel2/carrera-rio");
    else if (actividad.id === "huevos-sorpresa")
      navigate("/nivel2/huevos-sorpresa");
    else if (actividad.id === "rompecabezas-bosque")
      navigate("/nivel2/rompecabezas-bosque");
    else if (actividad.id === "cueva-secreta")
      navigate("/nivel2/cueva-secreta");
    else if (actividad.id === "tesoro-guardabarranco")
      navigate("/nivel2/tesoro-guardabarranco");
    else {
      alert(
        `🚧 "${actividad.titulo}" estará disponible pronto. ¡Sigue avanzando!`,
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 to-teal-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Botón volver */}
        <button
          onClick={() => navigate("/levels")}
          className="mb-6 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-teal-600 font-semibold flex items-center gap-2 shadow-md hover:bg-white transition"
        >
          ← Volver al Mapa
        </button>

        {/* Título del nivel */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-2">🦜</div>
          <h1 className="text-4xl font-bold text-teal-600">
            Nivel 2: Ruta del Guardabarranco
          </h1>
          <p className="text-gray-600 mt-2">
            ¡Aprende las sílabas jugando con el Guardabarranco!
          </p>

          <div className="mt-3 inline-block bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full px-6 py-2 shadow-lg">
            <span className="text-white font-bold text-xl">
              ⭐ {progreso.puntajeTotal} puntos totales
            </span>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="mb-2 bg-white/50 rounded-full h-3 max-w-md mx-auto">
          <div
            className="bg-teal-500 rounded-full h-3 transition-all duration-500"
            style={{ width: `${porcentaje}%` }}
          />
        </div>
        <p className="text-center text-gray-500 text-sm mb-8">
          Actividad {actividadesCompletadas + 1} de {actividades.length}
        </p>

        {/* Grid de actividades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {actividadesEstado.map((act, idx) => {
            const isCompleted = act.completada;
            const isLocked = !act.desbloqueada && !isCompleted;
            const isActive =
              act.desbloqueada &&
              !isCompleted &&
              actividadesCompletadas === idx;

            return (
              <div
                key={act.id}
                onClick={() => handleActividadClick(act)}
                className={`
                  relative bg-white rounded-2xl p-5 shadow-lg cursor-pointer transition-all transform hover:scale-105
                  ${isLocked ? "opacity-50 grayscale cursor-not-allowed" : "hover:shadow-2xl"}
                  ${isCompleted ? "border-4 border-green-500" : "border-2 border-teal-200"}
                  ${isActive ? "ring-4 ring-teal-300 animate-pulse" : ""}
                `}
              >
                {isCompleted && (
                  <div className="absolute -top-2 -right-2 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs">
                    ✓
                  </div>
                )}
                <div
                  className={`${act.color} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-3 mx-auto shadow-md`}
                >
                  {act.icono}
                </div>
                <h2 className="text-lg font-bold text-center text-gray-800">
                  {act.titulo}
                </h2>
                <p className="text-xs text-gray-500 text-center mt-2">
                  {act.descripcion}
                </p>
                {isLocked && (
                  <div className="text-center mt-2 text-gray-400 text-xs">
                    🔒 Completa "
                    {actividades.find((a) => a.id === act.requerido)?.titulo}"
                  </div>
                )}
                {isCompleted && (
                  <div className="text-center mt-2 text-green-500 text-xs font-semibold">
                    ✅ Completado
                  </div>
                )}
                {isActive && (
                  <div className="text-center mt-2 text-teal-500 text-xs font-semibold animate-pulse">
                    🎯 ¡Jugar ahora!
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mensaje de motivación */}
        <div className="mt-8 text-center bg-teal-200/50 rounded-2xl p-4">
          <p className="text-teal-700 font-medium">
            🦜{" "}
            {actividadesCompletadas === actividades.length
              ? "¡INCREÍBLE! Has completado el Nivel 2. ¡El Guardabarranco está orgulloso de ti!"
              : actividadesCompletadas === 0
                ? "¡Comienza con la primera actividad! Construye el puente de sílabas."
                : `¡Vas excelente! Has completado ${actividadesCompletadas} de ${actividades.length} actividades del Nivel 2. ¡Sigue así!`}
          </p>
        </div>
      </div>
    </div>
  );
}
