import { Contract, ethers } from "ethers";
import { getNetworkConfig } from "../../../config";
import { ERC20 } from "../../../abis/ERC20";
import BigNumber from "bignumber.js";
import { AvailableNetworks, getNetworkCrowdsaleUrl } from "../../../environment";
import Uik from "@reef-chain/ui-kit";

export const createIdo = async (
    networkName: AvailableNetworks,
    setIsCreatingIdo:any,
    selectedSigner:any,
    inputTokens:any,
    startTimeInUTC:any,
    endTimeInUTC:any,
    vestingStartTimeInUTC:any,
    vestingEndTimeInUTC:any,
    cliffPeriodInUTC:any,
    whitelistedAddresses:any,
    selectedNetwork:any,
    projectTokenAddress:any,
    LaunchPadFactory:any,
    amountOfTokensToSell:any,
    maxUserAllocation:any,
    softcap:any,
    enableCliffPeriod:any,
    enableWhitelisting:any,
    inputTokenRate:any,
    projectTokenImage:any,
    setTxHash:any,
    setSuccessfullyLaunched:any,
    setCurrentPage:any,
    projectTokenDetails:any,
    currentPage:any,
    twitterUrl:any,
    miscellaneousUrl:any,
    websiteUrl:any,
    telegramUrl:any,
    description:any,
) => {
    try {
      setIsCreatingIdo(true);
      if (selectedSigner) {
        const inputTokensData = inputTokens.map((token:any) => {
          return {
            inputTokenName: token.tokenName,
            inputTokenSymbol: token.tokenSymbol,
            inputTokenDecimals: parseInt(token.tokenDecimals),
            inputTokenAddress: token.tokenAddress,
          };
        });

        let startDateNum = new Date(startTimeInUTC).valueOf();
        let endDateNum = new Date(endTimeInUTC).valueOf();
        let cliffStartDateNum = new Date(vestingStartTimeInUTC).valueOf();
        let cliffEndDateNum = new Date(vestingEndTimeInUTC).valueOf();
        startDateNum = Math.floor(parseFloat(startDateNum.toString()) / 1000);
        endDateNum = Math.floor(parseFloat(endDateNum.toString()) / 1000);
        cliffStartDateNum = Math.floor(
          parseFloat(cliffStartDateNum.toString()) / 1000
        );
        cliffEndDateNum = Math.floor(
          parseFloat(cliffEndDateNum.toString()) / 1000
        );
        let cliffPeriodNum = new Date(cliffPeriodInUTC).valueOf();
        cliffPeriodNum = Math.floor(
          parseFloat(cliffPeriodNum.toString()) / 1000
        );
        const differenceEpochTime = cliffPeriodNum - cliffStartDateNum;
        let whitelistedAddressesArray: any = [];
        if (whitelistedAddresses) {
          whitelistedAddressesArray = whitelistedAddresses.split(",");
        }
        const arrOfInputTokenAddress = inputTokens.map(
          (inputToken:any) => inputToken.tokenAddress
        );
        const erc20Contract = new Contract(
          projectTokenAddress,
          ERC20,
          selectedSigner.signer
        );
        const proxyContract = new Contract(
          getNetworkConfig(selectedNetwork.name).PROXY_CONTRACT_MULTIOWNER,
          LaunchPadFactory,
          selectedSigner.signer
        );
        const factoryContract = new Contract(
          getNetworkConfig(selectedNetwork.name).LAUNCHPAD_FACTORY_ADDRESS,
          LaunchPadFactory,
          selectedSigner.signer
        );
        const tokenDecimals = await erc20Contract.decimals();
        const amountAllocation = ethers.utils.parseUnits(
          amountOfTokensToSell,
          tokenDecimals.toString()
        );

        const maxUserAllocationInWei = ethers.utils.parseUnits(
          maxUserAllocation,
          tokenDecimals.toString()
        );

        const softcapAmount = ethers.utils.parseUnits(
          softcap,
          tokenDecimals.toString()
        );
        const crowdSaleTimings = ethers.utils.defaultAbiCoder.encode(
          ["uint128", "uint128", "uint128", "uint128", "uint128"],
          [
            startDateNum,
            endDateNum,
            cliffStartDateNum,
            cliffEndDateNum,
            enableCliffPeriod ? differenceEpochTime : "0",
          ]
        );
        const whitelist = ethers.utils.defaultAbiCoder.encode(
          ["bool", "address[]"],
          [enableWhitelisting, whitelistedAddressesArray]
        );
        const launchCrowdSaleData = ethers.utils.defaultAbiCoder.encode(
          [
            "address",
            "uint256",
            "address[]",
            "uint256",
            "bytes",
            "bytes",
            "address",
            "string",
            "uint256",
            "uint256",
          ],
          [
            projectTokenAddress,
            amountAllocation,
            arrOfInputTokenAddress,
            new BigNumber(inputTokenRate)
              .multipliedBy(new BigNumber(10).pow(18))
              .toJSON(),
            crowdSaleTimings,
            whitelist,
            selectedSigner.evmAddress,
            projectTokenImage.ipfsImgUrl,
            softcapAmount,
            maxUserAllocationInWei,
          ]
        );

        console.log("launchCrowdSaleData===", launchCrowdSaleData);

        const txObject = await proxyContract.launchCrowdsale(
          0,
          launchCrowdSaleData,
        );
        await txObject.wait();
        setTxHash(txObject.hash);
        // drop confetti if success
        Uik.dropConfetti();
        setSuccessfullyLaunched(true);
        setCurrentPage(currentPage + 1)
        const getLatestCrowdSaleContract =
          await factoryContract.getLatestCrowdsale();
        const username = "adminUser";
        const password = "password";
        const token = btoa(`${username}:${password}`);
        const raw = JSON.stringify({
          crowdsaleAddress: getLatestCrowdSaleContract,
          tokenName: projectTokenDetails.name,
          tokenSymbol: projectTokenDetails.symbol,
          tokenDecimals: parseInt(projectTokenDetails.decimals),
          tokenAddress: projectTokenAddress,
          tokenImageUrl: projectTokenImage.ipfsImgUrl,
          twitterUrl: twitterUrl,
          telegramUrl: telegramUrl,
          websiteUrl: websiteUrl,
          miscellaneousUrl: miscellaneousUrl,
          description: description,
          presaleImageUrl: projectTokenImage.ipfsImgUrl,
          crowdsaleTokenAllocated: amountOfTokensToSell,
          crowdsaleStartTime: startDateNum.toString(),
          crowdsaleEndTime: endDateNum.toString(),
          vestingStart: cliffStartDateNum.toString(),
          vestingEnd: cliffEndDateNum.toString(),
          cliffDuration: enableCliffPeriod
            ? differenceEpochTime.toString()
            : "0",
          minimumTokenSaleAmount: softcap,
          maxUserAllocation: maxUserAllocation,
          inputTokenRate: inputTokenRate,
          isVerified: false,
          inputTokens: inputTokensData,
        });
        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Basic ${token}`);
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
        };
        const resp = await fetch(
          getNetworkCrowdsaleUrl(networkName),
          requestOptions
        );
        console.log("resp: ", resp);
      }
      setIsCreatingIdo(false);
    } catch (error) {
      setIsCreatingIdo(false);
      console.error(error);
    }
  };
