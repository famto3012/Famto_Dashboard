import { Link } from "react-router-dom";

import RenderIcon from "@/icons/RenderIcon";

const Success = () => {
  return (
    <section className="flex justify-center w-full h-screen font-poppins">
      <div className="hidden md:block md:w-1/2">
        <img
          className="h-full w-full object-cover"
          src="https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2FLoginImage.svg?alt=media&token=c7452bf9-0b3a-4358-bef0-cd1bfa57e80f"
        />
      </div>

      <div className="w-full md:w-1/2 flex justify-center items-center h-screen bg-white">
        <div className=" md:border-2 border-teal-700 p-5 md:p-10 rounded-none md:rounded-xl bg-white w-full md:w-[400px]">
          <img
            className="mx-auto lg:flex mb-5 h-16 w-16 md:h-20 md:w-20"
            src="https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2FGroup%20427320755.svg?alt=media&token=c7452a096-b50a-4618-b9fb-a333f0c2aac0"
          />
          <div className="flex justify-center item-center text-teal-700">
            <RenderIcon iconName="CheckIcon" size={56} loading={10} />
          </div>

          <h1 className="text-lg md:text-[20px] mt-2 text-center font-poppins font-semibold">
            SUCCESS
          </h1>
          <h1 className="text-zinc-500 text-center mt-5 text-sm md:text-base">
            Your account has been created successfully.
          </h1>

          <Link
            className="bg-teal-700 p-2 rounded-xl text-white mt-7 w-full text-center block"
            to={"/auth/sign-in"}
          >
            Back to Sign-in
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Success;
