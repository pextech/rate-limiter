import { FindOptions, InferAttributes } from 'sequelize';
import { Plan } from '../database/models/associations/plan';
import { UserPlanSubscription } from '../database/models/associations/userSubscription';
import moment from 'moment';

export default class PlanService {
  public static async createPlan(plan: any): Promise<Plan> {
    const newPlan = await Plan.create(plan);
    return newPlan;
  }

  public static async updatePlan(
    id: number,
    data: Partial<InferAttributes<Plan, { omit: never }>>
  ): Promise<any> {
    return await Plan.update(data, {
      where: { id },
    });
  }

  public static async getAllPlans(
    options?: FindOptions<InferAttributes<Plan, { omit: never }>>
  ) {
    const allPlans = await Plan.findAll(options);
    return allPlans;
  }

  public static async getSinglePlan(PlanId: number): Promise<Plan | null> {
    const plan = await Plan.findByPk(PlanId);
    return plan;
  }

  public static async querySinglePlan(
    options: FindOptions<InferAttributes<Plan, { omit: never }>>
  ): Promise<Plan | null> {
    const queriedPlan = await Plan.findOne(options);
    return queriedPlan;
  }

  public static async querySubscriptionPlans(
    options: FindOptions<InferAttributes<UserPlanSubscription, { omit: never }>>
  ): Promise<UserPlanSubscription[]> {
    const querieSubscription = await UserPlanSubscription.findAll(options);
    return querieSubscription;
  }

  public static async querySingleSubscriptionPlan(
    options: FindOptions<InferAttributes<UserPlanSubscription, { omit: never }>>
  ): Promise<UserPlanSubscription | null> {
    const querieSubscription = await UserPlanSubscription.findOne(options);
    return querieSubscription;
  }

  public static async subscribeToPlan(planId: number, userId: number, recurringPayments: boolean) {

    const existingSubscription = await this.querySingleSubscriptionPlan({ where: { UserId: userId }, include: [{model: Plan}] });
    let subscription = existingSubscription
    const nextCharge = moment().add(30, 'days').toDate();
    const nextDue = moment().add(37, 'days').toDate();
    if (!existingSubscription) {
      const newSubscription = await UserPlanSubscription.create({ PlanId: planId,  UserId: userId, commissionPercentage: 10, nextCharge, nextDue, recurringPayments });
      subscription = newSubscription
    }
    else {
      await UserPlanSubscription.update({PlanId: planId}, {where: {id: existingSubscription.id}})
    }

    return subscription;
  }

  

  public static async deletePlan(
    options?: FindOptions<InferAttributes<Plan, { omit: never }>>
  ) {
    return await Plan.destroy(options);
  }
}
