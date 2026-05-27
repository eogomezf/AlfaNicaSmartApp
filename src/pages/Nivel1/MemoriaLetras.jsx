// src/pages/Nivel1/MemoriaLetras.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Datos de las cartas (cada objeto es una pareja)
const paresIniciales = [
  { id: 1, letra: "A", imagen: "🐝", nombre: "Abeja" },
  { id: 2, letra: "M", imagen: "🍎", nombre: "Manzana" },
  { id: 3, letra: "S", imagen: "☀️", nombre: "Sol" },
  { id: 4, letra: "P", imagen: "⚽", nombre: "Pelota" },
  { id: 5, letra: "L", imagen: "🌙", nombre: "Luna" },
  { id: 6, letra: "E", imagen: "🐘", nombre: "Elefante" },
];

// Función para crear el mazo de cartas (cada par aparece dos veces)
const crearMazo = () => {
  const mazo = [];
  paresIniciales.forEach((par) => {
    // Carta 1: Muestra la letra
    mazo.push({
      id: `${par.id}-letra`,
      parId: par.id,
      tipo: "letra",
      contenido: par.letra,
      nombre: par.nombre,
      estaVolteada: false,
      estaEmparejada: false,
    });
    // Carta 2: Muestra la imagen
    mazo.push({
      id: `${par.id}-imagen`,
      parId: par.id,
      tipo: "imagen",
      contenido: par.imagen,
      nombre: par.nombre,
      estaVolteada: false,
      estaEmparejada: false,
    });
  });
  // Mezclar cartas aleatoriamente
  return mazo.sort(() => Math.random() - 0.5);
};

