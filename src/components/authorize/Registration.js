import { Button, Form, Input, Row, Space, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const link_registration = "http://localhost:5000/registration";

export const Registration = ({ handleError, alertMessage, setToken }) => {
  const navigate = useNavigate();
  setToken("");

  const onFinish = async (values) => {
    try {
      const newUser = values;
      if (!newUser.login?.match(/^(?=.*[A-Za-z])(?=.*\d)[\w]{8,}$/))
        throw new Error("bad login");
      await axios.post(link_registration, newUser);
      alertMessage("Success registration", "success");
      navigate("/login");
    } catch (err) {
      handleError(err);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Row justify="center">
        <h2>Registration</h2>
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
          name="confirm"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
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
              Sign up
            </Button>
            <Typography.Text>
              <Link to="/login">Sign in</Link>
            </Typography.Text>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};
