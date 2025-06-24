import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDraggable } from "@/hooks/useDraggable";

import { searchProductToOrder } from "@/hooks/order/useOrder";
import { useQuery } from "@tanstack/react-query";
import RenderIcon from "@/icons/RenderIcon";
import ShowSpinner from "@/components/others/ShowSpinner";

const SelectProduct = ({ merchantId, categoryId, onProductSelect }) => {
  const [search, setSearch] = useState("");
  const [debounce, setDebounce] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["search-product-for-order", search],
    queryFn: () =>
      searchProductToOrder(merchantId, categoryId, search, navigate),
    enabled: !!search,
  });

  useEffect(() => {
    if (data) setAllProducts(data);
  }, [data]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(debounce);
    }, 500);

    return () => clearTimeout(handler);
  }, [debounce]);

  useEffect(() => {
    const formattedItems = selectedItems.map((item) => {
      const selectedVariant = item.variants
        .flatMap((variant) => variant.variantTypes)
        .find((type) => type.id === item.selectedVariantId);

      const price = selectedVariant ? selectedVariant.price : item.price;

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: price,
        variantTypeId: item.selectedVariantId || null,
      };
    });

    onProductSelect(formattedItems);
  }, [selectedItems]);

  const selectProduct = (product) => {
    const existingProductIndex = selectedItems.findIndex(
      (item) => item.productId === product.id
    );

    if (existingProductIndex !== -1) {
      const updatedItems = [...selectedItems];
      updatedItems[existingProductIndex].quantity += 1;
      setSelectedItems(updatedItems);
    } else {
      const newProduct = {
        productName: product.productName,
        productId: product.id,
        price: product.price,
        quantity: 1,
        variants: product.variants.map((variant) => ({
          variantName: variant.variantName,
          variantTypes: variant.variantTypes.map((type) => ({
            typeName: type.typeName,
            price: type.price,
            id: type.id,
          })),
        })),
      };

      setSelectedItems([...selectedItems, newProduct]);
    }

    setAllProducts([]);
    setDebounce("");
  };

  const handleVariantChange = (productId, variantId) => {
    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId
          ? { ...item, selectedVariantId: variantId }
          : item
      )
    );
  };

  const decreaseQuantity = (productId, e) => {
    e.preventDefault();
    setSelectedItems((prevItems) =>
      prevItems
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const increaseQuantity = (productId, e) => {
    e.preventDefault();
    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center relative gap-[20px] md:gap-0">
        <label className="md:w-1/3 md:px-6 text-gray-500" htmlFor="product">
          Select Product
        </label>
        <div className="relative md:w-1/2 z-30">
          <input
            type="text"
            name="product"
            id="product"
            placeholder="Product"
            className="h-10 ps-3 text-sm border-2 w-full outline-none focus:outline-none rounded-md"
            value={debounce}
            onChange={(e) => setDebounce(e.target.value)}
          />

          {isLoading ? (
            <ShowSpinner className="absolute top-[20%] right-[10px]" />
          ) : (
            <span className="text-gray-500 absolute top-[30%] right-[10px]">
              <RenderIcon iconName="SearchIcon" size={20} loading={6} />
            </span>
          )}

          {allProducts?.length > 0 && (
            <ul className="absolute bg-white border w-full mt-1 z-50 max-h-[20rem] overflow-auto">
              {allProducts?.map((data) => (
                <li
                  key={data.id}
                  className="p-2 py-3 hover:bg-gray-200 cursor-pointer"
                  onClick={() => selectProduct(data)}
                >
                  {data?.productName}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div
        className={`${selectedItems.length === 0 ? "hidden" : `flex flex-col md:flex-row md:items-start gap-[20px] md:gap-0`} `}
      >
        <label className="md:w-1/3 md:px-6 text-gray-500">
          Selected Products
        </label>
        <div className="relative w-full md:w-[50%] flex gap-4 flex-wrap ">
          {selectedItems?.map((item) => (
            <div
              key={item.productId}
              className="flex w-full items-center justify-between gap-3 py-2 bg-gray-100 p-3 border-2 border-gray-300 rounded-md"
            >
              <div>
                <p className="text-gray-600 mb-2 w-[120px] truncate">
                  {item.productName}
                </p>
                <p className="text-gray-600">
                  {item.variants.length === 0 ? `₹${item.price}` : ""}
                </p>

                {item?.variants?.length > 0 && (
                  <div>
                    <select
                      className="outline-none focus:outline-none bg-white p-2"
                      value={item?.selectedVariantId || ""}
                      onChange={(e) =>
                        handleVariantChange(item.productId, e.target.value)
                      }
                    >
                      {item.variants.flatMap((variant) =>
                        variant.variantTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {variant.variantName} - {type.typeName} - ₹
                            {type.price}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex items-center  bg-white">
                <button
                  className="text-black bg-gray-300 px-2 rounded-md h-[40px] w-[40px] flex items-center justify-center"
                  onClick={(e) => decreaseQuantity(item.productId, e)}
                >
                  <RenderIcon iconName="MinusIcon" size={16} />
                </button>
                <span className="mx-2">{item.quantity}</span>
                <button
                  className="text-black bg-gray-300 px-2 rounded-md h-[40px] w-[40px] flex items-center justify-center"
                  onClick={(e) => increaseQuantity(item.productId, e)}
                >
                  <RenderIcon iconName="PlusIcon" size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SelectProduct;
