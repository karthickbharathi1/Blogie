import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Header() {
  // const [username, setUserNmae] = useState(null);
  const { userInfo, setUserIndo } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);
  const location = useLocation();
  useEffect(() => {
    fetch("https://blogie-back-end.onrender.com/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserIndo(userInfo.username);
      });
      console.log(userInfo.username);
    });
  }, []);

  function logout() {
    fetch("https://blogie-back-end.onrender.com/logout", {
      credentials: "include",
      method: "POST",
    });
    console.log("Helllo");

    // if (response.ok) {
    console.log("karthick");
    // setRedirect(true);

    setUserIndo(null);
  }
  // if (redirect) {
  //   return (
  //     <div>
  //       <header>
  //         <a class="logo" href="#">
  //           My Logo
  //         </a>
  //         <nav>
  //           <Link to="/login">Login</Link>
  //           <Link to="/register">Register</Link>
  //         </nav>
  //       </header>
  //       <Navigate to={"/login"} />;
  //     </div>
  //   );
  // }

  const username = userInfo?.username;
  const isRootPath = location.pathname === "/";
  return (
    <div class="head">
      <header>
        <a class="logo" href="#">
          BLOGIE
        </a>
        <nav>
          {isRootPath && username ? (
            <>
              <Link to="/create">Create new post</Link>
              <a onClick={logout}>Logout ({username})</a>
            </>
          ) : (
            !username && (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )
          )}
        </nav>
      </header>
    </div>
  );
}
