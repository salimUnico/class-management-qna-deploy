const asyncHandler = require('../../middleware/asyncHandler');
const ErrorResponse = require('../../utils/ErrorResponse');
const { validationCheck } = require('../../middleware/validationCheck');

//models
const Notes = require('../../models/notes');

exports.createNotes = asyncHandler(async (req, res) => {
    const { name, json, } = req.body;
    const note = {
        name,
    };
    const validation = validationCheck({
        name,
    });
    if (!validation.status) {
        throw new ErrorResponse(`Please provide a ${validation?.errorAt}`, 400);
    }

    try {
        const NotesData = await Notes.create(note);
        return res.status(201).json({ success: true, data: NotesData });
    } catch (error) {
        throw new ErrorResponse(`Server error :${error}`, 400);
    }
})

exports.getAllNotes = asyncHandler(async (req, res) => {
    try {
        const NotesData = await Notes.find({ });
        return res.status(201).json({ success: true, data: NotesData });
    } catch (error) {
        throw new ErrorResponse(`Server error :${error}`, 400);
    }
})

exports.getSingleNotes = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ErrorResponse(`Please provide id`, 400);
    }
    try {
        const NotesData = await Notes.findOne({ _id: id });
        return res.status(201).json({ success: true, data: NotesData });
    } catch (error) {
        throw new ErrorResponse(`Server error :${error}`, 400);
    }
})

exports.deleteNotes = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ErrorResponse(`Please provide id`, 400);
    }
    try {
        const NotesData = await Notes.deleteOne({ _id: id });
        // Delete associated questions and answer
        return res.status(201).json({ success: true, data: "Notes Deleted Successfully" });
    } catch (error) {
        throw new ErrorResponse(`Server error :${error}`, 400);
    }
})

exports.updateNotes = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { json } = req.body;
    const qp = {
        json
    };
    const validation = validationCheck({
        json
    });
    if (!validation.status) {
        throw new ErrorResponse(`Please provide a ${validation?.errorAt}`, 400);
    }
    if (!id) {
        throw new ErrorResponse(`Please provide id`, 400);
    }
    try {
        const NotesData = await Notes.findOneAndUpdate({ _id: id }, { ...qp }, { returnOriginal: false });
        return res.status(201).json({ success: true, data: NotesData });
    } catch (error) {
        throw new ErrorResponse(`Server error :${error}`, 400);
    }
})