import { AvailableNetworks } from "@reef-defi/react-lib";
import { networkConfig } from "../environment";


export const getNetworkConfig = (networkName: AvailableNetworks)=>{
  return networkConfig[networkName];
}
