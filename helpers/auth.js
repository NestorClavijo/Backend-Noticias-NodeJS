import jwt from 'jsonwebtoken';

export function verifyToken(req, res, next) {
  // 1) Comprueba que venga Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ msg: 'Token no proporcionado' });
  }

  // 2) Extrae el token (espera "Bearer <token>")
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ msg: 'Formato de token inválido' });
  }
  const token = parts[1];

  // 3) Verifícalo
  try {
    const secret = process.env.JWT_SECRET;
    const payload = jwt.verify(token, secret);
    // 4) Lo guardas en req para usarlo luego
    req.user = payload;  
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token inválido o expirado' });
  }
}


// middleware que permite uno o varios roles:
//   authorizeRoles('admin')
//   authorizeRoles('editor','moderator')
export function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
      const { rol } = req.user;
      if (!allowedRoles.includes(rol)) {
        return res.status(403).json({ msg: 'No tienes permiso para esta operación' });
      }
      next();
    };
}


// 2) Ruta que pueden tocar ROLES o el PROPIETARIO
//    Aquí definimos inline el chequeo “owner or role”:
export function authorizeOwnerOrRoles(...allowedRoles) {
    return (req, res, next) => {
      const { id, rol } = req.user
      const targetId = req.params.id
  
      // Si es propietario, permitimos
      if (id === targetId) {
        return next()
      }
      // Sino, comprobamos el rol
      if (allowedRoles.includes(rol)) {
        return next()
      }
      // Si no cumple ninguna, 403
      return res.status(403).json({ msg: 'No tienes permiso' })
    }
  }