export default function MemoriaLetras() {
  const navigate = useNavigate();

  // ✅ Inicialización diferida - se ejecuta UNA SOLA vez al montar el componente
  const [cartas, setCartas] = useState(() => crearMazo());
  const [indiceCartaSeleccionada, setIndiceCartaSeleccionada] = useState(null);
  const [puntaje, setPuntaje] = useState(0);
  const [mensaje, setMensaje] = useState(null);
  const [bloquearTablero, setBloquearTablero] = useState(false);
  const [juegoCompletado, setJuegoCompletado] = useState(false);

  // ✅ Función para reiniciar el juego (se usa en el botón "Jugar de nuevo")
  const reiniciarJuego = () => {
    const nuevoMazo = crearMazo();
    setCartas(nuevoMazo);
    setIndiceCartaSeleccionada(null);
    setPuntaje(0);
    setMensaje(null);
    setBloquearTablero(false);
    setJuegoCompletado(false);
  };

  const handleCartaClick = (indice) => {
    // Validaciones
    if (bloquearTablero) return;
    if (juegoCompletado) return;

    const carta = cartas[indice];
    if (carta.estaEmparejada) return;
    if (carta.estaVolteada) return;
    if (indiceCartaSeleccionada === indice) return;

    // Voltear la carta
    const nuevasCartas = [...cartas];
    nuevasCartas[indice].estaVolteada = true;
    setCartas(nuevasCartas);

    // Si es la primera carta seleccionada
    if (indiceCartaSeleccionada === null) {
      setIndiceCartaSeleccionada(indice);
      return;
    }

    // Si ya hay una carta seleccionada, verificar pareja
    const primeraCarta = cartas[indiceCartaSeleccionada];
    const segundaCarta = carta;

    // Verificar si forman pareja (mismo parId)
    const esPareja = primeraCarta.parId === segundaCarta.parId;

    if (esPareja) {
      // ¡Acierto!
      const nuevasCartasAcierto = [...cartas];
      nuevasCartasAcierto[indiceCartaSeleccionada].estaEmparejada = true;
      nuevasCartasAcierto[indice].estaEmparejada = true;
      setCartas(nuevasCartasAcierto);
      setIndiceCartaSeleccionada(null);

      const nuevoPuntaje = puntaje + 10;
      setPuntaje(nuevoPuntaje);
      setMensaje({
        texto: `🎉 ¡Correcto! ${primeraCarta.nombre}`,
        tipo: "correcto",
      });
      setTimeout(() => setMensaje(null), 1200);

      // Verificar si el juego terminó
      const todasEmparejadas = nuevasCartasAcierto.every(
        (c) => c.estaEmparejada,
      );
      if (todasEmparejadas) {
        setJuegoCompletado(true);
        // Guardar progreso
        localStorage.setItem("alfanica_actividad_memoria_completada", "true");
        localStorage.setItem(
          "alfanica_puntaje_memoria",
          nuevoPuntaje.toString(),
        );
      }
    } else {
      // Error: las cartas no coinciden
      setBloquearTablero(true);
      setMensaje({
        texto: `❌ ¡Intenta de nuevo! ${primeraCarta.nombre} no es igual`,
        tipo: "incorrecto",
      });

      // Voltear las cartas después de 1 segundo
      setTimeout(() => {
        const nuevasCartasError = [...cartas];
        nuevasCartasError[indiceCartaSeleccionada].estaVolteada = false;
        nuevasCartasError[indice].estaVolteada = false;
        setCartas(nuevasCartasError);
        setIndiceCartaSeleccionada(null);
        setBloquearTablero(false);
        setMensaje(null);
      }, 1000);
    }
  };

  // Pantalla de juego completado
  if (juegoCompletado) {
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
            🧠🏆🎉
          </motion.div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            ¡Memoria Genial!
          </h1>
          <p className="text-gray-600 mb-2">Encontraste todas las parejas</p>
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
              onClick={reiniciarJuego}
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-bold hover:bg-blue-600 transition flex items-center justify-center gap-2"
            >
              🔄 Jugar de nuevo
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-6">
            🧠 "¡Ejercitaste tu memoria! Sigue así"
          </p>
        </motion.div>
      </div>
    );
  }

  // Calcular progreso
  const paresEncontrados = cartas.filter((c) => c.estaEmparejada).length / 2;
  const totalPares = paresIniciales.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-500 p-6">
      <div className="max-w-3xl mx-auto">
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
            🧠 <strong>Juego de Memoria</strong>
          </p>
          <p className="text-gray-500 mt-1">
            Encuentra la letra y su imagen correspondiente
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

        {/* Tablero de memoria */}
        <div className="grid grid-cols-4 gap-4">
          {cartas.map((carta, idx) => (
            <motion.button
              key={carta.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCartaClick(idx)}
              disabled={
                carta.estaEmparejada || carta.estaVolteada || bloquearTablero
              }
              className={`
                aspect-square rounded-2xl shadow-lg text-4xl font-bold transition-all
                ${
                  carta.estaEmparejada || carta.estaVolteada
                    ? "bg-white text-gray-800"
                    : "bg-gradient-to-br from-orange-400 to-orange-600 text-white hover:scale-105"
                }
                ${carta.estaEmparejada ? "opacity-60" : ""}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {(carta.estaVolteada || carta.estaEmparejada) && (
                <div className="flex flex-col items-center justify-center h-full">
                  {carta.tipo === "letra" ? (
                    <span className="text-4xl font-bold">
                      {carta.contenido}
                    </span>
                  ) : (
                    <span className="text-5xl">{carta.contenido}</span>
                  )}
                </div>
              )}
              {!carta.estaVolteada && !carta.estaEmparejada && (
                <div className="flex items-center justify-center h-full">
                  <span className="text-3xl">❓</span>
                </div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Progreso */}
        <div className="mt-8">
          <div className="bg-white/30 rounded-full h-4 max-w-md mx-auto">
            <motion.div
              className="bg-green-500 rounded-full h-4"
              initial={{ width: 0 }}
              animate={{ width: `${(paresEncontrados / totalPares) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-center text-white mt-2 font-semibold">
            Parejas encontradas: {paresEncontrados} de {totalPares}
          </p>
        </div>

        {/* Consejo */}
        <div className="mt-6 bg-white/20 rounded-2xl p-4">
          <p className="text-white text-center text-sm">
            💡 <strong>Consejo:</strong> Toca una carta para ver su contenido.
            Luego encuentra su pareja antes de que se vuelvan a ocultar.
          </p>
        </div>
      </div>
    </div>
  );
}
