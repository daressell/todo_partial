import { useEffect, useState } from "react";
import { AddItem } from "./components/AddItem";
import { List } from "./components/List";
import { Pagination } from "./components/Pagination";
import { SortFilterPanel } from "./components/SortFilterPanel";
import uuid from 'react-native-uuid';
import { storage } from "./db";


function App() {
  if(!localStorage.items) localStorage.setItem('items', JSON.stringify(storage))
  const [items, setItems] = useState((localStorage.getItem('items')))
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
      console.log(filter);
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
    const reg = /\w/;
    e.preventDefault();
    if(!name.match(reg)){
      return 0
    }
    const cashStorage = JSON.parse(items)
    const newItem = {
      id: uuid.v4(),
      name: name.trim(),
      status: "undone",
      date: new Date()
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
    setSort(sortType)
  }

  // обработчик удаления item
  const handleDeleteItem = (id) => {
    const updateStorageItems = JSON.parse(items).filter(item => item.id !== id)    
    setItems(JSON.stringify(updateStorageItems))
  }  

  //обработчик изменения item.status
  const handleChangeStatus = (newStatus, id) => {
    changeItemParametr('status', newStatus, id)
  }

  //обработчик изменения item.name
  const handleEditItem = (newName, id) => {
    changeItemParametr('name', newName, id)
  }

  //обработчик установки страницы
  const handlePage = (number=0) => {
    setPage(number)
    setItemsOnPage(filteredItems.slice(number*5, (number+1)*5))
  }

  //хелпер функция для изменения параметра item.<parName> на значение parVal
  const changeItemParametr = (parName, parVal, id) => {
    const updateStorageItems = JSON.parse(items)
    // строка создания копии item
    // исправил способ изменения параметра в item, чтобы не проходиться по всем с помощью map
    const itemEditPar = updateStorageItems.find(item => item.id === id)
    const itemIndex = updateStorageItems.findIndex(item => item.id === id)
    itemEditPar[parName] = parVal
    updateStorageItems[itemIndex] = itemEditPar
    setItems(JSON.stringify(updateStorageItems))
  }

  return (    
    <div>
      <h1 style={{alignSelf: "center"}}>ToDo</h1>
      <AddItem handleAddItem={handleAddItem}/>
      <SortFilterPanel filter={filter} sort={sort} handleFilter={handleFilteredItems} handleSort={handleSort}/>
      <List items={itemsOnPage} handleDeleteItem = {handleDeleteItem} handleEditItem={handleEditItem} handleChangeStatus={handleChangeStatus}/>
      <Pagination itemsCount={filteredItems.length} handlePage={handlePage}/>
    </div>
  );
}

export default App;