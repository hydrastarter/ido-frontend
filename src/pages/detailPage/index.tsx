import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, useParams } from "react-router-dom";
import homeService from "../../service/homeService";
import { RotatingLines } from "react-loader-spinner";
import Header from "../home/Header";
import logoicon from "../../assets/images/logo-icon.png";
import DetailSlider from "./DetailSlider";
import "../home/styles.scss";
import { Crowdsale } from "../../abis/Crowdsale";
import { idoType, inputTokenType } from "../../assets/ido";
import { ERC20 } from "../../abis/ERC20";
import BigNumber from "bignumber.js";
import { appState, hooks, ReefSigner } from "@reef-defi/react-lib";
import { Contract } from "ethers";
import Countdown from "react-countdown";
import Uik from "@reef-defi/ui-kit";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

export default function DetailPage() {
  const [trigger, setTrigger] = useState<boolean>();
  const [data, setData] = useState([] as any);
  const [detail, setDetail] = useState([] as any);
  const [active, setActive] = useState(0);
  const params: { id: string } = useParams();
  const [list, setList] = useState([] as any);
  const selectedSigner: ReefSigner | undefined | null =
    hooks.useObservableState(appState.selectedSigner$);
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const [ido, setIdoData] = useState<idoType | null>(null);
  const [selectedInputToken, setSelectedInputToken] =
    useState<inputTokenType | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [investValue, setInvestValue] = useState("0");
  const [isInvesting, setIsInvesting] = useState(false);
  const [isSelectorOpen, setSelectorOpen] = useState(false);
  const [isloader, setIsloader] = useState(false);

  const [typeOfPresale, setTypeofPresale] = useState<
    "Active Presales" | "Upcoming Presales" | "Completed Presales"
  >("Active Presales");
  const [isOpen, setOpen] = useState(false);
  const [txHash, setTxHash] = useState(null);

  /** date format */
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  } as const;

  /**  detail page specific  crowsale APi */

  function loadCrowdSaleDetail() {
    setIsloader(true);
    homeService
      .CrowdSaleID(params.id)
      .then((res) => {
        if (res) {
          setIsloader(false);
          setData(res.data.data);
          let date = new Date(res.data.data.vestingStart * 1000);
          setDetail(date.toLocaleDateString("en-US", options));
          const ido = res.data.data as idoType;
          setIdoData(() => ido);
          setSelectedInputToken(() => ido.inputTokens[0]);
          console.log(res.data.data, "fffffffffffffff");
          const currentTime = Math.floor(+new Date() / 1000);
          const idoStartTime = parseFloat(res.data.data.crowdsaleStartTime);
          const idoEndTime = parseFloat(res.data.data.crowdsaleEndTime);

          if (idoStartTime < currentTime && idoEndTime > currentTime) {
            setTypeofPresale("Active Presales");
          } else if (idoStartTime > currentTime && idoEndTime > currentTime) {
            setTypeofPresale("Upcoming Presales");
          } else {
            setTypeofPresale("Completed Presales");
          }
        } else {
          setData([]);
        }
      })
      .catch((error) => {
        setIsloader(false);
        setData([]);
      });
  }

  /** API for cms data for specific detail page */

  function loadCrowdSalecms() {
    setIsloader(true);
    homeService
      .hydraStarterCMS(params.id)
      .then((res) => {
        setIsloader(false);
        if (res) {
          setList(res.data.data);
        } else {
          setList([]);
        }
      })
      .catch((error) => {
        setIsloader(false);
        setList([]);
      });
  }

  useEffect(() => {
    setTrigger(true);
    if (trigger === true) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }

    loadCrowdSaleDetail();
    loadCrowdSalecms();
  }, [trigger]);

  const [contractDetails, setContractDetails] = useState({
    tokensRemainingForSale: "0",
    amount: "0",
    totalDrawn: "0",
    remainingBalance: "0",
    availableForDrawDown: "0",
  });

  async function handleClaim () {
    console.log("llllllllllllllllll");
    Uik.notify.info("Processing your claim request");
    if (ido) {
      setIsClaiming(() => true);

      const crowdsaleContractAddress = ido.crowdsaleAddress;

      try {
        if (selectedSigner) {
          const crowdsaleContract = new Contract(
            crowdsaleContractAddress,
            Crowdsale,
            selectedSigner.signer
          );

          const txObject = await crowdsaleContract.drawDown();
          await txObject.wait();
          setTxHash(txObject.hash);
          setOpen(true);

          Uik.notify.success("You have successfully claimed in the IDO");
          setIsClaiming(() => false);
        }
      } catch (e) {
        console.log("Error in handleInvest: ", e);
        Uik.notify.danger("An error has occurred");
        setIsClaiming(() => false);
      }
    }
  };

  async function handleInvest() {
    Uik.notify.info("Processing your deposit request");
    if (ido && selectedInputToken) {
      setIsInvesting(() => true);

      const crowdsaleContractAddress = ido.crowdsaleAddress;

      try {
        if (selectedSigner) {
          const crowdsaleContract = new Contract(
            crowdsaleContractAddress,
            Crowdsale,
            selectedSigner.signer
          );

          const erc20Contract = new Contract(
            selectedInputToken.inputTokenAddress,
            ERC20,
            selectedSigner.signer
          );

          const investValueInWei = new BigNumber(investValue)
            .multipliedBy(
              new BigNumber(10).pow(selectedInputToken.inputTokenDecimals)
            )
            .toString();

          await erc20Contract.approve(
            crowdsaleContractAddress,
            investValueInWei
          );
          Uik.notify.info("Approval successful, Now investing... ");

          await crowdsaleContract.purchaseToken(
            selectedInputToken.inputTokenAddress,
            investValueInWei
          );

          Uik.notify.success("You have successfully invested in the IDO");
          setIsInvesting(() => false);
        }
      } catch (e) {
        console.log("Error in handleInvest: ", e);
        Uik.notify.danger("An error has occurred");
        setIsInvesting(() => false);
      }
    }
  };

  /**
   * Take the difference between the dates and divide by milliseconds per day.
   * Round to nearest whole number to deal with DST.
   * first date < second date
   */
  function dateDiff(first: any, second: any) {
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
  }

  /**
   * new Date("dateString") is browser-dependent and discouraged, so we'll write
   * a simple parse function for U.S. date format (which does no error checking)
   */
  function parseDate(str: any) {
    let mdy = str.split("/");
    return new Date(mdy[2], mdy[0] - 1, mdy[1]);
  }

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 28,
    borderRadius: 9,
    marginTop: "20px",
    marginBottom: "20px",
    border: "2px solid white",
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: "#e4e0ef",
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 9,
      background: "linear-gradient(to right,#5d3bad ,#a93185)",
    },
  }));

  useEffect(() => {
    const getAllContractDetails = async (
      crowdsaleContractAddress: string,
      selectedSigner: ReefSigner
    ) => {
      const crowdsaleContract = new Contract(
        crowdsaleContractAddress,
        Crowdsale,
        selectedSigner.signer
      );

      const tokensRemainingForSale =
        await crowdsaleContract.tokenRemainingForSale();

      const vestingScheduleForBeneficiary =
        await crowdsaleContract.vestingScheduleForBeneficiary(
          selectedSigner.evmAddress
        );
      const amount = vestingScheduleForBeneficiary[0]; // total invested
      const totalDrawn = vestingScheduleForBeneficiary[1]; // claimed
      // const lastDrawnAt = vestingScheduleForBeneficiary[2]; // not needed
      const remainingBalance = vestingScheduleForBeneficiary[3]; // yet to claim
      const availableForDrawDown = vestingScheduleForBeneficiary[4]; // claimable

      setContractDetails({
        tokensRemainingForSale: tokensRemainingForSale.toString(),
        amount: amount.toString(),
        totalDrawn: totalDrawn.toString(),
        remainingBalance: remainingBalance.toString(),
        availableForDrawDown: availableForDrawDown.toString(),
      });
    };
    if (selectedSigner && ido) {
      getAllContractDetails(ido.crowdsaleAddress, selectedSigner);
    }
  }, [selectedSigner, ido]);

  let percentCompleted = 0;
  let tokensThatHaveBeenSold = 0; //important
  let idoVestingStart;
  let idoVestingEnd;
  let cliffTime;
  let vestingInfoDiff;
  let idoStartDate;
  let idoEndDate;
  let poolInfoDiff;
  let amount = "0";
  let displayTotalInvested = "0";
  let displayLocked = "0";
  let displayClaimable = "0";
  let displayClaimed = "0";
  let totalDrawn = "0";
  let remainingBalance = "0";
  let availableForDrawDown = "0";
  if (ido) {
    const tokensRemainingForSale = new BigNumber(
      contractDetails.tokensRemainingForSale
    )
      .dividedBy(new BigNumber(10).pow(ido.tokenDecimals))
      .toString();
    tokensThatHaveBeenSold =
      parseFloat(ido.crowdsaleTokenAllocated) -
      parseFloat(tokensRemainingForSale);
    percentCompleted = Math.floor(
      (tokensThatHaveBeenSold / parseFloat(ido.crowdsaleTokenAllocated)) * 100
    );
    idoVestingStart = new Date(
      parseFloat(ido.vestingStart) * 1000
    ).toLocaleDateString("en-US");
    idoVestingEnd = new Date(
      parseFloat(ido.vestingEnd) * 1000
    ).toLocaleDateString("en-US");

    cliffTime = new Date(
      parseFloat(ido.vestingStart) * 1000 + parseFloat(ido.cliffDuration) * 1000
    ).toLocaleDateString("en-US");

    vestingInfoDiff = dateDiff(
      parseDate(idoVestingStart),
      parseDate(idoVestingEnd)
    );
    idoStartDate = new Date(
      parseFloat(ido.crowdsaleStartTime) * 1000
    ).toLocaleDateString("en-US");
    idoEndDate = new Date(
      parseFloat(ido.crowdsaleEndTime) * 1000
    ).toLocaleDateString("en-US");
    poolInfoDiff = dateDiff(parseDate(idoStartDate), parseDate(idoEndDate));
    amount = new BigNumber(contractDetails.amount)
      .dividedBy(new BigNumber(10).pow(ido.tokenDecimals))
      .toString();
    totalDrawn = new BigNumber(contractDetails.totalDrawn)
      .dividedBy(new BigNumber(10).pow(ido.tokenDecimals))
      .toString();
    remainingBalance = new BigNumber(contractDetails.remainingBalance)
      .dividedBy(new BigNumber(10).pow(ido.tokenDecimals))
      .toString();
    availableForDrawDown = new BigNumber(contractDetails.availableForDrawDown)
      .dividedBy(new BigNumber(10).pow(ido.tokenDecimals))
      .toString();

    displayTotalInvested = new BigNumber(amount).toFixed(2);
    displayLocked = new BigNumber(remainingBalance).toFixed(2);
    displayClaimable = new BigNumber(availableForDrawDown).toFixed(2);
    displayClaimed = new BigNumber(totalDrawn).toFixed(2);
  }

  return (
    <div>
      <Header page={"yes"} />
      <section className="banner-section banner-section-inner">
        <Uik.Modal
          title="Claim Successful!"
          isOpen={isOpen}
          onClose={() => setOpen(false)}
          footer={
            <>
              <Uik.Button text="Close" onClick={() => setOpen(false)} />
              <Uik.Button
                text="Check Transcations"
                success
                fill
                onClick={() =>
                  window.open(
                    `https://reefscan.com/extrinsic/${txHash}`,
                    "_blank"
                  )
                }
              />
            </>
          }
        >
          <Uik.Text>
            You have successfully claimed {displayClaimed} {ido?.tokenSymbol}
          </Uik.Text>
        </Uik.Modal>
        <div className="container">
          {list.length === 0 &&  isloader ? (
            <div className="txt-center">
              <RotatingLines
                strokeColor="white"
                strokeWidth="5"
                animationDuration="0.75"
                width="96"
                visible={true}
              />
            </div>
          ) : (
            <div className="row-flex">
              {(list || []).map((res: any, i: number) => {
                return (
                  <div className="left-sec">
                    <div className="left-header">
                      <div className="">
                        <div className="logo-header">
                          {/* <img src={`https://154.41.254.185:9102/assets/${res.logo}`} alt="" className="img-fluid" /> */}
                          <img
                            src={`https://cmsapi.choiceindia.com/assets/${res.logo}`}
                            alt=""
                            className="img-fluid"
                          />
                        </div>
                      </div>
                      <div className="cap-header">
                        <h3>{res.title}</h3>
                        <p>{res.title_detail}</p>
                      </div>
                    </div>
                    <div className="sld-wrp">
                      <DetailSlider file_id={res.id} />
                    </div>
                  </div>
                );
              })}

              <div className="right-sec">
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
                ) : (
                  <div className="banner-card">
                    <div className="card-1">
                      <div className="card-logo">
                        <img src={logoicon} alt="" className="img-fluid" />
                      </div>
                      <div className="card-sold">
                        <button type="submit" className="btn-soldout">
                          Sold out
                        </button>
                      </div>
                    </div>
                    <div className="card-2">
                      <h2 className="total-val">
                        ${data.crowdsaleTokenAllocated}
                      </h2>
                      <span className="indctr">
                        Maximum Funding Goal Reached
                      </span>
                    </div>
                    <div className="card-itm-baar">
                      <div className="card-baar-line" style={{width:percentCompleted + '%'}}></div>
                      <div className="curnt-mrk-prc" style={{left:percentCompleted + '%'}}>
                        <h4>
                          <span className="sm-text">{percentCompleted}%</span>
                        </h4>
                      </div>
                    </div>
                    <div className="card-3">
                      <div className="sub-card">
                        <h6>Allocation</h6>
                        <span>${data.maxUserAllocation}</span>
                      </div>
                      <div className="sub-card">
                        <h6>Price per token</h6>
                        <span>${data.inputTokenRate}</span>
                      </div>
                    </div>
                    <div className="sub-card">
                        <h6>Total Invested</h6>
                        <span>{displayTotalInvested}</span>
                      </div>
                    <div className="valid-s">
                      <p className="ath">
                        ATH ROI: <span className="ath-val">TBA</span>
                      </p>
                    </div>
                    <div className="btn-1">
                      {typeOfPresale === "Upcoming Presales" ? (
                        <div className="card-content">
                          <p className="status">{`will closed on ${detail}`}</p>
                        </div>
                      ) : typeOfPresale === "Active Presales" ? (
                        <div>
                          <input
                            type="number"
                            value={investValue}
                            onChange={(e) => setInvestValue(e.target.value)}
                          />
                          <br />
                          <br />
                          <button
                            type="submit"
                            className="btn-primary"
                            onClick={handleInvest}
                          >
                            Invest
                          </button>
                        </div>
                      ) : typeOfPresale === "Completed Presales" ? (
                        <div>
                          <h6>
                            {" "}
                            Since the Softcap has not met, you have can retrieve
                            your investment by simply clicking on the button
                            below.
                          </h6>
                          <button
                            type="submit"
                            className="btn-light"
                            onClick={()=>handleClaim()}
                          
                          >
                            Retrieve Investment
                          </button>
                        </div>
                      ) : (
                        <div>
                          <button
                            type="submit"
                            className="btn-light"
                            onClick={()=>handleClaim()}
                            
                          >
                            Claim
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="card-content2">
                      <a href="/" className="token">
                        Token sale
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

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
      ) : (
        <section className="tabs-section">
          {(list || []).map((res: any, i: number) => {
            return (
              <div className="container">
                <div className="tabs-header">
                  <ul className="tabs">
                    <li
                      className={
                        active === 0 ? "tabs-items  active" : "tabs-items"
                      }
                      onClick={() => setActive(0)}
                    >
                      {res.item_1}
                    </li>
                    <li
                      className={
                        active === 1 ? "tabs-items  active" : "tabs-items"
                      }
                      onClick={() => setActive(1)}
                    >
                      {res.item_2}
                    </li>
                    <li
                      className={
                        active === 2 ? "tabs-items  active" : "tabs-items"
                      }
                      onClick={() => setActive(2)}
                    >
                      {res.item_3}
                    </li>
                    <li
                      className={
                        active === 3 ? "tabs-items  active" : "tabs-items"
                      }
                      onClick={() => setActive(3)}
                    >
                      {res.item_4}
                    </li>
                  </ul>
                </div>
                <div className="tabs-content">
                  <div
                    className={
                      active === 0 ? "tab-item tab-item-active" : "tab-item"
                    }
                  >
                    <div className="highlight-sec">
                      <h2 className="highlights">
                        <span>{res.item_1_title}</span>
                      </h2>
                    </div>
                    <div>
                      <ul
                        dangerouslySetInnerHTML={{
                          __html: res.item_1_description,
                        }}
                      ></ul>
                    </div>
                  </div>
                  <div
                    className={
                      active === 1 ? "tab-item tab-item-active" : "tab-item"
                    }
                  >
                    <div className="highlight-sec">
                      <h2 className="highlights">
                        <span>{res.item_2_title}</span>
                      </h2>
                    </div>
                    <div>
                      <ul
                        dangerouslySetInnerHTML={{
                          __html: res.item_2_description,
                        }}
                      ></ul>
                    </div>
                  </div>
                  <div
                    className={
                      active === 2 ? "tab-item tab-item-active" : "tab-item"
                    }
                  >
                    <div className="highlight-sec">
                      <h2 className="highlights">
                        <span>{res.item_3_title}</span>
                      </h2>
                    </div>
                    <div>
                      <ul
                        dangerouslySetInnerHTML={{
                          __html: res.item_3_description,
                        }}
                      ></ul>
                    </div>
                  </div>
                  <div
                    className={
                      active === 3 ? "tab-item tab-item-active" : "tab-item"
                    }
                  >
                    <div className="highlight-sec">
                      <h2 className="highlights">
                        <span>{res.item_4_title}</span>
                      </h2>
                    </div>
                    <div>
                      <ul
                        dangerouslySetInnerHTML={{
                          __html: res.item_4_description,
                        }}
                      ></ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}
