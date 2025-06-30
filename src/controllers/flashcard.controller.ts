import { Response, NextFunction } from 'express';
import Flashcard from '../models/flashcard.model';
import Subject from '../models/subject.model';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';

// Create Flashcard
export const createFlashcard = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { front, back, subject: subName } = req.body;
  const userId = req.user?.userId;

  try {
    let subject = await Subject.findOne({ subName, owner: userId });

    if (!subject) {
      subject = await Subject.create({ subName, owner: userId });
    }

    const flashcard = await Flashcard.create({
      front,
      back,
      subject: subject._id,
      owner: userId,
    });

    res.status(201).json(flashcard);
  } catch (error) {
    next(error);
  }
};

// Get All Flashcards for Authenticated User
export const getUserFlashcards = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.user?.userId;
  const { subject } = req.query;

  try {
    const query: { owner: string; subject?: string } = { owner: userId! };

    if (subject && typeof subject === 'string') {
      const subjectDoc = await Subject.findOne({ subName: subject, owner: userId });
      if (subjectDoc) {
        query.subject = subjectDoc._id.toString();
      } else {
        res.status(200).json([]);
        return;
      }
    }

    const flashcards = await Flashcard.find(query).populate('subject');
    res.status(200).json(flashcards);
  } catch (error) {
    next(error);
  }
};

// Get Flashcard by ID
export const getFlashcardById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?.userId;

  try {
    const flashcard = await Flashcard.findOne({ _id: id, owner: userId }).populate('subject');

    if (!flashcard) {
      res.status(404).json({ message: 'Flashcard not found' });
      return;
    }

    res.status(200).json(flashcard);
  } catch (error) {
    next(error);
  }
};

// Update flashcard
export const updateFlashcard = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const { front, back, subject } = req.body;
  const userId = req.user?.userId;

  try {
    // Note: This update logic does not create a new subject.
    // It assumes the subject (if provided) already exists.
    // For simplicity, we are finding the subject ID to update the reference.
    let subjectDoc;
    if (subject) {
        subjectDoc = await Subject.findOne({ subName: subject, owner: userId });
        if (!subjectDoc) {
            res.status(404).json({ message: `Subject '${subject}' not found.` });
            return;
        }
    }
    
    const updatedCard = await Flashcard.findOneAndUpdate(
      { _id: id, owner: userId },
      { front, back, subject: subjectDoc ? subjectDoc._id : undefined },
      { new: true }
    ).populate('subject');

    if (!updatedCard) {
      res.status(404).json({ message: 'Flashcard not found' });
      return;
    }

    res.status(200).json(updatedCard);
  } catch (error) {
    next(error);
  }
};

// Delete flashcard
export const deleteFlashcard = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?.userId;

  try {
    const deletedCard = await Flashcard.findOneAndDelete({ _id: id, owner: userId });

    if (!deletedCard) {
      res.status(404).json({ message: 'Flashcard not found' });
      return;
    }

    res.status(200).json({ message: 'Flashcard deleted successfully' });
  } catch (error) {
    next(error);
  }
};
