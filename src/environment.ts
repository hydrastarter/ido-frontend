import { availableNetworks } from "@reef-defi/react-lib";

/* {
  name: 'testnet',
  rpcUrl: 'ws://localhost:9944',
  reefscanUrl: 'http://localhost:8000',
  factoryAddress: '0xcA36bA38f2776184242d3652b17bA4A77842707e',
  routerAddress: '0x0A2906130B1EcBffbE1Edb63D5417002956dFd41',
  graphqlUrl: 'http://localhost:8080/v1/graphql',
} as Network; */

export const appAvailableNetworks = [
  availableNetworks.mainnet,
  availableNetworks.testnet,
];

export const appSelectedNetwork = availableNetworks.mainnet;
export const infuraProjectId = process.env.REACT_APP_INFURA_PROJECT_ID;
export const infuraApiSecret = process.env.REACT_APP_INFURA_API_SECRET;
export const infuraSubDomainBaseUrl = process.env.REACT_APP_INFURA_SUBDOMAIN_LINK;

export const networkConfig={
  mainnet:{
    LAUNCHPAD_FACTORY_ADDRESS: "0xC58B97d8850f72A812BBdECA7Dd0672Ce406DAd4",
    PROXY_CONTRACT_MULTIOWNER: "0x93f8193e930E0342aF94eAAd99bC2f177a53c18B"
  },
  testnet:{
    LAUNCHPAD_FACTORY_ADDRESS: "0x61BD471D713b2E24b511bB0b598ec0Da3ba8DBef",
    PROXY_CONTRACT_MULTIOWNER: ""
  },
  localhost:{
    LAUNCHPAD_FACTORY_ADDRESS: "0x61BD471D713b2E24b511bB0b598ec0Da3ba8DBef",
    PROXY_CONTRACT_MULTIOWNER: ""
  }
}

