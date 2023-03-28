var g = []
var data = []
var data_increase = {}

function PSOs(time, size, low, up, v_low, v_high) {
    // 初始化
    time = time // 迭代的代数
    size = size // 种群大小
    var bound = new Array(); // 变量的约束范围
    bound[0] = new Array();
    bound[1] = new Array();
    for (var i = 0; i < low.length; i++) {
        bound[0][i] = low[i]
        bound[1][i] = up[i]
    }
    var x = new Array();
    var v = new Array();
    var p_best = new Array();
    var g_best = new Array();
    var p = new Array();
    //初始化点的位置 很重要

    for (var i = 0; i < size; i++) {
        x[i] = new Array();
        v[i] = new Array();
        p_best[i] = new Array();
        p[i] = 100000
        for (var j = 0; j < low.length; j++) {
            x[i][j] = (Math.random() * (bound[1][j] - bound[0][j])) + bound[0][j];
        }
        for (var j = 0; j < low.length; j++) {
            v[i][j] = (Math.random() * (v_high[j] - v_low[j])) + v_low[j];
        }
        for (var j = 0; j < low.length; j++) {
            p_best[i][j] = x[i][j]
        }
    }
    for (var j = 0; j < low.length; j++) {
        g_best[j] = (Math.random() * (bound[1][j] - bound[0][j])) + bound[0][j];
    }

    //初始化第0代初始全局最优解
    var temp = 100000
    for (var i = 0; i < size; i++) {
        p[i] = fitness(p_best[i])['all_loss_rate']
        // 做出修改
        if (p[i] < temp) {
            g_best = deepClone(p_best[i])
            temp = p[i]
        }
    }
    return {
        x,
        v,
        p_best,
        p,
        g_best,
        bound
    }
}

async function PSOs_Increase(time, size, low, up, v_low, v_high) {
    // 初始化
    time = time // 迭代的代数
    size = size // 种群大小
    var bound = new Array(); // 变量的约束范围
    bound[0] = new Array();
    bound[1] = new Array();
    for (var i = 0; i < low.length; i++) {
        bound[0][i] = low[i]
        bound[1][i] = up[i]
    }
    var x = new Array();
    var v = new Array();
    var p_best = new Array();
    var g_best = new Array();
    var p = new Array();
    //初始化点的位置 很重要

    for (var i = 0; i < size; i++) {
        x[i] = new Array();
        v[i] = new Array();
        p_best[i] = new Array();
        p[i] = 100000
        for (var j = 0; j < low.length; j++) {
            x[i][j] = (Math.random() * (bound[1][j] - bound[0][j])) + bound[0][j];
        }
        for (var j = 0; j < low.length; j++) {
            v[i][j] = (Math.random() * (v_high[j] - v_low[j])) + v_low[j];
        }
        for (var j = 0; j < low.length; j++) {
            p_best[i][j] = x[i][j]
        }
    }
    for (var j = 0; j < low.length; j++) {
        g_best[j] = (Math.random() * (bound[1][j] - bound[0][j])) + bound[0][j];
    }

    //初始化第0代初始全局最优解
    var temp = 100000
    for (var i = 0; i < size; i++) {
        p[i] = fitness(p_best[i])['all_loss_rate']
        // 做出修改
        if (p[i] < temp) {
            g_best = deepClone(p_best[i])
            temp = p[i]
        }
    }
    var s = []
    fs.readFile('./' + data['id'] + '_result.txt', 'utf-8', function (err, datas) {
        if (err) {
            return console.log('读取失败', err)
        }
        s = datas
    })
    await wait(5000);
    s = s.split(' ')
    var identify = []
    for (var i = 0; i < s.length; i++)
        identify.push(Number(s[i]))
    //初始化 identify，做增量学习
    for (var i = 0; i < low.length; i++) {
        x[0][i] = identify[i]
    }
    return {
        x,
        v,
        p_best,
        p,
        g_best,
        bound
    }
}

