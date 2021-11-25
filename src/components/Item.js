import { useState } from "react";

const Item = ({item, handleDeleteItem, handleEditItem, handleChangeStatus}) => {
  const [inputField, setInputField] = useState(false);
  const [newName, setNewName] = useState(item.name);
  const [status, setStatus] = useState(item.status)

  const itemDate = new Date(Date.parse(item.date))
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const createdDate = `${itemDate.getDate()} ${months[itemDate.getMonth()]}`
  let createdTime = ''
  
  itemDate.getHours().toString().length === 2 ? createdTime += itemDate.getHours().toString() : createdTime += '0' + itemDate.getHours().toString()
  createdTime += ':'
  itemDate.getMinutes().toString().length === 2 ? createdTime += itemDate.getMinutes().toString() : createdTime += '0' + itemDate.getMinutes().toString()

  const changeText = (e) => {
    setNewName(e.target.value)
  }

  const handleClick = (e) => {
    if(e.target.className === 'item-details' || e.target.className === 'item-name'){
      inputField ? setInputField(false) : setInputField(true)
    }
  }

  const handleActionKey = (e, newName, itemId) => {    
    const reg = /\w/;
    if(e.key === 'Escape' || e.key === 'Enter'){
      if(!newName.match(reg)) return void(0)
      e.preventDefault()      
      e.key === 'Enter' ? handleEditItem(newName, itemId) : setNewName(item.name);
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
                            handleChangeStatus('undone', item.id)
                          }                           
                          else{
                            setStatus('done');
                            handleChangeStatus('done', item.id)
                          }
                          }}
        />
        <label htmlFor={'check-' + item.id.substr(0,8)} ></label>
        {!inputField && <span className="item-name">{item.name}</span>}
        {inputField &&
          <form className="edit-item-form">
            <div className="edit-item">
              <input type="text" size="40" value={newName} onChange={changeText} onKeyDown={(e) => handleActionKey(e, newName, item.id)}></input>
            </div>
          </form>
        }     
      </div>
      <div>
        <span>{createdDate}</span>
        <span>{createdTime}</span>
        <span className="action" onClick={() => handleDeleteItem(item.id)}>
          <i className="fas fa-trash"></i>
        </span>
      </div>
      
    </div>
      
  );
}
 
export default Item;