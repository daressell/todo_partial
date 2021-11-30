import { useEffect, useState } from "react";
import { AddItem } from "./components/AddItem";
import { List } from "./components/List";
import { SortFilterPanel } from "./components/SortFilterPanel";
import { Pagination, Row, Col, Spin,notification } from "antd";
import axios from 'axios';

function App() {  
  const [filter, setFilter] = useState('')
  const [sort, setSort] = useState('desc')
  const [activePage, setActivePage] = useState(1)
  const [itemsOnPage, setItemsOnPage] = useState([]);
  const [countOfItems, setCountOfItems] = useState(0)
  const [pageSize, setPageSize] = useState(5)
  const [loading, setLoading] = useState(false)

  const getItems = async () => {
    try{
      const res = await axios.get(`https://todo-api-learning.herokuapp.com/v1/tasks/6?${filter && `filterBy=${filter}`}&order=${sort}`)
      const showItems = res.data.slice((activePage-1)*pageSize, (activePage)*pageSize)
      setItemsOnPage(showItems);
      if(res.data.length !== 0){
        setCountOfItems(res.data.length)
      }else{
        alertMessege(`${filter} items is empty`, 'info')
        setCountOfItems(0)
      }
    }
    catch(err){
      alertMessege(err.response.data.message, 'error')
    }   
  }
  
  useEffect(() => {
    getItems()
  }, [sort, filter, activePage, pageSize])
  
  const handleAddItem = async (name) => {
    try{
      const reg = /[\wа-яА-Я]/;
      if(!name.match(reg)){
        return 0
      }
      setLoading(true)
      const newItem = {name, done:false}
      await axios.post(`https://todo-api-learning.herokuapp.com/v1/task/6`, 
        newItem
      )
      getItems()
      setFilter('')
      setSort('desc')
      setActivePage(1)
      setLoading(false)
    }
    catch(err){
      alertMessege(err.response.data.message, 'error')
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
      await axios.delete(`https://todo-api-learning.herokuapp.com/v1/task/6/${id}`)      
      getItems()
    }catch(err){
      alertMessege(err.response.data.message, 'error')
    }
  }

  const handlePagination = (number, pagesize) => {
    setActivePage(number)
    setPageSize(pagesize)
  }

  const alertMessege = (text, type) => {
    {notification.open({
      description: text,
      type: type
    })}
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
        <Spin spinning={loading}>
          <Row justify='center'>
            <List            
              pageSize={pageSize}
              items={itemsOnPage} 
              handleDeleteItem = {handleDeleteItem}
              getItems={getItems}
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
        </Spin>
      </Col>
    </Row>
  );
}
export default App;