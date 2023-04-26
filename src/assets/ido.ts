export type idoType = {
  projectTokenAddress: string;
  inputTokens: {
    name: string;
    symbol: string;
    address: string;
    decimals: number;
  }[];
  inputTokenRate: string;
  image: string;
  name: string;
  symbol: string;
  hardcap: string;
  socialMediaLinks: {
    twitter: string;
    telegram: string;
    website: string;
    misc: string;
  };
  idoStart: string;
  idoEnd: string;
  vestingStart: string;
  vestingEnd: string;
  vestingCliff: string;
  userLimit: string;
  softcap: string;
  rate: string;
};

export const idos: idoType[] = [
  {
    projectTokenAddress: "",
    inputTokens: [
      {
        name: "USD Coin",
        symbol: "USDC",
        address: "",
        decimals: 6,
      },
      {
        name: "USDT coin",
        symbol: "USDT",
        address: "",
        decimals: 8,
      },
      {
        name: "DAI coin",
        symbol: "DAI",
        address: "",
        decimals: 8,
      },
      {
        name: "BUSD coin",
        symbol: "BUSD",
        address: "",
        decimals: 8,
      },
    ],
    inputTokenRate: "1.2",
    image: "https://picsum.photos/id/237/200/300",
    name: "Cryption Network",
    symbol: "CNT",
    hardcap: "10000",
    socialMediaLinks: {
      twitter: "www.twitter.com",
      telegram: "www.telegram.com",
      website: "https://cryption.network/",
      misc: "https://www.auroblocks.com/",
    },
    idoStart: "",
    idoEnd: "",
    vestingStart: "",
    vestingEnd: "",
    vestingCliff: "",
    userLimit: "",
    softcap: "",
    rate: "",
  },

  {
    projectTokenAddress: "",
    inputTokens: [
      {
        name: "DAI coin",
        symbol: "DAI",
        address: "",
        decimals: 8,
      },
      {
        name: "BUSD coin",
        symbol: "BUSD",
        address: "",
        decimals: 8,
      },
    ],
    inputTokenRate: "1.2",
    image: "https://picsum.photos/id/237/200/300",
    name: "Apple",
    symbol: "APPLE",
    hardcap: "2000",
    socialMediaLinks: {
      twitter: "www.twitter.com",
      telegram: "www.telegram.com",
      website: "https://cryption.network/",
      misc: "https://www.auroblocks.com/",
    },
    idoStart: "",
    idoEnd: "",
    vestingStart: "",
    vestingEnd: "",
    vestingCliff: "",
    userLimit: "",
    softcap: "",
    rate: "",
  },

  {
    projectTokenAddress: "",
    inputTokens: [
      {
        name: "DAI coin",
        symbol: "DAI",
        address: "",
        decimals: 8,
      },
      {
        name: "BUSD coin",
        symbol: "BUSD",
        address: "",
        decimals: 8,
      },
    ],
    inputTokenRate: "1.2",
    image: "https://picsum.photos/id/237/200/300",
    name: "Binance",
    symbol: "BNB",
    hardcap: "900000",
    socialMediaLinks: {
      twitter: "www.twitter.com",
      telegram: "www.telegram.com",
      website: "https://cryption.network/",
      misc: "https://www.auroblocks.com/",
    },
    idoStart: "",
    idoEnd: "",
    vestingStart: "",
    vestingEnd: "",
    vestingCliff: "",
    userLimit: "",
    softcap: "",
    rate: "",
  },

  {
    projectTokenAddress: "",
    inputTokens: [
      {
        name: "DAI coin",
        symbol: "DAI",
        address: "",
        decimals: 8,
      },
      {
        name: "BUSD coin",
        symbol: "BUSD",
        address: "",
        decimals: 8,
      },
    ],
    inputTokenRate: "1.2",
    image: "https://picsum.photos/id/237/200/300",
    name: "Polkadot",
    symbol: "PLK",
    hardcap: "100",
    socialMediaLinks: {
      twitter: "www.twitter.com",
      telegram: "www.telegram.com",
      website: "https://cryption.network/",
      misc: "https://www.auroblocks.com/",
    },
    idoStart: "",
    idoEnd: "",
    vestingStart: "",
    vestingEnd: "",
    vestingCliff: "",
    userLimit: "",
    softcap: "",
    rate: "",
  },

  {
    projectTokenAddress: "",
    inputTokens: [
      {
        name: "DAI coin",
        symbol: "DAI",
        address: "",
        decimals: 8,
      },
      {
        name: "BUSD coin",
        symbol: "BUSD",
        address: "",
        decimals: 8,
      },
    ],
    inputTokenRate: "1.2",
    image: "https://picsum.photos/id/237/200/300",
    name: "Ethereum",
    symbol: "ETH",
    hardcap: "1000000",
    socialMediaLinks: {
      twitter: "www.twitter.com",
      telegram: "www.telegram.com",
      website: "https://cryption.network/",
      misc: "https://www.auroblocks.com/",
    },
    idoStart: "",
    idoEnd: "",
    vestingStart: "",
    vestingEnd: "",
    vestingCliff: "",
    userLimit: "",
    softcap: "",
    rate: "",
  },
];
