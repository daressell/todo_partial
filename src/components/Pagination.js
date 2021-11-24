export const Pagination = ({items, handlePage}) => {
  const numberOfPages = Math.ceil(items.length/5);
  return(
    <div className="block" id="pagination">
      <span className="page">
        <i className="fas fa-angle-left"></i>
      </span>
      {[...Array(numberOfPages)].map((x, i) =>
         <span className="page" key={i+1} onClick={() => handlePage(i)}>{i+1}</span>
      )}
      <span className="page">
        <i className="fas fa-angle-right"></i>
      </span>
      
      
    </div>
  )
}