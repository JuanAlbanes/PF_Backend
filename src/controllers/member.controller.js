import MemberService from '../services/member.service.js'
import { ServerError } from '../utils/customError.utils.js'
import jwt from 'jsonwebtoken'

class MemberController {
    static async confirmInvitation(request, response) {
        try {
            const { token } = request.params
            
            const result = await MemberService.confirmInvitation(token)
            
            response.redirect(result.redirectUrl) 
        }
        catch (error) {
            console.log('Error en MemberController.confirmInvitation:', error)
            
            if (error instanceof jwt.JsonWebTokenError) {
                response.status(400).json({ 
                    ok: false, 
                    status: 400, 
                    message: 'Token invalido' 
                })
            }
            else if (error instanceof jwt.TokenExpiredError) {
                response.status(400).json({ 
                    ok: false, 
                    status: 400, 
                    message: 'Token expirado' 
                })
            }
            else if (error.status) {
                response.status(error.status).json({ 
                    ok: false, 
                    status: error.status, 
                    message: error.message 
                })
            }
            else {
                response.status(500).json({ 
                    ok: false, 
                    status: 500, 
                    message: 'Error interno del servidor' 
                })
            }
        }
    }
}

export default MemberController