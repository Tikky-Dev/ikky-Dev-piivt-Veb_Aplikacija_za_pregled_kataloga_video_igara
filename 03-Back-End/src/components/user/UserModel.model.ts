import IModel from '../../common/IModel.interface';
import ReviewModel from '../review/ReviewModel.model';

class UserModel implements IModel{
    userId: number;
    name: string;
    surname: string;
    address: string;
    place: string;
    email: string;
    phone: string;
    password: string|null;
    isActive: boolean;
    activationCode: string | null;
    passwordResetCode: string | null;

    reviews: ReviewModel[];
}

export default UserModel;