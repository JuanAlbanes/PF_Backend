import ChannelRepository from "../repositories/channel.repository.js";
import { ServerError } from "../utils/customError.utils.js";
import { validarId } from "../utils/validations.utils.js";

async function channelMiddleware(request, response, next) {
    try {
        const { channel_id, workspace_id } = request.params;
        
        if (!validarId(channel_id) || !validarId(workspace_id)) {
            throw new ServerError(400, 'Los parámetros channel_id y workspace_id deben ser IDs válidos');
        }

        const channel_selected = await ChannelRepository.getByIdAndWorkspaceId(channel_id, workspace_id);
        
        if (!channel_selected) {
            throw new ServerError(404, 'Canal no encontrado o no pertenece al workspace especificado');
        }
        
        request.channel = channel_selected;
        next();
    } catch (error) {
        console.error('Error en channelMiddleware:', error);
        if (error instanceof ServerError) {
            return response.status(error.status).json({
                ok: false,
                status: error.status,
                message: error.message,
            });
        }
        return response.status(500).json({
            ok: false,
            status: 500,
            message: "Error interno del servidor al validar el canal",
        });
    }
}

export default channelMiddleware;