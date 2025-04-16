import React from "react";
import Uik from "@reef-chain/ui-kit";
import {handleFileUpload} from './handleFileUpload';
import { buildButtonsGroup } from "./getBtnsGroup";

export const getTokenDetails = (
    projectTokenImage:any,
    projectTokenDetails:any,
    projectTokenAddress:any,
    setProjectTokenAddress:any,
    checkAllowance:any,
    setProjectTokenImage:any,
    setCurrentPage:any,
    currentPage:any
) => {
    return (
        <Uik.Container className="align-top token-details card-create-ido">
            <div className="token-details-placeholder">
                <div style={{ position: "relative" }}>
                    {projectTokenImage.previewImgUrl ? (
                        <img
                            src={projectTokenImage.previewImgUrl}
                            alt="project token"
                            style={{
                                marginBottom: "10px",
                                width: "175px",
                                height: "175px",
                                objectFit: "cover",
                                borderRadius: "50%",
                            }}
                        />

                    ) : (
                        <div className="empty-image"></div>
                    )}

                    <div
                        className="project-details"
                    >
                        {projectTokenDetails.name ? (
                            <Uik.Text type="headline" text={projectTokenDetails.name} className="font20 margin10" />
                        ) : (
                            <Uik.Text text={`TOKEN NAME`} type="light" />
                        )}
                        {projectTokenDetails.symbol ? (
                            <Uik.Text text={`( ${projectTokenDetails.symbol} )`} type="light" />
                        ) : (
                            <Uik.Text text={`( TOKEN SYMBOL )`} type="light" className="text-sm" />
                        )}
                        {projectTokenDetails.decimals ? (
                            <Uik.Text text={`${projectTokenDetails.decimals} Decimals`} type="lead" className="text-center" />
                        ) : (
                            <Uik.Text text={`DECIMALS`} type="light" className="text-sm" />
                        )}
                    </div>
                </div>
            </div>

            <div style={{ flex: 2 }}>
                <Uik.Input
                    placeholder="Project token address"
                    value={projectTokenAddress}
                    onInput={(e) => setProjectTokenAddress(e.target.value)}
                    onBlur={checkAllowance}
                />
                <div className="buttons-group">
                    <label className="uik-button uik-button--fill" style={{ marginTop: "20px", flex: 1 }}>
                        <input
                            type="file"
                            hidden
                            disabled={projectTokenImage.uploadingFile}
                            onChange={(e) => {
                                handleFileUpload(e, setProjectTokenImage, projectTokenImage);
                            }}
                        />
                        {projectTokenImage.uploadingFile ? "Uploading..." : "Upload token image"}
                    </label>
                    {projectTokenAddress && projectTokenAddress.length == 42 && currentPage == 0 && buildButtonsGroup(setCurrentPage,currentPage,true)}
                </div>
            </div>
        </Uik.Container>
    );
};