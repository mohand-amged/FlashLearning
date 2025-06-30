"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const flashcardSchema = new mongoose_1.default.Schema({
    front: { type: String, required: true },
    back: { type: String, required: true },
    subject: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Subject', required: true },
    owner: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
exports.default = mongoose_1.default.model('Flashcard', flashcardSchema);
