import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import RenderIcon from "@/icons/RenderIcon";

import AuthContext from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { fetchAllowedRoutes } from "@/hooks/manager/useManager";
import {
  allowedMerchantRouteOptions,
  smallSideBarMenuItems,
} from "@/utils/defaultData";

const SmallSideBar = () => {
  const [selectedLink, setSelectedLink] = useState("");
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [allowedRoutes, setAllowedRoutes] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [groupedMenuItems, setGroupedMenuItems] = useState([]);

  const { token, role } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedLink(location.pathname);
  }, [location.pathname]);

  const { data } = useQuery({
    queryKey: ["allowed-routes"],
    queryFn: () => fetchAllowedRoutes(navigate),
    enabled: !!token && role !== "Admin" && role !== "Merchant",
  });

  useEffect(() => {
    if (role === "Merchant") {
      setAllowedRoutes(allowedMerchantRouteOptions);
    } else if (role !== "Admin" && role !== "Merchant" && data) {
      console.log(data);
      setAllowedRoutes(data);
    }
  }, [data, role]);

  useEffect(() => {
    const grouped = menuItems.reduce((acc, item) => {
      if (item.dropDown) {
        if (!acc[item.dropLabel]) acc[item.dropLabel] = [];
        acc[item.dropLabel].push(item);
      } else {
        if (!acc["general"]) acc["general"] = [];
        acc["general"].push(item);
      }
      return acc;
    }, {});
    setGroupedMenuItems(grouped); // Update state with grouped menu items
  }, [menuItems]);

  useEffect(() => {
    // Update menuItems based on allowedRoutes and current user's role
    const updatedMenuItems = smallSideBarMenuItems.map((item) => {
      // Check if the route is in allowedRoutes
      if (allowedRoutes.some((route) => route.value === item.to)) {
        // Add the current user's role if it's not already in the roles array
        if (!item.roles.includes(role)) {
          return { ...item, roles: [...item.roles, role] };
        }
      }
      return item;
    });

    setMenuItems(updatedMenuItems);
  }, [role, allowedRoutes]);

  return (
    <div className="fixed w-[4rem] h-full bg-gradient-to-b from-[#016B6C] to-[#000] bg-[length:100%_150%] bg-top font-poppins overflow-y-auto">
      <div className="flex gap-3 ml-[18px] mt-[30px] w-[30px]">
        <div
          className="w-[140px] h-[30px] bg-gray-300 animate-pulse"
          style={{ display: isImageLoaded ? "none" : "block" }}
        />
        <img
          src="https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2Fwhitelogo.svg?alt=media&token=a7436647-2de7-4fee-8e3a-5c637bd0bc61"
          alt="Logo"
          className="w-[140px]"
          style={{ display: isImageLoaded ? "block" : "none" }}
          onLoad={() => setIsImageLoaded(true)}
        />
      </div>
      <div className="dropside"></div>

      <ul className="ul-side">
        {groupedMenuItems["general"]
          ?.filter((item) => item.roles.includes(role))
          .map(
            (
              item // Only show items for the current role
            ) => (
              <Link
                to={item.to}
                className={`ps-4 side ${selectedLink.startsWith(item.to) ? "selected-link" : ""}`}
                key={item.to}
              >
                <span className="m-2">
                  <RenderIcon iconName={item.iconName} size={22} loading={6} />
                </span>
              </Link>
            )
          )}
      </ul>
    </div>
  );
};

export default SmallSideBar;
