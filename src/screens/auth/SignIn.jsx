import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import AuthContext from "@/context/AuthContext";

import RenderIcon from "@/icons/RenderIcon";

import { signInHandler } from "@/hooks/auth/useAuth";
import { SocketContext } from "@/context/SocketContext";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    role: "",
    general: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const { saveToStorage } = useContext(AuthContext);
  const { setUserId } = useContext(SocketContext);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => signInHandler(formData),
    onSuccess: ({ token, role, _id, fullName, refreshToken }) => {
      saveToStorage(token, role, _id, fullName, undefined, refreshToken);
      setUserId(_id);
      navigate("/home");
    },
    onError: (err) => {
      const errorData = JSON.parse(err.message);

      setErrors({
        email: errorData?.email || "",
        password: errorData?.password || "",
        role: errorData?.role || "",
        general: errorData?.general || "",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    mutate();
  };

  return (
    <section className="flex w-screen font-poppins h-screen justify-center">
      <figure className="h-full w-full lg:w-1/2 md:w-1/2 lg:opacity-100 relative">
        <img
          className="w-full min-w-full h-full object-cover fill-black"
          src="https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2FLoginImage.svg?alt=media&token=c7452bf9-0b3a-4358-bef0-cd1bfa57e80f"
        />
        <div className="inset-0 bg-black opacity-50 absolute md:relative"></div>
      </figure>

      <div className="min-w-screen flex justify-center h-full md:h-auto lg:w-1/2 md:w-1/2 w-full absolute lg:relative md:relative md:items-center lg:items-center items-end">
        <div className="min-w-screen bg-white w-full md:w-[450px] lg:h-auto rounded-tl-[100px] shadow-lg md:rounded-2xl lg:rounded-2xl md:border-2 md:border-teal-700 p-5 lg:p-14">
          <div className="text-center">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2FGroup%20427320755.svg?alt=media&token=02f2a096-b50a-4618-b9fb-a333f0c2aac0"
              alt="Logo"
              className="mx-auto hidden lg:flex h-20 w-20"
            />
            <h2 className="mt-3 text-2xl font-poppins text-teal-700 md:text-black">
              Sign In
            </h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="role" className="block font-medium text-gray-700">
                Login as
              </label>
              <select
                id="role"
                name="role"
                className={`mt-1 text-gray-500 p-2 w-full border rounded appearance-none outline-none focus:outline-none ${
                  errors.role && `input-error`
                }`}
                value={formData.role}
                onChange={handleInputChange}
              >
                <option defaultValue={"Select role"} hidden>
                  Select role
                </option>
                <option value={"Admin"}>Admin</option>
                <option value={"Merchant"}>Merchant</option>
                <option value={"Manager"}>Manager</option>
              </select>
              {errors.role && (
                <small className="text-red-500 text-start">{errors.role}</small>
              )}
            </div>

            <div className="mb-3">
              <div className="mb-2 relative inset-y-0 left-0 flex items-center">
                <div className="absolute text-teal-700">
                  <RenderIcon iconName="SignInUserIcon" size={24} loading={6} />
                </div>
                <input
                  className={`input ${errors.email && `input-error`}`}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              {errors.email && (
                <small className="text-red-500 text-center">
                  {errors.email}
                </small>
              )}
            </div>
            <div className="mb-3">
              <div className="mb-2 relative inset-y-0 left-0 flex items-center">
                <div className="absolute text-teal-700 z-20">
                  <RenderIcon iconName="LockIcon" size={24} loading={6} />
                </div>
                <input
                  className={`input z-10 bg-white ${errors.password ? "input-error" : ""}`}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-1 z-20 text-teal-700"
                >
                  {showPassword ? (
                    <RenderIcon iconName="EyeOpenIcon" size={24} loading={6} />
                  ) : (
                    <RenderIcon iconName="EyeCloseIcon" size={24} loading={6} />
                  )}
                </button>
              </div>
              {errors.password && (
                <small className="text-red-500 text-start">
                  {errors.password}
                </small>
              )}
              {errors.general && (
                <small className="text-red-500 text-start">
                  {errors.general}
                </small>
              )}
            </div>

            <div className="flex items-center justify-end mb-4 text-teal-700">
              <Link to="/auth/forgot-password">Forgot Password?</Link>
            </div>
            <button
              type="submit"
              className="w-full py-2 lg:px-4 bg-teal-700 text-white rounded-xl hover:bg-teal-800"
            >
              {isPending ? "Loading..." : `Sign in`}
            </button>
          </form>
          <div className="mt-3 text-center">
            <p>
              {"Don't have an account?"}
              <Link className="text-teal-700" to="/auth/sign-up">
                {" "}
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
