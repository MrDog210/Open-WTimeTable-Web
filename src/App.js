import './App.css';
import SchoolCodeInputPage from './pages/SchoolCodeInputPage';
import { useState } from 'react';

function App() {
  const [path, setPath] = useState(window.location.pathname);

  function changePath(newPath) {
    setPath(newPath)
    window.history.pushState(null, null, newPath)
  }

  if(path === '/') {
    return <SchoolCodeInputPage changePath={changePath} />
  } else {
    return (
      <div>
  
      </div>
    );
  }
}

export default App;
