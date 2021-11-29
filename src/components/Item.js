import {Col, Row, Checkbox, Button, Typography} from "antd"
import { DeleteOutlined } from '@ant-design/icons';
import { useState } from "react";

const Item = ({item, handleDeleteItem, handleEditItem}) => {
  const [name, setName] = useState(item.name);

  // this handler doesnt work with useEffect in App.js
  // this handler change array itemsOnPage in List.js because using map method which return new array

  // this handler can be use for edit status of item
  // but it is doestn change itemsOnPage filtering items
  // while not trigger useEffect
  const handleEditName = (newName) => {
    const reg = /[\wа-яА-Я]/;
    if(newName.match(reg)){
      item.name = newName
      setName(newName)
    }
  }

  const handleEditStatus = () => {
    if(item.status === 'done'){
      handleEditItem('status', 'undone', item.id)
    }
    else{
      handleEditItem('status', 'done', item.id)
    }    
  }

  return (
    <Row justify='center' className='item' gutter={[20, 0]}>
      <Col span={3} className='item-data'>
        <Checkbox
          checked={item.status === 'done' ? true : false}
          onChange={handleEditStatus}
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