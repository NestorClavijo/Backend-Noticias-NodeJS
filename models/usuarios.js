import mongoose from "mongoose";
import UsuarioSchema from '../schemas/usuarios.js'

class UsuariosModel {
  //crea un nuevo usuario 
  async create(user) {
    return await UsuarioSchema.create(user);
  }

  // obtiene un usuario por el id
  async get(id) {
    return await UsuarioSchema.findById(id);
  }

  //actualizar un usuario ya existente
  async update(id, user) {
    return await UsuarioSchema.findByIdAndUpdate(id, user, { new: true });
  }

  // Eliminar un usuario por su _id
  async delete(id) {
    return await UsuarioSchema.findByIdAndDelete(id);
  }
}

export default new UsuariosModel();