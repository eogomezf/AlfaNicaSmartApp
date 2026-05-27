// src/pages/Nivel1/index.jsx
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
//import { motion } from 'framer-motion'  // ✅ Importación necesaria

const actividades = [
  {
    id: "escucha-letra",
    titulo: "🔊 Escucha y Selecciona",
    descripcion: "Escucha el sonido y toca la letra correcta",
    icono: "🎧",
    color: "bg-orange-500",
    requerido: null,
    clavePuntaje: "alfanica_puntaje_escucha-letra",
  },
  {
    id: "une-imagen",
    titulo: "🖼️ Une Imagen con Letra",
    descripcion: "Arrastra la imagen hacia su letra inicial",
    icono: "🔗",
    color: "bg-red-500",
    requerido: "escucha-letra",
    clavePuntaje: "alfanica_puntaje_une-imagen",
  },
  {
    id: "traza-letra",
    titulo: "✍️ Traza la Letra",
    descripcion: "Sigue las líneas punteadas con tu dedo",
    icono: "✏️",
    color: "bg-blue-500",
    requerido: "une-imagen",
    clavePuntaje: "alfanica_puntaje_traza-letra",
  },
  {
    id: "memoria",
    titulo: "🧠 Juego de Memoria",
    descripcion: "Encuentra los pares de letras",
    icono: "🃏",
    color: "bg-purple-500",
    requerido: "traza-letra",
    clavePuntaje: "alfanica_puntaje_memoria",
  },
  {
    id: "ordena-letras",
    titulo: "🔤 Ordena las Letras",
    descripcion: "Forma palabras simples",
    icono: "📝",
    color: "bg-green-500",
    requerido: "memoria",
    clavePuntaje: "alfanica_puntaje_ordena-letras",
  },
  {
    id: "busca-letra",
    titulo: "🔍 Busca la Letra",
    descripcion: "Encuentra todas las letras escondidas",
    icono: "🕵️",
    color: "bg-yellow-500",
    requerido: "ordena-letras",
    clavePuntaje: "alfanica_puntaje_busca-letra",
  },
  {
    id: "completa-palabra",
    titulo: "✨ Completa la Palabra",
    descripcion: "Rellena la letra faltante",
    icono: "📖",
    color: "bg-pink-500",
    requerido: "busca-letra",
    clavePuntaje: "alfanica_puntaje_completa-palabra",
  },
  {
    id: "canta-aprende",
    titulo: "🎵 Canta y Aprende",
    descripcion: "Canciones para aprender las letras",
    icono: "🎤",
    color: "bg-teal-500",
    requerido: "completa-palabra",
    clavePuntaje: "alfanica_puntaje_canta-aprende",
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

    // Sumar puntaje si la actividad está completada
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

export default function Nivel1() {
  const navigate = useNavigate();

  // Estado inicial con los datos cargados
  const [progreso] = useState(cargarProgresoInicial);

  // Calcular estado de cada actividad
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
    navigate(`/nivel1/${actividad.id}`);
    // if (actividad.id === "escucha-letra") navigate("/nivel1/escucha-letra");
    // else if (actividad.id === "une-imagen") navigate("/nivel1/une-imagen");
    // else if (actividad.id === "traza-letra") navigate("/nivel1/traza-letra");
    // else {
    //   // Para las demás, mostrar mensaje de construcción
    //   alert(
    //     `🚧 "${actividad.titulo}" estará disponible pronto. ¡Sigue avanzando!`,
    //   );
    // }
  };

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

          {/* Mostrar puntaje TOTAL acumulado */}
          <div className="mt-3 inline-block bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full px-6 py-2 shadow-lg">
            <span className="text-white font-bold text-xl">
              ⭐ {progreso.puntajeTotal} puntos totales
            </span>
          </div>
        </div>

        {/* Barra de progreso general */}
        <div className="mb-2 bg-white/50 rounded-full h-3 max-w-md mx-auto">
          <div
            className="bg-orange-500 rounded-full h-3 transition-all duration-500"
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
                  ${isCompleted ? "border-4 border-green-500" : "border-2 border-orange-200"}
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
                  <div className="text-center mt-2 text-green-500 text-xs font-semibold">
                    ✅ Completado
                  </div>
                )}
                {isActive && (
                  <div className="text-center mt-2 text-orange-500 text-xs font-semibold animate-pulse">
                    🎯 ¡Jugar ahora!
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mensaje de motivación */}
        <div className="mt-8 text-center bg-orange-200/50 rounded-2xl p-4">
          <p className="text-orange-700 font-medium">
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
