import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true
        },
        email: {
            type: String
        },
        telefono: {
            type: String
        },
        descripcion: {
            type: String
        },
        puntos: {
            type: Number,
            default: 0
        },
        rol: {
            type: String,
            default: "regular"
        },
        clave: {
            type: String,
            required: true,
            trim:true
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        }   

    }
);

export default mongoose.model('usuarios',UsuarioSchema);