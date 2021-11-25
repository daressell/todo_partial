import { useState } from "react";

const Item = ({item, handleDeleteItem, handleEditItem}) => {
  const [inputField, setInputField] = useState(false);
  const [newName, setNewName] = useState(item.name);
  const [status, setStatus] = useState(item.status)

  const changeText = (e) => {
    setNewName(e.target.value)
  }

  const handleClick = (e) => {
    if(e.target.className === 'item-details' || e.target.className === 'name'){
      inputField ? setInputField(false) : setInputField(true)
    }
  }

  const handleActionKey = (e, newName, itemId) => {
    const reg = /[\wа-яА-Я]/;
    if(e.key === 'Escape' || e.key === 'Enter'){
      if(!newName.match(reg)) {setNewName(item.name);  setInputField(false); return void(0)};
      e.preventDefault()
      e.key === 'Enter' ? handleEditItem('name', newName, itemId) : setNewName(item.name);
      setInputField(false)
    }
  }

  return ( 
    <div className="item-details" onClick={handleClick}>
      <div className="status">
        <input
          className="check-box"
          type="checkbox"
          id={'check-' + item.id.substr(0,8)}
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
        />
        <label htmlFor={'check-' + item.id.substr(0,8)} ></label>
      </div>
      {!inputField && <span className="name">{item.name}</span>}
      {inputField &&
        <div className="edit-item">
          <input type="text" size="40" value={newName} onChange={changeText} onKeyDown={(e) => handleActionKey(e, newName, item.id)}></input>
        </div>
      }
      
      <div className="time-delete">
        <div className="time">
          <span>{item.createdAt.date}</span>
          <span style={{textAlign: 'center'}}>{item.createdAt.time}</span>
        </div>
        <div className="action delete" onClick={() => handleDeleteItem(item.id)}>
          <i className="fas fa-trash"></i>
        </div>
      </div>
    </div>
  );
}
 
export default Item;