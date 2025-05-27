import ComunidadSchema from '../schemas/comunidad.js';

class ComunidadesModel {
  // Crea una nueva comunidad
  async create(comunidad) {
    return await ComunidadSchema.create(comunidad);
  }

  // Obtiene una comunidad por su _id
  async get(id) {
    return await ComunidadSchema.findById(id);
  }

  // Actualiza una comunidad existente por su _id
  async update(id, cambios) {
    return await ComunidadSchema.findByIdAndUpdate(id, cambios, { new: true });
  }

  // Elimina una comunidad por su _id
  async delete(id) {
    return await ComunidadSchema.findByIdAndDelete(id);
  }

  //listar todas las comunidades
  async list() {
    return await ComunidadSchema.find();
  }

  //agrega un miembro (sin duplicados)
  async addMember(id, userId) {
    return await ComunidadSchema.findByIdAndUpdate(
      id,
      { $addToSet: { miembros: userId } },
      { new: true }
    );
  }

  //añadir una noticia a la comunidad
  async addNews(comunidadId, noticiaId) {
    return await ComunidadSchema.findByIdAndUpdate(
      comunidadId,
      { $addToSet: { noticias: noticiaId } },
      { new: true }
    );
  }

  async getWithNews(id) {
    return await ComunidadSchema
      .findById(id)
      .populate('noticias');   // rellena el array "noticias" con los documentos completos
  }

  async listByUser(userId) {
    return await ComunidadSchema.find({
      $or: [
        { propietario: userId },
        { usuarios: userId }
      ]
    });
  }
}

export default new ComunidadesModel();
