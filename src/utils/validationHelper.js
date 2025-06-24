export const validateCreateInvoice = (data, role) => {
  const error = [];

  if (data.deliveryMode === "Take Away") validateTakeAway(data, role, error);
  else if (data.deliveryMode === "Home Delivery")
    validateHomeDelivery(data, role, error);
  else if (data.deliveryMode === "Pick and Drop")
    validatePickAndDrop(data, role, error);
  else if (data.deliveryMode === "Custom Order")
    validateCustomOrder(data, role, error);

  return error;
};

const validateTakeAway = (data, role, error) => {
  if (!data.customerId) {
    if (
      !data.newCustomer ||
      Object.entries(data.newCustomer).some(([_, value]) => !value)
    ) {
      error.push("Missing customer details");
    }
  }

  if (!data.merchantId && role !== "Merchant") {
    error.push("Missing merchant detail");
  }

  if (!data.items || data.items.length === 0) {
    error.push("Add at-least one item");
  }
};

const validateHomeDelivery = (data, role, error) => {
  if (!data.customerId) {
    if (
      !data.newCustomer ||
      Object.entries(data.newCustomer).some(([_, value]) => !value)
    ) {
      error.push("Missing customer details");
    }
  }

  if (!data.merchantId && role !== "Merchant") {
    error.push("Missing merchant detail");
  }

  if (!data.items || data.items.length === 0) {
    error.push("Add at-least one item");
  }

  const {
    customerAddressType,
    customerAddressOtherAddressId,
    newCustomerAddress,
  } = data;

  const isValidNewAddress =
    newCustomerAddress &&
    Object.entries(newCustomerAddress)
      .filter(([key]) => key !== "landmark" && key !== "saveAddress")
      .every(([_, value]) => value);

  const isValidPredefined =
    customerAddressType &&
    (customerAddressType !== "other" || customerAddressOtherAddressId);

  if (!isValidPredefined && !isValidNewAddress) {
    error.push("Missing address details");
  }
};

const validatePickAndDrop = (data, role, error) => {
  if (!data.customerId) {
    if (
      !data.newCustomer ||
      Object.entries(data.newCustomer).some(([_, value]) => !value)
    ) {
      error.push("Missing customer details");
    }
  }

  const { items } = data;

  if (!items || items.length === 0) {
    error.push("Add at-least one item");
  }

  if (
    items &&
    items.length &&
    items.some((item) => {
      const weight = Number(item.weight);
      return isNaN(weight) || weight <= 0;
    })
  ) {
    error.push("Invalid weight in one or more items");
  }

  const {
    pickUpAddressType,
    pickUpAddressOtherAddressId,
    newPickupAddress,
    newDeliveryAddress,
    deliveryAddressType,
    deliveryAddressOtherAddressId,
  } = data;

  const isValidNewPickAddress =
    newPickupAddress &&
    Object.entries(newPickupAddress)
      .filter(([key]) => key !== "landmark" && key !== "saveAddress")
      .every(([_, value]) => value);

  const isValidPredefinedPick =
    pickUpAddressType &&
    (pickUpAddressType !== "other" || pickUpAddressOtherAddressId);

  if (!isValidPredefinedPick && !isValidNewPickAddress) {
    error.push("Missing pick address details");
  }

  const isValidNewDropAddress =
    newDeliveryAddress &&
    Object.entries(newDeliveryAddress)
      .filter(([key]) => key !== "landmark" && key !== "saveAddress")
      .every(([_, value]) => value);

  const isValidPredefinedDrop =
    deliveryAddressType &&
    (deliveryAddressType !== "other" || deliveryAddressOtherAddressId);

  if (!isValidPredefinedDrop && !isValidNewDropAddress) {
    error.push("Missing drop address details");
  }

  if (!data.vehicleType) {
    error.push("Missing vehicle type");
  }
};

const validateCustomOrder = (data, role, error) => {
  if (!data.customerId) {
    if (
      !data.newCustomer ||
      Object.entries(data.newCustomer).some(([_, value]) => !value)
    ) {
      error.push("Missing customer details");
    }
  }

  if (!data.items || data.items.length === 0) {
    error.push("Add at-least one item");
  }

  if (
    data.items &&
    data.items.length &&
    data.items.some((item) => !item.itemName)
  ) {
    error.push("Item name missing in one or more items");
  }

  const {
    deliveryAddressType,
    deliveryAddressOtherAddressId,
    newDeliveryAddress,
  } = data;

  const isValidNewAddress =
    newDeliveryAddress &&
    Object.entries(newDeliveryAddress)
      .filter(([key]) => key !== "landmark" && key !== "saveAddress")
      .every(([_, value]) => value);

  const isValidPredefined =
    deliveryAddressType &&
    (deliveryAddressType !== "other" || deliveryAddressOtherAddressId);

  if (!isValidPredefined && !isValidNewAddress) {
    error.push("Missing drop address details");
  }
};
