import {BrowserRouter,Route,Routes} from 'react-router-dom'
import './App.css';
import Table from './components/Table';
import Frontpage from './components/Frontpage'
function App() {

  return (

      <BrowserRouter>
      <Routes>
        <Route path='/welcome' element={<Frontpage/>}/>
        <Route path='/' element={<Table/>}/>
      </Routes>
      </BrowserRouter>
    
  );
}

export default App;
