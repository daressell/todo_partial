import Item from "./Item";

export const List = ({items, handleDeleteItem}) => {
  return(
    <ul className="items">
      {items.map((item, index) => {
        return(
          <li className="item" key={item.id}>
            <Item items={items} item = {item} index={index} handleDeleteItem = {handleDeleteItem} />
          </li>          
        )
      })}
    </ul>    
  )  
}