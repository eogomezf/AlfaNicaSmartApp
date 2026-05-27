// src/pages/Nivel1/EscuchaLetra.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // ✅ Importar motion

// Datos de letras
const letrasData = [
  { letra: "A", sonido: "Aaaa", palabra: "Abeja", imagen: "🐝" },
  { letra: "E", sonido: "Eeee", palabra: "Elefante", imagen: "🐘" },
  { letra: "I", sonido: "Iiii", palabra: "Iglesia", imagen: "⛪" },
  { letra: "O", sonido: "Oooo", palabra: "Oso", imagen: "🐻" },
  { letra: "U", sonido: "Uuuu", palabra: "Uva", imagen: "🍇" },
  { letra: "M", sonido: "Mmmm", palabra: "Mamá", imagen: "👩" },
  { letra: "P", sonido: "Pppp", palabra: "Papá", imagen: "👨" },
  { letra: "S", sonido: "Ssss", palabra: "Sol", imagen: "☀️" },
  { letra: "L", sonido: "Llll", palabra: "Luna", imagen: "🌙" },
];

// Función para generar opciones
const generateOptionsForLetter = (currentLetter) => {
  const otherLetters = letrasData.filter(
    (l) => l.letra !== currentLetter.letra,
  );
  const shuffled = [...otherLetters].sort(() => 0.5 - Math.random());
  const distractors = shuffled.slice(0, 2);
  const allOptions = [
    { letra: currentLetter.letra, esCorrecta: true },
    ...distractors.map((d) => ({ letra: d.letra, esCorrecta: false })),
  ];
  return allOptions.sort(() => 0.5 - Math.random());
};

