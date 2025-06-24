import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Loader from "../components/others/Loader";

const AllOrders = lazy(() => import("../screens/general/order/AllOrders"));
const OrderDetail = lazy(() => import("../screens/general/order/OrderDetail"));
const CreateOrder = lazy(() => import("../screens/general/order/CreateOrder"));

const OrderRoutes = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      <Route path="" element={<AllOrders />} />
      <Route path="create" element={<CreateOrder />} />
      <Route path=":orderId/:deliveryMode" element={<OrderDetail />} />
    </Routes>
  </Suspense>
);

export default OrderRoutes;
