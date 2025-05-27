import ComunidadesModel from '../models/comunidad.js';

class ComunidadController {
  // Crear una nueva comunidad
  async createCommunity(req, res) {
    try {
      const nuevaComunidad = await ComunidadesModel.create(req.body);
      res.status(201).json(nuevaComunidad);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al crear la comunidad.' });
    }
  }

  // Obtener una comunidad por _id
  async getCommunity(req, res) {
    const { id } = req.params;
    try {
      const comunidad = await ComunidadesModel.get(id);
      if (!comunidad) {
        return res.status(404).json({ error: 'Comunidad no encontrada.' });
      }
      res.json(comunidad);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener la comunidad.' });
    }
  }

  // Actualizar una comunidad por _id
  async updateCommunity(req, res) {
    const { id } = req.params;
    try {
      const comunidadActualizada = await ComunidadesModel.update(id, req.body);
      if (!comunidadActualizada) {
        return res.status(404).json({ error: 'Comunidad no encontrada.' });
      }
      res.json(comunidadActualizada);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al actualizar la comunidad.' });
    }
  }

  // Eliminar una comunidad por _id
  async deleteCommunity(req, res) {
    const { id } = req.params;
    try {
      const comunidadEliminada = await ComunidadesModel.delete(id);
      if (!comunidadEliminada) {
        return res.status(404).json({ error: 'Comunidad no encontrada.' });
      }
      res.json({ message: 'Comunidad eliminada correctamente.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al eliminar la comunidad.' });
    }
  }

  async listCommunities(req, res) {
    try {
      const comunidades = await ComunidadesModel.list();
      res.json(comunidades);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al listar comunidades.' });
    }
  }

  // Agregar un miembro a la comunidad
  async addMember(req, res) {
    const { id } = req.params;         // id de la comunidad
    const { userId } = req.body;       // id del usuario a agregar
    try {
      const comunidad = await ComunidadesModel.addMember(id, userId);
      if (!comunidad) {
        return res.status(404).json({ error: 'Comunidad no encontrada.' });
      }
      res.json(comunidad);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al agregar miembro.' });
    }
  }

  // Listar todas las noticias de una comunidad
  async getCommunityNews(req, res) {
    const { id } = req.params;
    try {
      const comunidad = await ComunidadesModel.getWithNews(id);
      if (!comunidad) {
        return res.status(404).json({ error: 'Comunidad no encontrada.' });
      }
      // devolvemos directamente el array de noticias pobladas
      res.json(comunidad.noticias);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: 'Error al obtener las noticias de la comunidad.' });
    }
  }

}

export default new ComunidadController();
