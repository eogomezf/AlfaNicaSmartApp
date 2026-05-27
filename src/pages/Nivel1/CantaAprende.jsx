// src/pages/Nivel1/CantaAprende.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Canciones para cada letra
const canciones = [
  {
    letra: "A",
    icono: "🐝",
    titulo: "Canción de la A",
    letraCancion: "A, A, A, de Abeja la A,\nA, A, A, con A empieza a volar.",
    duracion: 3000,
    color: "from-red-500 to-orange-500",
  },
  {
    letra: "M",
    icono: "🍎",
    titulo: "Canción de la M",
    letraCancion: "M, M, M, de Mamá la M,\nM, M, M, con M aprendo a querer.",
    duracion: 3000,
    color: "from-orange-500 to-yellow-500",
  },
  {
    letra: "S",
    icono: "☀️",
    titulo: "Canción de la S",
    letraCancion: "S, S, S, de Sol la S,\nS, S, S, con S me iluminaré.",
    duracion: 3000,
    color: "from-yellow-500 to-green-500",
  },
  {
    letra: "P",
    icono: "⚽",
    titulo: "Canción de la P",
    letraCancion: "P, P, P, de Papá la P,\nP, P, P, con P juego sin parar.",
    duracion: 3000,
    color: "from-green-500 to-blue-500",
  },
  {
    letra: "L",
    icono: "🌙",
    titulo: "Canción de la L",
    letraCancion: "L, L, L, de Luna la L,\nL, L, L, con L puedo soñar.",
    duracion: 3000,
    color: "from-blue-500 to-purple-500",
  },
  {
    letra: "E",
    icono: "🐘",
    titulo: "Canción de la E",
    letraCancion: "E, E, E, de Elefante la E,\nE, E, E, con E todo aprenderé.",
    duracion: 3000,
    color: "from-purple-500 to-pink-500",
  },
];

// Función para hablar texto usando Web Speech API
const speakText = (text, onEnd) => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    if (onEnd) utterance.onend = onEnd;
    window.speechSynthesis.speak(utterance);
  }
};

