/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from "react";
import Uik from "@reef-chain/ui-kit";
import { Contract, ethers } from "ethers";
import "./index.css";
// @ts-ignore
import { appState, AvailableNetworks, hooks, Network, ReefSigner } from "@reef-defi/react-lib";
import BigNumber from "bignumber.js";
import { getNetworkConfig } from "../../config";
import { LaunchPadFactory } from "../../abis/LaunchPadFactory";
import { ERC20 } from "../../abis/ERC20";
import { getNetworkCrowdsaleUrl, } from "../../environment";
import Hero from "../../common/Hero";
import { DEFAULT_REMOVE_HOVER_COLOR } from "./fragments/constantStyles";
import { buildButtonsGroup } from './fragments/getBtnsGroup';
import { getTokenDetails } from "./fragments/getTokenDetails";
import { approveProjectToken } from "./fragments/approveProjectToken";
import { isValidURL } from "./fragments/isUrl";
import { buildTokenDetails } from "./fragments/buildTokenDetails";
import { formatUTC } from "./fragments/formatUtc";
import { buildTokenSaleDetails } from "./fragments/buildTokenSales";
import { buildVestingDetails } from "./fragments/buildVestingDetails";
import { buildAcknowledgementPage } from "./fragments/buildAcknowledgementScreen";
import { buildFinalForm } from "./fragments/buildFinalPage";
import { validateIDOInputs } from "./fragments/validateIdoInputs";
import { bulkUpload as bulkUploadHelper } from "./fragments/bulkUpload";
import { createIdo as createIdoHelper } from "./fragments/createIdo";

