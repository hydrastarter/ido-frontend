import React, { useEffect, useState } from "react";
import Uik from "@reef-chain/ui-kit";
import { Link, useParams } from "react-router-dom";
import BigNumber from "bignumber.js";
import { appState, hooks, Network, ReefSigner } from "@reef-defi/react-lib";
import { Contract } from "ethers";
import Countdown from "react-countdown";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoIcon from "@mui/icons-material/Info";
import { styled } from "@mui/material/styles";
import LinearProgress, { linearProgressClasses } from "@mui/material/LinearProgress";
// @ts-ignore
import twitterIcon from "../../assets/images/twitter.png";
// @ts-ignore
import telegramIcon from "../../assets/images/telegram.png";
// @ts-ignore
import websiteIcon from "../../assets/images/chain.png";
import { Crowdsale } from "../../abis/Crowdsale";
import { idoType, inputTokenType } from "../../assets/ido";
import { ERC20 } from "../../abis/ERC20";
import "../dashboard/index.css";
import "../dashboard/idoCard.css";
import { DASHBOARD_URL } from "../../urls";
import { getNetworkCrowdsaleUrl } from "../../environment";

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
const PresaleStartsInCountdown = ({
  // @ts-ignore
  days,
  // @ts-ignore
  hours,
  // @ts-ignore
  minutes,
  // @ts-ignore
  seconds,
  // @ts-ignore
  completed,
}) => {
  if (completed) {
    // Render a completed state
    return "Presale is active";
  } else {
    // Render a countdown
    return (
      <span>
        Presale starts in {days} Days : {hours} Hrs : {minutes} Mins : {seconds}{" "}
        Secs
      </span>
    );
  }
};

