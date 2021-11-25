import Item from "./Item";

export const List = ({items, alertMessege, handleDeleteItem, handleEditItem}) => {
  return(
    <ul className="items">
      {alertMessege && <span className="alert-empty-items">{alertMessege}</span>}
      {items.map(item => {
        return(
          <li className="item" key={item.id}>
            <Item item = {item} handleDeleteItem = {handleDeleteItem} handleEditItem={handleEditItem}/>
          </li>
        )
      })}
    </ul>
  )  
}