import React from 'react';
import './FixedTable.less'
const FixedTable = ({ children, className='',style={}, ...rest }) => {
  return (
    <div className={`fixed-table-container ${className}`} style={style}>
      <div className="fixed-table-inner">
        {children}
      </div>
    </div>
  )
};
export default FixedTable;
