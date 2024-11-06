import { AvailableNetworks, availableNetworks } from "@reef-defi/react-lib";

let backendDomainName = 'reefscan.info';
export const getNetworkCrowdsaleUrl = (networkName: AvailableNetworks)=>{
  return `https://ido-backend-${networkName}.${backendDomainName}/crowdsale`;
}

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
    LAUNCHPAD_FACTORY_ADDRESS: "0xf401b3Ec2298B80547B53dEEB8906677102A7F4B",
    PROXY_CONTRACT_MULTIOWNER: ""
  },
  localhost:{
    LAUNCHPAD_FACTORY_ADDRESS: "0xf401b3Ec2298B80547B53dEEB8906677102A7F4B",
    PROXY_CONTRACT_MULTIOWNER: ""
  }
}

