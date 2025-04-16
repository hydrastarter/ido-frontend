import React from "react";
import Uik from "@reef-chain/ui-kit";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

export const buildTokenDetails = (inputTokenRate:any,setInputTokenRate:any,inputTokens:any,handleBlurInputToken:any,handleInputTokenChange:any,removeInputToken:any,addToken:any,buildButtonsGroup:any,setCurrentPage:any, currentPage:any) => {
    return (
        <>
            <Uik.Text text="Token Details" type="headline" className="small-headline" />
            <Uik.Input
                label="Input token rate"
                type="number"
                key="inputTokenRateField"
                value={inputTokenRate}
                onInput={(e) => setInputTokenRate(e.target.value)}
            />
            {inputTokens.map((eachInputToken:any, index:any) => (
                <div key={`inputToken+${index}`} className="input-token-address">
                    <Uik.Input
                        label="Input token address"
                        key={`inputTokenField+${index}`}
                        value={eachInputToken.tokenAddress}
                        onBlur={() => handleBlurInputToken(index)}
                        onInput={(e) => handleInputTokenChange(e, index)}
                    />
                    {index > 0 && (
                        <span
                            onClick={() => removeInputToken(eachInputToken.key)}
                        >
                            <Uik.Icon icon={faTrashCan} className="delete-icon" />
                        </span>
                    )}
                </div>
            ))}
            <Uik.Button onClick={addToken} fill>Add new token</Uik.Button>
            {buildButtonsGroup(setCurrentPage, currentPage)}
        </>);
}
