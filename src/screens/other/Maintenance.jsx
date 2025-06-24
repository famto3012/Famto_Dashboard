const Maintenance = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="d-block text-center">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2FComputer%20troubleshooting-amico%201.svg?alt=media&token=fed2eef0-ec6f-48a6-b057-75b5421a61a7"
          alt="Maintenance image"
        />
        <h1 className="text-[24px] font-bold">Under Maintenance!</h1>
        <p className="text-gray-500">
          This site is currently down due to maintenance.
        </p>
        <p className="text-gray-500"> Apologies for the inconveniences.</p>
      </div>
    </div>
  );
};

export default Maintenance;
