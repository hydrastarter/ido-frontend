
import React from 'react'
import Submarine from '../../../assets/images/submarine.svg';
import cloud from '../../../assets/images/cloud.png';
import cloud1 from '../../../assets/images/Cloud1.png';
import cloud2 from '../../../assets/images/Cloud2.png';
import cloud3 from '../../../assets/images/Cloud3.png';
import cloud4 from '../../../assets/images/Cloud4.png';
import PreviousPresales from './PreviousPresales';


function Banner() {

  return (
    <>
      <div className="banner-front">
        <div className="container">
          <div className="inner-caption">
            <div className="caption-des">
              <h2>The First Native Launchpad for Projects Launching on <span className='txt-brd'><span>Reef Chain</span></span></h2>
              <p>Proven Web3 initiatives. Carefully assessed. <br />
                Powered by industry-leading creators and reputable funds.</p>
            </div>
            <div className='cap-img'>
              <img src={Submarine} className='' alt='' />

            </div>
          </div>
        </div>
        <img src={cloud} className='ban-cloud' alt='' />
        <div className="wind">
          <div className="wave wave1"></div>
          {/* <div className="wave wave2"></div> */}
          <div className="wave wave3"></div>
          <div className="wave wave4"></div>
        </div>
        <div id="background-wrap">  
    <div className="x3">
        <div className="cloud">
            <img src={cloud2} alt="Cloud1" />
        </div>
    </div>

    <div className="x4">
        <div className="cloud">
            <img src={cloud2} alt="Cloud1" />
        </div>
    </div>

    <div className="x5">
        <div className="cloud">
            <img src={cloud3} alt="Cloud1" />
        </div>
    </div>
    <div className="x1">
        <div className="cloud">
            <img src={cloud4} alt="Cloud1" />
        </div>
    </div>
    <div className="x6">
        <div className="cloud">
            <img src={cloud2} alt="Cloud1" />
        </div>
    </div>
    <div className="x7">
        <div className="cloud">
            <img src={cloud1} alt="Cloud1" />
        </div>
    </div>
</div>
      </div>


      {/* <UpcomingPresales /> */}

    </>
  )
}

export default Banner;
