import { useState } from "react"
import { Input } from "antd";

export const AddItem = ({handleAddItem}) => {
  const [itemName, setItemName] = useState('');

  const changeText =(e) => {
    setItemName(e.target.value)
  }

  const handlePressEnter = (e) => {
    e.preventDefault()
    handleAddItem(e.target.value);
    setItemName('');
  }

  return(
    <Input
      value={itemName}
      onChange={changeText}
      onPressEnter={handlePressEnter}
    >
    </Input>
  )
}