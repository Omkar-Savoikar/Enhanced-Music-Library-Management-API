import { Router } from "express";

import { ROLES } from "../config/constants.js";
import TrackController from "../controllers/track.controller.js";
import AuthMiddleware from "../middleware/auth.middleware.js";

const trackRouter = Router();

trackRouter.use(AuthMiddleware.authenticate);

trackRouter.get("/", TrackController.getTracks);

trackRouter.get("/:id", TrackController.getTrackById);

trackRouter.post("/add-track", AuthMiddleware.authorize([ROLES.ADMIN, ROLES.EDITOR]), TrackController.createTrack);

trackRouter.put("/:id", AuthMiddleware.authorize([ROLES.ADMIN, ROLES.EDITOR]), TrackController.updateTrack);

trackRouter.delete("/:id", TrackController.deleteTrack);

export default trackRouter;
