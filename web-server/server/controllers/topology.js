module.exports = class topology {
    async getTopology(ip) {
        return fetch('localhost:7080/api/v1/siteInformation/topology')
            .then(response=> response.json())
            .then((jsonResponse)=> {return jsonResponse});
    }
}