export const RoutePath = {
  HOME: "/",
  AUTH: "auth",
  LOGIN: "login",
  REGISTER: "register",
  OTP: "otp",
  ENTER_EMAIL: "enter_email",
  RESET_PASSWORD: "reset_password",
  CREATE_POST: "create_post",
  CLIENT_HOME: "client_home",
} as const;

export type RoutePath = (typeof RoutePath)[keyof typeof RoutePath];
