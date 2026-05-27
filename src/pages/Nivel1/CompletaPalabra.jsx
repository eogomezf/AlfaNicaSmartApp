// src/pages/Nivel1/CompletaPalabra.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Banco de palabras con espacio vacío
const palabrasData = [
  {
    id: 1,
    palabraCompleta: "SOL",
    palabraConHueco: "S_L",
    letraFaltante: "O",
    imagen: "☀️",
    nombre: "Sol",
  },
  {
    id: 2,
    palabraCompleta: "LUNA",
    palabraConHueco: "L_NA",
    letraFaltante: "U",
    imagen: "🌙",
    nombre: "Luna",
  },
  {
    id: 3,
    palabraCompleta: "MESA",
    palabraConHueco: "ME_A",
    letraFaltante: "S",
    imagen: "🪑",
    nombre: "Mesa",
  },
  {
    id: 4,
    palabraCompleta: "CASA",
    palabraConHueco: "C_SA",
    letraFaltante: "A",
    imagen: "🏠",
    nombre: "Casa",
  },
  {
    id: 5,
    palabraCompleta: "PERRO",
    palabraConHueco: "PE_RO",
    letraFaltante: "R",
    imagen: "🐕",
    nombre: "Perro",
  },
  {
    id: 6,
    palabraCompleta: "GATO",
    palabraConHueco: "G_TO",
    letraFaltante: "A",
    imagen: "🐈",
    nombre: "Gato",
  },
  {
    id: 7,
    palabraCompleta: "MANO",
    palabraConHueco: "MA_O",
    letraFaltante: "N",
    imagen: "✋",
    nombre: "Mano",
  },
  {
    id: 8,
    palabraCompleta: "PELOTA",
    palabraConHueco: "PEL_T",
    letraFaltante: "O",
    imagen: "⚽",
    nombre: "Pelota",
  },
];

// Generar opciones (1 correcta + 2 distractores)
const generarOpciones = (letraCorrecta) => {
  const letrasPosibles = [
    "A",
    "E",
    "I",
    "O",
    "U",
    "M",
    "P",
    "S",
    "L",
    "N",
    "R",
    "T",
  ];
  const otrasLetras = letrasPosibles.filter((l) => l !== letraCorrecta);
  const distractores = [...otrasLetras]
    .sort(() => Math.random() - 0.5)
    .slice(0, 2);
  const opciones = [
    { letra: letraCorrecta, esCorrecta: true },
    { letra: distractores[0], esCorrecta: false },
    { letra: distractores[1], esCorrecta: false },
  ];
  return opciones.sort(() => Math.random() - 0.5);
};

