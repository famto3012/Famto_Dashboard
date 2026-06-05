import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Loader from "../components/others/Loader";
import WhatsappDashboard from "@/screens/whatsapp/WhatsappDashboard";
const Whatsapp = lazy(() => import("@/screens/general/whatsapp/Whatsapp"));

const WhatsappRoutes = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      <Route path="" element={<WhatsappDashboard />} />
    </Routes>
  </Suspense>
);

export default WhatsappRoutes;
