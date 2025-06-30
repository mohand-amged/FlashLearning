export interface ISubject {
    subName: string;
    description: string;
    owner: string; // user._id
    createdAt?: Date;
    updatedAt?: Date;
}