import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    CreationOptional,
  } from 'sequelize';
import { Notification } from './notification';
import { Plan } from './associations/plan';
import { UserPlanSubscription } from './associations/userSubscription';
  const { sequelize } = require('./index');
  
  export class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
  > {
    id!: CreationOptional<number>;
    ipAddress!: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      ipAddress: {
        type: DataTypes.STRING,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, modelName: 'User', tableName: 'User' }
  );
  
  User.hasOne(UserPlanSubscription, { onDelete: 'CASCADE'});
  UserPlanSubscription.belongsTo(User)
  
  UserPlanSubscription.belongsTo(Plan);
  Plan.hasMany(UserPlanSubscription, { onDelete: 'CASCADE' });
  


  User.hasMany(Notification, {
    as: 'Notifications',
    onDelete: 'CASCADE',
  });
  Notification.belongsTo(User);