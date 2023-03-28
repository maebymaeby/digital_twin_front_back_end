let g = [];
let data = [];
let M = 50;
let mut = 0.2;
let alpha = 0.4;
let best_array = [];
let epochs = 2;
let size = 100;

////////////

function cac_test_GA(identify) { /////////

  console.log('identify', identify)
  let calculate_output = []
  //由于 data 是全局变量 所以测试要从 leng 开始
  let leng = parseInt(data['input'].length * 0.9)
  let test_leng = data['input'].length - leng //测试集数量
  let true_output = [] // 存入测试集 的 真实值变量
  for (let i = leng; i < data['input'].length; i++) {
    let tmp = g.get_output(data['input'][i], identify)
    calculate_output.push(tmp)
    true_output.push(data['output'][i])
  }

  let loss = []
  let maes = []
  let rmses = []
  let mean_value = []
  let mean_pre = []
  let std = []
  for (let i = 0; i < data['output'][0].length; i++) {
    loss.push(0)
    maes.push(0)
    std.push(0)
    mean_value.push(0)
    mean_pre.push(0)
    rmses.push(0)
  }
  for (let i = 0; i < test_leng; i++) {
    for (let j = 0; j < data['output'][0].length; j++) {
      mean_value[j] += true_output[i][j]
    }
  }
  for (let i = 0; i < test_leng; i++) {
    for (let kk = 0; kk < data['output'][0].length; kk++) //处理预测的nan值
    {
      if (isNaN(calculate_output[i][kk])) {
        calculate_output[i][kk] = mean_value[kk]
      }
    }

    for (let j = 0; j < data['output'][0].length; j++) {
      std[j] += Math.pow(Math.abs(true_output[i][j] - calculate_output[i][j]), 2)
      maes[j] += Math.abs(true_output[i][j] - calculate_output[i][j])
      rmses[j] += Math.pow(true_output[i][j] - calculate_output[i][j], 2)
      mean_pre[j] += calculate_output[i][j]
    }
  }

  let all_loss_rate = 0
  console.log('leng', leng, test_leng)
  for (let j = 0; j < data['output'][0].length; j++) {
    std[j] /= test_leng
    std[j] = Math.pow(std[j], 0.5)
    maes[j] /= test_leng
    rmses[j] = Math.sqrt(rmses[j] / test_leng)


    mean_value[j] /= test_leng
    mean_pre[j] /= test_leng
    maes[j] = maes[j] / mean_value[j]
    rmses[j] = rmses[j] / mean_value[j]
    loss[j] = (maes[j] + rmses[j]) / 2
    all_loss_rate += loss[j]
  }
  all_loss_rate = all_loss_rate / data['output'][0].length

  //R2
  let data_tmp = []
  for (let i = leng; i < data['input'].length; i++) {
    data_tmp.push(data['output'][i])
  }
  let R2 = cac_r2(calculate_output, data_tmp)


  return {
    all_loss_rate,
    loss,
    maes,
    rmses,
    std,
    R2,
    true_output,
    calculate_output
  }

}


function GA_init(size_init = 100, low, up) {
  // 初始化
  let size = size_init // 种群大小
  let bound = new Array(); // 变量的约束范围
  bound[0] = new Array();
  bound[1] = new Array();
  for (let i = 0; i < low.length; i++) {
    bound[0][i] = low[i]
    bound[1][i] = up[i]
  }
  let x = new Array();
  //初始化点的位置 很重要
  for (let i = 0; i < size; i++) {
    x[i] = new Array();
    for (let j = 0; j < low.length; j++) {

      x[i][j] = (Math.random() * (bound[1][j] - bound[0][j])) + bound[0][j];

    }
  }

  //初始化第0代初始全局最优解

  return {
    x,
    bound
  }
}


