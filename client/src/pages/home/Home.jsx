import { useContext } from "react";
import "./home.scss";
import { AuthContext } from "../../context/Authcontext";

export const Home = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="homePage">
      <div className="textContainer">
        <div className="wrapper">
          <h2> SPORTPEER </h2>
          <h1 className="title">
            Connect with Buddies & vibe more on your sport favorite sport
          </h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos
            explicabo suscipit cum eius, iure est nulla animi consequatur
            facilis id pariatur fugit quos laudantium temporibus dolor ea
          </p>
        </div>
      </div>
    </div>
  );
};
