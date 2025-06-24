import GlobalSearch from "@/components/others/GlobalSearch";
import AppAdBanner from "@/components/adBanner/AppAdBanner";
import IndividualBanner from "@/components/adBanner/IndividualBanner";

const AdBanner = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <GlobalSearch />

      <div className="flex items-center justify-between mt-5 px-4 sm:px-4">
        <h1 className="text-base sm:text-lg font-bold outline-none focus:outline-none">
          Ad Banner
        </h1>
      </div>

      <p className="mt-5 text-sm sm:text-base text-gray-500 px-4 sm:px-4">
        The purpose of a promotional banner is to promote a store. It can be
        used to display offers, new
        <span className="block">available items or discounts, etc.</span>
      </p>

      <AppAdBanner />

      <IndividualBanner />
    </div>
  );
};

export default AdBanner;
