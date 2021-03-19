import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ClusteredData } from './components/ClusteredData';
function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={ClusteredData} />
      </Switch>
    </Router>
  );
}

export default App;
