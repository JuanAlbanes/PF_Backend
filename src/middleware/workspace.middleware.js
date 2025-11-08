import MemberWorkspaceRepository from "../repositories/memberWorkspace.repository.js"
import WorkspacesRepository from "../repositories/workspace.repository.js"
import { ServerError } from "../utils/customError.utils.js"

function workspaceMiddleware(valid_member_roles = []) {
    return async function (request, response, next) {
        try {
            const user = request.user
            const { workspace_id } = request.params


            const workspace_selected = await WorkspacesRepository.getById(workspace_id)
            if (!workspace_selected) {
                throw new ServerError(404, 'Workspace no encontrado')
            }

            const member_user_data = await MemberWorkspaceRepository.getMemberWorkspaceByUserIdAndWorkspaceId(user.id, workspace_id)

            if (!member_user_data) {
                throw new ServerError(403, 'No tienes permiso para realizar esta operacion')
            }

            console.log(valid_member_roles, member_user_data.role, valid_member_roles.includes(member_user_data.role))
            if (
                valid_member_roles.length > 0 
                &&
                !valid_member_roles.includes(member_user_data.role) 
            ) {
                throw new ServerError(403, "No tenés permisos suficientes")
            }
            request.workspace = workspace_selected
            request.member = member_user_data;
            next()

        }
        catch (error) {
            console.log(error)
            if (error.status) {
                return response.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            else {
                return response.status(500).json(
                    {
                        ok: false,
                        status: 500,
                        message: 'Error interno del servidor'
                    }
                )
            }
        }
    }
}


export default workspaceMiddleware