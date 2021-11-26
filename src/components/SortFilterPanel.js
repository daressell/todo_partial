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
            type={sort === 1 ? 'primary' : 'default'} 
            onClick={() =>handleSort(1)}
          >
            New
          </Button>
          <Button 
            type={sort === -1 ? 'primary' : 'default'} 
            onClick={() => handleSort(-1)}
          >
            Old
          </Button>

        </Row>
      </Col>
    </Row>
  )
}