import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import AuthContext from "@/context/AuthContext";

import { toaster } from "@/components/ui/toaster";

import GlobalSearch from "@/components/others/GlobalSearch";
import Loader from "@/components/others/Loader";

import MerchantDetail from "@/screens/general/merchant/MerchantDetail";

import {
  fetchSettingsData,
  updateSettingsData,
} from "@/hooks/settings/useSettings";
import ChangePassword from "@/models/account/settings/ChangePassword";

const Setting = () => {
  const { role } = useContext(AuthContext);

  if (role === "Merchant") {
    return <MerchantDetail />;
  }

  const [settingsData, setSettingsData] = useState({
    id: "",
    fullName: "",
    email: "",
    phoneNumber: "",
  });
  const [showButton, setShowButton] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["settings"],
    queryFn: () => fetchSettingsData(navigate),
  });

  const updateSettings = useMutation({
    mutationKey: ["update-settings"],
    mutationFn: (settingsData) => updateSettingsData(settingsData, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["settings"]);
      setShowButton(false);
      toaster.create({
        title: "Success",
        description: "Updated settings",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while updating settings detail",
        type: "error",
      });
    },
  });

  useEffect(() => {
    data && setSettingsData(data);
    setShowButton(false);
  }, [data]);

  useEffect(() => {
    if (data) {
      const isModified = Object.keys(settingsData).some(
        (key) => settingsData[key] !== data[key]
      );
      setShowButton(isModified);
    }
  }, [settingsData, data]);

  const handleInputChange = (e) => {
    setSettingsData({ ...settingsData, [e.target.name]: e.target.value });
  };

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <div className="flex flex-1 justify-center items-center h-screen">
        <p>Error</p>
      </div>
    );

  return (
    <div className="bg-gray-100 min-h-full min-w-full">
      <GlobalSearch />

      <div className="flex items-center justify-between mx-11 mt-[50px]">
        <h1 className="text-xl font-semibold">Settings</h1>

        <button
          className="bg-teal-700 text-white rounded-md flex items-center space-x-1 p-2"
          onClick={() => setShowModal(true)}
        >
          Update Password
        </button>
      </div>

      <div className="bg-white p-5 md:p-12 rounded-lg  mt-[40px] md:mx-11">
        <div className="flex flex-col gap-4 ">
          <div className="flex items-center justify-between">
            <label className="w-1/3 text-gray-500 " htmlFor="id">
              ID
            </label>
            <input
              className="rounded p-2 w-full outline-none focus:outline-none uppercase text-start"
              type="text"
              placeholder="ID"
              value={settingsData._id}
              disabled
            />
          </div>
          <div className="flex items-center">
            <label className="w-1/3 text-gray-500" htmlFor="fullName">
              Name
            </label>
            <input
              className="border-2 border-gray-300 rounded p-2 w-full outline-none focus:outline-none"
              type="text"
              placeholder="Name"
              value={settingsData.fullName}
              name="fullName"
              onChange={handleInputChange}
            />
          </div>
          <div className="flex items-center">
            <label className="w-1/3 text-gray-500" htmlFor="email">
              Email
            </label>
            <input
              className="border-2 border-gray-300 rounded p-2 w-full outline-none focus:outline-none"
              type="email"
              placeholder="Email"
              value={settingsData.email}
              name="email"
              onChange={handleInputChange}
            />
          </div>
          <div className="flex items-center">
            <label className="w-1/3 text-gray-500" htmlFor="phoneNumber">
              Phone
            </label>
            <input
              className="border-2 border-gray-300 rounded p-2 w-full outline-none focus:outline-none"
              type="tel"
              placeholder="Phone"
              value={settingsData.phoneNumber}
              name="phoneNumber"
              onChange={handleInputChange}
            />
          </div>

          {showButton && (
            <div className="flex justify-end gap-4 mt-6 ">
              <button
                className="bg-teal-700 text-white py-2 px-10 rounded-md"
                onClick={() => updateSettings.mutate(settingsData)}
              >
                {updateSettings.isPending ? `Saving...` : `Save`}
              </button>
            </div>
          )}
        </div>
      </div>

      <ChangePassword isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default Setting;
