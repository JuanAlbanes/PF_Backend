import MessageRepository from "../repositories/channelMessage.repository.js"
import ChannelRepository from "../repositories/channel.repository.js"
import MemberWorkspaceRepository from "../repositories/memberWorkspace.repository.js"
import { ServerError } from "../utils/customError.utils.js"
import { validarId } from "../utils/validations.utils.js"

class MessageService {
    static async getChannelMessages(channelId, userId) {
        if (!validarId(channelId)) {
            throw new ServerError(400, 'El channel_id debe ser un ID válido')
        }

        const channel = await ChannelRepository.getById(channelId)
        if (!channel) {
            throw new ServerError(404, `No existe un canal con id ${channelId}`)
        }

        const isMember = await MemberWorkspaceRepository.getMemberWorkspaceByUserIdAndWorkspaceId(userId, channel.workspace)
        if (!isMember) {
            throw new ServerError(403, 'No tienes acceso a este canal')
        }

        const messages = await MessageRepository.getAllByChannel(channelId)
        return { messages, channelName: channel.name }
    }

    static async getMessageById(messageId, userId) {
        if (!validarId(messageId)) {
            throw new ServerError(400, 'El message_id debe ser un ID válido')
        }

        const message = await MessageRepository.getById(messageId)
        if (!message) {
            throw new ServerError(404, `No existe un mensaje con id ${messageId}`)
        }

        const channel = await ChannelRepository.getById(message.channel)
        const isMember = await MemberWorkspaceRepository.getMemberWorkspaceByUserIdAndWorkspaceId(userId, channel.workspace)
        if (!isMember) {
            throw new ServerError(403, 'No tienes acceso a este mensaje')
        }

        return message
    }

    static async createMessage(messageData, userId) {
        const { channel_id, text } = messageData

        if (!validarId(channel_id)) {
            throw new ServerError(400, 'El channel_id debe ser un ID válido')
        }

        if (!text || typeof text !== 'string' || text.trim() === '') {
            throw new ServerError(400, "El campo 'text' debe ser un string no vacío")
        }

        const channel = await ChannelRepository.getById(channel_id)
        if (!channel) {
            throw new ServerError(404, `No existe un canal con id ${channel_id}`)
        }

        const isMember = await MemberWorkspaceRepository.getMemberWorkspaceByUserIdAndWorkspaceId(userId, channel.workspace)
        if (!isMember) {
            throw new ServerError(403, 'No tienes permisos para enviar mensajes en este canal')
        }

        const newMessage = await MessageRepository.createMessage(channel_id, userId, text.trim())
        return { message: newMessage, channelName: channel.name }
    }

    static async updateMessage(messageId, text, userId) {
        if (!validarId(messageId)) {
            throw new ServerError(400, 'El message_id debe ser un ID válido')
        }

        if (!text || typeof text !== 'string' || text.trim() === '') {
            throw new ServerError(400, "El campo 'text' debe ser un string no vacío")
        }

        const message = await MessageRepository.getById(messageId)
        if (!message) {
            throw new ServerError(404, `No existe un mensaje con id ${messageId}`)
        }

        if (message.user.toString() !== userId) {
            throw new ServerError(403, 'Solo puedes editar tus propios mensajes')
        }

        const updatedMessage = await MessageRepository.update(messageId, text.trim())
        return updatedMessage
    }

    static async deleteMessage(messageId, userId) {
        if (!validarId(messageId)) {
            throw new ServerError(400, 'El message_id debe ser un ID válido')
        }

        const message = await MessageRepository.getById(messageId)
        if (!message) {
            throw new ServerError(404, `No existe un mensaje con id ${messageId}`)
        }

        const channel = await ChannelRepository.getById(message.channel)
        const member = await MemberWorkspaceRepository.getMemberWorkspaceByUserIdAndWorkspaceId(userId, channel.workspace)
        
        const isAuthor = message.user.toString() === userId
        const isAdmin = member && member.role === 'admin'

        if (!isAuthor && !isAdmin) {
            throw new ServerError(403, 'No tienes permisos para eliminar este mensaje')
        }

        const deletedMessage = await MessageRepository.delete(messageId)
        return deletedMessage
    }

    static async checkMessageAccess(messageId, userId) {
        const message = await MessageRepository.getById(messageId)
        if (!message) {
            throw new ServerError(404, 'Mensaje no encontrado')
        }

        const channel = await ChannelRepository.getById(message.channel)
        const isMember = await MemberWorkspaceRepository.getMemberWorkspaceByUserIdAndWorkspaceId(userId, channel.workspace)
        
        if (!isMember) {
            throw new ServerError(403, 'No tienes acceso a este mensaje')
        }

        return { message, channel, isMember }
    }
}

export default MessageService