import { Row, Button, Col, Typography } from "antd"

export const SortFilterPanel = ({filter, sort, handleFilter, handleSort}) => {
  return(
    <Row>
      <Col span={12}>
        <Row>
          <Button 
            type={filter === 'all' ? 'primary' : 'default'} 
            onClick={() => handleFilter('all')}
          >
            All
          </Button>
          <Button 
            type={filter === 'done' ? 'primary' : 'default'} 
            onClick={() => handleFilter('done')}
          >
            Done
          </Button>
          <Button 
            type={filter === 'undone' ? 'primary' : 'default'} 
            onClick={() => handleFilter('undone')}
          >
            Undone
          </Button>

        </Row>
      </Col>
      <Col span={12}>
        <Row justify='end'>
          <Typography.Text
          >
            Sort by date
          </Typography.Text>
          
          <Button 
            type={sort === 'new' ? 'primary' : 'default'} 
            onClick={() =>handleSort('new')}
          >
            New
          </Button>
          <Button 
            type={sort === 'old' ? 'primary' : 'default'} 
            onClick={() => handleSort('old')}
          >
            Old
          </Button>

        </Row>
      </Col>
    </Row>
  )
}