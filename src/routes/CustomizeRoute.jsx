import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Loader from "../components/others/Loader";

const CustomerApp = lazy(
  () => import("../screens/appCustomization/customerApp/CustomerApp")
);
const AgentApp = lazy(
  () => import("../screens/appCustomization/agentApp/AgentApp")
);
const MerchantApp = lazy(
  () => import("../screens/appCustomization/merchantApp/MerchantApp")
);

const CustomizeRoutes = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      <Route path="customer-app" element={<CustomerApp />} />
      <Route path="agent-app" element={<AgentApp />} />
      <Route path="merchant-app" element={<MerchantApp />} />
    </Routes>
  </Suspense>
);

export default CustomizeRoutes;
