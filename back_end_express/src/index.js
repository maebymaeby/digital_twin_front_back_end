var PX2H = require('./calculation.js')
//var T2P = require('./Calculation.js')
function get_output(input, identify) {
    var Gw = input[0]
    var Gw1 = input[1]
    var ti = input[2]
    var pi = input[3]
    var a = identify[0]
    var b = identify[1]
    var a3 = identify[2]
    var c = identify[3]
    var b2 = identify[4]
    var k = identify[5]
    let hc, to, Q, dt, tc, K
    var hs = 2400
    var pc = 0.005
    var pc1 = 0.01
    var i = 0
    while (Math.abs(pc - pc1) > 0.0001 && i < 1000) {
        i += 1
        pc1 = pc;
        hc = PX2H.PX2H(pc1, 0);
        Q = (Math.pow(c * Gw1, 2) + (b2 * Gw1)) * (hs - hc) / 3.6
        //Q =(c * Math.pow(Gw1,2) +b2 *Gw1)* (hs - hc)
        to = ti + 3.6 * Q / 4.187 / Gw;
        K = 1 / (1 / a / Math.pow(Gw, a3) + b);
        dt = Q / K;
        tc = (to - ti) / (Math.exp((to - ti) / dt) - 1) + to;
        pc = PX2H.T2P(tc);
    }
    let tw = tc - 1;
    let po = pi - k * (Gw / 10000 * Gw / 10000);
    var out = []
    out.push(po)
    out.push(to)
    out.push(pc)
    out.push(tw)
    return out
}
module.exports = {
    get_output
}