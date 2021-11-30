import {Col, Row, Checkbox, Button, Typography, Spin} from "antd"
import { DeleteOutlined } from '@ant-design/icons';
import { useState } from "react";
import axios from "axios";

const Item = ({item, handleDeleteItem, getItems}) => {
  const [name, setName] = useState(item.name);
  const [done, setDone] = useState(item.done);
  const [loadingDone, setLoadingDone] = useState(false)
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const curDate = new Date(Date.parse(item.createdAt))

  const timeObj = {}
  timeObj.date = `${curDate.getDate()} ${months[curDate.getMonth()]}`
  let createdTime = ''    
  curDate.getHours().toString().length === 2 ? createdTime += curDate.getHours().toString() : createdTime += '0' + curDate.getHours().toString()
  createdTime += ':'
  curDate.getMinutes().toString().length === 2 ? createdTime += curDate.getMinutes().toString() : createdTime += '0' + curDate.getMinutes().toString()
  timeObj.time = createdTime

  const handleEditName = async (newName) => {
    try{
      setLoadingDone(true)
      const reg = /[\wа-яА-Я]/;  
      if (newName.match(reg)){
        await axios.patch(`https://todo-api-learning.herokuapp.com/v1/task/6/${item.uuid}`, 
          { 
            name: newName, 
            done : done
          }
        )        
        setName(newName)
        setLoadingDone(false)
      }
    } catch(err){

    }
  }

  const handleChangeStatus = async (newDone) => {
    try{
      setLoadingDone(true)
      await axios.patch(`https://todo-api-learning.herokuapp.com/v1/task/6/${item.uuid}`, 
        { 
          name: name, 
          done : newDone
        }
      )
      setDone(newDone)
      getItems()
      setLoadingDone(false)
    } catch(err){
      
    }    
  }

  return (
    <Spin spinning={loadingDone}> 
    <Row 
    justify='center' 
    className='item' 
    gutter={[20, 0]}
    align='middle'
    style={{padding: 20, marginTop: 10}}
    >
      <Col span={3} className='item-data'>
        <Checkbox
          checked={done ? true : false}
          onChange={() => handleChangeStatus(!done)}
        ></Checkbox>
        
        
      </Col>
      <Col span={14} className='item-data'>
        <Typography.Text
          className="item-name"
          ellipsis={true}
          editable={{onChange: handleEditName}}
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
          onClick={() => {handleDeleteItem(item.uuid); setLoadingDone(true)}}
        >
        </Button>
      </Col>
    </Row>
    </Spin>
  );
}
 
export default Item;