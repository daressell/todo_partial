import { useEffect, useState } from "react";
import { AddItem } from "./components/AddItem";
import { List } from "./components/List";
import { SortFilterPanel } from "./components/SortFilterPanel";
import { Pagination, Row, Col, Alert } from "antd";
import uuid from 'react-native-uuid';

function App() {
  if (!localStorage.getItem('items')) localStorage.setItem('items', '[]')
  
  const [items, setItems] = useState(JSON.parse(localStorage.getItem('items')))
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('new')
  const [activePage, setActivePage] = useState(1)
  const [alertMessege, setAlertMessege] = useState('')
  const [itemsOnPage, setItemsOnPage] = useState([]);
  const [countOfItems, setCountOfItems] = useState(0)
  const [pageSize, setPageSize] = useState(5)

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
    let updateFilteredItems = [...items] // most important string - create a new array(not ref of items)

    // filtering items
    filter !== 'all' && (updateFilteredItems = updateFilteredItems.filter(item => item.status === filter))

    //sorting items
    sort === 'new' && (updateFilteredItems = updateFilteredItems.reverse())

    //if  updateFilteredItems is empty create message alert
    let messegeAlert = ''
    !updateFilteredItems.length
      && (messegeAlert = filter.charAt(0).toUpperCase() + filter.slice(1) + " items is empty ^_^")
    setAlertMessege(messegeAlert)

    // create count of items for pagination
    setCountOfItems(updateFilteredItems.length)

    // get items on page
    const updateShowItems = updateFilteredItems.slice((activePage-1)*pageSize, (activePage)*pageSize)
    
    setItemsOnPage(updateShowItems)
  }, [items, activePage, filter, sort, pageSize])
  

  const handleAddItem = (name) => {
    const reg = /[\wа-яА-Я]/; //regex for russian/english language
    // dont create if name not include russian/english symbols
    if(!name.match(reg)){
      return 0
    }

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const curDate = new Date()

    // timeObj has key date(string with month and day) of create and time(string with hours and minutes) of create 
    // with fix when 1 character (0-9 minutes of 0-9 hours)
    const timeObj = {}
    timeObj.date = `${curDate.getDate()} ${months[curDate.getMonth()]}`
    let createdTime = ''    
    curDate.getHours().toString().length === 2 ? createdTime += curDate.getHours().toString() : createdTime += '0' + curDate.getHours().toString()
    createdTime += ':'
    curDate.getMinutes().toString().length === 2 ? createdTime += curDate.getMinutes().toString() : createdTime += '0' + curDate.getMinutes().toString()
    timeObj.time = createdTime

    const cashStorage = items
    const newItem = {
      id: uuid.v4(),
      name: name.trim(),
      status: "undone",
      createdAt: timeObj
    }
    setActivePage(1)
    setFilter('all')
    setSort('new')
    setItems([...cashStorage, newItem])
  }

  const handleFilteredItems = (typeFilter='all') => {
    setFilter(typeFilter)
    setActivePage(1)
  }

  const handleSort = (sortType='new') => {
    setSort(sortType)
    setActivePage(1)
  }
  //
  const handleDeleteItem = (id) => {
    const updateStorageItems = items.filter(item => item.id !== id)
    setItems(updateStorageItems)
    itemsOnPage.length === 1 
      && countOfItems
      && setActivePage(activePage - 1)
  }

  //handler work only with item.status but in the future may be using for other props 
  const handleEditItem = (parName, parVal, id) => {
    const updateStorageItems = [...items] // most important string - create a new array(not ref of items)
    const item = updateStorageItems.find(item => item.id === id)
    const itemIndex = updateStorageItems.findIndex(item => item.id === id)
    item[parName] = parVal
    updateStorageItems[itemIndex] = item
    setItems(updateStorageItems)
  }

  const handlePagination = (number, pagesize) => {
    setActivePage(number)
    setPageSize(pagesize)
  }

  return (
    <Row justify='center'>
      <Col span={12}>
        <Row justify='center'>
          <h2>ToDo</h2>
        </Row>
        <Row justify='center'>
          <AddItem 
            handleAddItem={handleAddItem}
          />
        </Row>
        <SortFilterPanel
          filter={filter} 
          sort={sort} 
          handleFilter={handleFilteredItems} 
          handleSort={handleSort}
        />
       {alertMessege && <Row justify='center'>
          <Alert
            message={alertMessege}
            type='info'
          />
        </Row>}
        <Row justify='center'>
          <List 
            items={itemsOnPage} 
            handleDeleteItem = {handleDeleteItem} 
            handleEditItem={handleEditItem}
          />
        </Row>
        <Row justify='center'>
          <Pagination 
            style={{marginBottom: '50px'}}
            onChange={handlePagination}
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