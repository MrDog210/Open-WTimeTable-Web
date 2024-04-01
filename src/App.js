import { Route, Router } from 'wouter';
import SchoolCodeInputPage from './pages/SchoolCodeInputPage';
import TimetablePage from './pages/TimetablePage';
import { useHashLocation } from "wouter/use-hash-location";

function App() {
  return (
    <Router hook={useHashLocation}>
      <Route path='/' component={SchoolCodeInputPage} />
      <Route path='/:schoolCode'>
        {(params) => <TimetablePage firstSchoolCode={params.schoolCode} />}
      </Route>
    </Router>
  )
}

export default App;
