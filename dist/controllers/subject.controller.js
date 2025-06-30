"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubject = exports.updateSubject = exports.getSubjectById = exports.getAllSubjects = exports.createSubject = void 0;
const subject_model_1 = __importDefault(require("../models/subject.model"));
const flashcard_model_1 = __importDefault(require("../models/flashcard.model"));
const createSubject = async (req, res, next) => {
    const { subName } = req.body;
    const userId = req.user?.userId;
    try {
        const existingSubject = await subject_model_1.default.findOne({ subName, owner: userId });
        if (existingSubject) {
            res.status(400).json({ message: 'Subject already exists' });
            return;
        }
        const subject = await subject_model_1.default.create({ subName, owner: userId });
        res.status(201).json(subject);
    }
    catch (error) {
        next(error);
    }
};
exports.createSubject = createSubject;
const getAllSubjects = async (req, res, next) => {
    const userId = req.user?.userId;
    try {
        const subjects = await subject_model_1.default.find({ owner: userId });
        res.status(200).json(subjects);
    }
    catch (error) {
        next(error);
    }
};
exports.getAllSubjects = getAllSubjects;
const getSubjectById = async (req, res, next) => {
    try {
        const subjectId = req.params.id;
        const userId = req.user?.userId;
        const subject = await subject_model_1.default.findOne({ _id: subjectId, owner: userId });
        if (!subject) {
            res.status(404).json({ message: 'Subject not found' });
            return;
        }
        const flashcards = await flashcard_model_1.default.find({ subject: subjectId, owner: userId });
        res.status(200).json({
            subject,
            flashcards,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getSubjectById = getSubjectById;
const updateSubject = async (req, res, next) => {
    const { id } = req.params;
    const { subName } = req.body;
    const userId = req.user?.userId;
    try {
        const subject = await subject_model_1.default.findOneAndUpdate({ _id: id, owner: userId }, { subName }, { new: true });
        if (!subject) {
            res.status(404).json({ message: 'Subject not found' });
            return;
        }
        res.status(200).json(subject);
    }
    catch (error) {
        next(error);
    }
};
exports.updateSubject = updateSubject;
const deleteSubject = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user?.userId;
    try {
        const deletedSubject = await subject_model_1.default.findOneAndDelete({ _id: id, owner: userId });
        if (!deletedSubject) {
            res.status(404).json({ message: 'Subject not found' });
            return;
        }
        res.status(200).json({ message: 'Subject deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteSubject = deleteSubject;
