import './Content.css';
import Feed from './Feed'; // Import the Feed component here

const Content = ({ children }) => {
  return (
    <div id='ContentShow'>
      <div id='Feed'>
        <Feed/>
      </div>
      {children}
      
    </div>
  );
};

export default Content;
