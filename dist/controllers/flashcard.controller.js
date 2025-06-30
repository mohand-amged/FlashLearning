"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFlashcard = exports.updateFlashcard = exports.getFlashcardById = exports.getUserFlashcards = exports.createFlashcard = void 0;
const flashcard_model_1 = __importDefault(require("../models/flashcard.model"));
const subject_model_1 = __importDefault(require("../models/subject.model"));
// Create Flashcard
const createFlashcard = async (req, res, next) => {
    const { front, back, subject: subName } = req.body;
    const userId = req.user?.userId;
    try {
        let subject = await subject_model_1.default.findOne({ subName, owner: userId });
        if (!subject) {
            subject = await subject_model_1.default.create({ subName, owner: userId });
        }
        const flashcard = await flashcard_model_1.default.create({
            front,
            back,
            subject: subject._id,
            owner: userId,
        });
        res.status(201).json(flashcard);
    }
    catch (error) {
        next(error);
    }
};
exports.createFlashcard = createFlashcard;
// Get All Flashcards for Authenticated User
const getUserFlashcards = async (req, res, next) => {
    const userId = req.user?.userId;
    const { subject } = req.query;
    try {
        const query = { owner: userId };
        if (subject && typeof subject === 'string') {
            const subjectDoc = await subject_model_1.default.findOne({ subName: subject, owner: userId });
            if (subjectDoc) {
                query.subject = subjectDoc._id.toString();
            }
            else {
                res.status(200).json([]);
                return;
            }
        }
        const flashcards = await flashcard_model_1.default.find(query).populate('subject');
        res.status(200).json(flashcards);
    }
    catch (error) {
        next(error);
    }
};
exports.getUserFlashcards = getUserFlashcards;
// Get Flashcard by ID
const getFlashcardById = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user?.userId;
    try {
        const flashcard = await flashcard_model_1.default.findOne({ _id: id, owner: userId }).populate('subject');
        if (!flashcard) {
            res.status(404).json({ message: 'Flashcard not found' });
            return;
        }
        res.status(200).json(flashcard);
    }
    catch (error) {
        next(error);
    }
};
exports.getFlashcardById = getFlashcardById;
// Update flashcard
const updateFlashcard = async (req, res, next) => {
    const { id } = req.params;
    const { front, back, subject } = req.body;
    const userId = req.user?.userId;
    try {
        // Note: This update logic does not create a new subject.
        // It assumes the subject (if provided) already exists.
        // For simplicity, we are finding the subject ID to update the reference.
        let subjectDoc;
        if (subject) {
            subjectDoc = await subject_model_1.default.findOne({ subName: subject, owner: userId });
            if (!subjectDoc) {
                res.status(404).json({ message: `Subject '${subject}' not found.` });
                return;
            }
        }
        const updatedCard = await flashcard_model_1.default.findOneAndUpdate({ _id: id, owner: userId }, { front, back, subject: subjectDoc ? subjectDoc._id : undefined }, { new: true }).populate('subject');
        if (!updatedCard) {
            res.status(404).json({ message: 'Flashcard not found' });
            return;
        }
        res.status(200).json(updatedCard);
    }
    catch (error) {
        next(error);
    }
};
exports.updateFlashcard = updateFlashcard;
// Delete flashcard
const deleteFlashcard = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user?.userId;
    try {
        const deletedCard = await flashcard_model_1.default.findOneAndDelete({ _id: id, owner: userId });
        if (!deletedCard) {
            res.status(404).json({ message: 'Flashcard not found' });
            return;
        }
        res.status(200).json({ message: 'Flashcard deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteFlashcard = deleteFlashcard;
