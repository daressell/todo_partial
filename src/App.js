import { useEffect, useState } from "react";
import { AddItem } from "./components/AddItem";
import { List } from "./components/List";
import { Pagination } from "./components/Pagination";
import { SortFilterPanel } from "./components/SortFilterPanel";
import uuid from 'react-native-uuid';


function App() {
  // if(!localStorage.items) localStorage.setItem('items', JSON.stringify(storage))
  const [items, setItems] = useState("[]")
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState(0)
  const [page, setPage] = useState(0)
  const [filteredItems, setfilteredItems] = useState(JSON.parse(items));
  const [itemsOnPage, setItemsOnPage] = useState(filteredItems.slice(0, 5)); // изначально отображаются только первые 5 item

  // вызывается каждый раз при обновлении данных:
  //-----------(сортировка, изменения колчиества(удаление, добавление), изменения страницы и фильтров)
  // необходим для обновления списка отфильтрованных items и отображаемых items
  // reverse использовался, чтобы отображать последние внесенные с самого начала, 
  // для того, чтобы не изменять саму переменную, исользовал конструкцию -> Array.slice(0).reverse()
  useEffect(() => {
    let updateFilteredItems
    const itemsParse = JSON.parse(items)
    if(filter === 'all'){
      updateFilteredItems = itemsParse.slice(0).reverse()
    }
    else{
      updateFilteredItems = itemsParse.slice(0).reverse().filter(item => item.status === filter)
    }
    if(sort){
      updateFilteredItems.sort(() => sort)      
    }
    const updateShowItems = updateFilteredItems.slice(page*5, (page+1)*5)
    setfilteredItems(updateFilteredItems)
    setItemsOnPage(updateShowItems)
    localStorage.setItem('items', items)
  }, [items, page, filter, sort])
  

  //обработчик добавления нового item
  const handleAddItem = (e, name) => {
    const reg = /[\wа-яА-Я]/;
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const curDate = new Date()
    const timeObj = {}
    timeObj.date = `${curDate.getDate()} ${months[curDate.getMonth()]}`
    let createdTime = ''    
    curDate.getHours().toString().length === 2 ? createdTime += curDate.getHours().toString() : createdTime += '0' + curDate.getHours().toString()
    createdTime += ':'
    curDate.getMinutes().toString().length === 2 ? createdTime += curDate.getMinutes().toString() : createdTime += '0' + curDate.getMinutes().toString()
    timeObj.time = createdTime
    e.preventDefault();
    if(!name.match(reg)){
      return 0
    }
    const cashStorage = JSON.parse(items)
    const newItem = {
      id: uuid.v4(),
      name: name.trim(),
      status: "undone",
      createdAt: timeObj
    }
    setItems(JSON.stringify([...cashStorage, newItem]))
  }

  // обработчик установки фильтра
  const handleFilteredItems = (typeFilter='all') => {
    setPage(0)
    setFilter(typeFilter)
  }
  // обработчик установки сортировки
  const handleSort = (sortType) => {
    setPage(0)
    setSort(sortType)
  }

  // обработчик удаления item
  const handleDeleteItem = (id) => {
    const updateStorageItems = JSON.parse(items).filter(item => item.id !== id)    
    setItems(JSON.stringify(updateStorageItems))
  }

  //обработчик изменения item.name
  const handleEditItem = (parName, parVal, id) => {
    const updateStorageItems = JSON.parse(items)
    const itemEditPar = updateStorageItems.find(item => item.id === id)
    const itemIndex = updateStorageItems.findIndex(item => item.id === id)
    itemEditPar[parName] = parVal
    updateStorageItems[itemIndex] = itemEditPar
    setItems(JSON.stringify(updateStorageItems))
  }

  //обработчик установки страницы
  const handlePage = (number=0) => {
    setPage(number)
    setItemsOnPage(filteredItems.slice(number*5, (number+1)*5))
  }

  return (    
    <div>
      <h2>ToDo</h2>
      <AddItem handleAddItem={handleAddItem}/>
      <SortFilterPanel filter={filter} sort={sort} handleFilter={handleFilteredItems} handleSort={handleSort}/>
      <List items={itemsOnPage} handleDeleteItem = {handleDeleteItem} handleEditItem={handleEditItem}/>
      <Pagination itemsCount={filteredItems.length} handlePage={handlePage}/>
    </div>
  );
}

export default App;