import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Loader from "../components/others/Loader";

const AllManager = lazy(
  () => import("../screens/configure/managers/AllManager")
);
const Pricing = lazy(() => import("../screens/configure/pricing/Pricing"));
const Tax = lazy(() => import("../screens/configure/tax/Tax"));
const AllGeofence = lazy(
  () => import("../screens/configure/geofence/AllGeofence")
);
const AddGeofence = lazy(
  () => import("../screens/configure/geofence/AddGeofence")
);
const EditGeofence = lazy(
  () => import("../screens/configure/geofence/EditGeofence")
);

const ConfigureRoutes = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      <Route path="managers" element={<AllManager />} />
      <Route path="pricing" element={<Pricing />} />
      <Route path="tax" element={<Tax />} />
      <Route path="geofence" element={<AllGeofence />} />
      <Route path="geofence/add" element={<AddGeofence />} />
      <Route path="geofence/:geofenceId" element={<EditGeofence />} />
    </Routes>
  </Suspense>
);

export default ConfigureRoutes;
