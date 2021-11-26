import { useEffect, useState } from "react";
import { AddItem } from "./components/AddItem";
import { List } from "./components/List";
import { PaginationMy } from "./components/PaginationMy";
import { SortFilterPanel } from "./components/SortFilterPanel";
import uuid from 'react-native-uuid';
import { Pagination, Row, Col } from "antd";


function App() {
  const [items, setItems] = useState(localStorage.getItem('items'))
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState(0)
  const [activePage, setActivePage] = useState(1)
  const [alertMessege, setAlertMessege] = useState('')
  const [filteredItems, setfilteredItems] = useState(JSON.parse(items));
  const [itemsOnPage, setItemsOnPage] = useState(filteredItems.slice(0, 5)); // изначально отображаются только первые 5 item
  const [countOfPages, setCountOfPages] = useState(0)
  const [pageSize, setPageSize] = useState(5)

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
    
    // setCountOfPages(pagesCount)
    setCountOfPages(updateFilteredItems.length)
    
    const updateShowItems = updateFilteredItems.slice((activePage)*pageSize, (activePage+1)*pageSize)
    console.log('updateShowItems', updateShowItems);
    console.log('pageSize', pageSize);
    if(updateShowItems.length){
      setAlertMessege('')
      setfilteredItems(updateFilteredItems)
      setItemsOnPage(updateShowItems)
    }else if(activePage){
      setActivePage(activePage-1)
    }else{
      setfilteredItems(updateFilteredItems)
      setAlertMessege("Items is empty ^_^")
      setItemsOnPage([])
    }
     
    localStorage.setItem('items', items)

  }, [items, activePage, filter, sort, pageSize])
  

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
    if(sort === -1){
      if(itemsOnPage.length === 5){
        setActivePage(countOfPages)
      }
      else{
        setActivePage(countOfPages - 1)
      }
    }else{
      setActivePage(0)
    }
    
    setFilter('all')

    setItems(JSON.stringify([...cashStorage, newItem]))
  }

  // обработчик установки фильтра
  const handleFilteredItems = (typeFilter='all') => {
    setActivePage(0)
    setFilter(typeFilter)
  }
  // обработчик установки сортировки
  const handleSort = (sortType) => {
    setActivePage(0)
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
  const handlePage = (number, pagesize) => {
    setActivePage(number)
    setPageSize(pagesize)
    setItemsOnPage(filteredItems.slice((number-1)*pagesize, number*pagesize))
  }


  return (
    
    <div className="todo">

      <h2>ToDo</h2>
      
      <AddItem handleAddItem={handleAddItem}/>
      <SortFilterPanel filter={filter} sort={sort} handleFilter={handleFilteredItems} handleSort={handleSort}/>
      {alertMessege && <span className="alert-empty-items">{alertMessege}</span>}
      <List items={itemsOnPage} handleDeleteItem = {handleDeleteItem} handleEditItem={handleEditItem}/>
      {/* { <PaginationMy pages={countOfPages} activePage={activePage + 1} handlePage={handlePage}/> } */}
      <Pagination 
        style={{alignSelf: 'center'}}
        onChange={handlePage} 
        total={countOfPages} 
        defaultCurrent={1}
        current={activePage}
        defaultPageSize={pageSize} 
        pageSize={pageSize}
        // showSizeChanger={false}
      />
    </div>
  );
}
postgresql://postgres:@localhost:/<database>
export default App;