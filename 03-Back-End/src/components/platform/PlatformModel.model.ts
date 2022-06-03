import IModel from '../../common/IModel.interface';
class PlatformModel implements IModel{
    platformId: number;
    name: string;
    isActive: boolean;
}

export default PlatformModel;