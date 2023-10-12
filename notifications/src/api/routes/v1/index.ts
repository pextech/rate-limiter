import { Router } from 'express';

import notificationRouter from './notification.routes';
import planRouter from './plan.routes';

const router = Router();

router.use('/notification', notificationRouter);
router.use('/plan', planRouter);


export default router;
