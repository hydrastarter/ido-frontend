import { AvailableNetworks, availableNetworks } from "@reef-defi/react-lib";

let backendDomainName = 'reefscan.info';
export const getNetworkCrowdsaleUrl = (networkName: AvailableNetworks)=>{
  // return `https://ido-backend-${networkName}.${backendDomainName}/crowdsale`;
  return `http://127.0.0.1:3000/crowdsale`;
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
    LAUNCHPAD_FACTORY_ADDRESS: "0xcBA15dCb42a4F8Fee5A24e2B4fBdCbD0Df843Eb4",
    PROXY_CONTRACT_MULTIOWNER: "0x31e8EfCB7D6816d9C0A7cdDcc94390aF9548ab6D"
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

