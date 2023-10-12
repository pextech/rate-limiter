import { Request, Response } from 'express';
import {
  InternalErrorResponse,
  SuccessResponse,
} from '../../../core/ApiResponse';
import NotificationService from '../../../services/notification.Service';
import {
  NOTIFICATION_TYPE,
} from '../../../../../interface/notifications';
import PaginationService from '../../../../../middlewares/pagination';
import { ignoreKeys } from '../../../../../interface/pagination';
import { Op } from 'sequelize';
import { Notification } from '../../../database/models/notification';
import { emailService } from '../../../services/EmailService';
import { emailTemplate } from '../../../helpers/EmailTemplates/emailTemplate';


export const sendNotification = async (req: Request, res: Response) => {
  try {
    const { userId } = res.locals
    const { type, title, message, email, phoneNumber } = req.body

    const newNotification = await NotificationService.createNotification({ type, title, message, email, UserId: userId })

    if (type === NOTIFICATION_TYPE.EMAIL) {
      await emailService(
      `${email}`,
      title,
      emailTemplate(email, message),
    );
    }
    else {
      // paused for now
      // UserService.sendSmsToUser(phoneNumber, message);
    }

    return new SuccessResponse(
       `${type} sent successfully`,
      newNotification
    ).send(res);
  } catch (error) {
    return new InternalErrorResponse(
      `Notifications could not be retrieved \n ${error}`
    ).send(res);
  }
};

export const getAllNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = res.locals

    const filterOption: any = await PaginationService.generateQueryOptions(
      Op,
      req.query,
      ignoreKeys
    );

    const notifications = await PaginationService.paginateAggregate(
      Op,
      req.query,
      Notification,
      'createdAt',
      'DESC',
      { ...filterOption, where: { UserId: userId } }
    );

    return new SuccessResponse(
      'Notifications retrieved successfully',
      notifications
    ).send(res);
  } catch (error) {
    return new InternalErrorResponse(
      `Notifications could not be retrieved \n ${error}`
    ).send(res);
  }
};