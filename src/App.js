import { useEffect, useState } from "react";
import { AddItem } from "./components/AddItem";
import { List } from "./components/List";
import { Pagination } from "./components/Pagination";
import { SortFilterPanel } from "./components/SortFilterPanel";
import uuid from 'react-native-uuid';

function App() {
  if(!localStorage.getItem('items')) localStorage.setItem('items', '[]')
  const [items, setItems] = useState(localStorage.getItem('items'))
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState(-1)
  const [activePage, setActivePage] = useState(1)
  const [alertMessege, setAlertMessege] = useState('')
  const [filteredItems, setfilteredItems] = useState(JSON.parse(items));
  const [itemsOnPage, setItemsOnPage] = useState(filteredItems.slice(0, 5)); // изначально отображаются только первые 5 item
  const [countOfPages, setCountOfPages] = useState()

  // вызывается каждый раз при обновлении данных:
  //-----------(сортировка, изменения колчиества(удаление, добавление), изменения страницы и фильтров)
  // необходим для обновления списка отфильтрованных items и отображаемых items
  // reverse использовался, чтобы отображать последние внесенные с самого начала, 
  // для того, чтобы не изменять саму переменную, исользовал конструкцию -> Array.slice(0).reverse()
  useEffect(() => {
    let updateFilteredItems
    const itemsParse = JSON.parse(items)
    if(filter === 'all'){
      updateFilteredItems = itemsParse
    }
    else{
      updateFilteredItems = itemsParse.filter(item => item.status === filter)
    }
    if(sort === -1){
      updateFilteredItems.reverse()
    }
    const pagesCount = Math.ceil(updateFilteredItems.length/5);
    setCountOfPages(pagesCount)
    
    const updateShowItems = updateFilteredItems.slice((activePage - 1)*5, (activePage)*5)
    updateFilteredItems.length
      && countOfPages
      && !updateShowItems.length
      && setActivePage(activePage - 1)
    if(updateShowItems.length){
      setAlertMessege('')
      setfilteredItems(updateFilteredItems)
      setItemsOnPage(updateShowItems)
    }else{
      setfilteredItems(updateFilteredItems)
      setAlertMessege("Items is empty ^_^")
      setItemsOnPage([])
    }
     
    localStorage.setItem('items', items)
    console.log('activePage', activePage);
  }, [items, activePage, filter, sort])
  

  //обработчик добавления нового item
  const handleAddItem = (e, name) => {
    e.preventDefault();
    const reg = /[\wа-яА-Я]/;
    if(!name.match(reg)){
      return 0
    }
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const curDate = new Date()
    const timeObj = {}
    timeObj.date = `${curDate.getDate()} ${months[curDate.getMonth()]}`
    let createdTime = ''
    curDate.getHours().toString().length === 2 ? createdTime += curDate.getHours().toString() : createdTime += '0' + curDate.getHours().toString()
    createdTime += ':'
    curDate.getMinutes().toString().length === 2 ? createdTime += curDate.getMinutes().toString() : createdTime += '0' + curDate.getMinutes().toString()
    timeObj.time = createdTime
    
    const cashStorage = JSON.parse(items)
    const newItem = {
      id: uuid.v4(),
      name: name.trim(),
      status: "undone",
      createdAt: timeObj
    }
    setSort(-1)
    setActivePage(1)
    setFilter('all')
    console.log((filteredItems.length%5), '(filteredItems.length%5)');
    
    setItems(JSON.stringify([...cashStorage, newItem]))
  }

  // обработчик установки фильтра
  const handleFilteredItems = (typeFilter='all') => {
    setActivePage(1)
    setFilter(typeFilter)
  }
  // обработчик установки сортировки
  const handleSort = (sortType) => {
    setActivePage(1)
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
  const handlePage = (number) => {
    setActivePage(number)
  }

  return (    
    <div>
      <h2>ToDo</h2>
      <AddItem handleAddItem={handleAddItem}/>
      <SortFilterPanel filter={filter} sort={sort} handleFilter={handleFilteredItems} handleSort={handleSort}/>
      {alertMessege && <span className="alert-empty-items">{alertMessege}</span>}
      <List items={itemsOnPage} handleDeleteItem = {handleDeleteItem} handleEditItem={handleEditItem}/>
      {countOfPages > 1 && <Pagination pages={countOfPages} activePage={activePage} handlePage={handlePage}/>}
    </div>
  );
}

export default App;