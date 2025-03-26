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
    LAUNCHPAD_FACTORY_ADDRESS: "0xd28817b6Af37E635575b0D579DbB042A4331b9Bb",
    PROXY_CONTRACT_MULTIOWNER: "0xAcC9917E71Bb1e27eC98fc7b8D223882A37aAA32"
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

