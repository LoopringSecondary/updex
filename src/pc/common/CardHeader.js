import React from 'react';

class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    const {title,style={},className=''} = this.props
    return (
      <div className={`row no-gutters ml0 mr0 ${className}`} style={{height:'auto',...style}}>
        <div className="col-auo d-flex align-items-center fs16 text-primary pl15 pt10 pb10" style={{height:'auto'}}>
          {title}
        </div>
        <div className="col" style={{height:'auto'}}>
        </div>
      </div>
    )
  }
}

export default Header
