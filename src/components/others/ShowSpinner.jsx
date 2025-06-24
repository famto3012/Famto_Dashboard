const ShowSpinner = ({ color }) => {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 ${color ? "border-white" : "border-teal-600"} `}
      ></div>
    </div>
  );
};

export default ShowSpinner;
