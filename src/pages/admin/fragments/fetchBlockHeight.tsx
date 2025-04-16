
const endpoint = 'https://squid.subsquid.io/reef-explorer/graphql';

export async function fetchBlockHeight(txHash:any) {
  try {
    const query = `
  query FetchBlockHeight {
    transfers(limit: 1, where: {AND: {extrinsicHash_eq: "${txHash}"}}, orderBy: blockHeight_DESC) {
      extrinsicId
    }
  }
  `;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
      }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error('Error fetching data:', data.errors);
      return null;
    }

    const extrinsicId = data.data.transfers[0]?.extrinsicId;

    if (extrinsicId) {
      const blockHeightHex = extrinsicId.split("-")[1]
      return blockHeightHex;
    } else {
      console.error('No blockHeight data found');
      return null;
    }
  } catch (error) {
    console.error('Request failed', error);
    return null;
  }
}
