import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Switch } from "@/components/ui/switch";
import { toaster } from "@/components/ui/toaster";

import AuthContext from "@/context/AuthContext";

import RenderIcon from "@/icons/RenderIcon";

import GlobalSearch from "@/components/others/GlobalSearch";
import Loader from "@/components/others/Loader";
import Error from "@/components/others/Error";

import MerchantData from "@/components/merchant/MerchantData";
import MerchantDocument from "@/components/merchant/MerchantDocument";
import ConfigureMerchant from "@/components/merchant/ConfigureMerchant";
import SponsorshipDetail from "@/components/merchant/SponsorshipDetail";
import MerchantAvailability from "@/components/merchant/MerchantAvailability";

import {
  fetchSingleMerchantDetail,
  updateMerchantDetail,
  updateStatusMutation,
} from "@/hooks/merchant/useMerchant";

import EditMerchant from "@/models/general/merchant/EditMerchant";
import BlockMerchant from "@/models/general/merchant/BlockMerchant";
import DeleteMerchant from "@/models/general/merchant/DeleteMerchant";

const MerchantDetail = () => {
  const [formData, setFormData] = useState({});
  const [modal, setModal] = useState({
    edit: false,
    delete: false,
    block: false,
  });

  const { merchantId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { role } = useContext(AuthContext);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["merchant-detail", merchantId],
    queryFn: () => fetchSingleMerchantDetail(role, merchantId, navigate),
  });

  useEffect(() => {
    data && setFormData(data);
  }, [data]);

  const handleUpdateStatusMutation = useMutation({
    mutationKey: ["update-merchant-status", merchantId],
    mutationFn: () => updateStatusMutation(merchantId, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["merchant-detail", merchantId]);
      toaster.create({
        title: "Success",
        description: `${role !== "Merchant" ? "Merchant" : "Profile"} status updated successfully`,
        type: "success",
      });
    },
    onError: (data) => {
      toaster.create({
        title: "Error",
        description:
          data.message ||
          `Error in updating ${role !== "Merchant" ? "merchant" : "profile"} status, `,
        type: "error",
      });
    },
  });

  const handleUpdateMutation = useMutation({
    mutationKey: ["update-merchant-data", merchantId],
    mutationFn: (data) =>
      updateMerchantDetail(role, merchantId, data, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["merchant-detail", merchantId]);
      toaster.create({
        title: "Success",
        description: `${role !== "Merchant" ? "Merchant" : "Profile"} detail updated successfully`,
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: `Error in updating ${role !== "Merchant" ? "merchant" : "profile"} detail`,
        type: "error",
      });
    },
  });

  const handleSave = (data) => {
    const formDataObject = new FormData();

    function appendFormData(value, key) {
      if (value instanceof File) {
        formDataObject.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          appendFormData(item, `${key}[${index}]`);
        });
      } else if (typeof value === "object" && value !== null) {
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          appendFormData(nestedValue, key ? `${key}[${nestedKey}]` : nestedKey);
        });
      } else if (value !== undefined && value !== null) {
        formDataObject.append(key, value);
      }
    }

    Object.entries(data).forEach(([key, value]) => {
      appendFormData(value, key);
      console.log(value, key);
    });

    handleUpdateMutation.mutate(formDataObject);
  };

  const handleMerchantDataChange = (updatedData) => {
    setFormData((prevData) => ({
      ...prevData,
      ...updatedData,
    }));
  };

  const toggleModal = (type) => setModal({ ...modal, [type]: true });

  const closeModal = () => {
    setModal({
      edit: false,
      delete: false,
      block: false,
    });
  };

  if (isLoading) return <Loader />;
  if (isError) return <Error />;

  return (
    <div className="bg-gray-100 min-h-full ">
      <GlobalSearch />

      <div className="flex flex-col md:flex-row justify-between gap-y-[20px] md:gap-0 my-[15px] mt-8 mx-[20px]">
        <div className="flex items-center gap-2">
          <span onClick={() => navigate("/merchant")}>
            <RenderIcon iconName="LeftArrowIcon" size={16} loading={6} />
          </span>

          <h3 className="font-[600] text-[18px]">
            {formData?.merchantDetail?.merchantName}
          </h3>
        </div>

        <div className="flex items-center justify-between lg:justify-end md:gap-[15px]">
          {role !== "Merchant" && !formData.isBlocked && (
            <Link
              onClick={() => toggleModal("block")}
              className="flex gap-2 items-center bg-yellow-100 py-2 px-5 rounded-md"
            >
              <span className="text-red-500">
                <RenderIcon iconName="BlockIcon" size={16} loading={6} />
              </span>
              <span>Block</span>
            </Link>
          )}

          <>
            <button
              onClick={() => toggleModal("edit")}
              className="bg-teal-600 text-white flex items-center gap-[10px] py-2 px-1.5 rounded"
            >
              <RenderIcon iconName="EditIcon" size={16} loading={6} />
              <p className="hidden sm:block">
                {role !== "Merchant" ? `Edit Merchant` : `Change password`}
              </p>
            </button>

            {role !== "Merchant" && (
              <>
                <button
                  onClick={() => toggleModal("delete")}
                  className="bg-red-500 text-white rounded-md p-2"
                >
                  Delete
                </button>

                <span>Status</span>
                <Switch
                  disabled={
                    formData.isApproved === "Pending" ||
                    formData.isBlocked ||
                    handleUpdateStatusMutation.isPending
                  }
                  colorPalette="teal"
                  checked={formData?.status}
                  onCheckedChange={() => handleUpdateStatusMutation.mutate()}
                />
              </>
            )}
          </>
        </div>
      </div>

      <div className="bg-white rounded-lg p-5">
        <MerchantData
          detail={formData}
          onDataChange={handleMerchantDataChange}
        />

        <MerchantDocument
          detail={formData}
          onDataChange={handleMerchantDataChange}
        />

        <ConfigureMerchant
          detail={formData}
          onDataChange={handleMerchantDataChange}
        />

        <SponsorshipDetail
          detail={formData?.sponsorshipDetail}
          merchantId={formData._id}
          name={formData?.merchantDetail?.merchantName || formData.fullName}
          email={formData.email}
          phoneNumber={formData.phoneNumber}
        />

        <MerchantAvailability
          detail={formData}
          onDataChange={handleMerchantDataChange}
        />

        <div className="flex justify-end">
          <button
            onClick={() => handleSave(formData)}
            disabled={handleUpdateMutation.isPending}
            className="mt-8 bg-teal-700 text-white px-10 py-3 rounded-md font-[500] hover:bg-teal-600"
          >
            {handleUpdateMutation.isPending ? `Saving...` : `Save`}
          </button>
        </div>
      </div>

      <EditMerchant isOpen={modal.edit} onClose={closeModal} data={formData} />
      <BlockMerchant
        isOpen={modal.block}
        onClose={closeModal}
        merchantId={merchantId}
      />
      <DeleteMerchant
        isOpen={modal.delete}
        onClose={closeModal}
        merchantId={merchantId}
      />
    </div>
  );
};

export default MerchantDetail;
