import useApiClient from "@/api/apiClient";

// Merchant Discounts / Shop Discounts
// ---------------------------------------
export const fetchAllMerchantDiscount = async (role, merchantId, navigate) => {
  try {
    const endPoint =
      role === "Merchant"
        ? `/merchant/shop-discount/get-merchant-discount`
        : `/admin/shop-discount/get-merchant-discount-admin/${merchantId}`;

    const api = useApiClient(navigate);
    const res = await api.get(endPoint);

    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    console.error(`Error in fetching all merchant discounts: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch all merchant discounts"
    );
  }
};

export const createMerchantDiscount = async (role, data, navigate) => {
  try {
    const endPoint =
      role === "Merchant"
        ? `/merchant/shop-discount/add-merchant-discount`
        : `/admin/shop-discount/add-merchant-discount-admin`;

    console.log("data: ", data);

    const api = useApiClient(navigate);
    const res = await api.post(endPoint, data);

    return res.status === 201 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in creating new merchant discount: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to create new merchant discount"
    );
  }
};

export const updateMerchantDiscountStatus = async (
  role,
  discountId,
  navigate
) => {
  try {
    const endPoint =
      role === "Merchant"
        ? `/merchant/shop-discount/merchant-status/${discountId}`
        : `/admin/shop-discount/merchant-status-admin/${discountId}`;

    const api = useApiClient(navigate);
    const res = await api.put(endPoint, {});

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in updating merchant discount status: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update merchant discount status"
    );
  }
};

export const fetchSingleMerchantDiscount = async (discountId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(
      `/merchant/shop-discount/get-merchant-discount-id/${discountId}`
    );

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(`Error in fetching single merchant discount: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch single merchant discount"
    );
  }
};

export const updateMerchantDiscount = async (
  role,
  discountId,
  data,
  navigate
) => {
  try {
    const endPoint =
      role === "Merchant"
        ? `/admin/shop-discount/edit-merchant-discount/${discountId}`
        : `/admin/shop-discount/edit-merchant-discount-admin/${discountId}`;

    const api = useApiClient(navigate);
    const res = await api.put(endPoint, data);

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in updating single merchant discount: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update single merchant discount"
    );
  }
};

export const deleteMerchantDiscount = async (role, discountId, navigate) => {
  try {
    const endPoint =
      role === "Merchant"
        ? `/admin/shop-discount/delete-merchant-discount/${discountId}`
        : `/admin/shop-discount/delete-merchant-discount-admin/${discountId}`;

    const api = useApiClient(navigate);
    const res = await api.delete(endPoint);

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in deleting merchant discount: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to delete merchant discount"
    );
  }
};

// Product Discounts
// ---------------------------------------
export const fetchAllProductDiscount = async (role, merchantId, navigate) => {
  try {
    const endPoint =
      role === "Merchant"
        ? `/merchant/product-discount/get-product-discount`
        : `/admin/product-discount/get-product-discount-admin/${merchantId}`;

    const api = useApiClient(navigate);
    const res = await api.get(endPoint);

    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    console.error(`Error in fetching all product discounts: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch all product discounts"
    );
  }
};

export const createProductDiscount = async (role, data, navigate) => {
  try {
    const endPoint =
      role === "Merchant"
        ? `/merchant/product-discount/add-product-discount`
        : `/admin/product-discount/add-product-discount-admin`;

    const api = useApiClient(navigate);
    const res = await api.post(endPoint, data);

    return res.status === 201 ? res.data.message : null;
  } catch (err) {
    console.error(
      `Error in creating new product discount: ${JSON.stringify(err.response?.data)}`
    );

    const errorData = err.response?.data;

    // Extract error message and conflicting products
    const errorMessage =
      errorData?.message || "An error occurred while creating the discount.";
    const conflictingProducts = errorData?.conflictingProducts || [];

    // Construct a detailed error message
    const detailedErrorMessage = conflictingProducts.length
      ? `${errorMessage}: ${conflictingProducts.join(", ")}`
      : errorMessage;

    // Throw a structured error object
    throw {
      message: detailedErrorMessage,
      status: err.response?.status || 500,
      data: {
        message: errorMessage,
        conflictingProducts,
      },
    };
  }
};

export const updateProductDiscountStatus = async (
  role,
  discountId,
  navigate
) => {
  try {
    const endPoint =
      role === "Merchant"
        ? `/merchant/product-discount/product-status/${discountId}`
        : `/admin/product-discount/product-status-admin/${discountId}`;

    const api = useApiClient(navigate);
    const res = await api.put(endPoint, {});

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in updating product discount status: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update product discount status"
    );
  }
};

export const fetchSingleProductDiscount = async (discountId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(
      `/merchant/product-discount/get-product-discount-id/${discountId}`
    );

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(`Error in fetching single product discount: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch single product discount"
    );
  }
};

export const updateProductDiscount = async (
  role,
  discountId,
  data,
  navigate
) => {
  try {
    const endPoint =
      role === "Merchant"
        ? `/admin/product-discount/edit-product-discount/${discountId}`
        : `/admin/product-discount/edit-product-discount-admin/${discountId}`;

    const api = useApiClient(navigate);
    const res = await api.put(endPoint, data);

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(
      `Error in updating new product discount: ${JSON.stringify(err.response?.data)}`
    );

    const errorData = err.response?.data;

    // Extract error message and conflicting products
    const errorMessage =
      errorData?.message || "An error occurred while updating the discount.";
    const conflictingProducts = errorData?.conflictingProducts || [];

    // Construct a detailed error message
    const detailedErrorMessage = conflictingProducts.length
      ? `${errorMessage}: ${conflictingProducts.join(", ")}`
      : errorMessage;

    // Throw a structured error object
    throw {
      message: detailedErrorMessage,
      status: err.response?.status || 500,
      data: {
        message: errorMessage,
        conflictingProducts,
      },
    };
  }
};

export const deleteProductDiscount = async (role, discountId, navigate) => {
  try {
    const endPoint =
      role === "Merchant"
        ? `/merchant/product-discount/delete-product-discount/${discountId}`
        : `/admin/product-discount/delete-product-discount-admin/${discountId}`;

    const api = useApiClient(navigate);
    const res = await api.delete(endPoint);

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in deleting product discount: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to delete product discount"
    );
  }
};
