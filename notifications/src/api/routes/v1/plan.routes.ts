import { Router } from 'express';
import { getAllPlans, subscribeToPlan } from '../../controllers/v1/plan.controller';

const planRouter = Router();

planRouter.get('/all', getAllPlans);
planRouter.post('/subscribe/:planId', subscribeToPlan);

export default planRouter;
