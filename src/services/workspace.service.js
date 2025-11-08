import ENVIRONMENT from "../config/environment.config.js"
import transporter from "../config/mailer.config.js"
import MemberWorkspaceRepository from "../repositories/memberWorkspace.repository.js"
import UserRepository from "../repositories/user.repository.js"
import WorkspacesRepository from "../repositories/workspace.repository.js"
import { ServerError } from "../utils/customError.utils.js"
import { validarId } from "../utils/validations.utils.js"
import jwt from 'jsonwebtoken'

class WorkspaceService {
    static async getUserWorkspaces(userId) {
        const workspaces = await MemberWorkspaceRepository.getAllWorkspacesByUserId(userId)
        
        if (!workspaces) {
            throw new ServerError(404, 'No se encontraron workspaces para el usuario')
        }
        
        return workspaces
    }

    static async getAllWorkspaces() {
        const allWorkspaces = await WorkspacesRepository.getAll()
        return allWorkspaces
    }

    static async getWorkspaceById(workspaceId) {
        if (!validarId(workspaceId)) {
            throw new ServerError(400, 'el workspace_id debe ser un id valido')
        }

        const workspace = await WorkspacesRepository.getById(workspaceId)

        if (!workspace) {
            throw new ServerError(404, `Workspace con id ${workspaceId} no encontrado`)
        }

        return workspace
    }

    static async createWorkspace(name, url_image, userId) {
        if (!name || typeof (name) !== 'string' || name.length > 30) {
            throw new ServerError(400, "el campo 'name' debe ser un string de menos de 30 caracteres")
        }
        
        if (url_image && typeof (url_image) !== 'string') {
            throw new ServerError(400, "el campo 'url_image' debe ser un string")
        }
        
        const workspace_id_created = await WorkspacesRepository.createWorkspace(name, url_image, userId)
        
        console.log("Workspace creado con ID:", workspace_id_created)
        
        if (!workspace_id_created) {
            throw new ServerError(500, 'Error al crear el workspace')
        }
        
        const memberCreated = await MemberWorkspaceRepository.create(userId, workspace_id_created, 'admin')
        
        if (!memberCreated) {
            throw new ServerError(500, 'Error al agregar usuario como admin del workspace')
        }
        
        return workspace_id_created
    }

    static async updateWorkspace(workspaceId, updates, userId) {
        if (!validarId(workspaceId)) {
            throw new ServerError(400, 'el workspace_id debe ser un id valido')
        }

        const member = await MemberWorkspaceRepository.getMemberWorkspaceByUserIdAndWorkspaceId(userId, workspaceId)
        
        if (!member || member.role !== 'admin') {
            throw new ServerError(403, 'No tienes permisos para actualizar este workspace')
        }

        if (updates.name && (typeof updates.name !== 'string' || updates.name.length > 30)) {
            throw new ServerError(400, "el campo 'name' debe ser un string de menos de 30 caracteres")
        }

        if (updates.url_image && typeof updates.url_image !== 'string') {
            throw new ServerError(400, "el campo 'url_image' debe ser un string")
        }

        const updatedWorkspace = await WorkspacesRepository.update(workspaceId, updates)
        
        if (!updatedWorkspace) {
            throw new ServerError(404, `Workspace con id ${workspaceId} no encontrado`)
        }

        return updatedWorkspace
    }

    static async deleteWorkspace(workspaceId, userId) {
        if (!validarId(workspaceId)) {
            throw new ServerError(400, 'el workspace_id debe ser un id valido')
        }

        const member = await MemberWorkspaceRepository.getMemberWorkspaceByUserIdAndWorkspaceId(userId, workspaceId)
        
        if (!member || member.role !== 'admin') {
            throw new ServerError(403, 'No tienes permisos para eliminar este workspace')
        }

        const deletedWorkspace = await WorkspacesRepository.delete(workspaceId)
        
        if (!deletedWorkspace) {
            throw new ServerError(404, `Workspace con id ${workspaceId} no encontrado`)
        }

        return deletedWorkspace
    }

    static async inviteMemberToWorkspace(workspace, user, member, invitedEmail) {
        try {
            if (!invitedEmail || typeof invitedEmail !== 'string') {
                console.log('❌ Email inválido recibido:', invitedEmail)
                throw new ServerError(400, 'El email de invitación es requerido y debe ser un string válido')
            }

            const normalizedEmail = invitedEmail.toLowerCase().trim()
            
            console.log(`🔍 Buscando usuario con email: ${normalizedEmail}`)
            
            const user_invited = await UserRepository.getByEmail(normalizedEmail)

            if (!user_invited) {
                console.log(`❌ Usuario no encontrado con email: ${normalizedEmail}`)
                throw new ServerError(404, `Usuario con email ${normalizedEmail} no encontrado. El usuario debe estar registrado en la plataforma.`)
            }

            console.log(`✅ Usuario encontrado: ${user_invited.name} (${user_invited._id})`)
            
            const member_data = await MemberWorkspaceRepository.getMemberWorkspaceByUserIdAndWorkspaceId(
                user_invited._id, workspace._id
            )

            if (member_data) {
                throw new ServerError(409, `Usuario con email ${normalizedEmail} ya es miembro del workspace`)
            }

            const id_inviter = member._id
            const invite_token = jwt.sign(
                {
                    id_invited: user_invited._id,
                    email_invited: normalizedEmail,
                    id_workspace: workspace._id,
                    id_inviter: id_inviter
                },
                ENVIRONMENT.JWT_SECRET_KEY,
                {
                    expiresIn: '7d'
                }
            )

            console.log('📧 Enviando email de invitación...');
            
            const confirmationUrl = `${ENVIRONMENT.URL_FRONTEND}/confirm-invitation/${invite_token}`
            
            await transporter.sendMail(
                {
                    from: ENVIRONMENT.GMAIL_USERNAME,
                    to: normalizedEmail,
                    subject: `Invitación al workspace ${workspace.name}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h1 style="color: #611f69;">¡Te han invitado a un workspace!</h1>
                            <p>El usuario <strong>${user.email}</strong> te ha invitado a unirte al workspace:</p>
                            <h2 style="color: #1d1c1d;">${workspace.name}</h2>
                            <p>Para aceptar la invitación, haz clic en el siguiente enlace:</p>
                            <a href="${confirmationUrl}" 
                            style="display: inline-block; padding: 12px 24px; background-color: #611f69; color: white; 
                                text-decoration: none; border-radius: 4px; font-weight: bold;">
                                Aceptar Invitación
                            </a>
                            <p style="margin-top: 20px; color: #616061; font-size: 12px;">
                                Este enlace expirará en 7 días.
                            </p>
                        </div>
                    `
                }
            )

            console.log(`✅ Invitación enviada exitosamente a ${normalizedEmail}`)

            return { success: true }
        } catch (error) {
            console.error('❌ Error en inviteMemberToWorkspace:', error)
            throw error
        }
    }
}

export default WorkspaceService