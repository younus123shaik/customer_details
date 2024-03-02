import React from 'react'
import { useNavigate } from 'react-router-dom'

const Frontpage = () => {
  const nav=useNavigate()
  return (
    <div class="w3-display-middle body" style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column',width:'100%',height:'100vh',backgroundColor:'lightslategray'}}>
    <h1 class="w3-jumbo w3-animate-top h1">Welcome To Zithara Assesment</h1>
    <hr class="w3-border-grey" style={{width:'40%'}}/>
    <p class="w3-large w3-center p">Customer Details</p>
    <button className='wel-btn' onClick={()=>{nav('/customer')}}>Proceed</button>
  </div>
  )
}

export default Frontpage