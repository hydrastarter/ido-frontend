export const bulkUpload = (results: any,setEnableWhitelisting:any,setWhitelistedAddress:any) => {
    if (results && results.data && results.data.length > 0) {
      const importData: any[] = [];
      results.data.slice(1).forEach((eachUser: any) => {
        if (eachUser[0].length > 0) {
          importData.push(eachUser[0]);
        }
      });
      setEnableWhitelisting(() => true);
      setWhitelistedAddress(() => importData.join());
    }
  };