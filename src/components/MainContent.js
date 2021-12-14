import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddItem } from "./AddItem";
import { List } from "./List";
import { SortFilterPanel } from "./SortFilterPanel";
import { Col, Pagination, Row, Spin, Menu } from "antd";
import axios from "axios";

export const MainContent = ({ links, handleError, alertMessage }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("desc");
  const [activePage, setActivePage] = useState(1);
  const [itemsOnPage, setItemsOnPage] = useState([]);
  const [countOfItems, setCountOfItems] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);

  const getItems = async () => {
    try {
      const link = `${links.getTodos}?${filter && `filterBy=${filter}`}&${
        sort && `sortBy=${sort}`
      }&${activePage && `page=${activePage}`}&${pageSize && `pageSize=${pageSize}`}
        `;
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
      name = name.trim().replace(/\s+/g, " ");
      if (!name) throw new Error("Bad name");
      if (name.length < 2) throw new Error("Need more, than 1 symbol");
      setLoading(true);
      const newItem = { name, done: false };
      await axios.post(`${links.postTodo}`, newItem, {
        headers: {
          Authorization: localStorage.getItem("accessToken"),
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
            <Menu.Item key="logout" danger={true}>
              Выйти
            </Menu.Item>
          </Menu>
          <Row type="flex" justify="center" align="middle" style={{ minHeight: "80vh" }}>
            <Col xxl={12} xl={13} lg={16} md={20} sm={22} xs={23}>
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
                    links={links}
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
            </Col>
          </Row>
        </>
      )}
    </>
  );
};
