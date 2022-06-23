import { getRepository } from "typeorm";
import { Subscriber, User } from "../models";

export interface IUserPayload {
  firstName: String;
  lastName: String;
  email: String;
  password: String;
}

export interface UserInfoPayload {
  name: String;
  email: String;
  expirationDate: number;
  downloadLimit: number;
  downloadedData: number;
  specialDownloadLimit: number;
  specialDownloadedData: number;
  admin: number;
}

export interface IResponse {
  message: String;
}

export const getUserInfo = async (email: string): Promise<User | null> => {
  const userRepository = getRepository(User);
  // const user = await userRepository.findOne({ email: email });
  const user = await userRepository.findOne({
    where: { email: email },
    relations: ['subscribers'],
    // order: {subscribers: 'DESC'}
  });
  if (!user) return null;
  return user;
};

export const getUsers = async (): Promise<Array<User>> => {
  const userRepository = getRepository(User);
  return userRepository.find();
};

export const createUser = async (payload: IUserPayload): Promise<User> => {
  const userRepository = getRepository(User);
  const user = new User();
  return userRepository.save({
    ...user,
    ...payload,
  });
};

export const getUser = async (id: number): Promise<User | null> => {
  const userRepository = getRepository(User);
  const user = await userRepository.findOne({ id: id });
  if (!user) return null;
  return user;
};

export const updateUser = async (id: number, payload: IUserPayload): Promise<User | null> => {
  const userRepository = getRepository(User);
  const user = await userRepository.findOne({ id: id });
  if (!user) return null;
  user.firstName = payload.firstName;
  user.lastName = payload.lastName;
  await userRepository.update(
    { id: id },
    user,
  )
  if (!user) return null;
  return user;
};

export const deleteUser = async (id: number): Promise<User | null> => {
  const userRepository = getRepository(User);
  const user = await userRepository.findOne({ id: id });
  if (!user) return null;
  await userRepository.delete({ id: id });
  return user;
};