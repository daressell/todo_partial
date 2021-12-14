import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { MainContent } from "./components/MainContent";
import { notification } from "antd";
import { Registration } from "./components/authorize/Registration";
import { Login } from "./components/authorize/Login";

const hostName = "https://postgres-heroku-application.herokuapp.com";

const links = {
  getTodos: `${hostName}/todos`,
  postTodo: `${hostName}/todo`,
  login: `${hostName}/login`,
  registration: `${hostName}/registration`,
};

function App() {
  const navigate = useNavigate();

  const handleError = (err) => {
    if (err.response?.data) {
      alertMessage(err.response.data, "error");
      return err.response?.data?.includes("jwt") && navigate("/login");
    }
    if (err.message) return alertMessage(err.message, "error");
  };

  const alertMessage = (text, type) => {
    notification.open({
      description: text,
      type: type,
    });
  };

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={<Login links={links} handleError={handleError} />}
        />
        <Route
          path="/registration"
          element={
            <Registration
              links={links}
              handleError={handleError}
              alertMessage={alertMessage}
            />
          }
        />
        <Route
          path="/todos"
          element={
            <MainContent
              links={links}
              handleError={handleError}
              alertMessage={alertMessage}
            />
          }
        />
        <Route path="*" element={<Navigate replace to="/todos" />} />
      </Routes>
    </>
  );
}

export default App;
