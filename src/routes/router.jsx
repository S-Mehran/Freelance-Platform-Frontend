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
import ProtectedRoute from "./ProtectedRoute";
import RoleBasedRoute from "./RoleBasedRoute";
import ClientLayout from "../components/ClientLayout";
import Logout from "../features/auth/Logout";
import ClientPosts from "../pages/AllClientPosts";
import FreelancerLayout from "../components/FreelancerLayout";
import { MyClientPosts } from "../pages/Client/ClientPosts";
import SinglePagePost from "../pages/SinglePagePost";
import SingleMyPostPage from "../pages/Client/PrivateSinglePage";
import EditPostForm from "../pages/Client/EditPostForm";
import ClientProfile from "../pages/Client/ClientProfile";

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
    {
    path: "/client",
    element: (
      <ProtectedRoute>
        <RoleBasedRoute allowedRole="client">
          <ClientLayout/>
        </RoleBasedRoute>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <ClientPosts/> },
      {path: RoutePath.CREATE_POST, element: <PostForm/>},
      {path: RoutePath.LOGOUT, element: <Logout/>},
      {path: RoutePath.GET_MY_POSTS, element: <MyClientPosts/>},
      {path: RoutePath.GET_POSTS, element: <ClientPosts/>},        
      {path:  `${RoutePath.SINGLE_POST}/:id`, element:<SinglePagePost/>},
      {path:  `${RoutePath.MY_POST}/:id`, element:<SingleMyPostPage/>},
      {path:  `${RoutePath.EDIT_POST}/:id`, element:<EditPostForm/>},
      {path: "profile", element: <ClientProfile/>},
      
  
      
    ]
  },
  {
    path: "/freelancer",
    element: (
      <ProtectedRoute>
        <RoleBasedRoute allowedRole="freelancer">
          <FreelancerLayout />
        </RoleBasedRoute>
      </ProtectedRoute>
    ),

    children: [
      { index: true, element: <ClientPosts/> },
      {path: RoutePath.CREATE_POST, element: <PostForm/>},
      {path: RoutePath.LOGOUT, element: <Logout/>},
      {path: RoutePath.GET_POSTS, element: <ClientPosts/>},
      
    ]

  },
]);

export default router;
