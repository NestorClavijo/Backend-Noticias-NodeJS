import { Router } from 'express';
import noticiaController from '../controllers/noticiaController.js';
import {
  verifyToken,
  authorizeRoles,
  authorizeOwnerOrRoles
} from '../helpers/auth.js';

const router = Router();

router.get(
    '/autor/:authorId/score',
    verifyToken,
    authorizeRoles('regular', 'admin'),
    noticiaController.getAuthorLikeScore
  );

// — Calificaciones —
// Añadir calificación (like/dislike)
router.post(
    '/:id/calificaciones',
    verifyToken,
    authorizeOwnerOrRoles('regular', 'admin'),
    noticiaController.addCalificacion
  );
  
  // Modificar calificación existente
router.put(
    '/:id/calificaciones/:usuarioId',
    verifyToken,
    authorizeOwnerOrRoles('regular', 'admin'),
    noticiaController.updateCalificacion
  );
  
  // Eliminar calificación
router.delete(
    '/:id/calificaciones/:usuarioId',
    verifyToken,
    authorizeOwnerOrRoles('regular', 'admin'),
    noticiaController.deleteCalificacion
  );

// — Comentarios —
// Añadir comentario
router.post(
    '/:id/comentarios',
    verifyToken,
    authorizeOwnerOrRoles('regular', 'admin'),
    noticiaController.addComment
  );
  
  // Modificar comentario
  router.put(
    '/:id/comentarios/:commentId',
    verifyToken,
    authorizeOwnerOrRoles('regular', 'admin'),
    noticiaController.updateComment
  );
  
  // Eliminar comentario
  router.delete(
    '/:id/comentarios/:commentId',
    verifyToken,
    authorizeOwnerOrRoles('regular', 'admin'),
    noticiaController.deleteComment
  );

router.get(
    '/autor/:authorId',
    verifyToken,
    authorizeOwnerOrRoles('regular', 'admin'),
    noticiaController.listNewsByAuthor
  );

// Crear noticia (opcionalmente enlazada a comunidad)
router.post(
  '/',
  verifyToken,
  authorizeOwnerOrRoles('regular', 'admin'),
  noticiaController.createNews
);

// Listar todas las noticias
router.get('/',noticiaController.listNews);

// Obtener una noticia
router.get(
  '/:id',
  verifyToken,
  authorizeOwnerOrRoles('regular', 'admin'),
  noticiaController.getNews
);

// Actualizar una noticia
router.put(
  '/:id',
  verifyToken,
  authorizeOwnerOrRoles('regular', 'admin'),
  noticiaController.updateNews
);

// Eliminar una noticia
router.delete(
  '/:id',
  verifyToken,
  authorizeOwnerOrRoles('regular', 'admin'),
  noticiaController.deleteNews
);

export default router;
