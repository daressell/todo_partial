import { useState } from "react"
import { Input } from "antd";

export const AddItem = ({handleAddItem}) => {
  const [itemName, setItemName] = useState('');

  // this handler has only 1 string
  // but created this for perhaps change in the future
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