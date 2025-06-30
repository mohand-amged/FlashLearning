import express from 'express';
import { createSubject, getAllSubjects, deleteSubject, getSubjectById } from '../controllers/subject.controller';
import { authenticate } from '../Middlewares/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Subjects
 *   description: The subject managing API
 */

/**
 * @swagger
 * /api/subjects:
 *   post:
 *     summary: Create a new subject
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subName:
 *                 type: string
 *     responses:
 *       201:
 *         description: The subject was successfully created
 *       400:
 *         description: Subject already exists
 */
router.post('/', authenticate, createSubject);

/**
 * @swagger
 * /api/subjects:
 *   get:
 *     summary: Get all subjects for the authenticated user
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of subjects
 */
router.get('/', authenticate, getAllSubjects);

/**
 * @swagger
 * /api/subjects/{id}:
 *   get:
 *     summary: Get a subject by ID along with its flashcards
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The subject ID
 *     responses:
 *       200:
 *         description: The subject and its associated flashcards
 *       404:
 *         description: The subject was not found
 */
router.get('/:id', authenticate, getSubjectById);

/**
 * @swagger
 * /api/subjects/{id}:
 *   delete:
 *     summary: Delete a subject by ID
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The subject ID
 *     responses:
 *       200:
 *         description: The subject was deleted
 *       404:
 *         description: The subject was not found
 */
router.delete('/:id', authenticate, deleteSubject);

export default router; 