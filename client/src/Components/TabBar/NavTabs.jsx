import React, { Component, useEffect, useState, useContext } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "./styles.css";
import "../Cards/Cards.css";
import { ListingContext } from "../../Context/listing-context";
import Modal from "../../Components/Modal/Modal";
import Modal2 from "../Modal/Modal2";

function DisplayRoommateCard() {
  const profileData = JSON.parse(localStorage.getItem("profile"));
  const user = useSelector((state) => state.authReducer.authData);
  const [roommatePosts, setRoommatePosts] = useState([]);
  const [roomPosts, setRoomPosts] = useState([]);
  const [filteredRoommatePosts, setFilteredRoommatePosts] = useState([]);
  const [filteredRoomPosts, setFilteredRoomPosts] = useState([]);
  const [userGender, setUserGender] = useState([]);
  const [userId, setUserId] = useState([]);
  const [following, setFollowing] = useState([]);
  const [likeRoom, setLikeRoom] = useState([]);
  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedBlock, setSelectedBlock] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const {
    addToCart2,
    addToCart,
    showModal,
    showModal2,
    selectRoommateDetail,
    seletedroommatedetail,
    selectRoomDetail,
    seletedroomdetail,
  } = useContext(ListingContext);

  useEffect(() => {
    fetchFollowing();
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
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  // Depricated function

  const fetchFollowing = () => {
    axios
      .get(
        `https://roommate-finder-theta.vercel.app/user/${profileData.user._id}`
      )
      .then((response) => {
        console.log("Profile fetched:", response.data);
        const followingUserIds = response.data.likesRoommate;
        const likeRoomIds = response.data.likesRoom;
        const userGender = response.data.gender;
        const userId = response.data._id;
        setFollowing(followingUserIds);
        setLikeRoom(likeRoomIds);
        setUserGender(userGender);
        setUserId(userId);
        console.log(
          "Following fetched:",
          followingUserIds,
          likeRoomIds,
          userGender
        );
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      });
  };

  const filterByGenderAndBlock = (gender, block, year) => {
    setSelectedGender(gender);
    setSelectedBlock(block);
    setSelectedYear(year);
  };

  useEffect(() => {
    const filterData = () => {
      console.log("Selected Gender:", selectedGender);
      console.log("Selected Block:", selectedBlock);
      console.log("Selected Year:", selectedYear);

      const parseDate = (dateString) => new Date(dateString);

      const filteredRoommateData = roommatePosts
        .filter((post) => {
          console.log("Post Year:", post.year);
          return (
            (selectedGender === "All" || post.gender === selectedGender) &&
            (selectedBlock === "All" ||
              post.preferredBlock === selectedBlock) &&
            (selectedYear === "All" || post.year === selectedYear)
          );
        })
        .sort((a, b) => parseDate(b.updatedAt) - parseDate(a.updatedAt));

      const filteredRoomData = roomPosts
        .filter((post) => {
          return (
            (selectedGender === "All" || post.gender === selectedGender) &&
            (selectedBlock === "All" ||
              post.preferredBlock === selectedBlock) &&
            (selectedYear === "All" || post.year === selectedYear)
          );
        })
        .sort((a, b) => parseDate(b.updatedAt) - parseDate(a.updatedAt));

      console.log("Filtered Roommate Data:", filteredRoommateData);
      console.log("Filtered Room Data:", filteredRoomData);
      const combinedData = [...filteredRoommateData, ...filteredRoomData];
      setFilteredRoommatePosts(filteredRoommateData);
      setFilteredRoomPosts(filteredRoomData);
    };

    filterData();
  }, [selectedGender, selectedBlock, selectedYear, roommatePosts, roomPosts]);

  console.log("user data: ", user);
  console.log("user specific data: ", profileData);
  console.log("User Id:", userId);
  console.log("User Gender:", userGender);

  async function likeRoommate(otherUserId) {
    try {
      const usersResponse = await axios.get(
        "https://roommate-finder-theta.vercel.app/roommate/all"
      );

      const otherUserData = usersResponse.data.find(
        (user) => user._id === otherUserId
      );

      if (otherUserData) {
        const otherUserGender = otherUserData.gender;
        const roommateuserId = otherUserData.userId;
        console.log(otherUserGender);
        if (roommateuserId !== userId) {
          if (
            (userGender === "M" && otherUserGender === "M") ||
            (userGender === "F" && otherUserGender === "F")
          ) {
            let myUserId = user?.user?._id;
            let requestBody = {
              roommateId: otherUserId,
            };

            let result = await axios.put(
              `https://roommate-finder-theta.vercel.app/user/${myUserId}/likesRoommate`,
              requestBody
            );

            console.log("result: ", result);

            if (result.status === 200) {
              // Update the check-icon immediately
              const updatedFollowing = [...following];
              if (!updatedFollowing.includes(otherUserId)) {
                updatedFollowing.push(otherUserId);
                setFollowing(updatedFollowing);
              }
            }
          } else {
            alert("Broo.. In VIT we don't have coed hostels.");
          }
        } else {
          alert("You can't select your own post.");
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function RoomLiking(otherRoomId) {
    try {
      const roomResponse = await axios.get(
        "https://roommate-finder-theta.vercel.app/room/all"
      );

      const roomDataResponse = roomResponse.data.find(
        (room) => room._id === otherRoomId
      );

      if (roomDataResponse) {
        const roomGender = roomDataResponse.gender;
        const roomuserId = roomDataResponse.userId;
        if (roomuserId !== userId) {
          if (
            (userGender === "M" && roomGender === "M") ||
            (userGender === "F" && roomGender === "F")
          ) {
            let myUserId = user?.user?._id;
            let requestBody = {
              roomId: otherRoomId,
            };

            let result = await axios.put(
              `https://roommate-finder-theta.vercel.app/user/${myUserId}/likesroom`,
              requestBody
            );

            console.log("result: ", result);

            if (result.status === 200) {
              // Update the check-icon immediately
              const updatedLikeRoom = [...likeRoom];
              if (!updatedLikeRoom.includes(otherRoomId)) {
                updatedLikeRoom.push(otherRoomId);
                setLikeRoom(updatedLikeRoom);
              }
            }
          } else {
            alert("Broo.. In VIT we don't have coed hostels.");
          }
        } else {
          alert("You can't select your own post.");
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className="tabs">
        <Tabs
          filterByGenderAndBlock={filterByGenderAndBlock}
          selectedGender={selectedGender}
          selectedBlock={selectedBlock}
          selectedYear={selectedYear}
        >
          <Tab label="Tab 1">
            {showModal && <Modal />}
            <div className="cards">
              {isLoading ? (
                <div className="loading-text">Loading...</div>
              ) : (
                (filteredRoommatePosts.length >= 0
                  ? filteredRoommatePosts
                  : roommatePosts
                ).map((post) => (
                  <div className="each-card" key={post.id}>
                    <span className="cards">
                      <div className="main-card">
                        <div className="card-details">
                          <div className="card-img"></div>
                          <div className="card-info">
                            <div className="card-informatios">
                              <div className="card-name">
                                {post.userDetails.firstname ?? "Null_Fname"}{" "}
                                {post.userDetails.lastname ?? "Null_Lname"}
                              </div>
                              {userGender && (
                                <div
                                  className="card-add"
                                  onClick={() =>
                                    likeRoommate(post._id, post.gender)
                                  }
                                >
                                  {following.includes(post._id) ? (
                                    <img
                                      src="./image/checkbox.png"
                                      alt=""
                                      style={{ height: "24px", width: "24px" }}
                                    />
                                  ) : (
                                    <img
                                      src="./image/add-icon.png"
                                      alt=""
                                      style={{ height: "24px", width: "24px" }}
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="card-preference">
                              <div className="card-rank">
                                <div className="card-preference-title">
                                  Rank
                                </div>
                                <div className="card-preference-content">
                                  {post.rank}
                                </div>
                              </div>
                              <div className="card-block">
                                <div className="card-preference-title">
                                  Prefered Block
                                </div>
                                <div className="card-preference-content">
                                  {post.preferredBlock}
                                </div>
                              </div>
                              <div className="card-bed">
                                <div className="card-preference-title">
                                  Prefered Bed Type
                                </div>
                                <div className="card-preference-content">
                                  {post.preferredBed}
                                </div>
                              </div>
                            </div>
                            <div className="card-downers">
                              <div className="card-year">
                                <div className="card-preference-title">
                                  Year
                                </div>
                                <div className="card-preference-Year">
                                  {post.year}
                                </div>
                              </div>
                              <div className="card-gender">
                                <div className="card-preference-title">
                                  Gender
                                </div>
                                <div className="card-preference-Gender">
                                  {post.gender}
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
                            onClick={() => selectRoommateDetail(post.desc)}
                          >
                            <div className="detail-box">
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
                ))
              )}
            </div>
          </Tab>
          <Tab label="Tab 2">
            {showModal2 && <Modal2 />}
            <div className="cards">
              {isLoading ? (
                <div className="loading-text">Loading...</div>
              ) : (
                (filteredRoomPosts.length >= 0
                  ? filteredRoomPosts
                  : roomPosts
                ).map((post) => (
                  <div div className="each-card" key={post.id}>
                    <span className="cards">
                      <div className="main-card">
                        <div className="card-details">
                          <div className="card-img"></div>
                          <div className="card-info">
                            <div className="card-informatios">
                              <div className="card-name">
                                {post.preferredBlock} Block
                              </div>
                              <div
                                className="card-add"
                                onClick={() =>
                                  RoomLiking(post._id, post.gender)
                                }
                              >
                                {likeRoom.includes(post._id) ? (
                                  <img
                                    src="./image/checkbox.png"
                                    alt=""
                                    style={{ height: "24px", width: "24px" }}
                                  />
                                ) : (
                                  <img
                                    src="./image/add-icon.png"
                                    alt=""
                                    style={{ height: "24px", width: "24px" }}
                                  />
                                )}
                              </div>
                            </div>
                            <div className="card-preference">
                              <div className="card-rank">
                                <div className="card-preference-title">
                                  Rank
                                </div>
                                <div className="card-preference-content">
                                  {post.rank}
                                </div>
                              </div>
                              <div className="card-block">
                                <div className="card-preference-title">
                                  Prefered Bed
                                </div>
                                <div className="card-preference-content">
                                  {post.preferredBed}
                                </div>
                              </div>
                              <div className="card-bed">
                                <div className="card-preference-title">
                                  Remaining
                                </div>
                                <div className="card-preference-content">
                                  {post.preferredBed}
                                </div>
                              </div>
                            </div>
                            <div className="card-downers2">
                              <div className="card-year">
                                <div className="card-preference-title">
                                  Year
                                </div>
                                <div className="card-preference-Year">
                                  {post.year}
                                </div>
                              </div>
                              <div className="card-gender">
                                <div className="card-preference-title">
                                  Gender
                                </div>
                                <div className="card-preference-Gender">
                                  {post.gender}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="card-hr">
                          <hr />
                        </div>
                        <div className="card-habits-section">
                          <div className="card-habit">
                            For Description - Click on the button:
                          </div>
                          <div
                            className="card-habit-details"
                            onClick={() => selectRoomDetail(post.desc)}
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
                ))
              )}
            </div>
          </Tab>
        </Tabs>
      </div>
    </>
  );
}

class Tabs extends Component {
  state = {
    activeTab: this.props.children[0].props.label,
  };

  changeTab = (tab) => {
    this.setState({ activeTab: tab });
  };

  render() {
    let content;
    let buttons = [];
    const { gender_sorting } = this.props;
    const { filterByGenderAndBlock } = this.props;
    const { selectedGender } = this.props;
    const { selectedBlock } = this.props;
    const { selectedYear } = this.props;

    return (
      <div>
        {React.Children.map(this.props.children, (child) => {
          buttons.push(child.props.label);
          if (child.props.label === this.state.activeTab)
            content = child.props.children;
        })}

        <TabButtons
          activeTab={this.state.activeTab}
          buttons={buttons}
          changeTab={this.changeTab}
          genderSorting={gender_sorting}
          filterByGenderAndBlock={filterByGenderAndBlock}
          selectedGender={selectedGender}
          selectedBlock={selectedBlock}
          selectedYear={selectedYear}
        />
        <div className="tab-content">{content}</div>
      </div>
    );
  }
}

const TabButtons = ({
  buttons,
  changeTab,
  activeTab,
  selectedGender,
  selectedBlock,
  selectedYear,
  filterByGenderAndBlock,
}) => {
  return (
    <div className="navtab-main">
      <div className="tab-buttons">
        {buttons.map((button) => {
          return (
            <button
              className={button === activeTab ? "active" : "nonactive"}
              onClick={() => changeTab(button)}
            >
              {button === activeTab ? (
                <React.Fragment>
                  {button === "Tab 1" ? (
                    <span className="tab-elements">
                      <div className="roomate-icon">
                        <img src="./image/roommatesicon.png" alt="" />
                        <div className="tab-text">Roommates</div>
                      </div>
                    </span>
                  ) : (
                    <span className="tab-elements">
                      <div className="roomate-icon">
                        <img src="./image/bed2.png" alt="" />
                        <div className="tab-text">Rooms</div>
                      </div>
                    </span>
                  )}
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {button === "Tab 1" ? (
                    <span className="tab-elements">
                      <div className="roomate-icon">
                        <img src="./image/roommatesicon2.png" alt="" />
                      </div>
                      <div className="tab-text">Roommates</div>
                    </span>
                  ) : (
                    <span className="tab-elements">
                      <div className="roomate-icon">
                        <img src="./image/bed.png" alt="" />
                      </div>
                      <div className="tab-text">Rooms</div>
                    </span>
                  )}
                </React.Fragment>
              )}
            </button>
          );
        })}
        <div className="tab-dropdownbuttons">
          <div className="custom-select">
            <select
              onChange={(e) =>
                filterByGenderAndBlock(
                  selectedGender,
                  selectedBlock,
                  e.target.value
                )
              }
            >
              <option hidden value="Year">
                Year
              </option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="All">All</option>
            </select>
          </div>
          <div className="custom-select">
            <select
              onChange={(e) =>
                filterByGenderAndBlock(
                  selectedGender,
                  e.target.value,
                  selectedYear
                )
              }
            >
              <option hidden value="Block">
                Block
              </option>
              <option value="A">A-Block</option>
              <option value="B">B-Block</option>
              <option value="C">C-Block</option>
              <option value="D">D-Block</option>
              <option value="E">E-Block</option>
              <option value="F">F-Block</option>
              <option value="G">G-Block</option>
              <option value="H">H-Block</option>
              <option value="I">I-Block</option>
              <option value="J">J-Block</option>
              <option value="K">K-Block</option>
              <option value="L">L-Block</option>
              <option value="M">M-Block</option>
              <option value="N">N-Block</option>
              <option value="P">P-Block</option>
              <option value="Q">Q-Block</option>
              <option value="R">R-Block</option>
              <option value="All">All</option>
            </select>
          </div>
          <div className="custom-select-2">
            <select
              onChange={(e) =>
                filterByGenderAndBlock(
                  e.target.value,
                  selectedBlock,
                  selectedYear
                )
              }
            >
              <option hidden value="Gender">
                Gender
              </option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="All">All</option>
            </select>
          </div>
        </div>
      </div>
      <div className="navtab-hr">
        <hr />
      </div>
    </div>
  );
};

const Tab = (props) => {
  return <React.Fragment>{props.children}</React.Fragment>;
};

export default DisplayRoommateCard;
