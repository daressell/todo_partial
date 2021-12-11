import { useEffect, useState } from "react";
import { AddItem } from "./AddItem";
import { List } from "./List";
import { SortFilterPanel } from "./SortFilterPanel";
import { Pagination, Row, Spin } from "antd";
import axios from "axios";

const link_get = "http://localhost:5000/todos";
const link_post = "http://localhost:5000/todo";

export const MainContent = ({ handleError, alertMessage }) => {
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("desc");
  const [activePage, setActivePage] = useState(1);
  const [itemsOnPage, setItemsOnPage] = useState([]);
  const [countOfItems, setCountOfItems] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);

  const getItems = async () => {
    try {
      const link = `${link_get}?${filter && `filterBy=${filter}`}&${sort && `sortBy=${sort}`}&${
        activePage && `page=${activePage}`
      }&${pageSize && `pageSize=${pageSize}`}
        `;
      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.get(link, {
        headers: {
          Authorization: accessToken,
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });

      const showItems = res.data.items;
      setItemsOnPage(showItems);
      if (res.data.countOfTodos !== 0) {
        setCountOfItems(res.data.countOfTodos);
      } else {
        alertMessage(`${filter} items is empty`, "info");
        setCountOfItems(0);
      }
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    getItems();
  }, [sort, filter, activePage, pageSize]);

  const handleAddItem = async (name) => {
    try {
      name = name.trim();
      setLoading(true);
      const newItem = { name, done: false };
      const accessToken = localStorage.getItem("accessToken");
      await axios.post(`${link_post}`, newItem, {
        headers: {
          Authorization: accessToken,
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
      getItems();
      setFilter("");
      setSort("desc");
      setActivePage(1);
      setLoading(false);
    } catch (err) {
      handleError(err);
      setLoading(false);
    }
  };

  const handleFilteredItems = (typeFilter = "all") => {
    setFilter(typeFilter);
    setActivePage(1);
  };

  const handleSort = (sortType = "new") => {
    setSort(sortType);
    setActivePage(1);
  };

  const handleDeleteItem = async (id) => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      await axios.delete(`${link_post}/${id}`, {
        headers: {
          Authorization: accessToken,
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
      itemsOnPage.length === 1 && countOfItems > 1
        ? setActivePage(activePage - 1)
        : await getItems();
      setLoading(false);
    } catch (err) {
      handleError(err);
      setLoading(false);
    }
  };

  const handlePagination = (number, pagesize) => {
    setActivePage(number);
    setPageSize(pagesize);
  };

  return (
    <>
      {localStorage.getItem("accessToken") && (
        <>
          <Row justify="center">
            <h2>ToDo</h2>
          </Row>
          <Row justify="center">
            <AddItem handleAddItem={handleAddItem} />
          </Row>
          <SortFilterPanel
            filter={filter}
            sort={sort}
            handleFilter={handleFilteredItems}
            handleSort={handleSort}
          />
          <Spin spinning={loading}>
            <Row justify="center">
              <List
                pageSize={pageSize}
                items={itemsOnPage}
                handleDeleteItem={handleDeleteItem}
                getItems={getItems}
                handleError={handleError}
              />
            </Row>
            <Row justify="center">
              <Pagination
                style={{ marginBottom: "50px", marginTop: 50 }}
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
        </>
      )}
    </>
  );
};
