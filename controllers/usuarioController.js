import usuariosModel from '../models/usuarios.js'
import 'dotenv/config'
import Usuario from '../schemas/usuarios.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

class UsuarioController {
    // Registro de usuario
    async register(req, res) {
      try {
        const { nombre, username, email, clave, telefono, descripcion, puntos, rol } = req.body;
  
        // 3) Comprueba que no exista ya un usuario con ese username o email
        const existe = await Usuario.findOne({
          $or: [{ username }, { email }]
        });
        if (existe) {
          if (existe.username === username) {
            return res.status(400).json({ msg: "El nombre de usuario ya está en uso." });
          }
          return res.status(400).json({ msg: "El email ya está registrado." });
        }
  
        // 2) Hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const claveHash = await bcrypt.hash(clave, salt);
  
        // 3) Crear el documento
        const nuevo = await usuariosModel.create({
          nombre,
          username,
          email,
          clave: claveHash,
          telefono,
          descripcion,
          puntos,
          rol
        });
  
        res.status(201).json({
          msg: "Usuario registrado correctamente.",
          usuario: {
            id: nuevo._id,
            nombre: nuevo.nombre,
            username: nuevo.username,
            email: nuevo.email
          }
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error en el registro." });
      }
    }
  
    // Login de usuario
    async login(req, res) {
      try {
        const { username, clave } = req.body;
  
        // 1) Buscar usuario por username
        const user = await Usuario.findOne({ username });
        if (!user) {
          return res.status(400).json({ msg: "Usuario no encontrado." });
        }
  
        // 2) Comparar la contraseña
        const ok = await bcrypt.compare(clave, user.clave);
        if (!ok) {
          return res.status(400).json({ msg: "Contraseña inválida." });
        }
  
        // 3) Generar JWT 
        const payload = { id: user._id, username: user.username, rol: user.rol };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });
  
        res.json({
          msg: "Login exitoso.",
          token
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error en el login." });
      }
    }
  }
  
  export default new UsuarioController();