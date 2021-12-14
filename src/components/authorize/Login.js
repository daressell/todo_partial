import { Button, Form, Input, Row, Col, Space, Typography } from "antd";
import axios from "axios";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Login = ({ links, handleError }) => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("accessToken");
  }, []);

  const onFinish = async (values) => {
    try {
      const user = values;
      const result = await axios.post(links.login, user);
      localStorage.setItem("accessToken", result.data.token);
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
            <h2>Login</h2>
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
              label="Login"
              name="login"
              rules={[
                {
                  required: true,
                  message: "Please input your login!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
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
                  Sign in
                </Button>
                <Typography.Text>
                  <Link to="/registration">Sign up</Link>
                </Typography.Text>
              </Space>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
};
