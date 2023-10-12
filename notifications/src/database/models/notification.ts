import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from './index';
import { NOTIFICATION_TYPE } from '../../../../interface/notifications';

export class Notification extends Model<
  InferAttributes<Notification>,
  InferCreationAttributes<Notification>
> {
  id!: CreationOptional<number>;
  UserId?: number;
  title!: string;
  message!: string;
  email!: string;
  type?: NOTIFICATION_TYPE;
  createdAt!: Date;
  updatedAt!: Date;
}

Notification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    type: {
      type: DataTypes.ENUM,
      values: [NOTIFICATION_TYPE.EMAIL, NOTIFICATION_TYPE.SMS],
      defaultValue: NOTIFICATION_TYPE.EMAIL
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    email: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize: sequelize,
    modelName: 'Notification',
  }
);
