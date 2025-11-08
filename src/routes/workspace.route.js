import express from 'express'
import WorkspacesRepository from '../repositories/workspace.repository.js'
import { validarId } from '../utils/validations.utils.js'
import { ServerError } from '../utils/customError.utils.js'
import WorkspaceController from '../controllers/workspace.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
import workspaceMiddleware from '../middleware/workspace.middleware.js'

const workspace_router = express.Router()

workspace_router.use(authMiddleware)
workspace_router.get('/', WorkspaceController.getAll)


workspace_router.get('/all', WorkspaceController.getAllWorkspaces)


workspace_router.get('/:workspace_id', WorkspaceController.getById)


workspace_router.post('/', WorkspaceController.post)


workspace_router.put('/:workspace_id', workspaceMiddleware(['admin']), WorkspaceController.update)

workspace_router.delete('/:workspace_id', workspaceMiddleware(['admin']), WorkspaceController.delete)


workspace_router.post('/:workspace_id/invite', workspaceMiddleware(['admin']), WorkspaceController.inviteMember)

export default workspace_router