import React, { useContext, useState } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/Authcontext";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);

  if (currentUser === 1) fetch();

  return (
    <nav>
      <div className="left">
        <Link to="/" className="logo">
          <img src="/" alt="" />
          <span>sportpeer</span>
        </Link>
        <Link to="/">buddies</Link>
        <Link to="/">discover</Link>
        {currentUser && <Link to="/settings">settings</Link>}
      </div>
      <div className="right">
        {currentUser ? (
          <div className="user">
            <img src="/noavatar.jpg" alt="" />
            <span>{currentUser.username}</span>
            <Link to="/profile" className="profile">
              <span>Profile</span>
            </Link>
          </div>
        ) : (
          <>
            <Link to="/login">Sign in</Link>
            <Link to="/register" className="register">
              Sign up
            </Link>
          </>
        )}
        {/* Menu Icon for mobile or hidden menu */}
        <div className="menuIcon" onClick={() => setOpen((prev) => !prev)}>
          <img src="/menu.png" alt="Menu" />
        </div>
        {/* Dropdown or expanded menu */}
        <div className={open ? "menu active" : "menu"}>
          <Link to="/">Buddies</Link>
          <Link to="/">Discover</Link>
          <Link to="/settings">Settings</Link>
          {!currentUser && (
            <>
              <Link to="/login">Sign in</Link>
              <Link to="/register">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
