const asyncHandler = require('../../middleware/asyncHandler');
const ErrorResponse = require('../../utils/ErrorResponse');
const { validationCheck } = require('../../middleware/validationCheck');

//models
const QuestionPaper = require('../../models/qp');

exports.createQuestionPaper = asyncHandler(async (req, res) => {
    const { name, subject, date, marks, } = req.body;
    const qp = {
        name, subject, date, marks,
    };
    const validation = validationCheck({
        name, subject, date, marks,
    });
    if (!validation.status) {
        throw new ErrorResponse(`Please provide a ${validation?.errorAt}`, 400);
    }

    try {
        const QuestionPaperData = await QuestionPaper.create(qp);
        return res.status(201).json({ success: true, data: QuestionPaperData });
    } catch (error) {
        throw new ErrorResponse(`Server error :${error}`, 400);
    }
})

exports.getAllQP = asyncHandler(async (req, res) => {
    try {
        const QuestionPaperData = await QuestionPaper.find();
        return res.status(201).json({ success: true, data: QuestionPaperData });
    } catch (error) {
        throw new ErrorResponse(`Server error :${error}`, 400);
    }
})

exports.getSingleQP = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ErrorResponse(`Please provide id`, 400);
    }
    try {
        const QuestionPaperData = await QuestionPaper.findOne({ _id: id });
        return res.status(201).json({ success: true, data: QuestionPaperData });
    } catch (error) {
        throw new ErrorResponse(`Server error :${error}`, 400);
    }
})

exports.updateQP = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { subject, date, marks, } = req.body;
    const qp = {
        subject, date, marks,
    };
    const validation = validationCheck({
        subject, date, marks,
    });
    if (!validation.status) {
        throw new ErrorResponse(`Please provide a ${validation?.errorAt}`, 400);
    }
    if (!id) {
        throw new ErrorResponse(`Please provide id`, 400);
    }
    try {
        const QuestionPaperData = await QuestionPaper.findOneAndUpdate({ _id: id }, { ...qp }, { returnOriginal: false });
        return res.status(201).json({ success: true, data: QuestionPaperData});
    } catch (error) {
        throw new ErrorResponse(`Server error :${error}`, 400);
    }
})

exports.deleteQP = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ErrorResponse(`Please provide id`, 400);
    }
    try {
        const QuestionPaperData = await QuestionPaper.deleteOne({ _id: id });
        // Delete associated questions and answer
        return res.status(201).json({ success: true, data: "Question Paper Delete Successfully" });
    } catch (error) {
        throw new ErrorResponse(`Server error :${error}`, 400);
    }
})

