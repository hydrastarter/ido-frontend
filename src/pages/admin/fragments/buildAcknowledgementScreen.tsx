import React from "react";
import Uik from "@reef-chain/ui-kit";
import { fetchBlockHeight } from "./fetchBlockHeight";

export const buildAcknowledgementPage = (successfullyLaunched: any, txHash: any) => {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <Uik.Text type="headline" className="text-green-500!important text-xl mt-8">
          {successfullyLaunched ? "IDO Created Successfully!" : "IDO Creation Failed"}
        </Uik.Text>
        <Uik.Text type="light">
          {successfullyLaunched ? "Your IDO has been successfully created and is now live on the platform." : "Your IDO couldn't be launched"}
        </Uik.Text>
        <div className="check-tx-btn">
          <Uik.Button
            text="Check Transaction"
            success
            fill
            onClick={async () => {
              const getBlockHeight = await fetchBlockHeight(txHash);
              window.open(
                `https://reefscan.com/extrinsic/${txHash}-${getBlockHeight}`,
                "_blank"
              );
            }
            }
          />
        </div>
      </div>
    );
  };
