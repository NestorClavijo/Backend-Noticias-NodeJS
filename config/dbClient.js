import 'dotenv/config'
import mongoose from 'mongoose';

class dbClient {

    constructor() {
    }

    async connectDB() {
        const queryString = `mongodb://${process.env.USER_DB}:${process.env.PASSWORD_DB}@localhost:27017/?authSource=admin`;
        await mongoose.connect(queryString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          })
          console.log("🔗 Conexión exitosa a la base de datos")
    }

    async disconectDB() {
        await mongoose.disconnect()
        console.log("🛑 Desconectado de la base de datos")
    }

}

export default new dbClient();