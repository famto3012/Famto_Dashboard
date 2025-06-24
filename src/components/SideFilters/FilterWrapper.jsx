import RenderIcon from "@/icons/RenderIcon";
import { Button } from "@chakra-ui/react";

const FilterWrapper = ({ filterOpen, setFilterOpen, children }) => {
  return (
    <>
      {filterOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-40"
          onClick={() => setFilterOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 w-[250px] min-h-full bg-white shadow-lg transform ${
          filterOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 px-[20px]`}
      >
        <Button
          onClick={() => setFilterOpen(false)}
          className="mb-[20px] flex justify-start mt-[20px]"
        >
          <RenderIcon iconName="CloseIcon" size={20} loading={6} />
        </Button>

        {children}
      </div>
    </>
  );
};

export default FilterWrapper;
