import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import Routers from "@/routes/Routers";

import SmallSideBar from "@/components/sideBar/SmallSideBar";
import MainSideBar from "@/components/sideBar/MainSideBar";

const Layout = () => {
  const location = useLocation();
  const path = location.pathname;

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Update the windowWidth state on window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const pathsForNoSideBar = [
    "sign-in",
    "sign-up",
    "verify",
    "success",
    "forgot-password",
    "reset-password",
    "maintenance",
  ];
  const pathsForSmallSidebar = ["delivery-management", "payout"];

  const noSidebar = pathsForNoSideBar.some((p) => path.includes(p));
  const showSmallSidebar =
    pathsForSmallSidebar.some((p) => path.includes(p)) && windowWidth >= 1024;
  const showSidebar = windowWidth >= 1024 && !noSidebar;

  return (
    <>
      {showSidebar && (showSmallSidebar ? <SmallSideBar /> : <MainSideBar />)}
      <main
        className={`h-screen w-full ${
          showSidebar
            ? showSmallSidebar
              ? "lg:ps-[4rem]"
              : "lg:ps-[270px]"
            : ""
        }`}
      >
        <Routers />
      </main>
    </>
  );
};

export default Layout;
