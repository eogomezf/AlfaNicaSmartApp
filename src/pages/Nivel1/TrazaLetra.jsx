// src/pages/Nivel1/TrazaLetra.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Definición de letras con puntos para trazado
const letrasParaTrazar = [
  {
    letra: "A",
    mayuscula: true,
    puntos: [
      { x: 250, y: 240 }, // punto 1: base izquierda
      { x: 300, y: 100 }, // punto 1: vértice superior
      { x: 350, y: 240 }, // punto 2: base derecha
      { x: 275, y: 180 }, // punto 3: centro izquierda
      { x: 325, y: 180 }, // punto 4: centro derecha
    ],
    orden: [0, 1, 2, 3, 4],
    conexiones: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
  },
  {
    letra: "M",
    mayuscula: true,
    puntos: [
      { x: 250, y: 180 }, // punto 1: base izquierda
      { x: 250, y: 100 }, // punto 2: pico izquierdo
      { x: 300, y: 140 }, // punto 3: centro bajo
      { x: 350, y: 100 }, // punto 4: pico derecho
      { x: 350, y: 180 }, // punto 5: base derecha
    ],
    orden: [0, 1, 2, 3, 4],
    conexiones: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
  },
  {
    letra: "S",
    mayuscula: true,
    puntos: [
      { x: 325, y: 100 }, // punto 1: superior derecha
      { x: 275, y: 100 }, // punto 2: superior izquierda
      { x: 250, y: 140 }, // punto 3: medio izquierda
      { x: 275, y: 170 }, // punto 4: inferior izquierda
      { x: 325, y: 170 }, // punto 5: inferior derecha
      { x: 350, y: 200 }, // punto 6: inferior derecha
      { x: 325, y: 240 }, // punto 7: inferior derecha
      { x: 275, y: 240 }, // punto 8: inferior derecha
    ],
    orden: [0, 1, 2, 3, 4, 5, 6, 7],
    conexiones: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
    ],
  },
  {
    letra: "L",
    mayuscula: true,
    puntos: [
      { x: 260, y: 100 }, // punto 1: superior
      { x: 260, y: 180 }, // punto 2: inferior
      { x: 340, y: 180 }, // punto 3: base derecha
    ],
    orden: [0, 1, 2],
    conexiones: [
      [0, 1],
      [1, 2],
    ],
  },
];

