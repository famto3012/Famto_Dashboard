export const formatDate = (date) => {
  if (!date) return "-";
  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  const formatedDate = new Date(date).toLocaleDateString("en-GB", options);

  return formatedDate;
};

export const formatTime = (time) => {
  if (!time) return "-";
  const date = new Date(time);

  let hours = date.getHours();
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (0 hours)

  const formattedTime = `${hours}:${minutes} ${ampm}`;

  return formattedTime;
};

export const formatDateForDateSelect = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
