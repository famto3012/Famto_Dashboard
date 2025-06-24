import GlobalSearch from "@/components/others/GlobalSearch";

import Service from "@/components/customerAppCustomization/Service";
import Toggles from "@/components/customerAppCustomization/Toggles";
import BusinessCategory from "@/components/customerAppCustomization/BusinessCategory";
import CustomOrderBanner from "@/components/customerAppCustomization/CustomOrderBanner";
import PickAndDropBanner from "@/components/customerAppCustomization/PickAndDropBanner";

const CustomerApp = () => {
  return (
    <div className="bg-gray-100 min-h-full min-w-full pb-[50px]">
      <GlobalSearch />

      <Toggles />

      <Service />

      <BusinessCategory />

      <CustomOrderBanner />

      <PickAndDropBanner />
    </div>
  );
};

export default CustomerApp;
