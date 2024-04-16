import './Content.css'
import imgLeft1 from '../img/left1.jpg'
import imgLeft2 from '../img/left2.jpg'
import imgLeft3 from '../img/left3.jpg'
import imgLeft4 from '../img/left4.jpg'
const AsideLeft = ({children}) => {
    
    
    return (
        <div id="AsideLeft">
            <img src= {imgLeft1} alt="PMA" />
            <img src= {imgLeft2} alt="PMA" />
            <img src= {imgLeft3} alt="PMA" />
            <img src= {imgLeft4} alt="PMA" />
      {children}
    </div>
    );
}

export default AsideLeft;