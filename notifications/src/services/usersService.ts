import {
  FindOptions,
  InferAttributes,
  InferCreationAttributes,
  Op,
} from 'sequelize';
import { User } from '../database/models/user';

import { twilio_account_sid, twilio_auth_token, twilio_phone_number } from '../config';
import twilio from 'twilio';


class UserService {
  public static async getAll() {
    const allUsers = await User.findAll();
    return allUsers;
  }

  public static async queryUsers(
    options: FindOptions<InferAttributes<User, { omit: never }>>
  ) {
    const allUsers = await User.findAll(options);
    return allUsers;
  }


  public static async getSingleUser(
    UserId: number,
    options?: FindOptions<InferAttributes<User, { omit: never }>>
  ): Promise<User | null> {
    const user = await User.findByPk(UserId, options);
    return user;
  }

  public static async querySingleUser(
    options: FindOptions<InferAttributes<User, { omit: never }>>
  ): Promise<User | null> {
    const user = await User.findOne(options);
    return user;
  }

  public static async addUser(user: any): Promise<User> {
    const newUser = await User.create(user);
    return newUser;
  }

  public static async updateUser(
    id: number,
    options: Partial<InferCreationAttributes<User, { omit: never }>>
  ): Promise<any> {
    return await User.update(options, {
      where: { id },
    });
  }

  public static async deleteUser(id: number): Promise<any> {
    return await User.destroy({
      where: {
        id,
      },
    });
  }

  public static sendSmsToUser(phoneNumber: string, message: string) {
    const accountSid = twilio_account_sid;
    const authToken = twilio_auth_token;
    const client = twilio(accountSid, authToken);

    const userPhoneNumber = phoneNumber;
    const twilioPhoneNumber = twilio_phone_number;

    client.messages
      .create({
        body: message,
        from: twilioPhoneNumber,
        to: userPhoneNumber,
      })
      .then((message) => {
        console.log('Notification sent: ' + message.sid);
      })
      .catch((error) => {
        console.error('Error sending sms', error.message);
      });
  }


}

export default UserService;
