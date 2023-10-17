/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { CSSProperties, useState } from "react";
import Uik from "@reef-defi/ui-kit";
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
import { appState, hooks, ReefSigner } from "@reef-defi/react-lib";
import { create } from "ipfs-http-client";
import BigNumber from "bignumber.js";
import { LAUNCHPAD_FACTORY_ADDRESS } from "../../config";
import { LaunchPadFactory } from "../../abis/LaunchPadFactory";
import { ERC20 } from "../../abis/ERC20";

const auth = `Basic ${Buffer.from(
  `${process.env.REACT_APP_INFURA_PROJECT_ID}:${process.env.REACT_APP_INFURA_API_SECRET}`
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
      tokenAddress: "",
      tokenName: "",
      tokenSymbol: "",
      tokenDecimals: "",
    },
  ]);
  const [enableWhitelisting, setEnableWhitelisting] = useState(false);
  const [twitterUrl, setTwitterUrl] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [telegramUrl, setTelegramUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [miscellaneousUrl, setMiscellaneousUrl] = useState("");
  const [description, setDescription] = useState("");
  const [approveLoading, setApproveLoading] = useState(false);
  const [allowance, setAllowance] = useState(new BigNumber(0));
  const [startTimeInUTC, setStartTimeInUTC] = useState(new Date(Date.now()));
  const [endTimeInUTC, setEndTimeInUTC] = useState(
    new Date(Date.now() + 1 * 60 * 60 * 1000)
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
      tokenAddress: "",
      tokenName: "",
      tokenDecimals: "",
      tokenSymbol: "",
    };
    const tokens = [...inputTokens, newToken];
    setInputTokens(tokens);
  };
  const removeInputToken = (tokenAddress: string) => {
    const updatedTokens = inputTokens.filter(
      (eachToken) => eachToken.tokenAddress !== tokenAddress
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
      ipfsImgUrl: `${process.env.REACT_APP_INFURA_SUBDOMAIN_LINK}/${added.path}`,
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
          LAUNCHPAD_FACTORY_ADDRESS
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
          LAUNCHPAD_FACTORY_ADDRESS,
          constants.MaxUint256
        );
        await approvalTx.wait();
        const allowanceAmount = await erc20Contract.allowance(
          selectedSigner.evmAddress,
          LAUNCHPAD_FACTORY_ADDRESS
        );
        setAllowance(new BigNumber(allowanceAmount.toString()));
      }
      setApproveLoading(false);
    } catch (error) {
      setApproveLoading(false);
      console.error(error);
    }
  };
  const createIdo = async () => {
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
        const factoryContract = new Contract(
          LAUNCHPAD_FACTORY_ADDRESS,
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
        const txObject = await factoryContract.launchCrowdsale(
          0,
          launchCrowdSaleData
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
          "https://reef-ido.cryption.network/crowdsale",
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
  }
  return (
    <Uik.Card condensed className="admin-container">
      <Uik.Text
        type="headline"
        text="Create an IDO"
        className="admin-headline"
      />
      <Uik.Modal
        title="Transaction Successful!"
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
        <Uik.Text>Your IDO has be created successfully.</Uik.Text>
        <Uik.Text>Please check the Upcoming IDO tab.</Uik.Text>
      </Uik.Modal>
      <Uik.Form>
        <Uik.Divider text="Project token details" />
        <Uik.Container className="algin-top">
          <div>
            <Uik.Input
              label="Project token address"
              value={projectTokenAddress}
              onInput={(e) => setProjectTokenAddress(e.target.value)}
              onBlur={checkAllowance}
            />
            <label className="uik-button" style={{ marginTop: "20px" }}>
              <input
                type="file"
                hidden
                disabled={projectTokenImage.uploadingFile}
                onChange={handleFileUpload}
              />
              {projectTokenImage.uploadingFile
                ? "Uploading..."
                : "Upload token image"}
            </label>
          </div>
          <div>
            <Uik.Label text="Project Token Details" />
            <Uik.Container className="margin10 flex-column">
              {projectTokenImage.previewImgUrl && (
                <img
                  src={projectTokenImage.previewImgUrl}
                  alt="project token"
                  style={{ width: "30px", marginBottom: "10px" }}
                />
              )}
              {projectTokenDetails.name && (
                <Uik.Text
                  type="headline"
                  text={projectTokenDetails.name}
                  className="font20 margin10"
                />
              )}
              <Uik.Container className="margin10">
                {projectTokenDetails.symbol && (
                  <Uik.Text
                    text={`( ${projectTokenDetails.symbol} )`}
                    type="lead"
                  />
                )}
                {projectTokenDetails.decimals && (
                  <Uik.Text
                    text={`${projectTokenDetails.decimals} Decimals`}
                    type="lead"
                    className="text-center"
                  />
                )}
              </Uik.Container>
            </Uik.Container>
          </div>
        </Uik.Container>
        <Uik.Divider text="Input token details" />
        <Uik.Input
          label="Input token rate"
          type="number"
          key="inputTokenRateField"
          value={inputTokenRate}
          onInput={(e) => setInputTokenRate(e.target.value)}
        />
        {inputTokens.map((eachInputToken, index) => (
          <Uik.Container key={`inputToken+${index}`}>
            <Uik.Input
              label="Input token address"
              key={`inputTokenField+${index}`}
              value={eachInputToken.tokenAddress}
              onBlur={() => handleBlurInputToken(index)}
              onInput={(e) => handleInputTokenChange(e, index)}
            />
            {index > 0 && (
              // eslint-disable-next-line jsx-a11y/no-static-element-interactions
              <span
                onClick={() => removeInputToken(eachInputToken.tokenAddress)}
              >
                <Uik.Icon icon={faTrashCan} className="delete-icon" />
              </span>
            )}
          </Uik.Container>
        ))}
        <Uik.Button onClick={addToken}>Add new token</Uik.Button>

        <Uik.Divider text="Token sale details" />
        <Uik.Container>
          <DatePicker
            selected={formatUTC(startTimeInUTC, true)}
            wrapperClassName="display-flex"
            showTimeSelect
            minDate={startTimeInUTC}
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
            minDate={endTimeInUTC}
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="dd/MM/yyyy HH:mm"
            onChange={(date: Date) => setEndTimeInUTC(() => formatUTC(date))}
            customInput={<Uik.Input label="End time" />}
          />
        </Uik.Container>

        <Uik.Input
          type="number"
          label="Amount of tokens to sell (Hardcap)"
          value={amountOfTokensToSell}
          onChange={(e) => setAmountOfTokensToSell(e.target.value)}
        />

        <Uik.Input
          type="number"
          label="Softcap"
          value={softcap}
          onChange={(e) => setSoftcap(e.target.value)}
        />

        <Uik.Input
          type="number"
          label="Max user allocation"
          value={maxUserAllocation}
          onChange={(e) => setMaxUserAllocation(e.target.value)}
        />

        <Uik.Toggle
          label="Enable Whitelisting"
          onText="Enabled"
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
        <Uik.Divider text="Vesting details" />
        <Uik.Container>
          <DatePicker
            selected={formatUTC(vestingStartTimeInUTC, true)}
            wrapperClassName="display-flex"
            showTimeSelect
            minDate={vestingStartTimeInUTC}
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
            minDate={vestingEndTimeInUTC}
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
              minDate={cliffPeriodInUTC}
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
        <Uik.Divider text="IDO Details" />
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
              disableCreateButton ||
              isCreatingIDO ||
              allowance.isLessThan(amountOfTokensToSell)
            }
            onClick={createIdo}
            size="large"
            fill
            loading={isCreatingIDO}
          >
            Create IDO
          </Uik.Button>
        </Uik.Container>
      </Uik.Form>
    </Uik.Card>
  );
};
