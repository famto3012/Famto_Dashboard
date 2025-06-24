import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { toaster } from "@/components/ui/toaster";

import { forgotPassword } from "@/hooks/auth/useAuth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const { mutate, isPending } = useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: () => forgotPassword(email),
    onSuccess: () => {
      toaster.create({
        title: "Success",
        description:
          "Reset-password link have been send to your registered email",
        type: "success",
      });
    },
    onError: (data) => {
      toaster.create({
        title: "Error",
        description: data,
        type: "error",
      });
    },
  });

  return (
    <section className="flex w-screen font-poppins h-screen">
      <figure className="h-full w-full md:w-1/2 hidden md:block">
        <img
          className="h-full w-full object-cover"
          src="https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2FLoginImage.svg?alt=media&token=c7452bf9-0b3a-4358-bef0-cd1bfa57e80f"
        />
      </figure>

      <div className="flex justify-center items-center h-full w-full md:w-1/2 bg-white">
        <div className="w-full h-[calc(100vh)] md:h-auto md:w-[400px] rounded-none md:rounded-2xl md:border-2 md:border-teal-700 p-5 md:p-10 space-y-4 py-10 md:py-20">
          <div className="text-center mt-5">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2FGroup%20427320755.svg?alt=media&token=02f2a096-b50a-4618-b9fb-a333f0c2aac0"
              alt="Logo"
              className="mx-auto h-16 w-16 md:h-20 md:w-20"
            />

            <h2 className="mt-5 text-lg md:text-[18px] font-medium text-black">
              Reset Password
            </h2>

            <p className="text-[#7F7F7F] mt-3 text-[14px]">
              Enter your registered email for getting the reset password link
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <form
              className="p-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!email) {
                  toaster.create({
                    title: "Error",
                    description: "Please enter an email",
                    type: "error",
                  });
                } else {
                  mutate();
                }
              }}
            >
              <div>
                <input
                  className="border-b-2 border-gray-300 p-2 px-4 w-full focus:outline-none text-[16px] rounded-md bg-[#D9D9D9] placeholder:text-[#818181]"
                  type="email"
                  placeholder="Email"
                  value={email}
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col items-center justify-center">
                <button
                  className="bg-teal-700 p-2 rounded-xl text-white mt-5 w-full"
                  type="submit"
                  disabled={isPending}
                >
                  {isPending ? "Sending..." : "Send Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
