const express = require("express");
const{ createNote ,
     getAllNotes ,
     getNoteById ,
     updateNote ,
     deleteNote ,
     toggleFavorite ,
     softDeleteNote , 
     getTrashNotes ,
     restoreNote ,
     permanentDeleteNote
    } = require("../controllers/noteController");

const {protect,vaildNote} = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/notes:
 *   post:
 *     tags:
 *       - Notes
 *     summary: Create a new note
 *     description: Creates a new note for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: Learn Swagger
 *               content:
 *                 type: string
 *                 example: Today I learned how to document REST APIs using Swagger.
 *               category:
 *                 type: string
 *                 example: Backend
 *     responses:
 *       201:
 *         description: Note created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized. JWT token is missing or invalid.
 */
router.post("/", protect, vaildNote, createNote);
/**
 * @swagger
 * /api/notes:
 *   get:
 *     tags:
 *       - Notes
 *     summary: Get all notes
 *     description: Returns all active notes of the authenticated user. Supports search, category filter, sorting and pagination.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search notes by title.
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter notes by category.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 5
 *         description: Number of notes per page.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [latest, oldest]
 *         description: Sort notes by creation date.
 *     responses:
 *       200:
 *         description: Notes retrieved successfully.
 *       401:
 *         description: Unauthorized.
 */
router.get("/", protect, getAllNotes);

/**
 * @swagger
 * /api/notes/trash:
 *   get:
 *     tags:
 *       - Notes
 *     summary: Get Trash
 *     description: Returns all soft deleted notes of the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trash retrieved successfully.
 */
router.get("/trash", protect, getTrashNotes);

/**
 * @swagger
 * /api/notes/{id}/favorite:
 *   patch:
 *     tags:
 *       - Notes
 *     summary: Toggle favorite
 *     description: Marks or removes a note as favorite.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Favorite status updated.
 *       404:
 *         description: Note not found.
 */
router.patch("/:id/favorite", protect, toggleFavorite);

/**
 * @swagger
 * /api/notes/{id}/restore:
 *   patch:
 *     tags:
 *       - Notes
 *     summary: Restore note
 *     description: Restores a note from Trash.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note restored successfully.
 *       404:
 *         description: Note not found.
 */
router.patch("/:id/restore", protect, restoreNote);
/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     tags:
 *       - Notes
 *     summary: Get note by ID
 *     description: Returns a specific note belonging to the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID.
 *     responses:
 *       200:
 *         description: Note retrieved successfully.
 *       404:
 *         description: Note not found.
 */
router.get("/:id", protect, getNoteById);

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     tags:
 *       - Notes
 *     summary: Update a note
 *     description: Updates the title, content and category of an existing note.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Note updated successfully.
 *       404:
 *         description: Note not found.
 */
router.put("/:id", protect, updateNote);

/**
 * @swagger
 * /api/notes/{id}/permanent:
 *   delete:
 *     tags:
 *       - Notes
 *     summary: Permanently delete a note
 *     description: Permanently removes a note from the database.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note permanently deleted.
 *       404:
 *         description: Note not found.
 */
router.delete("/:id/permanent", protect, permanentDeleteNote);

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     tags:
 *       - Notes
 *     summary: Move note to Trash
 *     description: Performs a soft delete by moving the note to the Trash.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note moved to Trash.
 *       404:
 *         description: Note not found.
 */
router.delete("/:id", protect, softDeleteNote);

module.exports = router;