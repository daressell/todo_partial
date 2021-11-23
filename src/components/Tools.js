export const Tools = () => {
  return(
    <div className="tools block">
      <div className="block">
        <div className="button">All</div>
        <div className="button">Done</div>
        <div className="button">Undone</div>
      </div>
      <div className="block">
        Sort by Date
        <div className="action">
          <i className="fas fa-arrow-up"></i>
        </div>
        <div className="action">
          <i className="fas fa-arrow-down"></i>
        </div>
      </div>
    </div>
  )
}