function get_v(low, high) {
    var v_high = []
    var v_low = []
    for (var i = 0; i < low.length; i++) {
        v_high[i] = 0
        v_low[i] = 0
    }
    for (var i = 0; i < low.length; i++) {
        v_high[i] = high[i] / 8
        v_low[i] -= high[i] / 8
    }
    return {
        v_low,
        v_high
    }
}

function cac_test(identify) {
    //个体适应值计算
    var calculate_output = []
    var N = 0
    var leng = parseInt(data['input'].length * 0.9)
    var test_leng = data['input'].length - leng
    var true_output = []
    for (var i = leng; i < data['input'].length; i++) {
        var tmp = g.get_output(data['input'][i], identify)
        calculate_output.push(tmp)
        true_output.push(data['output'][i])
        N += 1
    }

    var loss = []
    var loss_rate = []
    var std = []
    var aic = []
    var mean_value = []
    var loss_rate2 = []
    var maes = []
    var rmses = []
    for (var i = 0; i < data['output'][0].length; i++) {
        loss.push(0)
        loss_rate.push(0)
        std.push(0)
        mean_value.push(0)
        loss_rate2.push(0)
        aic.push(0)
        maes.push(0)
        rmses.push(0)
    }
    var num = 0
    var flag = 0
    for (var i = 0; i < test_leng; i++) {
        for (var kk = 0; kk < calculate_output[0].length; kk++) {
            if (isNaN(calculate_output[i][kk])) {
                calculate_output[i][kk] = 0
            }
        }
        for (var j = 0; j < calculate_output[0].length; j++) {
            std[j] += Math.pow(Math.abs(true_output[i][j] - calculate_output[i][j]), 2)
            loss[j] += Math.abs(true_output[i][j] - calculate_output[i][j])
            var tmp_loss = Math.abs(true_output[i][j] - calculate_output[i][j])
            mean_value[j] += true_output[i][j]
            loss_rate[j] += tmp_loss / Math.abs(true_output[i][j])
            maes[j] += Math.abs(true_output[i][j] - calculate_output[i][j])
            rmses[j] += Math.pow(true_output[i][j] - calculate_output[i][j], 2)
        }
        num += 1
    }
    var all_loss_rate = 0
    var deCount = num
    var count = data['output'][0].length
    for (var j = 0; j < calculate_output[0].length; j++) {
        std[j] /= num
        std[j] = Math.pow(std[j], 0.5)
        aic[j] = Math.log(Math.pow(std[j], 2)) + 2 * (data['output'][0].length + 1) / num
        loss[j] /= num
        loss_rate[j] /= num
        mean_value[j] /= num
        loss_rate2[j] = loss[j] / mean_value[j]
        maes[j] = maes[j] / mean_value[j]
        rmses[j] = rmses[j] / mean_value[j]
        all_loss_rate += loss_rate[j]
    }
    //F
    var data_tmp = []
    for (var i = leng; i < data['input'].length; i++) {
        data_tmp.push(data['output'][i])
    }
    var R2 = cac_r2(calculate_output, data_tmp)
    console.log(R2)
    var F = []
    for (var i = 0; i < calculate_output[0].length; i++) {
        F.push((R2[i] / deCount) / ((1 - R2[i]) / (count - deCount - 1)))
    }
    var s = 0
    for (var i = 0; i < calculate_output.length; i++) {
        //calculate_output.push(tmp)
        for (var j = 0; j < calculate_output[0].length; j++) {
            s += String(calculate_output[i][j])
            s += ' '
        }
        for (var j = 0; j < calculate_output[0].length; j++) {
            s += s = String(data_tmp[i][j])
            s += ' '
        }
        s += '\n'
    }
    return {
        all_loss_rate,
        loss,
        loss_rate,
        loss_rate2,
        F,
        std,
        aic,
        R2,
        true_output,
        calculate_output,
        maes,
        rmses
    }
}

