import useApiClient from "@/api/apiClient";

export const fetchGraphData = async ({
  role,
  startDate,
  endDate,
  navigate,
}) => {
  try {
    const api = useApiClient(navigate);

    const route =
      role === "Merchant"
        ? `/admin/home/home-screen-sale-data-merchant`
        : `/admin/home/home-screen-sale-data`;

    const formattedStartDate = startDate
      ? startDate.toLocaleDateString("en-CA")
      : "";
    const formattedEndDate = endDate ? endDate.toLocaleDateString("en-CA") : "";

    const res = await api.get(route, {
      params: {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      },
    });

    return res.status === 200 ? res.data : [];
  } catch (err) {
    console.error(`Error in fetching graph data: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch graph data."
    );
  }
};
