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
 *     summary: Create a new note
 *     tags:
 *       - Notes
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
 *                 example: Learn Express
 *               content:
 *                 type: string
 *                 example: Today I learned Swagger documentation.
 *               category:
 *                 type: string
 *                 example: Backend
 *     responses:
 *       201:
 *         description: Note created successfully
 */
router.post("/", protect, vaildNote, createNote);
/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Get all notes
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched all notes
 */
router.get("/", protect, getAllNotes);

router.get("/trash", protect, getTrashNotes);

router.patch("/:id/favorite", protect, toggleFavorite);

router.patch("/:id/restore", protect, restoreNote);

router.get("/:id", protect, getNoteById);

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: Update a note
 *     tags:
 *       - Notes
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
 *         description: Note updated successfully
 *       404:
 *         description: Note not found
 */
router.put("/:id", protect, updateNote);

router.delete("/:id/permanent", protect, permanentDeleteNote);

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Move note to Trash
 *     tags:
 *       - Notes
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
 *         description: Note moved to Trash
 *       404:
 *         description: Note not found
 */
router.delete("/:id", protect, softDeleteNote);

module.exports = router;