function calculateSumFitness(identify) {

  //个体适应值计算
  let calculate_output = []
  let leng = parseInt(data['input'].length * 0.9)
  for (let i = 0; i < leng; i++) {
    let tmp = g.get_output(data['input'][i], identify)
    calculate_output.push(tmp)
  }
  let loss = []
  let loss_rate = []
  let loss_rate2 = []
  let mean_value = []
  for (let i = 0; i < data['output'][0].length; i++) {
    loss.push(0)
    loss_rate.push(0)
    mean_value.push(0)
    loss_rate2.push(0)
  }
  for (let i = 0; i < leng; i++) {

    for (let j = 0; j < data['output'][0].length; j++) {
      loss[j] += Math.abs(data['output'][i][j] - calculate_output[i][j])
      mean_value[j] += data['output'][i][j]
      loss_rate2[j] += Math.abs(data['output'][i][j] - calculate_output[i][j]) / data['output'][i][j]
    }
  }
  let all_loss_rate = 0
  for (let j = 0; j < data['output'][0].length; j++) {
    loss[j] /= leng
    mean_value[j] /= leng
    loss_rate[j] = loss[j] / mean_value[j]
    loss_rate2[j] /= leng
    all_loss_rate += loss_rate[j]
  }
  // console.log('loss')
  // console.log(mean_value,loss,loss_rate)
  all_loss_rate = all_loss_rate / data['output'][0].length
  let data_tmp = []
  for (let i = 0; i < leng; i++) {
    data_tmp.push(data['output'][i])
  }
  let fit = (1 / all_loss_rate + 5) * (1 / all_loss_rate + 5) * (1 / all_loss_rate + 5)
  //console.log('all_loss_rate',all_loss_rate)
  return {
    fit,
    loss,
    loss_rate,
    loss_rate2
  }

}


function RWS(selectionProbability) {
  let sum = 0;
  let rand = Math.random();
  for (let i = 0; i < selectionProbability.length; i++) {
    sum += selectionProbability[i];
    if (sum >= rand) {
      return i;
    }
  }
}


function cross(total, p, totalNum) { //通过交叉生成 N-M个子孙
  let childs = [];

  for (let i = 0; i < totalNum - M; i++) {

    let child = [];
    for (let j = 0; j < total[0].length; j++) {
      let mother_index = RWS(p);
      let papa_index = RWS(p);
      let a = total[papa_index][j];
      let b = total[mother_index][j];
      child.push(a * alpha + b * (1 - alpha));
    }
    childs.push(child);
  }
  return childs;
}


function select(x, total_bestFitness = 0) {
  let bestFitness = 0
  let totalNum = x.length; //TODO 
  let evals = new Array(totalNum); // 所有染色体适应值 
  let p = new Array(totalNum); // 各染色体选择概率
  let F = 0; // 累计适应值总合
  best_array = [];
  let nancount = 0
  for (let i = 0; i < x.length; i++) { // 记录下种群的最优解
    evals[i] = calculateSumFitness(x[i]); //{fit,loss,loss_rate,F,R2}
    if (isNaN(evals[i].fit)) {
      evals[i].fit = 0;
      nancount += 1
      continue;
    }
    if (evals[i].fit > bestFitness && evals[i].fit != total_bestFitness) {
      bestFitness = evals[i].fit;
      best_array = [];
      for (let j = 0; j < x[0].length; j++) {
        best_array.push(x[i][j])
      }

    }

    F += evals[i].fit;
  }
  console.log('nancount', nancount, x.length)
  for (let j = 0; j < totalNum; j++) { // 计算累计概率
    p[j] = evals[j].fit / F;
  }

  let next_gen = cross(x, p, totalNum);
  return {
    next_gen,
    p,
    best_array,
    bestFitness
  };
}


function mutation(total, bound) {
  let maxs = bound[1];
  let mins = bound[0];
  for (let i = 0; i < total.length; i++) {
    if (Math.random() < mut) {
      for (let j = 0; j < total[0].length; j++) {
        let rand = Math.random();
        if (rand >= 0.5) {
          total[i][j] = total[i][j] + Math.random() * (maxs[j] - total[i][j]);
        } else {
          total[i][j] = total[i][j] - Math.random() * (total[i][j] - mins[j]);
        }
      }
    }
  }
  return total;
}


function maxN(array, n) {
  // 将一切数组升级成二维数组，二维数组的每一行都有两个元素构成[原一位数组的下标,值]
  let matrix = [];
  for (let i = 0; i < array.length; i++) {
    matrix.push([i, array[i]]);
  }

  // 对二维数组排序
  for (let i = 0; i < n; i++) {
    for (let j = 1; j < matrix.length; j++) {
      if (matrix[j - 1][1] > matrix[j][1]) {
        let temp = matrix[j - 1];
        matrix[j - 1] = matrix[j];
        matrix[j] = temp;
      }
    }
  }

  // 取最大的n个元素
  let maxIndexArray = [];
  for (let i = matrix.length - 1; i > matrix.length - n - 1; i--) {
    maxIndexArray.push(matrix[i][0]);
  }

  return maxIndexArray;
}


function copy(chromosomeMatrix, newChromosomeMatrix, IndexArr) {
  // 寻找适应度最高的N条染色体的下标(N=染色体数量*复制比例)

  // 复制
  for (let i = 0; i < IndexArr.length; i++) {
    let chromosome = chromosomeMatrix[IndexArr[i]];
    newChromosomeMatrix.push(chromosome);
  }

  return newChromosomeMatrix;
}


