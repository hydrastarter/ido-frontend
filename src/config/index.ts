import { AvailableNetworks, networkConfig } from "../environment";


export const getNetworkConfig = (networkName: AvailableNetworks)=>{
  return networkConfig[networkName];
}
