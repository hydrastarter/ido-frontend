import React from "react";
import Uik from "@reef-chain/ui-kit";
import { buildButtonsGroup } from "./getBtnsGroup";

export const buildFinalForm = (
    twitterUrl:any,
    setTwitterUrl: any,
    telegramUrl: any,
    setTelegramUrl: any,
    websiteUrl: any,
    setWebsiteUrl: any,
    miscellaneousUrl: any,
    setMiscellaneousUrl: any,
    description: any,
    setDescription: any,
    setCurrentPage: any,
    currentPage: any,
    allowance: any,
    amountOfTokensToSell: any,
    approveLoading: any,
    approveProjectToken: any,
    projectTokenAddress: any,
    setApproveLoading: any,
    selectedSigner: any,
    selectedNetwork: any,
    setAllowance: any,
    disableCreateButton: any,
    isCreatingIDO: any,
    createIdo: any,
    error: any) => {
    return (
      <>
        <Uik.Text text="IDO Details" type="headline" className="small-headline" />
        <Uik.Container>
          <Uik.Input
            label="Twitter Url"
            value={twitterUrl}
            onChange={(e) => setTwitterUrl(e.target.value)}
          />
          <Uik.Input
            label="Telegram Url"
            value={telegramUrl}
            onChange={(e) => setTelegramUrl(e.target.value)}
          />
        </Uik.Container>
        <Uik.Container>
          <Uik.Input
            label="Website Url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
          />
          <Uik.Input
            label="Miscellaneous Url"
            value={miscellaneousUrl}
            onChange={(e) => setMiscellaneousUrl(e.target.value)}
          />
        </Uik.Container>
        <Uik.Input
          label="Description"
          textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {buildButtonsGroup(setCurrentPage, currentPage, false, true)}
        <Uik.Container flow="stretch">
          <Uik.Button
            disabled={allowance.isGreaterThan(amountOfTokensToSell)}
            size="large"
            loading={approveLoading}
            onClick={()=>approveProjectToken(
              projectTokenAddress, setApproveLoading, selectedSigner, selectedNetwork, setAllowance
            )}
          >
            Approve
          </Uik.Button>
          <Uik.Button
            disabled={
              // false
              disableCreateButton ||
              isCreatingIDO ||
              allowance.isLessThan(amountOfTokensToSell)
            }
            onClick={() => createIdo(selectedNetwork.name)}
            size="large"

            fill={!(disableCreateButton ||
              isCreatingIDO ||
              allowance.isLessThan(amountOfTokensToSell))}
            loading={isCreatingIDO}
          >
            {disableCreateButton ||
              isCreatingIDO ||
              allowance.isLessThan(amountOfTokensToSell) ? error : "Create IDO"}
          </Uik.Button>

        </Uik.Container>
      </>
    )
  }