import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddItem } from "./AddItem";
import { List } from "./List";
import { SortFilterPanel } from "./SortFilterPanel";
import { Col, Pagination, Row, Spin, Menu, Select } from "antd";
import axios from "axios";
import i18n from "i18next";
import "../translation/index.js";

export const MainContent = ({ t, links, handleError, handleChangeLanguage, alertMessage }) => {
  const { Option } = Select;
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("desc");
  const [activePage, setActivePage] = useState(1);
  const [itemsOnPage, setItemsOnPage] = useState([]);
  const [countOfItems, setCountOfItems] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);

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

      const showItems = res.data.items;
      setItemsOnPage(showItems);
      if (res.data.countOfTodos !== 0) {
        setCountOfItems(res.data.countOfTodos);
      } else {
        alertMessage(t("itemsEmpty"), "info");
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

  const handleClickMenu = ({ key }) => {
    if (key === "logout") {
      localStorage.removeItem("accessToken");
      navigate("/login");
    }
  };

  const handleOnDragEnd = async (result) => {
    if (!result.destination) return;
    try {
      setLoading(true);
      const sourceIndex = result.source.index;
      const destinationIndex = result.destination.index;
      const updateItems = [...itemsOnPage];
      const dragTodo = updateItems.splice(sourceIndex, 1)[0];
      const from = Math.min(sourceIndex, destinationIndex);
      const to = Math.max(sourceIndex, destinationIndex);
      updateItems.splice(destinationIndex, 0, dragTodo);
      const arrIndex = itemsOnPage.slice(from, to + 1).map((item) => item.index);
      const arrOfTodos = updateItems.slice(from, to + 1).map((todo, i) => {
        return { uuid: todo.uuid, index: arrIndex[i], name: todo.name };
      });
      updateItems.slice(from, to + 1).forEach((item, i) => {
        item.index = arrOfTodos[i].index;
        return item;
      });
      setItemsOnPage(updateItems);
      await axios.patch(
        links.todosMoved,
        { todos: arrOfTodos },
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
          <Menu
            onClick={handleClickMenu}
            selectedKeys={[]}
            mode="horizontal"
            theme="dark"
            style={{ display: "flex", justifyContent: "end" }}
          >
            <Menu.Item key="languages">
              <Select defaultValue={i18n.language} onChange={handleChangeLanguage}>
                <Option value="ru">{t("ru")}</Option>
                <Option value="en">{t("en")}</Option>
              </Select>
            </Menu.Item>
            <Menu.Item key="logout" danger={true}>
              {t("quit")}
            </Menu.Item>
          </Menu>
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
