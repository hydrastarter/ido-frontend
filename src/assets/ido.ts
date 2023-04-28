export type idoType = {
  crowdsaleAddress: string;
  projectTokenAddress: string;
  projectTokenImage: string;
  projectTokenName: string;
  projectTokenSymbol: string;
  projectTokenDecimals: number;
  projectTokenDescription: string;
  isVerified: boolean;

  inputTokenRate: string;
  inputTokens: {
    name: string;
    symbol: string;
    address: string;
    decimals: number;
  }[];

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

  hardcap: string;
  userLimit: string;
  softcap: string;
};

export const idos: idoType[] = [
  {
    crowdsaleAddress: "",
    projectTokenAddress: "",
    projectTokenImage: "https://picsum.photos/id/237/200/300",
    projectTokenDecimals: 18,
    projectTokenName: "Cryption Network",
    projectTokenSymbol: "CNT",
    projectTokenDescription: "",
    isVerified: false,

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

    socialMediaLinks: {
      twitter: "www.twitter.com",
      telegram: "www.telegram.com",
      website: "https://cryption.network/",
      misc: "https://www.auroblocks.com/",
    },

    idoStart: "1682569665",
    idoEnd: "1682853709",
    vestingStart: "1682853709",
    vestingEnd: "1682853729",
    vestingCliff: "1682853719",

    userLimit: "2000",
    hardcap: "10000",
    softcap: "9000",
  },

  {
    crowdsaleAddress: "",
    projectTokenAddress: "",
    projectTokenDecimals: 18,
    projectTokenImage: "https://picsum.photos/id/237/200/300",
    projectTokenName: "Apple",
    projectTokenSymbol: "APPLE",
    projectTokenDescription: "",
    isVerified: true,

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
    inputTokenRate: "3.2",

    socialMediaLinks: {
      twitter: "www.twitter.com",
      telegram: "www.telegram.com",
      website: "https://cryption.network/",
      misc: "https://www.auroblocks.com/",
    },

    idoStart: "1682940109",
    idoEnd: "1683285709",
    vestingStart: "1683285709",
    vestingEnd: "1683285709",
    vestingCliff: "1683285709",

    userLimit: "1000",
    softcap: "1500",
    hardcap: "2000",
  },

  {
    crowdsaleAddress: "",
    projectTokenAddress: "",
    projectTokenDecimals: 6,
    projectTokenImage: "https://picsum.photos/id/237/200/300",
    projectTokenName: "Binance",
    projectTokenSymbol: "BNB",
    projectTokenDescription: "",
    isVerified: true,

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
    inputTokenRate: "5.9",

    socialMediaLinks: {
      twitter: "www.twitter.com",
      telegram: "www.telegram.com",
      website: "https://cryption.network/",
      misc: "https://www.auroblocks.com/",
    },

    idoStart: "1672572109",
    idoEnd: "1673263309",
    vestingStart: "1673263309",
    vestingEnd: "1673263309",
    vestingCliff: "1673263309",

    userLimit: "100000",
    softcap: "800000",
    hardcap: "900000",
  },

  {
    crowdsaleAddress: "",
    projectTokenAddress: "",
    projectTokenDecimals: 18,
    projectTokenImage: "https://picsum.photos/id/237/200/300",
    projectTokenName: "Polkadot",
    projectTokenSymbol: "PLK",
    projectTokenDescription: "",
    isVerified: true,

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

    socialMediaLinks: {
      twitter: "www.twitter.com",
      telegram: "www.telegram.com",
      website: "https://cryption.network/",
      misc: "https://www.auroblocks.com/",
    },

    idoStart: "1682569665",
    idoEnd: "1682853709",
    vestingStart: "1682853709",
    vestingEnd: "1682853729",
    vestingCliff: "1682853719",

    userLimit: "2000",
    softcap: "9000",
    hardcap: "100",
  },

  {
    crowdsaleAddress: "",
    projectTokenAddress: "",
    projectTokenDecimals: 18,
    projectTokenImage: "https://picsum.photos/id/237/200/300",
    projectTokenName: "Ethereum",
    projectTokenSymbol: "ETH",
    projectTokenDescription: "",
    isVerified: false,

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

    socialMediaLinks: {
      twitter: "www.twitter.com",
      telegram: "www.telegram.com",
      website: "https://cryption.network/",
      misc: "https://www.auroblocks.com/",
    },

    idoStart: "1682569665",
    idoEnd: "1682853709",
    vestingStart: "1682853709",
    vestingEnd: "1682853729",
    vestingCliff: "1682853719",

    userLimit: "2000",
    softcap: "9000",
    hardcap: "1000000",
  },
];
