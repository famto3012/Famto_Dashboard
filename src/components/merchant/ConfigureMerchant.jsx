import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useQuery } from "@tanstack/react-query";

import AuthContext from "@/context/AuthContext";

import { HStack, VStack } from "@chakra-ui/react";
import { Radio, RadioGroup } from "@/components/ui/radio";
import { Switch } from "@/components/ui/switch";

import { getAllBusinessCategory } from "@/hooks/customerAppCustomization/useBusinessCategory";

const ConfigureMerchant = ({ detail, onDataChange }) => {
  const [showOption, setShowOption] = useState(false);

  const { role } = useContext(AuthContext);
  const navigate = useNavigate();

  const { data: allBusinessCategory } = useQuery({
    queryKey: ["all-businessCategory"],
    queryFn: () => getAllBusinessCategory(navigate),
  });

  const businessOptions = allBusinessCategory?.map((category) => ({
    label: category.title,
    value: category._id,
  }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onDataChange({
      ...detail,
      [name]: value,
      merchantDetail: {
        ...detail.merchantDetail,
        [name]: value,
      },
    });
  };

  const togglePreOrderStatus = (checked, name) => {
    onDataChange({
      ...detail,
      [name]: checked,
      merchantDetail: {
        ...detail.merchantDetail,
        [name]: checked,
        preOrderType: !checked && null,
      },
    });
  };

  const handleSelectChange = (selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    onDataChange({
      ...detail,
      merchantDetail: {
        ...detail.merchantDetail,
        businessCategoryId: selectedValues,
      },
    });
  };

  useEffect(() => {
    if (!allBusinessCategory || !detail?.merchantDetail?.businessCategoryId)
      return;

    // Define the titles you want to check
    const titlesSet = new Set([
      "Food",
      "Home Chef",
      "Home Bakers",
      "Pet Supplies",
    ]);

    // Find all matching categories
    const foodCategories = allBusinessCategory.filter((category) =>
      titlesSet.has(category.title)
    );

    // Collect their IDs as strings
    const foodCategoryIds = foodCategories.map((category) =>
      category._id?.toString()
    );

    // Check if any of the foodCategoryIds are in merchant's selected businessCategoryId
    const hasFoodCategory = detail.merchantDetail.businessCategoryId.some(
      (id) => foodCategoryIds.includes(id?.toString())
    );

    if (hasFoodCategory) {
      setShowOption(true);
    } else {
      setShowOption(false);
      onDataChange((prevData) => ({
        ...prevData,
        merchantDetail: {
          ...prevData.merchantDetail,
          merchantFoodType: prevData?.merchantDetail?.merchantFoodType || " ",
        },
      }));
    }
  }, [detail?.merchantDetail?.businessCategoryId, allBusinessCategory]);

  return (
    <>
      <div className="mb-4 flex flex-col gap-[10px]">
        <h3 className="text-gray-700 font-bold mb-2">Configuration</h3>

        {role !== "Merchant" && (
          <div className="mb-4 flex flex-col md:flex-row gap-[15px] md:gap-0 md:w-[800px]">
            <label className="block mt-3 text-gray-700 md:w-1/3">
              Business category
              <span className="text-red-500 font-bold">*</span>
            </label>

            <Select
              className="mt-2 w-3/5 rounded-md outline-none focus:outline-none"
              value={businessOptions?.filter((option) =>
                detail?.merchantDetail?.businessCategoryId?.includes(
                  option.value
                )
              )}
              isMulti={true}
              isSearchable={true}
              isClearable={true}
              onChange={handleSelectChange}
              options={businessOptions}
              placeholder="Select business category"
            />
          </div>
        )}

        {showOption && (
          <div className="mb-4 flex flex-col md:flex-row gap-[15px] md:gap-0 md:w-[800px]">
            <label className="block text-gray-700 md:w-1/3">
              If food, then<span className="text-red-500 font-bold">*</span>
            </label>

            <RadioGroup
              value={detail?.merchantDetail?.merchantFoodType}
              onValueChange={(e) => {
                onDataChange({
                  ...detail,
                  merchantDetail: {
                    ...detail.merchantDetail,
                    merchantFoodType: e.value,
                  },
                });
              }}
              className="w-2/3"
              size="sm"
              colorPalette="teal"
              variant="solid"
            >
              <HStack gap="8" direction="row">
                <Radio value="Veg" className="cursor-pointer">
                  Veg
                </Radio>
                <Radio value="Non-veg" className="cursor-pointer">
                  Non-veg
                </Radio>
                <Radio value="Both" className="cursor-pointer">
                  Both
                </Radio>
              </HStack>
            </RadioGroup>
          </div>
        )}

        <div className="mb-4 flex flex-col md:flex-row gap-[15px] md:gap-0 md:w-[800px]">
          <label className="block text-gray-700 md:w-1/3">
            Delivery option<span className="text-red-500 font-bold">*</span>
          </label>

          <RadioGroup
            value={detail?.merchantDetail?.deliveryOption}
            onValueChange={(e) => {
              const updatedDeliveryOption = e.value;

              onDataChange({
                ...detail,
                merchantDetail: {
                  ...detail.merchantDetail,
                  deliveryOption: updatedDeliveryOption,
                  preOrderStatus:
                    updatedDeliveryOption === "On-demand"
                      ? false
                      : detail.merchantDetail.preOrderStatus,
                },
              });
            }}
            className="w-2/3"
            size="sm"
            colorPalette="teal"
            variant="solid"
          >
            <HStack gap="8" direction="row">
              <Radio value="On-demand" className="cursor-pointer">
                On-demand
              </Radio>
              <Radio value="Scheduled" className="cursor-pointer">
                Scheduled
              </Radio>
              <Radio value="Both" className="cursor-pointer">
                Both
              </Radio>
            </HStack>
          </RadioGroup>
        </div>

        <div className="mb-4 flex flex-col md:flex-row gap-[15px] md:gap-0 items-start md:w-[800px]">
          <label className="block text-gray-700 md:w-1/3">
            Select Delivery time
            <span className="text-red-500 font-bold">*</span>
          </label>
          <input
            type="text"
            name="deliveryTime"
            value={detail?.merchantDetail?.deliveryTime}
            onChange={handleInputChange}
            maxLength={2}
            onKeyDown={(e) => {
              if (
                !/^[0-9]$/.test(e.key) &&
                e.key !== "Backspace" &&
                e.key !== "Tab"
              ) {
                e.preventDefault();
              }
            }}
            className="p-2 w-[20rem] border rounded-md outline-none focus:outline-none"
            placeholder="Time (in minutes)"
          />
        </div>

        <div className="mb-4 flex md:w-[800px]">
          <span className="hidden md:w-1/3"></span>
          <p className="text-gray-500 md:w-2/5 text-sm mt-2">
            Note: Enter here the default time taken for the Delivery of an
            order. If a merchant is handling their delivery by itself then he
            will enter his/her own delivery time.
          </p>
        </div>

        <div className="mb-4 flex md:w-[800px] gap-[20px] md:gap-0">
          <label className="block md:w-1/3 text-gray-700">
            Pre Order Sales Status
          </label>

          <Switch
            colorPalette="teal"
            name="preOrderStatus"
            checked={detail?.merchantDetail?.preOrderStatus}
            onCheckedChange={(e) => {
              togglePreOrderStatus(e.checked, "preOrderStatus");
            }}
            disabled={detail?.merchantDetail?.deliveryOption === "On-demand"}
          />
        </div>

        <div
          className={`mb-4 flex md:w-[800px] gap-[20px] md:gap-0 ${detail?.merchantDetail?.preOrderStatus ? "block" : "hidden"} `}
        >
          <label className="block md:w-1/3 text-gray-700">
            Pre Order Sales Type
          </label>

          <RadioGroup
            value={detail?.merchantDetail?.preOrderType}
            onValueChange={(e) => {
              onDataChange({
                ...detail,
                merchantDetail: {
                  ...detail.merchantDetail,
                  preOrderType: e.value,
                },
              });
            }}
            className="w-2/3"
            size="sm"
            colorPalette="teal"
            variant="solid"
          >
            <HStack gap="8" direction="row">
              <Radio
                value="Current-day"
                disabled={!detail?.merchantDetail?.preOrderStatus}
                className={`${!detail?.merchantDetail?.preOrderStatus ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                Current Day
              </Radio>
              <Radio
                value="Next-day"
                disabled={!detail?.merchantDetail?.preOrderStatus}
                className={`${!detail?.merchantDetail?.preOrderStatus ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                Next Day
              </Radio>
            </HStack>
          </RadioGroup>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-[15px] md:gap-0 md:w-[800px]">
        <h3 className="text-gray-700 mb-2 w-1/3">
          Serving Area<span className="text-red-500 font-bold">*</span>
        </h3>

        <div className="mb-4 w3/5">
          <div className="flex flex-col gap-4">
            <RadioGroup
              value={detail?.merchantDetail?.servingArea}
              onValueChange={(e) => {
                const updatedDeliveryOption = e.value;

                onDataChange({
                  ...detail,
                  merchantDetail: {
                    ...detail.merchantDetail,
                    servingArea: updatedDeliveryOption,
                  },
                });
              }}
              className="w-1/2"
              size="sm"
              colorPalette="teal"
              variant="solid"
            >
              <VStack gap="5" align="start">
                <Radio value="No-restrictions" className="cursor-pointer">
                  No-restrictions
                </Radio>
                <Radio value="Mention-radius" className="cursor-pointer">
                  Mention-radius
                </Radio>
              </VStack>
            </RadioGroup>
            <span className="text-[15px]">
              Mention a radius around the central location of my merchant.
              <br /> Your store will serve within a this radius around your
              central location.
            </span>
          </div>

          {detail?.merchantDetail?.servingArea === "Mention-radius" && (
            <input
              type="text"
              name="servingRadius"
              value={detail?.merchantDetail?.servingRadius || 1}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (
                  !/^[0-9]$/.test(e.key) &&
                  e.key !== "Backspace" &&
                  e.key !== "Tab"
                ) {
                  e.preventDefault();
                }
              }}
              className="mt-6 p-2 w-[20rem] border border-gray-400 rounded-md outline-none focus:outline-none"
              placeholder="Serving Radius (in km)"
              maxLength={2}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ConfigureMerchant;
