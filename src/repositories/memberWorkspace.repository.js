import mongoose from "mongoose";
import MemberWorkspace from "../models/MemberWorkspace.model.js";
import { ServerError } from "../utils/customError.utils.js";

class MemberWorkspaceRepository {
    static async getAllWorkspacesByUserId(user_id) {
        const workspaces_que_soy_miembro = await MemberWorkspace
            .find({ user: user_id })
            .populate({
                path: 'workspace',
                match: { active: true }
            })
            .exec();

        const validWorkspaces = workspaces_que_soy_miembro.filter(member => member.workspace !== null);
        
        console.log('Workspaces del usuario:', validWorkspaces);
        return validWorkspaces;
    }

    static async getMemberWorkspaceByUserIdAndWorkspaceId(user_id, workspace_id) {
        const member_workspace = await MemberWorkspace.findOne({ 
            user: user_id, 
            workspace: workspace_id 
        });
        return member_workspace;
    }

    static async create(user_id, workspace_id, role = 'member') {
        const member = await MemberWorkspaceRepository.getMemberWorkspaceByUserIdAndWorkspaceId(user_id, workspace_id);
        
        if (member) {
            throw new ServerError(400, 'El usuario ya es miembro del workspace');
        }
        
        const newMember = await MemberWorkspace.create({
            user: user_id,
            workspace: workspace_id,
            role: role
        });
        
        return newMember;
    }
}

export default MemberWorkspaceRepository;