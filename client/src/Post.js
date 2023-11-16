import React from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
function Post({ _id, title, summary, cover, createdAt, author }) {
  return (
    <div>
      <div className="post">
        <Link to={`/post/${_id}`}>
          <div className="image">
            <img src={"https://blogie-back-end.onrender.com/" + cover} alt="" />
          </div>
        </Link>

        <div class="text">
          <Link to={`/post/${_id}`}>
            <h2>{title}</h2>
          </Link>
          <p class="info">
            <a class="author" href="">
              {author.username}
            </a>
            <time>{format(new Date(createdAt), "MMM d, yyyy HH:mm")}</time>
          </p>
          <p class="summary">{summary}</p>
        </div>
      </div>
    </div>
  );
}

export default Post;
