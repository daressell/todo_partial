import { Button, Form, Input, Row, Col, Space, Typography, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import axios from "axios";
import "../../translation/index.js";
import i18n from "i18next";
import { RoleContext } from "../context/RoleContext.js";

export const Registration = ({ t, links, handleError, handleChangeLanguage, alertMessage }) => {
  const navigate = useNavigate();
  const [, setRole] = useContext(RoleContext);
  const { Option } = Select;

  useEffect(() => {
    localStorage.removeItem("accessToken");
    setRole("");
  }, []);

  const onFinish = async (values) => {
    try {
      const newUser = values;
      if (!newUser.login.match(/^(?=.*[A-Za-z])[\w]{4,100}$/)) throw new Error(t("errLoginValid"));

      if (!newUser.password.match(/^(?=.*[A-Za-z])(?=.*\d)[\w]{8,100}$/))
        throw new Error(t("errPassValid"));

      if (newUser.password !== newUser.confirm) throw new Error(t("errConfirm"));

      await axios.post(links.registration, newUser);
      alertMessage(t("successRigistr"), "success");
      navigate("/login");
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
            <h2>{t("registration")}</h2>
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
            <Form.Item
              name="confirm"
              label={t("confirm")}
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: t("mesInputConfirm"),
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords that you entered do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Row>
              <Col span={8} offset={5}>
                <Space>
                  <Button type="primary" htmlType="submit">
                    {t("signUp")}
                  </Button>
                  <Typography.Text>
                    <Link to="/login">{t("signInLink")}</Link>
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
