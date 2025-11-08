import MessageModel from "../models/ChannelMessage.model.js"

class MessageRepository {

    static async getAllByChannel(channel_id) {
        return await MessageModel.find({ channel: channel_id })
            .populate("user", "name email")
            .populate("channel")
            .sort({ created_at: 1 })
    }

    static async getById(message_id) {
        return await MessageModel.findById(message_id)
            .populate("user", "name email")
            .populate("channel")
    }

    static async createMessage(channel_id, user_id, content) {
        const message = new MessageModel({
            channel: channel_id,
            user: user_id,
            content: content
        })
        await message.save()
        return await message.populate("user", "name email")
    }

    static async update(message_id, content) {
        const message_updated = await MessageModel.findByIdAndUpdate(
            message_id, 
            { 
                content: content 
            }, 
            {
                new: true
            }
        ).populate("user", "name email").populate("channel")
        return message_updated
    }

    static async delete(message_id) {
        const message_deleted = await MessageModel.findByIdAndDelete(message_id)
        return message_deleted
    }
}

export default MessageRepository