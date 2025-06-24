import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Switch } from "@/components/ui/switch";
import { toaster } from "@/components/ui/toaster";

import GlobalSearch from "@/components/others/GlobalSearch";
import ShowSpinner from "@/components/others/ShowSpinner";

import RenderIcon from "@/icons/RenderIcon";

import { fetchAllTax, toggleTaxStatus } from "@/hooks/tax/useTax";

import EditTax from "@/models/configure/tax/EditTax";
import AddTax from "@/models/configure/tax/AddTax";
import DeleteTax from "@/models/configure/tax/DeleteTax";

const Tax = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedTax, setSelectedTax] = useState(null);
  const [modal, setModal] = useState({
    add: false,
    edit: false,
    delete: false,
  });

  const {
    data: allTax,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["all-tax"],
    queryFn: () => fetchAllTax(navigate),
  });

  const toggleStatus = useMutation({
    mutationKey: ["toggleTax"],
    mutationFn: (taxId) => toggleTaxStatus(taxId, navigate),
    onMutate: (taxId) => setSelectedTax(taxId),
    onSuccess: () => {
      setSelectedTax(null);
      queryClient.invalidateQueries(["all-tax"]);
      toaster.create({
        title: "Success",
        description: "Tax status updated successfully",
        type: "success",
      });
    },
    onError: () => {
      setSelectedTax(null);
      toaster.create({
        title: "Error",
        description: "Error while updating tax status",
        type: "error",
      });
    },
  });

  const toggleAdd = () => {
    setModal((prev) => ({ ...prev, add: true }));
  };

  const toggleEdit = (taxId) => {
    setSelectedTax(taxId), setModal((prev) => ({ ...prev, edit: true }));
  };

  const toggleDelete = (taxId) => {
    setSelectedTax(taxId), setModal((prev) => ({ ...prev, delete: true }));
  };

  const closeModal = () => {
    setSelectedTax(null), setModal({ add: false, edit: false, delete: false });
  };

  if (isError) return <div>Error in fetching tax</div>;

  return (
    <div className="bg-gray-100 h-full">
      <GlobalSearch />

      <div className="flex justify-between mt-5 mx-5">
        <h1 className="font-bold text-xl sm:text-2xl md:text-2xl">Tax</h1>

        <button
          onClick={() => toggleAdd()}
          className="bg-teal-700 text-white px-3 rounded-lg p-2 flex items-center gap-2"
        >
          <RenderIcon iconName="PlusIcon" size={18} loading={6} />{" "}
          <span>Add Tax</span>
        </button>
      </div>
      <p className="ms-5 mt-8 text-gray-500">
        Make sure that taxes aren't duplicated under the same name on the
        platform.
        <span className="text-red-700">
          Two taxes under the same name cannot coexist.
        </span>
      </p>
      <div className="w-full overflow-x-auto">
        <table className="bg-white mt-[45px] text-center w-full">
          <thead className="sticky top-0 left-0 z-20">
            <tr>
              {[
                "Tax name",
                "Tax",
                "Fixed/Percentage",
                "Assign to Business category",
                "Geofence",
                "Status",
              ].map((header) => (
                <th
                  key={header}
                  className="bg-teal-800 text-center h-[70px] text-white text-sm sm:text-base"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white">
            {isLoading && (
              <tr>
                <td colSpan={6} className="text-center text-[16px] py-6">
                  <ShowSpinner /> Loading Data
                </td>
              </tr>
            )}

            {!isLoading && allTax?.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-3">
                  No Data available
                </td>
              </tr>
            )}

            {!isLoading &&
              allTax?.map((tax) => (
                <tr
                  key={tax?.taxId}
                  className="even:bg-gray-200 last:border-b max-h-[30rem] overflow-y-auto"
                >
                  <td className="py-2 px-4">{tax?.taxName}</td>
                  <td className="py-2 px-4">{tax?.tax}</td>
                  <td className="py-2 px-4">{tax?.taxType}</td>
                  <td className="py-2 px-4">{tax?.assignToBusinessCategory}</td>
                  <td className="py-2 px-4">
                    {tax?.geofences?.map((geofence, index) => (
                      <span key={index} className="flex flex-col">
                        {geofence}
                        {index < tax.geofences.length - 1 && ", "}
                      </span>
                    ))}
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex justify-center items-center gap-4">
                      {toggleStatus.isLoading && selectedTax === tax?.taxId ? (
                        <ShowSpinner />
                      ) : (
                        <Switch
                          className="text-teal-700 mt-2 z-10"
                          checked={tax?.status}
                          onChange={() => toggleStatus.mutate(tax?.taxId)}
                          colorPalette="teal"
                        />
                      )}
                      <button
                        onClick={() => toggleEdit(tax?.taxId)}
                        className="text-gray-600"
                      >
                        <RenderIcon iconName="EditIcon" size={20} loading={6} />
                      </button>
                      <button
                        onClick={() => toggleDelete(tax?.taxId)}
                        className="outline-none focus:outline-none text-red-500"
                      >
                        <RenderIcon
                          iconName="DeleteIcon"
                          size={24}
                          loading={6}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <AddTax isOpen={modal.add} onClose={closeModal} />
      <EditTax isOpen={modal.edit} taxId={selectedTax} onClose={closeModal} />
      <DeleteTax
        isOpen={modal.delete}
        taxId={selectedTax}
        onClose={closeModal}
      />
    </div>
  );
};

export default Tax;