function fitness(identify) {
    //个体适应值计算
    var calculate_output = []
    var N = 0
    var leng = parseInt(data['input'].length * 0.9)
    for (var i = 0; i < leng; i++) {
        var tmp = g.get_output(data['input'][i], identify)
        calculate_output.push(tmp)
        N += 1
    }
    var loss = []
    var loss_rate = []
    var mean_value = []
    var loss_rate2 = []
    for (var i = 0; i < data['output'][0].length; i++) {
        loss.push(0)
        loss_rate.push(0)
        mean_value.push(0)
        loss_rate2.push(0)
    }
    var num = 0
    var flag = 0
    for (var i = 0; i < leng; i++) {
        for (var kk = 0; kk < data['input'][0].length; kk++) {
            if (isNaN(data['input'][i][kk])) {
                flag = 1
            }
        }
        for (var kk = 0; kk < data['output'][0].length; kk++) {
            if (isNaN(calculate_output[i][kk])) {
                flag = 1
            }
        }
        if (flag) {
            continue
        }
        for (var j = 0; j < data['output'][0].length; j++) {
            mean_value[j] += data['output'][i][j]
            var tmp_loss = Math.abs(data['output'][i][j] - calculate_output[i][j])
            loss[j] += Math.abs(data['output'][i][j] - calculate_output[i][j])
            loss_rate[j] += tmp_loss / Math.abs(data['output'][i][j])

        }
        num += 1
    }
    var all_loss_rate = 0
    for (var j = 0; j < data['output'][0].length; j++) {
        loss[j] /= num
        mean_value[j] /= num
        loss_rate[j] /= num
        all_loss_rate += loss_rate[j]
        loss_rate2[j] = loss[j] / mean_value[j]
    }
    var data_tmp = []
    for (var i = 0; i < leng; i++) {
        data_tmp.push(data['output'][i])
    }
    return {
        all_loss_rate,
        loss,
        loss_rate,
        loss_rate2
    }
}


function update(size, x, v, p, p_best, g_best, bound, low, up, v_low, v_high, data) {
    var c1 = 2 // 学习因子
    var c2 = 2
    var w = 0.9 // 自身权重因子
    for (var i = 0; i < size; i++) {
        // 更新速度(核心公式)
        for (var j = 0; j < low.length; j++) {
            v[i][j] = w * v[i][j] + c1 * Math.random() * (
                p_best[i][j] - x[i][j]) + c2 * Math.random() * (g_best[j] - x[i][j])
        }
        // 速度限制
        for (var j = 0; j < low.length; j++) {
            if (v[i][j] < v_low[j]) {
                v[i][j] = v_low[j]
            }
            if (v[i][j] > v_high[j]) {
                v[i][j] = v_high[j]
            }
        }
        // 更新位置

        for (var j = 0; j < low.length; j++) {
            x[i][j] = x[i][j] + v[i][j]
        }
        // 位置限制
        for (var j = 0; j < low.length; j++) {
            if (x[i][j] < low[j]) {
                x[i][j] = low[j]
            }
            if (x[i][j] > up[j]) {
                x[i][j] = up[j]
            }

        }
        var x_tmp = fitness(x[i])['all_loss_rate']
        // 更新p_best和g_best
        var x_best = []
        if (x_tmp < fitness(p_best[i])['all_loss_rate']) {
            p_best[i] = deepClone(x[i])
        }
        if (x_tmp < fitness(g_best)['all_loss_rate']) {
            g_best = deepClone(x[i])
            x_best = x_tmp
        }

    }
    return {
        x,
        v,
        p_best,
        g_best,
        x_best
    }
}

function deepClone(obj) {
    let objClone = Array.isArray(obj) ? [] : {};
    if (obj && typeof obj === "object") {
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                //判断ojb子元素是否为对象，如果是，递归复制
                if (obj[key] && typeof obj[key] === "object") {
                    objClone[key] = deepClone(obj[key]);
                } else {
                    //如果不是，简单复制
                    objClone[key] = obj[key];
                }
            }
        }
    }
    return objClone;
}

