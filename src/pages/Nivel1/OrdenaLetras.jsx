// src/pages/Nivel1/OrdenaLetras.jsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Banco de palabras para ordenar
const palabrasData = [
  { id: 1, palabra: "SOL", imagen: "☀️", nombre: "Sol" },
  { id: 2, palabra: "MAMÁ", imagen: "👩", nombre: "Mamá" },
  { id: 3, palabra: "PAPÁ", imagen: "👨", nombre: "Papá" },
  { id: 4, palabra: "LUNA", imagen: "🌙", nombre: "Luna" },
  { id: 5, palabra: "MESA", imagen: "🪑", nombre: "Mesa" },
  { id: 6, palabra: "CASA", imagen: "🏠", nombre: "Casa" },
  { id: 7, palabra: "PERRO", imagen: "🐕", nombre: "Perro" },
  { id: 8, palabra: "GATO", imagen: "🐈", nombre: "Gato" },
];

// Función para desordenar una palabra
const desordenarPalabra = (palabra) => {
  const letras = palabra.split("");
  for (let i = letras.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letras[i], letras[j]] = [letras[j], letras[i]];
  }
  return letras;
};

export default function OrdenaLetras() {
  const navigate = useNavigate();
  const [palabraIndex, setPalabraIndex] = useState(0);
  const [letrasSeleccionadas, setLetrasSeleccionadas] = useState([]);
  const [puntaje, setPuntaje] = useState(0);
  const [mensaje, setMensaje] = useState(null);
  const [completado, setCompletado] = useState(false);

  const palabraActual = palabrasData[palabraIndex];

  // ✅ useMemo: se recalcula solo cuando cambia la palabra actual
  const letrasDesordenadas = useMemo(() => {
    return desordenarPalabra(palabraActual.palabra);
  }, [palabraActual]);

  // ✅ Reiniciar selección cuando cambia la palabra (se hace durante el render, no en efecto)
  const palabrasClave = `${palabraIndex}-${palabraActual.palabra}`;

  // Si la palabra cambió, limpiamos la selección
  const [ultimaPalabraClave, setUltimaPalabraClave] = useState(palabrasClave);
  if (palabrasClave !== ultimaPalabraClave) {
    setUltimaPalabraClave(palabrasClave);
    setLetrasSeleccionadas([]);
    setMensaje(null);
  }

  const handleLetraClick = (letra, idx) => {
    if (mensaje) return;
    console.log(idx);
    // Agregar letra a la selección
    const nuevasSeleccionadas = [...letrasSeleccionadas, letra];
    setLetrasSeleccionadas(nuevasSeleccionadas);

    // Verificar si la palabra está completa
    const palabraFormada = nuevasSeleccionadas.join("");

    if (palabraFormada === palabraActual.palabra) {
      // ¡Correcto!
      const nuevoPuntaje = puntaje + 15;
      setPuntaje(nuevoPuntaje);
      setMensaje({
        texto: `🎉 ¡Correcto! ${palabraActual.nombre} se escribe ${palabraActual.palabra}`,
        tipo: "correcto",
      });

      setTimeout(() => {
        setMensaje(null);
        if (palabraIndex + 1 < palabrasData.length) {
          setPalabraIndex((prev) => prev + 1);
        } else {
          // Completado todo el juego
          setCompletado(true);
          localStorage.setItem(
            "alfanica_actividad_ordena-letras_completada",
            "true",
          );
          localStorage.setItem(
            "alfanica_puntaje_ordena-letras",
            nuevoPuntaje.toString(),
          );
        }
      }, 1500);
    } else if (nuevasSeleccionadas.length === palabraActual.palabra.length) {
      // Error: no coincide
      setMensaje({
        texto: `❌ ¡Ups! "${palabraFormada}" no es correcto. Intenta de nuevo.`,
        tipo: "incorrecto",
      });

      setTimeout(() => {
        setLetrasSeleccionadas([]);
        setMensaje(null);
      }, 1500);
    }
  };

  const handleBorrarUltima = () => {
    if (letrasSeleccionadas.length === 0) return;
    if (mensaje) return;

    const nuevasSeleccionadas = letrasSeleccionadas.slice(0, -1);
    setLetrasSeleccionadas(nuevasSeleccionadas);
  };

  const handleReiniciarPalabra = () => {
    if (mensaje) return;
    setLetrasSeleccionadas([]);
    setMensaje(null);
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
            🔤🏆🎉
          </motion.div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            ¡Ordenas las letras!
          </h1>
          <p className="text-gray-600 mb-2">Completaste todas las palabras</p>
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
                setLetrasSeleccionadas([]);
              }}
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-bold hover:bg-blue-600 transition flex items-center justify-center gap-2"
            >
              🔄 Jugar de nuevo
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-6">
            🔤 "¡Las letras ya no se te escapan! Sigue así"
          </p>
        </motion.div>
      </div>
    );
  }

  // Calcular progreso
  const progreso = (palabraIndex / palabrasData.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-teal-500 p-6">
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
            🔤 <strong>Ordena las letras</strong>
          </p>
          <p className="text-gray-500 mt-1">
            Toca las letras en el orden correcto para formar la palabra
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
          {/* Imagen de la palabra */}
          <div className="text-8xl mb-4">{palabraActual.imagen}</div>

          {/* Letras seleccionadas (palabra en formación) */}
          <div className="bg-gray-100 rounded-2xl p-6 mb-6 min-h-[100px]">
            <div className="flex justify-center gap-3 flex-wrap">
              {letrasSeleccionadas.map((letra, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center shadow-md"
                >
                  <span className="text-3xl font-bold text-white">{letra}</span>
                </motion.div>
              ))}
              {letrasSeleccionadas.length === 0 && (
                <p className="text-gray-400 text-lg">
                  Toca las letras en orden
                </p>
              )}
            </div>
          </div>

          {/* Letras desordenadas para elegir */}
          <div className="flex justify-center gap-3 flex-wrap mb-6">
            {letrasDesordenadas.map((letra, idx) => {
              // Si esta letra ya fue seleccionada, no mostrarla
              const letraIndexEnSeleccion = letrasSeleccionadas.indexOf(letra);
              const yaUsada =
                letraIndexEnSeleccion !== -1 &&
                letrasSeleccionadas.filter((l) => l === letra).length >
                  letrasDesordenadas.filter((l) => l === letra).indexOf(letra);

              if (yaUsada) return null;

              return (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleLetraClick(letra, idx)}
                  disabled={mensaje !== null}
                  className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg hover:bg-orange-600 transition disabled:opacity-50"
                >
                  <span className="text-3xl font-bold text-white">{letra}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleBorrarUltima}
              disabled={letrasSeleccionadas.length === 0 || mensaje !== null}
              className="px-6 py-2 bg-yellow-500 text-white rounded-full font-semibold hover:bg-yellow-600 transition disabled:opacity-50"
            >
              ↩️ Borrar última
            </button>
            <button
              onClick={handleReiniciarPalabra}
              disabled={mensaje !== null}
              className="px-6 py-2 bg-gray-500 text-white rounded-full font-semibold hover:bg-gray-600 transition disabled:opacity-50"
            >
              🔄 Reiniciar
            </button>
          </div>
        </div>

        {/* Consejo */}
        <div className="bg-white/20 rounded-2xl p-4">
          <p className="text-white text-center text-sm">
            💡 <strong>Consejo:</strong> Mira la imagen y piensa en la palabra.
            Toca las letras en el orden correcto para formarla.
          </p>
        </div>
      </div>
    </div>
  );
}
