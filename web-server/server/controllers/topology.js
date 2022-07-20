module.exports = class Topology {
    async getTopology(ip) {
        return fetch(`${ip}:7080/api/v1/siteInformation/topology`)
            .then(response=> response.json())
            .then((jsonResponse)=> {return jsonResponse});
    }
}