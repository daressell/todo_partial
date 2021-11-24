export const SortFilterPanel = ({filter, sort, handleFilter, handleSort}) => {
  return(
    <div className="sort-filter-panel">
      <div className="filters">
        <span className={filter === 'all' ? 'filter active' : 'filter'} onClick={() => handleFilter('all')}>All</span>
        <span className={filter === 'done' ? 'filter active' : 'filter'} onClick={() => handleFilter('done')}>Done</span>
        <span className={filter === 'undone' ? 'filter active' : 'filter'} onClick={() => handleFilter('undone')}>Undone</span>
      </div>
      <div className="sort">
        Sort by Date
        <span className={sort === 1 ? 'action active' : 'action'} onClick={() => handleSort(1)}>
          <i className="fas fa-arrow-up"></i>
        </span>
        <span className={sort === -1 ? 'action active' : 'action'} onClick={() => handleSort(-1)}>
          <i className="fas fa-arrow-down"></i>
        </span>
      </div>
    </div>
  )
}