import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Reset.css";

function Reset() {
  const [email, setEmail] = useState("");

  const sendEmailToken = async () => {
    try {
      const response = await axios.post(
        "https://roommate-finder-theta.vercel.app/auth/password-reset",
        {
          username: email
        }
      );
      if (response.data.success) {
        toast.success("Email token sent successfully");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
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
          onChange={(e) => setEmail(e.target.value)}
          placeholder="mfc.vit2023@vitstudent.ac.in"
          className=" mt-2 rounded-[8px] border-[#3C4242] border-[1px] w-full p-[0.75rem]"
        />
      </div>

      <button
        onClick={sendEmailToken}
        className="bg-[#06105A] px-[2rem] py-[0.75rem] text-white rounded-[8px] self-start"
      >
        Send Email Token
      </button>
    </div>
  );
}

export default Reset;