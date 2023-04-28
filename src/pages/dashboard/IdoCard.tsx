import React, { useState } from "react";
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
import twitterICon from "../../assets/images/twitter.png";
// @ts-ignore
import telegramICon from "../../assets/images/telegram.png";
// @ts-ignore
import websiteICon from "../../assets/images/chain.png";
import { appState, hooks, ReefSigner } from "@reef-defi/react-lib";
import { Contract } from "ethers";
import { Crowdsale } from "../../abis/Crowdsale";
import { useQuery } from "@tanstack/react-query";
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
function datediff(first: any, second: any) {
  return Math.round((second - first) / (1000 * 60 * 60 * 24));
}

/**
 * new Date("dateString") is browser-dependent and discouraged, so we'll write
 * a simple parse function for U.S. date format (which does no error checking)
 */
function parseDate(str: any) {
  var mdy = str.split("/");
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

const getAllContractDetails = async (
  crowdsaleContractAddress: string,
  selectedSigner: ReefSigner,
  selectedAccount: string
) => {
  const crowdsaleContract = new Contract(
    crowdsaleContractAddress,
    Crowdsale,
    selectedSigner.signer
  );

  const tokensRemainingForSale =
    await crowdsaleContract.tokenRemainingForSale();

  const vestingScheduleForBeneficiary =
    await crowdsaleContract.vestingScheduleForBeneficiary(selectedAccount);

  const amount = vestingScheduleForBeneficiary[0]; // total invested
  const totalDrawn = vestingScheduleForBeneficiary[1]; // claimed
  // const lastDrawnAt = vestingScheduleForBeneficiary[2]; // not needed
  const remainingBalance = vestingScheduleForBeneficiary[3]; // yet to claim
  const availableForDrawDown = vestingScheduleForBeneficiary[4]; // claimable

  return {
    tokensRemainingForSale: tokensRemainingForSale.toString(),
    amount: amount.toString(),
    totalDrawn: totalDrawn.toString(),
    remainingBalance: remainingBalance.toString(),
    availableForDrawDown: availableForDrawDown.toString(),
  };
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
  const value = Math.floor(Math.random() * (100 - 1 + 1) + 1);

  const [investValue, setInvestValue] = useState("0");
  const [isInvesting, setIsInvesting] = useState(false);
  const [isSelectorOpen, setSelectorOpen] = useState(false);
  const [selectedInputToken, setSelectedInputToken] = useState(
    ido.inputTokens[0]
  );

  const [isClaiming, setIsClaiming] = useState(false);

  const selectedSigner: ReefSigner | undefined | null =
    hooks.useObservableState(appState.selectedSigner$);
  const accounts: ReefSigner[] | undefined | null = hooks.useObservableState(
    appState.signers$
  );

  let selectedAccount = "";
  let canFetchContractDetails = false;

  if (selectedSigner && accounts) {
    selectedAccount = accounts[0].address;
    canFetchContractDetails = true;
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "getContractDetails",
      ido.crowdsaleAddress,
      selectedSigner,
      selectedAccount,
    ],
    queryFn: () =>
      getAllContractDetails(
        ido.crowdsaleAddress,
        selectedSigner!,
        selectedAccount
      ),
    enabled: canFetchContractDetails,
  });

  let tokensRemainingForSale = "0";
  let amount = "0";
  let totalDrawn = "0";
  let remainingBalance = "0";
  let availableForDrawDown = "0";

  let idoStartDate = new Date(
    parseFloat(ido.idoStart) * 1000
  ).toLocaleDateString();
  let idoEndDate = new Date(parseFloat(ido.idoEnd) * 1000).toLocaleDateString();

  const poolInfoDiff = datediff(parseDate(idoStartDate), parseDate(idoEndDate));

  let idoVestingStart = new Date(
    parseFloat(ido.vestingStart) * 1000
  ).toLocaleDateString();
  let idoVestingEnd = new Date(
    parseFloat(ido.vestingEnd) * 1000
  ).toLocaleDateString();
  let idoCliff = new Date(
    parseFloat(ido.vestingCliff) * 1000
  ).toLocaleDateString();

  const vestingInfoDiff = datediff(
    parseDate(idoVestingStart),
    parseDate(idoVestingEnd)
  );

  const cliffDuration = datediff(parseDate(idoCliff), parseDate(idoVestingEnd));

  if (data) {
    tokensRemainingForSale = data.tokensRemainingForSale;
    amount = data.amount;
    totalDrawn = data.totalDrawn;
    remainingBalance = data.remainingBalance;
    availableForDrawDown = data.availableForDrawDown;
  }

  const tokensThatAreNotRemainingForSale =
    parseFloat(ido.hardcap) - parseFloat(tokensRemainingForSale);

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

    const crowdsaleContractAddress = ido.projectTokenAddress;

    try {
      if (selectedSigner) {
        const crowdsaleContract = new Contract(
          crowdsaleContractAddress,
          Crowdsale,
          selectedSigner.signer
        );
        const investValueInWei = new BigNumber(investValue).multipliedBy(
          new BigNumber(10).pow(selectedInputToken.decimals)
        );

        await crowdsaleContract.purchaseToken(
          selectedInputToken.address,
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

  return (
    <>
      <Uik.Modal
        // title="Title"
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        footer={<></>}
      >
        <div className="ido-card-avatar-box">
          <Uik.Avatar image={ido.projectTokenImage} size="extra-large" />
        </div>
        <Uik.Container flow="spaceBetween">
          <Uik.Container flow="start">
            <Uik.Container flow="start">
              <Uik.Text text={ido.projectTokenName} className="no-wrap" />
              <Uik.Text
                text={`(${ido.projectTokenSymbol})`}
                className="no-wrap"
              />
            </Uik.Container>
            <Uik.Container flow="start">
              <img src={twitterICon} alt="twitter" width="30px" />
              <img src={telegramICon} alt="twitter" width="30px" />
              <img src={websiteICon} alt="twitter" width="30px" />
            </Uik.Container>
          </Uik.Container>
          <Link to="/" target="_blank" style={{ whiteSpace: "nowrap" }}>
            <Uik.Text text="Apply For a Verified Tag" type="mini" />
          </Link>
        </Uik.Container>
        <div style={{ position: "relative" }}>
          <BorderLinearProgress
            variant="determinate"
            value={tokensThatAreNotRemainingForSale}
          />
          <div
            style={{
              position: "absolute",
              right: "7px",
              top: "1px",
            }}
          >
            <Uik.Text
              text={`${tokensThatAreNotRemainingForSale}/${ido.hardcap}`}
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
                date={parseFloat(ido.idoStart) * 1000}
                renderer={PresaleStartsInCountdown}
              />
            )}

            {typeOfPresale === "Active Presales" && (
              // @ts-ignore
              <Countdown
                date={parseFloat(ido.idoEnd) * 1000}
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
                <Uik.Text
                  text={`Cliff Duration: ${cliffDuration} Days`}
                  className="white"
                />
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
                  text={`Soft Cap: ${ido.softcap} ${ido.projectTokenSymbol}`}
                  className="white"
                />
              </div>
            </div>
          )}
        </div>
        {typeOfPresale === "Active Presales" && (
          <div>
            <Uik.Container>
              <Uik.Input
                type="number"
                value={investValue}
                onInput={(e) => setInvestValue(e.target.value)}
              />
              <Uik.Button
                size="large"
                text={selectedInputToken.symbol}
                onClick={() => setSelectorOpen(!isSelectorOpen)}
              />
              <Uik.Dropdown
                isOpen={isSelectorOpen}
                onClose={() => setSelectorOpen(false)}
                position="topLeft"
              >
                {ido.inputTokens.map((inputToken) => (
                  <Uik.DropdownItem
                    key={inputToken.symbol}
                    text={inputToken.symbol}
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
              />
            </Uik.Container>
          </div>
        )}
        {typeOfPresale === "Completed Presales" && (
          <div>
            <Uik.Container>
              <Uik.Text>Total Invested: {amount}</Uik.Text>
            </Uik.Container>
            <Uik.Container>
              <Uik.Text>Locked: {remainingBalance}</Uik.Text>
              <Uik.Text>Claimable: {availableForDrawDown}</Uik.Text>
              <Uik.Text>Claimed: {totalDrawn}</Uik.Text>
            </Uik.Container>
            <Uik.Container>
              <Uik.Button
                text="Claim"
                fill
                size="large"
                onClick={handleClaim}
                loading={isClaiming}
                className="invest-submit-btn"
              />
            </Uik.Container>
          </div>
        )}
      </Uik.Modal>
      <Uik.Card className="ido-card">
        <div onClick={() => setOpen(!isOpen)}>
          <div className="ido-card-avatar-box">
            <Uik.Avatar image={ido.projectTokenImage} size="large" />
          </div>
          <div className="ido-card-name-box">
            <Uik.Text type="title">{ido.projectTokenName}</Uik.Text>
            <Uik.Text type="light" className="ido-card-name_symbol">
              {ido.projectTokenSymbol}
            </Uik.Text>
          </div>
          <div className="ido-card-slider-box">
            <Uik.Slider
              value={value}
              tooltip={`${value}%`}
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
              {ido.hardcap}
              {ido.projectTokenSymbol}
            </Uik.Text>
          </div>
        </div>
      </Uik.Card>
    </>
  );
};
