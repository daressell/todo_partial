import { Col, Row, Checkbox, Button, Typography, Spin, notification } from "antd"
import { DeleteOutlined } from "@ant-design/icons"
import { useState } from "react"
import axios from "axios"
import moment from "moment"

const link = "http://localhost:3000/item"

const Item = ({ item, handleDeleteItem, getItems }) => {
  const [name, setName] = useState(item.name)
  const [done, setDone] = useState(item.status)
  const [loading, setLoading] = useState(false)

  const handleEditName = async (newName) => {
    try {
      setLoading(true)
      newName = newName.trim().replace(/\s+/g, " ")
      await axios.patch(`${link}/${item.uuid}`, {
        name: newName,
      })
      setName(newName)
      setLoading(false)
    } catch (err) {
      alertMessege(err.response.data.message, "error")
      setLoading(false)
    }
  }

  const handleChangeStatus = async (newStatus) => {
    try {
      setLoading(true)
      await axios.patch(`${link}/${item.uuid}`, {
        status: newStatus,
      })
      setDone(newStatus)
      getItems()
      setLoading(false)
    } catch (err) {
      alertMessege(err.response.data.message, "error")
      setLoading(false)
    }
  }

  const alertMessege = (text, type) => {
    notification.open({
      description: text,
      type: type,
    })
  }

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
              handleDeleteItem(item.uuid)
            }}
          ></Button>
        </Col>
      </Row>
    </Spin>
  )
}

export default Item
