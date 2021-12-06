import { Col, Row, Checkbox, Button, Typography, Spin, notification } from "antd"
import { DeleteOutlined } from "@ant-design/icons"
import { useState } from "react"
import axios from "axios"

const link = "http://localhost:3000/item"

const Item = ({ item, handleDeleteItem, getItems }) => {
  const [name, setName] = useState(item.name)
  const [done, setDone] = useState(item.status)
  const [loading, setLoading] = useState(false)
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const curDate = new Date(Date.parse(item.createdAt))

  const timeObj = {}
  timeObj.date = `${curDate.getDate()} ${months[curDate.getMonth()]}`
  let createdTime = ""
  curDate.getHours().toString().length === 2
    ? (createdTime += curDate.getHours().toString())
    : (createdTime += "0" + curDate.getHours().toString())
  createdTime += ":"
  curDate.getMinutes().toString().length === 2
    ? (createdTime += curDate.getMinutes().toString())
    : (createdTime += "0" + curDate.getMinutes().toString())
  timeObj.time = createdTime

  const handleEditName = async (newName) => {
    try {
      setLoading(true)
      const reg = /[\wа-яА-Я]/
      if (newName.match(reg)) {
        await axios.patch(`${link}/${item.uuid}`, {
          name: newName,
        })
        setName(newName)
        setLoading(false)
      }
    } catch (err) {
      alertMessege(err.response.data.message, "error")
      setLoading(false)
    }
  }

  const handleChangeStatus = async (newDone) => {
    try {
      setLoading(true)
      await axios.patch(`${link}/${item.uuid}`, {
        status: newDone,
      })
      setDone(newDone)
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
        <Col span={5}>{timeObj.time + " " + timeObj.date}</Col>
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
