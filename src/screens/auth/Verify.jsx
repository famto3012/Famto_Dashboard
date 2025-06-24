import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { OTPContext } from "@/context/OTPContext";

import { toaster } from "@/components/ui/toaster";
import { PinInput } from "@/components/ui/pin-input";
import { Button } from "@/components/ui/button";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const Verify = () => {
  const [otpValue, setOtpValue] = useState(["", "", "", "", "", ""]);
  const [otpTime, setOtpTime] = useState(40);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [enableVerify, setEnableVerify] = useState(false);

  const navigate = useNavigate();
  const { signUpData, setupRecaptcha, setVerificationId, verifyOTP } =
    useContext(OTPContext);

  useEffect(() => {
    if (otpTime > 0) {
      const intervalId = setInterval(() => {
        setOtpTime(otpTime - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [otpTime]);

  useEffect(() => {
    const isValidOtp = otpValue.every((value) => /^\d$/.test(value));

    setEnableVerify(isValidOtp);
  }, [otpValue]);

  const handleReSendOTP = async () => {
    if (!signUpData.phoneNumber) {
      toaster.create({
        title: "Error",
        description: "Something went wrong while sending otp",
        type: "error",
      });
      return;
    }

    setSendingOTP(true);

    try {
      const confirmationResult = await setupRecaptcha(signUpData.phoneNumber);
      setVerificationId(confirmationResult.verificationId);
      toaster.create({
        title: "Success",
        description: "OTP sent successfully",
        type: "success",
      });
      setOtpTime(40);
    } catch (err) {
      const message =
        err.code === "auth/too-many-requests"
          ? "Too many requests"
          : err.code === "auth/invalid-phone-number"
            ? "Invalid phone number"
            : "Something went wrong";
      toaster.create({
        title: "Error",
        description: message,
        type: "error",
      });
    } finally {
      setSendingOTP(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setIsVerifying(true);
      await verifyOTP(otpValue.join(""));
      await axios.post(`${BASE_URL}/merchants/register`, signUpData);
      navigate("/auth/success");
    } catch (error) {
      toaster.create({
        title: "Error",
        description: "Invalid OTP. Try again.",
        type: "error",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <section className="flex w-screen font-poppins h-screen">
      <figure className="hidden md:block md:w-1/2">
        <img
          className="h-full w-full object-cover"
          src="https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2FLoginImage.svg?alt=media&token=c7452bf9-0b3a-4358-bef0-cd1bfa57e80f"
        />
      </figure>
      <div className="flex justify-center h-full w-full md:w-1/2 items-center bg-white">
        <div className="w-full md:w-[400px] h-auto py-10 bg-white md:border-2 md:rounded-2xl border-teal-700">
          <div className="text-center mt-5">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2FGroup%20427320755.svg?alt=media&token=02f2a096-b50a-4618-b9fb-a333f0c2aac0"
              alt="Logo"
              className="mx-auto flex h-20 w-20"
            />
            <h2 className="mt-8 text-[18px] font-medium text-black">
              Verify Account
            </h2>

            <p className="text-zinc-500 mt-5 font-poppins">
              An OTP has been sent to the number <br /> +91 xxxxx-xx
              {signUpData?.phoneNumber?.slice(-3)} <br /> Enter the OTP to
              verify your mobile number.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="p-5">
              <div className="flex items-center justify-center my-3">
                <PinInput
                  value={otpValue}
                  onValueChange={(e) => setOtpValue(e.value)}
                />
              </div>

              <div className="flex flex-col items-center justify-center mt-3">
                <p className="text-zinc-500 text-[14px] flex items-center gap-x-2">
                  <span>If you didn't receive the code!</span>
                  <Button
                    className="text-teal-700"
                    onClick={handleReSendOTP}
                    disabled={otpTime > 0 || isVerifying}
                  >
                    {sendingOTP ? "Re-sending..." : "Resend"}
                  </Button>
                </p>

                <Button
                  onClick={handleVerifyOtp}
                  className="bg-teal-700 hover:bg-teal-900 rounded-md text-white font-bold p-3 w-full focus:outline-none focus:shadow-outline"
                  disabled={!enableVerify || isVerifying}
                >
                  {isVerifying ? `Verifying...` : `Verify OTP`}
                </Button>
                {otpTime > 0 && (
                  <div className="mt-4">
                    <span className="text-teal-700 font-[500]">{otpTime}</span>{" "}
                    seconds remaining
                  </div>
                )}
              </div>
            </div>
            <div id="recaptcha-container"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Verify;
