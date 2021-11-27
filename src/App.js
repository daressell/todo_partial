import { useEffect, useState } from "react";
import { AddItem } from "./components/AddItem";
import { List } from "./components/List";
import { SortFilterPanel } from "./components/SortFilterPanel";
import uuid from 'react-native-uuid';
import { Pagination, Row, Col, Alert } from "antd";


function App() {
  if (!localStorage.getItem('items')) localStorage.setItem('items', '[]')
  const [items, setItems] = useState(localStorage.getItem('items'))
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState(0)
  const [activePage, setActivePage] = useState(1)
  const [alertMessege, setAlertMessege] = useState('')
  const [filteredItems, setfilteredItems] = useState([]);
  const [itemsOnPage, setItemsOnPage] = useState([]);
  const [countOfPages, setCountOfPages] = useState(0)
  const [pageSize, setPageSize] = useState(5)

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
    
    const updateShowItems = updateFilteredItems.slice((activePage-1)*pageSize, (activePage)*pageSize)
    if(updateShowItems.length){
      setAlertMessege('')
      setfilteredItems(updateFilteredItems)
      setItemsOnPage(updateShowItems)
    }else if(activePage){
      setActivePage(activePage - 1)
    }else{
      setfilteredItems(updateFilteredItems)
      setAlertMessege("Items is empty ^_^")
      setItemsOnPage([])
    }
     
    localStorage.setItem('items', items)

  }, [items, activePage, filter, sort, pageSize])
  

  //обработчик добавления нового item
  const handleAddItem = (name) => {
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
        setActivePage(countOfPages)
      }
    }else{
      setActivePage(1)
    }
    
    setFilter('all')

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
  const handlePage = (number, pagesize) => {
    setActivePage(number)
    setPageSize(pagesize)
    setItemsOnPage(filteredItems.slice((number)*pagesize, (number+1)*pagesize))
  }

  return (
    <Row justify='center'>
      <Col span={12}>
        <Row justify='center'>
          <h2>ToDo</h2>
        </Row>
        <Row justify='center'>
          <AddItem handleAddItem={handleAddItem}/>
        </Row>
        <SortFilterPanel filter={filter} sort={sort} handleFilter={handleFilteredItems} handleSort={handleSort}/>
       {alertMessege && <Row justify='center'>
          <Alert
            message={alertMessege}
            type='info'
          />
        </Row>}
        <Row justify='center'>
          <List items={itemsOnPage} handleDeleteItem = {handleDeleteItem} handleEditItem={handleEditItem}/>
        </Row>
        <Row justify='center'>
          <Pagination 
            style={{marginBottom: '50px'}}
            onChange={handlePage} 
            total={countOfPages} 
            defaultCurrent={0}
            current={activePage}
            defaultPageSize={pageSize} 
            pageSize={pageSize}
            pageSizeOptions={[5, 10, 15, 20]}
            hideOnSinglePage={true}
          />
        </Row>
      </Col>
    </Row>
  );
}
export default App;