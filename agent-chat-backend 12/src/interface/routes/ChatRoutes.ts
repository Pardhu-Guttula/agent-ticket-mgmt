import { Router } from 'express';
import { getChatMessagesByCaseId,updateClosedCaseStatus, updateEscalatedCaseStatus } from '../controllers/ChatController';
import { postChatMessage } from '../controllers/ChatController';
const router = Router();

/**
 * @swagger
 * /api/chat/{caseId}:
 *   get:
 *     summary: Retrieve chat messages by case ID
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: caseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the case
 *     responses:
 *       '200':
 *         description: A list of chat messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   messageId:
 *                     type: string
 *                   caseId:
 *                     type: string
 *                   senderType:
 *                     type: string
 *                   message:
 *                     type: string
 *                   timestamp:
 *                     type: string
 *                     format: date-time
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
router.get('/:caseId', getChatMessagesByCaseId);

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Create a new chat message
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uniqueCaseId:
 *                 type: string
 *               senderType:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Chat message created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
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
router.post('/', postChatMessage)

/**
 * @swagger
 * /api/cases/close/{uniqueCaseId}:
 *   put:
 *     summary: Update the status of a case to Closed
 *     tags: [Case Management]
 *     description: Update the status of a case by its Unique ID
 *     parameters:
 *       - in: path
 *         name: uniqueCaseId
 *         schema:
 *           type: string
 *         required: true
 *         description: The Unique case ID
 *       - in: body
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Accepted, Closed, Escalated]
 *         required: true
 *         description: The new status of the case
 *     responses:
 *       200:
 *         description: Case status updated successfully
 *       400:
 *         description: Invalid case ID or status
 *       500:
 *         description: Server error
 */
router.put("/close/:uniqueCaseId", updateClosedCaseStatus);

/**
 * @swagger
 * /api/cases/escalate/{uniqueCaseId}:
 *   put:
 *     summary: Update the status of a case to Escalated
 *     tags: [Case Management]
 *     description: Update the status of a case by its Unique ID
 *     parameters:
 *       - in: path
 *         name: uniqueCaseId
 *         schema:
 *           type: string
 *         required: true
 *         description: The Unique case ID
 *       - in: body
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Accepted, Closed, Escalated]
 *         required: true
 *         description: The new status of the case
 *     responses:
 *       200:
 *         description: Case status updated successfully
 *       400:
 *         description: Invalid case ID or status
 *       500:
 *         description: Server error
 */
router.put("/escalate/:uniqueCaseId", updateEscalatedCaseStatus);
export default router;