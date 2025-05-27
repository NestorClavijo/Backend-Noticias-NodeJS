import { Router } from 'express';
import comunidadController from '../controllers/comunidadController.js';
import { verifyToken, authorizeRoles, authorizeOwnerOrRoles } from '../helpers/auth.js';
import UsuarioController from '../controllers/usuarioController.js'

const route = Router();

// —— Rutas protegidas ——
// Obtener una comunidad por _id (solo propietario o roles permitidos)
route.get(
  '/:id',
  verifyToken,
  authorizeOwnerOrRoles('regular', 'admin'),
  comunidadController.getCommunity
);

// Actualizar una comunidad por _id (solo propietario o roles permitidos)
route.put(
  '/:id',
  verifyToken,
  authorizeOwnerOrRoles('regular', 'admin'),
  comunidadController.updateCommunity
);

// Eliminar una comunidad por _id (solo propietario o roles permitidos)
route.delete(
  '/:id',
  verifyToken,
  authorizeOwnerOrRoles('regular', 'admin'),
  comunidadController.deleteCommunity
);

// —— Rutas para crear ——
// Crear una nueva comunidad (debe estar autenticado y tener rol 'regular' o 'admin')
route.post(
  '/create',
  verifyToken,
  authorizeOwnerOrRoles('regular', 'admin'),
  comunidadController.createCommunity
);

// Listar todas las comunidades
route.get('/',comunidadController.listCommunities);

// Agregar miembro a la comunidad
route.post(
    '/:id/miembros',
    verifyToken,
    authorizeOwnerOrRoles('regular', 'admin'),
    comunidadController.addMember
);

// GET /comunidades/:id/noticias
route.get(
    '/:id/noticias',
    verifyToken,
    authorizeOwnerOrRoles('regular', 'admin'),
    comunidadController.getCommunityNews
);

route.get('/:id/comunidades',
          verifyToken,
          authorizeOwnerOrRoles('regular', 'admin'),
          UsuarioController.listCommunities);

export default route;