function pso(time, size, low, up, v_low, v_high, x, v, p, p_best, g_best, bound, data) {
    var best = []
    var outs = []
    var tmps = 10000000
    var tmps_lossrate = []
    var tmps_lossrate2 = []
    var final_best = x[0] //自己初始化
    var writename = data['id'] + '_result.txt'
    for (var gen = 0; gen < time; gen++) {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        console.log(year + '年' + month + '月' + day + '日 ' + hour + ':' + minute + ':' + second);

        var temp = update(size, x, v, p, p_best, g_best, bound, low, up, v_low, v_high, data)

        x = deepClone(temp['x'])
        v = deepClone(temp['v'])
        p_best = deepClone(temp['p_best'])
        g_best = deepClone(temp['g_best'])
        var x_best = temp['x_best']
        if (gen % 4 == 0) {
            fork('posts.js')
        }
        outs = fitness(g_best)

        if (outs['all_loss_rate'] < tmps) {
            final_best = deepClone(g_best)
            tmps = outs['all_loss_rate']
            console.log("loss_rate", outs['all_loss_rate'])
        }
    }
    outs = cac_test(final_best)
    console.log("test_loss_rate", outs['all_loss_rate'])
    console.log("test_loss_rate", outs['loss_rate'])

    let ans = {
        "success": "true",
        'truth': outs['true_output'],
        'pred': outs['calculate_output'],
        "message": ' ',
        'r2': outs['R2'],
        'std': outs['std'],
        'loss': outs['loss'],
        'maes': outs['maes'],
        'rmses': outs['rmses'],
        'bestStr': final_best
    }
    return ans
}

function cac_r2(y_pred, y_test) {

    var SStot = 0
    var mea = []
    var SStot = []
    var SSres = []
    var VR = []
    var loss = []
    for (var i = 0; i < y_test[0].length; i++) {
        mea.push(0)
        SStot.push(0)
        SSres.push(0)
        loss.push(0)
        VR.push(0)
    }
    //求平均值
    for (var i = 0; i < y_test.length - 1; i++) {
        for (var j = 0; j < y_test[0].length; j++) {
            mea[j] += y_test[i][j] / y_test.length
            loss[j] += Math.pow((y_test[i][j] - y_pred[i][j]), 2) / y_test.length
        }
    }
    //得到具体的平均值
    // 求MSE
    // 求avg
    //求方差var
    for (var i = 0; i < y_test.length - 1; i++) {
        for (var j = 0; j < y_test[0].length; j++) {
            VR[j] += Math.pow((y_test[i][j] - mea[j]), 2) / y_test.length
        }
    }
    for (var i = 0; i < y_test.length; i++) {
        for (var j = 0; j < y_test[0].length; j++)
            SStot[j] += Math.pow((y_test[i][j] - mea[j]), 2)
    }
    for (var i = 0; i < y_test.length; i++) {
        for (var j = 0; j < y_test[0].length; j++)
            SSres[j] += Math.pow((y_test[i][j] - y_pred[i][j]), 2)
    }
    var r2 = []
    for (var j = 0; j < y_test[0].length; j++) {
        r2.push(1 - loss[j] / VR[j])
    }
    return r2
}

