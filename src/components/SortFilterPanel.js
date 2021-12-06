import { Row, Button, Col } from "antd"

export const SortFilterPanel = ({ filter, sort, handleFilter, handleSort }) => {
  return (
    <Row style={{ marginTop: 10 }}>
      <Col span={12}>
        <Row>
          <Button
            type={filter === "" ? "primary" : "default"}
            onClick={() => handleFilter("")}
          >
            All
          </Button>
          <Button
            type={filter === "done" ? "primary" : "default"}
            onClick={() => handleFilter("done")}
          >
            Done
          </Button>
          <Button
            type={filter === "undone" ? "primary" : "default"}
            onClick={() => handleFilter("undone")}
          >
            Undone
          </Button>
        </Row>
      </Col>
      <Col span={12}>
        <Row justify="end">
          <Button
            type={sort === "asc" ? "primary" : "default"}
            onClick={() => handleSort("asc")}
          >
            Old
          </Button>
          <Button
            type={sort === "desc" ? "primary" : "default"}
            onClick={() => handleSort("desc")}
          >
            New
          </Button>
        </Row>
      </Col>
    </Row>
  )
}
