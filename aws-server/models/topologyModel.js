/**
 * Model of the curent networks topology.
 * @param {Site} current site information about the current node.
 * @param {Array<Site>} current site information about the current node.
 */
class Topology {
    constructor (topologyData) {
        this.current = topologyData.current;
        this.neighbours = topologyData.neighbours
    }
}

module.exports = {
    Topology: Topology
}