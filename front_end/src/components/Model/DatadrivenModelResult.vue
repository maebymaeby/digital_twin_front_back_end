<template>
  <el-row class="modelresult_framework" v-if="isDecay"></el-row>
  <el-row class="modelresult_framework" v-else>
    <!-- 模型操作按钮区域 -->
    <el-col class="result_button_layout" :span="24" v-if="showSaveModel">
      <el-button class="result_button" type="primary" @click="saveModel">保存模型</el-button>
      <el-button class="result_button" type="danger" @click="noSaveModel">删除模型</el-button>
    </el-col>
    <!-- 图表区域 -->
    <el-col class="header clearfix">
      <el-col :span="12" class="chart_common chart_line">
        <line-chart :seriesData="this.lineChartOptions1.seriesData" :titleText="this.lineChartOptions1.titleText" :subTitleText="this.lineChartOptions1.subTitleText" :yAxisText="this.lineChartOptions1.yAxisText"></line-chart>
      </el-col>
      <el-col :span="12" class="chart_common chart_line">
        <line-chart :seriesData="this.lineChartOptions2.seriesData" :titleText="this.lineChartOptions2.titleText" :subTitleText="this.lineChartOptions2.subTitleText" :yAxisText="this.lineChartOptions2.yAxisText"></line-chart>
      </el-col>
      <el-col :span="12" class="chart_common chart_line">
        <line-chart :seriesData="this.lineChartOptions3.seriesData" :titleText="this.lineChartOptions3.titleText" :subTitleText="this.lineChartOptions3.subTitleText" :yAxisText="this.lineChartOptions3.yAxisText"></line-chart>
      </el-col>
      <el-col :span="12" class="chart_common chart_line">
        <line-chart :seriesData="this.lineChartOptions4.seriesData" :titleText="this.lineChartOptions4.titleText" :subTitleText="this.lineChartOptions4.subTitleText" :yAxisText="this.lineChartOptions4.yAxisText"></line-chart>
      </el-col>
    </el-col>
    <!-- 模型信息填写对话框 -->
    <el-dialog :visible.sync="saveModelVisible" :append-to-body="true" width="600px">
      <div slot="title" style="text-align:center">
        <span style="font-size:18px">请填写模型信息</span>
      </div>
      <el-divider></el-divider>
      <el-form :model="modelInfoForm" label-position="left" label-width="80px" style="margin: 0 20px;">
        <el-form-item label="模型名称">
          <el-input v-model="modelInfoForm.name"></el-input>
        </el-form-item>
        <el-form-item label="模型类型">
          <el-input v-model="modelInfoForm.type" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="模型描述">
          <el-input type="textarea" v-model="modelInfoForm.description"></el-input>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <div slot="footer" style="margin: 0 20px;">
        <el-button @click="confirmSaveModel" style="margin-right:20px;">确认</el-button>
        <el-button @click="exitSaveModel">取消</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
  import STORE from '@/store'
  import LineChart from '../Chart/LineChart.vue'

  export default {
    components: {
      LineChart,
    },
    name: "DatadrivenModelResult",
    data() {
      return {
        isDecay: true,
        resultData: {},
        modelInfo: {},
        modelResult: {},
        metricData: {
          r2: [
            [],
            [],
            [],
            []
          ],
          std: [
            [],
            [],
            [],
            []
          ],
          mae: [
            [],
            [],
            [],
            []
          ],
          rmse: [
            [],
            [],
            [],
            []
          ],
        },
        lineChartOptions1: {
          seriesData: [
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
          ],
          titleText: "高背压凝汽器右侧循环水出水压力 预测趋势图",
          subTitleText: "",
          yAxisText: "压强 (Kpa)"
        },
        lineChartOptions2: {
          seriesData: [
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
          ],
          titleText: "机组凝汽器循环水出水温度 预测趋势图",
          subTitleText: "",
          yAxisText: "温度 (°C)"
        },
        lineChartOptions3: {
          seriesData: [
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
          ],
          titleText: "低背压凝汽器真空 预测趋势图",
          subTitleText: "",
          yAxisText: "压强 (Kpa)"
        },
        lineChartOptions4: {
          seriesData: [
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
          ],
          titleText: "机组热井温度 预测趋势图",
          subTitleText: "",
          yAxisText: "温度 (°C)"
        },
        saveModelVisible: false,
        isSaveModel: false,
        modelInfoForm: {
          name: "",
          type: "",
          description: "",
        },
        requestData: {},
        showSaveModel: true,
        modelType2Detailed: {
          'ga': "GA（遗传算法）",
          'elm': "ELM（极限学习机）",
          'forest': "RandomForest（随机森林）",
          'pso': "PSO（粒子群算法）",
          'svm': "SVM（支持向量机）",
          'xgb': "XGBoost（极限梯度提升树）",
        }
      };
    },
    computed: {},
    created() {
      // 判断上级页面是训练/增量学习还是预测
      if (this.$route.query.from == "predict") {
        this.showSaveModel = false;
      }
      else {
        this.showSaveModel = true;
      }
      // 获取请求数据
      this.resultData = this.$route.query.resultData;
      if ('model_info' in this.resultData) {
        this.modelInfo = this.resultData.model_info;
        this.modelInfoForm.type = this.modelType2Detailed[this.modelInfo.model_type];
      }
      if ('model_result' in this.resultData) {
        this.modelResult = this.resultData.model_result;
      }
    },
    mounted() {
      // 设置50ms延迟来加载图表
      setTimeout(() => {
        this.isDecay = false;
      }, 50)
      // 根据模型评价指标设置副标题
      let metricAttr = ['r2', 'std', 'mae', 'rmse'];
      let subTitleFlag = true;
      for (let i = 0; i < metricAttr.length; i++) {
        if (metricAttr[i] in this.modelResult) {
          this.metricData[metricAttr[i]] = this.modelResult[metricAttr[i]]
          for (let j = 0; j < this.metricData[metricAttr[i]].length; j++) {
            this.metricData[metricAttr[i]][j] = this.GLOBAL.getFixedTo(this.metricData[metricAttr[i]][j], 3)
          }
        }
        else {
          subTitleFlag = false;
        }
      }
      if (subTitleFlag) {
        this.lineChartOptions1.subTitleText = "<b>R2系数：</b>" + this.metricData.r2[0] + "&nbsp; &nbsp; <b>标准差：</b>" + this.metricData.std[0] + "&nbsp; &nbsp; <b>平均绝对误差：</b>" + this.metricData.mae[0] + "&nbsp; &nbsp; <b>均方根误差：</b>" + this.metricData.rmse[0];
        this.lineChartOptions2.subTitleText = "<b>R2系数：</b>" + this.metricData.r2[1] + "&nbsp; &nbsp; <b>标准差：</b>" + this.metricData.std[1] + "&nbsp; &nbsp; <b>平均绝对误差：</b>" + this.metricData.mae[1] + "&nbsp; &nbsp; <b>均方根误差：</b>" + this.metricData.rmse[1];
        this.lineChartOptions3.subTitleText = "<b>R2系数：</b>" + this.metricData.r2[2] + "&nbsp; &nbsp; <b>标准差：</b>" + this.metricData.std[2] + "&nbsp; &nbsp; <b>平均绝对误差：</b>" + this.metricData.mae[2] + "&nbsp; &nbsp; <b>均方根误差：</b>" + this.metricData.rmse[2];
        this.lineChartOptions4.subTitleText = "<b>R2系数：</b>" + this.metricData.r2[3] + "&nbsp; &nbsp; <b>标准差：</b>" + this.metricData.std[3] + "&nbsp; &nbsp; <b>平均绝对误差：</b>" + this.metricData.mae[3] + "&nbsp; &nbsp; <b>均方根误差：</b>" + this.metricData.rmse[3];
      }
      // 设置折线图内容
      let chartData = this.generateChartData()
      this.lineChartOptions1.seriesData = chartData[0]
      this.lineChartOptions2.seriesData = chartData[1]
      this.lineChartOptions3.seriesData = chartData[2]
      this.lineChartOptions4.seriesData = chartData[3]
    },
    updated() {},
    methods: {
      // 生成图表数据
      generateChartData() {
        let seriesData = [
          [],
          [],
          [],
          [],
        ];
        let seriesPred = [
          [],
          [],
          [],
          [],
        ];
        let seriesTruth = [
          [],
          [],
          [],
          [],
        ];
        for (let i = 0; i < this.modelResult.pred.length; i++) {
          for (let j = 0; j < seriesPred.length; j++) {
            seriesPred[j].push(this.modelResult.pred[i][j])
          }
        }
        for (let i = 0; i < this.modelResult.truth.length; i++) {
          for (let j = 0; j < seriesTruth.length; j++) {
            seriesTruth[j].push(this.modelResult.truth[i][j])
          }
        }
        for (let i = 0; i < seriesData.length; i++) {
          seriesData[i].push(seriesPred[i])
          seriesData[i].push(seriesTruth[i])
        }
        return seriesData;
      },
      // 模型信息填写相关
      saveModel() {
        this.saveModelVisible = true;
      },
      confirmSaveModel() {
        this.isSaveModel = true;
        this.requestData = Object.assign(
          {
            model_name: this.modelInfoForm.name,
            model_description: this.modelInfoForm.description,
            save_model_flag: this.isSaveModel
          },
          this.modelInfo);
        return new Promise((resolve, reject) => {
          STORE
            .dispatch("Model/saveModel", this.requestData)
            .then((res) => {
              this.saveModelVisible = false;
              this.$message({
                message: "保存模型成功",
                type: 'success'
              });
              this.$router.push({
                path: '/ModelTrain'
              });
              resolve(res)
            })
            .catch((error) => {
              reject(error);
            })
        });
      },
      exitSaveModel() {
        this.modelInfoForm.name = "";
        this.modelInfoForm.description = "";
        this.saveModelVisible = false;
      },
      noSaveModel() {
        this.isSaveModel = false;
        this.requestData = Object.assign(
          {
            model_name: this.modelInfoForm.name,
            model_description: this.modelInfoForm.description,
            save_model_flag: this.isSaveModel
          },
          this.modelInfo);
        this.$confirm('此操作将永久删除该模型, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            return new Promise((resolve, reject) => {
              STORE
                .dispatch("Model/saveModel", this.requestData)
                .then((res) => {
                  this.$message({
                    message: "删除模型成功",
                    type: 'success'
                  });
                  this.$router.push({
                    path: '/ModelTrain'
                  });
                  resolve(res)
                })
                .catch((error) => {
                  reject(error);
                })
            });
          })
      }
    },
  }
</script>

<style>
  .modelresult_framework {
    margin: 16px;
    padding: 24px;
    background-color: #fff;
    border-radius: 6px;
  }

  .el-dialog__body {
    padding: 0 20px;
  }

  .result_button_layout {
    text-align: left;
    margin-top: 15px;
    padding: 0 auto;
  }

  .result_button {
    margin-left: 30px;
    margin-right: 30px;
  }

  .header {
    margin-top: 50px;
  }

  .clearfix {
    flex: 1;
    text-align: right;
    justify-content: center;
  }

  .chart_common {
    margin-bottom: 40px;
    height: 400px;
  }
</style>