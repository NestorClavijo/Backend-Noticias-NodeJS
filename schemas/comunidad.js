import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const ComunidadSchema = new Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true
    },
    descripcion: {
      type: String,
      required: true,
      trim: true
    },
    propietario: {
      // Usuario dueño de la comunidad
      type: Types.ObjectId,
      ref: "usuarios",
      required: true
    },
    miembros: {
      // Lista dinámica de usuarios que pertenecen a la comunidad
      type: [ 
        {
          type: Types.ObjectId,
          ref: "usuarios"
        }
      ],
      default: []
    },
    noticias: {
      // Lista dinámica de noticias asociadas a la comunidad
      type: [
        {
          type: Types.ObjectId,
          ref: "noticias"
        }
      ],
      default: []
    }
  },
  {
    timestamps: { 
      createdAt: "fechaCreacion", 
      updatedAt: "fechaActualizacion" 
    }
  }
);

export default model("comunidades", ComunidadSchema);