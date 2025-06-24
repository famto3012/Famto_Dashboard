import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";

import { OTPContext } from "@/context/OTPContext";

import { toaster } from "@/components/ui/toaster";

import RenderIcon from "@/icons/RenderIcon";

import "react-phone-input-2/lib/style.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);

  const navigate = useNavigate();
  const { setSignUpData, setupRecaptcha, setVerificationId } =
    useContext(OTPContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhoneInputChange = (e) => {
    setFormData({ ...formData, phoneNumber: `+${e}` });
  };

  const handleSendOTP = async () => {
    const missingFields = Object.entries(formData)
      .filter(([_, value]) => !value)
      .map(([field]) => field);

    if (missingFields.length > 0) {
      const errorMessages = missingFields.map((field) => {
        const formattedField = field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());
        return `${formattedField} is required`;
      });

      const formattedErrors = errorMessages.map((msg) => `• ${msg}`).join("\n");

      toaster.create({
        title: "Error",
        description: formattedErrors,
        type: "error",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toaster.create({
        title: "Error",
        description: "Password mis-match",
        type: "error",
      });
      return;
    }

    setSendingOTP(true);

    try {
      const confirmationResult = await setupRecaptcha(formData.phoneNumber);
      setVerificationId(confirmationResult.verificationId);
      setSignUpData(formData);
      navigate("/auth/verify");
    } catch (err) {
      let errorMessage = "Something went wrong";
      if (err.code === "auth/too-many-requests") {
        errorMessage = "Too many requests";
      } else if (err.code === "auth/invalid-phone-number") {
        errorMessage = "Invalid phone number";
      }

      console.log(err);

      toaster.create({
        title: "Error",
        description: errorMessage,
        type: "error",
      });
    } finally {
      setSendingOTP(false);
    }
  };

  return (
    <section className=" flex justify-center w-full h-screen font-poppins">
      <div className="relative h-full w-full md:w-1/2">
        <img
          className="h-full w-full object-cover"
          src="https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2FLoginImage.svg?alt=media&token=c7452bf9-0b3a-4358-bef0-cd1bfa57e80f"
        />
        <div className="absolute inset-0 bg-black opacity-40 md:relative"></div>
      </div>

      <div className="absolute h-full w-full md:w-1/2 flex items-end md:justify-center md:items-center md:relative">
        <div className="min-w-sm md:border-2  border-teal-700 p-2 md:p-10 md:rounded-xl rounded-tl-[100px] bg-white w-full md:max-w-md">
          <img
            className="mx-auto hidden lg:flex h-20 w-20"
            src="https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2FGroup%20427320755.svg?alt=media&token=02f2a096-b50a-4618-b9fb-a333f0c2aac0"
          />

          <h2 className="mt-3 text-2xl font-poppins text-teal-700 md:text-black text-center mb-4">
            Sign Up
          </h2>

          <div className="flex flex-col gap-y-2 px-[20px]">
            <input
              className="input1"
              type="name"
              placeholder="Full Name of owner"
              value={formData.name}
              id="name"
              name="fullName"
              onChange={handleInputChange}
            />

            <input
              className="input1 mb-2"
              type="email"
              placeholder="Email"
              value={formData.email}
              id="email"
              name="email"
              onChange={handleInputChange}
            />

            <PhoneInput
              country={"in"}
              value={formData.phoneNumber}
              onChange={handlePhoneInputChange}
              placeholder="+91 xxxxx-xxxxx"
              className="border-b-2 pb-2 border-gray-300"
              name="phoneNumber"
              disableDropdown
              onlyCountries={["in"]}
            />

            <div className="relative inset-y-0 right-0 flex items-center justify-end">
              <input
                className="input1 pt-4 border-gray-300 focus:outline-none"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                id="password"
                name="password"
                onChange={handleInputChange}
              />
              <button
                className="absolute"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <span className="text-teal-700">
                    <RenderIcon iconName="EyeOpenIcon" size={24} loading={6} />
                  </span>
                ) : (
                  <span className="text-teal-700">
                    <RenderIcon iconName="EyeCloseIcon" size={24} loading={6} />
                  </span>
                )}
              </button>
            </div>

            <div className="relative inset-y-0 right-0 flex items-center justify-end">
              <input
                className="input1"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                name="confirmPassword"
                onChange={handleInputChange}
              />
              <button
                className="absolute"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <span className="text-teal-700">
                    <RenderIcon iconName="EyeOpenIcon" size={24} loading={6} />
                  </span>
                ) : (
                  <span className="text-teal-700">
                    <RenderIcon iconName="EyeCloseIcon" size={24} loading={6} />
                  </span>
                )}
              </button>
            </div>

            <button
              className="bg-teal-700 p-2 rounded-xl text-white mt-5 w-full"
              onClick={handleSendOTP}
              disabled={sendingOTP}
            >
              {sendingOTP ? `Sending OTP...` : `Send OTP`}
            </button>
          </div>

          <div className="flex justify-center m-5 text-gray-500">
            <p>
              Already have an Account ?
              <Link to="/auth/sign-in" className="text-teal-700 ">
                {" "}
                Sign in
              </Link>
            </p>
          </div>
          <div id="recaptcha-container"></div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
