import React, { useContext, useEffect, useState } from "react";
import Post from "../Post";
import { UserContext } from "../UserContext";
function IndexPage() {
  const { userInfo, setUserIndo } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch("https://blogie-app.onrender.com/post").then((response) => {
      response.json().then((posts) => {
        setPosts(posts);
      });
    });
  }, []);
  // function logout() {
  //   fetch("http://localhost:4000/logout", {
  //     credentials: "include",
  //     method: "POST",
  //   });
  //   setUserIndo(null);
  // }
  //27.4.4.129/32
  return (
    <div className="post-page-main">
      {/* {userInfo && <button onClick={logout}>Log out</button>} */}
      {posts.length > 0 && posts.map((post) => <Post {...post} />)}
    </div>
  );
}

export default IndexPage;