function wait(ms) {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
}


function GA(epochs, size, x = null) {
  let low = data['identify'][0] //取值范围
  let up = data['identify'][1]
  let temp = GA_init(size, low, up);

  if (x != null) {
    let temp_x = x
    x = temp.x
    for (let i = 0; i < temp_x.length; i++) {
      x[i] = temp_x[i]
    }
  } else {
    x = temp.x;
  }

  let bound = temp.bound;
  let bestStr;
  let bestFitness = 0; // 最佳适应值
  let best_loss_rate = 99;
  console.log("epochs", epochs)
  for (let i = 0; i < epochs; i++) {
    console.log('epoch ', i)
    let select_result = select(x, bestFitness);
    let next_gen = select_result.next_gen; //
    let p = select_result.p;

    if (typeof (select_result.best_array) != "undefined") {
      let ss = cac_test_GA(select_result.best_array)

      let new_epoch_loss = ss.all_loss_rate
      if (new_epoch_loss < best_loss_rate) {
        bestStr = select_result.best_array
        bestFitness = select_result.bestFitness
        best_loss_rate = new_epoch_loss
      }



    }
    next_gen = mutation(next_gen, bound); // 
    let bestparents_index = maxN(p, M);
    x = copy(x, next_gen, bestparents_index);
  }
  let outs = cac_test_GA(bestStr)


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
    'bestStr': bestStr
  }

  return ans


}


async function GA_train(datas) {
  data = datas
  console.log('start train')
  g = require(`./${data['script']}.js`)
  let tmp_data = JSON.parse(JSON.stringify(data))
  tmp_data = await (data_loder(tmp_data))
  data['input_Quartile'] = tmp_data[0]
  data['output_Quartile'] = tmp_data[1]
  await (data_split(data))
  let ans = GA(epochs, size);
  return ans //TODO return 原版是return best_ans
}


async function GA_pre(datas) {
  data = datas
  g = require(`./${data['script']}.js`)
  await wait(200)
  // let time = time //迭代次数
  // let size = size //粒子群初始化的个数
  let ans = predicts()


  return ans
  //console.log(ans)
}