export default function CantaAprende() {
  const navigate = useNavigate();
  const [cancionIndex, setCancionIndex] = useState(0);
  const [estaReproduciendo, setEstaReproduciendo] = useState(false);
  const [puntaje, setPuntaje] = useState(0);
  const [completado, setCompletado] = useState(false);
  const [modoKaraoke, setModoKaraoke] = useState(false);
  const [palabraActual, setPalabraActual] = useState("");
  const [letraIndexActual, setLetraIndexActual] = useState(0);
  const [cancionesCompletadas, setCancionesCompletadas] = useState([]); // ✅ Usamos estado en lugar de ref

  const timeoutRef = useRef(null);

  const cancionActual = canciones[cancionIndex];
  const letraActual = cancionActual.letra;
  const textoCompleto = cancionActual.letraCancion;

  console.log(letraIndexActual);
  console.log(letraActual);
  // Efecto de karaoke: mostrar palabra por palabra
  useEffect(() => {
    if (modoKaraoke && estaReproduciendo) {
      const palabras = textoCompleto.split(/\s+/);
      const intervalo = setInterval(() => {
        setLetraIndexActual((prev) => {
          if (prev < palabras.length - 1) {
            setPalabraActual(palabras[prev]);
            return prev + 1;
          } else {
            setPalabraActual(palabras[palabras.length - 1]);
            clearInterval(intervalo);
            return prev;
          }
        });
      }, 500);
      return () => clearInterval(intervalo);
    }
  }, [modoKaraoke, estaReproduciendo, textoCompleto]);

  const handleReproducir = () => {
    if (estaReproduciendo) return;

    setEstaReproduciendo(true);
    setModoKaraoke(true);
    setLetraIndexActual(0);
    setPalabraActual("");

    speakText(textoCompleto, () => {
      setEstaReproduciendo(false);
      setModoKaraoke(false);

      // Marcar canción como completada (usando estado)
      if (!cancionesCompletadas.includes(cancionIndex)) {
        const nuevasCompletadas = [...cancionesCompletadas, cancionIndex];
        setCancionesCompletadas(nuevasCompletadas);
        const nuevoPuntaje = puntaje + 20;
        setPuntaje(nuevoPuntaje);

        if (cancionIndex + 1 < canciones.length) {
          setTimeout(() => {
            setCancionIndex((prev) => prev + 1);
          }, 1500);
        } else {
          setCompletado(true);
          localStorage.setItem(
            "alfanica_actividad_canta-aprende_completada",
            "true",
          );
          localStorage.setItem(
            "alfanica_puntaje_canta-aprende",
            nuevoPuntaje.toString(),
          );
        }
      }
    });
  };

  const handleRepetir = () => {
    if (estaReproduciendo) return;
    setEstaReproduciendo(true);
    setModoKaraoke(true);
    setLetraIndexActual(0);
    setPalabraActual("");

    speakText(textoCompleto, () => {
      setEstaReproduciendo(false);
      setModoKaraoke(false);
    });
  };

  const handleFinish = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    navigate("/nivel1");
  };

  const letras = ["A", "M", "S", "P", "L", "E"];
  // const letrasCompletadas = cancionesCompletadas.length;

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
            🎵🏆🎉
          </motion.div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            ¡Canta y Aprende!
          </h1>
          <p className="text-gray-600 mb-2">
            Aprendiste las canciones de todas las letras
          </p>
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
              onClick={handleFinish}
              className="w-full bg-orange-500 text-white px-6 py-3 rounded-full text-lg font-bold hover:bg-orange-600 transition flex items-center justify-center gap-2"
            >
              🏆 ¡Completaste el Nivel 1!
            </button>
            <button
              onClick={() => {
                setCancionIndex(0);
                setPuntaje(0);
                setCompletado(false);
                setCancionesCompletadas([]);
              }}
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-bold hover:bg-blue-600 transition flex items-center justify-center gap-2"
            >
              🔄 Jugar de nuevo
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-6">
            🎤 "¡Las letras se aprenden cantando!"
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 to-cyan-500 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header con botón volver y puntaje */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleFinish}
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
            🎵 <strong>Canta y Aprende las Letras</strong>
          </p>
          <p className="text-gray-500 mt-1">
            Escucha la canción, aprende la letra y canta junto con ella
          </p>
        </motion.div>

        {/* Mensaje flotante */}
        <AnimatePresence>
          {estaReproduciendo && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg text-white font-bold text-lg bg-green-500"
            >
              🎵 Reproduciendo canción...
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progreso de letras (corregido - usando estado en lugar de ref) */}
        <div className="bg-white/20 rounded-2xl p-4 mb-6">
          <div className="flex justify-center gap-3">
            {letras.map((letra, idx) => (
              <div
                key={letra}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-all
                  ${
                    cancionesCompletadas.includes(idx) // ✅ Usamos estado, no ref
                      ? "bg-green-500"
                      : idx === cancionIndex
                        ? "bg-white text-teal-600 scale-110 shadow-lg"
                        : "bg-white/30"
                  }`}
              >
                {cancionesCompletadas.includes(idx) ? "✓" : letra}
              </div>
            ))}
          </div>
          <p className="text-center text-white text-sm mt-3">
            Canción {cancionIndex + 1} de {canciones.length}
          </p>
        </div>

        {/* Tarjeta de canción */}
        <motion.div
          key={cancionIndex}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`bg-white rounded-3xl shadow-2xl p-8 text-center bg-gradient-to-br ${cancionActual.color}`}
        >
          {/* Letra grande */}
          <motion.div
            animate={
              estaReproduciendo
                ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }
                : {}
            }
            transition={{ duration: 0.5 }}
            className="text-8xl mb-4"
          >
            {cancionActual.icono}
          </motion.div>

          <h2 className="text-5xl font-bold text-white mb-2">
            {cancionActual.letra}
          </h2>
          <p className="text-white/80 mb-6">{cancionActual.titulo}</p>

          {/* Karaoke */}
          <div className="bg-white/20 rounded-2xl p-6 mb-6 min-h-[120px]">
            {modoKaraoke ? (
              <motion.p
                key={palabraActual}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl text-white font-semibold text-center"
              >
                {palabraActual || "🎤 Escuchando..."}
              </motion.p>
            ) : (
              <p className="text-lg text-white/90 whitespace-pre-line text-center">
                {cancionActual.letraCancion}
              </p>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleReproducir}
              disabled={estaReproduciendo}
              className={`
                px-8 py-3 rounded-full text-white font-bold text-lg transition-all
                flex items-center gap-2
                ${
                  estaReproduciendo
                    ? "bg-white/30 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 hover:scale-105"
                }
              `}
            >
              {estaReproduciendo
                ? "🎵 Reproduciendo..."
                : "▶️ Escuchar Canción"}
            </button>

            <button
              onClick={handleRepetir}
              disabled={estaReproduciendo}
              className={`
                px-8 py-3 rounded-full text-white font-bold text-lg transition-all
                flex items-center gap-2
                ${
                  estaReproduciendo
                    ? "bg-white/30 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 hover:scale-105"
                }
              `}
            >
              🔁 Repetir
            </button>
          </div>
        </motion.div>

        {/* Barra de progreso */}
        <div className="mt-6">
          <div className="flex justify-between text-white text-sm mb-1">
            <span>🎵 Canciones aprendidas</span>
            <span>
              {cancionesCompletadas.length} / {canciones.length}
            </span>
          </div>
          <div className="bg-white/30 rounded-full h-3">
            <motion.div
              className="bg-green-500 rounded-full h-3"
              initial={{ width: 0 }}
              animate={{
                width: `${(cancionesCompletadas.length / canciones.length) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Consejo */}
        <div className="mt-6 bg-white/20 rounded-2xl p-4">
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
              🎤
            </div>
            <p className="text-white text-sm">
              💡 <strong>¡Canta junto con la canción!</strong> Repite la letra y
              el sonido para aprender mejor.
            </p>
          </div>
        </div>

        {/* Mensaje de motivación */}
        {cancionesCompletadas.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center"
          >
            <p className="text-white/80 text-sm">
              🎤 ¡Ya aprendiste {cancionesCompletadas.length} canciones!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
