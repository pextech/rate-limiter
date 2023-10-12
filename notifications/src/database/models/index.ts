import { Sequelize } from 'sequelize';

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];
const db: { sequelize?: Sequelize } = {};


let sequelize = new Sequelize(`postgres://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`,{
  logging: false,
});

    
db.sequelize = sequelize;

export {db, sequelize}