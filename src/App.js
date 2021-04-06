import './App.css';
import AppController from './controllers/app-controller'
import Antares from "antares";

function App() {
  return (
    <Antares className="App" federated={false} throttle={500}>
      <AppController />
    </Antares>
  );
}

export default App;
