import moment, { DurationInputArg2} from 'moment';
import { NextFunction, Request, Response } from 'express';
import { User } from '../../../database/models/user';
import PlanService from '../../../services/plan.Service';
import { PLANS, overallRateLimit } from '../../../../../interface/plan';
import { BadRequestResponse, InternalErrorResponse, ThrottlingErrorResponse } from '../../../core/ApiResponse';
import rateLimit from 'express-rate-limit'
import { createClient } from 'redis';
import { redis_host, redis_password, redis_port } from '../../../config';

interface requestLog {
    time: number;
    frequency: number;
}

export const checkuserIp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
    const { ip } = req

    if (ip) {

    const userFind = await User.findOrCreate({
        where: { ipAddress: ip },
    });

    const freePlan = await PlanService.querySinglePlan({ where: { name: PLANS.FREEMIUM } });

    if (!freePlan) {
        return new BadRequestResponse('freePlan not found').send(
            res
        );
    }

    const subscription = await PlanService.subscribeToPlan(freePlan.id, userFind[0].id, freePlan.name !== PLANS.FREEMIUM)
        
     const newVariables = {
        ...res.locals,
         userId: userFind[0].id,
         subscription
      }
      
      res.locals = newVariables as any

    next()
        
    }
    } catch (error) {
        return new InternalErrorResponse(`can not check ip address \n ${error}`).send(res)
    }  
}

  export const client = createClient({
    password: redis_password,
    socket: {
      host: redis_host,
      port: redis_port,
    },
  });
  
  client.on('error', (err) => {
    console.log('Redis Client Error', err);
  });



export const overalMonthlylLimiter = rateLimit({
	windowMs: 30 * 24 * 60 * 60 * 1000,
	limit: overallRateLimit,
	standardHeaders: 'draft-7', 
	legacyHeaders: false,
})
  
const generalLimiter = async (userId: string, next: NextFunction, limit: number, time: DurationInputArg2, res: Response) => {
    const requests = await client.get(`${userId}-${time}`);
    
    if (requests !== null) {
      const userHistory: { time: number; frequency: number }[] = JSON.parse(requests);
      const windowTime = moment()
        .subtract(1, time)
        .unix();
        
      const windowFrequency = userHistory.filter((entry) => {
        return entry.time > windowTime;
      });

      const sumOfRequestsInWindow = windowFrequency.reduce((accumulator, entry) => {
        return accumulator + entry.frequency;
      }, 0);

      if (sumOfRequestsInWindow >= limit) {
        return new ThrottlingErrorResponse(`You have exceeded the ${limit} requests in 1 ${time} limit!`).send(res);
      } else {
        const lastRecord = userHistory[userHistory.length - 1];
        const nextEntry = moment()
          .subtract(1, time)
          .unix();

        if (lastRecord.time > nextEntry) {
          lastRecord.frequency++;
          userHistory[userHistory.length - 1] = lastRecord;
        } else {
          userHistory.push({
            time: moment().unix(),
            frequency: 1,
          });
        }

        await client.set(`${userId}-${time}`, JSON.stringify(userHistory));
        next();
      }
    } else {
        const newRecord = [
            {
              time: moment().unix(),
              frequency: 1,
            },
          ];
          await client.set(`${userId}-${time}`, JSON.stringify(newRecord));
          next();
    } 
  }

  export const minutesRateLimiter = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
     
        const { userId, subscription } = res.locals

        return generalLimiter(userId.toString(), next, subscription.Plan.requestPerMinute, 'minutes', res)
  
    } catch (error) {
      next(error);
    }
  };

  export const monthsRateLimiter = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
     
        const { userId, subscription } = res.locals

        return generalLimiter(userId.toString(), next, subscription.Plan.monthlyRequests, 'months', res)
 
    } catch (error) {
      next(error);
    }
  };