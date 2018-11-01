import React from 'react';
import {Helmet} from "react-helmet";


class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    const {title,style={},className=''} = this.props
    return (
      <div >
       <Helmet>
          <link rel="stylesheet" type="text/css" href="./themes/theme-purple.css" />
       </Helmet>
      </div>
    )
  }
}

export default Header
