import { useEffect, useState } from "react";
import { AddItem } from "./components/AddItem";
import { List } from "./components/List";
import { SortFilterPanel } from "./components/SortFilterPanel";
import { Pagination, Row, Col, Alert } from "antd";
import axios from 'axios';

function App() {  
  const [filter, setFilter] = useState('')
  const [sort, setSort] = useState('asc')
  const [activePage, setActivePage] = useState(1)
  const [alertMessege, setAlertMessege] = useState({type: 'info', text: ''})
  const [itemsOnPage, setItemsOnPage] = useState([]);
  const [countOfItems, setCountOfItems] = useState(0)
  const [pageSize, setPageSize] = useState(5)


  useEffect(() => {
    getItems(sort, filter)
  }, [activePage, filter, sort])

  const getItems = (sort = 'asc', filter='') => {
    axios.get(`https://todo-api-learning.herokuapp.com/v1/tasks/6?${filter && `filterBy=${filter}`}&order=${sort}`).then((res, rej) => {
      if(res.status === 200){
        const showItems = res.data.reverse().slice((activePage-1)*pageSize, (activePage)*pageSize)
        res.data.length
          ? setAlertMessege({type: 'info', text: ''})
          : setAlertMessege({type: 'info', text: 'items is empty'})
        res.data.length && !showItems.length
          && setActivePage(activePage - 1)
        setItemsOnPage(showItems);
        setCountOfItems(res.data.length)
      }
      else{
        console.log(res);
      };
    })
  }  
  
  const handleAddItem = (name) => {
    const reg = /[\wа-яА-Я]/;
    if(!name.match(reg)){
      return 0
    }
    axios.post(`https://todo-api-learning.herokuapp.com/v1/task/6`,
      {
        name: name,
        done: false
      }
    ).then((res, rej) => {
          if(res.status === 200){
            setActivePage(1)
            const newSort = 'asc'
            const newFilter = ''
            setFilter(newFilter)
            setSort(newSort)
            getItems(newSort, newFilter)

          }
          else{
            return rej
          }
        }
      )
      .catch(err => {
        setAlertMessege({type: 'error', text: err.response.data.message})
      })
  }

  const handleFilteredItems = (typeFilter='all') => {
    setFilter(typeFilter)
    setActivePage(1)
  }

  const handleSort = (sortType='new') => {
    setSort(sortType)
    setActivePage(1)
  }

  const handleDeleteItem = (id) => {
    axios.delete(`https://todo-api-learning.herokuapp.com/v1/task/6/${id}`)
      .then(res => {
        if(res.status === 204){
          getItems(sort, filter)
        }
        else console.log(res);
      })
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