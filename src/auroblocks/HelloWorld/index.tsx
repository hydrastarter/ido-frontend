import React, { useEffect, useState } from 'react';
import { Contract } from 'ethers';
import { Provider, Signer as EvmSigner } from '@reef-defi/evm-provider';
import { WsProvider } from '@polkadot/rpc-provider';
import { web3Enable } from '@reef-defi/extension-dapp';
import { REEF_EXTENSION_IDENT } from '@reef-defi/extension-inject';
import { InjectedExtension } from '@reef-defi/extension-inject/types';
import { ERC20 } from '../abis/ERC20';

const HelloWorld = () : JSX.Element => {
  const [account, setAccount] = useState<null | string>(null);
  const [provider, setProvider] = useState<null | Provider>(null);
  const [extensionSigner, setExtension] = useState<null | InjectedExtension>(
    null,
  );
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const createSigner = async () => {
    try {
      if (provider && extensionSigner && extensionSigner?.signer && account) {
        const signer = new EvmSigner(provider, account, extensionSigner.signer);
        console.log(signer);
        const contract = new Contract(
          '0xee93416ECa22EcC782bA911309eDDF605Ef8eC42',
          ERC20,
          signer,
        );
        const signerAddress = await signer.getAddress();
        console.log({ signerAddress, contract });
        const balance = await contract.balanceOf(signerAddress);
        const symbol = await contract.symbol();
        const decimals = await contract.decimals();
        console.log('balance: ', balance.toString());
        console.log({
          signerAddress,
          balance: balance.toString(),
          symbol,
          decimals,
        });
        // const transferAmount = new BigNumber(10).multipliedBy(10**18).toString()
        const tx = await contract.transfer(
          '0x0fF2f9d276cdF3559aa414e338fd6521e9DfEc34',
          10,
        );
        await tx.wait();
        console.log({ tx });
        const balanceAfter = await contract.balanceOf(signerAddress);
        console.log('balance after', balanceAfter);
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const checkReef = async () => {
      const evmProvider = new Provider({
        provider: new WsProvider('wss://rpc.reefscan.com/ws '),
      });
      console.log('check', evmProvider);
      setProvider(evmProvider);
      const extensionsArr = await web3Enable('reeftesting');
      const extension = extensionsArr.find(
        (e) => e.name === REEF_EXTENSION_IDENT,
      );
      // const extension = await web3FromSource(REEF_EXTENSION_IDENT);
      if (!extension) {
        throw new Error(
          'Install Reef Chain Wallet extension for Chrome or Firefox. See docs.reef.io',
        );
      }
      const accs = await extension.accounts.get();
      if (accs && accs.length > 0) {
        const activeAccount = accs.find((acc) => acc.isSelected);
        if (activeAccount) {
          setAccount(activeAccount.address);
        } else {
          setAccount(accs[0].address);
        }
      }
      setExtension(extension);
    };
    checkReef();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <p>
        Connected Account:
        {account}
      </p>

      <hr />

      <p>Create Signer</p>
      {/* eslint-disable-next-line react/button-has-type */}
      <button onClick={createSigner}>Create Signer</button>
      <p>
        process.env.PRODUCTION:
        {' '}
        <b>{process.env.PRODUCTION}</b>
      </p>
      <p>
        process.env.NAME:
        {' '}
        <b>{process.env.NAME}</b>
      </p>
      <p>
        process.env.VERSION:
        {' '}
        <b>{process.env.VERSION}</b>
      </p>
    </div>
  );
};

export default HelloWorld;
