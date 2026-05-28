// src/pages/Nivel2/FrutasMagicas.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Niveles del juego
const niveles = [
  {
    silaba: "MA",
    color: "bg-red-500",
    icono: "🍎",
    mensaje: "¡Recolecta las manzanas con MA!",
  },
  {
    silaba: "PE",
    color: "bg-green-500",
    icono: "🍐",
    mensaje: "¡Recolecta las peras con PE!",
  },
  {
    silaba: "SI",
    color: "bg-blue-500",
    icono: "🍇",
    mensaje: "¡Recolecta las uvas con SI!",
  },
  {
    silaba: "MO",
    color: "bg-purple-500",
    icono: "🍊",
    mensaje: "¡Recolecta las naranjas con MO!",
  },
  {
    silaba: "PU",
    color: "bg-yellow-500",
    icono: "🍍",
    mensaje: "¡Recolecta las piñas con PU!",
  },
];

// Sílabas distractoras
const silabasDistractoras = [
  "PA",
  "SO",
  "PI",
  "MI",
  "LA",
  "LE",
  "LI",
  "LO",
  "LU",
  "TA",
  "TE",
  "TI",
  "TO",
  "TU",
];

// Generar una fruta
const generarFruta = (silabaObjetivo, containerWidth) => {
  const esCorrecta = Math.random() < 0.35;
  const silaba = esCorrecta
    ? silabaObjetivo
    : silabasDistractoras[
        Math.floor(Math.random() * silabasDistractoras.length)
      ];

  const iconos = {
    MA: "🍎",
    ME: "🍏",
    MI: "🍒",
    MO: "🍊",
    MU: "🍑",
    PA: "🍐",
    PE: "🍐",
    PI: "🍍",
    PO: "🍎",
    PU: "🍍",
    SA: "🍓",
    SE: "🍓",
    SI: "🍇",
    SO: "🍊",
    SU: "🍒",
    LA: "🍋",
    LE: "🍋",
    LI: "🍑",
    LO: "🍎",
    LU: "🍓",
    TA: "🍅",
    TE: "🍅",
    TI: "🍈",
    TO: "🍅",
    TU: "🍈",
  };

  const margen = 70;
  const x = Math.random() * (containerWidth - margen * 2) + margen;

  return {
    id: Math.random(),
    silaba: silaba,
    esCorrecta: esCorrecta,
    x: x,
    y: 0,
    icono: iconos[silaba] || "🍎",
  };
};

