import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import homeService from '../../service/homeService';
import { CirclesWithBar } from 'react-loader-spinner';
import "../home/styles.scss";

export default function DetailSlider(file_id:any) {
  const [nav1, setNav1] = useState();
  const [nav2, setNav2] = useState();
  const [files, setFiles] = useState([] as any);
  const [trigger, setTrigger] = useState<boolean>();

  function loadBannerFiles() {

    homeService.hydraStarterCMSFiles(file_id).then(res => {
      if (res) {
        setFiles(res.data.data)
      }
    })
  }

 


  useEffect(() => {

    setTrigger(true)
    if (trigger === true) {

      loadBannerFiles();
    }

  }, [trigger])


  return (
    <div>

      <div>
        {
          files ?
            <Slider asNavFor={nav2} ref={(slider1:any) => setNav1(slider1)} className='top-main-slider'>
              {
                files?.map((res:any, i:number) => {

                  return (

                    <div>
                      <div className='img-big'>
                        {/* <img src={`https://154.41.254.185:9102/assets/${res.directus_files_id}?access_token=${token}`} /> */}
                        <img src={`https://cms.piyushchauhan.online/assets/${res.directus_files_id}`} />

                      </div>
                    </div>


                  )
                })}

            </Slider> : <CirclesWithBar outerCircleColor="blue" innerCircleColor="blue" />
        }
        {
          files ?
            <Slider
              asNavFor={nav1}
              ref={(slider2 :any) => setNav2(slider2)}
              slidesToShow={4}
              swipeToSlide={true}
              infinite={false}

              focusOnSelect={true} className='thumbnail-slider'
            >

              {
                files?.map((res:any, i:number) => {

                  return (
                    <div>
                      <div className='img-small'>
                        {/* <img src={`https://154.41.254.185:9102/assets/${res.directus_files_id}??access_token=${token}`} /> */}
                        <img src={`https://cms.piyushchauhan.online/assets/${res.directus_files_id}`} />

                      </div>
                    </div>
                  )
                }
                )}
            </Slider>
            :
            <CirclesWithBar outerCircleColor="blue" innerCircleColor="blue" />
        }

      </div>


    </div>
  );
}
