"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flashcardSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.flashcardSchema = joi_1.default.object({
    front: joi_1.default.string().min(1).required(),
    back: joi_1.default.string().min(1).required(),
    subject: joi_1.default.string().min(1).required(),
});
