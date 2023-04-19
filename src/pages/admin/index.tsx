import React, { useState, CSSProperties } from 'react';
import Uik from '@reef-defi/ui-kit';
import './index.css';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
// @ts-ignore
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  useCSVReader,
  lightenDarkenColor,
  formatFileSize,
} from 'react-papaparse';
// import { create } from 'ifps-http-client';

// const auth = `Basic ${Buffer.from(
//   `${process.env.REACT_APP_INFURA_PROJECT_ID}:${process.env.REACT_APP_INFURA_API_SECRET}`,
// ).toString('base64')}`;
//
// const client = create({
//   host: 'ipfs.infura.io',
//   port: 5001,
//   protocol: 'https',
//   headers: {
//     authorization: auth,
//   },
// });

const GREY = '#CCC';
const GREY_LIGHT = 'rgba(255, 255, 255, 0.4)';
const DEFAULT_REMOVE_HOVER_COLOR = '#A01919';
const REMOVE_HOVER_COLOR_LIGHT = lightenDarkenColor(
  DEFAULT_REMOVE_HOVER_COLOR,
  40,
);
const GREY_DIM = '#686868';
const csvstyles = {
  size: {
    backgroundColor: GREY_LIGHT,
    borderRadius: 3,
    marginBottom: '0.5em',
    justifyContent: 'center',
    display: 'flex',
  } as CSSProperties,
  progressBar: {
    bottom: 14,
    position: 'absolute',
    width: '100%',
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
    position: 'absolute',
    right: 6,
    top: 6,
    width: 23,
  } as CSSProperties,
};

export const Admin: React.FC = () => {
  const [projectTokenAddress, setProjectTokenAddress] = useState('');
  const [projectTokenImage] = useState({
    previewImgUrl: '',
    ipfsImgUrl: '',
    uploadingFile: false,
  });
  const [inputTokens, setInputTokens] = useState([
    {
      tokenAddress: '',
      tokenRate: '',
    },
  ]);
  const [enableWhitelisting, setEnableWhitelisting] = useState(false);
  const [startTimeInUTC, setStartTimeInUTC] = useState(new Date(Date.now()));
  const [endTimeInUTC, setEndTimeInUTC] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000),
  );
  const [amountOfTokensToSell, setAmountOfTokensToSell] = useState('1');
  const [whitelistedAddresses, setWhitelistedAddress] = useState('');
  const [zoneHover, setZoneHover] = useState(false);
  const [removeHoverColor, setRemoveHoverColor] = useState(
    DEFAULT_REMOVE_HOVER_COLOR,
  );
  const [vestingStartTimeInUTC, setVestingStartTimeInUTC] = useState(
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  );
  const [vestingEndTimeInUTC, setVestingEndTimeInUTC] = useState(
    new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
  );
  const [cliffPeriodInUTC, setCliffPeriodInUTC] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  );
  const [enableCliffPeriod, setEnableCliffPeriod] = useState(false);
  const [isCreatingIDO] = useState(false);

  const { CSVReader } = useCSVReader();

  const handleInputTokenChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const inputTokenDetails = inputTokens;
    if (inputTokenDetails[index]) {
      inputTokenDetails[index].tokenAddress = event.target.value;
      setInputTokens(() => inputTokenDetails);
    }
  };
  const handleInputTokenRateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const inputTokenDetails = inputTokens;
    if (inputTokenDetails[index]) {
      inputTokenDetails[index].tokenRate = event.target.value;
      setInputTokens(() => inputTokenDetails);
    }
  };
  const addToken = async () => {
    const newToken = {
      tokenAddress: '',
      tokenName: '',
      tokenDecimals: '',
      tokenSymbol: '',
      tokenRate: '',
    };
    const tokens = [...inputTokens, newToken];
    setInputTokens(tokens);
  };
  const removeInputToken = (tokenAddress: string) => {
    const updatedTokens = inputTokens.filter(
      (eachToken) => eachToken.tokenAddress !== tokenAddress,
    );
    setInputTokens(updatedTokens);
  };

  const formatUTC = (dateInt: number | Date, addOffset = false) => {
    const date = !dateInt || dateInt.toString().length < 1
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

  // const handleFileUpload = async (
  //   event: React.ChangeEvent<HTMLInputElement>,
  // ) => {
  //   if (!event.target.files) return;
  //
  //   const imageUrl = URL.createObjectURL(event.target.files[0]);
  //   setProjectTokenImage(() => ({
  //     ...projectTokenImage,
  //     previewImgUrl: imageUrl,
  //     uploadingFile: true,
  //   }));
  //   const added = await client.add(event.target.files[0]);
  //   setProjectTokenImage(() => ({
  //     previewImgUrl: imageUrl,
  //     ipfsImgUrl: `${process.env.REACT_APP_INFURA_SUBDOMAIN_LINK}/${added.path}`,
  //     uploadingFile: false,
  //   }));
  // };
  //
  return (
    <Uik.Card condensed className="admin-container">
      <Uik.Text
        type="headline"
        text="Create an IDO"
        className="admin-headline"
      />
      <Uik.Form>
        <Uik.Divider text="Project token details" />
        <Uik.Input
          label="Project token address"
          value={projectTokenAddress}
          onInput={(e) => setProjectTokenAddress(e.target.value)}
        />

        <Uik.Container>
          {projectTokenImage.previewImgUrl && (
            <img
              src={projectTokenImage.previewImgUrl}
              alt="project token"
              width="40px"
            />
          )}
          <Uik.Button loading={projectTokenImage.uploadingFile}>
            Upload token image
            {/* <Uik.Input type="file" onChange={handleFileUpload} /> */}
          </Uik.Button>
        </Uik.Container>

        <Uik.Divider text="Input token details" />
        {inputTokens.map((eachInputToken, index) => (
          <Uik.Container key={eachInputToken.tokenAddress}>
            <Uik.Input
              label="Input token address"
              value={eachInputToken.tokenAddress}
              onInput={(e) => handleInputTokenChange(e, index)}
            />
            <Uik.Container>
              <Uik.Input
                label="Input token rate"
                value={eachInputToken.tokenRate}
                onInput={(e) => handleInputTokenRateChange(e, index)}
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
          label="Amount of tokens to sell"
          min={1}
          value={amountOfTokensToSell}
          onChange={(e) => setAmountOfTokensToSell(e.target.value)}
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
                      ...(zoneHover && csvstyles.zoneHover),
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
                            // className="csvstyles-remove"
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
                      'Drop CSV file here or click to upload'
                    )}
                  </div>
                </>
              )}
            </CSVReader>
            <Uik.Container className="csv-footer">
              <Uik.Text type="mini">
                Accepted: CSV / Excel
              </Uik.Text>
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
            onChange={(date: Date) => setVestingStartTimeInUTC(() => formatUTC(date))}
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
            onChange={(date: Date) => setVestingEndTimeInUTC(() => formatUTC(date))}
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
              onChange={(date: Date) => setCliffPeriodInUTC(() => formatUTC(date))}
              customInput={<Uik.Input label="Cliff period" />}
            />
          )}
        </Uik.Container>

        <Uik.Button type="submit" size="large" fill loading={isCreatingIDO}>
          Create IDO
        </Uik.Button>
      </Uik.Form>
    </Uik.Card>
  );
};
