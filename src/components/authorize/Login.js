import { Button, Form, Input, Row, Col, Space, Typography, Select } from "antd";
import axios from "axios";
import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../translation/index.js";
import i18n from "i18next";
import { RoleContext } from "../context/RoleContext.js";

export const Login = ({ t, links, handleError, handleChangeLanguage }) => {
  const navigate = useNavigate();
  const [, setRole] = useContext(RoleContext);
  const { Option } = Select;
  useEffect(() => {
    localStorage.removeItem("accessToken");
    setRole("");
  }, []);

  const onFinish = async (values) => {
    try {
      const user = values;
      const result = await axios.post(links.login, user);
      localStorage.setItem("accessToken", result.data.token);
      setRole(result.data.role);
      navigate("/todos");
    } catch (err) {
      handleError(err);
    }
  };

  const onFinishFailed = (errorInfo) => {
    errorInfo.errorFields.forEach((err) => {
      errorInfo.message = err.errors[0];
      handleError(errorInfo);
    });
  };

  return (
    <>
      <Row type="flex" justify="center" align="middle" style={{ minHeight: "80vh" }}>
        <Col xxl={12} xl={13} lg={16} md={20} sm={22} xs={23}>
          <Row justify="center">
            <h2>{t("login")}</h2>
          </Row>
          <Form
            name="basic"
            labelCol={{
              span: 5,
            }}
            wrapperCol={{
              span: 16,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label={t("login")}
              name="login"
              rules={[
                {
                  required: true,
                  message: t("mesInputLogin"),
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={t("password")}
              name="password"
              rules={[
                {
                  required: true,
                  message: t("mesInputPassword"),
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Row>
              <Col offset={5} span={8}>
                <Space>
                  <Button type="primary" htmlType="submit">
                    {t("signIn")}
                  </Button>
                  <Typography.Text>
                    <Link to="/registration">{t("signUpLink")}</Link>
                  </Typography.Text>
                </Space>
              </Col>
              <Col span={8}>
                <Row justify="end">
                  <Select defaultValue={i18n.language} onChange={handleChangeLanguage}>
                    <Option value="ru">{t("ru")}</Option>
                    <Option value="en">{t("en")}</Option>
                  </Select>
                </Row>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </>
  );
};
