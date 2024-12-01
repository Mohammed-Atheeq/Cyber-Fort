import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

function Profile() {
  let { id } = useParams();
  const [username, setUsername] = useState("");
  const [listOfPosts, setLisOfPost] = useState([]);
  const { authState } = useContext(AuthContext);
  let navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3001/auth/info/${id}`).then((response) => {
      setUsername(response.data.username);
    });

    axios.get(`http://localhost:3001/posts/byuserId/${id}`).then((response) => {
      setLisOfPost(response.data);
    });
  }, []);

  return (
    <div className="profilePageContainer">
      <div className="basicInfo">
        <h1> {username} </h1>
        {authState.username === username && (
          <button
            className="buttons"
            onClick={() => {
              navigate("/changepassword");
            }}
          >
            Change My Password
          </button>
        )}
      </div>
      <div className="listOfPosts">
        {listOfPosts.map((value, key) => {
          return (
            <div key={key} className="post">
              <div className="title"> {value.title} </div>
              <div
                className="body"
                onClick={() => {
                  navigate(`/post/${value.id}`);
                }}
              >
                {value.postText}
              </div>
              <div className="footer">
                <div className="username">{value.username}</div>
                <div className="buttons">
                  <ThumbUpIcon />

                  <label> {value.Likes.length}</label>
                </div>
              </div>
            </div>
          );
        })}
        ;
      </div>
    </div>
  );
}

export default Profile;
