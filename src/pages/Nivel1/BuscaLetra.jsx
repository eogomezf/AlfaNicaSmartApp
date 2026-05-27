// src/pages/Nivel1/BuscaLetra.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Colores disponibles para las letras
const coloresLetras = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-cyan-500",
  "bg-rose-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-fuchsia-500",
  "bg-sky-500",
];

// Niveles del juego
const niveles = [
  { letra: "A", icono: "🐝", mensaje: "Encuentra todas las letras A" },
  { letra: "M", icono: "🍎", mensaje: "Encuentra todas las letras M" },
  { letra: "S", icono: "☀️", mensaje: "Encuentra todas las letras S" },
  { letra: "P", icono: "⚽", mensaje: "Encuentra todas las letras P" },
  { letra: "L", icono: "🌙", mensaje: "Encuentra todas las letras L" },
];

// Generar letras aleatorias
const generarLetrasFondo = (letraObjetivo) => {
  const todasLetras = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  const letrasObjetivo = [];
  const letrasDistractores = [];

  for (let i = 0; i < 6; i++) {
    letrasObjetivo.push(letraObjetivo);
  }

  for (let i = 0; i < 18; i++) {
    let letra;
    do {
      letra = todasLetras[Math.floor(Math.random() * todasLetras.length)];
    } while (letra === letraObjetivo);
    letrasDistractores.push(letra);
  }

  const todas = [...letrasObjetivo, ...letrasDistractores];
  return todas.sort(() => Math.random() - 0.5);
};

// Generar colores aleatorios
const generarColoresLetras = (cantidad) => {
  return Array(cantidad)
    .fill()
    .map(() => coloresLetras[Math.floor(Math.random() * coloresLetras.length)]);
};

// Función para crear el estado inicial del nivel
const crearEstadoNivel = (letraObjetivo) => {
  const letras = generarLetrasFondo(letraObjetivo);
  const colores = generarColoresLetras(letras.length);
  return {
    letrasEnPantalla: letras,
    coloresLetras: colores,
    letrasEncontradas: [],
  };
};

