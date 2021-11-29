import {Col, Row, Checkbox, Button, Typography} from "antd"
import { DeleteOutlined } from '@ant-design/icons';
import { useState } from "react";
import axios from "axios";

const Item = ({item, handleDeleteItem}) => {
  const [name, setName] = useState(item.name);
  const [status, setStatus] = useState(item.status);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const curDate = new Date(Date.parse(item.createdAt))

  const timeObj = {}
  timeObj.date = `${curDate.getDate()} ${months[curDate.getMonth()]}`
  let createdTime = ''    
  curDate.getHours().toString().length === 2 ? createdTime += curDate.getHours().toString() : createdTime += '0' + curDate.getHours().toString()
  createdTime += ':'
  curDate.getMinutes().toString().length === 2 ? createdTime += curDate.getMinutes().toString() : createdTime += '0' + curDate.getMinutes().toString()
  timeObj.time = createdTime

  const handleEditItem = (newName = name, newStatus = status) => {
    newName === item.name && (newStatus = !newStatus)
    const reg = /[\wа-яА-Я]/;    
    if(newName.match(reg)){      
      axios.patch(`https://todo-api-learning.herokuapp.com/v1/task/6/${item.uuid}`, 
        { 
          name: newName, 
          done : status
        }
      ).then(res => {
          console.log(res);
          if(res.status === 200){
            setName(newName)
            setStatus(newStatus)
          }
          else console.log(res);
        }
      )
    }
  }

  return (
    <Row 
    justify='center' 
    className='item' 
    gutter={[20, 0]}
    align='middle'
    style={{padding: 20}}
    >
      <Col span={3} className='item-data'>
        <Checkbox
          checked={status ? true : false}
          onChange={() => handleEditItem(name, status)}
        ></Checkbox>
      </Col>
      <Col span={14} className='item-data'>
        <Typography.Text
          className="item-name"
          ellipsis={true}
          editable={{onChange: handleEditItem}}
        >
          {name}
        </Typography.Text>
      </Col>
      <Col span={5}>
        {timeObj.time + ' ' + timeObj.date}
      </Col>
      <Col span={2}>
        <Button
          danger={true}
          type='primary'
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteItem(item.uuid)}
        >
        </Button>
      </Col>
    </Row>
  );
}
 
export default Item;