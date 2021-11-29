import Item from "./Item";

export const List = ({items, handleDeleteItem, handleEditItem}) => {
  return(
    <ul className="items">
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