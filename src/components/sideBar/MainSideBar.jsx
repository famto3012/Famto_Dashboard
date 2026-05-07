import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import RenderIcon from "@/icons/RenderIcon";

import { Button } from "@/components/ui/button";

import AuthContext from "@/context/AuthContext";
import Logout from "@/models/auth/Logout";
import { useQuery } from "@tanstack/react-query";
import { fetchAllowedRoutes } from "@/hooks/manager/useManager";
import {
  allowedMerchantRouteOptions,
  mainSideBarMenuItems,
} from "@/utils/defaultData";

const MainSideBar = ({ showClose = false, onClick }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedLink, setSelectedLink] = useState("");
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [allowedRoutes, setAllowedRoutes] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [groupedMenuItems, setGroupedMenuItems] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const { token, role } = useContext(AuthContext);

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
    const updatedMenuItems = mainSideBarMenuItems.map((item) => {
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

  useEffect(() => {
    setSelectedLink(location.pathname);
  }, [location.pathname]);


  const toggleSidebar = (dropdown) => () => {
    setOpenDropdown((prevDropdown) =>
      prevDropdown === dropdown ? null : dropdown
    );
  };

  return (
 <div className="fixed top-0 left-0 w-[270px] h-screen bg-gradient-to-b from-[#016B6C] to-[#000] bg-[length:100%_150%] bg-top font-poppins overflow-y-auto overflow-x-hidden pb-[50px] z-50 scrollbar-thin">
 <div className="flex items-center justify-between mx-[10px] mt-[30px]">
        <div>
          <div
            className="w-[140px] h-[30px] bg-gray-300 animate-pulse"
            style={{ display: isImageLoaded ? "none" : "block" }}
          />
          <img
            src="https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2FAsset%206.svg?alt=media&token=a611c00b-b1de-4968-9bb2-5e9440f55945"
            alt="Logo"
            className="w-[140px] h-[30px]"
            style={{ display: isImageLoaded ? "block" : "none" }}
            onLoad={() => setIsImageLoaded(true)}
          />
        </div>

        {showClose && (
          <Button onClick={onClick} className="text-white border-2">
            <RenderIcon iconName="MenuIcon" size={24} loading={6} />
          </Button>
        )}
      </div>

      <div className="dropside">General</div>

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
                <span className="font-[poppins]">{item.label}</span>
              </Link>
            )
          )}
      </ul>
      {Object.entries(groupedMenuItems)
        .filter(([key]) => key !== "general")
        .filter(
          ([_, items]) => items.some((item) => item.roles.includes(role)) // Check if at least one item has the role
        )
        .map(([dropLabel, items]) => (
          <div key={dropLabel}>
            <div className="dropside" onClick={toggleSidebar(dropLabel)}>
              <span className="font-[poppins]">{dropLabel}</span>
              <button>
                <RenderIcon
                  iconName="AngleRightDropDownIcon"
                  size={24}
                  loading={2}
                />
              </button>
            </div>
            {openDropdown === dropLabel && (
              <ul className="ul-side">
                {items
                  .filter((item) => item.roles.includes(role)) // Only show items for the current role
                  .map((item) => (
                    <Link
                      to={item.to}
                      className={`ps-4 side ${selectedLink.startsWith(item.to) ? "selected-link" : ""}`}
                      key={item.to}
                    >
                      <span className="m-2">
                        <RenderIcon
                          iconName={item.iconName}
                          size={22}
                          loading={6}
                        />
                      </span>
                      <span className="font-[poppins]">{item.label}</span>
                    </Link>
                  ))}
              </ul>
            )}
          </div>
        ))}

      {/* Rest of your dropdown menus and additional logic remains the same */}
      <Logout isOpen={showModal} onClose={() => setShowModal(!showModal)} />
    </div>
  );
};

export default MainSideBar;
