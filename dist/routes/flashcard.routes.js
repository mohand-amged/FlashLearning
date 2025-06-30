"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const flashcard_controller_1 = require("../controllers/flashcard.controller");
const authMiddleware_1 = require("../Middlewares/authMiddleware");
const validationMiddleware_1 = require("../Middlewares/validationMiddleware");
const flashcard_validator_1 = require("../validators/flashcard.validator");
const router = express_1.default.Router();
/**
 * @swagger
 * /api/flashcards:
 *   post:
 *     summary: Create a new flashcard
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               front:
 *                 type: string
 *               back:
 *                 type: string
 *               subject:
 *                 type: string
 *     responses:
 *       201:
 *         description: The flashcard was successfully created
 *       400:
 *         description: Invalid input
 */
router.post('/', authMiddleware_1.authenticate, (0, validationMiddleware_1.validate)(flashcard_validator_1.flashcardSchema), flashcard_controller_1.createFlashcard);
/**
 * @swagger
 * /api/flashcards:
 *   get:
 *     summary: Get all flashcards for the authenticated user, optionally filtered by subject
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: subject
 *         schema:
 *           type: string
 *         required: false
 *         description: The subject to filter flashcards by
 *     responses:
 *       200:
 *         description: A list of flashcards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Flashcard'
 */
router.get('/', authMiddleware_1.authenticate, flashcard_controller_1.getUserFlashcards);
/**
 * @swagger
 * /api/flashcards/{id}:
 *   get:
 *     summary: Get a flashcard by ID
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The flashcard ID
 *     responses:
 *       200:
 *         description: The flashcard description by id
 *       404:
 *         description: The flashcard was not found
 */
router.get('/:id', authMiddleware_1.authenticate, flashcard_controller_1.getFlashcardById);
/**
 * @swagger
 * /api/flashcards/{id}:
 *   put:
 *     summary: Update a flashcard by ID
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The flashcard ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Flashcard'
 *     responses:
 *       200:
 *         description: The flashcard was updated
 *       404:
 *         description: The flashcard was not found
 */
router.put('/:id', authMiddleware_1.authenticate, (0, validationMiddleware_1.validate)(flashcard_validator_1.flashcardSchema), flashcard_controller_1.updateFlashcard);
/**
 * @swagger
 * /api/flashcards/{id}:
 *   delete:
 *     summary: Delete a flashcard by ID
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The flashcard ID
 *     responses:
 *       200:
 *         description: The flashcard was deleted
 *       404:
 *         description: The flashcard was not found
 */
router.delete('/:id', authMiddleware_1.authenticate, flashcard_controller_1.deleteFlashcard);
exports.default = router;