export default function BuscaLetra() {
  const navigate = useNavigate();
  const [nivelIndex, setNivelIndex] = useState(0);
  const [puntaje, setPuntaje] = useState(0);
  const [mensaje, setMensaje] = useState(null);
  const [completado, setCompletado] = useState(false);

  // ✅ Estado del nivel actual (se reinicia cuando cambia nivelIndex)
  const [estadoNivel, setEstadoNivel] = useState(() => {
    const nivelActual = niveles[0];
    return crearEstadoNivel(nivelActual.letra);
  });

  const nivelActual = niveles[nivelIndex];
  const letraBuscar = nivelActual.letra;
  const totalLetrasObjetivo = 6;
  const {
    letrasEnPantalla,
    coloresLetras: coloresLetrasState,
    letrasEncontradas,
  } = estadoNivel;
  const totalEncontradas = letrasEncontradas.length;
  const progreso = (totalEncontradas / totalLetrasObjetivo) * 100;

  // ✅ Cuando cambia el nivel, reiniciamos el estado
  const [prevNivelIndex, setPrevNivelIndex] = useState(nivelIndex);
  if (nivelIndex !== prevNivelIndex) {
    setPrevNivelIndex(nivelIndex);
    setEstadoNivel(crearEstadoNivel(niveles[nivelIndex].letra));
  }

  const handleLetraClick = (index) => {
    if (letrasEncontradas.includes(index)) return;
    if (mensaje) return;

    const letra = letrasEnPantalla[index];

    if (letra === letraBuscar) {
      // ¡Encontró una letra!
      const nuevasEncontradas = [...letrasEncontradas, index];
      setEstadoNivel((prev) => ({
        ...prev,
        letrasEncontradas: nuevasEncontradas,
      }));

      const nuevoPuntaje = puntaje + 10;
      setPuntaje(nuevoPuntaje);
      setMensaje({
        texto: `🎉 ¡Encontraste una ${letraBuscar}!`,
        tipo: "correcto",
      });
      setTimeout(() => setMensaje(null), 800);

      // Verificar si encontró todas
      if (nuevasEncontradas.length === totalLetrasObjetivo) {
        setMensaje({
          texto: `✨ ¡Excelente! Encontraste todas las ${letraBuscar}`,
          tipo: "correcto",
        });
        setTimeout(() => {
          setMensaje(null);
          if (nivelIndex + 1 < niveles.length) {
            setNivelIndex((prev) => prev + 1);
          } else {
            setCompletado(true);
            localStorage.setItem(
              "alfanica_actividad_busca-letra_completada",
              "true",
            );
            localStorage.setItem(
              "alfanica_puntaje_busca-letra",
              nuevoPuntaje.toString(),
            );
          }
        }, 1500);
      }
    } else {
      // Letra equivocada
      setMensaje({
        texto: `❌ ¡Ups! Esa es la letra ${letra}, busca la ${letraBuscar}`,
        tipo: "incorrecto",
      });
      setTimeout(() => setMensaje(null), 1200);
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
            🔍🏆🎉
          </motion.div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            ¡Buscador Estrella!
          </h1>
          <p className="text-gray-600 mb-2">Encontraste todas las letras</p>
          <div className="bg-orange-100 rounded-2xl p-4 my-4">
            <p className="text-gray-600 text-sm">Tu puntaje</p>
            <div className="text-5xl font-bold text-orange-500">
              {puntaje} puntos
            </div>
            <div className="flex justify-center gap-1 mt-2">
              {[...Array(Math.min(5, Math.floor(puntaje / 10)))].map((_, i) => (
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
                setNivelIndex(0);
                setPuntaje(0);
                setCompletado(false);
                setEstadoNivel(crearEstadoNivel(niveles[0].letra));
              }}
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-bold hover:bg-blue-600 transition flex items-center justify-center gap-2"
            >
              🔄 Jugar de nuevo
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-6">
            🔎 "¡Tienes ojos de águila! Sigue así"
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-6">
      <div className="max-w-4xl mx-auto">
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

        {/* Instrucciones y nivel actual */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/90 rounded-2xl p-4 mb-6 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-orange-400 to-pink-500 rounded-full px-6 py-2 mb-3 shadow-lg">
            <p className="text-white font-bold text-xl">
              {nivelActual.icono} {nivelActual.mensaje}
            </p>
          </div>
          <p className="text-gray-600">
            🔍 <strong>¿Cuántas letras {letraBuscar} puedes encontrar?</strong>{" "}
            Toca cada una que veas
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

        {/* Progreso del nivel */}
        <div className="mb-6">
          <div className="flex justify-between text-white text-sm mb-1">
            <span>🎯 Letras encontradas</span>
            <span>
              {totalEncontradas} / {totalLetrasObjetivo}
            </span>
          </div>
          <div className="bg-white/30 rounded-full h-3">
            <motion.div
              className="bg-green-500 rounded-full h-3"
              initial={{ width: 0 }}
              animate={{ width: `${progreso}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Tablero de letras */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6">
          <div className="grid grid-cols-6 gap-4">
            {letrasEnPantalla.map((letra, idx) => {
              const yaEncontrada = letrasEncontradas.includes(idx);

              return (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleLetraClick(idx)}
                  disabled={yaEncontrada}
                  className={`
                    aspect-square rounded-xl text-4xl md:text-5xl font-bold transition-all
                    flex items-center justify-center shadow-lg
                    ${
                      yaEncontrada
                        ? "bg-green-500 text-white cursor-default"
                        : `${coloresLetrasState[idx]} text-white hover:scale-105 hover:shadow-xl`
                    }
                    disabled:opacity-60
                  `}
                >
                  {yaEncontrada ? "✓" : letra}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Consejo visual */}
        <div className="mt-6 bg-white/20 rounded-2xl p-4">
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-4xl mb-1">{nivelActual.icono}</div>
              <div className="bg-white rounded-full px-4 py-1 inline-block">
                <p className="text-gray-700 font-bold text-lg">
                  ¡Busca la letra{" "}
                  <span className="text-orange-500">{letraBuscar}</span>!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
