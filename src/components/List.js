import Item from "./Item";
import {Col} from "antd"

export const List = ({items, handleDeleteItem, handleEditItem}) => {
  return(
    <Col span={24} className="items">
      {items.map(item => {
        return(
          <div key={item.id}>
            <Item item = {item} handleDeleteItem = {handleDeleteItem} handleEditItem={handleEditItem}/>
          </div>
        )
      })}
    </Col>
  )  
}