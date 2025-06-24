// import {
//   Route,
//   Routes,
//   useNavigate,
//   useLocation,
//   Navigate,
// } from "react-router-dom";
// import { Suspense, lazy, useContext, useEffect, useState } from "react";

// import ProtectedRoute from "./ProtectedRoutes";

// import Loader from "@/components/others/Loader";
// import AuthContext from "@/context/AuthContext";
// import Maintenance from "@/screens/other/Maintenance";
// import WhatsappRoutes from "./WhatsappRoute";
// import { fetchAllowedRoutes } from "@/hooks/manager/useManager";
// import { allowedMerchantRouteOptions } from "@/utils/defaultData";
// import { useQuery } from "@tanstack/react-query";

// // Lazy load each route component
// const AuthRoutes = lazy(() => import("./AuthRoute"));
// const HomeRoutes = lazy(() => import("./HomeRoute"));
// const OrderRoutes = lazy(() => import("./OrderRoute"));
// const MerchantRoutes = lazy(() => import("./MerchantRoute"));
// const ProductRoutes = lazy(() => import("./ProductRoute"));
// const CustomerRoutes = lazy(() => import("./CustomerRoute"));
// const AgentRoutes = lazy(() => import("./AgentRoute"));
// const DeliveryRoutes = lazy(() => import("./DeliveryRoute"));
// const CommAndSubsRoutes = lazy(() => import("./CommAndSubsRoute"));
// const MarketingRoutes = lazy(() => import("./MarketingRoute"));
// const NotificationRoutes = lazy(() => import("./NotificationRoute"));
// const ConfigureRoutes = lazy(() => import("./ConfigureRoute"));
// const CustomizeRoutes = lazy(() => import("./CustomizeRoute"));
// const AccountRoutes = lazy(() => import("./AccountRoute"));

// const Routers = () => {
//   const { token, role } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [allowedRoutes, setAllowedRoutes] = useState([]);

//   useEffect(() => {
//     if (!token && !location.pathname.startsWith("/auth")) {
//       navigate("/auth/sign-in");
//     } else if (token && location.pathname.startsWith("/auth")) {
//       navigate("/home");
//     }

//     // navigate("/maintenance");
//   }, [token, location.pathname, navigate]);

//   const { data } = useQuery({
//     queryKey: ["allowed-routes"],
//     queryFn: () => fetchAllowedRoutes(navigate),
//     enabled: (token && role !== "Admin") || role !== "Merchant",
//   });

//   useEffect(() => {
//     if (role === "Merchant") {
//       setAllowedRoutes(allowedMerchantRouteOptions);
//     } else if (role !== "Admin" && role !== "Merchant" && data) {
//       console.log("Routes", data);
//       setAllowedRoutes(data);
//     }
//   }, [data]);

//   return (
//     <Suspense fallback={<Loader />}>
//       <Routes>
//         <Route path="/" element={<Navigate to="/home" replace />} />
//         <Route path="/auth/*" element={<AuthRoutes />} />
//         <Route path="/home/*" element={<HomeRoutes />} />

//         <Route path="/order/*" element={<OrderRoutes />} />

//         <Route
//           path="/merchant/*"
//           element={
//             <ProtectedRoute requiredRole="Admin">
//               <MerchantRoutes />
//             </ProtectedRoute>
//           }
//         />

//         <Route path="/product/*" element={<ProductRoutes />} />

//         <Route path="/customer/*" element={<CustomerRoutes />} />

//         <Route
//           path="/agent/*"
//           element={
//             <ProtectedRoute>
//               <AgentRoutes />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/delivery-management/*"
//           element={
//             <ProtectedRoute>
//               <DeliveryRoutes />
//             </ProtectedRoute>
//           }
//         />

//         <Route path="/comm-and-subs/*" element={<CommAndSubsRoutes />} />
//         <Route path="/chat/*" element={<WhatsappRoutes />} />
//         <Route path="/marketing/*" element={<MarketingRoutes />} />
//         <Route path="/notification/*" element={<NotificationRoutes />} />
//         <Route
//           path="/configure/*"
//           element={
//             <ProtectedRoute requiredRole="Admin">
//               <ConfigureRoutes />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/customize/*"
//           element={
//             <ProtectedRoute requiredRole="Admin">
//               <CustomizeRoutes />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="/account/*" element={<AccountRoutes />} />
//         <Route path="/maintenance" element={<Maintenance />} />
//         <Route path="*" element={<Navigate to="/home" replace />} />
//       </Routes>
//     </Suspense>
//   );
// };

