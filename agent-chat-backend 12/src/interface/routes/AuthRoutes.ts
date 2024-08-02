import { Router } from "express";
import { registerAgent } from "../controllers/AgentRegisterController";
import { loginAgent} from "../controllers/AgentLoginController";

const router = Router();
/**
* @swagger
* /api/auth/register:
*   post:
*     summary: Register a new agent
*     tags: [Authentication]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               name:
*                 type: string
*               email:
*                 type: string
*               password:
*                 type: string
*               mobile:
*                 type: string  # Make sure this matches your data type
*     responses:
*       '201':
*         description: Created
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 id:
*                   type: number
*                 name:
*                   type: string
*                 email:
*                   type: string
*                 mobile:
*                   type: string  # Ensure mobile is included in the response schema
*                 createdOn:
*                   type: string
*       '500':
*         description: Internal Server Error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*/
router.post("/register", registerAgent);

/**
* @swagger
* /api/auth/login:
*   post:
*     summary: Authenticate an agent
*     tags: [Authentication]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               email:
*                 type: string
*               password:
*                 type: string
*     responses:
*       '200':
*         description: Successful login
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 token:
*                   type: string
*                 uniqueAgentId:
*                   type: string
*       '400':
*         description: Bad Request
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*       '500':
*         description: Internal Server Error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*/
router.post("/login", loginAgent);
export default router;
 