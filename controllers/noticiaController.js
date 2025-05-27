import NoticiasModel from '../models/noticia.js';
import ComunidadesModel from '../models/comunidad.js';
import UsuariosModel from '../models/usuarios.js';

class NoticiaController {
  // Crear noticia (y opcionalmente enlazar con comunidad)
  async createNews(req, res) {
    try {
      const { comunidad, ...payload } = req.body;
      const nuevaNoticia = await NoticiasModel.create(payload);

      // Si vino comunidad, añádela a la comunidad
      if (comunidad) {
        const updated = await ComunidadesModel.addNews(comunidad, nuevaNoticia._id);
        if (!updated) {
          return res.status(404).json({ error: 'Comunidad no encontrada.' });
        }
      }

      res.status(201).json(nuevaNoticia);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al crear la noticia.' });
    }
  }

  // Listar todas las noticias
  async listNews(req, res) {
    try {
      const noticias = await NoticiasModel.list();
      res.json(noticias);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al listar noticias.' });
    }
  }

  // Obtener una noticia
  async getNews(req, res) {
    const { id } = req.params;
    try {
      const noticia = await NoticiasModel.get(id);
      if (!noticia) {
        return res.status(404).json({ error: 'Noticia no encontrada.' });
      }
      res.json(noticia);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener la noticia.' });
    }
  }

  // Actualizar una noticia
  async updateNews(req, res) {
    const { id } = req.params;
    try {
      const noticiaAct = await NoticiasModel.update(id, req.body);
      if (!noticiaAct) {
        return res.status(404).json({ error: 'Noticia no encontrada.' });
      }
      res.json(noticiaAct);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al actualizar la noticia.' });
    }
  }

  // Eliminar una noticia
  async deleteNews(req, res) {
    const { id } = req.params;
    try {
      const borrada = await NoticiasModel.delete(id);
      if (!borrada) {
        return res.status(404).json({ error: 'Noticia no encontrada.' });
      }
      res.json({ message: 'Noticia eliminada correctamente.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al eliminar la noticia.' });
    }
  }

  // GET /noticias/autor/:authorId
  async listNewsByAuthor(req, res) {
    const { authorId } = req.params;
    try {
      const noticias = await NoticiasModel.listByAuthor(authorId);
      res.json(noticias);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener noticias del autor.' });
    }
  }


  //METODOS RELACINOADOS A LOS COMENTARIOS //
  // POST /noticias/:id/comentarios
  async addComment(req, res) {
    const { id } = req.params;             // id de la noticia
    const { usuario, texto } = req.body;   // req.body debe traer { usuario, texto }
    try {
      const updated = await NoticiasModel.addComment(id, { usuario, texto });
      if (!updated) {
        return res.status(404).json({ error: 'Noticia no encontrada.' });
      }
      res.status(201).json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al añadir comentario.' });
    }
  }

  // PUT /noticias/:id/comentarios/:commentId
  async updateComment(req, res) {
    const { id, commentId } = req.params;
    const { texto } = req.body;
    try {
      const updated = await NoticiasModel.updateComment(id, commentId, { texto });
      if (!updated) {
        return res.status(404).json({ error: 'Noticia o comentario no encontrado.' });
      }
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al modificar comentario.' });
    }
  }

  // DELETE /noticias/:id/comentarios/:commentId
  async deleteComment(req, res) {
    const { id, commentId } = req.params;
    try {
      const updated = await NoticiasModel.deleteComment(id, commentId);
      if (!updated) {
        return res.status(404).json({ error: 'Noticia o comentario no encontrado.' });
      }
      res.json({ message: 'Comentario eliminado correctamente.', noticia: updated });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al eliminar comentario.' });
    }
  }

  //METODOS DE LOS LIKES//
  // POST /noticias/:id/calificaciones
  async addCalificacion(req, res) {
    const { id } = req.params;
    let { usuario, like } = req.body;
    like = Boolean(like); // acepta 0|1 o true|false
    try {
      const updated = await NoticiasModel.addCalificacion(id, usuario, like);
      if (!updated) {
        return res
          .status(400)
          .json({ error: 'Ya existe una calificación de este usuario.' });
      }
      res.status(201).json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al añadir la calificación.' });
    }
  }

  // PUT /noticias/:id/calificaciones/:usuarioId
  async updateCalificacion(req, res) {
    const { id, usuarioId } = req.params;
    let { like } = req.body;
    like = Boolean(like);
    try {
      const updated = await NoticiasModel.updateCalificacion(id, usuarioId, like);
      if (!updated) {
        return res
          .status(404)
          .json({ error: 'No existe calificación para ese usuario.' });
      }
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al modificar la calificación.' });
    }
  }

  // DELETE /noticias/:id/calificaciones/:usuarioId
  async deleteCalificacion(req, res) {
    const { id, usuarioId } = req.params;
    try {
      const updated = await NoticiasModel.deleteCalificacion(id, usuarioId);
      res.json({ message: 'Calificación eliminada.', noticia: updated });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al eliminar la calificación.' });
    }
  }

  //CALCULANDO Y GUARDANDO EL SCORE DEL AUTOR//
  // GET /noticias/autor/:authorId/score
  async getAuthorLikeScore(req, res) {
    const { authorId } = req.params;
    try {
      // 1) Calcula el score promedio
      const score = await NoticiasModel.getAuthorLikeScore(authorId);

      // 2) Actualiza el campo `puntos` del usuario autor
      const usuarioActualizado = await UsuariosModel.update(authorId, { puntos: score });

      if (!usuarioActualizado) {
        return res.status(404).json({ error: 'Autor no encontrado.' });
      }

      // 3) Devuelve el usuario con su nuevo puntos
      res.json({
        author:   authorId,
        puntos:   usuarioActualizado.puntos,
        score
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: 'Error al calcular y actualizar los puntos del autor.'
      });
    }
  }
}

export default new NoticiaController();
