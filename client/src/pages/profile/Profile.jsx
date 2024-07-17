import "./profile.scss";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/Authcontext";
import { request } from "../../lib/req";

export const Profile = () => {
  const { updateUser, currentUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await request.post("/auth/logout", {}, { withCredentials: true });
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const sport = ["badminton", "football", "hockey"];

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>Bio</h1>

            <button onClick={handleLogout}>Logout</button>
          </div>
          <div className="info">
            <span>
              <img src={"noavatar.jpg"} alt="" />
            </span>
            <span>
              My Username: <b>{currentUser.username}</b>
            </span>
            <span>
              My E-mail: <b>{currentUser.email}</b>
            </span>

            <span>
              My bio: <b>{currentUser.bio}</b>
            </span>

            <span>
              My phone number: <b>{currentUser.phone}</b>
            </span>

            <span>
              My Sport Interest: <b>{sport.join(", ")}</b>
            </span>
            <Link to="/profile/updateSettings">
              <button>Update Profile</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

//todo add avatar
//write the connection query thath joins the sport together with the user profile
