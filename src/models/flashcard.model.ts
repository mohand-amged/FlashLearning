import mongoose from 'mongoose';
import { ref } from 'process';

const flashcardSchema = new mongoose.Schema(
  {
    front: { type: String, required: true },
    back: { type: String, required: true },
    subject: { type: mongoose.Schema.Types.ObjectId , ref: 'Subject', required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Flashcard', flashcardSchema);