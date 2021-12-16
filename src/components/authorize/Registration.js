import { Button, Form, Input, Row, Col, Space, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "../../translation/index.js";

export const Registration = ({ links, handleError, alertMessage }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    localStorage.removeItem("accessToken");
  }, []);

  const onFinish = async (values) => {
    try {
      const newUser = values;
      if (!newUser.login.match(/^(?=.*[A-Za-z])[\w]{4,100}$/))
        throw new Error("bad name validation, need 4-100 symbols and use only a-b and numbers");

      if (!newUser.password.match(/^(?=.*[A-Za-z])(?=.*\d)[\w]{8,100}$/))
        throw new Error("need more difficult password, uisng only a-b and numbers");

      if (newUser.password !== newUser.confirm)
        throw new Error("confirm and passwor must be equal");

      await axios.post(links.registration, newUser);
      alertMessage("Success registration", "success");
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

            <Form.Item
              wrapperCol={{
                offset: 5,
                span: 16,
              }}
            >
              <Space>
                <Button type="primary" htmlType="submit">
                  {t("signUp")}
                </Button>
                <Typography.Text>
                  <Link to="/login">{t("signIn")}</Link>
                </Typography.Text>
              </Space>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
};
