import { useState } from "react"
import { Input } from "antd";

export const AddItem = ({handleAddItem}) => {
  const [itemName, setItemName] = useState('');

  const changeText =(e) => {
    setItemName(e.target.value)
  }

  return(
    <Input
      value={itemName}
      onChange={changeText}
      onPressEnter={(e) => {handleAddItem(e, itemName); setItemName('')}}
    >
    </Input>
  )
}