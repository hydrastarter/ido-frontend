import axios from "axios";

const homeService = {

/** common header */
    headerConfig: {
        headers: {
            "Authorization": "Basic YWRtaW5Vc2VyOnBhc3N3b3Jk",
            "Content-Type": 'application/json'
        }
    },

    /** Get API for Crowdsale for slider */

    CrowdSale: function () {

        let url = 'https://reef-ido.cryption.network/crowdsale'
        return axios.get(url, this.headerConfig).then((data) => {
            return data
        })

    },

/** token detail page API */

    CrowdSaleID: function (id) {

        let url = `https://reef-ido.cryption.network/crowdsale/${id}`
        return axios.get(url, this.headerConfig).then((data) => {
            return data
        })

    },

    /** CMS API for detail page */

    hydraStarterCMS: function (id) {

        // let url = `http://154.41.254.185:9102/items/api_hydrastarter?filter[token_id][_eq]=${id}`
        let url = `https://cmsapi.choiceindia.com/items/images?filter[token_id][_eq]=${id}`
        return axios.get(url).then((data) => {
            return data
        })
    },

    /** filter for cms API */
    
    hydraStarterCMSFiles: function (id) {
        // let url =`http://154.41.254.185:9102/items/api_hydrastarter_files?filter[api_hydrastarter_id][_eq]=${id.file_id}`
        let url = `https://cmsapi.choiceindia.com/items/images_files?filter[images_id][_eq]=${id.file_id}`
        return axios.get(url).then((data) => {
            return data
        })
    },

}
export default homeService