async function pos2k(datas, time = 40, size = 100) {
    data = datas
    start()
    await wait(200)
    g = require(`./${data['script']}.js`)
    var time = time //迭代次数
    var size = size //粒子群初始化的个数

    var low = data['identify'][0] //取值范围
    var up = data['identify'][1]
    var v_low = []
    var v_high = []
    var s = get_v(low, up)
    v_low = s['v_low']
    v_high = s['v_high']
    var tmp_data = JSON.parse(JSON.stringify(data))
    tmp_data = await (data_loder(tmp_data))
    data['input_Quartile'] = tmp_data[0]
    data['output_Quartile'] = tmp_data[1]
    await (data_split(data))
    console.log(data['input'].length)
    console.log("start")
    var temp = PSOs(time, size, low, up, v_low, v_high)
    console.log("end")
    var x = temp['x']
    var v = temp['v']
    var p = temp['p']
    var p_best = temp['p_best']
    var g_best = temp['g_best']
    var bound = temp['bound']
    console.log("id", data['id'])

    let ans = pso(time, size, low, up, v_low, v_high, x, v, p, p_best, g_best, bound, data)
    console.log(ans)
    return ans
}
async function data_split(data) {
    var input_data = []
    var output_data = []
    for (var i = 0; i < data['input'].length; i++) {
        var flag = 1
        for (var j = 0; j < data['input'][0].length; j++) {
            if (data['input'][i][j] < data['input_Quartile'][j][1] || data['input'][i][j] > data['input_Quartile'][j][0])
                flag = 0
        }

        for (var j = 0; j < data['output'][0].length; j++) {
            if (data['output'][i][j] < data['output_Quartile'][j][1] || data['output'][i][j] > data['output_Quartile'][j][0])
                flag = 0
        }

        if (flag) {
            input_data.push(data['input'][i])
            output_data.push(data['output'][i])
        }

    }
    data['input'] = input_data
    data['output'] = output_data
    return 0

}
async function data_loder(data) {
    input_data = []
    output_data = []
    input_outlier = []
    output_outlier = []
    for (var i = 0; i < data['input'][0].length; i++)
        input_data.push([])

    for (var i = 0; i < data['input'][0].length; i++)
        for (var j = 0; j < data['input'].length; j++)
            input_data[i].push(data['input'][j][i])

    for (var i = 0; i < data['output'][0].length; i++)
        output_data.push([])
    for (var i = 0; i < data['output'][0].length; i++)
        for (var j = 0; j < data['output'].length; j++)
            output_data[i].push(data['output'][j][i])
    for (var i = 0; i < input_data.length; i++)
        input_outlier.push(Box_plot(input_data[i]))
    for (var i = 0; i < output_data.length; i++)
        output_outlier.push(Box_plot(output_data[i]))
    return [input_outlier, output_outlier]
}

function median(values) {
    var half = Math.floor(values.length / 2);
    if (values.length % 2)
        return values[half];
    else
        return (values[half - 1] + values[half]) / 2.0;
}

function Box_plot(data) {
    // Sort the data
    data.sort(function (a, b) {
        return a - b;
    });
    var q1 = median(data.slice(0, Math.floor(data.length / 2)));
    var q3 = median(data.slice(Math.ceil(data.length / 2)));
    var Upper_Quartile = q3 + 2 * (q3 - q1)
    var Lower_Quartile = q1 - 2 * (q3 - q1)

    return [Upper_Quartile, Lower_Quartile]
}


async function pre(datas, time = 20, size = 40) {
    console.log("predict")
    data = datas

    start()
    await wait(200)
    g = require(`./${data['script']}.js`)
    //await Incremental_Learning(datas,time,size)
    var time = time //迭代次数
    var size = size //粒子群初始化的个数
    var tmp_data = JSON.parse(JSON.stringify(data))
    tmp_data = await (data_loder(tmp_data))
    data['input_Quartile'] = tmp_data[0]
    data['output_Quartile'] = tmp_data[1]
    console.log("1")
    var ans = await (predicts())

    console.log("2")
    data['output'] = ans
    //console.log(ans)
    let data_post = {
        "id": data['id'],
        "type": "pre",
        "success": "true"
    }
    data_post['predict'] = ans
    console.log(data_post)
    return data_post
}

