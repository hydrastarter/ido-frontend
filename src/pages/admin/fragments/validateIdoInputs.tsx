import { isValidURL } from "./isUrl";

export function validateIDOInputs(
    projectTokenAddress: string,
    inputTokens: { tokenAddress: string }[],
    amountOfTokensToSell: string | number,
    startTimeInUTC: any,
    endTimeInUTC: any,
    softcap: string | number,
    projectTokenImage: { ipfsImgUrl: string },
    twitterUrl: string,
    telegramUrl: string,
    websiteUrl: string,
    miscellaneousUrl: string
  ): string {
    if (!projectTokenAddress || projectTokenAddress.length === 0) {
      return "Project token address is required.";
    } else if (!inputTokens || inputTokens.length === 0) {
      return "At least one input token is required.";
    } else if (!inputTokens[0].tokenAddress || inputTokens[0].tokenAddress.length === 0) {
      return "Token address for the input token is required.";
    } else if (amountOfTokensToSell.toString().length === 0) {
      return "Amount of tokens to sell is required.";
    } else if (startTimeInUTC >= endTimeInUTC) {
      return "Start time must be earlier than end time.";
    } else if (parseFloat(amountOfTokensToSell.toString()) <= 0) {
      return "Amount of tokens to sell must be greater than zero.";
    } else if (
      parseFloat(amountOfTokensToSell.toString()) <= parseFloat(softcap.toString())
    ) {
      return "Amount of tokens to sell must be greater than the softcap.";
    } else if (!projectTokenImage.ipfsImgUrl || projectTokenImage.ipfsImgUrl.length === 0) {
      return "Project token image URL cannot be empty.";
    } else if (!isValidURL(twitterUrl)) {
      return "Please provide a valid Twitter URL.";
    } else if (!isValidURL(telegramUrl)) {
      return "Please provide a valid Telegram URL.";
    } else if (!isValidURL(websiteUrl)) {
      return "Please provide a valid Website URL.";
    } else if (!isValidURL(miscellaneousUrl)) {
      return "Please provide a valid Miscellaneous URL.";
    }
  
    return "";
  }
  