import './Content.css'
import imgRight1 from '../img/right1.jpg'
import imgRight2 from '../img/right2.jpg'
import imgRight3 from '../img/right3.jpg'
import imgRight4 from '../img/right4.jpg'
const AsideRight = ({children})=> {
    return(
        <div id='AsideRight'>
            <img src= {imgRight1} alt="PMA" />
            <img src= {imgRight2} alt="PMA" />
            <img src= {imgRight3} alt="PMA" />
            <img src= {imgRight4} alt="PMA" />
            {children}
        </div>
    );
} 
export default AsideRight;