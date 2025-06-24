import { createContext, useState } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [pickAddressType, setPickAddressType] = useState(null);
  const [pickAddressId, setPickAddressId] = useState(null);
  const [waId, setWaId] = useState(null);
  const [name, setName] = useState(null);
  const [deliveryAddressType, setDeliveryAddressType] = useState(null);
  const [deliveryAddressId, setDeliveryAddressId] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState({});
  const [selectedProduct, setSelectedProduct] = useState({});

  return (
    <DataContext.Provider
      value={{
        pickAddressType,
        setPickAddressType,
        pickAddressId,
        setPickAddressId,
        deliveryAddressType,
        setDeliveryAddressType,
        deliveryAddressId,
        setDeliveryAddressId,
        selectedCategory,
        setSelectedCategory,
        selectedProduct,
        setSelectedProduct,
        waId,
        setWaId,
        name,
        setName,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
