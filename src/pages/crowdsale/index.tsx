import React, { useEffect, useState } from 'react'
import Uik from "@reef-defi/ui-kit";
import { useParams } from 'react-router-dom';
import BigNumber from "bignumber.js";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import { appState, hooks, ReefSigner } from "@reef-defi/react-lib";
import { Contract } from "ethers";
import Countdown from "react-countdown";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
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
  height: 18,
  borderRadius: 9,
  marginTop: "20px",
  marginBottom: "20px",
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 9,
    backgroundColor: "#898E9C",
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
  const [ido, setIdoData] = useState<idoType | null>(null);
  const [showMoreVesting, setShowMoreVesting] = useState(true);
  const [showMorePoolInfo, setShowMorePoolInfo] = useState(true);
  const [selectedInputToken, setSelectedInputToken] = useState<inputTokenType | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [investValue, setInvestValue] = useState("0");
  const [isInvesting, setIsInvesting] = useState(false);
  const [isSelectorOpen, setSelectorOpen] = useState(false);
  const [typeOfPresale, setTypeofPresale] = useState<"Active Presales" | "Upcoming Presales" | "Completed Presales">("Active Presales");
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

          await crowdsaleContract.drawDown();

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

          await erc20Contract.approve(crowdsaleContractAddress, investValueInWei);

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
      const resp = await fetch(`https://reef-ido.cryption.network/crowdsale/${params.address}`, {
        headers: {
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        },
      });
      const res = await resp.json();
      setIdoData(() => res.data);
      const currentTime = Math.floor(+new Date() / 1000);
      const idoStartTime = parseFloat(res.data.crowdsaleStartTime);
      const idoEndTime = parseFloat(res.data.crowdsaleEndTime);

      if (idoStartTime < currentTime && idoEndTime > currentTime) {
        setTypeofPresale('Active Presales')
      } else if (idoStartTime > currentTime && idoEndTime > currentTime) {
        setTypeofPresale('Upcoming Presales')
      } else {
        setTypeofPresale('Completed Presales')
      }
    }
    if (params && params.address) {
      getIdoDetails()
    }
  }, [params.address])
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
    if (selectedSigner) {
      getAllContractDetails
    }
  }, [selectedSigner])

  let percentCompleted = 0;
  let tokensThatHaveBeenSold = 0;
  let idoVestingStart;
  let idoVestingEnd;
  let cliffTime;
  let vestingInfoDiff;
  let idoStartDate;
  let idoEndDate;
  let poolInfoDiff;
  let amount = '0';
  let totalDrawn = '0';
  let remainingBalance = '0';
  let availableForDrawDown = '0';
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
      (tokensThatHaveBeenSold / parseFloat(ido.crowdsaleTokenAllocated)) * 100);
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
    availableForDrawDown = new BigNumber(
      contractDetails.availableForDrawDown
    )
      .dividedBy(new BigNumber(10).pow(ido.tokenDecimals))
      .toString();
  }
  return (
    <div>
      {ido &&
        <Uik.Card>
          <div className="ido-card-avatar-box">
            <Uik.Avatar image={ido.tokenImageUrl} size="extra-large" />
          </div>
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
                  <img src={websiteIcon} alt="project website" width="30px" />
                </a>
              </div>
            </div>
            <div className="card-verified-box">
              <Link to="/" target="_blank" style={{ whiteSpace: "nowrap" }}>
                <Uik.Text text="Apply for a Verified Tag" type="mini" />
              </Link>
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
                top: "1px",
              }}
            >
              <Uik.Text
                text={`${tokensThatHaveBeenSold}/${ido.crowdsaleTokenAllocated}`}
                type="mini"
              />
            </div>
          </div>
          <div
            style={{
              margin: "10px 0px",
              background: "linear-gradient(#6c179f, #8e1e71)",
              padding: "10px 20px",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
            }}
          >
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

              {typeOfPresale === "Completed Presales" && "Presale is completed"}
            </Uik.Text>
          </div>
          <div>
            <div style={{ width: "100%", marginBottom: "20px" }}>
              <Uik.Container flow="spaceBetween">
                <Uik.Text text="Vesting Info" type="light" />
                <IconButton onClick={() => setShowMoreVesting(!showMoreVesting)}>
                  {showMoreVesting ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Uik.Container>
              <div className="divider-line" />
            </div>
            {showMoreVesting && (
              <div>
                <Uik.Container flow="start">
                  <Uik.Text text={idoVestingStart} />
                  <Uik.Divider
                    text={`${vestingInfoDiff} Days`}
                    className="divider-text"
                  />
                  <Uik.Text text={idoVestingEnd} className="divider-text" />
                </Uik.Container>
                <div
                  style={{
                    margin: "20px 0px",
                    background:
                      "linear-gradient(rgb(108, 23, 159), rgb(142, 30, 113))",
                    padding: "5px 20px",
                    borderRadius: "20px",
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                >
                  {parseFloat(ido.cliffDuration) === 0 ? (
                    <Uik.Text text={`Cliff Duration: 0 Days`} className="white" />
                  ) : (
                    <Uik.Text
                      text={`Cliff Time: ${cliffTime}`}
                      className="white"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
          <div>
            <div style={{ width: "100%", marginBottom: "20px" }}>
              <Uik.Container flow="spaceBetween">
                <Uik.Text text="Pool Info" type="light" />
                <IconButton
                  onClick={() => setShowMorePoolInfo(!showMorePoolInfo)}
                >
                  {showMorePoolInfo ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Uik.Container>
              <div className="divider-line" />
            </div>
            {showMorePoolInfo && (
              <div>
                <Uik.Container flow="start">
                  <Uik.Text text={idoStartDate} />
                  <Uik.Divider
                    text={`${poolInfoDiff} Days`}
                    className="divider-text"
                  />
                  <Uik.Text text={idoEndDate} className="divider-text" />
                </Uik.Container>
                <div
                  style={{
                    margin: "20px 0px",
                    background:
                      "linear-gradient(rgb(108, 23, 159), rgb(142, 30, 113))",
                    padding: "5px 20px",
                    borderRadius: "20px",
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                >
                  <Uik.Text
                    text={`Soft Cap: ${ido.minimumTokenSaleAmount} ${ido.tokenSymbol}`}
                    className="white"
                  />
                </div>

                <div
                  style={{
                    margin: "20px 0px",
                    background:
                      "linear-gradient(rgb(108, 23, 159), rgb(142, 30, 113))",
                    padding: "5px 20px",
                    borderRadius: "20px",
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                >
                  <Uik.Text
                    text={`User limit: ${ido.maxUserAllocation} ${ido.tokenSymbol}`}
                    className="white"
                  />
                </div>
              </div>
            )}
          </div>
          {typeOfPresale === "Active Presales" && (
              <div style={{ marginBottom: "20px" }}>
                <Uik.Container>
                  <Uik.Input
                    type="number"
                    value={investValue}
                    onInput={(e) => setInvestValue(e.target.value)}
                  />
                  {selectedInputToken && <Uik.Button
                    size="large"
                    text={selectedInputToken.inputTokenSymbol}
                    onClick={() => setSelectorOpen(!isSelectorOpen)}
                  />}
                  <Uik.Dropdown
                    isOpen={isSelectorOpen}
                    onClose={() => setSelectorOpen(false)}
                    position="topLeft"
                  >
                    {ido.inputTokens.map((inputToken) => (
                      <Uik.DropdownItem
                        key={inputToken.inputTokenSymbol}
                        text={inputToken.inputTokenSymbol}
                        onClick={() => setSelectedInputToken(() => inputToken)}
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
                      {amount} {ido.tokenSymbol}
                    </Uik.Text>
                  </div>
                </div>
                <div className="three-box-container">
                  <div className="box box2">
                    <Uik.Text type="lead">Locked</Uik.Text>
                    <Uik.Text>
                      {remainingBalance} {ido.tokenSymbol}
                    </Uik.Text>
                  </div>
                  <div className="box box3">
                    <Uik.Text type="lead">Claimable</Uik.Text>
                    <Uik.Text>
                      {availableForDrawDown} {ido.tokenSymbol}
                    </Uik.Text>
                  </div>
                  <div className="box box4">
                    <Uik.Text type="lead">Claimed</Uik.Text>
                    <Uik.Text>
                      {totalDrawn} {ido.tokenSymbol}
                    </Uik.Text>
                  </div>
                </div>
                {typeOfPresale === "Completed Presales" &&
                  new BigNumber(ido.minimumTokenSaleAmount).isGreaterThan(
                    tokensThatHaveBeenSold
                  ) ? (
                  <div className="softcap-not-met-box">
                    <div className="softcap-not-met-text">
                      <Uik.Text>
                        Since the Softcap has not met, you have can retrieve your
                        investment by simply clicking on the button below.
                      </Uik.Text>
                    </div>
                    <div>
                      <Uik.Button
                        text="Retrieve Investment"
                        onClick={handleClaim}
                        loading={isClaiming}
                        className="invest-submit-btn"
                        fill={!new BigNumber(availableForDrawDown).isEqualTo(0)}
                        size="large"
                        disabled={new BigNumber(availableForDrawDown).isEqualTo(0)}
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
                      disabled={new BigNumber(availableForDrawDown).isEqualTo(0)}
                    />
                  </Uik.Container>
                )}
              </div>
            )}
          {selectedInputToken && <Uik.Container className="display-user-rate">
            <Uik.Text>
              You will receive {ido.inputTokenRate} {ido.tokenSymbol} for 1{" "}
              {selectedInputToken.inputTokenSymbol}
            </Uik.Text>
          </Uik.Container>}
        </Uik.Card>
      }
    </div>
  )
}
