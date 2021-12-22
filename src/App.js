import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { MainContent } from "./components/MainContent";
import { notification } from "antd";
import { Registration } from "./components/authorize/Registration";
import { Login } from "./components/authorize/Login";
import { AdminPanel } from "./components/admin/AdminPanel";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import "moment/locale/ru.js";
import { useState } from "react";

const hostName = process.env.REACT_APP_LINK;

const links = {
  getTodos: `${hostName}/todos`,
  postTodo: `${hostName}/todo`,
  login: `${hostName}/login`,
  registration: `${hostName}/registration`,
  todoMoved: `${hostName}/todoMoved`,
  users: `${hostName}/users`,
  todosOfUser: `${hostName}/todosOfUser`,
};

function App() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [role, setRole] = useState();

  const handleError = (err) => {
    if (err.response?.data === "not admin") {
      navigate("/todos");
      localStorage.setItem("role", "user");
    }
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
              setRole={setRole}
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
              setRole={setRole}
              links={links}
              handleError={handleError}
              handleChangeLanguage={handleChangeLanguage}
              alertMessage={alertMessage}
            />
          }
        />
        <Route
          path="/users"
          element={
            <AdminPanel
              t={t}
              role={role}
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
              role={role}
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
