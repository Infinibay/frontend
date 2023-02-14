import React from "react";
import { Redirect } from "react-router-dom";

import Login1 from "../pages/AuthenticationInner/Login";
import Register1 from "../pages/AuthenticationInner/Register";
import ForgetPwd1 from "../pages/AuthenticationInner/ForgetPassword";
import ConfirmMail from "../pages/AuthenticationInner/page-confirm-mail";
import EmailVerification from "../pages/AuthenticationInner/auth-email-verification";
import ResetPassword from "pages/AuthenticationInner/ResetPassword";
import CreateVm from "pages/CreateVm/CreateVm";
import VmList from "pages/VMList/VmList";
import CreateUser from "pages/User/CreateUser";
import UserList from "pages/User/UserList";
import VmDetails from "pages/VMDetails/VmDetails";
import IsoFileList from "pages/Iso-File/IsoFlleList";
import UpdateVm from "pages/UpdateVm/UpdateVm";
import VmDashboard from "pages/VmDashboard/VmDashboard";
import UpdateUserProfile from "pages/UserProfile/UpdateUserProfile";
import UserProfile from "pages/UserProfile/UserProfile";
import AllVmList from "pages/VMList/AllVmList";


const authProtectedRoutes = [

  {path: "/createvm", component: CreateVm },
  {path: "/vmlist", component: VmList },
  {path: "/user-list", component: UserList },
  {path: "/create-user", component: CreateUser },
  {path: "/vmdetails/:vmId", component: VmDetails },
  {path: "/isofilelist", component: IsoFileList},
  {path: "/update-vm/:vmId", component: UpdateVm},
  {path: "/dashboard", component: VmDashboard},
  {path: "/updateprofile/:userId/:usertoken", component: UpdateUserProfile},
  {path: "/userprofile", component: UserProfile},
  {path: "/allvms", component: AllVmList},



  { path: "/", exact: true, component: () => <Redirect to="/login" /> },
];

const publicRoutes = [

  { path: "/login", component: Login1 },
  { path: "/register", component: Register1 },
  { path: "/forgot-pwd", component: ForgetPwd1 },
  { path: "/forgetpassword", component: ResetPassword },
  { path: "/page-confirm-mail", component: ConfirmMail },
  { path: "/auth-email-verification", component: EmailVerification },
];

export { authProtectedRoutes, publicRoutes };