export default function CompletaPalabra() {
  const navigate = useNavigate();
  const [palabraIndex, setPalabraIndex] = useState(0);
  const [opciones, setOpciones] = useState([]);
  const [puntaje, setPuntaje] = useState(0);
  const [mensaje, setMensaje] = useState(null);
  const [respuestaBloqueada, setRespuestaBloqueada] = useState(false);
  const [completado, setCompletado] = useState(false);
  const [letraSeleccionada, setLetraSeleccionada] = useState(null); // Para mostrar la letra en el hueco
  const [mostrarPalabraCompleta, setMostrarPalabraCompleta] = useState(false); // Para mostrar la palabra completa

  const palabraActual = palabrasData[palabraIndex];
  const letraCorrecta = palabraActual.letraFaltante;

  // Generar opciones cuando cambia la palabra
  const [prevPalabraIndex, setPrevPalabraIndex] = useState(palabraIndex);
  if (palabraIndex !== prevPalabraIndex) {
    setPrevPalabraIndex(palabraIndex);
    setOpciones(generarOpciones(letraCorrecta));
    setRespuestaBloqueada(false);
    setMensaje(null);
    setLetraSeleccionada(null);
    setMostrarPalabraCompleta(false);
  }

  // Inicializar opciones al cargar
  if (opciones.length === 0 && !completado) {
    setOpciones(generarOpciones(letraCorrecta));
  }

  const handleLetraClick = (letra, esCorrecta) => {
    if (respuestaBloqueada) return;

    setLetraSeleccionada(letra);

    if (esCorrecta) {
      // ¡Correcto! Mostrar la palabra completa
      const nuevoPuntaje = puntaje + 15;
      setPuntaje(nuevoPuntaje);
      setRespuestaBloqueada(true);
      setMostrarPalabraCompleta(true);
      setMensaje({
        texto: `🎉 ¡Correcto! ${palabraActual.nombre} se escribe ${palabraActual.palabraCompleta}`,
        tipo: "correcto",
      });

      setTimeout(() => {
        setMensaje(null);
        if (palabraIndex + 1 < palabrasData.length) {
          setPalabraIndex((prev) => prev + 1);
        } else {
          setCompletado(true);
          localStorage.setItem(
            "alfanica_actividad_completa-palabra_completada",
            "true",
          );
          localStorage.setItem(
            "alfanica_puntaje_completa-palabra",
            nuevoPuntaje.toString(),
          );
        }
      }, 1500);
    } else {
      // Incorrecto
      setMensaje({
        texto: `❌ ¡Ups! La letra ${letra} no es correcta. ¡Sigue intentando!`,
        tipo: "incorrecto",
      });
      setTimeout(() => {
        setMensaje(null);
        setLetraSeleccionada(null);
      }, 1200);
    }
  };

  // Dividir la palabra para mostrar las partes
  const [parte1, parte2] = palabraActual.palabraConHueco.split("_");

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
            ✨🏆🎉
          </motion.div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            ¡Completaste las palabras!
          </h1>
          <p className="text-gray-600 mb-2">
            Aprendiste {palabrasData.length} palabras
          </p>
          <div className="bg-orange-100 rounded-2xl p-4 my-4">
            <p className="text-gray-600 text-sm">Tu puntaje</p>
            <div className="text-5xl font-bold text-orange-500">
              {puntaje} puntos
            </div>
            <div className="flex justify-center gap-1 mt-2">
              {[...Array(Math.min(5, Math.floor(puntaje / 15)))].map((_, i) => (
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
              onClick={() => navigate("/nivel1")}
              className="w-full bg-orange-500 text-white px-6 py-3 rounded-full text-lg font-bold hover:bg-orange-600 transition flex items-center justify-center gap-2"
            >
              📚 Siguiente actividad
            </button>
            <button
              onClick={() => {
                setPalabraIndex(0);
                setPuntaje(0);
                setCompletado(false);
                setOpciones([]);
                setRespuestaBloqueada(false);
                setLetraSeleccionada(null);
                setMostrarPalabraCompleta(false);
              }}
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-bold hover:bg-blue-600 transition flex items-center justify-center gap-2"
            >
              🔄 Jugar de nuevo
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-6">
            📖 "¡Las palabras ya no tienen secretos para ti! Sigue así"
          </p>
        </motion.div>
      </div>
    );
  }

  const progreso = (palabraIndex / palabrasData.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 to-rose-500 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/nivel1")}
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
            ✨ <strong>Completa la Palabra</strong>
          </p>
          <p className="text-gray-500 mt-1">
            ¿Qué letra falta? Elige la respuesta correcta
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

        {/* Palabra actual */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 text-center">
          {/* Imagen */}
          <motion.div
            key={palabraActual.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-8xl mb-6"
          >
            {palabraActual.imagen}
          </motion.div>

          {/* Palabra con espacio o completa */}
          <motion.div
            className="flex justify-center items-center gap-2 mb-8"
            animate={mostrarPalabraCompleta ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {!mostrarPalabraCompleta ? (
              // Modo normal: muestra el hueco
              <>
                <span className="text-5xl font-bold text-gray-800">
                  {parte1}
                </span>
                <div
                  className={`w-20 h-20 rounded-xl flex items-center justify-center border-4 shadow-inner transition-all duration-300
                  ${
                    letraSeleccionada && letraSeleccionada !== letraCorrecta
                      ? "bg-red-100 border-red-400"
                      : "bg-orange-100 border-orange-300"
                  }`}
                >
                  <span
                    className={`text-3xl font-bold transition-all duration-300
                    ${
                      letraSeleccionada && letraSeleccionada !== letraCorrecta
                        ? "text-red-500 line-through"
                        : letraSeleccionada === letraCorrecta
                          ? "text-green-500 scale-125"
                          : "text-orange-400"
                    }`}
                  >
                    {letraSeleccionada ? letraSeleccionada : "?"}
                  </span>
                </div>
                <span className="text-5xl font-bold text-gray-800">
                  {parte2}
                </span>
              </>
            ) : (
              // Modo acierto: muestra la palabra completa en verde
              <div className="flex items-center gap-2">
                <span className="text-5xl font-bold text-green-600">
                  {palabraActual.palabraCompleta}
                </span>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-4xl"
                >
                  ✓
                </motion.span>
              </div>
            )}
          </motion.div>

          {/* Opciones - solo mostrar si no se acertó */}
          {!mostrarPalabraCompleta && (
            <div className="flex justify-center gap-6 flex-wrap">
              {opciones.map((opt, idx) => (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleLetraClick(opt.letra, opt.esCorrecta)}
                  disabled={respuestaBloqueada}
                  className={`
                    w-24 h-24 rounded-2xl text-5xl font-bold transition-all
                    shadow-lg hover:scale-105
                    ${
                      respuestaBloqueada
                        ? "bg-gray-300 text-gray-500 cursor-default"
                        : "bg-gradient-to-br from-orange-400 to-orange-600 text-white hover:shadow-xl"
                    }
                    disabled:opacity-50
                  `}
                >
                  {opt.letra}
                </motion.button>
              ))}
            </div>
          )}

          {/* Mensaje de éxito adicional */}
          {mostrarPalabraCompleta && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-green-100 rounded-2xl p-3"
            >
              <p className="text-green-700 font-semibold">
                ¡Excelente! "{palabraActual.palabraCompleta}" se escribe así
              </p>
            </motion.div>
          )}
        </div>

        {/* Ayuda visual */}
        <div className="bg-white/20 rounded-2xl p-4">
          <p className="text-white text-center text-sm">
            💡 <strong>Consejo:</strong> Mira la imagen y piensa en la palabra.
            ¿Qué letra falta para completarla?
          </p>
        </div>
      </div>
    </div>
  );
}
