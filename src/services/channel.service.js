import ChannelRepository from "../repositories/channel.repository.js"
import WorkspaceRepository from "../repositories/workspace.repository.js"
import MemberWorkspaceRepository from "../repositories/memberWorkspace.repository.js"
import { ServerError } from "../utils/customError.utils.js"
import { validarId } from "../utils/validations.utils.js"

class ChannelService {
    static async getWorkspaceChannels(workspaceId, userId) {
        if (!validarId(workspaceId)) {
            throw new ServerError(400, 'El workspace_id debe ser un ID válido')
        }

        const workspace = await WorkspaceRepository.getById(workspaceId)
        if (!workspace) {
            throw new ServerError(404, `No existe un workspace con id ${workspaceId}`)
        }

        const isMember = await MemberWorkspaceRepository.getMemberWorkspaceByUserIdAndWorkspaceId(userId, workspaceId)
        if (!isMember) {
            throw new ServerError(403, 'No tienes acceso a este workspace')
        }

        const channels = await ChannelRepository.getAllByWorkspace(workspaceId)
        return { channels, workspaceName: workspace.name }
    }

    static async getChannelById(channelId, userId) {
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

        return channel
    }

    static async createChannel(channelData, userId) {
        const { name, description, workspace_id, private: isPrivate } = channelData

        if (!name || typeof name !== 'string' || name.trim() === '' || name.length > 30) {
            throw new ServerError(400, "El campo 'name' debe ser un string no vacío de menos de 30 caracteres")
        }

        if (!workspace_id || !validarId(workspace_id)) {
            throw new ServerError(400, "Debe enviarse un 'workspace_id' válido")
        }

        const workspace = await WorkspaceRepository.getById(workspace_id)
        if (!workspace) {
            throw new ServerError(404, `No existe un workspace con id ${workspace_id}`)
        }

        const isMember = await MemberWorkspaceRepository.getMemberWorkspaceByUserIdAndWorkspaceId(userId, workspace_id)
        if (!isMember) {
            throw new ServerError(403, 'No tienes permisos para crear canales en este workspace')
        }

        const newChannel = await ChannelRepository.createChannel({
            name: name.trim(),
            description: description?.trim() || '',
            workspace_id: workspace_id,
            private: isPrivate || false
        })

        return { channel: newChannel, workspaceName: workspace.name }
    }

    static async updateChannel(channelId, updates, userId) {
        if (!validarId(channelId)) {
            throw new ServerError(400, 'El channel_id debe ser un ID válido')
        }

        const channel = await ChannelRepository.getById(channelId)
        if (!channel) {
            throw new ServerError(404, `No existe un canal con id ${channelId}`)
        }

        const isMember = await MemberWorkspaceRepository.getMemberWorkspaceByUserIdAndWorkspaceId(userId, channel.workspace)
        if (!isMember) {
            throw new ServerError(403, 'No tienes permisos para editar este canal')
        }

        if (updates.name && (typeof updates.name !== 'string' || updates.name.trim() === '' || updates.name.length > 30)) {
            throw new ServerError(400, "El campo 'name' debe ser un string no vacío de menos de 30 caracteres")
        }

        const updateData = {
            ...updates,
            modified_at: new Date()
        }

        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key]
            }
        })

        const updatedChannel = await ChannelRepository.update(channelId, updateData)
        return updatedChannel
    }

    static async deleteChannel(channelId, userId) {
        if (!validarId(channelId)) {
            throw new ServerError(400, 'El channel_id debe ser un ID válido')
        }

        const channel = await ChannelRepository.getById(channelId)
        if (!channel) {
            throw new ServerError(404, `No existe un canal con id ${channelId}`)
        }

        const isMember = await MemberWorkspaceRepository.getMemberWorkspaceByUserIdAndWorkspaceId(userId, channel.workspace)
        if (!isMember) {
            throw new ServerError(403, 'No tienes permisos para eliminar este canal')
        }

        const deletedChannel = await ChannelRepository.delete(channelId)
        return deletedChannel
    }
}

export default ChannelService