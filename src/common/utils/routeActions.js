import { routerRedux} from 'dva/router';
import createHashHistory from 'history/createHashHistory';
const history  = createHashHistory()
export default  {
  goBack:()=>{
      history.goBack()
  },
  goForward:()=>{
      history.goForward()
  },
  gotoRoute:(route)=>{
      history.push(route);
  },
  gotoPath:(path,state)=>{
    history.push({
      pathname:path,
      ...state,
    });
  },
  gotoHref:(href)=>{
     window.open(href);
  },
  getParamsByMatch:(match)=>{
    if(match && match.params){
      return match.params
    }else{
      return null
    }
  },
  match:{
    getParams:(props)=>{
      if(props && props.match && props.match.params){
        return props.match.params
      }else{
        return null
      }
    },
    getUrl:(props)=>{
      if(props && props.match && props.match.url){
        return props.match.url
      }else{
        return null
      }
    },
  },
  location:{
    getPathname:(props)=>{
      if(props && props.location && props.location.pathname){
        return props.location.pathname
      }else{
        return null
      }
    },
    getState:(props)=>{
      if(props && props.location && props.location.state){
        return props.location.state
      }else{
        return null
      }
    },
    getQueryByName:(props,name)=>{
      if(name && props && props.location && props.location.search){
        return getParameterByName(name,props.location.search)
      }else{
        return null
      }
    },
  }
}

// https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