function cac_lossrate(y_pred) {
  let loss_rate = []
  let loss = []
  let ex_input = []
  let ex_output = []
  for (let i = 0; i < y_pred[0].length; i++) {
    loss_rate.push(0)
    loss.push(0)
  }
  let num = 0
  let flag = 0
  // 
  for (let i = 0; i < y_pred.length; i++) {
    flag = 0
    for (let j = 0; j < y_pred[0].length; j++) {
      if (isNaN(y_pred[i][j]) || y_pred[i][j] == Infinity) {
        y_pred[i][j] = 0
      }
      let tmp_loss = Math.abs(data['output'][i][j] - y_pred[i][j])

      console.log(data['output'][i][j], y_pred[i][j])

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
  for (let j = 0; j < y_pred[0].length; j++) {
    loss_rate[j] /= num
  }
  let all_loss = 0
  for (let j = 0; j < y_pred[0].length; j++) {
    all_loss += loss_rate[j]
  }
  data['input'] = ex_input
  data['output'] = ex_output
  return all_loss / y_pred[0].length
}


async function data_split(data) {
  let input_data = []
  let output_data = []
  for (let i = 0; i < data['input'].length; i++) {
    let flag = 1
    for (let j = 0; j < data['input'][0].length; j++) {
      if (data['input'][i][j] < data['input_Quartile'][j][1] || data['input'][i][j] > data['input_Quartile'][j][0])
        flag = 0
    }

    for (let j = 0; j < data['output'][0].length; j++) {
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
  let input_data = []
  let output_data = []
  let input_outlier = []
  let output_outlier = []
  for (let i = 0; i < data['input'][0].length; i++)
    input_data.push([])

  for (let i = 0; i < data['input'][0].length; i++)
    for (let j = 0; j < data['input'].length; j++)
      input_data[i].push(data['input'][j][i])

  for (let i = 0; i < data['output'][0].length; i++)
    output_data.push([])
  for (let i = 0; i < data['output'][0].length; i++)
    for (let j = 0; j < data['output'].length; j++)
      output_data[i].push(data['output'][j][i])
  for (let i = 0; i < input_data.length; i++)
    input_outlier.push(Box_plot(input_data[i]))
  for (let i = 0; i < output_data.length; i++)
    output_outlier.push(Box_plot(output_data[i]))
  return [input_outlier, output_outlier]
}


function median(values) {
  let half = Math.floor(values.length / 2);
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
  let q1 = median(data.slice(0, Math.floor(data.length / 2)));
  let q3 = median(data.slice(Math.ceil(data.length / 2)));
  let Upper_Quartile = q3 + 10000 * (q3 - q1)
  let Lower_Quartile = q1 - 10000 * (q3 - q1)
  return [Upper_Quartile, Lower_Quartile]
}


async function GA_Increase(low) {
  let s = data['model_param']
  console.log('GA_Increase')
  // 参数保存至s
  // s = bestStr
  await wait(5000);
  let identify = []
  let x = new Array();
  for (let i = 0; i < s.length; i++)
    identify.push(Number(s[i]))
  //初始化 identify，做增量学习
  for (let j = 0; j < 5; j++) {
    x[j] = new Array();
    for (let i = 0; i < low.length; i++) {
      x[j][i] = identify[i]
    }
  }
  return x;
}


async function Incremental_Learning(datas, time_init = 2, size_init) {
  console.log("increase")
  data = datas
  await wait(200)
  g = require(`./${data['script']}.js`)
  let time = time_init //迭代次数
  let size = size_init //种群染色体初始化的个数
  let preds = await (predicts());
  let predict = preds.pred
  console.log('len ans', predict)
  let loss_rate = cac_lossrate(predict)
  console.log("--------------loss", loss_rate)
  //data['output'] = ans
  console.log("--------------长度1", data['input'].length)
  if (loss_rate > 0.05) //则更新
  {
    console.log("开始增量学习")
    let low = data['identify'][0] //取值范围
    let x_tmp = await (GA_Increase(low))

    console.log("增量学习训练集长度-------", data['input'].length)

    let outs = GA(time, size, x_tmp)
    return outs
  } else {
    console.log('no need to finetune')
    let ans = {
      "success": "true",
      "message": 'no',
      'r2': null,
      'std': null,
      'truth': null,
      'pred': null,
      'loss': null,
      'maes': null,
      'rmses': null,
      'bestStr': null
    }
    return ans

  }
}


async function predicts() {
  let s = data['model_param']
  // s = bestStr
  await wait(5000);
  let identify = []
  for (let i = 0; i < s.length; i++)
    identify.push(Number(s[i]))
  console.log('identify', identify)
  let ans = caculate_pre(identify)
  let datas = {
    "id": data['id'],
    "type": "pre",
    "success": "true",
    "pred": ans
  }
  // datas['predict'] = ans

  return datas

}


function cac_r2(y_pred, y_test) {
  let mea = []
  let SStot = []
  let SSres = []
  let VR = []
  let loss = []
  for (let i = 0; i < y_test[0].length; i++) {
    mea.push(0)
    SStot.push(0)
    SSres.push(0)
    loss.push(0)
    VR.push(0)
  }
  //求平均值
  for (let i = 0; i < y_test.length - 1; i++) {
    for (let j = 0; j < y_test[0].length; j++) {
      mea[j] += y_test[i][j] / y_test.length
      loss[j] += Math.pow((y_test[i][j] - y_pred[i][j]), 2) / y_test.length
    }
  }
  //得到具体的平均值
  // 求MSE
  // 求avg
  //求方差let
  for (let i = 0; i < y_test.length - 1; i++) {
    for (let j = 0; j < y_test[0].length; j++) {
      VR[j] += Math.pow((y_test[i][j] - mea[j]), 2) / y_test.length
    }
  }
  for (let i = 0; i < y_test.length; i++) {
    for (let j = 0; j < y_test[0].length; j++)
      SStot[j] += Math.pow((y_test[i][j] - mea[j]), 2)
  }
  for (let i = 0; i < y_test.length; i++) {
    for (let j = 0; j < y_test[0].length; j++)
      SSres[j] += Math.pow((y_test[i][j] - y_pred[i][j]), 2)
  }
  let r2 = []
  for (let j = 0; j < y_test[0].length; j++) {
    r2.push(1 - loss[j] / VR[j])
  }
  return r2
}


function caculate_pre(identify) {
  //个体适应值计算
  // console.log('793'+identify)    
  let calculate_output = []
  let leng = parseInt(data['input'].length)
  for (let i = 0; i < leng; i++) {
    let tmp = g.get_output(data['input'][i], identify)
    calculate_output.push(tmp)
  }

  return calculate_output
}


module.exports = {
  GA_train,
  GA_pre,
  Incremental_Learning,
}