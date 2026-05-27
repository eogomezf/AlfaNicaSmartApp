// src/pages/Nivel1/UneImagen.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const imagenes = [
  {
    id: 1,
    imagen: "🍎",
    nombre: "Manzana",
    letraCorrecta: "M",
    color: "bg-red-100",
  },
  {
    id: 2,
    imagen: "☀️",
    nombre: "Sol",
    letraCorrecta: "S",
    color: "bg-yellow-100",
  },
  {
    id: 3,
    imagen: "⚽",
    nombre: "Pelota",
    letraCorrecta: "P",
    color: "bg-blue-100",
  },
  {
    id: 4,
    imagen: "🌙",
    nombre: "Luna",
    letraCorrecta: "L",
    color: "bg-purple-100",
  },
];

const letrasDisponibles = [
  { letra: "M", color: "bg-red-500", ejemplo: "🍎" },
  { letra: "S", color: "bg-yellow-500", ejemplo: "☀️" },
  { letra: "P", color: "bg-blue-500", ejemplo: "⚽" },
  { letra: "L", color: "bg-purple-500", ejemplo: "🌙" },
];

export default function UneImagen() {
  const navigate = useNavigate();
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [conectados, setConectados] = useState({});
  const [mensaje, setMensaje] = useState(null);
  const [puntaje, setPuntaje] = useState(0);

  const handleImagenClick = (imagen) => {
    // Si ya está conectada, no hacer nada
    if (conectados[imagen.id]) return;

    // Seleccionar o deseleccionar
    if (imagenSeleccionada?.id === imagen.id) {
      setImagenSeleccionada(null);
    } else {
      setImagenSeleccionada(imagen);
      // Reproducir sonido de la imagen (opcional)
    }
  };

  const handleLetraClick = (letraObj) => {
    // Si no hay imagen seleccionada
    if (!imagenSeleccionada) {
      setMensaje({ texto: "👆 Primero toca una imagen", tipo: "info" });
      setTimeout(() => setMensaje(null), 1500);
      return;
    }

    // Si la imagen ya está conectada
    if (conectados[imagenSeleccionada.id]) {
      setMensaje({ texto: "✓ Esta imagen ya está conectada", tipo: "info" });
      setTimeout(() => setMensaje(null), 1500);
      return;
    }

    // Verificar si la letra es correcta
    if (imagenSeleccionada.letraCorrecta === letraObj.letra) {
      // ✅ Correcto
      const nuevoPuntaje = puntaje + 10;
      setPuntaje(nuevoPuntaje);
      setConectados((prev) => ({
        ...prev,
        [imagenSeleccionada.id]: letraObj.letra,
      }));
      setMensaje({
        texto: `🎉 ¡Correcto! ${imagenSeleccionada.nombre} empieza con ${letraObj.letra}`,
        tipo: "correcto",
      });
      setImagenSeleccionada(null);

      setTimeout(() => setMensaje(null), 1500);

      // Verificar si completó todo
      if (Object.keys(conectados).length + 1 === imagenes.length) {
        setTimeout(() => {
          // Cuando completa la actividad:
          localStorage.setItem(
            "alfanica_actividad_une-imagen_completada",
            "true",
          );
          localStorage.setItem(
            "alfanica_puntaje_une-imagen",
            puntaje.toString(),
          );
          navigate("/nivel1");
        }, 2000);
      }
    } else {
      // ❌ Incorrecto
      setMensaje({
        texto: `❌ ¡Ups! ${imagenSeleccionada.nombre} empieza con ${imagenSeleccionada.letraCorrecta}, no con ${letraObj.letra}`,
        tipo: "incorrecto",
      });
      setTimeout(() => setMensaje(null), 1500);
    }
  };

  const todasConectadas = Object.keys(conectados).length === imagenes.length;

  if (todasConectadas) {
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
            🏆🎉🦜
          </motion.div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            ¡Felicidades!
          </h1>
          <p className="text-gray-600 mb-2">Uniste todas las imágenes</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-6">
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

        {/* Instrucciones */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/90 rounded-2xl p-4 mb-8 text-center"
        >
          <p className="text-xl text-gray-700">
            🎯{" "}
            <strong>
              1. Toca la imagen &nbsp;&nbsp;&nbsp; 2. Toca la letra correcta
            </strong>
          </p>
          <p className="text-gray-500 mt-1">
            La imagen seleccionada se iluminará. Luego toca la letra que le
            corresponde.
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

        {/* Grid: Imágenes y Letras lado a lado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Imágenes */}
          <div>
            <h2 className="text-2xl font-bold text-white text-center mb-4">
              📷 Imágenes
            </h2>
            <div className="space-y-4">
              {imagenes.map((img) => {
                const estaConectada = conectados[img.id];
                const estaSeleccionada = imagenSeleccionada?.id === img.id;

                return (
                  <motion.div
                    key={img.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleImagenClick(img)}
                    className={`
                      relative cursor-pointer rounded-2xl p-6 transition-all transform
                      ${estaConectada ? "opacity-50 grayscale" : "hover:scale-105"}
                      ${estaSeleccionada ? "ring-4 ring-yellow-400 scale-105" : ""}
                      ${img.color} shadow-lg
                    `}
                  >
                    <div className="flex items-center gap-6">
                      <div className="text-7xl">{img.imagen}</div>
                      <div>
                        {/* <p className="text-2xl font-bold text-gray-800">
                          {img.nombre}
                        </p> */}
                        {estaConectada && (
                          <p className="text-green-600 font-semibold mt-1">
                            ✓ Conectada con {conectados[img.id]}
                          </p>
                        )}
                        {estaSeleccionada && !estaConectada && (
                          <p className="text-yellow-600 font-semibold mt-1 animate-pulse">
                            👆 ¡Toca la letra!
                          </p>
                        )}
                      </div>
                    </div>
                    {estaSeleccionada && !estaConectada && (
                      <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">
                        ✓
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Letras */}
          <div>
            <h2 className="text-2xl font-bold text-white text-center mb-4">
              🔤 Letras
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {letrasDisponibles.map((letraObj) => {
                const letraUsada = Object.values(conectados).includes(
                  letraObj.letra,
                );

                return (
                  <motion.div
                    key={letraObj.letra}
                    whileHover={{ scale: letraUsada ? 1 : 1.05 }}
                    whileTap={{ scale: letraUsada ? 1 : 0.95 }}
                    onClick={() => !letraUsada && handleLetraClick(letraObj)}
                    className={`
                      rounded-2xl p-6 text-center cursor-pointer transition-all shadow-lg
                      ${letraUsada ? "opacity-40 cursor-not-allowed grayscale" : `${letraObj.color} hover:shadow-2xl`}
                    `}
                  >
                    <span className="text-7xl font-bold text-white">
                      {letraObj.letra}
                    </span>
                    {/* <div className="text-3xl mt-2">{letraObj.ejemplo}</div> */}
                    <p className="text-white/80 text-sm mt-2">
                      {letraUsada ? "✓ Ya usada" : "Toca aquí"}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Progreso */}
        <div className="mt-8">
          <div className="bg-white/30 rounded-full h-4 max-w-md mx-auto">
            <motion.div
              className="bg-green-500 rounded-full h-4"
              initial={{ width: 0 }}
              animate={{
                width: `${(Object.keys(conectados).length / imagenes.length) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-center text-white mt-2 font-semibold">
            {Object.keys(conectados).length} de {imagenes.length} imágenes
            conectadas
          </p>
        </div>

        {/* Imagen seleccionada actual */}
        {imagenSeleccionada && !conectados[imagenSeleccionada.id] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <div className="inline-block bg-yellow-400 rounded-full px-6 py-3 shadow-lg">
              <p className="text-white font-bold">
                📸 Imagen seleccionada: {imagenSeleccionada.nombre}{" "}
                {imagenSeleccionada.imagen}
              </p>
              <p className="text-white/80 text-sm">
                Ahora toca la letra correcta
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
