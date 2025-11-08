import express from "express";
import ChannelController from "../controllers/channel.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import channelMiddleware from "../middleware/channel.middleware.js";

const channel_router = express.Router();

channel_router.use(authMiddleware);


channel_router.get("/workspace/:workspace_id", ChannelController.getAllByWorkspace);


channel_router.get("/:workspace_id/:channel_id", channelMiddleware, ChannelController.getById);


channel_router.post("/", ChannelController.post);


channel_router.put("/:workspace_id/:channel_id", channelMiddleware, ChannelController.update);
channel_router.delete("/:workspace_id/:channel_id", channelMiddleware, ChannelController.delete);

export default channel_router;