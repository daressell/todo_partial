export const Pagination = ({itemsCount, activePage, handlePage}) => {
  
  const numberOfPages = Math.ceil(itemsCount/5);

  const handleClick = (newPage) => {
    if(newPage > (numberOfPages - 1) || newPage < 0){
      return 0
    }
    handlePage(newPage);
  }
  return(
    <div>
      {(numberOfPages > 1) && 
        <div className="block" id="pagination">
          <span className="page arrow" onClick={() => handleClick(0)}>
            <i className="fas fa-angle-double-left"></i>
          </span>
          <span className="page arrow" onClick={() => handleClick(activePage - 1)}>
            <i className="fas fa-angle-left"></i>
          </span>
          {/* создаем массив из количества страниц элементов */}
          {[...Array(numberOfPages)].map((x, i) =>
            {
              let classes = 'page '
              i > activePage + 2 ? classes += 'no-vis ' : void(0)
              i < activePage - 2 ? classes += 'no-vis ' : void(0)
              i === activePage ? classes += 'active ' : void(0)
              return(<span className={classes} key={i+1} onClick={() => {handlePage(i)}}>{i+1}</span>)
            }
          )}
          <span className="page arrow" onClick={() => handleClick(activePage + 1)}>
            <i className="fas fa-angle-right"></i>
          </span>
          <span className="page arrow" onClick={() => handleClick(numberOfPages - 1)}>
          <i className="fas fa-angle-double-right"></i>
          </span>
        </div>
      }
    </div>
    
  )
}