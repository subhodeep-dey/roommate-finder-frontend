import React, { useState, useEffect } from "react";
import axios from "axios";

function UpdatePassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailToken, setEmailToken] = useState("");

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    setEmail(params.Email || "");
    setEmailToken(params.emailToken || "");
  }, []);

  const updatePassword = async () => {
    try {
      const response = await axios.post(
        "https://roommate-finder-theta.vercel.app/auth/update-password",
        {
          username: email,
          password: password,
          emailToken: emailToken,
        }
      );
      if (response.data.success) {
        // Handle success, e.g., show a success message or redirect the user
        console.log("Password updated successfully");
      } else {
        // Handle error, e.g., display an error message to the user
        console.error(response.data.message);
      }
    } catch (error) {
      // Handle network error or any other errors
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="w-full mb-6">
        <span className="text-[#3C4242] text-[16px]">Email</span>
        <input
          name="email"
          value={email}
          readOnly
          className=" mt-2 rounded-[8px] border-[#3C4242] border-[1px] w-full p-[0.75rem]"
        />
      </div>

      <div className="w-full mb-6">
        <span className="text-[#3C4242] text-[16px]">Password</span>
        <input
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className=" mt-2 rounded-[8px] border-[#3C4242] border-[1px] w-full p-[0.75rem]"
        />
      </div>

      <div className="w-full mb-6">
        <span className="text-[#3C4242] text-[16px]">Confirm Password</span>
        <input
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className=" mt-2 rounded-[8px] border-[#3C4242] border-[1px] w-full p-[0.75rem]"
        />
      </div>

      <button
        onClick={updatePassword}
        className="bg-[#06105A] px-[2rem] py-[0.75rem] text-white rounded-[8px] self-start"
      >
        Update Password
      </button>
    </div>
  );
}

export default UpdatePassword;
