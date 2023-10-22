import axios from "axios";
import React, { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Bed from "../../Assets/bed.svg";
import BoldBed from "../../Assets/bold-bed.svg";
import BoldPeople from "../../Assets/bold-people.svg";
import People from "../../Assets/people.svg";
import Footer from "../../Components/Footer/Footer";
import Navbar from "../../Components/NavBar/Navbar";
import "./NeedRoom.css";

const initialNeedRoomFormState = {
  rank: "",
  gender: "M",
  bedType: "",
  preferedBlocks: ["A"],
  // preferedBlocks: ["A", "A", "A"],
  contactNumber: "",
  habits: "",
  description: "",
};
const initialNeedRoomMateFormState = {
  rank: "",
  gender: "M",
  noOfBeds: "",
  preferedBlocks: ["A"],
  // preferedBlocks: ["A", "A", "A"],
  contactNumber: "",
  habits: "",
  description: "",
};

let blocks = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "P",
  "Q",
  "R",
];
function NeedRoom() {
  const [needRoom, setNeedRoom] = useState(true);
  const [needRoomForm, setNeedRoomForm] = useState(initialNeedRoomFormState);
  const [needRoomMateForm, setNeedRoomMateForm] = useState(
    initialNeedRoomMateFormState
  );
  const user = useSelector((state) => state.authReducer.authData);
  const navigate = useNavigate();

  function needRoomClickHandler(trigger) {
    if (trigger === "room") {
      setNeedRoom(true);
    } else {
      setNeedRoom(false);
    }
  }

  function needRoomFormOnChangeHandler(e, index) {
    let { name, value } = e.target;
    //manage preferred blocks state
    if (name === "prefferedBlocks") {
      setNeedRoomForm((prev) => {
        const updatedBlocks = [...prev.preferedBlocks];
        updatedBlocks[index] = value;
        return { ...prev, preferedBlocks: updatedBlocks };
      });
    }

    //manage gender  state
    let gender = e.target.getAttribute("data-gender");
    if (gender) {
      let change = {};
      change["gender"] = gender;
      setNeedRoomForm((prev) => {
        return { ...prev, ...change };
      });
    }

    let change = {};
    change[name] = value;
    setNeedRoomForm((prev) => {
      return { ...prev, ...change };
    });
  }

  function needRoomMateFormOnChangeHandler(e, index) {
    let { name, value } = e.target;
    //manage preferred blocks state
    if (name === "prefferedBlocks") {
      setNeedRoomMateForm((prev) => {
        const updatedBlocks = [...prev.preferedBlocks];
        updatedBlocks[index] = value;
        return { ...prev, preferedBlocks: updatedBlocks };
      });
    }

    let gender = e.target.getAttribute("data-gender");
    if (gender) {
      let change = {};
      change["gender"] = gender;
      setNeedRoomMateForm((prev) => {
        return { ...prev, ...change };
      });
    }
    let change = {};
    change[name] = value;
    setNeedRoomMateForm((prev) => {
      return { ...prev, ...change };
    });
  }

  async function needRoomSubmitHandler() {
    if (!validateNeedRoomForm()) {
      return;
    }
    debugger;
    let userId = user?.user?._id;
    console.log("need Room", needRoomForm);
    let requestBody = {
      userId: userId,
      rank: needRoomForm?.rank,
      gender: needRoomForm?.gender,
      preferredBed: needRoomForm?.bedType,
      preferredBlock: needRoomForm?.preferedBlocks[0],
      phone: needRoomForm?.contactNumber,
      habits: needRoomForm?.habits,
      desc: needRoomForm?.description,
    };
    try {
      let result = await axios.post(
        `https://roommate-finder-theta.vercel.app/room/${userId}`,
        requestBody
      );
      console.log("result", result);
      navigate("/home");
    } catch (err) {
      console.error(err);
    }
  }

  async function needRoomMateSubmitHandler() {
    if (!validateNeedRoomMateForm()) {
      return;
    }
    let userId = user?.user?._id;

    let requestBody = {
      userId: userId,
      rank: needRoomMateForm?.rank,
      gender: needRoomMateForm?.gender,
      preferredBed: needRoomMateForm?.noOfBeds,
      preferredBlock: needRoomMateForm?.preferedBlocks[0],
      phone: needRoomMateForm?.contactNumber,
      year: 19999,
      desc: needRoomMateForm?.description,
    };

    try {
      let result = await axios.post(
        `https://roommate-finder-theta.vercel.app/roommate/${userId}`,
        requestBody
      );
      console.log("result", result);
      navigate("/home");
    } catch (err) {
      console.error(err);
    }
  }

  function validateNeedRoomForm() {
    const numericRegex = /^[0-9]+$/;
    const indianNumberRegex = /^[6789]\d{9}$/;
    if (!needRoomForm["rank"]) {
      toast.error("Plase enter your rank");
      return false;
    } else if (!needRoomForm["bedType"]) {
      toast.error("Please enter your preferred bed type");
      return false;
    } else if (!needRoomForm["contactNumber"]) {
      toast.error("Please enter your Contact number");
      return false;
    } else if (!needRoomForm["habits"]) {
      toast.error("Please enter your habits");
      return false;
    }

    if (needRoomForm["rank"]) {
      let isRankValid = numericRegex.test(needRoomForm["rank"]);
      if (!isRankValid) {
        toast.error("Please enter a valid rank");
        return false;
      }
      let isRankAbove5 = needRoomForm["rank"].length > 5 ? true : false;
      if (isRankAbove5) {
        toast.error("Please enter a valid rank");
        return false;
      }
    } else if (needRoomForm["bedType"]) {
      let isBedTypeValid = numericRegex.test(needRoomForm["bedType"]);
      if (!isBedTypeValid) {
        toast.error("Please enter a valid rank");
        return false;
      }
    } else if (needRoomForm["contactNumber"]) {
      let isContactNumberValid = indianNumberRegex.test(
        needRoomForm["contactNumber"]
      );
      if (!isContactNumberValid) {
        toast.error("Please enter a valid Contact number");
        return false;
      }
    } else if (needRoomForm["preferedBlocks"]) {
      let isValid = areValuesUnique(needRoomForm["preferedBlocks"]);
      if (!isValid) {
        toast.error("Please choose 3 different blocks");
        return false;
      }
    }
    return true;
  }
  function validateNeedRoomMateForm() {
    const numericRegex = /^[0-9]+$/;
    const indianNumberRegex = /^[6789]\d{9}$/;

    if (!needRoomMateForm["rank"]) {
      toast.error("Please enter your rank");
      return false;
    } else if (!needRoomMateForm["noOfBeds"]) {
      toast.error("Please enter the number of beds");
      return false;
    } else if (!needRoomMateForm["contactNumber"]) {
      toast.error("Please enter your Contact number");
      return false;
    } else if (!needRoomMateForm["habits"]) {
      toast.error("Please enter your habits");
      return false;
    }

    if (needRoomMateForm["rank"]) {
      let isRankValid = numericRegex.test(needRoomMateForm["rank"]);
      if (!isRankValid) {
        toast.error("Please enter a valid rank");
        return false;
      }

      let isRankAbove5 = needRoomForm["rank"].length > 5 ? true : false;
      if (isRankAbove5) {
        toast.error("Please enter a valid rank");
        return false;
      }
    } else if (needRoomMateForm["noOfBeds"]) {
      let isNoOfBedsValid = numericRegex.test(needRoomMateForm["noOfBeds"]);
      if (!isNoOfBedsValid) {
        toast.error("Please enter a valid number of beds");
        return false;
      }
    } else if (needRoomMateForm["contactNumber"]) {
      let isContactNumberValid = indianNumberRegex.test(
        needRoomMateForm["contactNumber"]
      );
      if (!isContactNumberValid) {
        toast.error("Please enter a valid Contact number");
        return false;
      }
    } else if (needRoomMateForm["preferedBlocks"]) {
      let isValid = areValuesUnique(needRoomMateForm["preferedBlocks"]);
      if (!isValid) {
        toast.error("Please choose 3 different blocks");
        return false;
      }
    }
  }

  function areValuesUnique(arr) {
    const uniqueSet = new Set();
    for (const value of arr) {
      if (uniqueSet.has(value)) {
        return false;
      }
      uniqueSet.add(value);
    }
    return true;
  }

  return (
    <Fragment>
      <Navbar />
      <div className="px-10 py-2 w-[100vw]">
        {/* navbar */}
        <div className="flex pt-4 pb-2 px-2 border-b-2 border-[#7E8490]">
          <div
            className="flex flex-col items-center cursor-pointer"
            data-name="room"
            onClick={() => needRoomClickHandler("room")}
          >
            <img
              alt="bedlogo"
              className="h-[35px]"
              src={needRoom ? BoldBed : Bed}
            />
            <span
              className={`${
                needRoom ? "border-b-2 border-b-[#000] font-[600]" : ""
              } pb-1`}
            >
              Need Room
            </span>
          </div>
          <div
            className="flex flex-col items-center ml-6 cursor-pointer"
            onClick={needRoomClickHandler}
          >
            <img
              alt="roomlogo"
              className="h-[35px]"
              src={!needRoom ? BoldPeople : People}
            />
            <span
              className={`${
                !needRoom ? "border-b-2 border-b-[#000] font-[600]" : ""
              } pb-1`}
            >
              Need Roommates
            </span>
          </div>
        </div>
        {/* form */}
        {needRoom ? (
          <div className="w-[100%]">
            <h1 className="mb-4 mt-5">Looking for Room</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap:4  md:gap:4 lg:gap-8">
              <div
                style={{ gridAutoRows: "120px" }}
                className="grid grid-cols-1 items-center"
              >
                <div className="flex flex-col mb-6 md:mr-4">
                  <span>Your Rank *</span>
                  <input
                    name="rank"
                    value={needRoomForm["rank"]}
                    onChange={needRoomFormOnChangeHandler}
                    className="bg-[#D9D9D9] rounded-[8px] mt-1 h-[3rem] p-4"
                  />
                </div>
                <div className="flex flex-col mb-6 md:mr-4">
                  <span>Prefered Bed Type*</span>
                  <input
                    name="bedType"
                    value={needRoomForm["bedType"]}
                    onChange={needRoomFormOnChangeHandler}
                    className="bg-[#D9D9D9] rounded-[8px] mt-1 h-[3rem] p-4"
                  />
                </div>
                <div className="flex flex-col mb-6 md:mr-4">
                  <span>Contact Number*</span>
                  <input
                    name="contactNumber"
                    value={needRoomForm["contactNumber"]}
                    onChange={needRoomFormOnChangeHandler}
                    className="bg-[#D9D9D9] rounded-[8px] mt-1 h-[3rem] p-4"
                  />
                </div>
                <div className="flex md:hidden flex-col mb-6 ">
                  <span>Habits*</span>
                  <input
                    name="habits"
                    value={needRoomForm["habits"]}
                    onChange={needRoomFormOnChangeHandler}
                    className="bg-[#D9D9D9] rounded-[8px] mt-1 h-[3rem] p-4"
                  />
                </div>
              </div>
              <div
                style={{ gridAutoRows: "120px" }}
                className="grid grid-cols-1 items-center"
              >
                <div className="containerr  max-h-[80px]">
                  <div className="label">Gender*</div>
                  <div className="flex">
                    <div
                      data-gender="M"
                      name="gender"
                      className={`mr-6  bg-[#D9D9D9] rounded-[10px] py-2 px-8 text-center cursor-pointer ${
                        needRoomForm["gender"] === "M"
                          ? "border border-black"
                          : ""
                      }`}
                      onClick={needRoomFormOnChangeHandler}
                    >
                      M
                    </div>
                    <div
                      data-gender="F"
                      name="gender"
                      className={`bg-[#D9D9D9] rounded-[10px] py-2 px-8 text-center cursor-pointer ${
                        needRoomForm["gender"] === "F"
                          ? "border border-black"
                          : ""
                      }`}
                      onClick={needRoomFormOnChangeHandler}
                    >
                      F
                    </div>
                  </div>
                </div>
                <div className="containerr max-h-[80px]">
                  <div className="label">Prefered Block*</div>
                  <div className="flex gap-6">
                    <div className="bg-[#D9D9D9] rounded-[10px] flex items-center">
                      <select
                        name="prefferedBlocks"
                        value={needRoomForm["preferedBlocks"][0]}
                        onChange={(e) => needRoomFormOnChangeHandler(e, 0)}
                        className="bg-[transparent] w-[100%] py-3 px-6 outline-none focus:border-none cursor-pointer"
                      >
                        {blocks.map((block) => (
                          <option key={block} value={block}>
                            {block}
                          </option>
                          //   <option>{`${block}-Block`}</option>
                        ))}
                      </select>
                    </div>

                    <div className="hidden bg-[#D9D9D9] rounded-[10px] flex items-center ">
                      <select
                        name="prefferedBlocks"
                        value={needRoomForm["preferedBlocks"][1]}
                        onChange={(e) => needRoomFormOnChangeHandler(e, 1)}
                        className="bg-[transparent] w-[100%] py-3 px-6 outline-none focus:border-none cursor-pointer "
                      >
                        {blocks.map((block) => (
                          <option key={block} value={block}>
                            {block}
                          </option>
                          //   <option>{`${block}-Block`}</option>
                        ))}
                      </select>
                    </div>

                    <div className="hidden bg-[#D9D9D9] rounded-[10px] flex items-center">
                      <select
                        name="prefferedBlocks"
                        value={needRoomForm["preferedBlocks"][2]}
                        onChange={(e) => needRoomFormOnChangeHandler(e, 2)}
                        className="bg-[transparent] w-[100%] py-3 px-6 outline-none focus:border-none cursor-pointer "
                      >
                        {blocks.map((block) => (
                          <option key={block} value={block}>
                            {block}
                          </option>
                          //   <option>{`${block}-Block`}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex flex-col mb-6 ">
                  <span>Habits*</span>
                  <input
                    name="habits"
                    value={needRoomForm["habits"]}
                    onChange={needRoomFormOnChangeHandler}
                    className="bg-[#D9D9D9] rounded-[8px] mt-1 h-[3rem] p-4"
                  />
                </div>
              </div>
            </div>
            <div className="containerr w-[100%] mb-6 mt-6 md:mt-2">
              <div className="label">Description</div>
              <textarea
                rows="3"
                className="w-[100%] focus:border-none outline-none"
                name="description"
                value={needRoomForm["description"]}
                onChange={needRoomFormOnChangeHandler}
              ></textarea>
            </div>
            <div className="w-[100%] flex justify-center mb-6 mt-6">
              <button
                onClick={needRoomSubmitHandler}
                className="mx-auto bg-[#06105A] px-[2rem] py-[0.75rem] text-white rounded-[8px] self-start disabled:hover:cursor-not-allowed"
              >
                {" "}
                Submit
              </button>
            </div>
          </div>
        ) : (
          <div className="w-[100%]">
            <h1 className="mb-4 mt-5">Have Room & looking for Roommate</h1>
            <div className="grid grid-cols-1 md:grid-cols-2  md:gap:4 lg:gap-8">
              <div
                style={{ gridAutoRows: "120px" }}
                className="grid grid-cols-1 items-center"
              >
                <div className="flex flex-col mb-6">
                  <span>Your Rank *</span>
                  <input
                    name="rank"
                    value={needRoomMateForm["rank"]}
                    onChange={needRoomMateFormOnChangeHandler}
                    className="bg-[#D9D9D9] rounded-[8px] mt-1 h-[3rem] p-4"
                  />
                </div>
                <div className="flex flex-col mb-6">
                  <span>No of Beds*</span>
                  <input
                    name="noOfBeds"
                    value={needRoomMateForm["noOfBeds"]}
                    onChange={needRoomMateFormOnChangeHandler}
                    className="bg-[#D9D9D9] rounded-[8px] mt-1 h-[3rem] p-4"
                  />
                </div>
                <div className="flex flex-col mb-6">
                  <span>Contact Number*</span>
                  <input
                    name="contactNumber"
                    value={needRoomMateForm["contactNumber"]}
                    onChange={needRoomMateFormOnChangeHandler}
                    className="bg-[#D9D9D9] rounded-[8px] mt-1 h-[3rem] p-4"
                  />
                </div>
                <div className="flex md:hidden flex-col mb-6 ">
                  <span>Habits*</span>
                  <input
                    name="habits"
                    value={needRoomMateForm["habits"]}
                    onChange={needRoomMateFormOnChangeHandler}
                    className="bg-[#D9D9D9] rounded-[8px] mt-1 h-[3rem] p-4"
                  />
                </div>
              </div>
              <div
                style={{ gridAutoRows: "120px" }}
                className="grid grid-cols-1 items-center"
              >
                <div className="containerr  max-h-[80px]">
                  <div className="label">Gender*</div>
                  <div className="flex">
                    <div
                      data-gender="M"
                      name="gender"
                      className={`mr-6  bg-[#D9D9D9] rounded-[10px] py-2 px-8 text-center cursor-pointer ${
                        needRoomMateForm["gender"] === "M"
                          ? "border border-black"
                          : ""
                      }`}
                      onClick={needRoomMateFormOnChangeHandler}
                    >
                      M
                    </div>
                    <div
                      data-gender="F"
                      name="gender"
                      className={`bg-[#D9D9D9] rounded-[10px] py-2 px-8 text-center cursor-pointer ${
                        needRoomMateForm["gender"] === "F"
                          ? "border border-black"
                          : ""
                      }`}
                      onClick={needRoomMateFormOnChangeHandler}
                    >
                      F
                    </div>
                  </div>
                </div>
                <div className="containerr max-h-[80px]">
                  <div className="label">Prefered Block*</div>
                  <div className="flex gap-6">
                    <div className="bg-[#D9D9D9] rounded-[10px] flex items-center">
                      <select
                        name="prefferedBlocks"
                        value={needRoomMateForm["preferedBlocks"][0]}
                        onChange={(e) => needRoomMateFormOnChangeHandler(e, 0)}
                        className="bg-[transparent] w-[100%] py-3 px-6 outline-none focus:border-none cursor-pointer"
                      >
                        {blocks.map((block) => (
                          <option key={block} value={block}>
                            {block}
                          </option>
                          //   <option>{`${block}-Block`}</option>
                        ))}
                      </select>
                    </div>

                    <div className="hidden bg-[#D9D9D9] rounded-[10px] flex items-center ">
                      <select
                        name="prefferedBlocks"
                        value={needRoomMateForm["preferedBlocks"][1]}
                        onChange={(e) => needRoomMateFormOnChangeHandler(e, 1)}
                        className="bg-[transparent] w-[100%] py-3 px-6 outline-none focus:border-none cursor-pointer "
                      >
                        {blocks.map((block) => (
                          <option key={block} value={block}>
                            {block}
                          </option>
                          //   <option>{`${block}-Block`}</option>
                        ))}
                      </select>
                    </div>

                    <div className="hidden bg-[#D9D9D9] rounded-[10px] flex items-center">
                      <select
                        name="prefferedBlocks"
                        value={needRoomMateForm["preferedBlocks"][2]}
                        onChange={(e) => needRoomMateFormOnChangeHandler(e, 2)}
                        className="bg-[transparent] w-[100%] py-3 px-6 outline-none focus:border-none cursor-pointer "
                      >
                        {blocks.map((block) => (
                          <option key={block} value={block}>
                            {block}
                          </option>
                          //   <option>{`${block}-Block`}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex flex-col mb-6 ">
                  <span>Habits*</span>
                  <input
                    name="habits"
                    value={needRoomMateForm["habits"]}
                    onChange={needRoomMateFormOnChangeHandler}
                    className="bg-[#D9D9D9] rounded-[8px] mt-1 h-[3rem] p-4"
                  />
                </div>
              </div>
            </div>
            <div className="containerr w-[100%] mb-6 mt-6 md:mt-2">
              <div className="label">Description</div>
              <textarea
                rows="3"
                className="w-[100%] focus:border-none outline-none"
                name="description"
                value={needRoomMateForm["description"]}
                onChange={needRoomMateFormOnChangeHandler}
              ></textarea>
            </div>
            <div className="w-[100%] flex justify-center mb-6 mt-6">
              <button
                onClick={needRoomMateSubmitHandler}
                className="mx-auto bg-[#06105A] px-[2rem] py-[0.75rem] text-white rounded-[8px] self-start disabled:hover:cursor-not-allowed"
              >
                {" "}
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </Fragment>
  );
}

export default NeedRoom;
