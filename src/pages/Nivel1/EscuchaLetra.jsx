import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

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
  const [isPlaying, setIsPlaying] = useState(false); // ✅ Estado para controlar si está reproduciendo sonido

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
    // Detener sonido anterior
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
  }, [currentLetter, stopSound]);

  // Función para avanzar a la siguiente letra
  const goToNextLetter = useCallback(() => {
    if (currentIndex + 1 < letrasData.length) {
      setCurrentIndex((prev) => prev + 1);
      setFeedback({ show: false, isCorrect: false, message: "" });
      setCanInteract(true);
      // No reproducir sonido automáticamente
    } else {
      // Completado el nivel
      setFeedback({
        show: true,
        isCorrect: true,
        message: `¡FELICIDADES! Completaste todas las letras. Puntaje: ${score + 10} puntos 🏆`,
      });
      setCanInteract(false);
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

    // Guardar progreso
    localStorage.setItem("alfanica_nivel1_score", score);
    // Guardar que esta actividad específica está completada
    localStorage.setItem("alfanica_actividad_escucha-letra_completada", "true");

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

  // Pantalla de completado
  const isCompleted = currentIndex >= letrasData.length;

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-8xl mb-4 animate-bounce">🏆🎉🦜</div>

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
                <span key={i} className="text-2xl">
                  ⭐
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                // Guardar progreso antes de salir
                localStorage.setItem("alfanica_nivel1_score", score);
                localStorage.setItem(
                  "alfanica_actividad_escucha-letra_completada",
                  "true",
                );
                navigate("/nivel1");
              }}
              className="w-full bg-orange-500 text-white px-6 py-3 rounded-full text-lg font-bold hover:bg-orange-600 transition flex items-center justify-center gap-2"
            >
              📚 Siguiente actividad
            </button>

            <button
              onClick={() => {
                setCurrentIndex(0);
                setScore(0);
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
        </div>
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
            <div
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / letrasData.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Tarjeta principal */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="text-8xl mb-4">{currentLetter.imagen}</div>

          <button
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
          </button>

          <p className="text-gray-500 mb-6">
            {isPlaying
              ? "🎵 Escuchando..."
              : "👆 Toca el altavoz para escuchar"}
          </p>

          {/* Opciones */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectLetter(opt.letra, opt.esCorrecta)}
                disabled={!canInteract || feedback.show || isPlaying}
                className="text-5xl font-bold py-4 rounded-2xl transition-all transform bg-gray-100 text-gray-800 hover:bg-orange-100 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {opt.letra}
              </button>
            ))}
          </div>

          {/* Feedback */}
          {feedback.show && (
            <div
              className={`
              p-4 rounded-2xl animate-bounce
              ${feedback.isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
            `}
            >
              <p className="font-semibold">{feedback.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
