import Responsive from 'react-responsive';

const Resolution1 = props => <Responsive {...props} minResolution="1dppx" /> ;
const Resolution2 = props => <Responsive {...props} minResolution="2dppx" /> ;

export default {
  Resolution1,
  Resolution2,
}

