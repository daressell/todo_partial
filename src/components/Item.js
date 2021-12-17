import { Col, Row, Checkbox, Button, Typography, Spin } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import moment from "moment";
import i18n from "i18next";

const Item = ({ t, item, handleEditItem, handleDeleteItem, handleError }) => {
  const [name, setName] = useState(item.name);
  const [done, setDone] = useState(item.status);
  const [loading, setLoading] = useState(false);
  moment.locale(i18n.language);

  const editName = async (newName) => {
    try {
      setLoading(true);
      newName = newName.trim().replace(/\s+/g, " ");

      if (!newName.match(/[\w]/)) throw new Error(t("errMeaninglessContent"));
      if (newName.length < 2 || newName.length > 100) throw new Error(t("errItemName"));

      await handleEditItem({ name: newName }, item.uuid);
      setName(newName);
      setLoading(false);
    } catch (err) {
      handleError(err);
      setLoading(false);
    }
  };

  const changeStatus = async (newStatus) => {
    try {
      setLoading(true);
      await handleEditItem({ status: newStatus }, item.uuid);
      setDone(newStatus);
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
          <Checkbox checked={done ? true : false} onChange={() => changeStatus(!done)}></Checkbox>
        </Col>
        <Col span={14} className="item-data">
          <Typography.Text className="item-name" ellipsis={true} editable={{ onChange: editName }}>
            {name}
          </Typography.Text>
        </Col>
        <Col span={5}>{moment(item.createdAt).format("lll")}</Col>
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
