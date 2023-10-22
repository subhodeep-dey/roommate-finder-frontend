import React, { useState } from "react";
import Header from "../../Components/Header/Header";
import { Link } from "react-router-dom";
import "./Reset.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BsEyeFill } from "react-icons/bs";
import { BsEyeSlashFill } from "react-icons/bs";

let initialFormState = { email: "" };
let verifyInitialFormState = { code: "" };
let resetPasswordInitialFormState = { password: "", confirmPassword: "" };
function Reset() {
  //form and its errors state
  const [form, setForm] = useState(initialFormState);
  const [formError, setFormError] = useState({ email: null });
  const [verifyForm, setVerifyForm] = useState(verifyInitialFormState);
  const [resetPasswordForm, setResetPasswordForm] = useState(
    resetPasswordInitialFormState
  );
  const [resetFormError, setResetFormError] = useState({
    password: null,
    confirmPassword: null,
  });

  const [show, setShow] = useState({ password: true, confirmPassword: true });

  //view state
  const [isReset, setIsResest] = useState(true);
  const [isVerification, setIsVerification] = useState(false);
  const [isNewPassword, setIsNewPassword] = useState(false);

  const navigate = useNavigate();
  function formOnChangeHandler(e) {
    let isValid = validateEmail(e.target.value);
    if (isValid) {
      setFormError((prev) => {
        return { ...prev, email: null };
      });
    } else {
      setFormError((prev) => {
        return { ...prev, email: "Please enter a valid email" };
      });
    }
    let change = {};
    change[e.target.name] = e.target.value;
    setForm((prev) => {
      return { ...prev, ...change };
    });
  }

  function verifyFormOnChangeHandler(e) {
    let change = {};
    change[e.target.name] = e.target.value;
    setVerifyForm((prev) => {
      return { ...prev, ...change };
    });
  }

  function resetFormOnChangeHandler(e) {
    let name = e.target.name;
    if (name === "password") {
      validatePassword(e.target.value);
    } else if (name === "confirmPassword") {
      validateConfirmPassword(resetPasswordForm?.password, e.target.value);
    }
    let change = {};
    change[e.target.name] = e.target.value;
    setResetPasswordForm((prev) => {
      return { ...prev, ...change };
    });
  }

  function sendClickHandler() {
    console.log("form", form);
    setIsResest(false);
    setIsVerification(true);
    setForm(initialFormState);
    toast.success("OTP has been sent to your email");
  }

  function verifyCodeClickHandler() {
    console.log("verifyform", verifyForm);
    setIsVerification(false);
    setIsNewPassword(true);
    setVerifyForm(initialFormState);
    toast.success("OTP verified successfully");
  }

  function resetPasswordClickHandler() {
    console.log("resetPasswordForm", resetPasswordForm);
    setResetPasswordForm(initialFormState);
    toast.success("Changed your password successfully");
    navigate("/");
  }

  function validateEmail(email) {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    let isEmailValid = emailRegex.test(email);
    return isEmailValid;
  }

  function validatePassword(password) {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    const isPasswordValid = passwordRegex.test(password);
    if (!isPasswordValid) {
      setResetFormError((prev) => {
        return {
          ...prev,
          password:
            "Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.",
        };
      });
    } else {
      setResetFormError((prev) => {
        return { ...prev, password: null };
      });
    }
    return isPasswordValid;
  }

  function validateConfirmPassword(password, confirmPassword) {
    if (password === confirmPassword) {
      setResetFormError((prev) => {
        return { ...prev, confirmPassword: null };
      });
    } else {
      setResetFormError((prev) => {
        return {
          ...prev,
          confirmPassword: "New password and comfirm new password do not match",
        };
      });
    }
  }

  function hideOnClickHandler(target) {
    if (target === "password") {
      setShow((prev) => {
        return { ...prev, password: !prev.password };
      });
    } else if (target === "confirmPassword") {
      setShow((prev) => {
        return { ...prev, confirmPassword: !prev.confirmPassword };
      });
    }
  }
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-grow h-auto">
        {isReset ? (
          <>
            <div
              className="hidden md:inline-block md:w-[45%] bg-cover bg-center"
              style={{
                backgroundImage: `url(${require("../../Assets/resetpassword.png")})`,
              }}
            >
              {" "}
            </div>
            <div className="w-[100%] md:w-[55%] flex justify-center">
              <div className="flex flex-col pt-[2rem] items-center w-[80%]">
                <h1 className="text-[#333] text-[1.75rem] font-[600] w-full">
                  Reset Your Password
                </h1>
                <p className="mb-5 text-[#3C4242] text-[14px] w-full">
                  Enter your email and we'll send you a link to reset your
                  password
                </p>

                <div className="w-full mb-6">
                  <span className="text-[#3C4242] text-[16px]">Email</span>
                  <input
                    name="email"
                    value={form.email}
                    onChange={formOnChangeHandler}
                    placeholder="mfc.vit2023@vitstudent.ac.in"
                    className=" mt-2 rounded-[8px] border-[#3C4242] border-[1px] w-full p-[0.75rem] "
                  />
                  {formError?.email ? (
                    <p className="text-[14px] mt-1 text-[#EE1D52]">
                      {formError.email}
                    </p>
                  ) : null}
                </div>

                <button
                  onClick={sendClickHandler}
                  disabled={formError.email ? true : false}
                  className="bg-[#06105A] px-[2rem] py-[0.75rem] text-white rounded-[8px] self-start disabled:hover:cursor-not-allowed"
                >
                  {" "}
                  Send
                </button>
                <span className="text-[#3C4242] text-[14px] mt-2 self-start">
                  Back to
                  <Link to="/">
                    <span className="underline ml-2">Log In</span>
                  </Link>
                </span>
              </div>
            </div>
          </>
        ) : null}
        {isVerification ? (
          <>
            <div
              className="hidden md:inline-block md:w-[45%] bg-cover bg-center"
              style={{
                backgroundImage: `url(${require("../../Assets/verification.png")})`,
              }}
            >
              {" "}
            </div>
            <div className="w-[100%] md:w-[55%] flex justify-center">
              <div className="flex flex-col pt-[2rem] items-center w-[80%]">
                <h1 className="text-[#333] text-[1.75rem] font-[600] w-full">
                  Verification
                </h1>
                <p className="mb-5 text-[#3C4242] text-[14px] w-full">
                  Verify your code
                </p>

                <div className="w-full mb-6">
                  <span className="text-[#3C4242] text-[16px]">
                    Verification Code
                  </span>
                  <input
                    name="code"
                    value={verifyForm.code}
                    onChange={verifyFormOnChangeHandler}
                    className=" mt-2 rounded-[8px] border-[#3C4242] border-[1px] w-full p-[0.75rem] "
                  />
                </div>

                <button
                  onClick={verifyCodeClickHandler}
                  className="bg-[#06105A] px-[2rem] py-[0.75rem] text-white rounded-[8px] self-start"
                >
                  {" "}
                  Verify Code
                </button>
              </div>
            </div>
          </>
        ) : null}
        {isNewPassword ? (
          <>
            <div
              className="hidden md:inline-block md:w-[45%] bg-cover bg-center"
              style={{
                backgroundImage: `url(${require("../../Assets/newpassword.png")})`,
              }}
            >
              {" "}
            </div>
            <div className="w-[100%] md:w-[55%] flex justify-center">
              <div className="flex flex-col pt-[2rem] items-center w-[80%]">
                <h1 className="text-[#333] text-[1.75rem] font-[600] w-full">
                  Create New Password
                </h1>
                <p className="mb-5 text-[#3C4242] text-[14px] w-full">
                  Your new password must be different from previous used
                  passwords.{" "}
                </p>

                <div className="w-full mb-6 flex flex-col">
                  <div className="flex justify-between">
                    <span className="text-[#3C4242] text-[16px]">Password</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <input
                      value={resetPasswordForm.password}
                      onChange={resetFormOnChangeHandler}
                      name="password"
                      type={!show.password ? "password" : ""}
                      className="mt-2 rounded-l-[8px] border-[#3C4242] border-[1px] w-full p-[0.75rem] h-[100%] border-r-0 "
                    />
                    <span
                      className=" mt-2 flex justify-between items-center  cursor-pointer rounded-r-[8px] border-[#3C4242] border-[1px] p-[0.75rem] h-[100%] border-l-0 "
                      onClick={() => hideOnClickHandler("password")}
                    >
                      <span className="">
                        {" "}
                        {show.password ? (
                          <BsEyeFill size={20} color={"#807D7E"} />
                        ) : (
                          <BsEyeSlashFill size={20} color={"#807D7E"} />
                        )}
                      </span>{" "}
                    </span>
                  </div>
                  <span className="text-[#807D7E] text-[14px] mt-1 hidden">
                    Use 8 or more characters with a mix of letters, numbers &
                    symbols
                  </span>
                  {resetFormError?.password ? (
                    <p className="text-[14px] mt-1 text-[#EE1D52]">
                      {resetFormError.password}
                    </p>
                  ) : null}
                </div>

                <div className="w-full mb-6 flex flex-col">
                  <div className="flex justify-between">
                    <span className="text-[#3C4242] text-[16px]">
                      Confirm Password
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    {" "}
                    <input
                      value={resetPasswordForm.confirmPassword}
                      onChange={resetFormOnChangeHandler}
                      name="confirmPassword"
                      type={!show?.confirmPassword ? "password" : ""}
                      className="mt-2 rounded-l-[8px] border-[#3C4242] border-[1px] w-full p-[0.75rem] h-[100%] border-r-0 "
                    />
                    <span
                      className=" mt-2 flex items-center  cursor-pointer rounded-r-[8px] border-[#3C4242] border-[1px] p-[0.75rem] h-[100%] border-l-0 "
                      onClick={() => hideOnClickHandler("confirmPassword")}
                    >
                      <span>
                        {" "}
                        {show.confirmPassword ? (
                          <BsEyeFill size={20} color={"#807D7E"} />
                        ) : (
                          <BsEyeSlashFill size={20} color={"#807D7E"} />
                        )}
                      </span>{" "}
                    </span>
                  </div>

                  <span className="text-[#807D7E] text-[14px] mt-1 hidden">
                    Use 8 or more characters with a mix of letters, numbers &
                    symbols
                  </span>
                  {resetFormError?.confirmPassword ? (
                    <p className="text-[14px] mt-1 text-[#EE1D52]">
                      {resetFormError.confirmPassword}
                    </p>
                  ) : null}
                </div>

                <button
                  onClick={resetPasswordClickHandler}
                  disabled={
                    resetFormError.password || resetFormError.confirmPassword
                      ? true
                      : false
                  }
                  className="bg-[#06105A] px-[2rem] py-[0.75rem] text-white rounded-[8px] self-start disabled:hover:cursor-not-allowed"
                >
                  {" "}
                  Reset Password
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default Reset;
