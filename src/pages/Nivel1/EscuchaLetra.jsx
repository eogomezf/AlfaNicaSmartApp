// src/pages/Nivel1/EscuchaLetra.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
  const [completado, setCompletado] = useState(false);

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
      setCompletado(true);
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

    timeoutRef.current = setTimeout(() => {
      setFeedback({ show: false, isCorrect: false, message: "" });
      setCanInteract(true);
    }, 1500);
  }, []);

  const handleSelectLetter = (letra, esCorrecta) => {
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

  const progreso = ((currentIndex + 1) / letrasData.length) * 100;

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
            🔊🏆🎉
          </motion.div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            ¡Escucha y Aprende!
          </h1>
          <p className="text-gray-600 mb-2">
            Aprendiste {letrasData.length} letras
          </p>
          <div className="bg-orange-100 rounded-2xl p-4 my-4">
            <p className="text-gray-600 text-sm">Tu puntaje</p>
            <div className="text-5xl font-bold text-orange-500">
              {score} puntos
            </div>
            <div className="flex justify-center gap-1 mt-2">
              {[...Array(Math.min(5, Math.floor(score / 10)))].map((_, i) => (
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
            🎧 "¡Escuchar es el primer paso para aprender!"
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-6">
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
              ⭐ {score} pts
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
            🔊 <strong>Escucha y Selecciona la Letra</strong>
          </p>
          <p className="text-gray-500 mt-1">
            Toca el altavoz para escuchar el sonido, luego elige la letra
            correcta
          </p>
        </motion.div>

        {/* Mensaje flotante */}
        <AnimatePresence>
          {feedback.show && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg text-white font-bold text-lg ${
                feedback.isCorrect ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {feedback.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tarjeta principal */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          {/* Imagen de la letra */}
          <motion.div
            key={currentLetter.letra}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-8xl mb-6"
          >
            {currentLetter.imagen}
          </motion.div>

          {/* Botón de sonido */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleReplaySound}
            disabled={!canInteract || feedback.show || isPlaying}
            className={`
              w-40 h-40 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 
              text-white text-7xl shadow-lg hover:scale-105 transition-all mb-4
              ${isPlaying ? "animate-pulse" : ""}
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            🔊
          </motion.button>

          <p className="text-gray-500 mb-8">
            {isPlaying
              ? "🎵 Escuchando..."
              : "👆 Toca el altavoz para escuchar la letra"}
          </p>

          {/* Opciones de letras */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {options.map((opt, idx) => (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectLetter(opt.letra, opt.esCorrecta)}
                disabled={!canInteract || feedback.show || isPlaying}
                className={`
                  text-5xl font-bold py-6 rounded-2xl transition-all transform
                  bg-gray-100 text-gray-800 hover:bg-orange-100 hover:scale-105
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {opt.letra}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Barra de progreso en la parte inferior (estilo unificado) */}
        <div className="mt-6">
          <div className="flex justify-between text-white text-sm mb-1">
            <span>
              🎯 Letra {currentIndex + 1} de {letrasData.length}
            </span>
            <span>{Math.round(progreso)}%</span>
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

        {/* Consejo */}
        <div className="mt-6 bg-white/20 rounded-2xl p-4">
          <p className="text-white text-center text-sm">
            💡 <strong>Consejo:</strong> Toca el altavoz para escuchar el sonido
            de la letra, luego elige la letra correcta entre las opciones.
          </p>
        </div>
      </div>
    </div>
  );
}
