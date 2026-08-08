import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Loader from "../components/others/Loader";

const MerchantAnalytics = lazy(
  () => import("../screens/general/analytics/MerchantAnalytics")
);

const AnalyticsRoutes = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      <Route path="" element={<MerchantAnalytics />} />
    </Routes>
  </Suspense>
);

export default AnalyticsRoutes;
