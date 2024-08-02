import { Router } from "express";
import { getCases, updateCaseStatus,getTicketId,createTicket,createCase} from "../../interface/controllers/CaseController"

const router = Router();

/**
* @swagger
* /api/cases:
*   get:
*     summary: Retrieve a list of cases
*     tags: [Case Management]
*     description: Retrieve a list of cases from the database
*     parameters:
*       - in: query
*         name: caseType
*         required: true
*         description: The type of case to retrieve
*         schema:
*           type: string
*           enum: ["Pending", "Accepted", "Closed", "Escalated"]
*     responses:
*       200:
*         description: A list of cases
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   id:
*                     type: integer
*                     example: 1
*                   name:
*                     type: string
*                     example: "Case Name"
*                   status:
*                     type: string
*                     example: "open"
*       400:
*         description: Invalid caseType parameter
*       500:
*         description: Internal server error
*/
router.get("/", getCases);

/**
* @swagger
* /api/cases/accept/{uniqueCaseId}:
*   put:
*     summary: Update the status of a case to Accepted
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
router.put("/accept/:uniqueCaseId", updateCaseStatus);

/**
* @swagger
* /api/cases/ticket-url/{uniqueCaseId}:
*   get:
*     summary: Retrieve the ticket URL for a specific case
*     tags: [Case Management]
*     description: Retrieve the ticket URL from the database for a specific case by its Unique ID
*     parameters:
*       - in: path
*         name: uniqueCaseId
*         required: true
*         description: The Unique case ID
*         schema:
*           type: string
*     responses:
*       200:
*         description: The ticket URL
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 ticketUrl:
*                   type: string
*                   example: "http://example.com/ticket/123"
*       400:
*         description: Invalid case ID
*       500:
*         description: Internal server error
*/
router.get("/ticketId/:uniqueCaseId", getTicketId);  
router.post("/create-ticket", createTicket);
router.post("/createcase/:uniqueUserId",createCase)


export default router;
 