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
import ProposalForm from "../pages/Freelancer/ProposalForm";
import SinglePagePostFreelancer from "../pages/Freelancer/SinglePagePost";
import ClientPostsFreelancer from "../pages/Freelancer/AllClientPosts";
import { MyFreelancerProposals } from "../pages/Freelancer/AllFreelancerProposals";
import { PostProposals } from "../pages/Client/PostProposals";
import { ProposalDetailClient } from "../pages/Client/SingleProposalPage";
import { ProposalDetailFreelancer } from "../pages/Freelancer/SingleProposalPage";
import { CreateContractForm } from "../pages/Client/ContractForm";
import { ClientContracts } from "../pages/Client/ContractPage";
import { FreelancerContracts } from "../pages/Freelancer/ContractPage";
import { ClientContractDetail } from "../pages/Client/ContractDetailPage";
import { FreelancerContractDetail } from "../pages/Freelancer/ContractDetailPage";

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
      {path:  `${RoutePath.GET_PROPOSALS_BY_POST}/:id`, element:<PostProposals/>},
      {path:  `${RoutePath.MY_POST}/:id`, element:<SingleMyPostPage/>},
      {path:  `${RoutePath.EDIT_POST}/:id`, element:<EditPostForm/>},
      {path:  `${RoutePath.GET_PROPOSALS_BY_POST}/:id`, element:<PostProposals/>},
      {path: `${RoutePath.SINGE_PROPOSAL}/:id`, element: <ProposalDetailClient/>},
      {path: `${RoutePath.CREATE_CONTRACT}`, element: <CreateContractForm/>},
      {path: "profile", element: <ClientProfile/>},
      {path: `${RoutePath.GET_MY_CONTRACTS}`, element: <ClientContracts/> },
      {path: `${RoutePath.CONTRACT}/:id`, element: <ClientContractDetail/>}
  
      
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
      {path: RoutePath.LOGOUT, element: <Logout/>},
      {path: RoutePath.GET_POSTS, element: <ClientPostsFreelancer/>},
      {path: `${RoutePath.SINGLE_POST}/:id`, element: <SinglePagePostFreelancer/>},
      {path: RoutePath.SEND_PROPOSAL, element: <ProposalForm/>},
      {path: RoutePath.GET_MY_PROPOSALS, element: <MyFreelancerProposals/>},
      {path: `${RoutePath.MY_PROPOSAL}/:id`, element: <ProposalDetailFreelancer/>},
      {path: RoutePath.GET_MY_CONTRACTS, element: <FreelancerContracts/>},
      {path: `${RoutePath.CONTRACT}/:id`, element: <FreelancerContractDetail/>}
    ]

  },
]);

export default router;
