import express from "express";
import MessageController from "../controllers/message.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import channelMiddleware from "../middleware/channel.middleware.js";

const message_router = express.Router();

message_router.use(authMiddleware);

message_router.get("/:workspace_id/:channel_id", channelMiddleware, MessageController.getAllByChannel);


message_router.get("/:message_id", MessageController.getById);


message_router.post("/", MessageController.post);


message_router.put("/:message_id", MessageController.update);


message_router.delete("/:message_id", MessageController.delete);

export default message_router;
