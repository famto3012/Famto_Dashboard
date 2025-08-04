import AuthContext from "@/context/AuthContext";
import { Table } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

const Details = ({ data }) => {
  const {
    customerDetail,
    merchantDetail,
    deliveryAgentDetail,
    detailAddedByAgent,
  } = data;
  const { role } = useContext(AuthContext);

  const agentTableHeaders = [
    "Agent Id",
    "Name",
    "Team Name",
    "Instruction by Customer",
    "Time taken",
    "Distance travelled",
    "Delayed by",
  ];

  const detailAddedByAgentHeaders = ["Notes", "Signature Image", "Images"];

  if (role !== "Merchant") {
    agentTableHeaders.push("Earning");
  }

  const [openImage, setOpenImage] = useState(null); // URL of the image to show

  const handleImageClick = (url) => {
    setOpenImage(url);
  };

  const closeModal = () => setOpenImage(null);

  return (
    <>
      <div className="mt-10">
        <h1 className="text-[18px] font-semibold ml-5 mb-5">
          Customer Details
        </h1>

        <div className=" overflow-x-auto">
          <Table.Root size="lg">
            <Table.Header>
              <Table.Row className="bg-teal-700 h-[70px]" textAlign="center">
                {[
                  "Customer Id",
                  "Name",
                  "Email",
                  "Phone",
                  "Pick Address",
                  "Drop Address",
                  "Ratings to Delivery Agent",
                  "Rating by Delivery Agent",
                ].map((header) => (
                  <Table.ColumnHeader color="white" textAlign="center">
                    {header}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row className="h-[70px]">
                <Table.Cell textAlign="center">
                  <Link
                    to={`/customer/${customerDetail._id}`}
                    className="underline underline-offset-2 cursor-pointer"
                  >
                    {customerDetail._id}
                  </Link>
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {customerDetail.name}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {customerDetail.email}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {customerDetail.phone}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  <p> {customerDetail?.pickAddress?.fullName}</p>
                  <p> {customerDetail?.pickAddress?.flat}</p>
                  <p> {customerDetail?.pickAddress?.area}</p>
                  <p> {customerDetail?.pickAddress?.landmark}</p>
                  <p> {customerDetail?.pickAddress?.phoneNumber}</p>
                </Table.Cell>
                <Table.Cell textAlign="center">
                  <p> {customerDetail?.dropAddress?.fullName}</p>
                  <p> {customerDetail?.dropAddress?.flat}</p>
                  <p> {customerDetail?.dropAddress?.area}</p>
                  <p> {customerDetail?.dropAddress?.landmark}</p>
                  <p> {customerDetail?.dropAddress?.phoneNumber}</p>
                </Table.Cell>
                <Table.Cell textAlign="center">
                  <p> {customerDetail.ratingsToDeliveryAgent.rating}</p>
                  <p> {customerDetail.ratingsToDeliveryAgent.review}</p>
                </Table.Cell>
                <Table.Cell textAlign="center">
                  <p> {customerDetail.ratingsByDeliveryAgent.rating}</p>
                  <p> {customerDetail.ratingsByDeliveryAgent.review}</p>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </div>
      </div>

      <div className="mt-10">
        <h1 className="text-[18px] font-semibold ml-5 mb-5">
          Merchant Details
        </h1>

        <div className=" overflow-x-auto">
          <Table.Root size="lg">
            <Table.Header>
              <Table.Row className="bg-teal-700 h-[70px]" textAlign="center">
                {[
                  "Merchant Id",
                  "Name",
                  "Instructions by Customer",
                  "Merchant Earnings",
                  "Famto Earnings",
                ].map((header) => (
                  <Table.ColumnHeader color="white" textAlign="center">
                    {header}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row className="h-[70px]">
                <Table.Cell textAlign="center">
                  <Link
                    to={`/merchant/${merchantDetail._id}`}
                    className="underline underline-offset-2 cursor-pointer"
                  >
                    {merchantDetail._id}
                  </Link>
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {merchantDetail.name}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {merchantDetail.instructionsByCustomer || "-"}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {merchantDetail.merchantEarnings}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {merchantDetail.famtoEarnings}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </div>
      </div>

      <div className="mt-10">
        <h1 className="text-[18px] font-semibold ml-5 mb-5">
          Delivery Agent Details
        </h1>

        <div className=" overflow-x-auto">
          <Table.Root size="lg">
            <Table.Header>
              <Table.Row className="bg-teal-700 h-[70px]" textAlign="center">
                {agentTableHeaders.map((header) => (
                  <Table.ColumnHeader color="white" textAlign="center">
                    {header}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row className="h-[70px]">
                <Table.Cell textAlign="center">
                  <Link
                    to={`/agent/${deliveryAgentDetail._id}`}
                    className="underline underline-offset-2 cursor-pointer"
                  >
                    {deliveryAgentDetail._id}
                  </Link>
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {deliveryAgentDetail.name}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {deliveryAgentDetail.team}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {deliveryAgentDetail.instructionsByCustomer}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {deliveryAgentDetail.timeTaken}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {deliveryAgentDetail?.distanceTravelled === "-"
                    ? "-"
                    : deliveryAgentDetail?.distanceTravelled?.toFixed(2)}{" "}
                  km
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {deliveryAgentDetail.delayedBy}
                </Table.Cell>
                {role !== "Merchant" && (
                  <Table.Cell textAlign="center">
                    {deliveryAgentDetail?.orderEarning || "0.00"}
                  </Table.Cell>
                )}
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </div>
      </div>
      <div className="mt-10">
        <h1 className="text-[18px] font-semibold ml-5 mb-5">
          Details Added by Agent
        </h1>

        <div className=" overflow-x-auto">
          <Table.Root size="lg">
            <Table.Header>
              <Table.Row className="bg-teal-700 h-[70px]" textAlign="center">
                {detailAddedByAgentHeaders.map((header) => (
                  <Table.ColumnHeader color="white" textAlign="center">
                    {header}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row className="h-[70px]">
                <Table.Cell className="text-center align-middle">
                  {detailAddedByAgent.notes || "-"}
                </Table.Cell>

                <Table.Cell className="text-center align-middle">
                  {detailAddedByAgent.signatureImageURL ? (
                    <div className="flex justify-center">
                      <img
                        src={detailAddedByAgent.signatureImageURL}
                        className="w-[200px] h-[80px] object-contain"
                        alt="Signature"
                        onClick={() =>
                          handleImageClick(detailAddedByAgent.signatureImageURL)
                        }
                      />
                    </div>
                  ) : (
                    "-"
                  )}
                </Table.Cell>

                <Table.Cell className="text-center align-middle">
                  {detailAddedByAgent.imageURL ? (
                    <div className="flex justify-center">
                      <img
                        src={detailAddedByAgent.imageURL}
                        className="w-[200px] h-[80px] object-contain"
                        alt="Image"
                        onClick={() =>
                          handleImageClick(detailAddedByAgent.imageURL)
                        }
                      />
                    </div>
                  ) : (
                    "-"
                  )}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </div>
      </div>

      {openImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center"
          onClick={closeModal}
        >
          <img
            src={openImage}
            alt="Enlarged"
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()} // Prevent modal close on image click
          />
        </div>
      )}
    </>
  );
};

export default Details;
