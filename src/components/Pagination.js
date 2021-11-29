export const Pagination = ({pages, activePage, handlePage}) => {
  console.log('pages', pages);
  const handleClick = (newPage) => {
    if((newPage > pages) || newPage < 0){
      return 0
    }
    handlePage(newPage);
  }
  return(      
    <div className="block" id="pagination">
      <span className="page arrow" onClick={() => handleClick(1)}>
        1
      </span>
      <span className="page arrow" onClick={() => handleClick(activePage - 1)}>
        <i className="fas fa-angle-left"></i>
      </span>
      {/* создаем массив undefind элементов из количества страниц элементов */}
      {[...Array(pages)].map((x, i) =>
        {
          let classes = 'page '
          i+1 > activePage + 2 && (classes += 'no-vis ')
          i+1 < activePage - 2 && (classes += 'no-vis ')
          i+1 === activePage && (classes += 'active ')
          return(<span className={classes} key={i+1} onClick={() => {handlePage(i+1)}}>{i+1}</span>)
        }
      )}
      <span className="page arrow" onClick={() => handleClick(activePage + 1)}>
        <i className="fas fa-angle-right"></i>
      </span>
      <span className="page arrow" onClick={() => handleClick(pages)}>
        {pages}
      </span>
    </div>
  )
}