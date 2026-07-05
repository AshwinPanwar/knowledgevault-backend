const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        minlength:[3,"Title must be at least 3 characters"],
        maxlength:[80,"Title cannot exceed 80 character"]
    },

    content: {
        type: String,
        required: [true,"Content is required"],
        trim: true,
        minlength:[10, "Content must be at least 10 characters"]
    },

    category:{
        type: String,
        trim: true,
        default: "General"
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    favorite: {
       type: Boolean,
       default: false
},

isDeleted: {
    type: Boolean,
    default: false
},

deletedAt: {
    type: Date,
    default: null
}

}, {
    timestamps: true 
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;