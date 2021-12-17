import Item from "./Item";
import { Col } from "antd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export const List = ({
  t,
  items,
  handleEditItem,
  handleDeleteItem,
  getItems,
  handleOnDragEnd,
  handleError,
}) => {
  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="todos">
        {(provided) => (
          <Col span={24} className="todos" {...provided.droppableProps} ref={provided.innerRef}>
            {items.map((todo, index) => {
              return (
                <Draggable key={todo.uuid} draggableId={todo.name} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Item
                        t={t}
                        item={todo}
                        handleEditItem={handleEditItem}
                        handleDeleteItem={handleDeleteItem}
                        getItems={getItems}
                        handleError={handleError}
                      />
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </Col>
        )}
      </Droppable>
    </DragDropContext>
  );
};
