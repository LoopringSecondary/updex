import React from 'react';
import {Helmet} from "react-helmet";
import {connect} from "dva";

class Heads extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    const {theme,changeColor} = this.props
    return (
      <div >
        {
          true && theme === 'purple' &&
          <Helmet>
             <link rel="stylesheet" type="text/css" href="./themes/theme-purple-110902.css" />
             {changeColor === 'red-green+' && <body className="red-down-green-down" />}
             {changeColor === 'red+green-' && <body className="red-up-green-down" />}
          </Helmet>
        }
        {
          true && theme === 'darkgrey' && 
          <Helmet>
             <link rel="stylesheet" type="text/css" href="./themes/theme-darkgrey-110902.css" />
             {changeColor === 'red-green+' && <body className="red-down-green-down" />}
             {changeColor === 'red+green-' && <body className="red-up-green-down" />}
          </Helmet>
        }
        {
          true && theme === 'white' && 
          <Helmet>
             <link rel="stylesheet" type="text/css" href="./themes/theme-white-110902.css" />
             {changeColor === 'red-green+' && <body className="red-down-green-down" />}
             {changeColor === 'red+green-' && <body className="red-up-green-down" />}
          </Helmet>
        }
        {
          true && theme === 'blue' && 
          <Helmet>
             <link rel="stylesheet" type="text/css" href="./themes/theme-blue-110902.css" />
             {changeColor === 'red-green+' && <body className="red-down-green-down" />}
             {changeColor === 'red+green-' && <body className="red-up-green-down" />}
          </Helmet>
        }

      </div>
    )
  }
}

export default connect(({settings})=>({
  theme:settings.preference.theme,
  changeColor:settings.preference.changeColor,
}))(Heads)
