import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { MainContent } from "./components/MainContent";
import { notification } from "antd";
import { Registration } from "./components/authorize/Registration";
import { Login } from "./components/authorize/Login";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import "moment/locale/ru.js";

const hostName = "http://localhost:5000";

const links = {
  getTodos: `${hostName}/todos`,
  postTodo: `${hostName}/todo`,
  login: `${hostName}/login`,
  registration: `${hostName}/registration`,
  todosMoved: `${hostName}/todosMoved`,
};

function App() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleError = (err) => {
    if (err.response?.data) {
      alertMessage(err.response.data, "error");
      return err.response?.data?.includes("jwt") && navigate("/login");
    }
    if (err.message) return alertMessage(err.message, "error");
  };

  const handleChangeLanguage = (res) => {
    i18n.changeLanguage(res);
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
          element={
            <Login
              t={t}
              links={links}
              handleError={handleError}
              handleChangeLanguage={handleChangeLanguage}
            />
          }
        />
        <Route
          path="/registration"
          element={
            <Registration
              t={t}
              links={links}
              handleError={handleError}
              handleChangeLanguage={handleChangeLanguage}
              alertMessage={alertMessage}
            />
          }
        />
        <Route
          path="/todos"
          element={
            <MainContent
              t={t}
              links={links}
              handleError={handleError}
              handleChangeLanguage={handleChangeLanguage}
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
