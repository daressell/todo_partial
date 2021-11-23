import { useEffect, useState } from "react";
import { AddItem } from "./components/AddItem";
import { List } from "./components/List";
import { Pagination } from "./components/Pagination";
import { Tools } from "./components/Tools";
import storage from "./db";

function App() {
  const [items, setItems] = useState(storage)
  const createId = items.length + 1;

  const handleAddItem = (e, name) => {
    console.log(e);
    console.log(name);
    e.preventDefault();
    const newItem = {
      id: createId,
      name: name,
      done: false,
      date: "10/11/22"
    }
    console.log(items);
    setItems([...items, newItem])
  }

  const hanleFilter = (e, ) => {

  }

  const handleDeleteItem = (id) => {
    const updateStorage = items.filter(item => item.id !== id)
    setItems(updateStorage)
  }

  return (
    <div>
      <AddItem handleAddItem={handleAddItem}/>
      <Tools hanleFilter = {hanleFilter}/>
      <List items={items} handleDeleteItem = {handleDeleteItem}/>
      <Pagination />
    </div>
  );
}

export default App;
