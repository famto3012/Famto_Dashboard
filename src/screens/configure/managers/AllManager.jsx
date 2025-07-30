import Error from "@/components/others/Error";
import GlobalSearch from "@/components/others/GlobalSearch";
import Loader from "@/components/others/Loader";
import ShowSpinner from "@/components/others/ShowSpinner";
import { getAllGeofence } from "@/hooks/geofence/useGeofence";
import { fetchAllManagers, fetchAllRoles } from "@/hooks/manager/useManager";
import RenderIcon from "@/icons/RenderIcon";
import AddManager from "@/models/general/manager/AddManager";
import AddRole from "@/models/general/manager/AddRole";
import DeleteManager from "@/models/general/manager/DeleteManager";
import DeleteRole from "@/models/general/manager/DeleteRole";
import EditManager from "@/models/general/manager/EditManager";
import EditRole from "@/models/general/manager/EditRole";
import { Button, HStack, Table } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const AllManager = () => {
  const [filter, setFilter] = useState({
    geofence: [],
    name: "",
  });
  const [modal, setModal] = useState({
    addManager: false,
    editManager: false,
    deleteManager: false,
    addRole: false,
    editRole: false,
    deleteRole: false,
  });
  const [selectedId, setSelectedId] = useState(null);
  const [debounceName, setDebounceName] = useState("");

  const navigate = useNavigate();

  const {
    data: allGeofence,
    isLoading: geofenceLoading,
    isError: geofenceError,
  } = useQuery({
    queryKey: ["all-geofence"],
    queryFn: () => getAllGeofence(navigate),
  });

  const {
    data: allManager,
    isLoading: managerLoading,
    isError: managerError,
  } = useQuery({
    queryKey: ["all-managers", filter],
    queryFn: () => fetchAllManagers(filter, navigate),
  });

  const {
    data: roles,
    isLoading: roleLoading,
    isError: roleError,
  } = useQuery({
    queryKey: ["all-role"],
    queryFn: () => fetchAllRoles(navigate),
  });

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setFilter({ ...filter, name: debounceName });
    }, 500);

    return () => clearTimeout(timeOut);
  }, [debounceName]);

  const geofenceOptions = [
    { label: "Select All", value: "selectAll" },
    ...(Array.isArray(allGeofence)
      ? allGeofence?.map((geofence) => ({
          label: geofence.name,
          value: geofence._id,
        }))
      : []),
  ];

  const allGeofenceOptions = [
    { label: "All", value: "all" },
    ...(Array.isArray(allGeofence)
      ? allGeofence.map((geofence) => ({
          label: geofence.name,
          value: geofence._id,
        }))
      : []),
  ];

  const toggleModal = (type, id = null) => {
    setSelectedId(id);
    setModal({ ...modal, [type]: true });
  };

  const closeModal = () => {
    setSelectedId(null);
    setModal({
      addManager: false,
      editManager: false,
      deleteManager: false,
      addRole: false,
      editRole: false,
      deleteRole: false,
    });
  };

  const isManagerLoading = geofenceLoading || managerLoading;
  const isRoleLoading = geofenceLoading || roleLoading;

  const isManagerError = geofenceError || managerError;
  const isRoleError = geofenceLoading || roleError;

  return (
    <>
      <div className="bg-gray-100 min-h-full">
        <GlobalSearch />

        <div className="flex justify-between mt-[30px] px-5">
          <h1 className="font-bold text-[20px]"> Managers</h1>

          <Button
            onClick={() => toggleModal("addManager")}
            className="bg-teal-700 p-2 rounded-md text-white flex items-center gap-2"
          >
            <RenderIcon iconName="PlusIcon" />
            <span>Add Manager</span>
          </Button>
        </div>

        <div className="bg-white p-5 mx-5 mb-5 mt-5 rounded-lg flex justify-between">
          <div className="flex gap-10">
            <Select
              options={allGeofenceOptions}
              value={allGeofenceOptions.find(
                (option) => option.value === filter.geofence
              )}
              onChange={(option) =>
                setFilter({ ...filter, geofence: option.value })
              }
              className=" bg-cyan-50 min-w-[10rem]"
              placeholder="Geofence"
              isSearchable={false}
              isMulti={false}
              styles={{
                control: (provided) => ({
                  ...provided,
                  paddingRight: "",
                }),
                dropdownIndicator: (provided) => ({
                  ...provided,
                  padding: "10px",
                }),
              }}
            />
          </div>

          <div className="flex gap-4">
            <input
              type="search"
              name="search"
              placeholder="Search Manager Name"
              className="bg-gray-100 h-10 px-3 rounded-full text-sm outline-none focus:outline-none"
              value={debounceName}
              onChange={(e) => setDebounceName(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-auto h-[30rem]">
          <Table.Root className="mt-5 z-10 max-h-[30rem]" striped interactive>
            <Table.Header>
              <Table.Row className="bg-teal-700 h-14">
                {["Name", "Email", "Phone", "Role", "Geofence", "Action"].map(
                  (header, idx) => (
                    <Table.ColumnHeader
                      key={idx}
                      color="white"
                      textAlign="center"
                    >
                      {header}
                    </Table.ColumnHeader>
                  )
                )}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isManagerLoading ? (
                <Table.Row className="h-[70px]">
                  <Table.Cell colSpan={10} textAlign="center">
                    <ShowSpinner /> Loading...
                  </Table.Cell>
                </Table.Row>
              ) : allManager?.length === 0 ? (
                <Table.Row className="h-[70px]">
                  <Table.Cell colSpan={10} textAlign="center">
                    No Manager available
                  </Table.Cell>
                </Table.Row>
              ) : isManagerError ? (
                <Table.Row className="h-[70px]">
                  <Table.Cell colSpan={10} textAlign="center">
                    Error in fetching manager.
                  </Table.Cell>
                </Table.Row>
              ) : (
                allManager?.map((manager) => (
                  <Table.Row className={`h-[70px]`} key={manager.managerId}>
                    <Table.Cell textAlign="center">{manager.name}</Table.Cell>
                    <Table.Cell textAlign="center">{manager.email}</Table.Cell>
                    <Table.Cell textAlign="center">{manager.phone}</Table.Cell>
                    <Table.Cell textAlign="center">{manager.role}</Table.Cell>
                    <Table.Cell textAlign="center">
                      {Array.isArray(manager?.geofence) ? (
                        manager.geofence.map((geofence, index) => (
                          <span key={index} className="flex flex-col">
                            {geofence}
                            {index < manager.geofence.length - 1 && ", "}
                          </span>
                        ))
                      ) : (
                        <span>-</span>
                      )}
                    </Table.Cell>

                    <Table.Cell textAlign="center">
                      <HStack
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        gap={5}
                      >
                        <Button
                          onClick={() =>
                            toggleModal("editManager", manager.managerId)
                          }
                          className="text-gray-600 p-2"
                        >
                          <RenderIcon
                            iconName="EditIcon"
                            size={20}
                            loading={6}
                          />
                        </Button>

                        <span
                          onClick={() =>
                            toggleModal("deleteManager", manager.managerId)
                          }
                          className="text-red-500"
                        >
                          <RenderIcon
                            iconName="DeleteIcon"
                            size={24}
                            loading={6}
                          />
                        </span>
                      </HStack>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </div>

        <div className="flex justify-between mt-[30px] px-5">
          <h1 className="font-bold text-[20px]">Roles</h1>

          <Button
            onClick={() => toggleModal("addRole")}
            className="bg-teal-700 p-2 rounded-md text-white flex items-center gap-2"
          >
            <RenderIcon iconName="PlusIcon" />
            <span>Add Roles</span>
          </Button>
        </div>

        <div className="overflow-auto h-[30rem]">
          <Table.Root className="mt-5 z-10 max-h-[30rem]" striped interactive>
            <Table.Header>
              <Table.Row className="bg-teal-700 h-14">
                {["Domain", "Allowed Routes", "Action"].map((header, idx) => (
                  <Table.ColumnHeader
                    key={idx}
                    color="white"
                    textAlign="center"
                  >
                    {header}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isRoleLoading ? (
                <Table.Row className="h-[70px]">
                  <Table.Cell colSpan={10} textAlign="center">
                    <ShowSpinner /> Loading...
                  </Table.Cell>
                </Table.Row>
              ) : roles?.length === 0 ? (
                <Table.Row className="h-[70px]">
                  <Table.Cell colSpan={10} textAlign="center">
                    No Roles Available
                  </Table.Cell>
                </Table.Row>
              ) : isRoleError ? (
                <Table.Row className="h-[70px]">
                  <Table.Cell colSpan={10} textAlign="center">
                    Error in roles.
                  </Table.Cell>
                </Table.Row>
              ) : (
                roles?.map((role) => (
                  <Table.Row className={`h-[70px]`} key={role.roleId}>
                    <Table.Cell textAlign="center">{role.roleName}</Table.Cell>
                    <Table.Cell textAlign="center">
                      {role?.allowedRoutes?.map((route, index) => (
                        <span key={index} className="flex flex-col">
                          {route.label}
                          {index < role?.allowedRoutes.length - 1 && ", "}
                        </span>
                      ))}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <HStack
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        gap={5}
                      >
                        <Button
                          onClick={() => toggleModal("editRole", role.roleId)}
                          className="text-gray-600"
                        >
                          <RenderIcon
                            iconName="EditIcon"
                            size={20}
                            loading={6}
                          />
                        </Button>

                        <span
                          onClick={() => toggleModal("deleteRole", role.roleId)}
                          className="text-red-500"
                        >
                          <RenderIcon
                            iconName="DeleteIcon"
                            size={24}
                            loading={6}
                          />
                        </span>
                      </HStack>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </div>
      </div>

      <AddManager
        isOpen={modal.addManager}
        onClose={closeModal}
        geofenceOptions={geofenceOptions}
        allGeofence={allGeofence}
      />
      <EditManager
        isOpen={modal.editManager}
        onClose={closeModal}
        managerId={selectedId}
        geofenceOptions={geofenceOptions}
        allGeofence={allGeofence}
      />
      <DeleteManager
        isOpen={modal.deleteManager}
        onClose={closeModal}
        managerId={selectedId}
      />

      <AddRole isOpen={modal.addRole} onClose={closeModal} />
      <EditRole
        isOpen={modal.editRole}
        onClose={closeModal}
        roleId={selectedId}
      />

      <DeleteRole
        isOpen={modal.deleteRole}
        onClose={closeModal}
        roleId={selectedId}
      />
    </>
  );
};

export default AllManager;
