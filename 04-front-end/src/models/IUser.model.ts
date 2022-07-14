export default interface IUser {
    userId: number;
    email: string;
    name: string;
    surname: string;
    password: string|null;
    address: string;
    place: string;
    isActive: boolean;
    activationCode: string|null;
    passwordResetCode: string|null;
}