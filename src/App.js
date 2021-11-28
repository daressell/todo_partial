import { useEffect, useState } from "react";
import { AddItem } from "./components/AddItem";
import { List } from "./components/List";
import { SortFilterPanel } from "./components/SortFilterPanel";
import { Pagination, Row, Col, Alert } from "antd";
import { storage } from "./db";
import uuid from 'react-native-uuid';

function App() {
  if (!localStorage.getItem('items')) localStorage.setItem('items', JSON.stringify(storage))
  
  const [items, setItems] = useState(localStorage.getItem('items'))
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState(1)
  const [activePage, setActivePage] = useState(1)
  const [alertMessege, setAlertMessege] = useState('')
  const [itemsOnPage, setItemsOnPage] = useState([]);
  const [countOfItems, setCountOfItems] = useState(0)
  const [pageSize, setPageSize] = useState(5)

  useEffect(() => {
    let updateFilteredItems = JSON.parse(items)
    filter === 'all' 
      ? updateFilteredItems = updateFilteredItems.reverse()
      : updateFilteredItems = updateFilteredItems.reverse().filter(item => item.status === filter)
    updateFilteredItems.sort(() => sort)
    const updateShowItems = updateFilteredItems.slice((activePage-1)*pageSize, (activePage)*pageSize)
    const countItems = updateFilteredItems.length
    if(updateShowItems.length){
      setAlertMessege('')
    }else if(sort === -1){
      setActivePage(Math.ceil(countItems/pageSize))
    }else if(updateShowItems.length === 0 && updateFilteredItems.length){
      setActivePage(Math.ceil((countItems-1)/pageSize))
    }    
    setCountOfItems(countItems)
    if(JSON.parse(items).length !== JSON.parse(localStorage.getItem('items')).length){
      setFilter('all')
      if(sort === 1) setActivePage(1)
      if(sort === -1) setActivePage(Math.ceil(countItems/pageSize))  
    }
    if(!updateFilteredItems.length){
      const emptyItems = filter.charAt(0).toUpperCase() + filter.slice(1) + " items is empty ^_^";
      setAlertMessege(emptyItems)
    }
    setItemsOnPage(updateShowItems)
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
    setItems(JSON.stringify([...cashStorage, newItem]))
  }

  // обработчик установки фильтра
  const handleFilteredItems = (typeFilter='all') => {
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
    pagesize !== pageSize && handlePageSize(pagesize)
  }
  const handlePageSize = (pagesize) => setPageSize(pagesize)

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
            total={countOfItems}
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