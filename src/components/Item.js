import { useState } from "react";
import {Col, Row, Checkbox, Button, Typography} from "antd"
import { DeleteOutlined } from '@ant-design/icons';

const Item = ({item, handleDeleteItem, handleEditItem}) => {
  const [status, setStatus] = useState(item.status)

  const handleEditName = (newName) => {
    const reg = /[\wа-яА-Я]/;
    if(newName.match(reg)){
      item.name = newName
      handleEditItem('name', newName, item.id)
    }
  }

  return (
    <Row justify='center' className='item'>
      <Col span={3} className='item-data'>
        <Checkbox
          checked={status === 'done' ? true : false}
          onChange={() => {
                            if(status === 'done'){
                              setStatus('undone');
                              handleEditItem('status', 'undone', item.id)
                            }
                            else{
                              setStatus('done');
                              handleEditItem('status', 'done', item.id)
                            }
                            }}
        ></Checkbox>
      </Col>
      <Col span={14} className='item-data'>
        <Typography.Text
          editable={{onChange: handleEditName}}
        >
          {item.name}
        </Typography.Text>
      </Col>
      <Col span={5}>
        {`${item.createdAt.time} ${item.createdAt.date}`}
      </Col>
      <Col span={2}>
        <Button
          danger={true}
          type='primary'
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteItem(item.id)}
        >
        </Button>        
      </Col>
    </Row>
  );
}
 
export default Item;