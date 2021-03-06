import { sign } from "jsonwebtoken";
import { hashSync, compare } from "bcryptjs";
import secretConfig from "../config/secret";
import { Route, Tags, Post, Body } from "tsoa";
import { User } from "../models";
import {
  IAuthPayload,
  OAuthPayload,
  SignInPayload,
  signUpUser,
  signInUser,
} from "../repositories/auth.repository";

@Route("/api/v1/auth")
@Tags("Auth")
export default class UserController {
  @Post("/signup")
  public async signUpUser(@Body() body: IAuthPayload): Promise<User> {
    const payload = {
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      email: body.email.trim(),
      password: hashSync(String(body.password), secretConfig.bcrypt_saltRounds),
    }
    return signUpUser(payload);
  }

  @Post("/signin")
  public async signInUser(@Body() body: SignInPayload): Promise<OAuthPayload | null> {
    const user = await signInUser(body);
    if (!user) return null;
    const isMatch: Boolean = await compare(String(body.password), String(user.password)).then((res) => res);
    if (isMatch) {
      const jwt_encryption = secretConfig.jwt_encryption;
      const jwt_expiration = secretConfig.jwt_expiration;
      const token = sign({ email: user.email, firstName: user.firstName, lastName: user.lastName, admin: user.admin }, jwt_encryption, {expiresIn: jwt_expiration});
      //return { email: user.email, token: token };
      return { status: 'success', result_code: 0, message: 'Logged in successfully', token: token };
    } else {
      return { status: 'error', result_code: 1, message: 'Username or Password Wrong' };
    }
  }
}