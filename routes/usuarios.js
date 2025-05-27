import { Router } from 'express'
import usuarioController from '../controllers/usuarioController.js';
import { verifyToken, authorizeRoles, authorizeOwnerOrRoles } from '../helpers/auth.js'

const route = Router()

//route.post('/', usuarioController.create);
//------ Rutas que deberian estar protegidas --------//
route.get('/:id',
          verifyToken, 
          authorizeOwnerOrRoles('regular','admin'),
          usuarioController.getUser);   //solo necesita el id del usuario

route.put('/:id', 
          verifyToken, 
          authorizeOwnerOrRoles('regular','admin'),
          usuarioController.updateUser);  //necesita todos los datos del usuario actualizados

route.delete('/:id',
            verifyToken, 
            authorizeOwnerOrRoles('regular','admin'),    
            usuarioController.deleteUser);  //solo necesita el id del usuario

//------ Rutas que deberian estar publicas --------//
route.post('/register', usuarioController.register);
route.post('/login', usuarioController.login)

export default route;