import ChannelService from '../services/channel.service.js'
import { ServerError } from "../utils/customError.utils.js"

class ChannelController {
    static async getAllByWorkspace(req, res) {
        try {
            const { workspace_id } = req.params
            const result = await ChannelService.getWorkspaceChannels(workspace_id, req.user.id)

            return res.status(200).json({
                ok: true,
                status: 200,
                message: `Canales del workspace ${result.workspaceName} obtenidos correctamente`,
                data: { channels: result.channels }
            })

        } catch (error) {
            console.error('Error en getAllByWorkspace:', error)
            return res.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                message: error.message || 'Error interno del servidor'
            })
        }
    }

    static async getById(req, res) {
        try {
            const { channel_id } = req.params
            const channel = await ChannelService.getChannelById(channel_id, req.user.id)

            return res.status(200).json({
                ok: true,
                status: 200,
                message: `Canal con id ${channel._id} obtenido correctamente`,
                data: { channel }
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
            const result = await ChannelService.createChannel(req.body, req.user.id)

            return res.status(201).json({
                ok: true,
                status: 201,
                message: `Canal '${result.channel.name}' creado correctamente en el workspace ${result.workspaceName}`,
                data: { channel: result.channel }
            })
        } catch (error) {
            console.error('Error en post (create channel):', error)
            return res.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                message: error.message || 'Error interno del servidor'
            })
        }
    }

    static async update(req, res) {
        try {
            const { channel_id } = req.params
            const updatedChannel = await ChannelService.updateChannel(channel_id, req.body, req.user.id)

            return res.status(200).json({
                ok: true,
                status: 200,
                message: `Canal '${updatedChannel.name}' actualizado correctamente`,
                data: { channel: updatedChannel }
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
            const { channel_id } = req.params
            const deletedChannel = await ChannelService.deleteChannel(channel_id, req.user.id)

            return res.status(200).json({
                ok: true,
                status: 200,
                message: `Canal '${deletedChannel.name}' eliminado correctamente`,
                data: { channel: deletedChannel }
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

export default ChannelController