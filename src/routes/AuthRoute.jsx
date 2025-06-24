import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Loader from "@/components/others/Loader";

const SignUp = lazy(() => import("@/screens/auth/SignUp"));
const SignIn = lazy(() => import("@/screens/auth/SignIn"));
const Verify = lazy(() => import("@/screens/auth/Verify"));
const Success = lazy(() => import("@/screens/auth/Success"));
const ForgotPassword = lazy(() => import("@/screens/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("@/screens/auth/ResetPassword"));

const AuthRoutes = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      <Route path="sign-up" element={<SignUp />} />
      <Route path="sign-in" element={<SignIn />} />
      <Route path="verify" element={<Verify />} />
      <Route path="success" element={<Success />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />
    </Routes>
  </Suspense>
);

export default AuthRoutes;
