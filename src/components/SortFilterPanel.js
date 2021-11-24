export const SortFilterPanel = ({handleFilter, handleSort}) => {
  return(
    <div className="sort-filter-panel">
      <div className="filters">
        <span className="filter" onClick={() => handleFilter('all')}>All</span>
        <span className="filter" onClick={() => handleFilter('done')}>Done</span>
        <span className="filter" onClick={() => handleFilter('undone')}>Undone</span>
      </div>
      <div className="sort">
        Sort by Date
        <span className="action" onClick={() => handleSort(1)}>
          <i className="fas fa-arrow-up"></i>
        </span>
        <span className="action" onClick={() => handleSort(-1)}>
          <i className="fas fa-arrow-down"></i>
        </span>
      </div>
    </div>
  )
}