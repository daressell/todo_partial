import { Menu } from "antd";

export const ListOfUsers = ({ users, handleSetUser }) => {
  return (
    <>
      <Menu onClick={handleSetUser} mode="inline" theme="dark">
        {users.map((user) => {
          return <Menu.Item key={user.uuid}>{user.login}</Menu.Item>;
        })}
      </Menu>
    </>
  );
};
