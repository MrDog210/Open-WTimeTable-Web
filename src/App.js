import { Route, Switch, useLocation } from 'wouter';
import './App.css';
import SchoolCodeInputPage from './pages/SchoolCodeInputPage';
import SchoolSetupPage from './pages/SchoolSetupPage';

function App() {
  const [location, setLocation] = useLocation();

  return (
    <Switch>
      <Route path='/' component={SchoolCodeInputPage} />
      <Route path='setup/:schoolCode'>
        {(params) => <SchoolSetupPage schoolCode={params.schoolCode} />}
      </Route>
    </Switch>
  )
}

export default App;
