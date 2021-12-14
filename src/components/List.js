import Item from "./Item";
import { Col } from "antd";

export const List = ({
  links,
  items,
  handleDeleteItem,
  handleEditItem,
  getItems,
  handleError,
  // token,
}) => {
  return (
    <Col span={24} className="items">
      {items.map((item) => {
        return (
          <div key={item.uuid} style={{ marginTop: 10, maxHeight: 80 }}>
            <Item
              links={links}
              item={item}
              handleDeleteItem={handleDeleteItem}
              handleEditItem={handleEditItem}
              getItems={getItems}
              handleError={handleError}
              // token={token}
            />
          </div>
        );
      })}
    </Col>
  );
};
