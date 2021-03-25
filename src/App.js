import './App.css';
import AppController from './controllers/app-controller'
import Antares from "antares";

function App() {
  return (
    <Antares className="App" federated={false}>
      <AppController />
    </Antares>
  );
}

export default App;
