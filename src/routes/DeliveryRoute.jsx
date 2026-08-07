import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Loader from "../components/others/Loader";

const DeliveryManagement = lazy(
  () => import("../screens/general/deliveryManagement/DeliveryManagement")
);
const MerchantDelivery = lazy(
  () => import("../screens/general/deliveryManagement/MerchantDelivery")
);

const DeliveryRoutes = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      <Route path="" element={<DeliveryManagement />} />
      <Route path="merchant" element={<MerchantDelivery />} />
    </Routes>
  </Suspense>
);

export default DeliveryRoutes;
