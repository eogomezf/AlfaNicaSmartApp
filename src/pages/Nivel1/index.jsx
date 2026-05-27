import { useParams, useNavigate } from "react-router-dom";

const actividades = {
  "escucha-letra": {
    titulo: "🔊 Escucha y Selecciona",
    descripcion: "Escucha el sonido y toca la letra correcta",
  },
  "une-imagen": {
    titulo: "🖼️ Une Imagen con Letra",
    descripcion: "Arrastra la imagen hacia su letra inicial",
  },
  "traza-letra": {
    titulo: "✍️ Traza la Letra",
    descripcion: "Sigue las líneas punteadas con tu dedo",
  },
};

export default function Nivel1() {
  const { actividad } = useParams();
  const navigate = useNavigate();
  const data = actividades[actividad] || {
    titulo: "Actividad",
    descripcion: "¡Aprende jugando!",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-yellow-100 p-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/levels")}
          className="mb-6 text-orange-500 text-lg flex items-center gap-2"
        >
          ← Volver al mapa
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">{data.titulo.split(" ")[0]}</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {data.titulo}
          </h1>
          <p className="text-gray-500 mb-8">{data.descripcion}</p>

          <div className="bg-orange-100 rounded-2xl p-8 mb-6">
            <p className="text-gray-600 text-center">
              🚧 Actividad en construcción... 🚧
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Próximamente: ¡interactividad completa!
            </p>
          </div>

          <button
            onClick={() => alert("¡Actividad completada! +10 puntos")}
            className="bg-green-500 text-white px-8 py-3 rounded-full text-xl font-bold hover:bg-green-600 transition"
          >
            ✅ Completar Actividad
          </button>
        </div>
      </div>
    </div>
  );
}
