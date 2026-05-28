// src/pages/Nivel2/PuenteSilabas.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Banco de palabras con sus sílabas
const palabrasData = [
  {
    id: 1,
    palabra: "MAMÁ",
    silabas: ["MA", "MÁ"],
    imagen: "👩",
    nombre: "Mamá",
  },
  {
    id: 2,
    palabra: "PAPÁ",
    silabas: ["PA", "PÁ"],
    imagen: "👨",
    nombre: "Papá",
  },
  {
    id: 3,
    palabra: "MESA",
    silabas: ["ME", "SA"],
    imagen: "🪑",
    nombre: "Mesa",
  },
  {
    id: 4,
    palabra: "SILLA",
    silabas: ["SI", "LLA"],
    imagen: "🪑",
    nombre: "Silla",
  },
  {
    id: 5,
    palabra: "PERRO",
    silabas: ["PE", "RRO"],
    imagen: "🐕",
    nombre: "Perro",
  },
  {
    id: 6,
    palabra: "GATO",
    silabas: ["GA", "TO"],
    imagen: "🐈",
    nombre: "Gato",
  },
  {
    id: 7,
    palabra: "LUNA",
    silabas: ["LU", "NA"],
    imagen: "🌙",
    nombre: "Luna",
  },
  { id: 8, palabra: "SOL", silabas: ["SOL"], imagen: "☀️", nombre: "Sol" },
];

// Función para desordenar sílabas
const desordenarSilabas = (silabas) => {
  return [...silabas].sort(() => Math.random() - 0.5);
};

