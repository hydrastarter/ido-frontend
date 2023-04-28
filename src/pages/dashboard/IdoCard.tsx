import React, { useEffect, useState } from "react";
import Uik from "@reef-defi/ui-kit";
import "./idoCard.css";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { idoType } from "../../assets/ido";
// @ts-ignore
import twitterIcon from "../../assets/images/twitter.png";
// @ts-ignore
import telegramIcon from "../../assets/images/telegram.png";
// @ts-ignore
import websiteIcon from "../../assets/images/chain.png";
import { appState, hooks, ReefSigner } from "@reef-defi/react-lib";
import { Contract } from "ethers";
import { Crowdsale } from "../../abis/Crowdsale";
import { ERC20 } from "../../abis/ERC20";
import Countdown from "react-countdown";
import BigNumber from "bignumber.js";

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

export const IdoCard = ({
  ido,
  typeOfPresale,
}: {
  ido: idoType;
  typeOfPresale:
    | "Active Presales"
    | "Upcoming Presales"
    | "Completed Presales"
    | "My Crowdsale";
}): JSX.Element => {
  const [isOpen, setOpen] = useState(false);
  const [showMoreVesting, setShowMoreVesting] = useState(true);
  const [showMorePoolInfo, setShowMorePoolInfo] = useState(true);

  const [investValue, setInvestValue] = useState("0");
  const [isInvesting, setIsInvesting] = useState(false);
  const [isSelectorOpen, setSelectorOpen] = useState(false);
  const [selectedInputToken, setSelectedInputToken] = useState(
    ido.inputTokens[0]
  );

  const [isClaiming, setIsClaiming] = useState(false);

  const selectedSigner: ReefSigner | undefined | null =
    hooks.useObservableState(appState.selectedSigner$);

  const [contractDetails, setContractDetails] = useState({
    tokensRemainingForSale: "0",
    amount: "0",
    totalDrawn: "0",
    remainingBalance: "0",
    availableForDrawDown: "0",
  });

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

  let idoStartDate = new Date(
    parseFloat(ido.crowdsaleStartTime) * 1000
  ).toLocaleDateString();
  let idoEndDate = new Date(
    parseFloat(ido.crowdsaleEndTime) * 1000
  ).toLocaleDateString();

  const poolInfoDiff = dateDiff(parseDate(idoStartDate), parseDate(idoEndDate));

  let idoVestingStart = new Date(
    parseFloat(ido.vestingStart) * 1000
  ).toLocaleDateString();
  let idoVestingEnd = new Date(
    parseFloat(ido.vestingEnd) * 1000
  ).toLocaleDateString();
  let idoCliff = new Date(
    parseFloat(ido.cliffDuration) * 1000
  ).toLocaleDateString();

  const vestingInfoDiff = dateDiff(
    parseDate(idoVestingStart),
    parseDate(idoVestingEnd)
  );

  const cliffDuration = dateDiff(parseDate(idoCliff), parseDate(idoVestingEnd));

  const tokensRemainingForSale = new BigNumber(
    contractDetails.tokensRemainingForSale
  )
    .dividedBy(new BigNumber(10).pow(ido.tokenDecimals))
    .toString();
  const amount = new BigNumber(contractDetails.amount)
    .dividedBy(new BigNumber(10).pow(ido.tokenDecimals))
    .toString();
  const totalDrawn = new BigNumber(contractDetails.totalDrawn)
    .dividedBy(new BigNumber(10).pow(ido.tokenDecimals))
    .toString();
  const remainingBalance = new BigNumber(contractDetails.remainingBalance)
    .dividedBy(new BigNumber(10).pow(ido.tokenDecimals))
    .toString();
  const availableForDrawDown = new BigNumber(
    contractDetails.availableForDrawDown
  )
    .dividedBy(new BigNumber(10).pow(ido.tokenDecimals))
    .toString();

  const tokensThatHaveBeenSold =
    parseFloat(ido.crowdsaleTokenAllocated) -
    parseFloat(tokensRemainingForSale);
  const percentCompleted = Math.floor(
    (tokensThatHaveBeenSold / parseFloat(ido.crowdsaleTokenAllocated)) * 100
  );

  const handleClaim = async () => {
    Uik.notify.info("Processing your claim request");
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
  };

  const handleInvest = async () => {
    Uik.notify.info("Processing your deposit request");
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
  };

  useEffect(() => {
    if (selectedSigner) {
      getAllContractDetails(ido.crowdsaleAddress, selectedSigner).catch((e) =>
        console.log("Error in getAllContractDetails: ", e)
      );
    }
  }, [selectedSigner, ido.crowdsaleAddress]);

  return (
    <>
      <Uik.Modal
        // title="Title"
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        footer={<></>}
      >
        <div className="ido-card-avatar-box">
          <Uik.Avatar image={ido.tokenImageUrl} size="extra-large" />
        </div>
        <Uik.Container flow="spaceBetween">
          <Uik.Container flow="start">
            <Uik.Container flow="start">
              <Uik.Text text={ido.tokenName} className="no-wrap" />
              <Uik.Text text={`(${ido.tokenSymbol})`} className="no-wrap" />
            </Uik.Container>
            <Uik.Container flow="start">
              <a href={`//${ido.twitterUrl}`} target="_blank">
                <img src={twitterIcon} alt="twitter" width="30px" />
              </a>
              <a href={`//${ido.telegramUrl}`} target="_blank">
                <img src={telegramIcon} alt="telegram" width="30px" />
              </a>
              <a href={`//${ido.websiteUrl}`} target="_blank">
                <img src={websiteIcon} alt="project website" width="30px" />
              </a>
            </Uik.Container>
          </Uik.Container>
          <Link to="/" target="_blank" style={{ whiteSpace: "nowrap" }}>
            <Uik.Text text="Apply For a Verified Tag" type="mini" />
          </Link>
        </Uik.Container>
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
                  background: "#898E9C",
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
                    text={`Cliff Duration: ${cliffDuration} Days`}
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
                  background: "#898E9C",
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
                  background: "#898E9C",
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
        {(typeOfPresale === "Active Presales" ||
          typeOfPresale === "My Crowdsale") && (
          <div style={{ marginBottom: "20px" }}>
            <Uik.Container>
              <Uik.Input
                type="number"
                value={investValue}
                onInput={(e) => setInvestValue(e.target.value)}
              />
              <Uik.Button
                size="large"
                text={selectedInputToken.inputTokenSymbol}
                onClick={() => setSelectorOpen(!isSelectorOpen)}
              />
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
        {(typeOfPresale === "Completed Presales" ||
          typeOfPresale === "My Crowdsale") && (
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
          </div>
        )}
        <Uik.Container className="display-user-rate">
          <Uik.Text>
            You will receive {ido.inputTokenRate} {ido.tokenSymbol} for 1{" "}
            {selectedInputToken.inputTokenSymbol}
          </Uik.Text>
        </Uik.Container>
      </Uik.Modal>
      <Uik.Card className="ido-card">
        <div onClick={() => setOpen(!isOpen)}>
          <div className="ido-card-avatar-box">
            <Uik.Avatar image={ido.tokenImageUrl} size="large" />
          </div>
          <div className="ido-card-name-box">
            <Uik.Text type="title">{ido.tokenName}</Uik.Text>
            <Uik.Text type="light" className="ido-card-name_symbol">
              {ido.tokenSymbol}
            </Uik.Text>
          </div>
          <div className="ido-card-slider-box">
            <Uik.Slider
              value={percentCompleted}
              tooltip={`${percentCompleted}%`}
              helpers={[
                { position: 0, text: "0%" },
                { position: 25 },
                { position: 50, text: "50" },
                { position: 75 },
                { position: 100, text: "100%" },
              ]}
            />
          </div>
          <div className="ido-card-name-box">
            <Uik.Text type="light">Hardcap: </Uik.Text>
            <Uik.Text type="lead" className="ido-card-name_symbol">
              {ido.crowdsaleTokenAllocated}
              {ido.tokenSymbol}
            </Uik.Text>
          </div>
        </div>
      </Uik.Card>
    </>
  );
};
