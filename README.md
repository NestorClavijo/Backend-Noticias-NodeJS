# 📰 Backend Noticias - Node.js, Express y MongoDB 🚀

Una API RESTful modular, segura y escalable para gestionar usuarios, noticias y comunidades.

Este proyecto implementa el backend para una aplicación de noticias y comunidades. Permite la gestión de usuarios (registro, inicio de sesión), noticias (CRUD, comentarios, calificaciones) y comunidades (CRUD, miembros, asociación de noticias). Utiliza Node.js, Express y MongoDB, y genera JSON Web Tokens (JWT) para la autenticación y gestión de sesiones.
## 👥 Autores

- **2211629** Nestor Javier Clavijo Hernandez
- **2211593** Jesus David Ramirez Celis
- **2171879** Diego Armando Medina Ortega

## Características Principales ✨

* **Gestión de Usuarios:**
    * Registro de nuevos usuarios.
    * Inicio de sesión de usuarios existentes.
    * Obtención, actualización y eliminación de perfiles de usuario (protegido).
    * Generación de JSON Web Tokens (JWT) para autenticación.
    * Hashing seguro de contraseñas (`bcryptjs`).
* **Gestión de Noticias:**
    * Creación, listado, obtención, actualización y eliminación de noticias (CRUD).
    * Sistema de comentarios anidados en noticias.
    * Sistema de calificaciones (likes/dislikes) para noticias.
    * Listado de noticias por autor.
    * Cálculo de "score" para autores basado en calificaciones de sus noticias.
* **Gestión de Comunidades:**
    * Creación, listado, obtención, actualización y eliminación de comunidades.
    * Gestión de miembros en comunidades.
    * Asociación de noticias a comunidades y listado de noticias por comunidad.
* **Generales:**
    * Estructura modular (rutas, controladores, modelos, esquemas, helpers).
    * Uso de ES Modules.
    * Autorización basada en roles y propiedad de recursos.

## Stack Tecnológico 🛠️

* **Backend:**
    * Node.js (v22.x usada en configuración)
    * Express.js (v5.x)
    * MongoDB (v7.x usada en Docker Compose, compatible con v6.x-8.x)
    * Mongoose (v8.x ODM para MongoDB)
* **Autenticación y Seguridad:**
    * `bcryptjs` (para hashing de contraseñas)
    * `jsonwebtoken` (para generar y verificar JWTs)
* **Variables de Entorno:**
    * `dotenv`
* **Contenerización (Base de Datos):**
    * Docker
    * Docker Compose

## Prerrequisitos 📋

Antes de comenzar, asegúrate de tener instalado lo siguiente:

* **Node.js:** Versión 18.x o superior. Se recomienda usar [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager) para gestionar versiones.
    * Para instalar con nvm:
        ```bash
        curl -o- [https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh](https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh) | bash
        # Cierra y reabre tu terminal, o ejecuta el comando source que te indica nvm
        nvm install 20 # O la versión LTS deseada (ej. 22)
        ```
