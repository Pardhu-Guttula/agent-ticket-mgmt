import { Router } from 'express';
import { getUserConversations } from "../controllers/ConversationController";
 
const router = Router();

/**
 * @swagger
 * /api/conversation/{agentId}:
 *   get:
 *     summary: Retrieve conversations for a specific agent
 *     tags: [Conversations]
 *     parameters:
 *       - in: path
 *         name: agentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the agent
 *     responses:
 *       '200':
 *         description: A list of conversations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   conversationId:
 *                     type: string
 *                   agentId:
 *                     type: string
 *                   messages:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         sender:
 *                           type: string
 *                         message:
 *                           type: string
 *                         timestamp:
 *                           type: string
 *                           format: date-time
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get('/:agentId', getUserConversations);
 
export default router;