import { Layout, Breadcrumb, Spin } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { MenuPanel } from "../MenuPanel";
import { ListOfUsers } from "./ListOfUsers";
import { ListOfTodos } from "./ListOfTodos";
import moment from "moment";

export const AdminPanel = ({ t, links, handleError, handleChangeLanguage }) => {
  const { Header, Sider, Content } = Layout;
  const [usersOnPage, setUsersOnPage] = useState([]);
  const [todosOfUser, setTodosOfUser] = useState([]);
  const [userUuid, setUserUuid] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getUsers = async () => {
    try {
      setLoading(true);
      const result = await axios.get(links.users, {
        headers: {
          Authorization: localStorage.getItem("accessToken"),
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
      setUsersOnPage(result.data.users);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      handleError(err);
    }
  };

  const getTodosOfUser = async (userId) => {
    try {
      const result = await axios.get(`${links.todosOfUser}?userId=${userId}`, {
        headers: {
          Authorization: localStorage.getItem("accessToken"),
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
      const todos = result.data.todos.map((todo) => {
        todo.status = todo.status ? t("doneTodo") : t("undoneTodo");
        todo.createdAt = moment(todo.createdAt).format("lll");
        return todo;
      });
      setTodosOfUser(todos);
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("role") !== "admin") return navigate("/todos");
    getUsers();
  }, []);

  const handleSetUser = ({ key }) => {
    setUserUuid(key);
    getTodosOfUser(key);
  };

  return (
    <Spin spinning={loading}>
      <MenuPanel t={t} handleChangeLanguage={handleChangeLanguage} />
      <Layout>
        <Sider style={{ height: "95%", width: "200px", position: "fixed", overflow: "auto" }}>
          <ListOfUsers t={t} users={usersOnPage} handleSetUser={handleSetUser} />
        </Sider>
      </Layout>
      <Layout style={{ marginLeft: "200px" }}>
        <Header style={{ backgroundColor: "#e6f7ff" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>{t("userId")}</Breadcrumb.Item>
            <Breadcrumb.Item>{userUuid}</Breadcrumb.Item>
          </Breadcrumb>
        </Header>
        <Content>
          <ListOfTodos t={t} todos={todosOfUser} />
        </Content>
      </Layout>
    </Spin>
  );
};