// export default Routers;

import {
  Route,
  Routes,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Suspense, lazy, useContext, useEffect, useState } from "react";

import ProtectedRoute from "./ProtectedRoutes";

import Loader from "@/components/others/Loader";
import AuthContext from "@/context/AuthContext";
import Maintenance from "@/screens/other/Maintenance";
import WhatsappRoutes from "./WhatsappRoute";
import { fetchAllowedRoutes } from "@/hooks/manager/useManager";
import { allowedMerchantRouteOptions } from "@/utils/defaultData";
import { useQuery } from "@tanstack/react-query";

// Lazy load each route component
const AuthRoutes = lazy(() => import("./AuthRoute"));
const HomeRoutes = lazy(() => import("./HomeRoute"));
const OrderRoutes = lazy(() => import("./OrderRoute"));
const MerchantRoutes = lazy(() => import("./MerchantRoute"));
const ProductRoutes = lazy(() => import("./ProductRoute"));
const CustomerRoutes = lazy(() => import("./CustomerRoute"));
const AgentRoutes = lazy(() => import("./AgentRoute"));
const DeliveryRoutes = lazy(() => import("./DeliveryRoute"));
const CommAndSubsRoutes = lazy(() => import("./CommAndSubsRoute"));
const MarketingRoutes = lazy(() => import("./MarketingRoute"));
const NotificationRoutes = lazy(() => import("./NotificationRoute"));
const ConfigureRoutes = lazy(() => import("./ConfigureRoute"));
const CustomizeRoutes = lazy(() => import("./CustomizeRoute"));
const AccountRoutes = lazy(() => import("./AccountRoute"));

const Routers = () => {
  const { token, role } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [allowedRoutes, setAllowedRoutes] = useState([]);

  useEffect(() => {
    if (!token && !location.pathname.startsWith("/auth")) {
      // Redirect only if not already on an auth page
      navigate("/auth/sign-in", { replace: true });
    } else if (token && location.pathname.startsWith("/auth")) {
      // Redirect to home if logged in and on an auth page
      navigate("/home", { replace: true });
    }
  }, [token, location.pathname, navigate]);

  const { data } = useQuery({
    queryKey: ["allowed-routes"],
    queryFn: () => fetchAllowedRoutes(navigate),
    enabled: !!token && role !== "Admin" && role !== "Merchant",
  });

  useEffect(() => {
    if (role === "Merchant") {
      setAllowedRoutes(allowedMerchantRouteOptions);
    } else if (role !== "Admin" && role !== "Merchant" && data) {
      setAllowedRoutes(data);
    }
  }, [data, role]);

  const allRoutes = [
    { path: "/home/*", element: <HomeRoutes /> },
    { path: "/order/*", element: <OrderRoutes /> },
    { path: "/merchant/*", element: <MerchantRoutes /> },
    { path: "/product/*", element: <ProductRoutes /> },
    { path: "/customer/*", element: <CustomerRoutes /> },
    { path: "/agent/*", element: <AgentRoutes /> },
    { path: "/delivery-management/*", element: <DeliveryRoutes /> },
    { path: "/comm-and-subs/*", element: <CommAndSubsRoutes /> },
    { path: "/chat/*", element: <WhatsappRoutes /> },
    { path: "/marketing/*", element: <MarketingRoutes /> },
    { path: "/notification/*", element: <NotificationRoutes /> },
    { path: "/configure/*", element: <ConfigureRoutes /> },
    { path: "/customize/*", element: <CustomizeRoutes /> },
    { path: "/account/*", element: <AccountRoutes /> },
  ];

  // Filter routes based on allowedRoutes
  const filteredRoutes =
    role !== "Merchant"
      ? allRoutes
      : allRoutes.filter((route) => {
          const matches = allowedRoutes.some((allowed) =>
            route.path.startsWith(`/${allowed.value.split("/")[1]}`)
          );
          return matches;
        });

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/auth/*" element={<AuthRoutes />} />

        {filteredRoutes.map((route, index) =>
          route.protected ? (
            <Route
              key={index}
              path={route.path}
              element={
                <ProtectedRoute requiredRole="Admin">
                  {route.element}
                </ProtectedRoute>
              }
            />
          ) : (
            <Route key={index} path={route.path} element={route.element} />
          )
        )}

        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Suspense>
  );
};

export default Routers;
