import { useEffect, useState } from "react";
import { AddItem } from "./components/AddItem";
import { List } from "./components/List";
import { Pagination } from "./components/Pagination";
import { SortFilterPanel } from "./components/SortFilterPanel";
import storage from "./db";
import uuid from 'react-native-uuid';

function App() {
  const [items, setItems] = useState(storage)
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(0)
  const [filteredItems, setfilteredItems] = useState(items);
  const [itemsOnPage, setItemsOnPage] = useState(items.slice(0, 5));

  useEffect(() => {
    let updateFilteredItems
    if(filter === 'all'){
      updateFilteredItems = items
    }
    else{
      updateFilteredItems = items.slice(0).reverse().filter(item => item.status === filter)
    }
    const updateShowItems = updateFilteredItems.slice(0).reverse().slice(page*5, (page+1)*5)
    setfilteredItems(updateFilteredItems)
    setItemsOnPage(updateShowItems)
  }, [items, page, filter])
  
  const handleAddItem = (e, name) => {
    e.preventDefault();
    const newItem = {
      id: uuid.v4(),
      name: name,
      status: "undone",
      date: "10/11/22"
    }
    setItems([...items, newItem])
  }

  const handleFilteredItems = (typeFilter='all') => {
    setPage(0)
    setFilter(typeFilter)
  }

  const handleDeleteItem = (id) => {
    const updateStorageItems = items.filter(item => item.id !== id)    
    setItems(updateStorageItems)
  }  

  const handleChangeStatus = (newStatus, id) => {
    changeItemParametr('status', newStatus, id)
  }

  const handleEditItem = (newName, id) => {
    changeItemParametr('name', newName, id)
  }

  const handlePage = (number=0) => {
    setPage(number)
    setItemsOnPage(filteredItems.slice(number*5, (number+1)*5))
  }

  const changeItemParametr = (parName, parVal, id) => {
    const itemEditStatus = [items.find(item => item.id === id)]
    itemEditStatus[0][parName] = parVal
    const updateStorageItems = items.map(item => itemEditStatus.find(newItem => newItem.id === item.id) || item);    
    setItems(updateStorageItems)
  }

  return (    
    <div>
      <h1 style={{alignSelf: "center"}}>ToDo</h1>
      <AddItem handleAddItem={handleAddItem}/>
      <SortFilterPanel handleFilter={handleFilteredItems}/>
      <List items={itemsOnPage} handleDeleteItem = {handleDeleteItem} handleEditItem={handleEditItem} handleChangeStatus={handleChangeStatus}/>
      <Pagination items={filteredItems} handlePage={handlePage}/>
    </div>
  );
}

export default App;