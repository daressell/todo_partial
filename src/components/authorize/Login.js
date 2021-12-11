import { Button, Form, Input, Row, Space, Typography } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const link_login = "http://localhost:5000/login";

export const Login = (handleError) => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const newUser = values;
      const accessToken = localStorage.getItem("accessToken");
      const result = await axios.post(link_login, newUser, {
        headers: {
          Authorization: accessToken,
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
      localStorage.setItem("accessToken", result.data.token);
      navigate("/todos");
    } catch (err) {
      handleError(err.response.data);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
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
    </>
  );
};
