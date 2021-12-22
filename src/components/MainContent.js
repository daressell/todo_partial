import { useEffect, useState } from "react";
import { AddItem } from "./AddItem";
import { List } from "./List";
import { SortFilterPanel } from "./SortFilterPanel";
import { Col, Pagination, Row, Spin } from "antd";
import axios from "axios";
import "../translation/index.js";
import { MenuPanel } from "./MenuPanel";

export const MainContent = ({ t, links, handleError, handleChangeLanguage, alertMessage }) => {
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("desc");
  const [activePage, setActivePage] = useState(1);
  const [itemsOnPage, setItemsOnPage] = useState([]);
  const [countOfItems, setCountOfItems] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [allTodos, setAllTodos] = useState([]);

  const getItems = async () => {
    try {
      const link = `${links.getTodos}?filterBy=${filter}&sortBy=${sort}&page=${activePage}&pageSize=${pageSize}`;
      const res = await axios.get(link, {
        headers: {
          Authorization: localStorage.getItem("accessToken"),
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
      const data = res.data.result;
      setItemsOnPage(data.rows);

      const allTodos = [...data.rows];
      allTodos.push(data.nextTodo);
      allTodos.unshift(data.prevTodo);
      setAllTodos(allTodos);
      setCountOfItems(data.count);

      if (data.count === 0) {
        alertMessage(t("itemsEmpty"), "info");
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
      name = name.trim().replace(/\s+/g, " ");
      if (!name) throw new Error(t("errBadName"));
      if (!name.match(/[0-9А-Яа-яA-Za-z]/)) throw new Error(t("errMeaninglessContent"));
      if (name.length < 2 || name.length > 100) throw new Error(t("errItemName"));
      setLoading(true);
      const newItem = { name, done: false };
      await axios.post(links.postTodo, newItem, {
        headers: {
          Authorization: localStorage.getItem("accessToken"),
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
      getItems();
      setFilter("all");
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

  const handleEditItem = async (params, uuid) => {
    await axios.patch(`${links.postTodo}/${uuid}`, params, {
      headers: {
        Authorization: localStorage.getItem("accessToken"),
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
    typeof params.status === "boolean" && getItems();
  };

  const handleDeleteItem = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${links.postTodo}/${id}`, {
        headers: {
          Authorization: localStorage.getItem("accessToken"),
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

  const handleOnDragEnd = async (result) => {
    if (!result.destination) return;
    try {
      //index of todo, which dragged
      const sourceIndex = result.source.index + 1;

      //index of todo, which on dropped
      const destinationIndex = result.destination.index + 1;

      if (sourceIndex === destinationIndex) {
        setLoading(false);
        return void 0;
      }
      const updateItems = [...allTodos];
      const todos = {};

      //check from where dragged, from top to bottom or else
      if (sourceIndex > destinationIndex) {
        todos.prevTodoIndex = updateItems[destinationIndex - 1]?.index;
        todos.nextTodoIndex = updateItems[destinationIndex]?.index;
      } else {
        todos.prevTodoIndex = updateItems[destinationIndex]?.index;
        todos.nextTodoIndex = updateItems[destinationIndex + 1]?.index;
      }
      //---end check

      const updateTodo = {
        uuid: updateItems[sourceIndex].uuid,
        name: updateItems[sourceIndex].name,
      };
      updateTodo.index = (todos.nextTodoIndex + todos.prevTodoIndex) / 2;
      updateItems[sourceIndex].index = parseInt(updateTodo.index);

      // swap position on front end(so that not to use get request)
      const dragTodo = updateItems.splice(sourceIndex, 1)[0];
      updateItems.splice(destinationIndex, 0, dragTodo);
      setAllTodos(updateItems);
      setItemsOnPage(updateItems.slice(1, itemsOnPage.length + 1).filter((item) => item.uuid));
      //---end swap

      await axios.patch(
        links.todoMoved,
        { todo: updateTodo },
        {
          headers: {
            Authorization: localStorage.getItem("accessToken"),
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);
    } catch (err) {
      handleError(err);
      setLoading(false);
    }
  };

  return (
    <>
      {localStorage.getItem("accessToken") && (
        <>
          <MenuPanel t={t} handleChangeLanguage={handleChangeLanguage} />
          <Row type="flex" justify="center" align="middle" style={{ minHeight: "80vh" }}>
            <Col xxl={12} xl={13} lg={16} md={20} sm={22} xs={23}>
              <Row justify="center">
                <h2>{t("todoTitle")}</h2>
              </Row>
              <Row justify="center">
                <AddItem handleAddItem={handleAddItem} />
              </Row>
              <SortFilterPanel
                t={t}
                filter={filter}
                sort={sort}
                handleFilter={handleFilteredItems}
                handleSort={handleSort}
              />
              <Spin spinning={loading}>
                <Row justify="center">
                  <List
                    t={t}
                    pageSize={pageSize}
                    items={itemsOnPage}
                    handleEditItem={handleEditItem}
                    handleDeleteItem={handleDeleteItem}
                    handleOnDragEnd={handleOnDragEnd}
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
            </Col>
          </Row>
        </>
      )}
    </>
  );
};
