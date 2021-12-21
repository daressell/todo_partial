import { useNavigate } from "react-router-dom";
import { Menu, Select } from "antd";
import i18n from "i18next";
import "../translation/index.js";

export const MenuPanel = ({ t, handleChangeLanguage }) => {
  const { Option } = Select;
  const navigate = useNavigate();

  const handleClickMenu = ({ key }) => {
    if (key === "logout") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
    }
    if (key.includes("/")) navigate(key);
  };

  return (
    <Menu
      onClick={handleClickMenu}
      selectedKeys={[]}
      mode="horizontal"
      theme="dark"
      style={{ display: "flex", justifyContent: "end" }}
    >
      <Menu.Item key="/todos">{t("myTodos")}</Menu.Item>
      {localStorage.getItem("role") === "admin" && (
        <Menu.Item key="/users">{t("listUsers")}</Menu.Item>
      )}
      <Menu.Item key="languages">
        <Select defaultValue={i18n.language} onChange={handleChangeLanguage}>
          <Option value="ru">{t("ru")}</Option>
          <Option value="en">{t("en")}</Option>
        </Select>
      </Menu.Item>
      <Menu.Item key="/login" danger={true}>
        {t("quit")}
      </Menu.Item>
    </Menu>
  );
};
