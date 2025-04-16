import { ERC20 } from "../../../abis/ERC20";
import { getNetworkConfig } from "../../../config";
import { constants, Contract } from "ethers";
import BigNumber from "bignumber.js";
  
export const approveProjectToken = async (projectTokenAddress:string,setApproveLoading:any,selectedSigner:any,selectedNetwork:any,setAllowance:any) => {
    try {
      setApproveLoading(true);
      if (selectedSigner) {
        const erc20Contract = new Contract(
          projectTokenAddress,
          ERC20,
          selectedSigner.signer
        );
        const approvalTx = await erc20Contract.approve(
          getNetworkConfig(selectedNetwork.name).PROXY_CONTRACT_MULTIOWNER,
          constants.MaxUint256
        );
        await approvalTx.wait();
        const allowanceAmount = await erc20Contract.allowance(
          selectedSigner.evmAddress,
          getNetworkConfig(selectedNetwork.name).PROXY_CONTRACT_MULTIOWNER
        );
        setAllowance(new BigNumber(allowanceAmount.toString()));
      }
      setApproveLoading(false);
    } catch (error) {
      setApproveLoading(false);
      console.error(error);
    }
  };