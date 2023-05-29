import React, { useEffect, useState } from "react";
import Uik from "@reef-defi/ui-kit";
import "./idoCard.css";
import { Link } from "react-router-dom";
import { idoType } from "../../assets/ido";
import { appState, hooks, ReefSigner } from "@reef-defi/react-lib";
import { Contract } from "ethers";
import { Crowdsale } from "../../abis/Crowdsale";
import Countdown from "react-countdown";
import BigNumber from "bignumber.js";

const PresaleStartsOnCard = ({
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
    return `Starts in ${days} Days : ${hours} Hrs : ${minutes} Mins`;
  }
};

const PresaleEndsOnCard = ({
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
    return `Ends in ${days} Days : ${hours} Hrs : ${minutes} Mins`;
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

  useEffect(() => {
    if (selectedSigner) {
      getAllContractDetails(ido.crowdsaleAddress, selectedSigner).catch((e) =>
        console.log("Error in getAllContractDetails: ", e)
      );
    }
  }, [selectedSigner, ido.crowdsaleAddress]);
  return (
    <>
      <Uik.Card className="ido-card">
        <Link to={`crowdsale/${ido.id}`} style={{ textDecoration: "none" }}>
          <div className="ido-card-avatar-box">
            <Uik.Avatar image={ido.tokenImageUrl} size="large" />
            {typeOfPresale === "Upcoming Presales" && (
              <Uik.Tag color="red">
                {/* @ts-ignore */}
                <Countdown
                  date={parseFloat(ido.crowdsaleStartTime) * 1000}
                  renderer={PresaleStartsOnCard}
                />
              </Uik.Tag>
            )}
            {typeOfPresale === "Active Presales" && (
              <Uik.Tag color="red">
                {/* @ts-ignore */}
                <Countdown
                  date={parseFloat(ido.crowdsaleEndTime) * 1000}
                  renderer={PresaleEndsOnCard}
                />
              </Uik.Tag>
            )}

            {typeOfPresale === "Completed Presales" && (
              <Uik.Tag color="red">Presale is completed </Uik.Tag>
            )}
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
            <Uik.Text type="light">Amount will Raised :</Uik.Text>
            <Uik.Text type="lead" className="ido-card-name_symbol">
              ${" "}
              {parseFloat(ido.crowdsaleTokenAllocated) *
                parseFloat(ido.inputTokenRate)}
            </Uik.Text>
          </div>
          <div className="ido-card-name-box">
            <Uik.Text type="light">Maximum User Allocation :</Uik.Text>
            <Uik.Text type="lead" className="ido-card-name_symbol">
              ${" "}
              {parseFloat(ido.maxUserAllocation) *
                parseFloat(ido.inputTokenRate)}
            </Uik.Text>
          </div>
        </Link>
      </Uik.Card>
    </>
  );
};
