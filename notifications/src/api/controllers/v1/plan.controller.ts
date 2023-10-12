import { Request, Response } from 'express';
import {
  BadRequestResponse,
  InternalErrorResponse,
  SuccessResponse,
} from '../../../core/ApiResponse';
import PlanService from '../../../services/plan.Service';
import PaginationService from '../../../../../middlewares/pagination';
import { Op } from 'sequelize';
import { ignoreKeys } from '../../../../../interface/pagination';
import { Plan } from '../../../database/models/associations/plan';
import { PLANS } from '../../../../../interface/plan';
import { scheduleCronJob } from '../../../../../middlewares/cronJob';
import schedule from "node-schedule";
import { daily_cron_schedule_syntax } from '../../../config';
import moment from 'moment';
import { User } from '../../../database/models/user';
import { client } from '../../middleware/v1/rate-limiter';


export const subscribeToPlan = async (req: Request, res: Response) => {
  try {
    const { planId } = req.params;
    const { userId, subscription } = res.locals

    const plan = await PlanService.getSinglePlan(+planId);
    if (!plan) {
      return new BadRequestResponse('Selected Subscription Plan does not exist').send(
        res
      );
    }
    let amountToPay = 0

    if (subscription) {
      if (plan.id === subscription.id) {
        return new BadRequestResponse('you are already subscribed to this plan').send(
          res
        );
      }

  

      if (plan.price > subscription.Plan.price) {
        amountToPay = plan.price - subscription.Plan.price
      }
      else {
        amountToPay = plan.price 
      }

      // communicate to payment service

    }

    const newSubscription = await PlanService.subscribeToPlan(plan.id, userId, plan.name !== PLANS.FREEMIUM)

    return new SuccessResponse('Subscribed to plan successfully', {newSubscription, amountPayed: amountToPay}).send(res);

  } catch (error) {
    return new InternalErrorResponse(`Something went wrong ${error}`).send(res);
  }
};

export const getAllPlans = async (req: Request, res: Response) => {
  try {

    const filterOption: any = await PaginationService.generateQueryOptions(
      Op,
      req.query,
      ignoreKeys
    );

    const plans = await PaginationService.paginateAggregate(
      Op,
      req.query,
      Plan,
      'createdAt',
      'DESC',
      { ...filterOption }
    );
    

    return new SuccessResponse('Subscription Plans retrieved successfully',plans).send(res);
  } catch (error) {
    return new InternalErrorResponse(`Something went wrong ${error}`).send(res);
  }
};


const clearUserMonthlyRequests = async (days: number) => {
  try {
    const day = days > 0 ? moment().add(days, 'days').startOf('day') : moment().startOf('day')
    const endOfDay = days > 0 ? day.clone().endOf('day') : moment().endOf('day');
    const endingSubsciptions: any = await PlanService.querySubscriptionPlans({
      where: {
        nextCharge: {
          [Op.between]: [day.toDate(), endOfDay.toDate()],
        },
      },
      include: [
        {
          model: User,
        },
        {
          model: Plan,
        },
      ],
    });

    await Promise.all(
      endingSubsciptions.map((each: any) => {
        client.del(`${each.UserId}-months`)
      })
    )

  } catch (error) {
    return new InternalErrorResponse(
      `Error occurred! ${error}`
    )
  }
}

const monthlyCleanUp = async () => {
  await clearUserMonthlyRequests(30)
}

scheduleCronJob(schedule, daily_cron_schedule_syntax, monthlyCleanUp);

