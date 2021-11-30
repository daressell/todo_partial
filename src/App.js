import { useEffect, useState } from "react";
import { AddItem } from "./components/AddItem";
import { List } from "./components/List";
import { SortFilterPanel } from "./components/SortFilterPanel";
import { Pagination, Row, Col, Alert } from "antd";
import axios from 'axios';

function App() {  
  const [filter, setFilter] = useState('')
  const [sort, setSort] = useState('desc')
  const [activePage, setActivePage] = useState(1)
  const [alertMessege, setAlertMessege] = useState({type: 'info', text: ''})
  const [itemsOnPage, setItemsOnPage] = useState([]);
  const [countOfItems, setCountOfItems] = useState(0)
  const [pageSize, setPageSize] = useState(5)
  const [changeItems, setChangeImtes] = useState(false)

  useEffect(() => { 
    const getItems = async () => {      
      try{
        const res = await axios.get(`https://todo-api-learning.herokuapp.com/v1/tasks/6?${filter && `filterBy=${filter}`}&order=${sort}`)
        const showItems = res.data.slice((activePage-1)*pageSize, (activePage)*pageSize)
        setItemsOnPage(showItems);
        if(res.data.length){
          setAlertMessege({type: 'info', text: ''})
          setCountOfItems(res.data.length)
        }else{
          setAlertMessege({type: 'info', text: 'items is empty'})
        }
      }
      catch(err){
        setAlertMessege({type: 'error', text: err.response.data.message})
      }   
    }
    getItems()
  }, [sort, filter, activePage, pageSize, changeItems])

   
  
  const handleAddItem = async (name) => {    
    try{
      const reg = /[\wа-яА-Я]/;
      if(!name.match(reg)){
        return 0
      }
      await axios.post(`https://todo-api-learning.herokuapp.com/v1/task/6`, 
        {
          name: name,
          done: false
        }
      )
      const newSort = 'desc'
      const newFilter = ''
      setChangeImtes(!changeItems)
      setFilter(newFilter)
      setSort(newSort)
      setActivePage(1)
    }
    catch(err){
      setAlertMessege({type: 'error', text: err.response.data.message})
    }
  }

  const handleFilteredItems = (typeFilter='all') => {
    setFilter(typeFilter)
    setActivePage(1)
  }

  const handleSort = (sortType='new') => {
    setSort(sortType)
    setActivePage(1)
  }

  const handleDeleteItem = async (id) => {
    try{
      axios.delete(`https://todo-api-learning.herokuapp.com/v1/task/6/${id}`)
      setChangeImtes(!changeItems)
      if(countOfItems && !itemsOnPage.length){
        setActivePage(activePage - 1)
      } 
    }catch(err){
      setAlertMessege({type: 'error', text: err.response.data.message})
    }
  }

  const handlePagination = (number, pagesize) => {
    setActivePage(number)
    setPageSize(pagesize)
  }

  return (
    <Row justify='center'>
      <Col xxl={12} xl={13} lg={16} md={20} sm={22} xs={23}>
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
       {alertMessege.text && <Row justify='center'>
          <Alert
            message={alertMessege.text}
            type={alertMessege.type}
          />
        </Row>}
        <Row justify='center'>
          <List 
            items={itemsOnPage} 
            handleDeleteItem = {handleDeleteItem}
            setAlertMessege={setAlertMessege}
          />
        </Row>
        <Row justify='center' >
          <Pagination 
            style={{marginBottom: '50px', marginTop: 50}}
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