import React, { useEffect, useState } from "react";
import Uik from "@reef-defi/ui-kit";
import "../home/index.css";
import { idoType } from "../../assets/ido";
import { ReefSigner, hooks, appState } from "@reef-defi/react-lib";
import BigNumber from "bignumber.js";
import { Crowdsale } from "../../abis/Crowdsale";
import { Contract } from "ethers";
import slide1 from "../../assets/images/banner-slider.png";
import footervect from "../../assets/images/bg-left.png";
import footervect2 from "../../assets/images/bg-center.png";
import footervect3 from "../../assets/images/bg-right.png";
import homeService from "../../service/homeService";
import { Link } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import Header from "../home/Header";

export const Dashboard: React.FC = () => {
  const [allIdos, setAllIdos] = useState<idoType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [trigger, setTrigger] = useState<boolean>();
  const [isloader, setIsloader] = useState(false);
  /** distribute between upcomming and previous */
  function loadCrowdSaleList() {
    setIsloader(true)
    homeService.CrowdSale().then((res) => {
      if (res) {
        setIsloader(false)
        setAllIdos(res.data.data)
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

  const [myCrowdsales, setMyCrowdsales] = useState<idoType[]>([]);

  const selectedSigner: ReefSigner | undefined | null =
    hooks.useObservableState(appState.selectedSigner$);

  const sortAllIdos = async (
    allTypesOfIdos: idoType[],
    selectedSigner: ReefSigner
  ) => {
    // setIsSorting(() => true);

    const idos = allTypesOfIdos;
    if (idos && idos.length > 0) {
      let myIdos = [] as idoType[];

      for (let ido of idos) {
        setIsloader(true)

        try {
          const crowdsaleContract = new Contract(
            ido.crowdsaleAddress,
            Crowdsale,
            selectedSigner.signer
          );

          const vestingScheduleForBeneficiary =
            await crowdsaleContract.vestingScheduleForBeneficiary(
              selectedSigner.evmAddress
            );

          const amount = vestingScheduleForBeneficiary[0]; // total invested
          const amountInString = amount.toString();
          if (new BigNumber(amountInString).isGreaterThan(0)) myIdos.push(ido);
        } catch (e) {
          console.log("Error while checking for my crowdsale", e);
        }
      }
     

      setMyCrowdsales(() => myIdos);
      setIsloader(false)
      // setIsSorting(() => false);
    }
    // setIsSorting(() => false);
  };

  useEffect(() => {
    if (selectedSigner) {
      sortAllIdos(allIdos, selectedSigner).catch((e) => {
        // setIsSorting(() => false);
        console.log("Error in sortAllIdos: ", e);
      });
    }
  }, [allIdos, selectedSigner]);

  return (
    <>
      <Header page={"yes"} />

<div>
    
        <div className="presales-section presales-section2">
        <div className="container">
          <div className="heading-main">
            
            <h2>My CrowdSale</h2>
            
            
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
              <div  className="Journeynumberpage">
                {
                myCrowdsales?.map((res: any, i: number) => {
                  let date = new Date(res.vestingStart * 1000);
                  const formattedDate = date.toLocaleDateString();
                  const formattedTime = date.toLocaleTimeString();

                  return (
                     <div  className="Journey-item-page">
                    <div className="Journey-item ">
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
                    </div>
                  );
                })}
              </div>
             
            
          )  }

        </div>
        <div className="">
          <img src={footervect} className="vect1" />
          <img src={footervect2} className="vect2" />
          <img src={footervect3} className="vect3" />
          {/* <img src={footervect4} className='vect4' /> */}
        </div>
      </div>
     
    
</div>

    </>
  );
};