import React, { useState } from 'react';
import Uik from '@reef-defi/ui-kit';
import './index.css';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
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

export const Admin: React.FC = () => {
  const [projectTokenAddress, setProjectTokenAddress] = useState('');
  const [projectTokenImage, setProjectTokenImage] = useState({
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
  const [startTimeInUTC, setStartTimeInUTC] = useState('2018-06-12T19:30');
  const [endTimeInUTC, setEndTimeInUTC] = useState('2018-06-12T19:30');
  const [amountOfTokensToSell, setAmountOfTokensToSell] = useState('1');
  const [whitelistedAddresses, setWhitelistedAddress] = useState('');
  // eslint-disable-next-line
  const [vestingStartTimeInUTC, setVestingStartTimeInUTC] =
    useState('2018-06-12T19:30');
  // eslint-disable-next-line
  const [vestingEndTimeInUTC, setVestingEndTimeInUTC] =
    useState('2018-06-12T19:30');
  const [cliffPeriodInUTC, setCliffPeriodInUTC] = useState('2018-06-12T19:30');
  const [enableCliffPeriod, setEnableCliffPeriod] = useState(false);
  const [isCreatingIDO, setIsCreatingIDO] = useState(false);

  const handleInputTokenChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const inputTokenDetails = inputTokens;
    console.log('number: ', index);
    if (inputTokenDetails[index]) {
      inputTokenDetails[index].tokenAddress = event.target.value;
      setInputTokens(() => inputTokenDetails);
    }
    console.log('new input token details: ', inputTokenDetails);
  };
  const handleInputTokenRateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const inputTokenDetails = inputTokens;
    if (inputTokenDetails[index]) {
      inputTokenDetails[index].tokenRate = event.target.value;
      setInputTokens(inputTokenDetails);
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
        {inputTokens.map((token, index) => (
          <Uik.Container key={token.tokenAddress}>
            <Uik.Input
              label="Input token address"
              value={token.tokenAddress}
              onChange={(e) => handleInputTokenChange(e, index)}
            />
            <Uik.Container>
              <Uik.Input
                label="Input token rate"
                value={token.tokenRate}
                onChange={(e) => handleInputTokenRateChange(e, index)}
              />
              {index > 0 && (
                <span onClick={() => removeInputToken(token.tokenAddress)}>
                  <Uik.Icon icon={faTrashCan} className="delete-icon" />
                </span>
              )}
            </Uik.Container>
          </Uik.Container>
        ))}
        <Uik.Button onClick={addToken}>Add new token</Uik.Button>

        <Uik.Divider text="Token sale details" />
        <Uik.Container>
          <Uik.Input
            type="datetime-local"
            label="Start time"
            value={startTimeInUTC}
            onChange={(e) => setStartTimeInUTC(e.target.value)}
          />

          <Uik.Input
            type="datetime-local"
            label="End time"
            value={endTimeInUTC}
            onChange={(e) => setEndTimeInUTC(e.target.value)}
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
          <Uik.Input
            value={whitelistedAddresses}
            onChange={(e) => setWhitelistedAddress(e.target.value)}
            label="Enter addresses to whitelist"
            textarea
          />
        )}

        <Uik.Divider text="Vesting details" />
        <Uik.Container>
          <Uik.Input
            type="datetime-local"
            label="Vesting start time"
            value={vestingStartTimeInUTC}
            onChange={(e) => setVestingStartTimeInUTC(e.target.value)}
          />

          <Uik.Input
            type="datetime-local"
            label="Vesting end time"
            value={vestingEndTimeInUTC}
            onChange={(e) => setVestingEndTimeInUTC(e.target.value)}
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
            <Uik.Input
              type="datetime-local"
              label="Cliff Period"
              value={cliffPeriodInUTC}
              onChange={(e) => setCliffPeriodInUTC(e.target.value)}
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
