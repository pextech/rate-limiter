import { Router } from 'express';
import {
  getAllNotifications, sendNotification
} from '../../controllers/v1/notification.controller';
import { checkValidNotificationsInput } from '../../validators/v1/validateNotifications';
import { minutesRateLimiter, monthsRateLimiter } from '../../middleware/v1/rate-limiter';

const notificationRouter = Router();

notificationRouter.get('/all', getAllNotifications);
notificationRouter.post('/send', [ minutesRateLimiter, monthsRateLimiter], checkValidNotificationsInput, sendNotification);


export default notificationRouter;
