import { Request, Response, NextFunction } from 'express';
import Subject from '../models/subject.model';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';
import Flashcard from '../models/flashcard.model';

export const createSubject = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const { subName } = req.body;
  const userId = req.user?.userId;

  try {
    const existingSubject = await Subject.findOne({ subName, owner: userId });
    if (existingSubject) {
      res.status(400).json({ message: 'Subject already exists' });
      return;
    }

    const subject = await Subject.create({ subName, owner: userId });
    res.status(201).json(subject);
  } catch (error) {
    next(error);
  }
};

export const getAllSubjects = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.user?.userId;

  try {
    const subjects = await Subject.find({ owner: userId });
    res.status(200).json(subjects);
  } catch (error) {
    next(error);
  }
};

export const getSubjectById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const subjectId = req.params.id;
    const userId = req.user?.userId;

    const subject = await Subject.findOne({ _id: subjectId, owner: userId });
    if (!subject) {
      res.status(404).json({ message: 'Subject not found' });
      return;
    }

    const flashcards = await Flashcard.find({ subject: subjectId, owner: userId });

    res.status(200).json({
      subject,
      flashcards,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSubject = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { subName } = req.body;
  const userId = req.user?.userId;

  try {
    const subject = await Subject.findOneAndUpdate(
      { _id: id, owner: userId },
      { subName },
      { new: true }
    );

    if (!subject) {
      res.status(404).json({ message: 'Subject not found' });
      return;
    }

    res.status(200).json(subject);
  } catch (error) {
    next(error);
  }
};

export const deleteSubject = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?.userId;

  try {
    const deletedSubject = await Subject.findOneAndDelete({ _id: id, owner: userId });
    if (!deletedSubject) {
      res.status(404).json({ message: 'Subject not found' });
      return;
    }
    res.status(200).json({ message: 'Subject deleted successfully' });
  } catch (error) {
    next(error);
  }
};