export default function PuenteSilabas() {
  const navigate = useNavigate();
  const [palabraIndex, setPalabraIndex] = useState(0);
  const [silabasDesordenadas, setSilabasDesordenadas] = useState([]);
  const [silabasSeleccionadas, setSilabasSeleccionadas] = useState([]);
  const [puntaje, setPuntaje] = useState(0);
  const [mensaje, setMensaje] = useState(null);
  const [respuestaBloqueada, setRespuestaBloqueada] = useState(false);
  const [completado, setCompletado] = useState(false);

  const palabraActual = palabrasData[palabraIndex];

  // Inicializar o reiniciar la palabra actual
  const [prevPalabraIndex, setPrevPalabraIndex] = useState(palabraIndex);
  if (palabraIndex !== prevPalabraIndex) {
    setPrevPalabraIndex(palabraIndex);
    setSilabasDesordenadas(desordenarSilabas(palabraActual.silabas));
    setSilabasSeleccionadas([]);
    setRespuestaBloqueada(false);
    setMensaje(null);
  }

  // Inicializar al cargar
  if (silabasDesordenadas.length === 0 && !completado) {
    setSilabasDesordenadas(desordenarSilabas(palabraActual.silabas));
  }

  const handleSilabaClick = (silaba, idx) => {
    if (respuestaBloqueada) return;

    const nuevasSeleccionadas = [...silabasSeleccionadas, silaba];
    setSilabasSeleccionadas(nuevasSeleccionadas);

    // Eliminar la sílaba de las desordenadas
    const nuevasDesordenadas = [...silabasDesordenadas];
    nuevasDesordenadas.splice(idx, 1);
    setSilabasDesordenadas(nuevasDesordenadas);

    // Verificar si la palabra está completa
    const palabraFormada = nuevasSeleccionadas.join("");

    if (palabraFormada === palabraActual.palabra) {
      // ¡Correcto!
      const nuevoPuntaje = puntaje + 20;
      setPuntaje(nuevoPuntaje);
      setRespuestaBloqueada(true);
      setMensaje({
        texto: `🎉 ¡Construiste el puente! ${palabraActual.nombre} se forma con ${palabraActual.silabas.join(" + ")}`,
        tipo: "correcto",
      });

      setTimeout(() => {
        setMensaje(null);
        if (palabraIndex + 1 < palabrasData.length) {
          setPalabraIndex((prev) => prev + 1);
        } else {
          setCompletado(true);
          localStorage.setItem(
            "alfanica_actividad_puente-silabas_completada",
            "true",
          );
          localStorage.setItem(
            "alfanica_puntaje_puente-silabas",
            nuevoPuntaje.toString(),
          );
        }
      }, 1500);
    } else if (nuevasSeleccionadas.length === palabraActual.silabas.length) {
      // Error: no coincide
      setMensaje({
        texto: `❌ ¡Ups! "${palabraFormada}" no es correcto. Vuelve a intentarlo.`,
        tipo: "incorrecto",
      });

      setTimeout(() => {
        setSilabasDesordenadas(desordenarSilabas(palabraActual.silabas));
        setSilabasSeleccionadas([]);
        setMensaje(null);
      }, 1500);
    }
  };

  const handleReiniciar = () => {
    if (respuestaBloqueada) return;
    setSilabasDesordenadas(desordenarSilabas(palabraActual.silabas));
    setSilabasSeleccionadas([]);
    setMensaje(null);
  };

  const progreso = (palabraIndex / palabrasData.length) * 100;

  // Pantalla de completado
  if (completado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
            className="text-7xl mb-4"
          >
            🌉🏆🦜
          </motion.div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            ¡Puente Completado!
          </h1>
          <p className="text-gray-600 mb-2">Construiste todas las palabras</p>
          <div className="bg-orange-100 rounded-2xl p-4 my-4">
            <p className="text-gray-600 text-sm">Tu puntaje</p>
            <div className="text-5xl font-bold text-orange-500">
              {puntaje} puntos
            </div>
            <div className="flex justify-center gap-1 mt-2">
              {[...Array(Math.min(5, Math.floor(puntaje / 20)))].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-2xl"
                >
                  ⭐
                </motion.span>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/nivel2")}
              className="w-full bg-orange-500 text-white px-6 py-3 rounded-full text-lg font-bold hover:bg-orange-600 transition flex items-center justify-center gap-2"
            >
              📚 Siguiente actividad
            </button>
            <button
              onClick={() => {
                setPalabraIndex(0);
                setPuntaje(0);
                setCompletado(false);
                setSilabasDesordenadas([]);
                setSilabasSeleccionadas([]);
                setRespuestaBloqueada(false);
              }}
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-bold hover:bg-blue-600 transition flex items-center justify-center gap-2"
            >
              🔄 Jugar de nuevo
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-6">
            🦜 "¡Las sílabas construyen palabras! Sigue así"
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 to-teal-500 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/nivel2")}
            className="bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full text-white font-semibold"
          >
            ← Volver
          </button>
          <div className="bg-white rounded-full px-6 py-2 shadow-md">
            <span className="font-bold text-orange-500 text-xl">
              ⭐ {puntaje} pts
            </span>
          </div>
        </div>

        {/* Instrucciones */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/90 rounded-2xl p-4 mb-6 text-center"
        >
          <p className="text-xl text-gray-700">
            🌉 <strong>Puente de Sílabas</strong>
          </p>
          <p className="text-gray-500 mt-1">
            Ordena las sílabas para construir la palabra
          </p>
        </motion.div>

        {/* Mensaje flotante */}
        <AnimatePresence>
          {mensaje && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg text-white font-bold text-lg ${
                mensaje.tipo === "correcto" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {mensaje.texto}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progreso */}
        <div className="mb-6">
          <div className="bg-white/30 rounded-full h-3 max-w-md mx-auto">
            <motion.div
              className="bg-white rounded-full h-3"
              initial={{ width: 0 }}
              animate={{ width: `${progreso}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-center text-white text-sm mt-2">
            Palabra {palabraIndex + 1} de {palabrasData.length}
          </p>
        </div>

        {/* Puente de sílabas */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          {/* Imagen */}
          <div className="text-center mb-6">
            <motion.div
              key={palabraActual.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-8xl mb-2"
            >
              {palabraActual.imagen}
            </motion.div>
            <p className="text-gray-500 text-sm">
              ¿Cómo se forma esta palabra?
            </p>
          </div>

          {/* Zona del puente (sílabas seleccionadas) */}
          <div className="bg-gradient-to-br from-cyan-100 to-teal-100 rounded-2xl p-6 mb-6">
            <div className="flex justify-center items-center gap-4 flex-wrap min-h-[100px]">
              {silabasSeleccionadas.length > 0 ? (
                silabasSeleccionadas.map((silaba, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="bg-teal-500 text-white rounded-xl px-6 py-3 shadow-lg"
                  >
                    <span className="text-2xl font-bold">{silaba}</span>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-400 text-lg">
                  🏗️ Construye tu puente...
                </p>
              )}
            </div>
          </div>

          {/* Bloques de sílabas disponibles */}
          <div className="text-center mb-4">
            <p className="text-gray-600 font-semibold">Bloques disponibles:</p>
          </div>
          <div className="flex justify-center gap-4 flex-wrap">
            {silabasDesordenadas.map((silaba, idx) => (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSilabaClick(silaba, idx)}
                disabled={respuestaBloqueada}
                className="bg-orange-500 text-white rounded-xl px-8 py-4 shadow-lg hover:bg-orange-600 transition-all hover:scale-105 disabled:opacity-50"
              >
                <span className="text-3xl font-bold">{silaba}</span>
              </motion.button>
            ))}
          </div>

          {/* Botón de reinicio */}
          {silabasSeleccionadas.length > 0 && !respuestaBloqueada && (
            <div className="text-center mt-6">
              <button
                onClick={handleReiniciar}
                className="bg-gray-400 text-white px-4 py-2 rounded-full text-sm hover:bg-gray-500 transition"
              >
                🔄 Reiniciar puente
              </button>
            </div>
          )}
        </div>

        {/* Consejo */}
        <div className="bg-white/20 rounded-2xl p-4">
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
              🌉
            </div>
            <p className="text-white text-sm">
              💡 <strong>Consejo:</strong> Mira la imagen y piensa en la
              palabra. Ordena los bloques de sílabas para construirla.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
