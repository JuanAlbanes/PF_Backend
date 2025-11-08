import ChannelModel from "../models/Channel.model.js"
import mongoose from "mongoose"

class ChannelRepository {
    static async getAllByWorkspace(workspace_id) {
        let workspaceObjectId
        try {
            workspaceObjectId = new mongoose.Types.ObjectId(workspace_id)
        } catch (error) {
            throw new Error(`ID de workspace inválido: ${workspace_id}`)
        }
        
        const channels = await ChannelModel.find({ workspace: workspaceObjectId }).populate('workspace')
        return channels
    }

    static async getById(channel_id) {
        return await ChannelModel.findById(channel_id).populate('workspace')
    }

    static async getByIdAndWorkspaceId(channel_id, workspace_id) {
        let channelObjectId, workspaceObjectId
        
        try {
            channelObjectId = new mongoose.Types.ObjectId(channel_id)
            workspaceObjectId = new mongoose.Types.ObjectId(workspace_id)
        } catch (error) {
            throw new Error(`IDs inválidos: channel_id=${channel_id}, workspace_id=${workspace_id}`)
        }

        const channel = await ChannelModel.findOne({
            _id: channelObjectId,
            workspace: workspaceObjectId
        }).populate('workspace')
        
        return channel
    }

    static async createChannel({ name, description, workspace_id, private: isPrivate = false }) {
        let workspaceObjectId
        try {
            workspaceObjectId = new mongoose.Types.ObjectId(workspace_id)
        } catch (error) {
            throw new Error(`ID de workspace inválido: ${workspace_id}`)
        }

        const channel = new ChannelModel({
            name,
            description,
            workspace: workspaceObjectId,
            private: isPrivate
        })
        
        await channel.save()
        return channel
    }

    static async update(channel_id, updateData) {
        const channel_updated = await ChannelModel.findByIdAndUpdate(
            channel_id, 
            {
                ...updateData,
                modified_at: new Date()
            }, 
            {
                new: true
            }
        ).populate('workspace')
        return channel_updated
    }

    static async delete(channel_id) {
        const channel_deleted = await ChannelModel.findByIdAndDelete(channel_id)
        return channel_deleted
    }
}

export default ChannelRepository