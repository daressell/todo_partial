import Item from "./Item";

export const List = ({items, handleDeleteItem, handleEditItem, handleChangeStatus}) => {  
  return(
    <ul className="items">
      {items.map(item => {
        return(
          <li className="item" key={item.id}>
            <Item item = {item} handleDeleteItem = {handleDeleteItem} handleEditItem={handleEditItem} handleChangeStatus={handleChangeStatus}/>
          </li>
        )
      })}
    </ul>
  )  
}