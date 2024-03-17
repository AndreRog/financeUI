import { useState } from 'react'
import './App.css'
import UploadButton from './components/UploadButton'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <UploadButton/>
    </>
  )
}

export default App
