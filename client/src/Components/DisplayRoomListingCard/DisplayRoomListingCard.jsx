import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "../Cards/Cards.css";
import { ListingContext } from "../../Context/listing-context";
import Modal2 from "../Modal/Modal2";

function DisplayRoomListingCard() {
  const { showModal2, selectRoomDetail } = useContext(ListingContext);
  const profileData = JSON.parse(localStorage.getItem("profile"));
  const [rooms, setRooms] = useState([]);

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
          `https://roommate-finder-theta.vercel.app/room/my/${user_Id}`,
          requestData
        );
        setRooms(response.data);
        console.log("Room Data:", response.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchData();
  }, [profileData.user._id]);

  const deleteRoom = async (room_id) => {
    try {
      const user_Id = profileData.user._id;
      const requestBody = {
        userId: user_Id,
      };

      const response = await axios.delete(
        `https://roommate-finder-theta.vercel.app/room/${room_id}`,
        {
          data: requestBody,
        }
      );

      console.log("Room deleted:", response);
      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== room_id));
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };
  return (
    <>
      {showModal2 && <Modal2 />}
      {rooms.map((room) => (
        <div className="each-card" key={room.id}>
          <div className="cards">
            <div className="main-card">
              <div className="card-details">
                <div className="card-img"></div>
                <div className="card-info">
                  <div className="card-informatios">
                    <div className="card-name">{room.preferredBlock} Block</div>
                    <div
                      className="card-add"
                      onClick={() => deleteRoom(room._id)}
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
                      <div className="card-preference-content">{room.rank}</div>
                    </div>
                    <div className="card-block">
                      <div className="card-preference-title">
                        Prefered Block
                      </div>
                      <div className="card-preference-content">
                        {room.preferredBlock}
                      </div>
                    </div>
                    <div className="card-bed">
                      <div className="card-preference-title">Remaining</div>
                      <div className="card-preference-content">
                        {room.preferredBed}
                      </div>
                    </div>
                  </div>
                  <div className="card-downers2">
                    <div className="card-year">
                      <div className="card-preference-title">Year</div>
                      <div className="card-preference-Year">{room.year}</div>
                    </div>
                    <div className="card-gender">
                      <div className="card-preference-title">Gender</div>
                      <div className="card-preference-Gender">
                        {room.gender}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-hr">
                <hr />
              </div>
              <div className="card-habits-section">
                <div className="card-habit">Leader</div>
                <div
                  className="card-habit-details"
                  onClick={() => selectRoomDetail(room.desc)}
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
          </div>
        </div>
      ))}
    </>
  );
}

export default DisplayRoomListingCard;
