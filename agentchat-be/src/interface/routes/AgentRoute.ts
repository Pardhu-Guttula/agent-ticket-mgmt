import { Router } from 'express';
import { getAgentId } from "../controllers/AgentIdController";

const router = Router();

/**
* @swagger
* /api/agent/{uniqueUserId}:
*   get:
*     summary: Get Agent by User ID
*     tags: [Chat]
*     description: Retrieve agent information using the unique user ID.
*     parameters:
*       - in: path
*         name: uniqueUserId
*         schema:
*           type: string
*         required: true
*         description: Unique user ID of the agent
*     responses:
*       200:
*         description: Successful retrieval of agent information
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 uniqueUserId:
*                   type: string
*                 userName:
*                   type: string
*                 userEmail:
*                   type: string
*                 userMobile:
*                   type: string
*                 profileUrl:
*                   type: string
*       404:
*         description: Agent not found
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*       400:
*         description: Bad request
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*/
router.get('/:uniqueUserId', getAgentId);

export default router;
