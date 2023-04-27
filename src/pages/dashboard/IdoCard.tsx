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
    await crowdsaleContract.vestingScheduleForBeneficiary();

  const amount = vestingScheduleForBeneficiary[0]; // total invested
  const totalDrawn = vestingScheduleForBeneficiary[1]; // claimed
  // const lastDrawnAt = vestingScheduleForBeneficiary[2]; // not needed
  const remainingBalance = vestingScheduleForBeneficiary[3]; // yet to claim
  const availableForDrawDown = vestingScheduleForBeneficiary[4]; // claimable

  return {
    tokensRemainingForSale: tokensRemainingForSale
      ? tokensRemainingForSale.toString()
      : "0",
    amount: amount ? amount.toString() : "0",
    totalDrawn: totalDrawn ? totalDrawn.toString() : "0",
    remainingBalance: remainingBalance ? remainingBalance.toString() : "0",
    availableForDrawDown: availableForDrawDown
      ? availableForDrawDown.toString()
      : "0",
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

  const selectedSigner: ReefSigner | undefined | null =
    hooks.useObservableState(appState.selectedSigner$);

  let canFetchContractDetails = false;
  if (selectedSigner) {
    canFetchContractDetails = true;
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getContractDetails", ido.projectTokenAddress, selectedSigner],
    queryFn: () =>
      getAllContractDetails(ido.projectTokenAddress, selectedSigner!),
    enabled: canFetchContractDetails,
  });

  console.log("data: ", data);

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
          <Uik.Avatar image={ido.image} size="extra-large" />
        </div>
        <Uik.Container flow="spaceBetween">
          <Uik.Container flow="start">
            <Uik.Container flow="start">
              <Uik.Text text={`[ ${ido.symbol} ]`} className="no-wrap" />
              <Uik.Text text={ido.name} className="no-wrap" />
            </Uik.Container>
            <Uik.Container flow="start">
              <img src={twitterICon} alt="twitter" width="30px" />
              <img src={telegramICon} alt="twitter" width="30px" />
              <img src={websiteICon} alt="twitter" width="30px" />
            </Uik.Container>
          </Uik.Container>
          <Link
            to="https://www.google.com"
            target="_blank"
            style={{ whiteSpace: "nowrap" }}
          >
            <Uik.Text text="Apply For a Verified Tag" type="mini" />
          </Link>
        </Uik.Container>
        <div style={{ position: "relative" }}>
          <BorderLinearProgress variant="determinate" value={50} />
          <div
            style={{
              position: "absolute",
              right: "7px",
              top: "1px",
            }}
          >
            <Uik.Text text="0/2000" type="mini" />
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
          <Uik.Text
            text="Presale Starts In: 0 Days 16 Hours 35 Mins"
            className="white"
          />
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
                <Uik.Text text={new Date().toLocaleDateString()} />
                <Uik.Divider text="7 Days" className="divider-text" />
                <Uik.Text
                  text={new Date().toLocaleDateString()}
                  className="divider-text"
                />
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
                <Uik.Text text="Cliff Duration: 1068 Days" className="white" />
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
                <Uik.Text text={new Date().toLocaleDateString()} />
                <Uik.Divider text="7 Days" className="divider-text" />
                <Uik.Text
                  text={new Date().toLocaleDateString()}
                  className="divider-text"
                />
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
                  text={`Soft Cap: 1000 ${ido.softcap} ${ido.symbol}`}
                  className="white"
                />
              </div>
            </div>
          )}
        </div>
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
      </Uik.Modal>
      <Uik.Card className="ido-card">
        <div onClick={() => setOpen(!isOpen)}>
          <div className="ido-card-avatar-box">
            <Uik.Avatar image={ido.image} size="large" />
          </div>
          <div className="ido-card-name-box">
            <Uik.Text type="title">{ido.name}</Uik.Text>
            <Uik.Text type="light" className="ido-card-name_symbol">
              {ido.symbol}
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
              {ido.symbol}
            </Uik.Text>
          </div>
        </div>
      </Uik.Card>
    </>
  );
};
