//import logo from './logo.svg';
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import { AuthContext } from "./helpers/AuthContext";

import { useState, useEffect } from "react";
import axios from "axios";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false });
    navigate("/login");
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        {/* <Router> */}
        <div className="navbar">
          {!authState.status ? (
            <>
              <Link to="/login"> Login</Link>
              <Link to="/registration"> Registration</Link>
            </>
          ) : (
            <>
              <Link to="/"> Go to Home</Link>
              <Link to="/createPost"> Create A Post</Link>
            </>
          )}

          <div className="Title">CYBER FORT </div>

          <div className="loggedInContainer">
            {authState.status && (
              <>
                <Link to={`/profile/${authState.id}`}>
                  <h1>{authState.username}</h1>
                </Link>
                <button onClick={logout}>Logout</button>
              </>
            )}

            {/* <Link to={`/profile/${authState.id}`}>
                <h1>{authState.username} </h1>
              </Link>
              {authState.status && <button onClick={logout}> Logout</button>} */}
          </div>
        </div>

        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/login" Component={Login} />
          <Route path="/registration" Component={Registration} />
          <Route path="/profile/:id" Component={Profile} />
          <Route path="/ChangePassword" Component={ChangePassword} />
          <Route path="/createPost" Component={CreatePost} />
          <Route path="/post/:id" Component={Post} />

          <Route path="*" Component={PageNotFound} />
        </Routes>
        {/* </Router> */}
      </AuthContext.Provider>
    </div>
  );
}

export default App;
