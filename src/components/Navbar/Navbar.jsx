import React from 'react'
import { Link } from 'react-router-dom'

import finance_flash_logo from '../../assets/finance_flash_logo.png'
import './Navbar.css';

const Navbar = () => {
    
    return (
        <nav>
            <div className='navbar'>
                <Link to='/' className='nav-item nav-logo'>
                    <img src={finance_flash_logo} alt='finance_flash_logo' height="50" width="70"/>
                </Link>
                <Link to='/graphs' className='nav-item nav-btn'>Graphs</Link>                                
                <Link to='/fetch_data' className='nav-item nav-btn'>Fetched Data</Link>                                
            </div>
        </nav>
    )
}

export default Navbar