import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Loader from "../components/others/Loader";

const MerchantQrCode = lazy(
  () => import("../screens/general/qr/MerchantQrCode")
);

const QrRoutes = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      <Route path="" element={<MerchantQrCode />} />
    </Routes>
  </Suspense>
);

export default QrRoutes;
