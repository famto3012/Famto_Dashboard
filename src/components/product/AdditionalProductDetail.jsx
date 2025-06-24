import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import AuthContext from "@/context/AuthContext";
import DataContext from "@/context/DataContext";

import RenderIcon from "@/icons/RenderIcon";

import { Button } from "@/components/ui/button";
import { toaster } from "@/components/ui/toaster";
import { ToggleTip } from "@/components/ui/toggle-tip";

import {
  addNewVariants,
  updateExistingVariant,
} from "@/hooks/product/useProduct";
import DeleteVariant from "@/models/general/product/DeleteVariant";

const AdditionalProductDetail = ({ data }) => {
  const [newVariantForm, setNewVariantForm] = useState(false);
  const [newVariantData, setNewVariantData] = useState({
    variantName: "",
    variantTypes: [{ typeName: "", price: "" }],
  });
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [variantDetail, setVariantDetail] = useState(null);
  const [selectedVariantTypeId, setSelectedVariantTypeId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const formRef = useRef(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { role } = useContext(AuthContext);
  const { selectedProduct } = useContext(DataContext);

  useEffect(() => {
    if (data?.variants?.length > 0) {
      const initialVariant = {
        value: 0,
        label: data.variants[0].variantName || "Variant 1",
      };
      setSelectedVariant(initialVariant);
      setVariantDetail(data.variants[0]);
    }
  }, [data]);

  useEffect(() => {
    if (selectedVariant) {
      const currentDetail = data.variants[selectedVariant.value];
      setVariantDetail(currentDetail);
    }
  }, [selectedVariant, data.variants, data]);

  const variantOptions = data.variants.map((variant, index) => ({
    value: index,
    label: variant.variantName || `Variant ${index + 1}`,
  }));

  const handleAddVariantClick = () => {
    setNewVariantForm(!newVariantForm);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleInputChange = (index, name, value) => {
    setNewVariantData((prev) => ({
      ...prev,
      variantTypes: prev.variantTypes.map((type, i) =>
        i === index ? { ...type, [name]: value } : type
      ),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (variantDetail) {
      setVariantDetail((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const addNewVariantTypeRow = (e) => {
    e.preventDefault();
    setNewVariantData((prev) => ({
      ...prev,
      variantTypes: [...prev.variantTypes, { typeName: "", price: "" }],
    }));
  };

  const removeNewVariantType = (index) => {
    console.log("here");
    setNewVariantData((prev) => ({
      ...prev,
      variantTypes: prev.variantTypes.filter((_, i) => i !== index),
    }));
  };

  const handleSelectVariant = (variant) => setSelectedVariant(variant);

  const addExistingVariantTypeRow = (e) => {
    e.preventDefault();
    if (variantDetail) {
      setVariantDetail((prev) => ({
        ...prev,
        variantTypes: [...prev.variantTypes, { typeName: "", price: "" }],
      }));
    }
  };

  const handleChangeExistingVariant = (index, field, value) => {
    if (variantDetail) {
      const updatedVariantTypes = [...variantDetail.variantTypes];
      updatedVariantTypes[index][field] = value;
      setVariantDetail((prev) => ({
        ...prev,
        variantTypes: updatedVariantTypes,
      }));
    }
  };

  const removeExistingVariantType = (index, variantTypeId) => {
    console.log("Here 2");

    if (!variantTypeId) {
      // Remove the variant type at the given index
      setVariantDetail((prev) => ({
        ...prev,
        variantTypes: prev.variantTypes.filter((_, i) => i !== index),
      }));
      return;
    }

    if (variantTypeId) {
      setSelectedVariantTypeId(variantTypeId);
      setShowModal(true);
    }
  };

  const handleAddNewVariant = useMutation({
    mutationKey: ["add-new-variant"],
    mutationFn: () =>
      addNewVariants(selectedProduct.productId, newVariantData, navigate),
    onSuccess: () => {
      setNewVariantForm(false);
      setNewVariantData({
        variantName: "",
        variantTypes: [{ typeName: "", price: "" }],
      });
      queryClient.invalidateQueries([
        "product-detail",
        selectedProduct.productId,
      ]);
      toaster.create({
        title: "Success",
        description: "New variant added successfully",
        type: "success",
      });
    },
    onError: (error) => {
      const errorData = error || { message: "An unexpected error occurred" };

      const formattedErrors = Object.entries(errorData)
        .map(([_, msg]) => `• ${msg}`)
        .join("\n");

      toaster.create({
        title: "Error",
        description: formattedErrors,
        type: "error",
      });
    },
  });

  const handleUpdateVariant = useMutation({
    mutationKey: ["update-variant"],
    mutationFn: () =>
      updateExistingVariant(
        selectedProduct.productId,
        variantDetail._id,
        variantDetail,
        navigate
      ),
    onSuccess: () => {
      queryClient.invalidateQueries([
        "product-detail",
        selectedProduct.productId,
      ]);
      toaster.create({
        title: "Success",
        description: "Variant updated successfully",
        type: "success",
      });
    },
    onError: (error) => {
      const errorData = error || {
        message: "An unexpected error occurred",
      };

      const formattedErrors = Object.entries(errorData)
        .map(([_, msg]) => `• ${msg}`)
        .join("\n");

      toaster.create({
        title: "Error",
        description: formattedErrors,
        type: "error",
      });
    },
  });

  return (
    <>
      <div className="p-5 flex justify-between">
        <label className="w-1/3 text-gray-700 items-center mt-2">
          Product Name
        </label>
        <input
          type="text"
          name="productName"
          value={data?.productName || ""}
          readOnly
          className="bg-gray-200 rounded-md outline-none focus:outline-none w-2/3 p-2"
        />
      </div>

      <div className="p-5 flex justify-between">
        <label className="w-1/3 text-gray-700 items-center mt-2">
          Product Price
        </label>
        <input
          type="text"
          name="price"
          value={role !== "Merchant" ? data?.price : data?.costPrice}
          readOnly
          className="bg-gray-200 rounded-md outline-none focus:outline-none w-2/3 p-2"
        />
      </div>

      <div className="p-5 flex justify-between">
        <label className="w-1/3 text-gray-700 items-center mt-2">
          Description
        </label>
        <input
          type="text"
          name="description"
          value={data?.description || ""}
          readOnly
          className="bg-gray-200 rounded-md outline-none focus:outline-none w-2/3 p-2"
        />
      </div>

      <div className="p-5 flex justify-between">
        <label className="w-1/3 text-gray-700 items-center mt-2">
          Long Description
        </label>

        <textarea
          name="longDescription"
          value={data?.longDescription || ""}
          readOnly
          rows={5}
          className="bg-gray-200 rounded-md outline-none focus:outline-none w-2/3 p-2 resize-none"
        ></textarea>
      </div>

      <div className="p-5 flex justify-between">
        <label className="w-1/3 text-gray-700 items-center mt-2">
          Available Qty
        </label>
        <input
          type="text"
          name="availableQuantity"
          value={data?.availableQuantity || ""}
          readOnly
          className="bg-gray-200 rounded-md outline-none focus:outline-none w-2/3 p-2"
        />
      </div>

      <div className="p-5 flex justify-between">
        <label className="flex items-center gap-2 text-gray-700">
          Alerts
          <ToggleTip content="Enter the minimum quantity at which you want to receive an e-mail for updating your inventory.">
            <Button size="xs" variant="ghost">
              <RenderIcon iconName="InfoIcon" size={16} loading={6} />
            </Button>
          </ToggleTip>
        </label>

        <input
          type="text"
          name="alert"
          value={data?.alert || ""}
          readOnly
          className="bg-gray-200 rounded-md outline-none focus:outline-none w-2/3 p-2"
        />
      </div>

      <div className="p-5 flex justify-between">
        <label className="w-1/3 text-gray-700 items-center mt-2">
          Variants
        </label>
        <button
          className="bg-teal-700 py-2 px-3 text-white rounded-md outline-none focus:outline-none w-2/3"
          onClick={handleAddVariantClick}
        >
          Add Variant
        </button>
      </div>

      {newVariantForm && (
        <div
          ref={formRef}
          className="bg-gray-100 p-4 w-2/3 ms-auto mt-5 rounded-lg shadow-md"
        >
          <h2 className="text-lg font-semibold mb-4">Add Variant Types</h2>
          <div className="pb-5 flex justify-between">
            <label className="w-1/3 text-gray-700 items-center mt-2">
              Variant Name
            </label>
            <input
              type="text"
              name="variantName"
              value={newVariantData?.variantName || ""}
              placeholder="Variant name"
              onChange={(e) =>
                setNewVariantData((prevData) => ({
                  ...prevData,
                  variantName: e.target.value,
                }))
              }
              className="border-gray-300 border rounded-md outline-none focus:outline-none w-2/3 p-2"
            />
          </div>

          {newVariantData.variantTypes?.map((type, index) => (
            <div className="flex items-center mb-2" key={index}>
              <input
                type="text"
                placeholder="Variant type name"
                value={type?.typeName || ""}
                onChange={(e) =>
                  handleInputChange(index, "typeName", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md mr-2 outline-none focus:outline-none"
              />
              {role !== "Merchant" && (
                <input
                  type="text"
                  placeholder="Price"
                  value={type?.price || ""}
                  onChange={(e) =>
                    handleInputChange(index, "price", e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (
                      !/^[0-9]$/.test(e.key) &&
                      e.key !== "Backspace" &&
                      e.key !== "Tab"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md mr-2 outline-none focus:outline-none"
                />
              )}
              <input
                type="text"
                placeholder={role !== "Merchant" ? "Cost Price" : "Price"}
                value={type?.costPrice || ""}
                onChange={(e) =>
                  handleInputChange(index, "costPrice", e.target.value)
                }
                onKeyDown={(e) => {
                  if (
                    !/^[0-9]$/.test(e.key) &&
                    e.key !== "Backspace" &&
                    e.key !== "Tab"
                  ) {
                    e.preventDefault();
                  }
                }}
                className="w-full p-2 border border-gray-300 rounded-md mr-2 outline-none focus:outline-none"
              />
              <button
                onClick={() => removeNewVariantType(index)}
                className="text-red-500"
              >
                <RenderIcon iconName="DeleteIcon" size={20} loading={6} />
              </button>
            </div>
          ))}

          <div className="flex justify-between gap-3 mx-3">
            <button
              onClick={() => handleAddNewVariant.mutate()}
              className="w-1/2 bg-zinc-200 p-2 rounded-md mt-4"
            >
              {handleAddNewVariant.isPending ? `Saving...` : `Save`}
            </button>
            <button
              onClick={addNewVariantTypeRow}
              className="w-1/2 bg-teal-800 text-white p-2 rounded-md mt-4"
            >
              Add more
            </button>
          </div>
        </div>
      )}

      {selectedVariant && (
        <>
          <div className="p-5 flex justify-between">
            <span className="w-1/3 "></span>
            <Select
              value={selectedVariant}
              placeholder="Select variant type"
              className="w-2/3"
              options={variantOptions}
              onChange={handleSelectVariant}
            />
          </div>

          <div className="bg-gray-100 p-4 w-2/3 ms-auto mt-5 rounded-lg shadow-md">
            {variantDetail && (
              <>
                <div className="pb-5 flex justify-between">
                  <label className="w-1/3 text-gray-700 items-center mt-2">
                    Variant Name
                  </label>
                  <input
                    type="text"
                    name="variantName"
                    value={variantDetail?.variantName}
                    placeholder="Variant name"
                    onChange={handleChange}
                    className="border-gray-300 border rounded-md outline-none focus:outline-none w-2/3 p-2"
                  />
                </div>

                {variantDetail.variantTypes.map((type, index) => (
                  <div className="flex items-center mb-2" key={type._id}>
                    <input
                      type="text"
                      placeholder="Variant type name"
                      value={type?.typeName || ""}
                      onChange={(e) =>
                        handleChangeExistingVariant(
                          index,
                          "typeName",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded-md mr-2 outline-none focus:outline-none"
                    />
                    {role !== "Merchant" && (
                      <input
                        type="text"
                        placeholder="Price"
                        value={type?.price?.toString() || ""}
                        onChange={(e) =>
                          handleChangeExistingVariant(
                            index,
                            "price",
                            e.target.value
                          )
                        }
                        onKeyDown={(e) => {
                          if (
                            !/^[0-9]$/.test(e.key) &&
                            e.key !== "Backspace" &&
                            e.key !== "Tab"
                          ) {
                            e.preventDefault();
                          }
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md mr-2 outline-none focus:outline-none"
                      />
                    )}
                    <input
                      type="text"
                      placeholder={role !== "Merchant" ? "Cost price" : "Price"}
                      value={type?.costPrice?.toString() || ""}
                      onChange={(e) =>
                        handleChangeExistingVariant(
                          index,
                          "costPrice",
                          e.target.value
                        )
                      }
                      onKeyDown={(e) => {
                        if (
                          !/^[0-9]$/.test(e.key) &&
                          e.key !== "Backspace" &&
                          e.key !== "Tab"
                        ) {
                          e.preventDefault();
                        }
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md mr-2 outline-none focus:outline-none"
                    />
                    <button
                      onClick={() => removeExistingVariantType(index, type._id)}
                      className="text-red-600"
                    >
                      <RenderIcon iconName="DeleteIcon" size={20} loading={6} />
                    </button>
                  </div>
                ))}
              </>
            )}

            <div className="flex justify-between gap-3 mx-3">
              <button
                onClick={() => handleUpdateVariant.mutate()}
                className="w-1/2 bg-zinc-200 p-2 rounded-md mt-4"
              >
                {handleUpdateVariant.isPending ? `Saving...` : `Save`}
              </button>
              <button
                onClick={addExistingVariantTypeRow}
                className="w-1/2 bg-teal-800 text-white p-2 rounded-md mt-4"
              >
                Add more
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      <DeleteVariant
        isOpen={showModal}
        onClose={() => {
          setSelectedVariantTypeId(null);
          setShowModal(false);
        }}
        variantId={variantDetail?._id}
        typeId={selectedVariantTypeId}
      />
    </>
  );
};

export default AdditionalProductDetail;
