import app, { port } from './index';
import Logger from './core/Logger';

const { db } = require('./database/models/index');

import { defaultPlans } from '../../interface/plan';
import { Plan } from './database/models/associations/plan';
import { client } from './api/middleware/v1/rate-limiter';

const startServer = async () => {

  async function planRegistration() {
    await Promise.all(
      defaultPlans.map(async(each: any) => {
        const plan = await Plan.findOne({ where: { name: each.name } })
        if (!plan) {
          await Plan.create(each)
        }
      })
    )
    
  }
  
  async function initial() {
    try {

      await planRegistration()
      
      } catch (e) {
        console.log('error initializing data' , e);
    }
  }
  
  
app
  .listen(port, () => {

    console.log('App listening on port ' + port);
    db.sequelize
      .authenticate()
      .then(async () => {
        console.log('database connected');
        try {
          await db.sequelize.sync();
          initial()
        } catch (error: any) {
          console.log('err' , error);
        }
      })
      .catch((e: any) => {
        console.log('db eror', e.message);
        process.exit()
      });
      client.connect().then(() => {
      console.log('redis is connected');
    })
  })
  .on('error', (e: any) => Logger.error(e))

}

startServer();