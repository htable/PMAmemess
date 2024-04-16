import './App.css';
import FirebaseConnector from './api/Firebase';
import Main from './pages/Main';
function App() {

  return (
    <div className="App">
      <FirebaseConnector/>
      <Main />
           
    </div>
  );
}

export default App;
