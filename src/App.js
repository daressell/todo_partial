import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { MainContent } from "./components/MainContent";
import { Menu, Row, Col, notification } from "antd";
import { Registration } from "./components/authorize/Registration";
import { Login } from "./components/authorize/Login";
import { useState } from "react";

function App() {
  const navigate = useNavigate();
  const [token, setToken] = useState();

  const handleClickMenu = ({ key }) => {
    if (key === "logout") {
      setToken("");
      navigate("/login");
    }
  };

  const handleError = (err) => {
    err.message && alertMessage(err.message, "error");
    err.response?.data && alertMessage(err.response.data, "error");
    err.response?.data?.includes("jwt") && navigate("/login");
  };

  const alertMessage = (text, type) => {
    notification.open({
      description: text,
      type: type,
    });
  };

  return (
    <>
      {token && (
        <Menu
          onClick={handleClickMenu}
          selectedKeys={[]}
          mode="horizontal"
          theme="dark"
          style={{ display: "flex", justifyContent: "end" }}
        >
          <Menu.Item key="logout" danger={true}>
            Выйти
          </Menu.Item>
        </Menu>
      )}

      <Row type="flex" justify="center" align="middle" style={{ minHeight: "80vh" }}>
        <Col xxl={12} xl={13} lg={16} md={20} sm={22} xs={23}>
          <Routes>
            <Route
              path="/login"
              element={<Login handleError={handleError} setToken={setToken} />}
            />
            <Route
              path="/registration"
              element={
                <Registration
                  handleError={handleError}
                  alertMessage={alertMessage}
                  setToken={setToken}
                />
              }
            />
            <Route
              path="/todos"
              element={
                <MainContent
                  handleError={handleError}
                  alertMessage={alertMessage}
                  token={token}
                />
              }
            />
            <Route path="*" element={<Navigate replace to="/todos" />} />
          </Routes>
        </Col>
      </Row>
    </>
  );
}

export default App;
