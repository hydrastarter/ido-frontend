import React from "react";
import Uik from "@reef-chain/ui-kit";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatUTC } from "./formatUtc";
import {
    formatFileSize,
    useCSVReader,
  } from "react-papaparse";
import { CSVStyles, DEFAULT_REMOVE_HOVER_COLOR, REMOVE_HOVER_COLOR_LIGHT } from "./constantStyles";
import { buildButtonsGroup } from "./getBtnsGroup";

export const buildTokenSaleDetails = (startTimeInUTC: any,
    setStartTimeInUTC: any,
    endTimeInUTC: any,
    setEndTimeInUTC: any,
    amountOfTokensToSell: any,
    setAmountOfTokensToSell: any,
    softcap: any,
    setSoftcap: any,
    maxUserAllocation: any,
    setMaxUserAllocation: any,
    enableWhitelisting: any,
    setEnableWhitelisting: any,
    whitelistedAddresses: any,
    setWhitelistedAddress: any,
    bulkUpload: any,
    setZoneHover: any,
    setRemoveHoverColor: any,
    removeHoverColor: any,
    setCurrentPage: any,
    currentPage: any,
    zoneHover: any) => {
    const { CSVReader } = useCSVReader();
    
    return (<>
        <Uik.Text text="Sale Details" type="headline" className="small-headline" />
        <Uik.Container>
            <DatePicker
                selected={formatUTC(startTimeInUTC, true)}
                wrapperClassName="display-flex"
                showTimeSelect
                minDate={new Date(Date.now())}
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                onChange={(date: Date) => setStartTimeInUTC(() => formatUTC(date))}
                customInput={<Uik.Input label="Start time" />}
            />

            <DatePicker
                selected={formatUTC(endTimeInUTC, true)}
                wrapperClassName="display-flex"
                showTimeSelect
                minDate={new Date(Date.now())}
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                onChange={(date: Date) => setEndTimeInUTC(() => formatUTC(date))}
                customInput={<Uik.Input label="End time" />}
            />
        </Uik.Container>

        <div className="amount-to-sell">
            <Uik.Input
                type="number"
                label="Hardcap ( Maximum amount to sell )"
                value={amountOfTokensToSell}
                onChange={(e) => setAmountOfTokensToSell(e.target.value)}
                className="margin-right-10"
            />

            <Uik.Input
                type="number"
                label="Softcap"
                value={softcap}
                onChange={(e) => setSoftcap(e.target.value)}
            />

        </div>

        <Uik.Input
            type="number"
            label="Max user allocation"
            value={maxUserAllocation}
            onChange={(e) => setMaxUserAllocation(e.target.value)}
        />

        <Uik.Toggle
            label="Enable Whitelisting"
            onText="Enabled whitelisted addresses"
            offText="No addresses whitelisted"
            value={enableWhitelisting}
            onChange={() => setEnableWhitelisting(!enableWhitelisting)}
        />
        {enableWhitelisting && (
            <>
                <Uik.Input
                    value={whitelistedAddresses}
                    onChange={(e) => setWhitelistedAddress(e.target.value)}
                    label="Enter addresses to whitelist"
                    textarea
                />

                <CSVReader
                    onUploadAccepted={(results: any) => {
                        bulkUpload(results);
                    }}
                    onDragOver={(event: DragEvent) => {
                        event.preventDefault();
                        setZoneHover(true);
                    }}
                    onDragLeave={(event: DragEvent) => {
                        event.preventDefault();
                        setZoneHover(false);
                    }}
                >
                    {({
                        getRootProps,
                        acceptedFile,
                        ProgressBar,
                        getRemoveFileProps,
                        Remove,
                    }: any) => (
                        <>
                            <div
                                // eslint-disable-next-line react/jsx-props-no-spreading
                                {...getRootProps()}
                                className="upload-container"
                                style={{
                                    ...(zoneHover && CSVStyles.zoneHover),
                                }}
                            >
                                {acceptedFile ? (
                                    <>
                                        <div className="file-container">
                                            <div>
                                                <Uik.Text>
                                                    {formatFileSize(acceptedFile.size)}
                                                </Uik.Text>
                                                <Uik.Text>{acceptedFile.name}</Uik.Text>
                                            </div>
                                            <div className="progress-bar">
                                                <ProgressBar />
                                            </div>
                                            {/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */}
                                            <div
                                                // eslint-disable-next-line react/jsx-props-no-spreading
                                                {...getRemoveFileProps()}
                                                // className="CSVStyles-remove"
                                                onMouseOver={(event: Event) => {
                                                    event.preventDefault();
                                                    setRemoveHoverColor(REMOVE_HOVER_COLOR_LIGHT);
                                                }}
                                                onMouseOut={(event: Event) => {
                                                    event.preventDefault();
                                                    setRemoveHoverColor(DEFAULT_REMOVE_HOVER_COLOR);
                                                }}
                                            >
                                                <Remove color={removeHoverColor} />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    "Drop CSV file here or click to upload"
                                )}
                            </div>
                        </>
                    )}
                </CSVReader>
                <Uik.Container className="csv-footer">
                    <Uik.Text type="mini">Accepted: CSV / Excel</Uik.Text>
                    <Uik.Text type="mini">
                        <a href="/files/whitelist.csv">Get Example</a>
                    </Uik.Text>
                </Uik.Container>
            </>
        )}
        {buildButtonsGroup(setCurrentPage, currentPage,)}
    </>);

}