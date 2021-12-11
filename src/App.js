import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { MainContent } from "./components/MainContent";
import { Menu, Row, Col, notification } from "antd";
import { Registration } from "./components/authorize/Registration";
import { Login } from "./components/authorize/Login";

function App() {
  const navigate = useNavigate();

  const handleClickMenu = ({ key }) => {
    if (key === "logout") {
      localStorage.removeItem("accessToken");
      navigate("/login");
    }
  };

  const handleError = (err) => {
    alertMessege(err.message, "error");
  };

  const alertMessege = (text, type) => {
    notification.open({
      description: text,
      type: type,
    });
  };

  return (
    <>
      <Menu
        onClick={handleClickMenu}
        selectedKeys={[]}
        mode="horizontal"
        theme="dark"
        style={{ display: "flex", justifyContent: "end" }}
      >
        {localStorage.getItem("accessToken") && (
          <Menu.Item key="logout" danger={true}>
            Выйти
          </Menu.Item>
        )}
      </Menu>
      <Row type="flex" justify="center" align="middle" style={{ minHeight: "80vh" }}>
        <Col xxl={12} xl={13} lg={16} md={20} sm={22} xs={23}>
          <Routes>
            <Route
              path="/login"
              element={<Login handleError={handleError} />}
              render={() => localStorage.removeItem("accessToken")}
            />
            <Route
              path="/registration"
              element={<Registration handleError={handleError} />}
              render={() => localStorage.removeItem("accessToken")}
            />
            <Route path="/todos" element={<MainContent handleError={handleError} />} />
            <Route path="*" element={<Navigate replace to="/todos" />} />
          </Routes>
        </Col>
      </Row>
    </>
  );
}

export default App;
