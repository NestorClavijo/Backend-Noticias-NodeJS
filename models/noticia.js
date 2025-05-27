import NoticiaSchema from '../schemas/noticia.js';

class NoticiasModel {
  // Crea una noticia
  async create(data) {
    return await NoticiaSchema.create(data);
  }

  // Obtiene una noticia por su _id
  async get(id) {
    return await NoticiaSchema.findById(id);
  }

  // Actualiza una noticia
  async update(id, cambios) {
    return await NoticiaSchema.findByIdAndUpdate(id, cambios, { new: true });
  }

  // Elimina una noticia
  async delete(id) {
    return await NoticiaSchema.findByIdAndDelete(id);
  }

  // Lista todas las noticias
  async list() {
    return await NoticiaSchema.find();
  }

  // Lista todas las noticias de un autor dado
  async listByAuthor(authorId) {
    return await NoticiaSchema.find({ autor: authorId });
  }


  //METODOS RELACINADOS A LOS COMENTARIOS//
  // 1) Añade un comentario al array “comentarios”
  async addComment(noticiaId, comment) {
    return await NoticiaSchema.findByIdAndUpdate(
      noticiaId,
      { $push: { comentarios: comment } },
      { new: true }
    );
  }

  // 2) Modifica un comentario existente
  async updateComment(noticiaId, commentId, cambios) {
    return await NoticiaSchema.findOneAndUpdate(
      { _id: noticiaId, 'comentarios._id': commentId },
      { $set: {
          'comentarios.$.texto': cambios.texto,
          // si quisieras actualizar fecha, podrías añadir:
          // 'comentarios.$.fechaCreacion': Date.now()
        }
      },
      { new: true }
    );
  }

  // 3) Elimina un comentario por su _id
  async deleteComment(noticiaId, commentId) {
    return await NoticiaSchema.findByIdAndUpdate(
      noticiaId,
      { $pull: { comentarios: { _id: commentId } } },
      { new: true }
    );
  }


  //METODOS DE LOS LIKES//
  /**
   * Añade una calificación a la noticia si no existe para ese usuario.
   * Devuelve null si ya había una calificación de ese usuario.
   */
  async addCalificacion(noticiaId, usuarioId, like) {
    return await NoticiaSchema.findOneAndUpdate(
      { 
        _id: noticiaId,
        'calificaciones.usuario': { $ne: usuarioId }
      },
      { 
        $push: { calificaciones: { usuario: usuarioId, like } }
      },
      { new: true }
    );
  }

  /**
   * Modifica la calificación existente de un usuario.
   * Devuelve null si no existe esa calificación.
   */
  async updateCalificacion(noticiaId, usuarioId, like) {
    return await NoticiaSchema.findOneAndUpdate(
      { 
        _id: noticiaId,
        'calificaciones.usuario': usuarioId
      },
      { 
        $set: { 'calificaciones.$.like': like }
      },
      { new: true }
    );
  }

  /**
   * Elimina la calificación de un usuario en esa noticia.
   * Siempre devuelve el documento (incluso si no existía la calificación).
   */
  async deleteCalificacion(noticiaId, usuarioId) {
    return await NoticiaSchema.findByIdAndUpdate(
      noticiaId,
      { $pull: { calificaciones: { usuario: usuarioId } } },
      { new: true }
    );
  }

  //SCORE DEL USUARIO//
  /**
   * Calcula para un autor:
   * 1) Para cada noticia: (#likes true) - (#likes false)
   * 2) Suma esos valores y los divide por el número de noticias.
   * Devuelve 0 si no hay noticias.
   */
  async getAuthorLikeScore(authorId) {
    // Traemos solo el array de calificaciones de cada noticia
    const noticias = await NoticiaSchema.find(
      { autor: authorId },
      'calificaciones'
    ).lean();

    if (noticias.length === 0) {
      return 0;
    }

    // Sumamos la diferencia like/dislike en cada noticia
    const totalDiff = noticias.reduce((acc, { calificaciones }) => {
      const likes    = calificaciones.filter(c => c.like === true).length;
      const dislikes = calificaciones.filter(c => c.like === false).length;
      return acc + (likes - dislikes);
    }, 0);

    // Promediamos
    return totalDiff / noticias.length;
  }
}

export default new NoticiasModel();
