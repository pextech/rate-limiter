import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
const { sequelize } = require('../index');

export class Plan extends Model<
  InferAttributes<Plan>,
  InferCreationAttributes<Plan>
> {
  id!: number;
  name!: string;
  price!: number;
  requestPerMinute!: number;
  monthlyRequests!: number;
  createdAt!: Date;
  updatedAt!: Date;
}

Plan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.INTEGER,
    },
    requestPerMinute: {
      type: DataTypes.INTEGER,
    },
    monthlyRequests: {
      type: DataTypes.INTEGER,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize: sequelize, modelName: 'Plan' }
);
