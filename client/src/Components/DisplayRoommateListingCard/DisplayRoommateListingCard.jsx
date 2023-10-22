import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "../Cards/Cards.css";
import Modal from "../../Components/Modal/Modal";
import { ListingContext } from "../../Context/listing-context";

function DisplayRoommateListingCard() {
  const { showModal, selectRoommateDetail } = useContext(ListingContext);
  const profileData = JSON.parse(localStorage.getItem("profile"));
  const [roommates, setRoommates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user_Id = profileData.user._id;
        console.log("user_Id recorded:", user_Id);

        const requestData = {
          userId: user_Id,
        };

        console.log("requestData:", requestData);

        const response = await axios.post(
          `https://roommate-finder-theta.vercel.app/roommate/my/${user_Id}`,
          requestData
        );
        setRoommates(response.data);
      } catch (error) {
        console.error("Error fetching roommates:", error);
      }
    };

    fetchData();
  }, [profileData.user._id]);

  const deleteRoommate = async (roommate_id) => {
    try {
      const user_Id = profileData.user._id;
      const requestBody = {
        userId: user_Id,
      };

      const response = await axios.delete(
        `https://roommate-finder-theta.vercel.app/roommate/${roommate_id}`,
        {
          data: requestBody,
        }
      );

      console.log("Roommate deleted:", response);
      setRoommates((prevRoommates) =>
        prevRoommates.filter((roommate) => roommate._id !== roommate_id)
      );
    } catch (error) {
      console.error("Error deleting roommate:", error);
    }
  };

  return (
    <>
      {showModal && <Modal />}
      {roommates.map((roommate) => (
        <div className="each-card" key={roommate.id}>
          <span className="cards">
            <div className="main-card">
              <div className="card-details">
                <div className="card-img"></div>
                <div className="card-info">
                  <div className="card-informatios">
                    <div className="card-name">Name</div>
                    <div
                      className="card-add"
                      onClick={() => deleteRoommate(roommate._id)}
                    >
                      <img
                        src="./image/minus-icon.png"
                        alt=""
                        style={{ height: "24px", width: "24px" }}
                      />
                    </div>
                  </div>
                  <div className="card-preference">
                    <div className="card-rank">
                      <div className="card-preference-title">Rank</div>
                      <div className="card-preference-content">
                        {roommate.rank}
                      </div>
                    </div>
                    <div className="card-block">
                      <div className="card-preference-title">
                        Prefered Block
                      </div>
                      <div className="card-preference-content">
                        {roommate.preferredBlock}
                      </div>
                    </div>
                    <div className="card-bed">
                      <div className="card-preference-title">
                        Prefered Bed Type
                      </div>
                      <div className="card-preference-content">
                        {roommate.preferredBed}
                      </div>
                    </div>
                  </div>
                  <div className="card-downers">
                    <div className="card-year">
                      <div className="card-preference-title">Year</div>
                      <div className="card-preference-Year">
                        {roommate.year}
                      </div>
                    </div>
                    <div className="card-gender">
                      <div className="card-preference-title">Gender</div>
                      <div className="card-preference-Gender">
                        {roommate.gender}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-hr">
                <hr />
              </div>
              <div className="card-habits-section">
                <div className="card-habit">Habits</div>
                <div
                  className="card-habit-details"
                  onClick={() => selectRoommateDetail(roommate.desc)}
                >
                  <div>
                    <img
                      src="./image/desc.png"
                      alt=""
                      style={{ height: "18px", width: "18px" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </span>
        </div>
      ))}
    </>
  );
}

export default DisplayRoommateListingCard;
