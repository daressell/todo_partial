import { Col, Row, Checkbox, Button, Typography, Spin } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import axios from "axios";
import moment from "moment";

const link = "http://localhost:5000/todo";

const Item = ({ item, handleDeleteItem, getItems, handleError }) => {
  const [name, setName] = useState(item.name);
  const [done, setDone] = useState(item.status);
  const [loading, setLoading] = useState(false);

  const handleEditName = async (newName) => {
    try {
      setLoading(true);
      newName = newName.trim().replace(/\s+/g, " ");
      const accessToken = localStorage.getItem("accessToken");
      await axios.patch(
        `${link}/${item.uuid}`,
        {
          name: newName,
        },
        {
          headers: {
            Authorization: accessToken,
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );
      setName(newName);
      setLoading(false);
    } catch (err) {
      handleError(err);
      setLoading(false);
    }
  };

  const handleChangeStatus = async (newStatus) => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      await axios.patch(
        `${link}/${item.uuid}`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: accessToken,
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );
      setDone(newStatus);
      getItems();
      setLoading(false);
    } catch (err) {
      handleError(err);
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <Row
        justify="center"
        className="item"
        gutter={[20, 0]}
        align="middle"
        style={{ padding: 20, marginTop: 10 }}
      >
        <Col span={3} className="item-data">
          <Checkbox
            checked={done ? true : false}
            onChange={() => handleChangeStatus(!done)}
          ></Checkbox>
        </Col>
        <Col span={14} className="item-data">
          <Typography.Text
            className="item-name"
            ellipsis={true}
            editable={{ onChange: handleEditName }}
          >
            {name}
          </Typography.Text>
        </Col>
        <Col span={5}>{moment(item.createdAt).format("LLL")}</Col>
        <Col span={2}>
          <Button
            danger={true}
            type="primary"
            icon={<DeleteOutlined />}
            onClick={() => {
              handleDeleteItem(item.uuid);
            }}
          ></Button>
        </Col>
      </Row>
    </Spin>
  );
};

export default Item;
