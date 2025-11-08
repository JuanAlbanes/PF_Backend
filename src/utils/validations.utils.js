import mongoose from "mongoose"

export function validarId (id){
    return mongoose.isValidObjectId(id)
}
