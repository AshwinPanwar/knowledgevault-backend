const Note = require("../models/note");
const ApiError = require("../untils/ApiError");
const asyncHandler = require("express-async-handler");

const createNote = asyncHandler(async(req , res) =>{

        const{ title , content, category } = req.body; 

        const note = await Note.create({
            title,
            content,
            category,
            user: req.user.userId
        });

        res.status(201).json({
            success: true,
            data: note
        }); 
});

const getAllNotes = asyncHandler(async (req, res) => {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const query = {};

    query.user = req.user.userId;
    query.isDeleted = false;

    if (req.query.category) {
        query.category = req.query.category;
    }

    if (req.query.search) {
        query.title = {
            $regex: req.query.search,
            $options: "i"
        };
    }

    const sort = req.query.sort;

    let sortOption = { createdAt: -1 };

    if (sort === "oldest") {
        sortOption = { createdAt: 1 };
    }

    const notes = await Note.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit);

    res.status(200).json({
        success: true,
        count: notes.length,
        data: notes
    });

});

const getNoteById = asyncHandler(async(req, res) => {

        const note = await Note.findById(req.params.id);

        if(!note){
            throw new ApiError("Note not found", 404);
        }

        res.status(200).json({
            success: true,
            data: note
        });

});

const updateNote = asyncHandler(async (req, res) => {

        const note = await Note.findOne({
            _id: req.params.id,
            user: req.user.userId
        });

        if(!note){
            throw new ApiError("Note not found", 404);
        }

        note.title = req.body.title;
        note.content = req.body.content;
        note.category = req.body.category;
        await note.save();


        res.status(200).json({
            success: true,
            data: note
        });
        
}); 

const deleteNote = asyncHandler(async(req, res) =>{

        const note = await Note.findOne({
            _id: req.params.id,
            userId: req.user.userId
        });


        if(!note) {
            throw new ApiError("Note not found",404);
        }

        await note.deleteOne();

        res.status(200).json({
            success: true,
            message: "Note deleted successfully",
            data: note
        });

});

const toggleFavorite = asyncHandler(async (req, res) => {

    const note = await Note.findOne({
        _id: req.params.id,
        user: req.user.userId
    });

    if (!note) {
        throw new ApiError("Note not found", 404);
    }

    note.favorite = !note.favorite;

    await note.save();

    res.status(200).json({
        success: true,
        message: "Favorite status updated",
        data: note
    });

});

const softDeleteNote = asyncHandler(async (req, res) => {

    const note = await Note.findOne({
        _id: req.params.id,
        user: req.user.userId
    });

    if (!note) {
        throw new ApiError("Note not found", 404);
    }

    if (note.isDeleted) {
        throw new ApiError("Note is already in Trash", 400);
    }

    note.isDeleted = true;
    note.deletedAt = new Date();

    await note.save();

    res.status(200).json({
        success: true,
        message: "Note moved to Trash"
    });

});

const getTrashNotes = asyncHandler(async (req, res) => {

    const notes = await Note.find({
        user: req.user.userId,
        isDeleted: true
    }).sort({ deletedAt: -1 });

    res.status(200).json({
        success: true,
        count: notes.length,
        data: notes
    });

});

const restoreNote = asyncHandler(async(req,res) => {

const note = await Note.findOne({
    _id: req.params.id,
    user: req.user.userId,
    isDeleted: true
});

if (!note) {
    throw new ApiError("Note not found", 404);
}

note.isDeleted = false;
note.deletedAt = null;

await note.save();

res.status(200).json({
    success: true,
    message: "Note restored successfully",
    data: note
});
    
});

const permanentDeleteNote = asyncHandler(async (req, res) => {

    const note = await Note.findOneAndDelete({
        _id: req.params.id,
        user: req.user.userId,
        isDeleted: true
    });

    if (!note) {
        throw new ApiError("Note not found in Trash", 404);
    }

    res.status(200).json({
        success: true,
        message: "Note permanently deleted"
    });

});


module.exports = { createNote ,getAllNotes , getNoteById , updateNote, deleteNote , toggleFavorite, softDeleteNote , getTrashNotes, restoreNote, permanentDeleteNote  };