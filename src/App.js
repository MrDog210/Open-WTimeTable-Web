import { Route, Switch, useLocation } from 'wouter';
import './App.css';
import SchoolCodeInputPage from './pages/SchoolCodeInputPage';
import SchoolSetupPage from './pages/SchoolSetupPage';
import TimetablePage from './pages/TimetablePage';

function App() {
  const [location, setLocation] = useLocation();

  return (
    <Switch>
      <Route path='/' component={SchoolCodeInputPage} />
      <Route path='setup/:schoolCode'>
        {(params) => <SchoolSetupPage schoolCode={params.schoolCode} />}
      </Route>
      <Route path='timetable/:schoolCode'>
        <TimetablePage />
      </Route>
    </Switch>
  )
}

export default App;
