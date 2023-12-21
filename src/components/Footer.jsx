// import needed data (and social media icons)
import React from 'react'
import '../assets/css/Footer.css';

const Footer = () => {
  return (
    
    // each icon is linked to a corresponding profile! (target blank indicates opening the link on a new tab/page)
    <footer className="footer-container">
      <div className="footer-links">


        {/* ADD a copyright and license tab etc... */}




        

        <a href="https://github.com/thatOneMHMD/recipe-finder" target="_blank">
          Privacy
        </a>

        <a href="https://github.com/thatOneMHMD" target="_blank">
          GitHub
        </a>


      </div>
    </footer>
    
  )
}

export default Footer