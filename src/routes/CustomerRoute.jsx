import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";

import Loader from "../components/others/Loader";

const AllCustomer = lazy(
  () => import("../screens/general/customer/AllCustomer")
);
const CustomerDetail = lazy(
  () => import("../screens/general/customer/CustomerDetail")
);

const CustomerRoutes = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      <Route path="" element={<AllCustomer />} />
      <Route path=":customerId" element={<CustomerDetail />} />
    </Routes>
  </Suspense>
);

export default CustomerRoutes;
