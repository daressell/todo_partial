import { useState } from "react"

export const AddItem = ({handleAddItem}) => {
  const [itemName, setItemName] = useState('');

  const changeText =(e) => {
    setItemName(e.target.value)
  }

  return(
    <div className="head">
      <h1 style={{alignSelf: "center"}}>ToDo</h1>
      <form onSubmit={(e) => {handleAddItem(e, itemName); setItemName('')}}>
        <input type="text" size="40" value={itemName} placeholder="Input some here..." onChange={changeText}></input>
      </form>
    </div>
    
    
  )
}