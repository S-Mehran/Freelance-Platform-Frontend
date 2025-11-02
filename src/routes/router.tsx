import { createBrowserRouter} from "react-router";

import { AuthPage, App } from "@pages/index";

import LoginForm from "@features/auth/LoginForm";
import SignupForm from "@features/auth/SignupForm";
import { RoutePath } from "./routes";
import OtpForm from "@/features/auth/OtpScreen";
import EnterEmailForm from "@/features/auth/EnterEmailForm";
import ResetPasswordForm from "@/features/auth/ResetPasswordForm";
import PostForm from "@/features/auth/PostForm";
import ClientHome from "@/features/auth/ClientHomeScreen";

const router = createBrowserRouter([
  {
    path: RoutePath.HOME,
    Component: App,
  },
  {
    path: RoutePath.AUTH,
    Component: AuthPage,
    children: [
      { index: true, Component: LoginForm },
      { path: RoutePath.LOGIN, Component: LoginForm },
      { path: RoutePath.REGISTER, Component: SignupForm },
      {path: RoutePath.OTP, Component: OtpForm},
      {path: RoutePath.ENTER_EMAIL, Component: EnterEmailForm},
      {path: RoutePath.RESET_PASSWORD, Component: ResetPasswordForm},
      {path: RoutePath.CREATE_POST, Component: PostForm},
      {path: RoutePath.CLIENT_HOME, Component: ClientHome},
      
    ],
  },
]);

export default router;
