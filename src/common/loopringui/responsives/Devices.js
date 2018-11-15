import MediaQuery from 'react-responsive';

const NotDesktop = props => <MediaQuery {...props} maxWidth={1023} /> ;
const IsDesktop = props => <MediaQuery {...props} minWidth={1024} /> ;
const IsDesktop1 = props => <MediaQuery {...props} minWidth={1024} /> ;
const IsDesktop2 = props => <MediaQuery {...props} minWidth={1280} /> ;
const IsDesktop3 = props => <MediaQuery {...props} minWidth={1440} /> ;
const IsDesktop4 = props => <MediaQuery {...props} minWidth={1680} /> ;
const IsDesktop5 = props => <MediaQuery {...props} minWidth={1920} /> ;
const IsMobile1 = props => <MediaQuery {...props} minWidth={320} /> ;
const IsMobile2 = props => <MediaQuery {...props} minWidth={375} /> ;
const IsMobile3 = props => <MediaQuery {...props} minWidth={414} /> ;
const Tablet = props => <MediaQuery {...props} minWidth={768} maxWidth={991} /> ;

export default {
  NotDesktop,
  IsDesktop,
  IsDesktop1,
  IsDesktop2,
  IsDesktop3,
  IsDesktop4,
  IsDesktop5,
  IsMobile1,
  IsMobile2,
  IsMobile3,
}

