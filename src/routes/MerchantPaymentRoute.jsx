import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Loader from "../components/others/Loader";

const MerchantPaymentSettings = lazy(
  () => import("../screens/general/merchant/MerchantPaymentSettings")
);

const MerchantPaymentRoutes = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      <Route path="" element={<MerchantPaymentSettings />} />
    </Routes>
  </Suspense>
);

export default MerchantPaymentRoutes;