export default function TrazaLetra() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [letraIndex, setLetraIndex] = useState(0);
  const [trazosCompletados, setTrazosCompletados] = useState([]);
  const [puntoActual, setPuntoActual] = useState(null);
  const [estaArrastrando, setEstaArrastrando] = useState(false);
  const [posicionArrastre, setPosicionArrastre] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [puntaje, setPuntaje] = useState(0);
  const [completado, setCompletado] = useState(false);

  const letraActual = letrasParaTrazar[letraIndex];
  const ctxRef = useRef(null);

  // ✅ FUNCIÓN dibujarCanvas - DECLARADA PRIMERO
  const dibujarCanvas = () => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;

    if (!ctx || !canvas) return;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fondo blanco con borde
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 2;
    ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

    // Dibujar líneas guía (punteadas) para los trazos pendientes
    letraActual.conexiones.forEach((conexion, idx) => {
      if (trazosCompletados.includes(idx)) return;

      const p1 = letraActual.puntos[conexion[0]];
      const p2 = letraActual.puntos[conexion[1]];

      ctx.beginPath();
      ctx.setLineDash([8, 8]);
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 3;
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // Dibujar líneas ya completadas (sólidas y verdes)
    letraActual.conexiones.forEach((conexion, idx) => {
      if (!trazosCompletados.includes(idx)) return;

      const p1 = letraActual.puntos[conexion[0]];
      const p2 = letraActual.puntos[conexion[1]];

      ctx.beginPath();
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 5;
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      // Círculo verde en el punto de inicio
      ctx.beginPath();
      ctx.arc(p1.x, p1.y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = "#22c55e";
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.font = "bold 14px Arial";
      ctx.fillText((conexion[0] + 1).toString(), p1.x - 4, p1.y + 5);
    });

    // Dibujar línea actual mientras se arrastra
    if (estaArrastrando && puntoActual !== null && posicionArrastre) {
      const puntoOrigen = letraActual.puntos[puntoActual];
      ctx.beginPath();
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 5;
      ctx.moveTo(puntoOrigen.x, puntoOrigen.y);
      ctx.lineTo(posicionArrastre.x, posicionArrastre.y);
      ctx.stroke();
    }

    // Dibujar todos los puntos
    letraActual.puntos.forEach((punto, idx) => {
      const estaConectado = trazosCompletados.some((trazoIdx) =>
        letraActual.conexiones[trazoIdx]?.includes(idx),
      );

      let colorFondo = "#cbd5e1";
      let colorTexto = "#64748b";

      if (estaConectado) {
        colorFondo = "#22c55e";
        colorTexto = "white";
      } else if (puntoActual === idx && estaArrastrando) {
        colorFondo = "#f97316";
        colorTexto = "white";
      }

      ctx.beginPath();
      ctx.arc(punto.x, punto.y, 12, 0, 2 * Math.PI);
      ctx.fillStyle = colorFondo;
      ctx.fill();
      ctx.fillStyle = colorTexto;
      ctx.font = "bold 16px Arial";
      ctx.fillText((idx + 1).toString(), punto.x - 5, punto.y + 6);

      ctx.beginPath();
      ctx.arc(punto.x, punto.y, 12, 0, 2 * Math.PI);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  };

  // ✅ useEffect para inicializar canvas - AHORA dibujarCanvas ya está declarada
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;
    dibujarCanvas();
  }, [
    letraIndex,
    trazosCompletados,
    puntoActual,
    posicionArrastre,
    estaArrastrando,
  ]);

  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;

    if (e.touches) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const encontrarPuntoCercano = (x, y, radio = 20) => {
    for (let i = 0; i < letraActual.puntos.length; i++) {
      const punto = letraActual.puntos[i];
      const distancia = Math.sqrt((x - punto.x) ** 2 + (y - punto.y) ** 2);
      if (distancia < radio) return i;
    }
    return -1;
  };

  const handleStart = (e) => {
    e.preventDefault();
    const { x, y } = getCanvasCoords(e);
    const puntoIdx = encontrarPuntoCercano(x, y);

    if (puntoIdx === -1) return;

    const siguienteTrazo = trazosCompletados.length;
    const conexionEsperada = letraActual.conexiones[siguienteTrazo];

    if (conexionEsperada && conexionEsperada[0] === puntoIdx) {
      setPuntoActual(puntoIdx);
      setEstaArrastrando(true);
      setPosicionArrastre({ x, y });
    } else {
      const puntoEsperado = conexionEsperada?.[0] + 1 || 1;
      setMensaje({
        texto: `✏️ Empieza desde el punto ${puntoEsperado}`,
        tipo: "info",
      });
      setTimeout(() => setMensaje(null), 1500);
    }
  };

  const handleMove = (e) => {
    if (!estaArrastrando || puntoActual === null) return;
    e.preventDefault();

    const { x, y } = getCanvasCoords(e);
    setPosicionArrastre({ x, y });

    const siguienteTrazo = trazosCompletados.length;
    const conexionEsperada = letraActual.conexiones[siguienteTrazo];

    if (conexionEsperada) {
      const puntoDestino = conexionEsperada[1];
      const destinoCercano = encontrarPuntoCercano(x, y, 25);

      if (destinoCercano === puntoDestino) {
        const nuevosTrazos = [...trazosCompletados, siguienteTrazo];
        setTrazosCompletados(nuevosTrazos);
        setEstaArrastrando(false);
        setPuntoActual(null);
        setPosicionArrastre(null);

        setMensaje({ texto: "✓ ¡Bien hecho! Continúa", tipo: "correcto" });
        setTimeout(() => setMensaje(null), 800);

        if (nuevosTrazos.length === letraActual.conexiones.length) {
          const nuevoPuntaje = puntaje + 20;
          setPuntaje(nuevoPuntaje);
          setMensaje({
            texto: `🎉 ¡Excelente! Completaste la letra ${letraActual.letra}`,
            tipo: "correcto",
          });

          setTimeout(() => {
            setMensaje(null);
            if (letraIndex + 1 < letrasParaTrazar.length) {
              setLetraIndex((prev) => prev + 1);
              setTrazosCompletados([]);
            } else {
              setCompletado(true);
              localStorage.setItem(
                "alfanica_puntaje_traza-letra",
                nuevoPuntaje.toString(),
              );
              localStorage.setItem(
                "alfanica_actividad_traza-letra_completada",
                "true",
              );
            }
          }, 1500);
        }
      }
    }
  };

  const handleEnd = (e) => {
    console.log(e);
    if (estaArrastrando) {
      setEstaArrastrando(false);
      setPuntoActual(null);
      setPosicionArrastre(null);
      setMensaje({
        texto: "✏️ Vuelve a intentarlo, arrastra hasta el punto",
        tipo: "info",
      });
      setTimeout(() => setMensaje(null), 1500);
    }
  };

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
            ✍️🏆🦜
          </motion.div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            ¡Manos Mágicas!
          </h1>
          <p className="text-gray-600 mb-2">Trazaste todas las letras</p>
          <div className="bg-orange-100 rounded-2xl p-4 my-4">
            <p className="text-gray-600 text-sm">Puntaje obtenido</p>
            <div className="text-5xl font-bold text-orange-500">
              {puntaje} puntos
            </div>
          </div>
          <button
            onClick={() => navigate("/nivel1")}
            className="w-full bg-orange-500 text-white px-6 py-3 rounded-full text-lg font-bold hover:bg-orange-600 transition"
          >
            📚 Siguiente actividad
          </button>
        </motion.div>
      </div>
    );
  }

  const trazosRestantes =
    letraActual.conexiones.length - trazosCompletados.length;

  console.log(trazosRestantes);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-indigo-500 p-6">
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
            ✍️ <strong>Traza la letra siguiendo los números</strong>
          </p>
          <p className="text-gray-500 mt-1">
            Mantén presionado el punto {trazosCompletados.length + 1} y arrastra
            hasta el punto {trazosCompletados.length + 2}
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
                mensaje.tipo === "correcto"
                  ? "bg-green-500"
                  : mensaje.tipo === "incorrecto"
                    ? "bg-red-500"
                    : "bg-blue-500"
              }`}
            >
              {mensaje.texto}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Área de trazado */}
        <div className="bg-white rounded-3xl shadow-2xl p-4 mb-6">
          <div className="text-center mb-4">
            <h2 className="text-4xl font-bold text-gray-800">
              Traza la letra {letraActual.letra}
            </h2>
            <p className="text-gray-500">
              {letraIndex + 1} de {letrasParaTrazar.length} letras
            </p>
          </div>

          <canvas
            ref={canvasRef}
            width={600}
            height={280}
            className="w-full h-auto rounded-xl border-2 border-gray-200 touch-none"
            style={{ background: "white", cursor: "crosshair" }}
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
          />
        </div>

        {/* Progreso */}
        <div className="mt-4">
          <div className="bg-white/30 rounded-full h-4 max-w-md mx-auto">
            <div
              className="bg-green-500 rounded-full h-4 transition-all duration-300"
              style={{
                width: `${(trazosCompletados.length / letraActual.conexiones.length) * 100}%`,
              }}
            />
          </div>
          <p className="text-center text-white mt-2 font-semibold">
            Trazos completados: {trazosCompletados.length} de{" "}
            {letraActual.conexiones.length}
          </p>
        </div>

        {/* Ayuda visual */}
        <div className="mt-6 bg-white/20 rounded-2xl p-4">
          <p className="text-white text-center text-sm">
            💡 <strong>Consejo:</strong> Toca y mantén presionado el punto{" "}
            {trazosCompletados.length + 1}, luego arrastra hasta el punto{" "}
            {trazosCompletados.length + 2} siguiendo la línea punteada.
          </p>
        </div>
      </div>
    </div>
  );
}
