import { useState } from "react";

const Item = ({items, item, index, handleDeleteItem}) => {
  const [checkedState, setCheckedState] = useState(
    items.map(el => {return el.done})
  );

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    items[position].done = !items[position].done
    setCheckedState(updatedCheckedState);
  };
  return ( 
    <div>
      <div className="block"> 
        <input
          type="checkbox"
          checked={item.done}
          onChange={() => handleOnChange(index)}
        />
        <span className="item-name">{item.name}</span>
      </div>        
      <div className="block">
        <span>{item.date}</span>
        <div className="action" onClick={() => handleDeleteItem(item.id)}>
          <i className="fas fa-trash"></i>
        </div>
      </div>
    </div>
      
  );
}
 
export default Item;