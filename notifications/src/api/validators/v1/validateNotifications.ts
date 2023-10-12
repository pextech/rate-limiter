import { NextFunction, Request, Response } from 'express';
import { BadRequestResponse } from '../../../core/ApiResponse';
import Joi from 'joi';
import { NOTIFICATION_TYPE } from '../../../../../interface/notifications';


const sendNotification = Joi.object({
  type: Joi.string().required().valid(NOTIFICATION_TYPE.SMS, NOTIFICATION_TYPE.EMAIL),
  email: Joi.string().required(),
  message: Joi.string().required(),
  title: Joi.string().required(),
});

export const checkValidNotificationsInput = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    try {
    req.body = await sendNotification.validateAsync(req.body);
    next();
  } catch (error: any) {
    return new BadRequestResponse(`Failed! ${error.message}`).send(res);
  }
};