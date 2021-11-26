import Item from "./Item";
import {Col, Row} from "antd"

export const List = ({items, handleDeleteItem, handleEditItem}) => {
  return(
    <Row gutter={[0, 20]} className="items">
      {items.map(item => {
        return(
          <Col span={24} key={item.id} >
            <Item item = {item} handleDeleteItem = {handleDeleteItem} handleEditItem={handleEditItem}/>
          </Col>
        )
      })}
    </Row>
  )  
}