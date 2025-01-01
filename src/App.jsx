import { useState } from 'react'

import './App.css'
import Navbar from './components/Navbar'
import Manage from './components/Manage'
import Footer from './components/Footer'

function App() {
  

  return (
    <div className='[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]'>
      <Navbar/>
      {/* <div className='min-h-[80vh]'>
        <Manage/>
      </div> */}
      <Manage/>
      <Footer/>
    </div>
  )
}

export default App
