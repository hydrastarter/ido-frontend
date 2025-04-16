import React from "react";
import Uik from "@reef-chain/ui-kit";
import { buildButtonsGroup } from "./getBtnsGroup";
import { formatUTC } from "./formatUtc";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const buildVestingDetails = (
  vestingStartTimeInUTC: any,
  setVestingStartTimeInUTC: any,
  vestingEndTimeInUTC: any,
  setVestingEndTimeInUTC: any,
  enableCliffPeriod: any,
  setEnableCliffPeriod: any,
  cliffPeriodInUTC: any,
  setCliffPeriodInUTC: any,
  setCurrentPage: any,
  currentPage: any) => {
    return (<>
      <Uik.Text text="Vesting Details" type="headline" className="small-headline" />
      <Uik.Container>
        <DatePicker
          selected={formatUTC(vestingStartTimeInUTC, true)}
          wrapperClassName="display-flex"
          showTimeSelect
          minDate={new Date(Date.now())}
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="dd/MM/yyyy HH:mm"
          onChange={(date: Date) =>
            setVestingStartTimeInUTC(() => formatUTC(date))
          }
          customInput={<Uik.Input label="Vesting start time" />}
        />

        <DatePicker
          selected={formatUTC(vestingEndTimeInUTC, true)}
          wrapperClassName="display-flex"
          showTimeSelect
          minDate={new Date(Date.now())}
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="dd/MM/yyyy HH:mm"
          onChange={(date: Date) =>
            setVestingEndTimeInUTC(() => formatUTC(date))
          }
          customInput={<Uik.Input label="Vesting end time" />}
        />
      </Uik.Container>

      <Uik.Container>
        <Uik.Toggle
          label="Enable Cliff Period"
          onText="Enabled"
          offText="No Cliff Period"
          value={enableCliffPeriod}
          onChange={() => setEnableCliffPeriod(!enableCliffPeriod)}
        />
        {enableCliffPeriod && (
          <DatePicker
            selected={formatUTC(cliffPeriodInUTC, true)}
            wrapperClassName="display-flex"
            showTimeSelect
            minDate={new Date(Date.now())}
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="dd/MM/yyyy HH:mm"
            onChange={(date: Date) =>
              setCliffPeriodInUTC(() => formatUTC(date))
            }
            customInput={<Uik.Input label="Cliff period" />}
          />
        )}

      </Uik.Container>
      {buildButtonsGroup(setCurrentPage, currentPage,)}
    </>);
  }
