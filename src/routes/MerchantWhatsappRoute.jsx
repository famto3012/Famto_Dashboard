import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Loader from "../components/others/Loader";

const MerchantWhatsapp = lazy(
  () => import("../screens/general/whatsapp/MerchantWhatsapp")
);

const MerchantWhatsappRoutes = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      <Route path="" element={<MerchantWhatsapp />} />
    </Routes>
  </Suspense>
);

export default MerchantWhatsappRoutes;
