import { useEffect, useState } from "react";
import { AddItem } from "./components/AddItem";
import { List } from "./components/List";
import { Pagination } from "./components/Pagination";
import { SortFilterPanel } from "./components/SortFilterPanel";
import uuid from 'react-native-uuid';


function App() {
  
  const [items, setItems] = useState((JSON.parse(localStorage.getItem('items'))))
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState(0)
  const [page, setPage] = useState(0)
  const [filteredItems, setfilteredItems] = useState(items);
  const [itemsOnPage, setItemsOnPage] = useState(items.slice(0, 5)); // изначально отображаются только первые 5 item


  // вызывается каждый раз при обновлении данных:
  //-----------(сортировка, изменения колчиества(удаление, добавление), изменения страницы и фильтров)
  // необходим для обновления списка отфильтрованных items и отображаемых items
  // reverse использовался, чтобы отображать последние внесенные с самого начала, 
  // для того, чтобы не изменять саму переменную, исользовал конструкцию -> Array.slice(0).reverse()
  useEffect(() => {
    let updateFilteredItems
    if(filter === 'all'){
      updateFilteredItems = items.slice(0).reverse()
    }
    else{
      updateFilteredItems = items.slice(0).reverse().filter(item => item.status === filter)
    }
    if(sort){
      updateFilteredItems.sort((prevItem, item) => {
        if (prevItem.name > item.name) {
          return sort;
        }
        if (prevItem.name < item.name) {
          return sort;
        }
        return 0;
      })      
    }
    const updateShowItems = updateFilteredItems.slice(page*5, (page+1)*5)
    setfilteredItems(updateFilteredItems)
    setItemsOnPage(updateShowItems)
    localStorage.setItem('items', JSON.stringify(items))
  }, [items, page, filter, sort])
  

  //обработчик добавления нового item
  const handleAddItem = (e, name) => {
    e.preventDefault();
    const newItem = {
      id: uuid.v4(),
      name: name,
      status: "undone",
      date: new Date()
    }
    setItems([...items, newItem])
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
    const updateStorageItems = items.filter(item => item.id !== id)    
    setItems(updateStorageItems)
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
    // строка создания копии item
    const itemEditPar = items.find(item => item.id === id)
    itemEditPar[parName] = parVal

    //следующую стоку я загуглил, понял как работает
    // --в начале мы проходимся по каждому item внутри items
    // -- и находим тот, к которому относится копия и возвращаем копию, вместо старого item
    // далее просто исользуем useState для обновления items
    const updateStorageItems = items.map(item => itemEditPar.id === item.id ? itemEditPar : item);    
    setItems(updateStorageItems)
  }

  return (    
    <div>
      <h1 style={{alignSelf: "center"}}>ToDo</h1>
      <AddItem handleAddItem={handleAddItem}/>
      <SortFilterPanel handleFilter={handleFilteredItems} handleSort={handleSort}/>
      <List items={itemsOnPage} handleDeleteItem = {handleDeleteItem} handleEditItem={handleEditItem} handleChangeStatus={handleChangeStatus}/>
      <Pagination items={filteredItems} handlePage={handlePage}/>
    </div>
  );
}

export default App;