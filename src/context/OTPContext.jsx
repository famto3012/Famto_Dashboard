import { auth } from "@/config/firebase";
import {
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
  signInWithPhoneNumber,
} from "firebase/auth";
import { createContext, useState } from "react";

export const OTPContext = createContext();

export const OTPProvider = ({ children }) => {
  const [verificationId, setVerificationId] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [signUpData, setSignUpData] = useState({});

  const setupRecaptcha = (phoneNumber) => {
    try {
      const recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        }
      );
      recaptchaVerifier.render();
      return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    } catch (error) {
      console.error("Recaptcha initialization failed:", error);
      throw error;
    }
  };

  const verifyOTP = async (otp) => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      await signInWithCredential(auth, credential);
      setIsVerified(true);
    } catch (error) {
      console.error("OTP Verification failed:", error.message);
      throw error;
    }
  };

  return (
    <OTPContext.Provider
      value={{
        setupRecaptcha,
        verifyOTP,
        setVerificationId,
        isVerified,
        signUpData,
        setSignUpData,
      }}
    >
      {children}
    </OTPContext.Provider>
  );
};

export default OTPContext;
