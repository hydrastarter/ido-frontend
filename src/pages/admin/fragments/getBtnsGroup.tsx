import React from "react";
import Uik from "@reef-chain/ui-kit";

export const buildButtonsGroup = (setCurrentPage:any,currentPage:any,isOnlyNext?: boolean, isOnlyPrev?: boolean) => {
    if (isOnlyNext) {
      return (
        <Uik.Button onClick={() => setCurrentPage(currentPage + 1)} text="Next" className="navigation-btns-next margin-top-10 margin-left-10" />
      );
    } else if (isOnlyPrev) {
      return (
        <Uik.Button onClick={() => setCurrentPage(currentPage - 1)} text="Previous" className="navigation-btns-next margin-top-10 margin-left-10" />
      );
    }
    else {
      return (<>
        <div className="navigation-btns-group">

          <Uik.Button onClick={() => setCurrentPage(currentPage - 1)} text="Previous" className="navigation-btns-prev" />

          <Uik.Button onClick={() => setCurrentPage(currentPage + 1)} text="Next" fill className="navigation-btns-next" />


        </div>
      </>)
    }
  }