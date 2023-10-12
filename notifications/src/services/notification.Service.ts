import { Notification } from '../database/models/notification';

export default class NotificationService {
  public static async createNotification(
    notification: any
  ): Promise<Notification> {
    const newNotification = await Notification.create(notification);
    return newNotification;
  }

  public static async viewAllNotification(
    UserId: number
  ): Promise<Notification[]> {
    const allNotifications = await Notification.findAll({
      where: { UserId },
    });
    return allNotifications;
  }

  public static async getSingleNotification(id: number): Promise<Notification | null> {
    const notification = await Notification.findByPk(id);
    return notification;
  }

}
