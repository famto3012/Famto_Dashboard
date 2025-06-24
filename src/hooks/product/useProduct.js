import useApiClient from "@/api/apiClient";

// Category
export const fetchAllCategoriesOfMerchant = async (
  role,
  merchantId,
  navigate
) => {
  try {
    const route =
      role === "Merchant"
        ? `/categories/all-categories`
        : `/categories/admin/${merchantId}`;

    const api = useApiClient(navigate);
    const res = await api.get(route);

    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    throw new Error(
      err.response?.data?.message ||
        "Failed to fetch all categories of merchant."
    );
  }
};

export const updateCategoryStatus = async (
  role,
  categoryId,
  merchantId,
  navigate
) => {
  try {
    const route =
      role === "Merchant"
        ? `/categories/change-status/${categoryId}`
        : `/categories/admin/change-status/${merchantId}/${categoryId}`;

    const api = useApiClient(navigate);
    const res = await api.patch(route, {});

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    throw err.response?.data?.message || "Failed to update category status.";
  }
};

export const updateCategoryOrder = async (categories, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(`/categories/admin/change-order`, { categories });

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    throw err.response?.data?.message || "Failed to update category order.";
  }
};

export const createNewCategory = async (role, data, navigate) => {
  try {
    const route =
      role === "Merchant"
        ? `/categories/add-category`
        : `/categories/admin/add-category`;

    const api = useApiClient(navigate);
    const res = await api.post(route, data);

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    throw (
      err.response?.data?.errors || {
        message: "Failed to create new category",
      }
    );
  }
};

export const fetchSingleCategoryDetail = async (
  role,
  merchantId,
  categoryId,
  navigate
) => {
  try {
    const route =
      role === "Merchant"
        ? `/categories/${categoryId}`
        : `/categories/admin/${merchantId}/${categoryId}`;

    const api = useApiClient(navigate);
    const res = await api.get(route);

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    throw (
      err.response?.data?.errors || {
        message: "Failed to fetch single category detail",
      }
    );
  }
};

export const updateCategoryDetail = async (
  role,
  categoryId,
  merchantId,
  data,
  navigate
) => {
  try {
    const route =
      role === "Merchant"
        ? `/categories/${categoryId}`
        : `/categories/admin/edit-category/${merchantId}/${categoryId}`;

    const api = useApiClient(navigate);
    const res = await api.put(route, data);

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    throw (
      err.response?.data?.errors || {
        message: "Failed to fetch single category detail",
      }
    );
  }
};

export const deleteCategory = async (
  role,
  merchantId,
  categoryId,
  navigate
) => {
  try {
    const route =
      role === "Merchant"
        ? `/categories/${categoryId}`
        : `/categories/admin/delete-category/${merchantId}/${categoryId}`;

    const api = useApiClient(navigate);
    const res = await api.delete(route);

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    throw (
      err.response?.data?.errors || {
        message: "Failed to delete category",
      }
    );
  }
};

// Product
export const fetchAllProductsOfMerchant = async (merchantId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(
      `/products/all-products-of-merchant/${merchantId}`
    );

    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    console.error(`Error in fetching all products of merchant: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch all products of merchant."
    );
  }
};

export const fetchAllProductsOfCategory = async (categoryId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/products/product-by-category/${categoryId}`);

    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to fetch all products of category."
    );
  }
};

export const fetchSingleProductDetail = async (productId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/products/${productId}`);

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to fetch product detail."
    );
  }
};

export const updateProductStatus = async (productId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.patch(
      `/products/change-inventory-status/${productId}`,
      {}
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to update product status."
    );
  }
};

export const updateProductOrder = async (products, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(`/products/change-order`, { products });

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to update product order."
    );
  }
};

export const addNewVariants = async (productId, data, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(`/products/${productId}/add-variants`, data);

    return res.status === 201 ? res.data.message : null;
  } catch (err) {
    throw (
      err.response?.data?.errors || { message: "Failed to add new variants" }
    );
  }
};

export const updateExistingVariant = async (
  productId,
  variantId,
  data,
  navigate
) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(
      `/products/${productId}/variants/${variantId}`,
      data
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    throw (
      err.response?.data?.errors || {
        message: "Failed to update variant detail",
      }
    );
  }
};

export const deleteVariantType = async (
  productId,
  variantId,
  typeId,
  navigate
) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.delete(
      `/products/${productId}/variants/${variantId}/types/${typeId}`
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    throw (
      err.response?.data?.errors || {
        message: "Failed to delete variant type",
      }
    );
  }
};

export const createNewProduct = async (data, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(`/products/add-product`, data);

    return res.status === 201 ? res.data.message : null;
  } catch (err) {
    throw (
      err.response?.data?.errors || {
        message: "Failed to create new product",
      }
    );
  }
};

export const updateProductDetail = async (productId, data, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(`/products/edit-product/${productId}`, data);

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    throw (
      err.response?.data?.errors || {
        message: "Failed to update product detail",
      }
    );
  }
};

export const changeProductCategory = async (
  productId,
  categoryId,
  navigate
) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.patch(
      `/products/${productId}/change-category/${categoryId}`,
      {}
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    throw (
      err.response?.data?.errors || {
        message: "Failed to change product category",
      }
    );
  }
};

export const deleteProduct = async (productId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.delete(`/products/delete-product/${productId}`);

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    throw (
      err.response?.data?.errors || {
        message: "Failed to delete product",
      }
    );
  }
};

// CSV
export const downloadSampleProductCSV = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/products/csv/sample-csv`, {
      responseType: "blob",
    });

    return res.status === 200 ? res.data : null;
  } catch (err) {
    throw (
      err.response?.data?.errors || {
        message: "Failed to download sample product CSV",
      }
    );
  }
};

export const downloadCombinedProductCSV = async (merchantId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(
      `/products/csv/download-csv`,
      { merchantId },
      {
        responseType: "blob",
      }
    );

    return res.status === 200 ? res.data : null;
  } catch (err) {
    throw (
      err.response?.data?.errors || {
        message: "Failed to download product CSV",
      }
    );
  }
};

export const uploadProductCSV = async (data, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(`/products/csv/upload-csv`, data);

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.log("hook error", err.response?.data?.message);

    throw (
      err.response?.data || {
        message: "Failed to upload product CSV",
      }
    );
  }
};
