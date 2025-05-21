import mongoose from "mongoose";
import UsuarioSchema from '../schemas/usuarios.js'

class UsuariosModel {
  async create(user) {
    return await UsuarioSchema.create(user);
  }

  async get(id) {
    return await UsuarioSchema.findById(id);
  }

  async update(id, user) {
    return await UsuarioSchema.findByIdAndUpdate(id, user, { new: true });
  }
}

export default new UsuariosModel();