* **npm:** (Viene con Node.js) Versión 7.x o superior.
* **Docker y Docker Compose:** Necesarios si vas a ejecutar MongoDB en un contenedor (recomendado).
    * [Instalar Docker Engine](https://docs.docker.com/engine/install/)
    * [Instalar Docker Compose](https://docs.docker.com/compose/install/)
* **Git:** Para clonar el repositorio.
* **(Opcional) Cliente de API:** Una herramienta como [Postman](https://www.postman.com/) o [Insomnia](https://insomnia.rest/) para probar los endpoints.

## Configuración del Entorno 🤫

Este proyecto utiliza un archivo `.env` para gestionar las variables de entorno.

1.  En la raíz del proyecto, crea un archivo llamado `.env`.
2.  Añade las siguientes variables, ajustando los valores según sea necesario:

    ```env
    PORT=5100
    USER_DB=admin
    PASSWORD_DB=1234
    JWT_SECRET=unaClaveSuperSecreta123!IndicaCambiarEstoEnProduccion
    ```

    * `PORT`: Puerto en el que correrá el servidor backend.
    * `USER_DB`: Nombre de usuario para la autenticación en MongoDB.
    * `PASSWORD_DB`: Contraseña para el `USER_DB` en MongoDB.
    * `JWT_SECRET`: Una cadena secreta larga, compleja y aleatoria utilizada para firmar y verificar los JSON Web Tokens. **¡Es crucial cambiar el valor por defecto en un entorno de producción!**

    **Nota sobre la Conexión a MongoDB con Docker:**
    Si utilizas el `docker-compose.yml` provisto para MongoDB, las variables `USER_DB` y `PASSWORD_DB` en tu `.env` deben coincidir con `MONGO_INITDB_ROOT_USERNAME` y `MONGO_INITDB_ROOT_PASSWORD` definidas en `docker-compose.yml`. El código actual (`config/dbClient.js`) se conecta a `localhost:27017` y usa `authSource=admin`. El usuario `USER_DB` (que será el root si usas la configuración Docker) tendrá permisos sobre la base de datos `test` (donde Mongoose podría crear las colecciones si no se especifica una base de datos en la URI de conexión en `dbClient.js`).

## Instalación ⚙️

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/NestorClavijo/Backend-Noticias-NodeJS.git](https://github.com/NestorClavijo/Backend-Noticias-NodeJS.git)
    cd Backend-Noticias-NodeJS
    ```

2.  **Instala las dependencias del proyecto:**
    (Asegúrate de estar en la carpeta raíz del proyecto)
    ```bash
    npm install
    ```

## Ejecución del Proyecto ▶️

Tienes dos opciones principales para la base de datos MongoDB:

### Opción 1: Usar MongoDB con Docker (Recomendado)

1.  **Asegúrate de tener Docker y Docker Compose instalados.**
2.  Crea un archivo `docker-compose.yml` en la raíz del proyecto con el siguiente contenido:
    ```yaml
    services:
      mongodb:
        image: mongo:7.0 # Puedes usar una versión más reciente si lo deseas
        container_name: mongodb_noticias
        environment:
          MONGO_INITDB_ROOT_USERNAME: admin # Debe coincidir con USER_DB en .env
          MONGO_INITDB_ROOT_PASSWORD: 1234  # Debe coincidir con PASSWORD_DB en .env
        ports:
          - "27017:27017"
        volumes:
          - mongo_data_noticias:/data/db
        restart: always

    volumes:
      mongo_data_noticias:
    ```
3.  **Inicia el contenedor de MongoDB:**
    ```bash
    docker-compose up -d mongodb
    ```
    La primera vez que se ejecute con un volumen vacío, creará el usuario root especificado.

4.  **Inicia el servidor Node.js:**
    (Desde la raíz del proyecto, en otra terminal)
    ```bash
    node app.js
    ```

### Opción 2: Usar una Instancia Local/Externa de MongoDB

1.  Asegúrate de que tu servidor MongoDB esté corriendo y accesible.
2.  Configura la autenticación en MongoDB con un usuario y contraseña que coincidan con `USER_DB` y `PASSWORD_DB` en tu archivo `.env`. Este usuario debe tener permisos para autenticarse contra la base de datos `admin` (`authSource=admin`) y permisos de lectura/escritura sobre la base de datos donde se crearán las colecciones (probablemente `test` o `noticias_db` si modificaras `dbClient.js`).
3.  **Inicia el servidor Node.js:**
    ```bash
    node app.js
    ```

**Salida Esperada al Iniciar el Servidor Node.js:**
Si todo está configurado correctamente, deberías ver en la consola:

🔗 Conexión exitosa a la base de datos
Base de datos conectada
🚀 Servidor escuchando en http://localhost:5100


## Estructura del Proyecto 📁

```
Backend-Noticias-NodeJS/
├── app.js                     # Punto de entrada principal; configuración del servidor Express.
├── config/
│   └── dbClient.js            # Conexión con la base de datos MongoDB.
├── controllers/
│   ├── usuarioController.js   # Lógica para usuarios.
│   ├── noticiaController.js   # Lógica para noticias.
│   └── comunidadController.js # Lógica para comunidades.
├── helpers/
│   └── auth.js                # Middlewares para autenticación y autorización.
├── models/
│   ├── usuarios.js            # Modelo de usuarios.
│   ├── noticia.js             # Modelo de noticias.
│   └── comunidad.js           # Modelo de comunidades.
├── routes/
│   ├── usuarios.js            # Rutas de usuarios.
│   ├── noticia.js             # Rutas de noticias.
│   └── comunidad.js           # Rutas de comunidades.
├── schemas/
│   ├── usuarios.js            # Esquema de usuarios.
│   ├── noticia.js             # Esquema de noticias.
│   └── comunidad.js           # Esquema de comunidades.
├── node_modules/              # Dependencias del proyecto (no se sube a Git).
├── .env                       # Variables de entorno (no versionado).
├── .gitignore                 # Archivos y carpetas ignorados por Git.
├── package.json               # Metadatos del proyecto y dependencias.
├── package-lock.json          # Registro exacto de versiones instaladas.
├── README.md                  # Documentación del proyecto.
└── docker-compose.yml         # Configuración para contenerización de MongoDB (opcional).
```

## Endpoints de la API 🔗

La URL base para estos endpoints es `http://localhost:5100` (o el puerto que configures en tu archivo `.env`).

### Autenticación y Usuarios (`/usuarios`)

* **`POST /usuarios/register`** (Público)
    * **Descripción:** Registra un nuevo usuario en el sistema.
    * **Cuerpo (Request Body - JSON):**
        ```json
        {
          "nombre": "Nombre Completo",
          "username": "nombredeusuario_unico",
          "email": "correo@ejemplo.com",
          "clave": "contraseñaSegura123",
          "telefono": "(Opcional) Número",
          "descripcion": "(Opcional) Descripción",
          "rol": "(Opcional, defecto: 'regular')"
        }
        ```
    * **Respuesta Exitosa (201 Created):**
        ```json
        {
          "msg": "Usuario registrado correctamente.",
          "usuario": {
            "id": "mongo_object_id",
            "nombre": "Nombre Completo",
            "username": "nombredeusuario_unico",
            "email": "correo@ejemplo.com"
          }
        }
        ```
    * **Respuestas de Error:**
        * `400 Bad Request`: Username o email ya existen, o datos faltantes/inválidos.
        * `500 Internal Server Error`: Error inesperado.

* **`POST /usuarios/login`** (Público)
    * **Descripción:** Inicia sesión para un usuario existente y devuelve un JSON Web Token (JWT).
    * **Cuerpo (Request Body - JSON):**
        ```json
        {
          "username": "nombredeusuario_registrado",
          "clave": "su_contraseña"
        }
        ```
    * **Respuesta Exitosa (200 OK):**
        ```json
        {
          "msg": "Login exitoso.",
          "token": "TU_JSON_WEB_TOKEN"
        }
        ```
        *(El token expira en 2 horas)*
    * **Respuestas de Error:**
        * `400 Bad Request`: Usuario no encontrado o contraseña incorrecta.
        * `500 Internal Server Error`: Error inesperado.

* **`GET /usuarios/:id`**
    * **Descripción:** Obtiene los detalles de un usuario específico.
    * **Autenticación:** Requiere Token JWT.
    * **Autorización:** Propietario del perfil (`req.user.id === :id`) o rol 'regular'/'admin'.
    * **Respuesta Exitosa (200 OK):** Objeto del usuario (sin la contraseña).
    * **Respuestas de Error:** `401 Unauthorized`, `403 Forbidden`, `404 Not Found`.

* **`PUT /usuarios/:id`**
    * **Descripción:** Actualiza los detalles de un usuario específico. Si se incluye `clave` en el cuerpo, se hasheará.
    * **Autenticación:** Requiere Token JWT.
    * **Autorización:** Propietario del perfil o rol 'regular'/'admin'.
    * **Cuerpo (Request Body - JSON):** Objeto con los campos a actualizar (ej: `{ "nombre": "Nuevo Nombre", "telefono": "12345" }`).
    * **Respuesta Exitosa (200 OK):** Objeto del usuario actualizado.
    * **Respuestas de Error:** `401 Unauthorized`, `403 Forbidden`, `404 Not Found`.

* **`DELETE /usuarios/:id`**
    * **Descripción:** Elimina un usuario específico.
    * **Autenticación:** Requiere Token JWT.
    * **Autorización:** Propietario del perfil o rol 'regular'/'admin'.
    * **Respuesta Exitosa (200 OK):** `{ "message": "Usuario eliminado correctamente." }`
    * **Respuestas de Error:** `401 Unauthorized`, `403 Forbidden`, `404 Not Found`.

### Noticias (`/noticias`)

* **`GET /noticias`** (Público)
    * **Descripción:** Lista todas las noticias.
    * **Respuesta Exitosa (200 OK):** Array de objetos de noticias.

* **`POST /noticias`**
    * **Descripción:** Crea una nueva noticia. El `autor` (ID del usuario autenticado) debe incluirse en el cuerpo. Opcionalmente, se puede incluir `comunidad` (ID de la comunidad) para asociarla.
    * **Autenticación:** Requiere Token JWT.
    * **Autorización:** Rol 'regular' o 'admin' (basado en la configuración actual de `authorizeOwnerOrRoles` para rutas sin `:id` en path).
    * **Cuerpo (Request Body - JSON):** `{ "titulo", "descripcion", "texto", "autor": "ID_DEL_AUTOR", "comunidad"?: "ID_DE_LA_COMUNIDAD" }`
    * **Respuesta Exitosa (201 Created):** Objeto de la nueva noticia.

* **`GET /noticias/:id`**
    * **Descripción:** Obtiene una noticia específica por su ID.
    * **Autenticación:** Requiere Token JWT.
    * **Autorización:** Propietario (autor de la noticia) o rol 'regular'/'admin'.
    * **Respuesta Exitosa (200 OK):** Objeto de la noticia.

* **`PUT /noticias/:id`**
    * **Descripción:** Actualiza una noticia existente.
    * **Autenticación:** Requiere Token JWT.
    * **Autorización:** Propietario (autor de la noticia) o rol 'regular'/'admin'.
    * **Cuerpo (Request Body - JSON):** Objeto con los campos a actualizar (ej: `{ "titulo": "Nuevo Título" }`).
    * **Respuesta Exitosa (200 OK):** Objeto de la noticia actualizada.

* **`DELETE /noticias/:id`**
    * **Descripción:** Elimina una noticia.
    * **Autenticación:** Requiere Token JWT.
    * **Autorización:** Propietario (autor de la noticia) o rol 'regular'/'admin'.
    * **Respuesta Exitosa (200 OK):** `{ "message": "Noticia eliminada correctamente." }`

* **`GET /noticias/autor/:authorId`**
    * **Descripción:** Lista todas las noticias de un autor específico.
    * **Autenticación:** Requiere Token JWT.
    * **Autorización:** Propietario (si `authorId` es `req.user.id`) o rol 'regular'/'admin'.
    * **Respuesta Exitosa (200 OK):** Array de noticias del autor.

* **`GET /noticias/autor/:authorId/score`**
    * **Descripción:** Calcula y devuelve el "score" de un autor y actualiza sus puntos.
    * **Autenticación:** Requiere Token JWT.
    * **Autorización:** Rol 'regular' o 'admin'.
    * **Respuesta Exitosa (200 OK):** `{ "author", "puntos", "score" }`

#### Comentarios en Noticias (`/noticias/:idNoticia/comentarios`)

* **`POST /noticias/:idNoticia/comentarios`**
    * **Descripción:** Añade un comentario a una noticia.
    * **Autenticación:** Requiere Token JWT.
    * **Autorización:** Propietario de la noticia (`idNoticia`) o rol 'regular'/'admin'.
    * **Cuerpo (Request Body - JSON):** `{ "usuario": "ID_DEL_USUARIO_QUE_COMENTA", "texto": "Contenido del comentario" }`
        *Nota: El `usuario` en el cuerpo es el ID del autor del comentario. La autorización actual se basa en el propietario/rol respecto a la *noticia*.*
    * **Respuesta Exitosa (201 Created):** Noticia actualizada con el nuevo comentario.

* **`PUT /noticias/:idNoticia/comentarios/:commentId`**
    * **Descripción:** Modifica un comentario existente.
    * **Autenticación:** Requiere Token JWT.
    * **Autorización:** Propietario de la noticia (`idNoticia`) o rol 'regular'/'admin'.
        *Nota: La autorización granular para el "propietario del comentario" necesitaría lógica adicional.*
    * **Cuerpo (Request Body - JSON):** `{ "texto": "Nuevo contenido del comentario" }`
    * **Respuesta Exitosa (200 OK):** Noticia actualizada.

* **`DELETE /noticias/:idNoticia/comentarios/:commentId`**
    * **Descripción:** Elimina un comentario.
    * **Autenticación:** Requiere Token JWT.
    * **Autorización:** Propietario de la noticia (`idNoticia`) o rol 'regular'/'admin'.
        *Nota: Misma consideración de autorización granular que en PUT.*
    * **Respuesta Exitosa (200 OK):** `{ "message": "Comentario eliminado correctamente.", "noticia": { ... } }`

#### Calificaciones en Noticias (`/noticias/:idNoticia/calificaciones`)

* **`POST /noticias/:idNoticia/calificaciones`**
    * **Descripción:** Añade una calificación (like/dislike) a una noticia. Un usuario solo puede tener una calificación por noticia.
    * **Autenticación:** Requiere Token JWT.
    * **Autorización:** Propietario de la noticia (`idNoticia`) o rol 'regular'/'admin'.
    * **Cuerpo (Request Body - JSON):** `{ "usuario": "ID_DEL_USUARIO_QUE_CALIFICA", "like": true_o_false }`
        *Nota: El `usuario` en el cuerpo es el ID del autor de la calificación.*
    * **Respuesta Exitosa (201 Created):** Noticia actualizada.
    * **Respuesta Error (400 Bad Request):** Si el usuario ya calificó (cuando el modelo `addCalificacion` no encuentra un slot para añadir).

* **`PUT /noticias/:idNoticia/calificaciones/:usuarioIdCalificador`**
    * **Descripción:** Modifica la calificación existente de un usuario (`usuarioIdCalificador`) en la noticia.
    * **Autenticación:** Requiere Token JWT.
    * **Autorización:** Propietario de la noticia (`idNoticia`) o rol 'regular'/'admin'.
        *Nota: La autorización granular para el "propietario de la calificación" necesitaría lógica adicional.*
    * **Cuerpo (Request Body - JSON):** `{ "like": true_o_false }`
    * **Respuesta Exitosa (200 OK):** Noticia actualizada.
    * **Respuesta Error (404 Not Found):** Si no existe calificación previa para ese usuario.

* **`DELETE /noticias/:idNoticia/calificaciones/:usuarioIdCalificador`**
    * **Descripción:** Elimina la calificación de un usuario (`usuarioIdCalificador`) en la noticia.
    * **Autenticación:** Requiere Token JWT.
    * **Autorización:** Propietario de la noticia (`idNoticia`) o rol 'regular'/'admin'.
        *Nota: Misma consideración de autorización granular.*
    * **Respuesta Exitosa (200 OK):** `{ "message": "Calificación eliminada.", "noticia": { ... } }`

### Comunidades (`/comunidades`)

* **`GET /comunidades`** (Público)
    * **Descripción:** Lista todas las comunidades.
    * **Respuesta Exitosa (200 OK):** Array de objetos de comunidades.

* **`POST /comunidades/create`**
    * **Descripción:** Crea una nueva comunidad. El `propietario` (ID del usuario autenticado) debe incluirse en el cuerpo.
    * **Autenticación:** Requiere Token JWT.
    * **Autorización:** Rol 'regular' o 'admin'.
    * **Cuerpo (Request Body - JSON):** `{ "titulo", "descripcion", "propietario": "ID_DEL_PROPIETARIO" }`
    * **Respuesta Exitosa (201 Created):** Objeto de la nueva comunidad.

* **`GET /comunidades/:id`**
    * **Descripción:** Obtiene una comunidad específica.
    * **Autenticación:** Requiere Token JWT.
    * **Autorización:** Propietario de la comunidad o rol 'regular'/'admin'.
    * **Respuesta Exitosa (200 OK):** Objeto de la comunidad.

* **`PUT /comunidades/:id`**
    * **Descripción:** Actualiza una comunidad.
    * **Autenticación:** Requiere Token JWT.
    * **Autorización:** Propietario de la comunidad o rol 'regular'/'admin'.
    * **Cuerpo (Request Body - JSON):** `{ "titulo"?, "descripcion"? }`
    * **Respuesta Exitosa (200 OK):** Objeto de la comunidad actualizada.

* **`DELETE /comunidades/:id`**
    * **Descripción:** Elimina una comunidad.
    * **Autenticación:** Requiere Token JWT.
    * **Autorización:** Propietario de la comunidad o rol 'regular'/'admin'.
    * **Respuesta Exitosa (200 OK):** `{ "message": "Comunidad eliminada correctamente." }`

* **`POST /comunidades/:idComunidad/miembros`**
    * **Descripción:** Agrega un usuario como miembro a una comunidad.
    * **Autenticación:** Requiere Token JWT.
    * **Autorización:** Propietario de la comunidad (`idComunidad`) o rol 'regular'/'admin'.
    * **Cuerpo (Request Body - JSON):** `{ "userId": "ID_DEL_USUARIO_A_AGREGAR" }`
    * **Respuesta Exitosa (200 OK):** Comunidad actualizada.

* **`GET /comunidades/:idComunidad/noticias`**
    * **Descripción:** Lista las noticias asociadas a una comunidad (documentos de noticias populados).
    * **Autenticación:** Requiere Token JWT.
    * **Autorización:** Propietario de la comunidad (`idComunidad`) o rol 'regular'/'admin'.
    * **Respuesta Exitosa (200 OK):** Array de objetos de noticias.

* **`GET /comunidades/:userId/comunidades`** (Ruta con comportamiento especial)
    * **Descripción:** Lista las comunidades a las que pertenece un usuario (`userId` en el path) ya sea como propietario o miembro.
    * **Autenticación:** Requiere Token JWT.
    * **Autorización:** Propietario (si `:userId` es `req.user.id`) o rol 'regular'/'admin'.
    * **Respuesta Exitosa (200 OK):** Array de comunidades a las que pertenece el usuario.

---

---