export default function FrutasMagicas() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(500);
  const [nivelIndex, setNivelIndex] = useState(0);
  const [frutas, setFrutas] = useState([]);
  const [puntaje, setPuntaje] = useState(0);
  const [vidas, setVidas] = useState(3);
  const [mensaje, setMensaje] = useState(null);
  const [completado, setCompletado] = useState(false);
  const [juegoActivo, setJuegoActivo] = useState(true);
  const [gameOver, setGameOver] = useState(false); // Nuevo estado para Game Over

  const intervaloRef = useRef(null);
  const animacionRef = useRef(null);
  const nivelActual = niveles[nivelIndex];
  const silabaObjetivo = nivelActual.silaba;
  const puntosNecesarios = 80;

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
  }, []);

  // Animación de caída de frutas
  const iniciarAnimacionCaida = useCallback(() => {
    if (animacionRef.current) cancelAnimationFrame(animacionRef.current);

    const actualizarPosiciones = () => {
      if (!juegoActivo || gameOver) return;

      setFrutas((prev) => {
        const frutasActualizadas = prev.map((fruta) => ({
          ...fruta,
          y: fruta.y + 2.5,
        }));

        const frutasFiltradas = frutasActualizadas.filter((fruta) => {
          if (fruta.y > 420) {
            if (fruta.esCorrecta) {
              setTimeout(() => {
                setVidas((prevVidas) => {
                  const nuevasVidas = prevVidas - 1;
                  if (nuevasVidas <= 0) {
                    setGameOver(true);
                    setJuegoActivo(false);
                  }
                  return Math.max(0, nuevasVidas);
                });
                setMensaje({
                  texto: `😢 ¡Perdiste una ${silabaObjetivo}!`,
                  tipo: "incorrecto",
                });
                setTimeout(() => setMensaje(null), 1200);
              }, 0);
            }
            return false;
          }
          return true;
        });

        return frutasFiltradas;
      });

      animacionRef.current = requestAnimationFrame(actualizarPosiciones);
    };

    animacionRef.current = requestAnimationFrame(actualizarPosiciones);
  }, [juegoActivo, gameOver, silabaObjetivo]);

  // Generar frutas periódicamente
  const iniciarGeneracionFrutas = useCallback(() => {
    if (intervaloRef.current) clearInterval(intervaloRef.current);

    intervaloRef.current = setInterval(() => {
      if (!juegoActivo || gameOver) return;

      setFrutas((prev) => {
        if (prev.length >= 15) return prev;

        let nuevasFrutas = [...prev];
        const cantidad = Math.floor(Math.random() * 3) + 2;
        for (let i = 0; i < cantidad; i++) {
          if (nuevasFrutas.length < 15) {
            nuevasFrutas.push(generarFruta(silabaObjetivo, containerWidth));
          }
        }
        return nuevasFrutas;
      });
    }, 500);
  }, [juegoActivo, gameOver, silabaObjetivo, containerWidth]);

  useEffect(() => {
    iniciarAnimacionCaida();
    iniciarGeneracionFrutas();

    return () => {
      if (intervaloRef.current) clearInterval(intervaloRef.current);
      if (animacionRef.current) cancelAnimationFrame(animacionRef.current);
    };
  }, [iniciarAnimacionCaida, iniciarGeneracionFrutas, nivelIndex]);

  useEffect(() => {
    if (vidas <= 0 && juegoActivo) {
      setGameOver(true);
      setJuegoActivo(false);
      setMensaje({ texto: "💀 ¡Game Over!", tipo: "incorrecto" });
    }
  }, [vidas, juegoActivo]);

  useEffect(() => {
    if (
      puntaje >= puntosNecesarios &&
      juegoActivo &&
      !completado &&
      !gameOver
    ) {
      setJuegoActivo(false);

      if (nivelIndex + 1 < niveles.length) {
        setMensaje({
          texto: `🎉 ¡Pasaste al nivel ${nivelIndex + 2}!`,
          tipo: "correcto",
        });
        setTimeout(() => {
          setNivelIndex((prev) => prev + 1);
          setPuntaje(0);
          setVidas(3);
          setFrutas([]);
          setJuegoActivo(true);
          setGameOver(false);
          setMensaje(null);
        }, 2000);
      } else {
        setCompletado(true);
        localStorage.setItem(
          "alfanica_actividad_frutas-magicas_completada",
          "true",
        );
        localStorage.setItem(
          "alfanica_puntaje_frutas-magicas",
          puntaje.toString(),
        );
      }
    }
  }, [
    puntaje,
    nivelIndex,
    juegoActivo,
    completado,
    gameOver,
    puntosNecesarios,
  ]);

  const handleFrutaClick = (fruta) => {
    if (!juegoActivo || gameOver) return;

    if (fruta.esCorrecta) {
      const nuevoPuntaje = puntaje + 10;
      setPuntaje(nuevoPuntaje);
      setMensaje({ texto: `🎉 +10 puntos! ${fruta.silaba}`, tipo: "correcto" });
      setTimeout(() => setMensaje(null), 600);
    } else {
      setVidas((prev) => prev - 1);
      setMensaje({
        texto: `❌ ${fruta.silaba} no es ${silabaObjetivo}`,
        tipo: "incorrecto",
      });
      setTimeout(() => setMensaje(null), 600);
    }

    setFrutas((prev) => prev.filter((f) => f.id !== fruta.id));
  };

  const reiniciarJuego = () => {
    setNivelIndex(0);
    setPuntaje(0);
    setVidas(3);
    setFrutas([]);
    setCompletado(false);
    setJuegoActivo(true);
    setGameOver(false);
    setMensaje(null);
    if (intervaloRef.current) clearInterval(intervaloRef.current);
    if (animacionRef.current) cancelAnimationFrame(animacionRef.current);
    setTimeout(() => {
      iniciarAnimacionCaida();
      iniciarGeneracionFrutas();
    }, 100);
  };

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
            🍎🏆🦜
          </motion.div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            ¡Frutas Mágicas!
          </h1>
          <p className="text-gray-600 mb-2">¡Completaste todos los niveles!</p>
          <div className="bg-orange-100 rounded-2xl p-4 my-4">
            <p className="text-gray-600 text-sm">Tu puntaje final</p>
            <div className="text-5xl font-bold text-orange-500">
              {puntaje} puntos
            </div>
          </div>
          <button
            onClick={() => navigate("/nivel2")}
            className="w-full bg-orange-500 text-white px-6 py-3 rounded-full text-lg font-bold hover:bg-orange-600 transition"
          >
            📚 Siguiente actividad
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-emerald-600 p-6 relative">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/nivel2")}
            className="bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full text-white font-semibold"
          >
            ← Volver
          </button>
          <div className="flex gap-3">
            <div className="bg-white rounded-full px-4 py-2 shadow-md">
              <span className="font-bold text-orange-500">⭐ {puntaje}</span>
            </div>
            <div className="bg-white rounded-full px-4 py-2 shadow-md">
              <span className="font-bold text-red-500">❤️ {vidas}</span>
            </div>
          </div>
        </div>

        {/* Instrucciones */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/90 rounded-2xl p-4 mb-6 text-center"
        >
          <div
            className={`inline-block ${nivelActual.color} rounded-full px-4 py-1 mb-2`}
          >
            <span className="text-white font-bold">
              {nivelActual.icono} {nivelActual.mensaje}
            </span>
          </div>
          <p className="text-gray-600">
            🍎 Toca solo las frutas con la sílaba{" "}
            <strong className="text-green-600">{silabaObjetivo}</strong>
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

        {/* Área de juego */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6">
          <div
            ref={containerRef}
            className="relative h-[450px] bg-gradient-to-b from-amber-50 to-green-50 rounded-2xl overflow-hidden"
          >
            <div className="absolute top-2 right-2 bg-black/50 rounded-full px-2 py-1 text-white text-xs z-10">
              🍎 {frutas.length}
            </div>

            {frutas.map((fruta) => (
              <motion.button
                key={fruta.id}
                initial={{ scale: 0 }}
                animate={{
                  y: fruta.y,
                  scale: 1,
                }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.1 }}
                style={{ left: fruta.x, top: 0, position: "absolute" }}
                onClick={() => handleFrutaClick(fruta)}
                className="absolute transform -translate-x-1/2 cursor-pointer"
              >
                <div className="text-6xl hover:scale-110 transition-transform drop-shadow-lg">
                  {fruta.icono}
                </div>
                <div
                  className={`mt-1 px-2 py-0.5 rounded-full text-xs font-bold text-white shadow-md ${fruta.esCorrecta ? "bg-green-500" : "bg-red-500"}`}
                >
                  {fruta.silaba}
                </div>
              </motion.button>
            ))}

            <div className="absolute bottom-2 left-0 right-0 text-center">
              <div className="text-5xl drop-shadow-lg">🧺</div>
              <p className="text-gray-500 text-xs mt-1">
                ¡Toca las frutas para atraparlas!
              </p>
            </div>
          </div>
        </div>

        {/* Progreso */}
        <div className="mb-6">
          <div className="bg-white/30 rounded-full h-3 max-w-md mx-auto">
            <motion.div
              className="bg-yellow-500 rounded-full h-3"
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(100, (puntaje / puntosNecesarios) * 100)}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-center text-white text-sm mt-2">
            Nivel {nivelIndex + 1} de {niveles.length} - {puntaje} /{" "}
            {puntosNecesarios} puntos
          </p>
        </div>

        {/* Consejo */}
        <div className="bg-white/20 rounded-2xl p-4">
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
              🍎
            </div>
            <p className="text-white text-sm">
              💡 <strong>Consejo:</strong> Toca solo las frutas con la sílaba{" "}
              <strong className="text-yellow-200">{silabaObjetivo}</strong>.
              ¡Cuidado con las otras o perderás vidas!
            </p>
          </div>
        </div>
      </div>

      {/* Game Over Modal - Corregido */}
      {gameOver && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 text-center max-w-sm mx-4"
          >
            <div className="text-7xl mb-4">💀</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              ¡Game Over!
            </h2>
            <p className="text-gray-600 mb-2">Te quedaste sin vidas</p>
            <p className="text-gray-500 text-sm mb-6">
              Puntaje: {puntaje} puntos
            </p>
            <div className="space-y-3">
              <button
                onClick={reiniciarJuego}
                className="w-full bg-orange-500 text-white px-6 py-3 rounded-full text-lg font-bold hover:bg-orange-600 transition"
              >
                🔄 Jugar de nuevo
              </button>
              <button
                onClick={() => navigate("/nivel2")}
                className="w-full bg-gray-500 text-white px-6 py-3 rounded-full text-lg font-bold hover:bg-gray-600 transition"
              >
                ← Volver al menú
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
