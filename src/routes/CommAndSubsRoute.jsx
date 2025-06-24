import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Loader from "../components/others/Loader";

const CommissionAndSubscription = lazy(
  () => import("../screens/general/commAndSubs/CommissionAndSubscription")
);
const CommissionLog = lazy(
  () => import("../screens/general/commAndSubs/CommissionLog")
);
const SubscriptionLog = lazy(
  () => import("../screens/general/commAndSubs/SubscriptionLog")
);

const CommAndSubsRoutes = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      <Route path="" element={<CommissionAndSubscription />} />
      <Route path="commission-log" element={<CommissionLog />} />
      <Route path="subscription-log" element={<SubscriptionLog />} />
    </Routes>
  </Suspense>
);

export default CommAndSubsRoutes;
