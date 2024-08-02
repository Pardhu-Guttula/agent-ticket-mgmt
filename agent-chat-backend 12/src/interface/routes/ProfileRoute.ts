import { Router } from "express";
import { getProfile } from "../controllers/ProfileController";
import { authMiddleware } from "../../infrastructure/middlewares/AuthMiddleware";

const router = Router();

// Define route to capture agentId from URL
/**
* @swagger
* /api/profile/{agentId}:
*   get:
*     summary: Get profile by agent ID
*     tags: [agent]
*     parameters:
*       - in: path
*         name: agentId
*         schema:
*           type: string
*         required: true
*         description: The ID of the agent
*     responses:
*       200:
*         description: Profile found
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 id:
*                   type: string
*                   example: "1"
*                 name:
*                   type: string
*                   example: "John Doe"
*                 email:
*                   type: string
*                   example: "john.doe@example.com"
*       400:
*         description: Invalid agent ID provided
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   example: "ERROR_INVALID_AGENT_ID"
*       404:
*         description: Profile not found
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   example: "ERROR_AGENT_NOT_FOUND"
*       500:
*         description: Internal server error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   example: "ERROR_INTERNAL_SERVER"
*/
router.get('/:agentId', getProfile);

export default router;
 