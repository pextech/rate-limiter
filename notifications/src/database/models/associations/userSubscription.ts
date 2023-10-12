import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
const { sequelize } = require('../index');

export class UserPlanSubscription extends Model<
  InferAttributes<UserPlanSubscription>,
  InferCreationAttributes<UserPlanSubscription>
> {
  id?: number;
  UserId?: number;
  PlanId?: number;
  commissionPercentage!: number;
  recurringPayments!: boolean;
  nextCharge!: Date;
  nextDue!: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

UserPlanSubscription.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    commissionPercentage: {
      type: DataTypes.INTEGER,
      defaultValue: 10
    },
    recurringPayments: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    nextCharge: DataTypes.DATE,
    nextDue: DataTypes.DATE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize: sequelize, modelName: 'UserPlanSubscription' }
);