async function Incremental_Learning(datas, time, size) {
    console.log("increase")
    data = datas
    start()
    await wait(200)
    g = require(`./${data['script']}.js`)
    var time = time //迭代次数
    var size = size //粒子群初始化的个数
    var tmp_yred = []
    var ans = await (predicts());
    var loss_rate = cac_lossrate(ans)

    console.log('----------长度1', data['input'].length)
    console.log('----------loss', loss_rate)
    //data['output'] = ans
    if (loss_rate > 0.3) //则更新
    {

        var time = time //迭代次数
        var size = size //粒子群初始化的个数
        var low = data['identify'][0] //取值范围
        var up = data['identify'][1]
        var v_low = []
        var v_high = []
        var s = get_v(low, up)
        v_low = s['v_low']
        v_high = s['v_high']
        var temp = await (PSOs_Increase(time, size, low, up, v_low, v_high))
        var x = temp['x']
        var v = temp['v']
        var p_best = temp['p_best']
        var g_best = temp['g_best']
        var bound = temp['bound']
        let p = temp['p']
        var output = pso(time, size, low, up, v_low, v_high, x, v, p, p_best, g_best, bound, data)
        data = data_increase
        ans = await (predicts());
        console.log("fineturn")
    } else {
        var output = {
            "success": "true",
            "type": "no need to finetune",
            "message": ' ',
            'r2': null,
            'std': null,
            'truth': null,
            'pred': null,
            'loss': null,
            'maes': null,
            'rmses': null,
            'bestStr': null
        }
    }
    console.log(output)
    return output
}

function cac_lossrate(y_pred) {
    var loss_rate = []
    var loss = []
    var ex_input = []
    var ex_output = []
    for (var i = 0; i < y_pred[0].length; i++) {
        loss_rate.push(0)
        loss.push(0)
    }
    var num = 0
    let flag = 0
    // 
    for (var i = 0; i < y_pred.length; i++) {
        flag = 0
        for (var j = 0; j < y_pred[0].length; j++) {
            let tmp_loss = Math.abs(data['output'][i][j] - y_pred[i][j])
            loss[j] += Math.abs(data['output'][i][j] - y_pred[i][j])
            loss_rate[j] += tmp_loss / data['output'][i][j]
            if (tmp_loss / data['output'][i][j] > 0.05) {
                flag = 1
            }
        }
        if (flag) {
            ex_input.push(data['input'][i])
            ex_output.push(data['output'][i])
        }

        num += 1
    }
    for (var j = 0; j < y_pred[0].length; j++) {
        loss_rate[j] /= num
    }
    var all_loss = 0
    for (var j = 0; j < y_pred[0].length; j++) {
        all_loss += loss_rate[j]
    }
    data_increase = JSON.parse(JSON.stringify(data))
    data['input'] = ex_input
    data['output'] = ex_output
    return all_loss / y_pred[0].length
}

function wait(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
};


async function predicts() {
    var s = []
    fs.readFile('./' + data['id'] + '_result.txt', 'utf-8', function (err, datas) {
        if (err) {
            return console.log('读取失败', err)
        }
        s = datas
    })
    await wait(500);
    s = s.split(' ')
    var identify = []
    for (var i = 0; i < s.length; i++)
        identify.push(Number(s[i]))
    var tmp = caculate_pre_loss(identify)

    return tmp
}

function deep_copy(arr) {
    var right_pi = [],
        left_pi = [],
        gw1 = [],
        tw = [],
        pc = [],
        gs_tmp = [],
        gw = [],
        pi = [],
        po = [],
        ti = [],
        to = [],
        gs = [],
        dp = []
    for (var i = 0; i < 10; i = i + 1) {
        {
            pi.push(arr['pi'][i])
            po.push(arr['po'][i])
            ti.push(arr['ti'][i])
            to.push(arr['to'][i])
            gs.push(arr['gs'][i])
            dp.push(arr['dp'][i])
            tw.push(arr['tw'][i])
            pc.push(arr['pc'][i])
            gw.push(arr['gw'][i])
            gw1.push(arr['gw1'][i])
        }
    }
    return {
        pi,
        po,
        ti,
        to,
        gs,
        dp,
        tw,
        pc,
        gw,
        gw1
    }
}

function caculate_pre_loss(identify) {
    //个体适应值计算
    var calculate_output = []
    var N = 0
    var leng = parseInt(data['input'].length)
    for (var i = 0; i < leng; i++) {
        var tmp = g.get_output(data['input'][i], identify)
        calculate_output.push(tmp)
        N += 1
    }

    return calculate_output
}

module.exports = {
    pos2k,
    pre,
    Incremental_Learning
}