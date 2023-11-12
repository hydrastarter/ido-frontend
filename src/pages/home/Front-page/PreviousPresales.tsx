import React, { useState, useRef, useEffect } from "react";
import slide1 from "../../../assets/images/banner-slider.png";
import slide2 from "../../../assets/images/logo-sl.svg";
import prev from "../../../assets/images/icons/prev.svg";
import next from "../../../assets/images/icons/next.svg";
import footervect from "../../../assets/images/bg-left.png";
import footervect2 from "../../../assets/images/bg-center.png";
import footervect3 from "../../../assets/images/bg-right.png";
import homeService from "../../../service/homeService";
import { Link } from "react-router-dom";
import middlebg from "../../../assets/images/bg-middle.png";
import { RotatingLines } from "react-loader-spinner";
import Slider from "react-slick";

function PreviousPresales() {
  const customeSlider = useRef<any>();
  const [trigger, setTrigger] = useState<boolean>();
  const [isloader, setIsloader] = useState(false);

  /** store api data */
  const [apiData, setApiData] = useState([] as any);
  const [apiData2, setApiData2] = useState([] as any);
  const upcomingFilesValue = {
    Body: [] as any[],
  };
  const preFilesValue = {
    Body: [] as any[],
  };

  /** distribute between upcomming and previous */
  function loadCrowdSaleList() {
    setIsloader(true)
    const currentTimestamp = Math.floor(Date.now() / 1000);
    let values = [];
    homeService.CrowdSale().then((res) => {
      if (res) {
        setIsloader(false)
        values = res.data.data;
        values.forEach((ele: any) => {
          if (parseInt(ele["crowdsaleStartTime"]) > currentTimestamp) {
            if (!upcomingFilesValue.Body) {
              upcomingFilesValue.Body = [];
              upcomingFilesValue.Body.push(ele);
            } else {
              upcomingFilesValue.Body.push(ele);
            }
          } else {
            if (!preFilesValue.Body) {
              preFilesValue.Body = [];
              preFilesValue.Body.push(ele);
            } else {
              preFilesValue.Body.push(ele);
            }
          }
        });
        setApiData(upcomingFilesValue.Body);
        setApiData2(preFilesValue.Body);
      }
    });
  }

  useEffect(() => {
    setTrigger(true);
    if (trigger === true) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);

      loadCrowdSaleList();
    }
  }, [trigger]);

  const sliderSettings = {
    infinite: apiData.length >= 4 ? true : false,
    speed: 2500,
    arrows: false,
    slidesToShow: 4,
    autoplay: false,
    margin: 15,
    dots: true,
    autoplaySpeed: 1000,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          adaptiveHeight: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const sliderSettingsAgain = {
    infinite: apiData2.length >= 4 ? true : false,
    speed: 2500,
    arrows: false,
    slidesToShow: 4,
    autoplay: false,
    margin: 15,
    dots: true,
    autoplaySpeed: 1000,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          adaptiveHeight: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const gotoNext = () => {
    customeSlider.current.slickNext();
  };

  const gotoPrev = () => {
    customeSlider.current.slickPrev();
  };

  return (
    <>
      {/* Upcoming sale slider */}

      <div className="presales-section">
        <div className="container">
          <div className="heading-main">
            <h2>Upcoming Presales</h2>
          </div>
          {isloader ?  (
            <div className="txt-center">
              <RotatingLines
                strokeColor="white"
                strokeWidth="5"
                animationDuration="0.75"
                width="96"
                visible={true}
              />
            </div>
          ):(
            <div className="slider-mn">
              <Slider
                {...sliderSettings}
                ref={customeSlider}
                className="Journeynumber"
              >
                {apiData?.map((res: any, i: number) => {
                  let date = new Date(res.vestingStart * 1000);
                  const formattedDate = date.toLocaleDateString();
                  const formattedTime = date.toLocaleTimeString();
                  return (
                    <div className="Journey-item">
                      <Link to={`/details/${res.id}`}>
                        <div className="journey-des-top">
                          <img src={slide1} className="" alt="" />
                          <span className="number">
                            {formattedDate} & {formattedTime}
                          </span>
                        </div>
                        <div className="journey-des-btm">
                          <div className="logo-cont">
                            <img src={res.tokenImageUrl} />
                            {/* <img src={slide2} /> */}
                          </div>
                          <div className="headings">
                            <h2>{res.tokenName}</h2>
                            <h4>{res.tokenSymbol}</h4>
                            <h5 className="h4">{res.description}</h5>
                          </div>
                          <div className="goals-se">
                            <div className="goals-box">
                              <h5>Fundraiser Goal</h5>
                              <h2>${res.crowdsaleTokenAllocated}</h2>
                            </div>
                            <div className="goals-box">
                              <h5>Max Allocation</h5>
                              <h2>${res.maxUserAllocation}</h2>
                            </div>
                          </div>
                          <div className="link-btm">
                            <a href="#">Token Sale</a>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </Slider>
              <div className="nav-slider">
                {apiData.length > 4 ? (
                  <div>
                    <span onClick={() => gotoNext()}>
                      <img src={next} className="" alt="" />
                    </span>
                    <span onClick={() => gotoPrev()}>
                      <img src={prev} className="" alt="" />
                    </span>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          ) }

          <div className="link-btn">
            <a href="#" className="btn-link">
              View All
            </a>
          </div>
        </div>
        <div className="">
          <img src={middlebg} className="vect1-middle" />
        </div>
        <div className="main">
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
        </div>
      </div>

      {/* Previous slider */}

      <div className="presales-section presales-section2">
        <div className="container">
          <div className="heading-main">
            <h2>Previous Presales</h2>
          </div>
          {isloader ? (
            <div className="txt-center">
              <RotatingLines
                strokeColor="white"
                strokeWidth="5"
                animationDuration="0.75"
                width="96"
                visible={true}
              />
            </div>
          ):(
            <div className="slider-mn">
              <Slider
                {...sliderSettingsAgain}
                ref={customeSlider}
                className="Journeynumber"
              >
                {apiData2?.map((res: any, i: number) => {
                  let date = new Date(res.vestingStart * 1000);
                  const formattedDate = date.toLocaleDateString();
                  const formattedTime = date.toLocaleTimeString();

                  return (
                    <div className="Journey-item">
                      <Link to={`/details/${res.id}`}>
                        <div className="journey-des-top">
                          <img src={slide1} className="" alt="" />
                          <span className="number">
                            {formattedDate} & {formattedTime}
                          </span>
                        </div>
                        <div className="journey-des-btm">
                          <div className="logo-cont">
                            <img src={res.tokenImageUrl} />
                            {/* <img src={slide2} /> */}
                          </div>
                          <div className="headings">
                            <h2>{res.tokenName}</h2>
                            <h4>{res.tokenSymbol}</h4>
                            <h5 className="h4">{res.description}</h5>
                          </div>
                          <div className="goals-se">
                            <div className="goals-box">
                              <h5>Fundraiser Goal</h5>
                              <h2>${res.crowdsaleTokenAllocated}</h2>
                            </div>
                            <div className="goals-box">
                              <h5>Max Allocation</h5>
                              <h2>${res.maxUserAllocation}</h2>
                            </div>
                          </div>
                          <div className="link-btm">
                            <a href="#">Token Sale</a>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </Slider>
              <div className="nav-slider">
                {apiData2.length > 4 ? (
                  <div>
                    <span onClick={() => gotoNext()}>
                      <img src={next} className="" alt="" />
                    </span>
                    <span onClick={() => gotoPrev()}>
                      <img src={prev} className="" alt="" />
                    </span>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          )  }

          <div className="link-btn">
            <a href="#" className="btn-link">
              View All
            </a>
          </div>
        </div>
        <div className="">
          <img src={footervect} className="vect1" />
          <img src={footervect2} className="vect2" />
          <img src={footervect3} className="vect3" />
          {/* <img src={footervect4} className='vect4' /> */}
        </div>
      </div>
    </>
  );
}

export default PreviousPresales;
