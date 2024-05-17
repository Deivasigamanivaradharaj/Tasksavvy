import React from 'react'
import { Outlet } from 'react-router-dom'
import './Members.css'

function Members() {
  return (
    <div className='mytasks'>
        <Outlet></Outlet>
    </div>
  )
}

export default Members