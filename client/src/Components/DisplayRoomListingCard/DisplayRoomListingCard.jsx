import React, { Component } from "react";
import axios from "axios";
import "../Cards/Cards.css";

class DisplayRoomListingCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rooms: [],
    };

    this.profileData = JSON.parse(localStorage.getItem("profile"));
  }

  componentDidMount() {
    const user_Id = this.profileData.user._id;
    console.log("user_Id recorded:", user_Id);

    const requestData = {
      userId: user_Id,
    };

    console.log("requestData:", requestData);

    axios
      .post(
        `https://roommate-finder-theta.vercel.app/room/my/${user_Id}`,
        requestData
      )
      .then((response) => {
        this.setState({ rooms: response.data });
        console.log("Room Data:", response.data );
      })
      .catch((error) => {
        console.error("Error fetching rooms:", error);
      });
    }
      deleteRoom = (room_id) => {
        const user_Id = this.profileData.user._id;
        const requestBody = {
          userId: user_Id,
        };

        axios
          .delete(`https://roommate-finder-theta.vercel.app/room/${room_id}`, {
            data: requestBody,
          })
          .then((response) => {
            console.log("Room deleted:", response);
            this.setState((prevState) => ({
              rooms: prevState.rooms.filter((room) => room.id !== room_id),
            }));
          })
          .catch((error) => {
            console.error("Error deleting room:", error);
          });
      };

  render() {
    const { rooms } = this.state;
    return (
      <>
        {rooms.map((room) => (
          <div div className="each-card" key={room.id}>
            <span className="cards">
              <div className="main-card">
                <div className="card-details">
                  <div className="card-img"></div>
                  <div className="card-info">
                    <div className="card-informatios">
                      <div className="card-name">Room Details</div>
                      <div className="card-add" onClick={() => this.deleteRoom(room._id)}>
                        <img
                          src="./image/delete-icon.png"
                          alt=""
                          style={{ height: "24px", width: "24px" }}
                        />
                      </div>
                    </div>
                    <div className="card-preference">
                      <div className="card-rank">
                        <div className="card-preference-title">Rank</div>
                        <div className="card-preference-content">
                          {room.rank}
                        </div>
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
                        <div className="card-preference-title">
                          Prefered Bed Type
                        </div>
                        <div className="card-preference-content">
                          {room.preferredBed}
                        </div>
                      </div>
                    </div>
                    <div className="card-downers">
                      <div className="card-year">
                        <div className="card-preference-title">Year</div>
                        <div className="card-preference-Year">year</div>
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
                  <div className="card-habit"></div>
                </div>
              </div>
            </span>
          </div>
        ))}
      </>
    );
  }
}

export default DisplayRoomListingCard;
