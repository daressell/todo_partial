import { Row, Button, Col } from "antd";
import { useTranslation } from "react-i18next";
import "../translation/index.js";

export const SortFilterPanel = ({ filter, sort, handleFilter, handleSort }) => {
  const { t } = useTranslation();
  return (
    <Row style={{ marginTop: 10 }}>
      <Col span={12}>
        <Row>
          <Button
            type={filter === "all" ? "primary" : "default"}
            onClick={() => handleFilter("all")}
          >
            {t("all")}
          </Button>
          <Button
            type={filter === "done" ? "primary" : "default"}
            onClick={() => handleFilter("done")}
          >
            {t("done")}
          </Button>
          <Button
            type={filter === "undone" ? "primary" : "default"}
            onClick={() => handleFilter("undone")}
          >
            {t("undone")}
          </Button>
        </Row>
      </Col>
      <Col span={12}>
        <Row justify="end">
          <Button type={sort === "asc" ? "primary" : "default"} onClick={() => handleSort("asc")}>
            {t("old")}
          </Button>
          <Button type={sort === "desc" ? "primary" : "default"} onClick={() => handleSort("desc")}>
            {t("new")}
          </Button>
        </Row>
      </Col>
    </Row>
  );
};
