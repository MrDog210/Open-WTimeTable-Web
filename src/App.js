import { Route, Switch, useLocation } from 'wouter';
import SchoolCodeInputPage from './pages/SchoolCodeInputPage';
import SchoolSetupPage from './pages/SchoolSetupPage';
import TimetablePage from './pages/TimetablePage';

function App() {
  const [location, setLocation] = useLocation();

  return (
    <Switch>
      <Route path='/' component={SchoolCodeInputPage} />

      <Route path='/:schoolCode'>
        {(params) => <TimetablePage firstSchoolCode={params.schoolCode} />}
      </Route>
    </Switch>
  )
}

export default App;
