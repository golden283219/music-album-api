import { Get, Route, Tags, Post, Put, Delete, Body, Path, Security, Header, Query } from "tsoa";
import { User } from "../models";
import {
  getUsers,
  createUser,
  IUserPayload,
  UserInfoPayload,
  getUser,
  updateUser,
  deleteUser,
  getUserInfo,
} from "../repositories/user.repository";

import secretConfig from "../config/secret";
import { JwtPayload, verify } from "jsonwebtoken";

@Route("/api/v1/users")
@Tags("User")
export default class UserController {
  @Security('jwt')
  @Get("/user-info")
  public async getUserInfo(@Query() token: string): Promise<UserInfoPayload | null> {
    const jwt_encryption = secretConfig.jwt_encryption;
    let email: string = '';
    verify(token, jwt_encryption, (err, user: JwtPayload) => {
      if (err)
        return null;

        email = user.email;
    });
    const user = await getUserInfo(email);
    const name = user.firstName;
    const expirationDate = user.subscribers?Date.parse(user.subscribers[0].time_limit.toString()):0;
    const downloadLimit = user.subscribers?user.subscribers[0].download_limit:0;
    const downloadedData = user.subscribers?user.subscribers[0].downloaded_data:0;
    const specialDownloadLimit = user.subscribers?user.subscribers[0].special_download_limit:0;
    const specialDownloadedData = user.subscribers?user.subscribers[0].special_downloaded_data:0;
    const admin = user.admin;

    return { name: name, email: email, expirationDate: expirationDate, downloadLimit:downloadLimit, downloadedData:downloadedData, specialDownloadLimit:specialDownloadLimit, specialDownloadedData: specialDownloadedData, admin: admin };
  }

  @Security('jwt')
  @Get()
  public async getUsers(): Promise<Array<User>> {
    return getUsers();
  }

  @Security('jwt')
  @Post("/")
  public async createUser(@Body() body: IUserPayload): Promise<User> {
    return createUser(body);
  }
  
  @Security('jwt')
  @Get("/:id")
  public async getUser(@Path() id: string): Promise<User | null> {
    return getUser(Number(id));
  }

  @Security('jwt')
  @Put("/:id")
  public async updateUser(@Path() id: string, @Body() body: IUserPayload): Promise<User | null> {
    return updateUser(Number(id), body);
  }

  @Security('jwt')
  @Delete("/:id")
  public async deleteUser(@Path() id: string): Promise<User | null> {
    return deleteUser(Number(id));
  }
}