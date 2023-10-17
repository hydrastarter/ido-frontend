export type idoType = {
  id: string;
  crowdsaleAddress: string;
  tokenName: string;

  tokenSymbol: string;
  tokenDecimals: number;
  tokenAddress: string;
  tokenImageUrl: string;

  description: string;
  isVerified: boolean;

  inputTokenRate: string;
  inputTokens: {
    inputTokenName: string;
    inputTokenSymbol: string;
    inputTokenAddress: string;
    inputTokenDecimals: number;
  }[];

  twitterUrl: string;
  telegramUrl: string;
  websiteUrl: string;
  miscellaneousUrl: string;

  crowdsaleStartTime: string;
  crowdsaleEndTime: string;
  vestingStart: string;
  vestingEnd: string;
  cliffDuration: string;

  crowdsaleTokenAllocated: string;
  maxUserAllocation: string;
  minimumTokenSaleAmount: string;
};
export type inputTokenType = {
  inputTokenName: string;
  inputTokenSymbol: string;
  inputTokenAddress: string;
  inputTokenDecimals: number;
};
export const idos: idoType[] = [
  {
    id: "",
    crowdsaleAddress: "",
    tokenAddress: "",
    tokenImageUrl: "https://picsum.photos/id/237/200/300",
    tokenDecimals: 18,
    tokenName: "Cryption Network",
    tokenSymbol: "CNT",
    description: "",
    isVerified: false,

    inputTokens: [
      {
        inputTokenName: "USD Coin",
        inputTokenSymbol: "USDC",
        inputTokenAddress: "",
        inputTokenDecimals: 6,
      },
      {
        inputTokenName: "USDT coin",
        inputTokenSymbol: "USDT",
        inputTokenAddress: "",
        inputTokenDecimals: 8,
      },
      {
        inputTokenName: "DAI coin",
        inputTokenSymbol: "DAI",
        inputTokenAddress: "",
        inputTokenDecimals: 8,
      },
      {
        inputTokenName: "BUSD coin",
        inputTokenSymbol: "BUSD",
        inputTokenAddress: "",
        inputTokenDecimals: 8,
      },
    ],
    inputTokenRate: "1.2",

    twitterUrl: "www.twitter.com",
    telegramUrl: "www.telegram.com",
    websiteUrl: "https://cryption.network/",
    miscellaneousUrl: "https://www.auroblocks.com/",

    crowdsaleStartTime: "1682569665",
    crowdsaleEndTime: "1682853709",
    vestingStart: "1682853709",
    vestingEnd: "1682853729",
    cliffDuration: "1682853719",

    maxUserAllocation: "2000",
    crowdsaleTokenAllocated: "10000",
    minimumTokenSaleAmount: "9000",
  },

  {
    id: "",
    crowdsaleAddress: "",
    tokenAddress: "",
    tokenDecimals: 18,
    tokenImageUrl: "https://picsum.photos/id/237/200/300",
    tokenName: "Apple",
    tokenSymbol: "APPLE",
    description: "",
    isVerified: true,

    inputTokens: [
      {
        inputTokenName: "DAI coin",
        inputTokenSymbol: "DAI",
        inputTokenAddress: "",
        inputTokenDecimals: 8,
      },
      {
        inputTokenName: "BUSD coin",
        inputTokenSymbol: "BUSD",
        inputTokenAddress: "",
        inputTokenDecimals: 8,
      },
    ],
    inputTokenRate: "3.2",

    twitterUrl: "www.twitter.com",
    telegramUrl: "www.telegram.com",
    websiteUrl: "https://cryption.network/",
    miscellaneousUrl: "https://www.auroblocks.com/",

    crowdsaleStartTime: "1682940109",
    crowdsaleEndTime: "1683285709",
    vestingStart: "1683285709",
    vestingEnd: "1683285709",
    cliffDuration: "1683285709",

    maxUserAllocation: "1000",
    minimumTokenSaleAmount: "1500",
    crowdsaleTokenAllocated: "2000",
  },

  {
    id: "",
    crowdsaleAddress: "",
    tokenAddress: "",
    tokenDecimals: 6,
    tokenImageUrl: "https://picsum.photos/id/237/200/300",
    tokenName: "Binance",
    tokenSymbol: "BNB",
    description: "",
    isVerified: true,

    inputTokens: [
      {
        inputTokenName: "DAI coin",
        inputTokenSymbol: "DAI",
        inputTokenAddress: "",
        inputTokenDecimals: 8,
      },
      {
        inputTokenName: "BUSD coin",
        inputTokenSymbol: "BUSD",
        inputTokenAddress: "",
        inputTokenDecimals: 8,
      },
    ],
    inputTokenRate: "5.9",

    twitterUrl: "www.twitter.com",
    telegramUrl: "www.telegram.com",
    websiteUrl: "https://cryption.network/",
    miscellaneousUrl: "https://www.auroblocks.com/",

    crowdsaleStartTime: "1672572109",
    crowdsaleEndTime: "1673263309",
    vestingStart: "1673263309",
    vestingEnd: "1673263309",
    cliffDuration: "1673263309",

    maxUserAllocation: "100000",
    minimumTokenSaleAmount: "800000",
    crowdsaleTokenAllocated: "900000",
  },

  {
    id: "",
    crowdsaleAddress: "",
    tokenAddress: "",
    tokenDecimals: 18,
    tokenImageUrl: "https://picsum.photos/id/237/200/300",
    tokenName: "Polkadot",
    tokenSymbol: "PLK",
    description: "",
    isVerified: true,

    inputTokens: [
      {
        inputTokenName: "DAI coin",
        inputTokenSymbol: "DAI",
        inputTokenAddress: "",
        inputTokenDecimals: 8,
      },
      {
        inputTokenName: "BUSD coin",
        inputTokenSymbol: "BUSD",
        inputTokenAddress: "",
        inputTokenDecimals: 8,
      },
    ],
    inputTokenRate: "1.2",

    twitterUrl: "www.twitter.com",
    telegramUrl: "www.telegram.com",
    websiteUrl: "https://cryption.network/",
    miscellaneousUrl: "https://www.auroblocks.com/",

    crowdsaleStartTime: "1682569665",
    crowdsaleEndTime: "1682853709",
    vestingStart: "1682853709",
    vestingEnd: "1682853729",
    cliffDuration: "1682853719",

    maxUserAllocation: "2000",
    minimumTokenSaleAmount: "9000",
    crowdsaleTokenAllocated: "100",
  },

  {
    id: "",
    crowdsaleAddress: "",
    tokenAddress: "",
    tokenDecimals: 18,
    tokenImageUrl: "https://picsum.photos/id/237/200/300",
    tokenName: "Ethereum",
    tokenSymbol: "ETH",
    description: "",
    isVerified: false,

    inputTokens: [
      {
        inputTokenName: "DAI coin",
        inputTokenSymbol: "DAI",
        inputTokenAddress: "",
        inputTokenDecimals: 8,
      },
      {
        inputTokenName: "BUSD coin",
        inputTokenSymbol: "BUSD",
        inputTokenAddress: "",
        inputTokenDecimals: 8,
      },
    ],
    inputTokenRate: "1.2",

    twitterUrl: "www.twitter.com",
    telegramUrl: "www.telegram.com",
    websiteUrl: "https://cryption.network/",
    miscellaneousUrl: "https://www.auroblocks.com/",

    crowdsaleStartTime: "1682569665",
    crowdsaleEndTime: "1682853709",
    vestingStart: "1682853709",
    vestingEnd: "1682853729",
    cliffDuration: "1682853719",

    maxUserAllocation: "2000",
    minimumTokenSaleAmount: "9000",
    crowdsaleTokenAllocated: "1000000",
  },
];
