/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { CSSProperties, useState } from "react";
import Uik from "@reef-chain/ui-kit";
import { constants, Contract, ethers } from "ethers";
import "./index.css";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
// @ts-ignore
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  formatFileSize,
  lightenDarkenColor,
  useCSVReader,
} from "react-papaparse";
import { Buffer } from "buffer";
import { appState, AvailableNetworks, hooks, Network, ReefSigner } from "@reef-defi/react-lib";
import { create } from "ipfs-http-client";
import BigNumber from "bignumber.js";
import { getNetworkConfig } from "../../config";
import { LaunchPadFactory } from "../../abis/LaunchPadFactory";
import { ERC20 } from "../../abis/ERC20";
import { getNetworkCrowdsaleUrl, infuraApiSecret, infuraProjectId, infuraSubDomainBaseUrl } from "../../environment";
import Hero from "../../common/Hero";

const auth = `Basic ${Buffer.from(
  `${infuraProjectId}:${infuraApiSecret}`
).toString("base64")}`;

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

const GREY = "#CCC";
const GREY_LIGHT = "rgba(255, 255, 255, 0.4)";
const DEFAULT_REMOVE_HOVER_COLOR = "#A01919";
const REMOVE_HOVER_COLOR_LIGHT = lightenDarkenColor(
  DEFAULT_REMOVE_HOVER_COLOR,
  40
);
const GREY_DIM = "#686868";
const CSVStyles = {
  size: {
    backgroundColor: GREY_LIGHT,
    borderRadius: 3,
    marginBottom: "0.5em",
    justifyContent: "center",
    display: "flex",
  } as CSSProperties,
  progressBar: {
    bottom: 14,
    position: "absolute",
    width: "100%",
    paddingLeft: 10,
    paddingRight: 10,
  } as CSSProperties,
  zoneHover: {
    borderColor: GREY_DIM,
  } as CSSProperties,
  default: {
    borderColor: GREY,
  } as CSSProperties,
  remove: {
    height: 23,
    position: "absolute",
    right: 6,
    top: 6,
    width: 23,
  } as CSSProperties,
};