export const Admin: React.FC = () => {
  const [projectTokenAddress, setProjectTokenAddress] = useState("");
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState("");
  const [projectTokenDetails, setProjectTokenDetails] = useState({
    name: "",
    decimals: "",
    symbol: "",
  });
  const [inputTokenRate, setInputTokenRate] = useState("0");
  const [projectTokenImage, setProjectTokenImage] = useState({
    previewImgUrl: "",
    ipfsImgUrl: "",
    uploadingFile: false,
  });
  const [inputTokens, setInputTokens] = useState([
    {
      key: 0,
      tokenAddress: "",
      tokenName: "",
      tokenSymbol: "",
      tokenDecimals: "",
    },
  ]);
  const [enableWhitelisting, setEnableWhitelisting] = useState(false);
  const [twitterUrl, setTwitterUrl] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [telegramUrl, setTelegramUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [miscellaneousUrl, setMiscellaneousUrl] = useState("");
  const [description, setDescription] = useState("");
  const [approveLoading, setApproveLoading] = useState(false);
  const [successfullyLaunched, setSuccessfullyLaunched] = useState(false);
  const [allowance, setAllowance] = useState(new BigNumber(0));
  const [startTimeInUTC, setStartTimeInUTC] = useState(new Date(Date.now()));
  const [endTimeInUTC, setEndTimeInUTC] = useState(
    new Date(Date.now() + 60 * 60 * 1000)
  );
  const [amountOfTokensToSell, setAmountOfTokensToSell] = useState("100");
  const [softcap, setSoftcap] = useState("90");
  const [maxUserAllocation, setMaxUserAllocation] = useState("10");
  const [whitelistedAddresses, setWhitelistedAddress] = useState("");
  const [zoneHover, setZoneHover] = useState(false);
  const [removeHoverColor, setRemoveHoverColor] = useState(
    DEFAULT_REMOVE_HOVER_COLOR
  );
  const [vestingStartTimeInUTC, setVestingStartTimeInUTC] = useState(
    new Date(Date.now() + 1 * 1 * 60 * 60 * 1000)
  );
  const [vestingEndTimeInUTC, setVestingEndTimeInUTC] = useState(
    new Date(Date.now() + 1 * 1 * 60 * 60 * 1000)
  );
  const [cliffPeriodInUTC, setCliffPeriodInUTC] = useState(
    new Date(Date.now() + 1 * 1 * 60 * 60 * 1000)
  );
  const [enableCliffPeriod, setEnableCliffPeriod] = useState(false);
  const [isCreatingIDO, setIsCreatingIdo] = useState(false);


  const selectedSigner: ReefSigner | undefined | null =
    hooks.useObservableState(appState.selectedSigner$);
  const selectedNetwork: Network | undefined | null =
    hooks.useObservableState(appState.currentNetwork$);

  const handleInputTokenChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newArr = [...inputTokens];
    newArr[index].tokenAddress = event.target.value;
    setInputTokens([...newArr]);
  };

  const handleBlurInputToken = async (index: number) => {
    try {
      if (selectedSigner) {
        const tokenDetails = inputTokens;
        if (tokenDetails[index] && tokenDetails[index].tokenAddress) {
          const erc20Contract = new Contract(
            tokenDetails[index].tokenAddress,
            ERC20,
            selectedSigner.signer
          );
          const name = await erc20Contract.name();
          const symbol = await erc20Contract.symbol();
          const decimal = await erc20Contract.decimals();
          tokenDetails[index].tokenDecimals = decimal;
          tokenDetails[index].tokenName = name;
          tokenDetails[index].tokenSymbol = symbol;
          setInputTokens([...tokenDetails]);
        }
      }
    } catch (e) {
      console.error("error is", e);
    }
  };

  const addToken = async () => {
    const newToken = {
      key: inputTokens.length,
      tokenAddress: "",
      tokenName: "",
      tokenDecimals: "",
      tokenSymbol: "",
    };
    const tokens = [...inputTokens, newToken];
    setInputTokens(tokens);
  };
  
  const removeInputToken = (tokenKey: number) => {
    const updatedTokens = inputTokens.filter(
      (eachToken) => eachToken.key !== tokenKey
    );
    setInputTokens(updatedTokens);
  };


  const checkAllowance = async () => {
    try {
      if (selectedSigner) {
        const erc20Contract = new Contract(
          projectTokenAddress,
          ERC20,
          selectedSigner.signer
        );
        const allowanceAmount = await erc20Contract.allowance(
          selectedSigner.evmAddress,
          getNetworkConfig(selectedNetwork.name).PROXY_CONTRACT_MULTIOWNER
        );
        const tokenDecimals = await erc20Contract.decimals();
        const tokenName = await erc20Contract.name();
        const tokenSymbol = await erc20Contract.symbol();
        setProjectTokenDetails((token) => ({
          ...token,
          name: tokenName,
          decimals: tokenDecimals.toString(),
          symbol: tokenSymbol,
        }));
        setAllowance(new BigNumber(allowanceAmount.toString()));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const bulkUpload = (results:any)=>{
    return bulkUploadHelper(results,setEnableWhitelisting,setWhitelistedAddress)
  }

  const createIdo = (networkName:AvailableNetworks)=>createIdoHelper(networkName, setIsCreatingIdo, selectedSigner, inputTokens, startTimeInUTC, endTimeInUTC, vestingStartTimeInUTC, vestingEndTimeInUTC, cliffPeriodInUTC, whitelistedAddresses, selectedNetwork, projectTokenAddress, LaunchPadFactory, amountOfTokensToSell, maxUserAllocation, softcap, enableCliffPeriod, enableWhitelisting, inputTokenRate, projectTokenImage, setTxHash, setSuccessfullyLaunched, setCurrentPage, projectTokenDetails, currentPage, twitterUrl, miscellaneousUrl, websiteUrl, telegramUrl, description
  )


  let disableCreateButton = true;

  if (
    projectTokenAddress &&
    projectTokenAddress.length > 0 &&
    inputTokens &&
    inputTokens.length > 0 &&
    inputTokens[0].tokenAddress &&
    inputTokens[0].tokenAddress.length > 0 &&
    amountOfTokensToSell.toString().length > 0 &&
    startTimeInUTC < endTimeInUTC &&
    parseFloat(amountOfTokensToSell.toString()) > 0 &&
    parseFloat(amountOfTokensToSell.toString()) > parseFloat(softcap.toString()) &&
    projectTokenImage.ipfsImgUrl &&
    projectTokenImage.ipfsImgUrl.length > 0 &&
    isValidURL(twitterUrl) &&
    isValidURL(telegramUrl) &&
    isValidURL(websiteUrl) &&
    isValidURL(miscellaneousUrl)
  ) {
    disableCreateButton = false;
  } else {

    const errorMessage = validateIDOInputs(projectTokenAddress,inputTokens,amountOfTokensToSell,startTimeInUTC,endTimeInUTC,softcap,projectTokenImage,twitterUrl,telegramUrl,websiteUrl,miscellaneousUrl);


    if (errorMessage != error || errorMessage == "") {
      setError(errorMessage);
    }
  }


  // array of all screens, the elements are the components from /fragments directory
  const formResolver = [
    // token details page
    buildTokenDetails(
      inputTokenRate,setInputTokenRate,inputTokens,handleBlurInputToken,handleInputTokenChange,removeInputToken,addToken,buildButtonsGroup,setCurrentPage, currentPage
    ),

    //token sales
    buildTokenSaleDetails(startTimeInUTC,setStartTimeInUTC,endTimeInUTC,setEndTimeInUTC,amountOfTokensToSell,setAmountOfTokensToSell,softcap,setSoftcap,maxUserAllocation,setMaxUserAllocation,enableWhitelisting,setEnableWhitelisting,whitelistedAddresses,setWhitelistedAddress,bulkUpload,setZoneHover,setRemoveHoverColor,removeHoverColor,setCurrentPage, currentPage,zoneHover),

    // vesting details
    buildVestingDetails(vestingStartTimeInUTC,setVestingStartTimeInUTC,vestingEndTimeInUTC,setVestingEndTimeInUTC,enableCliffPeriod,setEnableCliffPeriod,cliffPeriodInUTC,setCliffPeriodInUTC,setCurrentPage, currentPage),

    // approve and create IDO form
    buildFinalForm(twitterUrl,setTwitterUrl,telegramUrl,setTelegramUrl,websiteUrl,setWebsiteUrl,miscellaneousUrl,setMiscellaneousUrl,description,setDescription,setCurrentPage, currentPage,allowance,amountOfTokensToSell,approveLoading,approveProjectToken, projectTokenAddress, setApproveLoading, selectedSigner, selectedNetwork, setAllowance,disableCreateButton,isCreatingIDO,createIdo,error),

    //acknowledgement screen
    buildAcknowledgementPage(successfullyLaunched,txHash)
  ]

  const tokenDetailsBuilder = () => getTokenDetails(
    projectTokenImage,
    projectTokenDetails,
    projectTokenAddress,
    setProjectTokenAddress,
    checkAllowance,
    setProjectTokenImage,
    setCurrentPage,
    currentPage
  );

  return (
    <div>
      <Hero title='Create an IDO'
        subtitle='One step closer to a smooth launch'
        imgsrc='token-details.jpg'
      />
      <Uik.Card condensed className="admin-container">
        <Uik.Form>
          {tokenDetailsBuilder()}
          {currentPage > 0 && formResolver[currentPage - 1]}
        </Uik.Form>
      </Uik.Card>
    </div>
  );
};
