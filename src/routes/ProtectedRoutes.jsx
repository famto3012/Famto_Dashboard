import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import AuthContext from "../context/AuthContext";
import { fetchAllowedRoutes } from "@/hooks/manager/useManager";
import { allowedMerchantRouteOptions } from "@/utils/defaultData";

const ProtectedRoute = ({ children, route }) => {
  const [allowedRoutes, setAllowedRoutes] = useState([]);
  const [canAccess, setCanAccess] = useState(false);

  const { token, role } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch allowed routes only for non-admin and non-merchant roles
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

  useEffect(() => {
    if (role !== "Merchant") {
      // Admin can access everything
      setCanAccess(true);
    } else if (role === "Merchant") {
      // Check if the route matches any allowed merchant routes
      const matches = allowedMerchantRouteOptions.some((allowed) =>
        route.startsWith(allowed.value)
      );
      setCanAccess(matches);
    } else if (role !== "Admin" && role !== "Merchant") {
      const matches = allowedRoutes.some((allowed) => route === allowed.route);
      setCanAccess(matches);
    }
  }, [route, allowedRoutes, role]);

  if (!canAccess) return <Navigate to="/home" />;

  return children;
};

export default ProtectedRoute;
