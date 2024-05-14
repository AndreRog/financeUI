import { useState } from 'react'
import './App.css'
import UploadButton from './components/UploadButton';
import Expenses from './screens/home/Expenses';

function App() {
  const [count, setCount] = useState(0)

  return (

    <>
      <div className='container'>
        <Expenses></Expenses>

          {/* <UploadButton /> */}
      </div>
    </>
  )
}

export default App