export default function EscuchaLetra() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({
    show: false,
    isCorrect: false,
    message: "",
  });
  const [canInteract, setCanInteract] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completado, setCompletado] = useState(false); // ✅ Estado para pantalla de completado

  // Refs para controlar el audio
  const currentUtteranceRef = useRef(null);
  const timeoutRef = useRef(null);

  const currentLetter = letrasData[currentIndex];
  const options = generateOptionsForLetter(currentLetter);

  // Función para detener cualquier sonido en curso
  const stopSound = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (currentUtteranceRef.current) {
      currentUtteranceRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  // Función para reproducir sonido
  const playSound = useCallback(() => {
    if (!canInteract) return;

    stopSound();
    setIsPlaying(true);

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(currentLetter.sonido);
      utterance.lang = "es-ES";
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      utterance.onend = () => {
        setIsPlaying(false);
      };
      utterance.onerror = () => {
        setIsPlaying(false);
      };

      currentUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      console.log(`Escucha: ${currentLetter.sonido}`);
      setIsPlaying(false);
    }
  }, [currentLetter, stopSound, canInteract]);

  // Función para avanzar a la siguiente letra
  const goToNextLetter = useCallback(() => {
    if (currentIndex + 1 < letrasData.length) {
      setCurrentIndex((prev) => prev + 1);
      setFeedback({ show: false, isCorrect: false, message: "" });
      setCanInteract(true);
    } else {
      // Completado el nivel - mostrar pantalla de celebración
      setCompletado(true);
      // Guardar progreso
      localStorage.setItem(
        "alfanica_actividad_escucha-letra_completada",
        "true",
      );
      localStorage.setItem(
        "alfanica_puntaje_escucha-letra",
        (score + 10).toString(),
      );
    }
  }, [currentIndex, score]);

  // Manejar respuesta correcta
  const handleCorrectAnswer = useCallback(
    (letra) => {
      const newScore = score + 10;
      setScore(newScore);
      setCanInteract(false);
      setFeedback({
        show: true,
        isCorrect: true,
        message: `¡Correcto! La letra ${letra} suena como ${currentLetter.sonido} 🎉`,
      });

      // Avanzar después de 1.5 segundos
      timeoutRef.current = setTimeout(() => {
        setFeedback({ show: false, isCorrect: false, message: "" });
        goToNextLetter();
      }, 1500);
    },
    [score, currentLetter, goToNextLetter],
  );

  // Manejar respuesta incorrecta
  const handleIncorrectAnswer = useCallback((letra) => {
    setFeedback({
      show: true,
      isCorrect: false,
      message: `❌ Ups... La letra ${letra} no es correcta. Intenta de nuevo.`,
    });

    // Ocultar feedback después de 1.5 segundos
    timeoutRef.current = setTimeout(() => {
      setFeedback({ show: false, isCorrect: false, message: "" });
      setCanInteract(true);
    }, 1500);
  }, []);

  const handleSelectLetter = (letra, esCorrecta) => {
    // No permitir interacción si está procesando o reproduciendo sonido
    if (!canInteract || feedback.show || isPlaying) return;

    if (esCorrecta) {
      handleCorrectAnswer(letra);
    } else {
      handleIncorrectAnswer(letra);
    }
  };

  const handleReplaySound = () => {
    if (canInteract && !feedback.show && !isPlaying) {
      playSound();
    }
  };

  const handleFinish = () => {
    // Limpiar timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    stopSound();
    navigate("/nivel1");
  };

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      stopSound();
    };
  }, [stopSound]);

  // ✅ Pantalla de completado MEJORADA con Framer Motion
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
            🏆🎉🔊
          </motion.div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            ¡Actividad Completada!
          </h1>
          <p className="text-gray-600 mb-2">
            Has aprendido {letrasData.length} letras
          </p>
          <div className="bg-orange-100 rounded-2xl p-4 my-4">
            <p className="text-gray-600 text-sm">Tu puntaje</p>
            <div className="text-5xl font-bold text-orange-500">
              {score} puntos
            </div>
            <div className="flex justify-center gap-1 mt-2">
              {[...Array(Math.min(5, Math.floor(score / 20)))].map((_, i) => (
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
              📚 Siguiente actividad
            </button>
            <button
              onClick={() => {
                setCurrentIndex(0);
                setScore(0);
                setCompletado(false);
                setCanInteract(true);
                setFeedback({ show: false, isCorrect: false, message: "" });
              }}
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-bold hover:bg-blue-600 transition flex items-center justify-center gap-2"
            >
              🔄 Jugar de nuevo
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-6">
            🦜 "¡Una actividad completada! Sigue así para desbloquear la
            siguiente"
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleFinish}
            className="bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm"
          >
            ← Salir
          </button>
          <div className="bg-white rounded-full px-4 py-2 shadow-md">
            <span className="font-bold text-orange-500">⭐ {score} pts</span>
          </div>
        </div>

        {/* Progreso */}
        <div className="text-center mb-8">
          <div className="text-sm text-white/80 mb-2">
            Letra {currentIndex + 1} de {letrasData.length}
          </div>
          <div className="w-full bg-white/30 rounded-full h-2">
            <motion.div
              className="bg-white rounded-full h-2"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentIndex + 1) / letrasData.length) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Tarjeta principal */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <motion.div
            key={currentLetter.letra}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-8xl mb-4"
          >
            {currentLetter.imagen}
          </motion.div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleReplaySound}
            disabled={!canInteract || feedback.show || isPlaying}
            className={`
              w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 
              text-white text-6xl shadow-lg hover:scale-105 transition-all mb-6
              ${isPlaying ? "animate-pulse" : ""}
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            🔊
          </motion.button>

          <p className="text-gray-500 mb-6">
            {isPlaying
              ? "🎵 Escuchando..."
              : "👆 Toca el altavoz para escuchar"}
          </p>

          {/* Opciones */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {options.map((opt, idx) => (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectLetter(opt.letra, opt.esCorrecta)}
                disabled={!canInteract || feedback.show || isPlaying}
                className="text-5xl font-bold py-4 rounded-2xl transition-all transform bg-gray-100 text-gray-800 hover:bg-orange-100 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {opt.letra}
              </motion.button>
            ))}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {feedback.show && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`
                  p-4 rounded-2xl
                  ${feedback.isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                `}
              >
                <p className="font-semibold">{feedback.message}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