const PresaleEndsInCountdown = ({
  // @ts-ignore
  days,
  // @ts-ignore
  hours,
  // @ts-ignore
  minutes,
  // @ts-ignore
  seconds,
  // @ts-ignore
  completed,
}) => {
  if (completed) {
    // Render a completed state
    return "Presale has ended";
  } else {
    // Render a countdown
    return (
      <span>
        Presale ends in {days} Days : {hours} Hrs : {minutes} Mins : {seconds}{" "}
        Secs
      </span>
    );
  }
};
export default function CrowdsaleDetails() {
  const params: { address: string } = useParams();
  const selectedSigner: ReefSigner | undefined | null =
    hooks.useObservableState(appState.selectedSigner$);
  const selectedNetwork: Network | undefined | null =
    hooks.useObservableState(appState.currentNetwork$);

  const [isOpen, setOpen] = useState(false);
  const [txHash, setTxHash] = useState(null);

  const [ido, setIdoData] = useState<idoType | null>(null);
  const [selectedInputToken, setSelectedInputToken] =
    useState<inputTokenType | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [investValue, setInvestValue] = useState("0");
  const [isInvesting, setIsInvesting] = useState(false);
  const [isSelectorOpen, setSelectorOpen] = useState(false);
  const [typeOfPresale, setTypeofPresale] = useState<
    "Active Presales" | "Upcoming Presales" | "Completed Presales"
  >("Active Presales");
  const [contractDetails, setContractDetails] = useState({
    tokensRemainingForSale: "0",
    amount: "0",
    totalDrawn: "0",
    remainingBalance: "0",
    availableForDrawDown: "0",
  });
  const handleClaim = async () => {
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

  const handleInvest = async () => {
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
  useEffect(() => {
    const getIdoDetails = async () => {
      const username = "adminUser";
      const password = "password";
      const resp = await fetch(
        `${getNetworkCrowdsaleUrl(selectedNetwork.name)}/${params.address}`,
        {
          headers: {
            Authorization: `Basic ${btoa(`${username}:${password}`)}`,
          },
        }
      );
      const res = await resp.json();
      const ido = res.data as idoType;
      setIdoData(() => ido);
      setSelectedInputToken(() => ido.inputTokens[0]);
      const currentTime = Math.floor(+new Date() / 1000);
      const idoStartTime = parseFloat(res.data.crowdsaleStartTime);
      const idoEndTime = parseFloat(res.data.crowdsaleEndTime);

      if (idoStartTime < currentTime && idoEndTime > currentTime) {
        setTypeofPresale("Active Presales");
      } else if (idoStartTime > currentTime && idoEndTime > currentTime) {
        setTypeofPresale("Upcoming Presales");
      } else {
        setTypeofPresale("Completed Presales");
      }
    };
    if (params && params.address) {
      getIdoDetails();
    }
  }, [params.address, selectedNetwork]);
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
  let tokensThatHaveBeenSold = 0;
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

    return (
      <div className="crowdsale-page-container">
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
            You have successfully claimed {displayClaimed} {ido.tokenSymbol}
          </Uik.Text>
        </Uik.Modal>
        <div className="back-button-container">
          <Link to={DASHBOARD_URL} className="link-box">
            <ArrowBackIcon color="inherit" />
            <Uik.Text className="back-button-text">Back to Dashboard</Uik.Text>
          </Link>
        </div>
        <div className="crowdsale-container">
          <div className="interaction-box">
            <div className="gradient-timer">
              <Uik.Text className="white">
                {typeOfPresale === "Upcoming Presales" && (
                  // @ts-ignore
                  <Countdown
                    date={parseFloat(ido.crowdsaleStartTime) * 1000}
                    renderer={PresaleStartsInCountdown}
                  />
                )}

                {typeOfPresale === "Active Presales" && (
                  // @ts-ignore
                  <Countdown
                    date={parseFloat(ido.crowdsaleEndTime) * 1000}
                    renderer={PresaleEndsInCountdown}
                  />
                )}

                {typeOfPresale === "Completed Presales" &&
                  "Presale is completed"}
              </Uik.Text>
            </div>
            <Uik.Card className="crowdsale-card">
              <div style={{ width: "100%", marginBottom: "20px" }}>
                <Uik.Container flow="spaceBetween">
                  <Uik.Text text="Vesting Info" />
                </Uik.Container>
                <div className="divider-line" />
              </div>
              <div>
                <Uik.Container flow="start">
                  <Uik.Text text={idoVestingStart} />
                  <Uik.Divider
                    text={`${vestingInfoDiff} Days`}
                    className="divider-text"
                  />
                  <Uik.Text text={idoVestingEnd} className="divider-text" />
                </Uik.Container>
                <div className="value-box cliff-duration-box">
                  {parseFloat(ido.cliffDuration) === 0 ? (
                    <Uik.Text text={`Cliff Duration: 0 Days`} type="light" />
                  ) : (
                    <Uik.Text text={`Cliff Time: ${cliffTime}`} type="light" />
                  )}
                  <Uik.Tooltip
                    delay={0}
                    position="right"
                    text={`The time after which the user can start claiming rewards. 
                    The user will receive rewards from the vesting start date at the time the cliff duration ends.`}
                    className="tooltip-custom-styles"
                  >
                    <InfoIcon color="inherit" style={{ marginLeft: "5px" }} />
                  </Uik.Tooltip>
                </div>
              </div>
            </Uik.Card>
            <Uik.Card className="crowdsale-card">
              <div style={{ width: "100%", marginBottom: "20px" }}>
                <Uik.Container flow="spaceBetween">
                  <Uik.Text text="Pool Info" />
                </Uik.Container>
                <div className="divider-line" />
              </div>

              <div>
                <Uik.Container flow="start">
                  <Uik.Text text={idoStartDate} />
                  <Uik.Divider
                    text={`${poolInfoDiff} Days`}
                    className="divider-text"
                  />
                  <Uik.Text text={idoEndDate} className="divider-text" />
                </Uik.Container>
                <div className="value-box cliff-duration-box">
                  <Uik.Text
                    text={`Soft Cap: ${ido.minimumTokenSaleAmount} ${ido.tokenSymbol}`}
                    type="light"
                  />
                  <Uik.Tooltip
                    delay={0}
                    position="right"
                    text={`Minimum number of IDO tokens to be sold for the IDO to continue.
                      If the number is less then the purchasing token is given back after the IDO ends`}
                    className="tooltip-custom-styles"
                  >
                    <InfoIcon color="inherit" style={{ marginLeft: "5px" }} />
                  </Uik.Tooltip>
                </div>
                <div className="value-box cliff-duration-box">
                  <Uik.Text
                    text={`User limit: ${ido.maxUserAllocation} ${ido.tokenSymbol}`}
                    type="light"
                  />
                  <Uik.Tooltip
                    delay={0}
                    position="right"
                    text={`The maximum amount of token a single user can purchase.`}
                    className="tooltip-custom-styles"
                  >
                    <InfoIcon color="inherit" style={{ marginLeft: "5px" }} />
                  </Uik.Tooltip>
                </div>
              </div>
            </Uik.Card>
            <Uik.Card className="crowdsale-card">
              <div style={{ width: "100%", marginBottom: "20px" }}>
                <Uik.Container flow="spaceBetween">
                  <Uik.Text text="Invest" />
                </Uik.Container>
                <div className="divider-line" />
              </div>

              {typeOfPresale === "Active Presales" && (
                <div style={{ marginBottom: "20px" }}>
                  <Uik.Container className="display-user-rate mb-10">
                    <Uik.Text>
                      Total Invested : {displayTotalInvested} {ido.tokenSymbol}
                    </Uik.Text>
                  </Uik.Container>
                  <Uik.Container>
                    <Uik.Input
                      type="number"
                      value={investValue}
                      onInput={(e) => setInvestValue(e.target.value)}
                    />
                    {selectedInputToken && (
                      <Uik.Button
                        size="large"
                        text={selectedInputToken.inputTokenSymbol}
                        onClick={() => setSelectorOpen(!isSelectorOpen)}
                      />
                    )}
                    <Uik.Dropdown
                      isOpen={isSelectorOpen}
                      onClose={() => setSelectorOpen(false)}
                      position="topLeft"
                    >
                      {ido.inputTokens.map((inputToken) => (
                        <Uik.DropdownItem
                          key={inputToken.inputTokenSymbol}
                          text={inputToken.inputTokenSymbol}
                          onClick={() =>
                            setSelectedInputToken(() => inputToken)
                          }
                        />
                      ))}
                    </Uik.Dropdown>
                  </Uik.Container>
                  <Uik.Container>
                    <Uik.Button
                      text="Invest"
                      fill
                      size="large"
                      onClick={handleInvest}
                      loading={isInvesting}
                      className="invest-submit-btn"
                      loader="fish"
                    />
                  </Uik.Container>
                </div>
              )}
              {typeOfPresale === "Completed Presales" && (
                <div className="all-box-container">
                  <div className="one-box-container">
                    <div className="box box1">
                      <Uik.Text type="lead" className="total-invested-text">
                        Total Invested :
                      </Uik.Text>
                      <Uik.Text>
                        {displayTotalInvested} {ido.tokenSymbol}
                      </Uik.Text>
                    </div>
                  </div>
                  <div className="three-box-container">
                    <div className="box box2">
                      <Uik.Text type="lead">Locked</Uik.Text>
                      <Uik.Text>
                        {displayLocked} {ido.tokenSymbol}
                      </Uik.Text>
                    </div>
                    <div className="box box3">
                      <Uik.Text type="lead">Claimable</Uik.Text>
                      <Uik.Text>
                        {displayClaimable} {ido.tokenSymbol}
                      </Uik.Text>
                    </div>
                    <div className="box box4">
                      <Uik.Text type="lead">Claimed</Uik.Text>
                      <Uik.Text>
                        {displayClaimed} {ido.tokenSymbol}
                      </Uik.Text>
                    </div>
                  </div>
                  {typeOfPresale === "Completed Presales" &&
                  new BigNumber(
                    ido.minimumTokenSaleAmount
                  ).isGreaterThanOrEqualTo(tokensThatHaveBeenSold) ? (
                    <div className="softcap-not-met-box">
                      <div className="softcap-not-met-text">
                        <Uik.Text>
                          Since the Softcap has not met, you have can retrieve
                          your investment by simply clicking on the button
                          below.
                        </Uik.Text>
                      </div>
                      <div>
                        <Uik.Button
                          text="Retrieve Investment"
                          onClick={handleClaim}
                          loading={isClaiming}
                          className="invest-submit-btn"
                          fill={
                            !new BigNumber(availableForDrawDown).isEqualTo(0)
                          }
                          size="large"
                          disabled={new BigNumber(
                            availableForDrawDown
                          ).isEqualTo(0)}
                        />
                      </div>
                    </div>
                  ) : (
                    <Uik.Container>
                      <Uik.Button
                        text="Claim"
                        onClick={handleClaim}
                        loading={isClaiming}
                        className="invest-submit-btn"
                        fill={!new BigNumber(availableForDrawDown).isEqualTo(0)}
                        size="large"
                        disabled={new BigNumber(availableForDrawDown).isEqualTo(
                          0
                        )}
                      />
                    </Uik.Container>
                  )}
                </div>
              )}
              {selectedInputToken && (
                <Uik.Container className="display-user-rate">
                  <Uik.Text>
                    You will receive {ido.inputTokenRate} {ido.tokenSymbol} for
                    1 {selectedInputToken.inputTokenSymbol}
                  </Uik.Text>
                </Uik.Container>
              )}
            </Uik.Card>
          </div>
          <div className="information-box">
            <div className="ido-card-avatar-box">
              <div className="avatar-social-links-box">
                <Uik.Avatar image={ido.tokenImageUrl} size="extra-large" />

                <div className="card-header-box">
                  <div className="card-name-links-box">
                    <div className="card-name-box">
                      <Uik.Text
                        text={ido.tokenName}
                        className="no-wrap card-token-name"
                      />
                      <Uik.Text
                        text={`(${ido.tokenSymbol})`}
                        className="no-wrap card-token-symbol"
                      />
                    </div>
                    <div className="card-links-box">
                      <a
                        href={`//${ido.twitterUrl}`}
                        target="_blank"
                        className="card-link twitter-link"
                      >
                        <img src={twitterIcon} alt="twitter" width="30px" />
                      </a>
                      <a
                        href={`//${ido.telegramUrl}`}
                        target="_blank"
                        className="card-link telegram-link"
                      >
                        <img src={telegramIcon} alt="telegram" width="30px" />
                      </a>
                      <a
                        href={`//${ido.websiteUrl}`}
                        target="_blank"
                        className="card-link website-link"
                      >
                        <img
                          src={websiteIcon}
                          alt="project website"
                          width="30px"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-header-box">
                <div className="card-verified-box">
                  <Link to="/" target="_blank" style={{ whiteSpace: "nowrap" }}>
                    <Uik.Text text="Apply for a Verified Tag" type="mini" />
                  </Link>
                </div>
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <BorderLinearProgress
                variant="determinate"
                value={percentCompleted}
              />
              <div
                style={{
                  position: "absolute",
                  right: "7px",
                  top: "3px",
                }}
              >
                <Uik.Text
                  text={`${tokensThatHaveBeenSold}/${ido.crowdsaleTokenAllocated}`}
                  type="mini"
                />
              </div>
            </div>
            <div className="about-description-container">
              <div className="about-box">
                <Uik.Text type="title">About</Uik.Text>
              </div>
              <div className="description-box">
                <Uik.Text type="mini">{ido.description}</Uik.Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <></>;
}
