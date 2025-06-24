import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Loader from "../components/others/Loader";

const AllMerchant = lazy(
  () => import("../screens/general/merchant/AllMerchant")
);
const MerchantPayout = lazy(
  () => import("../screens/general/merchant/MerchantPayout")
);
const MerchantPayoutDetail = lazy(
  () => import("../screens/general/merchant/MerchantPayoutDetail")
);
const MerchantDetail = lazy(
  () => import("../screens/general/merchant/MerchantDetail")
);

const MerchantRoutes = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      <Route path="" element={<AllMerchant />} />
      <Route path="payout" element={<MerchantPayout />} />
      <Route path="payout-detail" element={<MerchantPayoutDetail />} />
      <Route path=":merchantId" element={<MerchantDetail />} />
    </Routes>
  </Suspense>
);

export default MerchantRoutes;
