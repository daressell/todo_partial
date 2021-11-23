export const Pagination = () => {
  return(
    <div className="block" id="pagination">
      <span className="page">
        <i className="fas fa-angle-left"></i>
      </span>  
      <span className="page selected">1</span>
      <span className="page">2</span>
      <span className="page">3</span>
      <span className="page">
        <i className="fas fa-angle-right"></i>
      </span>
      
      
    </div>
  )
}