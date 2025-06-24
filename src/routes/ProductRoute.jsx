import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Loader from "../components/others/Loader";

const Product = lazy(() => import("../screens/general/product/Product"));

const ProductRoutes = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      <Route path="" element={<Product />} />
    </Routes>
  </Suspense>
);

export default ProductRoutes;
