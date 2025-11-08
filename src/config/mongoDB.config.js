import mongoose from 'mongoose'
import ENVIRONMENT from './environment.config.js'

async function connectMongoDB() {
    try{
        await mongoose.connect(ENVIRONMENT.MONGO_DB_CONNECTION_STRING, {
            timeoutMS: 60000 ,
            socketTimeoutMS: 60000
        })
        console.log('Conexion con MongoDB fue exitosa')
    }
    catch(error){
        console.error('La conexion con MongoDB fallo')
        console.log(error)
    }
}


export default connectMongoDB