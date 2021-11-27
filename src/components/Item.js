import {Col, Row, Checkbox, Button, Typography} from "antd"
import { DeleteOutlined } from '@ant-design/icons';

const Item = ({item, handleDeleteItem, handleEditItem}) => {

  const handleEditName = (newName) => {
    const reg = /[\wа-яА-Я]/;
    if(newName.match(reg)){
      item.name = newName
      handleEditItem('name', newName, item.id)
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
    <Row justify='center' className='item'>
      <Col span={3} className='item-data'>
        <Checkbox
          checked={item.status === 'done' ? true : false}
          onChange={handleEditStatus}
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