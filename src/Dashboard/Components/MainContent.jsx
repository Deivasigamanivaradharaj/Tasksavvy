import React from 'react'
import Header from '../Components/Header'
import { Outlet } from 'react-router-dom'

function MainContent() {
  return (
    <div className='MainContent'>
      <Header></Header>
      <Outlet></Outlet>
    </div>
  )
}

export default MainContent