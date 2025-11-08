import jwt from 'jsonwebtoken'
import ENVIRONMENT from '../config/environment.config.js'
import { ServerError } from '../utils/customError.utils.js'
import MemberWorkspaceRepository from '../repositories/memberWorkspace.repository.js'

class MemberService {
    static async confirmInvitation(token) {
        try {
            const decoded = jwt.verify(token, ENVIRONMENT.JWT_SECRET_KEY)
            
            const {
                id_invited,
                email_invited,
                id_workspace,
                id_inviter
            } = decoded

            console.log('Datos del token:', { id_invited, email_invited, id_workspace, id_inviter })

            await MemberWorkspaceRepository.create(id_invited, id_workspace, 'user')

            return { 
                success: true, 
                redirectUrl: `${ENVIRONMENT.URL_FRONTEND}//login?invitation=success&workspace_id=${id_workspace}&email=${encodeURIComponent(email_invited)}` 
            }
        } catch (error) {
            console.error('Error en MemberService.confirmInvitation:', error)
            
            if (error instanceof jwt.JsonWebTokenError) {
                throw new ServerError(400, 'Token inválido')
            } else if (error instanceof jwt.TokenExpiredError) {
                throw new ServerError(400, 'Token expirado')
            }
            
            throw error
        }
    }

}

export default MemberService