export const Admin: React.FC = () => {
  const [projectTokenAddress, setProjectTokenAddress] = useState("");
  const [txHash, setTxHash] = useState(null);
  const [error,setError] = useState("");
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
  const [isOpen, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [telegramUrl, setTelegramUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [miscellaneousUrl, setMiscellaneousUrl] = useState("");
  const [description, setDescription] = useState("");
  const [approveLoading, setApproveLoading] = useState(false);
  const [allowance, setAllowance] = useState(new BigNumber(0));
  const [startTimeInUTC, setStartTimeInUTC] = useState(new Date(Date.now()));
  const [endTimeInUTC, setEndTimeInUTC] = useState(
    new Date(Date.now() + 60 * 60 * 1000)
  );
  const [amountOfTokensToSell, setAmountOfTokensToSell] = useState("0");
  const [softcap, setSoftcap] = useState("900");
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

  const { CSVReader } = useCSVReader();

  const selectedSigner: ReefSigner | undefined | null =
    hooks.useObservableState(appState.selectedSigner$);
  const selectedNetwork: Network | undefined | null =
    hooks.useObservableState(appState.currentNetwork$);
  // const accounts: ReefSigner[] | undefined | null = hooks.useObservableState(appState.signers$);
  // const provider = hooks.useObservableState(appState.currentProvider$);
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

  const formatUTC = (dateInt: number | Date, addOffset = false) => {
    const date =
      !dateInt || dateInt.toString().length < 1
        ? new Date()
        : new Date(dateInt);

    const offset = addOffset
      ? date.getTimezoneOffset()
      : -date.getTimezoneOffset();
    const offsetDate = new Date();
    offsetDate.setTime(date.getTime() + offset * 60000);
    return offsetDate;
  };

  const bulkUpload = (results: any) => {
    if (results && results.data && results.data.length > 0) {
      const importData: any[] = [];
      results.data.slice(1).forEach((eachUser: any) => {
        if (eachUser[0].length > 0) {
          importData.push(eachUser[0]);
        }
      });
      setEnableWhitelisting(() => true);
      setWhitelistedAddress(() => importData.join());
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;

    const imageUrl = URL.createObjectURL(event.target.files[0]);
    setProjectTokenImage(() => ({
      ...projectTokenImage,
      previewImgUrl: imageUrl,
      uploadingFile: true,
    }));
    const added = await client.add(event.target.files[0]);
    setProjectTokenImage(() => ({
      previewImgUrl: imageUrl,
      ipfsImgUrl: `${infuraSubDomainBaseUrl}/${added.path}`,
      uploadingFile: false,
    }));
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
  const approveProjectToken = async () => {
    try {
      setApproveLoading(true);
      if (selectedSigner) {
        const erc20Contract = new Contract(
          projectTokenAddress,
          ERC20,
          selectedSigner.signer
        );
        const approvalTx = await erc20Contract.approve(
          getNetworkConfig(selectedNetwork.name).PROXY_CONTRACT_MULTIOWNER,
          constants.MaxUint256
        );
        await approvalTx.wait();
        const allowanceAmount = await erc20Contract.allowance(
          selectedSigner.evmAddress,
          getNetworkConfig(selectedNetwork.name).PROXY_CONTRACT_MULTIOWNER
        );
        setAllowance(new BigNumber(allowanceAmount.toString()));
      }
      setApproveLoading(false);
    } catch (error) {
      setApproveLoading(false);
      console.error(error);
    }
  };
  const createIdo = async (networkName: AvailableNetworks) => {
    try {
      setIsCreatingIdo(true);
      if (selectedSigner) {
        const inputTokensData = inputTokens.map((token) => {
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
          (inputToken) => inputToken.tokenAddress
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

        console.log("launchCrowdSaleData===",launchCrowdSaleData);

        const txObject = await proxyContract.launchCrowdsale(
          0,
          launchCrowdSaleData,
          {
            gasLimit: 1_000_000_000, // Set a really high gas limit (adjust if needed)
          }
        );
        await txObject.wait();
        setTxHash(txObject.hash);
        setOpen(true);
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
    parseFloat(amountOfTokensToSell.toString()) > parseFloat(softcap.toString())
  ) {
    disableCreateButton = false;
  }else{
    let errorMessage = "";

  if (
    !projectTokenAddress || projectTokenAddress.length === 0
  ) {
    errorMessage = "Project token address is required.";
  } else if (
    !inputTokens || inputTokens.length === 0
  ) {
    errorMessage = "At least one input token is required.";
  } else if (
    !inputTokens[0].tokenAddress || inputTokens[0].tokenAddress.length === 0
  ) {
    errorMessage = "Token address for the input token is required.";
  } else if (
    amountOfTokensToSell.toString().length === 0
  ) {
    errorMessage = "Amount of tokens to sell is required.";
  } else if (
    startTimeInUTC >= endTimeInUTC
  ) {
    errorMessage = "Start time must be earlier than end time.";
  } else if (
    parseFloat(amountOfTokensToSell.toString()) <= 0
  ) {
    errorMessage = "Amount of tokens to sell must be greater than zero.";
  } else if (
    parseFloat(amountOfTokensToSell.toString()) <= parseFloat(softcap.toString())
  ) {
    errorMessage = "Amount of tokens to sell must be greater than the softcap.";
  }

  if(errorMessage!=error||errorMessage==""){
    setError(errorMessage);
  }
  }

  

  const getTokenDetails = () => {
    return (
      <Uik.Container className="align-top token-details card-create-ido">
        <div className="token-details-placeholder">
          <div style={{ position: "relative" }}>
            {projectTokenImage.previewImgUrl ? (
              <img
                src={projectTokenImage.previewImgUrl}
                alt="project token"
                style={{ width: "30px", marginBottom: "10px" }}
              />
            ) : (
              <div className="empty-image"></div>
            )}

            <div
              className="project-details"
            >
              {projectTokenDetails.name ? (
                <Uik.Text type="headline" text={projectTokenDetails.name} className="font20 margin10" />
              ) : (
                <Uik.Text text={`TOKEN NAME`} type="light" />
              )}
              {projectTokenDetails.symbol ? (
                <Uik.Text text={`( ${projectTokenDetails.symbol} )`} type="light" />
              ) : (
                <Uik.Text text={`( TOKEN SYMBOL )`} type="light" className="text-sm" />
              )}
              {projectTokenDetails.decimals ? (
                <Uik.Text text={`${projectTokenDetails.decimals} Decimals`} type="lead" className="text-center" />
              ) : (
                <Uik.Text text={`DECIMALS`} type="light" className="text-sm" />
              )}
            </div>
          </div>
        </div>

        <div style={{ flex: 2 }}>
          <Uik.Input
            placeholder="Project token address"
            value={projectTokenAddress}
            onInput={(e) => setProjectTokenAddress(e.target.value)}
            onBlur={checkAllowance}
          />
          <div className="buttons-group">
            <label className="uik-button uik-button--fill" style={{ marginTop: "20px", flex: 1 }}>
              <input
                type="file"
                hidden
                disabled={projectTokenImage.uploadingFile}
                onChange={handleFileUpload}
              />
              {projectTokenImage.uploadingFile ? "Uploading..." : "Upload token image"}
            </label>
            {projectTokenAddress && projectTokenAddress.length == 42 && currentPage == 0 && buildButtonsGroup(true)}
          </div>
        </div>
      </Uik.Container>
    );
  };

  const buildButtonsGroup = (isOnlyNext?: boolean, isOnlyPrev?: boolean) => {
    if (isOnlyNext) {
      return (
        <Uik.Button onClick={() => setCurrentPage(currentPage + 1)} text="Next" className="navigation-btns-next margin-top-10 margin-left-10" />
      );
    } else if (isOnlyPrev) {
      return (
        <Uik.Button onClick={() => setCurrentPage(currentPage - 1)} text="Previous" className="navigation-btns-next margin-top-10 margin-left-10" />
      );
    }
    else {
      return (<>
        <div className="navigation-btns-group">

          <Uik.Button onClick={() => setCurrentPage(currentPage - 1)} text="Previous" className="navigation-btns-prev" />

          <Uik.Button onClick={() => setCurrentPage(currentPage + 1)} text="Next" fill className="navigation-btns-next" />


        </div>
      </>)
    }
  }

  const buildTokenDetails = () => {
    return (
      <>
        <Uik.Text text="Token Details" type="headline" className="small-headline" />
        <Uik.Input
          label="Input token rate"
          type="number"
          key="inputTokenRateField"
          value={inputTokenRate}
          onInput={(e) => setInputTokenRate(e.target.value)}
        />
        {inputTokens.map((eachInputToken, index) => (
          <div key={`inputToken+${index}`} className="input-token-address">
            <Uik.Input
              label="Input token address"
              key={`inputTokenField+${index}`}
              value={eachInputToken.tokenAddress}
              onBlur={() => handleBlurInputToken(index)}
              onInput={(e) => handleInputTokenChange(e, index)}
            />
            {index > 0 && (
              <span
                onClick={() => removeInputToken(eachInputToken.key)}
              >
                <Uik.Icon icon={faTrashCan} className="delete-icon" />
              </span>
            )}
          </div>
        ))}
        <Uik.Button onClick={addToken} fill>Add new token</Uik.Button>
        {buildButtonsGroup()}
      </>);
  }

  const buildTokenSaleDetails = () => {
    return (<>
      <Uik.Text text="Sale Details" type="headline" className="small-headline" />
      <Uik.Container>
        <DatePicker
          selected={formatUTC(startTimeInUTC, true)}
          wrapperClassName="display-flex"
          showTimeSelect
          minDate={new Date(Date.now())}
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="dd/MM/yyyy HH:mm"
          onChange={(date: Date) => setStartTimeInUTC(() => formatUTC(date))}
          customInput={<Uik.Input label="Start time" />}
        />

        <DatePicker
          selected={formatUTC(endTimeInUTC, true)}
          wrapperClassName="display-flex"
          showTimeSelect
          minDate={new Date(Date.now())}
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="dd/MM/yyyy HH:mm"
          onChange={(date: Date) => setEndTimeInUTC(() => formatUTC(date))}
          customInput={<Uik.Input label="End time" />}
        />
      </Uik.Container>

      <div className="amount-to-sell">
        <Uik.Input
          type="number"
          label="Hardcap ( Maximum amount to sell )"
          value={amountOfTokensToSell}
          onChange={(e) => setAmountOfTokensToSell(e.target.value)}
          className="margin-right-10"
        />

        <Uik.Input
          type="number"
          label="Softcap"
          value={softcap}
          onChange={(e) => setSoftcap(e.target.value)}
        />

      </div>

      <Uik.Input
        type="number"
        label="Max user allocation"
        value={maxUserAllocation}
        onChange={(e) => setMaxUserAllocation(e.target.value)}
      />

      <Uik.Toggle
        label="Enable Whitelisting"
        onText="Enabled whitelisted addresses"
        offText="No addresses whitelisted"
        value={enableWhitelisting}
        onChange={() => setEnableWhitelisting(!enableWhitelisting)}
      />
      {enableWhitelisting && (
        <>
          <Uik.Input
            value={whitelistedAddresses}
            onChange={(e) => setWhitelistedAddress(e.target.value)}
            label="Enter addresses to whitelist"
            textarea
          />

          <CSVReader
            onUploadAccepted={(results: any) => {
              bulkUpload(results);
            }}
            onDragOver={(event: DragEvent) => {
              event.preventDefault();
              setZoneHover(true);
            }}
            onDragLeave={(event: DragEvent) => {
              event.preventDefault();
              setZoneHover(false);
            }}
          >
            {({
              getRootProps,
              acceptedFile,
              ProgressBar,
              getRemoveFileProps,
              Remove,
            }: any) => (
              <>
                <div
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...getRootProps()}
                  className="upload-container"
                  style={{
                    ...(zoneHover && CSVStyles.zoneHover),
                  }}
                >
                  {acceptedFile ? (
                    <>
                      <div className="file-container">
                        <div>
                          <Uik.Text>
                            {formatFileSize(acceptedFile.size)}
                          </Uik.Text>
                          <Uik.Text>{acceptedFile.name}</Uik.Text>
                        </div>
                        <div className="progress-bar">
                          <ProgressBar />
                        </div>
                        {/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */}
                        <div
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          {...getRemoveFileProps()}
                          // className="CSVStyles-remove"
                          onMouseOver={(event: Event) => {
                            event.preventDefault();
                            setRemoveHoverColor(REMOVE_HOVER_COLOR_LIGHT);
                          }}
                          onMouseOut={(event: Event) => {
                            event.preventDefault();
                            setRemoveHoverColor(DEFAULT_REMOVE_HOVER_COLOR);
                          }}
                        >
                          <Remove color={removeHoverColor} />
                        </div>
                      </div>
                    </>
                  ) : (
                    "Drop CSV file here or click to upload"
                  )}
                </div>
              </>
            )}
          </CSVReader>
          <Uik.Container className="csv-footer">
            <Uik.Text type="mini">Accepted: CSV / Excel</Uik.Text>
            <Uik.Text type="mini">
              <a href="/files/whitelist.csv">Get Example</a>
            </Uik.Text>
          </Uik.Container>
        </>
      )}
      {buildButtonsGroup()}
    </>);

  }

  const buildVestingDetails = () => {
    return (<>
      <Uik.Text text="Vesting Details" type="headline" className="small-headline" />
      <Uik.Container>
        <DatePicker
          selected={formatUTC(vestingStartTimeInUTC, true)}
          wrapperClassName="display-flex"
          showTimeSelect
          minDate={new Date(Date.now())}
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="dd/MM/yyyy HH:mm"
          onChange={(date: Date) =>
            setVestingStartTimeInUTC(() => formatUTC(date))
          }
          customInput={<Uik.Input label="Vesting start time" />}
        />

        <DatePicker
          selected={formatUTC(vestingEndTimeInUTC, true)}
          wrapperClassName="display-flex"
          showTimeSelect
          minDate={new Date(Date.now())}
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="dd/MM/yyyy HH:mm"
          onChange={(date: Date) =>
            setVestingEndTimeInUTC(() => formatUTC(date))
          }
          customInput={<Uik.Input label="Vesting end time" />}
        />
      </Uik.Container>

      <Uik.Container>
        <Uik.Toggle
          label="Enable Cliff Period"
          onText="Enabled"
          offText="No Cliff Period"
          value={enableCliffPeriod}
          onChange={() => setEnableCliffPeriod(!enableCliffPeriod)}
        />
        {enableCliffPeriod && (
          <DatePicker
            selected={formatUTC(cliffPeriodInUTC, true)}
            wrapperClassName="display-flex"
            showTimeSelect
            minDate={new Date(Date.now())}
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="dd/MM/yyyy HH:mm"
            onChange={(date: Date) =>
              setCliffPeriodInUTC(() => formatUTC(date))
            }
            customInput={<Uik.Input label="Cliff period" />}
          />
        )}

      </Uik.Container>
      {buildButtonsGroup()}
    </>);
  }

  const buildFinalForm = () => {
    return (
      <>
        <Uik.Text text="IDO Details" type="headline" className="small-headline" />
        <Uik.Container>
          <Uik.Input
            label="Twitter Url"
            value={twitterUrl}
            onChange={(e) => setTwitterUrl(e.target.value)}
          />
          <Uik.Input
            label="Telegram Url"
            value={telegramUrl}
            onChange={(e) => setTelegramUrl(e.target.value)}
          />
        </Uik.Container>
        <Uik.Container>
          <Uik.Input
            label="Website Url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
          />
          <Uik.Input
            label="Miscellaneous Url"
            value={miscellaneousUrl}
            onChange={(e) => setMiscellaneousUrl(e.target.value)}
          />
        </Uik.Container>
        <Uik.Input
          label="Description"
          textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {buildButtonsGroup(false, true)}
        <Uik.Container flow="stretch">
          <Uik.Button
            disabled={allowance.isGreaterThan(amountOfTokensToSell)}
            size="large"
            loading={approveLoading}
            onClick={approveProjectToken}
          >
            Approve
          </Uik.Button>
          <Uik.Button
            disabled={
              // false
              disableCreateButton ||
              isCreatingIDO ||
              allowance.isLessThan(amountOfTokensToSell)
            }
            onClick={() => createIdo(selectedNetwork.name)}
            size="large"
            
            fill={ !(disableCreateButton ||
              isCreatingIDO ||
              allowance.isLessThan(amountOfTokensToSell))}
            loading={isCreatingIDO}
          >
           {disableCreateButton ||
              isCreatingIDO ||
              allowance.isLessThan(amountOfTokensToSell)? error:"Create IDO"} 
          </Uik.Button>
          
        </Uik.Container>
      </>
    )
  }

  const formResolver = [
    buildTokenDetails,
    buildTokenSaleDetails,
    buildVestingDetails,
    buildFinalForm
  ]

const endpoint = 'https://squid.subsquid.io/reef-explorer/graphql';

async function fetchBlockHeight() {
  try {
    const query = `
    query FetchBlockHeight {
      transfers(limit: 1, where: {AND: {extrinsicHash_eq: "${txHash}"}}, orderBy: blockHeight_DESC) {
        extrinsicId
      }
    }
    `;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
      }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error('Error fetching data:', data.errors);
      return null;
    }

    const extrinsicId = data.data.transfers[0]?.extrinsicId;

    if (extrinsicId) {
      const blockHeightHex = extrinsicId.split("-")[1]
      return blockHeightHex;
    } else {
      console.error('No blockHeight data found');
      return null;
    }
  } catch (error) {
    console.error('Request failed', error);
    return null;
  }
  }

  return (
    <div>
      <Hero title='Create an IDO'
        subtitle='One step closer to a smooth launch'
        imgsrc='token-details.jpg'
      />
      <Uik.Card condensed className="admin-container">

        <Uik.Modal
          title="Transaction Successful!"
          isOpen={isOpen}
          onClose={() => setOpen(false)}
          footer={
            <>
              <Uik.Button text="Close" onClick={() => setOpen(false)} />
              <Uik.Button
                text="Check Transactions"
                success
                fill
                onClick={async() =>{
                  const getBlockHeight = await fetchBlockHeight();
                  window.open(
                    `https://reefscan.com/extrinsic/${txHash}-${getBlockHeight}`,
                    "_blank"
                  );
                }
                }
              />
            </>
          }
        >
          <Uik.Text>Your IDO has be created successfully.</Uik.Text>
          <Uik.Text>Please check the Upcoming IDO tab.</Uik.Text>
        </Uik.Modal>
        <Uik.Form>

          {getTokenDetails()}
          {currentPage > 0 && formResolver[currentPage - 1]()}
        </Uik.Form>
      </Uik.Card>
    </div>
  );
};
