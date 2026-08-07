import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Loader from "../components/others/Loader";

const MerchantReviews = lazy(
  () => import("../screens/general/review/MerchantReviews")
);

const ReviewRoutes = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      <Route path="" element={<MerchantReviews />} />
    </Routes>
  </Suspense>
);

export default ReviewRoutes;
