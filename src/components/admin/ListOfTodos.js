import { Table } from "antd";

export const ListOfTodos = ({ todos }) => {
  const { Column } = Table;

  return (
    <div>
      <Table dataSource={todos} rowKey={"uuid"}>
        <Column align="center" title="Status" dataIndex="status" />
        <Column align="center" title="Name" dataIndex="name" />
        <Column align="center" title="Created" dataIndex="createdAt" />
        <Column align="center" title="Index" dataIndex="index" />
      </Table>
    </div>
  );
};
