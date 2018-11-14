import Responsive from 'react-responsive';

const Desktop1 = props => <Responsive {...props} minWidth={1024} /> ;
const Desktop2 = props => <Responsive {...props} minWidth={1280} /> ;
const Desktop3 = props => <Responsive {...props} minWidth={1440} /> ;
const Desktop4 = props => <Responsive {...props} minWidth={1680} /> ;
const Desktop5 = props => <Responsive {...props} minWidth={1920} /> ;
const Mobile1 = props => <Responsive {...props} minWidth={320} /> ;
const Mobile2 = props => <Responsive {...props} minWidth={375} /> ;
const Mobile3 = props => <Responsive {...props} minWidth={414} /> ;
const Tablet = props => <Responsive {...props} minWidth={768} maxWidth={991} /> ;

export default {
  Desktop1,
  Desktop2,
  Desktop3,
  Desktop4,
  Desktop5,
  Mobile1,
  Mobile2,
  Mobile3,
}

