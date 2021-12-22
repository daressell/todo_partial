import { Table } from "antd";

export const ListOfTodos = ({ t, todos }) => {
  const { Column } = Table;

  return (
    <div>
      <Table dataSource={todos} rowKey={"uuid"}>
        <Column align="center" title={t("status")} dataIndex="status" />
        <Column align="center" title={t("name")} dataIndex="name" />
        <Column align="center" title={t("createdAt")} dataIndex="createdAt" />
        <Column align="center" title={t("index")} dataIndex="index" />
      </Table>
    </div>
  );
};
