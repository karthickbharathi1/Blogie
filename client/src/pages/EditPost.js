import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetch(`https://blogie-back-end.onrender.com/post/${id}`)
      .then((response) => response.json())
      .then((postInfo) => {
        console.log(postInfo);
        setTitle(postInfo.title);
        setContent(postInfo.content);
        setFiles(postInfo.cover);
        setSummary(postInfo.summary);
      })
      .catch((error) => {
        console.error("Error fetching post:", error);
      });
  }, [id]);

  async function updatePost(e) {
    e.preventDefault();

    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("id", id);

    if (files?.[0]) {
      data.set("file", files?.[0]);
    }

    try {
      const response = await fetch(
        `https://blogie-back-end.onrender.com/post`,
        {
          method: "PUT",
          body: data,
          credentials: "include",
        }
      );

      if (response.ok) {
        setRedirect(true);
      } else {
        console.error(`Failed to update post. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <form onSubmit={updatePost} className="edit-post">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />
      <input type="file" onChange={(e) => setFiles(e.target.files)} />
      <Editor onChange={setContent} value={content} />
      <button style={{ marginTop: "5px" }}>Update post</button>
    </form>
  );
}
