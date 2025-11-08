import MessageService from '../services/message.service.js'
import { ServerError } from "../utils/customError.utils.js"

class MessageController {
    static async getAllByChannel(req, res) {
        try {
            const { channel_id } = req.params
            const result = await MessageService.getChannelMessages(channel_id, req.user.id)

            return res.status(200).json({
                ok: true,
                status: 200,
                message: `Mensajes del canal '${result.channelName}' obtenidos correctamente`,
                data: { messages: result.messages }
            })
        } catch (error) {
            console.error('Error en getAllByChannel:', error)
            return res.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                message: error.message || 'Error interno del servidor'
            })
        }
    }

    static async getById(req, res) {
        try {
            const { message_id } = req.params
            const message = await MessageService.getMessageById(message_id, req.user.id)

            return res.status(200).json({
                ok: true,
                status: 200,
                message: `Mensaje con id ${message._id} obtenido correctamente`,
                data: { message }
            })

        } catch (error) {
            console.error('Error en getById:', error)
            return res.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                message: error.message || 'Error interno del servidor'
            })
        }
    }

    static async post(req, res) {
        try {
            const result = await MessageService.createMessage(req.body, req.user.id)

            return res.status(201).json({
                ok: true,
                status: 201,
                message: `Mensaje creado correctamente en el canal '${result.channelName}'`,
                data: { message: result.message }
            })
        } catch (error) {
            console.error('Error en post:', error)
            return res.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                message: error.message || 'Error interno del servidor'
            })
        }
    }

    static async update(req, res) {
        try {
            const { message_id } = req.params
            const { text } = req.body
            
            const updatedMessage = await MessageService.updateMessage(message_id, text, req.user.id)

            return res.status(200).json({
                ok: true,
                status: 200,
                message: 'Mensaje actualizado correctamente',
                data: { message: updatedMessage }
            })

        } catch (error) {
            console.error('Error en update:', error)
            return res.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                message: error.message || 'Error interno del servidor'
            })
        }
    }

    static async delete(req, res) {
        try {
            const { message_id } = req.params
            const deletedMessage = await MessageService.deleteMessage(message_id, req.user.id)

            return res.status(200).json({
                ok: true,
                status: 200,
                message: 'Mensaje eliminado correctamente',
                data: { message: deletedMessage }
            })

        } catch (error) {
            console.error('Error en delete:', error)
            return res.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                message: error.message || 'Error interno del servidor'
            })
        }
    }
}

export default MessageController