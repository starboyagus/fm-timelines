import { Routes, Route } from 'react-router-dom';
import './App.css';
import { Home } from './components/home/home';
import { Timeline } from './components/timeline/timeline';

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/timeline/*' element={<Timeline />} />
      </Routes>
    </>
  );
}

export default App;
