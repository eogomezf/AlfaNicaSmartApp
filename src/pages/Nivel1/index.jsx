import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";

// Definir el orden de desbloqueo
const actividades = [
  {
    id: "escucha-letra",
    titulo: "🔊 Escucha y Selecciona",
    descripcion: "Escucha el sonido y toca la letra correcta",
    icono: "🎧",
    color: "bg-orange-500",
    requerido: null, // Sin requisito, primera actividad
  },
  {
    id: "une-imagen",
    titulo: "🖼️ Une Imagen con Letra",
    descripcion: "Arrastra la imagen hacia su letra inicial",
    icono: "🔗",
    color: "bg-red-500",
    requerido: "escucha-letra", // Requiere completar la primera
  },
  {
    id: "traza-letra",
    titulo: "✍️ Traza la Letra",
    descripcion: "Sigue las líneas punteadas con tu dedo",
    icono: "✏️",
    color: "bg-blue-500",
    requerido: "une-imagen",
  },
  {
    id: "memoria",
    titulo: "🧠 Juego de Memoria",
    descripcion: "Encuentra los pares de letras",
    icono: "🃏",
    color: "bg-purple-500",
    requerido: "traza-letra",
  },
  {
    id: "ordena-letras",
    titulo: "🔤 Ordena las Letras",
    descripcion: "Forma palabras simples",
    icono: "📝",
    color: "bg-green-500",
    requerido: "memoria",
  },
  {
    id: "busca-letra",
    titulo: "🔍 Busca la Letra",
    descripcion: "Encuentra todas las letras escondidas",
    icono: "🕵️",
    color: "bg-yellow-500",
    requerido: "ordena-letras",
  },
  {
    id: "completa-palabra",
    titulo: "✨ Completa la Palabra",
    descripcion: "Rellena la letra faltante",
    icono: "📖",
    color: "bg-pink-500",
    requerido: "busca-letra",
  },
  {
    id: "canta-aprende",
    titulo: "🎵 Canta y Aprende",
    descripcion: "Canciones para aprender las letras",
    icono: "🎤",
    color: "bg-teal-500",
    requerido: "completa-palabra",
  },
];

// Función pura que lee localStorage y devuelve el progreso
const cargarProgresoInicial = () => {
  const savedProgress = {};
  for (let i = 0; i < actividades.length; i++) {
    const key = `alfanica_actividad_${actividades[i].id}_completada`;
    savedProgress[actividades[i].id] = localStorage.getItem(key) === "true";
  }
  const puntaje = localStorage.getItem("alfanica_nivel1_score");
  return {
    ...savedProgress,
    puntaje: puntaje ? parseInt(puntaje, 10) : 0,
  };
};

export default function Nivel1() {
  const navigate = useNavigate();
  const [progreso] = useState(cargarProgresoInicial);
  //const [actividadesEstado, setActividadesEstado] = useState([]);

  const actividadesEstado = useMemo(() => {
    return actividades.map((act) => {
      const isCompleted = progreso[act.id] || false;
      // Primera actividad o si la requerida está completada
      const isUnlocked =
        act.requerido === null || progreso[act.requerido] === true;
      return { ...act, completada: isCompleted, desbloqueada: isUnlocked };
    });
  }, [progreso]);

  const handleActividadClick = (actividad) => {
    if (!actividad.desbloqueada) {
      alert(
        `🔒 Para desbloquear "${actividad.titulo}", primero completa "${actividades.find((a) => a.id === actividad.requerido)?.titulo}"`,
      );
      return;
    }
    // Navegar a la actividad
    navigate(`/nivel1/${actividad.id}`);
  };

  // Calcular progreso general
  const actividadesCompletadas = actividadesEstado.filter(
    (a) => a.completada,
  ).length;
  const porcentaje = (actividadesCompletadas / actividades.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-yellow-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Botón volver */}
        <button
          onClick={() => navigate("/levels")}
          className="mb-6 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-orange-600 font-semibold flex items-center gap-2 shadow-md hover:bg-white transition"
        >
          ← Volver al Mapa
        </button>

        {/* Título del nivel */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-2">🔤</div>
          <h1 className="text-4xl font-bold text-orange-600">
            Nivel 1: Descubriendo Letras
          </h1>
          <p className="text-gray-600 mt-2">¡Aprende las letras jugando!</p>

          {/* Mostrar puntaje total */}
          {progreso.puntaje > 0 && (
            <div className="mt-2 inline-block bg-orange-200 rounded-full px-4 py-1">
              <span className="text-orange-700 font-bold">
                ⭐ {progreso.puntaje} puntos acumulados
              </span>
            </div>
          )}
        </div>

        {/* Barra de progreso general */}
        <div className="mb-2 bg-white/50 rounded-full h-3 max-w-md mx-auto">
          <div
            className="bg-orange-500 rounded-full h-3 transition-all duration-500"
            style={{ width: `${porcentaje}%` }}
          ></div>
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
                  ${isCompleted ? "border-4 border-green-500" : ""}
                  ${isActive ? "ring-4 ring-orange-300 animate-pulse" : ""}
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
                  <div className="text-center mt-2 text-green-500 text-xs">
                    ✅ Completado
                  </div>
                )}
                {isActive && (
                  <div className="text-center mt-2 text-orange-500 text-xs">
                    🎯 ¡Jugar ahora!
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mensaje de motivación */}
        <div className="mt-8 text-center bg-orange-200/50 rounded-2xl p-4">
          <p className="text-orange-700">
            🦜{" "}
            {actividadesCompletadas === actividades.length
              ? "¡INCREÍBLE! Has completado todas las actividades del Nivel 1. ¡Eres un campeón!"
              : actividadesCompletadas === 0
                ? "¡Comienza con la primera actividad! Toca el altavoz para escuchar la letra."
                : `¡Vas excelente! Has completado ${actividadesCompletadas} de ${actividades.length} actividades. ¡Sigue así!`}
          </p>
        </div>
      </div>
    </div>
  );
}
