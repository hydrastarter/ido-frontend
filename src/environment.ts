import { AvailableNetworks, availableNetworks } from "@reef-defi/react-lib";

let backendDomainName = 'reefscan.info';
export const getNetworkCrowdsaleUrl = (networkName: AvailableNetworks)=>{
  return `https://ido-backend-${networkName}.${backendDomainName}/crowdsale`;
  // return `http://localhost:3000/crowdsale`;
}

export const appAvailableNetworks = [
  availableNetworks.mainnet,
  availableNetworks.testnet,
];

export const appSelectedNetwork = availableNetworks.mainnet;
export const infuraProjectId =  process.env.REACT_APP_INFURA_PROJECT_ID;
export const infuraApiSecret = process.env.REACT_APP_INFURA_API_SECRET;
export const infuraSubDomainBaseUrl = process.env.REACT_APP_INFURA_SUBDOMAIN_LINK??"https://reef.infura-ipfs.io/ipfs";

export const networkConfig={
  mainnet:{
    LAUNCHPAD_FACTORY_ADDRESS: "0x66e221c08D94F391346d521d4e3650805bBDfeCa",
    PROXY_CONTRACT_MULTIOWNER: "0x308f2fBcdbc5988756c2173cD383e94151223852"
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

