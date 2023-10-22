import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ListingContext } from "../../Context/listing-context.jsx";
import "../Cards/Cards.css";
import "./Selecting.css";
import Modal from "../../Components/Modal/Modal";
import Modal2 from "../Modal/Modal2";

export const Listing = () => {
  const { showModal, showModal2, selectRoommateDetail, selectRoomDetail } =
    useContext(ListingContext);

  const profileData = JSON.parse(localStorage.getItem("profile"));

  const [following, setFollowing] = useState(new Set());
  const [likeRoom, setLikeRoom] = useState(new Set());
  const [roommatePosts, setRoommatePosts] = useState([]);
  const [roomPosts, setRoomPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://roommate-finder-theta.vercel.app/user/${profileData.user._id}`
        );

        console.log("Profile fetched:", response.data);
        const { likesRoommate, likesRoom } = response.data;

        setFollowing(new Set(likesRoommate));
        setLikeRoom(new Set(likesRoom));

        console.log("Following fetched:", likesRoommate, likesRoom);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchData();
  }, [profileData.user._id]);
  useEffect(() => {
    axios
      .get("https://roommate-finder-theta.vercel.app/roommate/all")
      .then((response) => {
        const roommatePostsWithUserDetailsPromises = response.data.map(
          (post) => {
            return axios
              .get(
                `https://roommate-finder-theta.vercel.app/user/${post.userId}`
              )
              .then((userResponse) => {
                const userDetails = userResponse.data;
                return {
                  ...post,
                  userDetails,
                };
              });
          }
        );

        return Promise.all(roommatePostsWithUserDetailsPromises);
      })
      .then((roommatePostsWithUserDetails) => {
        setRoommatePosts(roommatePostsWithUserDetails);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get("https://roommate-finder-theta.vercel.app/room/all")
      .then((response) => {
        const roomPostsWithUserDetailsPromises = response.data.map((post) => {
          return axios
            .get(`https://roommate-finder-theta.vercel.app/user/${post.userId}`)
            .then((userResponse) => {
              const userDetails = userResponse.data;
              return {
                ...post,
                userDetails,
              };
            });
        });

        return Promise.all(roomPostsWithUserDetailsPromises);
      })
      .then((roomPostsWithUserDetails) => {
        setRoomPosts(roomPostsWithUserDetails);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roommateResponse, roomResponse] = await Promise.all([
          axios.get("https://roommate-finder-theta.vercel.app/roommate/all"),
          axios.get("https://roommate-finder-theta.vercel.app/room/all"),
        ]);

        const roommateData = roommateResponse.data.map((post) => ({
          ...post,
          userDetails: {},
        }));

        const roomData = roomResponse.data.map((post) => ({
          ...post,
          userDetails: {},
        }));

        setRoommatePosts(roommateData);
        setRoomPosts(roomData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const matchingRoommateData = roommatePosts.filter((post) =>
    following.has(post._id)
  );

  const matchingRoomData = roomPosts.filter((post) => likeRoom.has(post._id));

  console.log("Following:", following);
  console.log("Like Room:", likeRoom);
  console.log("Roommate Posts:", matchingRoommateData);
  console.log("MatchingRoom Posts:", matchingRoomData);

  return (
    <div className="listing">
      <div className="listing-buttons">
        <button className="activelisting">
          <p className="listing-text">Your Selections</p>
        </button>
      </div>
      <div className="profiletab-hr">
        <hr />
      </div>
      <div className="tab-content">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {showModal && <Modal />}
            <div className="cards">
              {matchingRoommateData.map((item) => (
                <div className="each-card">
                  <span className="cards">
                    <div className="main-card">
                      <div className="card-details">
                        <div className="card-img"></div>
                        <div className="card-info">
                          <div className="card-informatios">
                            <div className="card-name">
                              {item.userDetails.firstname ?? "Null_Fname"}{" "}
                              {item.userDetails.lastname ?? "Null_Lname"}
                            </div>
                            <div className="card-add">
                              <img
                                src="./image/checkbox.png"
                                alt=""
                                style={{ height: "24px", width: "24px" }}
                              />
                            </div>
                          </div>
                          <div className="card-preference">
                            <div className="card-rank">
                              <div className="card-preference-title">Rank</div>
                              <div className="card-preference-content">
                                {" "}
                                {item.rank}
                              </div>
                            </div>
                            <div className="card-block">
                              <div className="card-preference-title">
                                Prefered Block
                              </div>
                              <div className="card-preference-content">
                                {" "}
                                {item.preferredBlock}
                              </div>
                            </div>
                            <div className="card-bed">
                              <div className="card-preference-title">
                                Prefered Bed Type
                              </div>
                              <div className="card-preference-content">
                                {" "}
                                {item.preferredBed}
                              </div>
                            </div>
                          </div>
                          <div className="card-downers">
                            <div className="card-year">
                              <div className="card-preference-title">Year</div>
                              <div className="card-preference-Year">year</div>
                            </div>
                            <div className="card-gender">
                              <div className="card-preference-title">
                                Gender
                              </div>
                              <div className="card-preference-Gender">
                                {" "}
                                {item.gender}
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
                          onClick={() => selectRoommateDetail(item.desc)}
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

              {showModal2 && <Modal2 />}

              {matchingRoomData.map((item) => (
                <div div className="each-card">
                  <span className="cards">
                    <div className="main-card">
                      <div className="card-details">
                        <div className="card-img"></div>
                        <div className="card-info">
                          <div className="card-informatios">
                            <div className="card-name">
                              {item.preferredBlock}
                            </div>
                            <div className="card-add">
                              <img
                                src="./image/checkbox.png"
                                alt=""
                                style={{ height: "24px", width: "24px" }}
                              />
                            </div>
                          </div>
                          <div className="card-preference">
                            <div className="card-rank">
                              <div className="card-preference-title">Rank</div>
                              <div className="card-preference-content">
                                {item.rank}
                              </div>
                            </div>
                            <div className="card-block">
                              <div className="card-preference-title">
                                Prefered Bed
                              </div>
                              <div className="card-preference-content">
                                {item.preferredBed}
                              </div>
                            </div>
                            <div className="card-bed">
                              <div className="card-preference-title">
                                Remaining
                              </div>
                              <div className="card-preference-content">
                                remaining
                              </div>
                            </div>
                          </div>
                          <div className="card-downers2">
                            <div className="card-year">
                              <div className="card-preference-title">Year</div>
                              <div className="card-preference-Year">year</div>
                            </div>
                            <div className="card-gender">
                              <div className="card-preference-title">
                                Gender
                              </div>
                              <div className="card-preference-Gender">
                                {item.gender}
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
                          onClick={() => selectRoomDetail(item.desc)}
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
