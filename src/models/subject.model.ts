import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  subName: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('Subject', subjectSchema);
