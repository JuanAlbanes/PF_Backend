import express from 'express'
import MemberController from '../controllers/member.controller.js'
const member_router = express.Router()

member_router.get('/confirm-invitation/:token', MemberController.confirmInvitation)

export default member_router