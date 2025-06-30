export interface IFlashcard {
  front: string;
  back: string;
  subject?: string;
  owner: string; // user._id
}