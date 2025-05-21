import { Router } from 'express'
import usuarioController from '../controllers/usuarioController.js';

const route = Router()

//route.post('/', usuarioController.create);
//route.get('/:id', usuarioController.get);
//route.put('/:id', usuarioController.update);
//route.delete('/:id', usuarioController.delete);
route.post('/register', usuarioController.register);
route.post('/login', usuarioController.login)

export default route;