import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

// Sub-esquema para las calificaciones (likes/dislikes)
const CalificacionSchema = new Schema({
  usuario: {
    type: Types.ObjectId,
    ref: "usuarios",
    required: true
  },
  like: {
    type: Boolean,
    required: true
  }
});

// Sub-esquema para los comentarios
const ComentarioSchema = new Schema({
  usuario: {
    type: Types.ObjectId,
    ref: "usuarios",
    required: true
  },
  texto: {
    type: String,
    required: true,
    trim: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

// Esquema principal de la noticia
const NoticiaSchema = new Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true
    },
    descripcion: {
      // texto corto / resumen
      type: String,
      required: true,
      trim: true
    },
    texto: {
      // cuerpo completo de la noticia
      type: String,
      required: true
    },
    fechaCreacion: {
      type: Date,
      default: Date.now
    },
    autor: {
      // referencia al usuario que creó la noticia
      type: Types.ObjectId,
      ref: "usuarios",
      required: true
    },
    calificaciones: {
      type: [CalificacionSchema],
      default: []
    },
    comentarios: {
      type: [ComentarioSchema],
      default: []
    }
  },
  {
    // Si además quieres tener updatedAt automático:
    timestamps: { createdAt: "fechaCreacion", updatedAt: "fechaActualizacion" }
  }
);

export default model("noticias", NoticiaSchema);
