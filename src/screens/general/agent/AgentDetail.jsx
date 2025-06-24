import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Table } from "@chakra-ui/react";

import { Switch } from "@/components/ui/switch";
import { toaster } from "@/components/ui/toaster";

import GlobalSearch from "@/components/others/GlobalSearch";
import Loader from "@/components/others/Loader";
import Error from "@/components/others/Error";

import { fetchSingleAgent, updateAgentStatus } from "@/hooks/agent/useAgent";

import RenderIcon from "@/icons/RenderIcon";

import AgentRatings from "@/models/general/agent/AgentRatings";
import EditAgent from "@/models/general/agent/EditAgent";
import BlockAgent from "@/models/general/agent/BlockAgent";
import EditAgentVehicle from "@/models/general/agent/EditAgentVehicle";
import EnlargeImage from "@/models/common/EnlargeImage";

const AgentDetail = () => {
  const [modal, setModal] = useState({
    edit: false,
    rating: false,
    block: false,
    vehicle: false,
    enlarge: false,
  });
  const [vehicleData, setVehicleData] = useState({});
  const [imageLink, setImageLink] = useState(null);

  const { agentId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["agent-detail", agentId],
    queryFn: () => fetchSingleAgent(agentId, navigate),
  });

  const toggleAgentStatus = useMutation({
    mutationKey: ["toggle-agent-status"],
    mutationFn: () => updateAgentStatus(agentId, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["agent-detail", agentId]);
      toaster.create({
        title: "Success",
        description: "Agent status updated successfully",
        type: "success",
      });
    },
    onError: (data) => {
      toaster.create({
        title: "Error",
        description: data.message || "Error in updating agent status",
        type: "error",
      });
    },
  });

  const toggleModal = (type, data = {}, link) => {
    setVehicleData(data);
    setImageLink(link);
    setModal({ ...modal, [type]: true });
  };

  const closeModal = () => {
    setVehicleData({});
    setImageLink(null);
    setModal({
      edit: false,
      rating: false,
      block: false,
      vehicle: false,
      enlarge: false,
    });
  };

  if (isLoading) return <Loader />;
  if (isError) return <Error />;

  return (
    <div className="bg-gray-100 min-h-full min-w-full">
      <GlobalSearch />

      <div className="flex flex-col md:flex-row md:items-center justify-between my-[30px] mx-5 gap-[20px] md:gap-0">
        <Link
          to="/agent"
          className="font-[600] text-[18px] flex items-center gap-3"
        >
          <RenderIcon iconName="LeftArrowIcon" size={16} loading={6} />
          Agent ID <span className="text-red-600">#{data.agentId}</span>
        </Link>

        <div className="flex items-center justify-between md:justify-start gap-3">
          {!data?.isBlocked && (
            <button
              className="bg-yellow-100 py-2 px-5 p-1 rounded-xl flex items-center gap-2"
              onClick={() => toggleModal("block")}
            >
              <span className="text-red-500">
                <RenderIcon iconName="BlockIcon" size={18} loading={6} />
              </span>
              <span>Block</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <span>Status</span>
            <Switch
              disabled={toggleAgentStatus.isPending}
              colorPalette="teal"
              checked={data.status}
              onCheckedChange={() => toggleAgentStatus.mutate()}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg mx-5 mt-5 p-5">
        <div className="flex flex-col md:flex-row gap-10 justify-between">
          <div className="md:w-1/2 ">
            <div className="flex items-center">
              <label className="w-1/3 text-gray-400">Full name</label>
              <p className="w-2/3 font-[500]">{data.fullName}</p>
            </div>
            <div className="flex items-center mt-5">
              <label className="w-1/3 text-gray-400">Email</label>
              <p className="w-2/3 font-[500]">{data.email}</p>
            </div>
          </div>

          <div className="md:w-1/2">
            <div className="flex items-center gap-2 ">
              <label className="w-2/3 text-gray-400">Phone Number</label>
              <p className="w-2/3 font-[500]">{data.phoneNumber}</p>
            </div>
            <div className="flex items-center gap-3 mt-5">
              <label className="w-2/3 text-gray-400">Registration Status</label>
              <p
                className={`${
                  data.approvalStatus === "Approved"
                    ? "text-green-500"
                    : "text-red-500"
                }  w-2/3 font-[500]`}
              >
                {data.approvalStatus}
              </p>
            </div>
          </div>

          <div>
            <figure
              className="h-20 w-20"
              onClick={() => toggleModal("enlarge", undefined, data.agentImage)}
            >
              <img
                className="w-full h-full object-cover rounded-md"
                src={data.agentImage}
              />
            </figure>
          </div>

          <div>
            <button
              className="bg-gray-100 text-black py-2 px-3 focus:outline-none rounded-lg flex items-center gap-2 w-full md:w-fit justify-center "
              onClick={() => toggleModal("edit")}
            >
              <RenderIcon iconName="EditIcon" size={16} loading={6} />
              <span>Edit</span>
            </button>
          </div>
        </div>

        <div className="mb-[20px] lg:w-[600px] flex items-center justify-between mt-9 gap-[30px]">
          <label className="text-gray-700 font-semibold text-[18px]">
            Ratings
          </label>

          <button
            type="button"
            onClick={() => toggleModal("rating")}
            className="bg-teal-700 text-white p-2 rounded-md w-[20rem]"
          >
            Show ratings and reviews
          </button>
        </div>
      </div>

      <h1 className="font-semibold text-[18px] ml-5 my-5">Vehicle Details</h1>

      <div className="overflow-x-auto">
        <Table.Root striped interactive stickyHeader>
          <Table.Header>
            <Table.Row className="bg-teal-700 h-14">
              {[
                "License Plate",
                "Vehicle Model",
                "Type of Vehicle",
                "RC front",
                "Rc back",
                "Action",
              ].map((header, index) => (
                <Table.ColumnHeader
                  key={index}
                  color="white"
                  textAlign="center"
                >
                  {header}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data?.vehicleDetail?.map((item) => (
              <Table.Row key={item.vehicleId} className={`h-[70px]`}>
                <Table.Cell textAlign="center">{item.licensePlate}</Table.Cell>
                <Table.Cell textAlign="center">{item.model}</Table.Cell>
                <Table.Cell textAlign="center">{item.type}</Table.Cell>
                <Table.Cell textAlign="center">
                  <div className="w-full flex justify-center">
                    <figure
                      onClick={() =>
                        toggleModal("enlarge", undefined, item.rcFrontImage)
                      }
                      className="h-24 w-24"
                    >
                      <img
                        src={item.rcFrontImage}
                        alt="RC Front image"
                        className="w-full h-full object-contain"
                      />
                    </figure>
                  </div>
                </Table.Cell>
                <Table.Cell textAlign="center">
                  <div className="w-full flex justify-center">
                    <figure
                      onClick={() =>
                        toggleModal("enlarge", undefined, item.rcBackImage)
                      }
                      className="h-24 w-24"
                    >
                      <img
                        src={item.rcBackImage}
                        alt="RC Back image"
                        className="w-full h-full object-contain"
                      />
                    </figure>
                  </div>
                </Table.Cell>
                <Table.Cell textAlign="center">
                  <span
                    onClick={() => toggleModal("vehicle", item)}
                    className="flex items-center justify-center text-gray-500"
                  >
                    <RenderIcon iconName="EditIcon" size={24} loading={6} />
                  </span>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </div>

      <h1 className="font-semibold text-[18px] ml-5 my-5">
        Government Certificates
      </h1>

      <div className="overflow-x-auto">
        <Table.Root>
          <Table.Header>
            <Table.Row className="bg-teal-700 h-14">
              {[
                "Aadhar Number",
                "Aadhar Front Side",
                "Aadhar Back Side",
                "Driving License Number",
                "License Front Side",
                "License Back Side",
              ].map((header, index) => (
                <Table.ColumnHeader
                  key={index}
                  color="white"
                  textAlign="center"
                >
                  {header}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row className={`h-[70px]`}>
              <Table.Cell textAlign="center">
                {data?.governmentCertificateDetail?.aadharNumber}
              </Table.Cell>
              <Table.Cell textAlign="center">
                <div className="w-full flex justify-center">
                  <figure
                    onClick={() =>
                      toggleModal(
                        "enlarge",
                        undefined,
                        data?.governmentCertificateDetail?.aadharFrontImage
                      )
                    }
                    className="h-24 w-24"
                  >
                    <img
                      src={data?.governmentCertificateDetail?.aadharFrontImage}
                      alt="Aadhar Front"
                      className="w-full h-full object-contain"
                    />
                  </figure>
                </div>
              </Table.Cell>
              <Table.Cell textAlign="center">
                <div className="w-full flex justify-center">
                  <figure
                    onClick={() =>
                      toggleModal(
                        "enlarge",
                        undefined,
                        data?.governmentCertificateDetail?.aadharBackImage
                      )
                    }
                    className="h-24 w-24"
                  >
                    <img
                      src={data?.governmentCertificateDetail?.aadharBackImage}
                      alt="Aadhar Back"
                      className="w-full h-full object-contain"
                    />
                  </figure>
                </div>
              </Table.Cell>
              <Table.Cell textAlign="center">
                {data?.governmentCertificateDetail?.drivingLicenseNumber}
              </Table.Cell>
              <Table.Cell textAlign="center">
                <div className="w-full flex justify-center">
                  <figure
                    onClick={() =>
                      toggleModal(
                        "enlarge",
                        undefined,
                        data?.governmentCertificateDetail
                          ?.drivingLicenseFrontImage
                      )
                    }
                    className="h-24 w-24"
                  >
                    <img
                      src={
                        data?.governmentCertificateDetail
                          ?.drivingLicenseFrontImage
                      }
                      alt="Driving License Front"
                      className="w-full h-full object-contain"
                    />
                  </figure>
                </div>
              </Table.Cell>
              <Table.Cell textAlign="center">
                <div className="w-full flex items-center">
                  <figure
                    onClick={() =>
                      toggleModal(
                        "enlarge",
                        undefined,
                        data?.governmentCertificateDetail
                          ?.drivingLicenseBackImage
                      )
                    }
                    className="h-24 w-24"
                  >
                    <img
                      src={
                        data?.governmentCertificateDetail
                          ?.drivingLicenseBackImage
                      }
                      alt="Driving License Back"
                      className="w-full h-full object-contain"
                    />
                  </figure>
                </div>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </div>

      <h1 className="font-semibold text-[18px] ml-5 my-5">Bank Details</h1>

      <div className="overflow-x-auto">
        <Table.Root>
          <Table.Header>
            <Table.Row className="bg-teal-700 h-14">
              {[
                "Account Holder Name",
                "Account Number",
                "IFSC code",
                "UPI ID",
              ].map((header, index) => (
                <Table.ColumnHeader
                  key={index}
                  color="white"
                  textAlign="center"
                >
                  {header}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row className={`h-[70px]`}>
              <Table.Cell textAlign="center">
                {data?.bankDetail?.accountHolderName}
              </Table.Cell>
              <Table.Cell textAlign="center">
                {data?.bankDetail?.accountNumber}
              </Table.Cell>
              <Table.Cell textAlign="center">
                {data?.bankDetail?.IFSCCode}
              </Table.Cell>
              <Table.Cell textAlign="center">
                {data?.bankDetail?.UPIId}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </div>

      <h1 className="font-semibold text-[18px] ml-5 my-5">Work Structure</h1>

      <div className="overflow-x-auto">
        <Table.Root>
          <Table.Header>
            <Table.Row className="bg-teal-700 h-14">
              {["Manager", "Geofence", "Salary Structure", "Tags"].map(
                (header, index) => (
                  <Table.ColumnHeader
                    key={index}
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
            <Table.Row className={`h-[70px]`}>
              <Table.Cell textAlign="center">
                {data?.workStructure?.manager}
              </Table.Cell>
              <Table.Cell textAlign="center">{data?.geofence}</Table.Cell>
              <Table.Cell textAlign="center">
                {data?.workStructure?.salaryStructure}
              </Table.Cell>
              <Table.Cell textAlign="center">
                {data?.workStructure?.tag}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </div>

      <h1 className="font-semibold text-[18px] ml-5 my-5">Agent Activity</h1>

      <div className="mb-[100px] overflow-auto max-h-[30rem]">
        <Table.Root>
          <Table.Header>
            <Table.Row className="bg-teal-700 h-14">
              {["Date", "Time", "Description"].map((header, index) => (
                <Table.ColumnHeader
                  key={index}
                  color="white"
                  textAlign="center"
                >
                  {header}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data?.activityLog?.map((log) => (
              <Table.Row className={`h-[70px]`}>
                <Table.Cell textAlign="center">{log.date}</Table.Cell>
                <Table.Cell textAlign="center">{log.time}</Table.Cell>
                <Table.Cell textAlign="center">{log.description}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </div>

      {/* ============================== */}
      {/* ============Modals============ */}
      {/* ============================== */}
      <AgentRatings
        isOpen={modal.rating}
        onClose={closeModal}
        agentId={agentId}
      />

      <EditAgent isOpen={modal.edit} onClose={closeModal} data={data} />
      <BlockAgent isOpen={modal.block} onClose={closeModal} agentId={agentId} />
      <EditAgentVehicle
        isOpen={modal.vehicle}
        onClose={closeModal}
        data={vehicleData}
        agentId={data.agentId}
      />
      <EnlargeImage
        isOpen={modal.enlarge}
        onClose={closeModal}
        source={imageLink}
      />
    </div>
  );
};

export default AgentDetail;
