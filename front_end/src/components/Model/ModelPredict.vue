<template>
  <el-row class="modelpredict_framework_predicting" v-if="isPredicting">
    <loading-component class="loading_layout" :loadingEvent="this.loadingEvent"></loading-component>
  </el-row>
  <el-row class="modelpredict_framework" v-else>
    <!-- 筛选框部分 -->
    <el-col class="predict_filter_layout" :span="24">
      <el-col :span="4" class="filter_button_content">
        <el-button type="primary" @click="gotoModelTrain">新建模型</el-button>
      </el-col>
      <el-col :span="8" :offset="11" class="filter_input_content">
        <el-select v-model="model_type_selected" class="filter_select" placeholder="全部模型" @change="predictSelectChange()" clearable>
          <el-option v-for="item in model_type_list" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-input v-model="model_name_inputted" class="filter_input" placeholder="请输入模型名称" @change="predictInputChange()" clearable>
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-col>
    </el-col>
    <!-- 表格部分 -->
    <el-col class="predict_table_layout" :span="24">
      <el-table class="predict_table" :data="tableData" :header-cell-style="tabelHeaderCellStyle" max-height="390" border>
        <template slot="empty">
          <img class="empty_image" src="@/assets/table_empty.png" />
          <p class="empty_text">暂无内容</p>
        </template>
        <el-table-column prop="model_name" min-width="270">
          <template slot="header">
            <p class="table_title">模型名称</p>
          </template>
        </el-table-column>
        <el-table-column prop="model_type" min-width="270">
          <template slot="header">
            <p class="table_title">模型类型</p>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" min-width="180">
          <template slot="header">
            <p class="table_title">创建时间</p>
          </template>
        </el-table-column>
        <el-table-column prop="train_length" min-width="180">
          <template slot="header">
            <p class="table_title">训练数据量</p>
          </template>
        </el-table-column>
        <el-table-column prop="train_loss" min-width="180">
          <template slot="header">
            <p class="table_title">平均训练损失</p>
          </template>
        </el-table-column>
        <el-table-column prop="model_description" min-width="180">
          <template slot="header">
            <p class="table_title">模型描述</p>
          </template>
        </el-table-column>
        <el-table-column prop="model_operation" min-width="120" fixed="right" align="center">
          <template slot="header">
            <p class="table_title">模型预测</p>
          </template>
          <template slot-scope="scope">
            <div class="select_operation">
              <el-button class="select_button" v-if="scope.row.isSelected" type="success" @click="selectModel(scope.row)" icon="el-icon-data-analysis" circle></el-button>
              <el-button class="select_button" v-else type="info" @click="selectModel(scope.row)" icon="el-icon-data-analysis" circle></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <!-- excel上传部分 -->
    <transition name="el-zoom-in-center">
      <el-col class="excel_select_layout" :span="16" v-show="this.modelIndex!=-1">
        <excel-uploader :on-success="excelUploadSuccess" />
      </el-col>
    </transition>
  </el-row>
</template>

<script>
  import STORE from '@/store'
  import ExcelUploader from '../Global/ExcelUploader.vue';
  import LoadingComponent from '../Global/LoadingComponent.vue';

  export default {
    name: "ModelPredict",
    components: {
      ExcelUploader,
      LoadingComponent,
    },
    data() {
      return {
        // 模型种类对应列表
        model_type_list: [
        {
          label: 'GA（遗传算法）',
          value: 'ga',
        },
        {
          label: 'ELM（极限学习机）',
          value: 'elm',
        },
        {
          label: 'PSO（粒子群算法）',
          value: 'pso',
        },
        {
          label: 'RandomForest（随机森林）',
          value: 'forest',
        },
        {
          label: 'SVM（支持向量机）',
          value: 'svm',
        },
        {
          label: 'XGBoost（极限梯度提升树）',
          value: 'xgb',
        }, ],
        // 表格信息
        tableData: [],
        // 表格表头样式
        tabelHeaderCellStyle: {
          "background-color": "#F7F7F9",
        },
        // 选择模型index
        modelIndex: -1,
        // 筛选框
        model_type_selected: '',
        model_name_inputted: '',
        filterData: {
          model_name: '',
          model_type: '',
        },
        // loading
        isPredicting: false,
        loadingEvent: "预测",
        // excel请求数据
        requestData: {
          "id": "",
          "script": "index",
          "identify": [
            [10000, 1.5e-9, 0.01, 1e-4, 1e-2, 0.0001],
            [8e4, 1.5e-4, 0.9, 5e-2, 0.8, 0.01]
          ],
          "input": [],
          "output": [],
          "model_param": [],
        },
        // excel数据列
        dataHeaderIndex: [
          "Gw", "Gw1", "ti", "pi", "po", "to", "pc", "tw",
        ],
        model_type_clicked: "",
        model_param: [],
      };
    },
    computed: {},
    created() {
      this.getModelList();
    },
    mounted() {},
    updated() {},
    methods: {
      // 获取模型列表
      getModelList() {
        return new Promise((resolve, reject) => {
          STORE
            .dispatch("Model/getModelList")
            .then((res) => {
              this.tableData = this.processModelListData(res.data.data);
              resolve(res);
            })
            .catch((error) => {
              reject(error);
            })
        });
      },
      // 处理模型列表数据
      processModelListData(modelListData) {
        for (let i = 0; i < modelListData.length; i++) {
          modelListData[i].train_loss = this.GLOBAL.getFixedTo(parseFloat(modelListData[i].train_loss), 3)
          for (let j = 0; j < this.model_type_list.length; j++) {
            if (modelListData[i].model_type == this.model_type_list[j].value) {
              modelListData[i].model_type = this.model_type_list[j].label;
            }
          }
          modelListData[i].isSelected = false;
        }
        return modelListData;
      },
      // 新建模型按钮点击事件
      gotoModelTrain() {
        this.$router.push({ path: '/ModelTrain' })
      },
      // 选择框数值变化事件
      predictSelectChange() {
        this.sendFilterData();
      },
      // 输入框失去焦点或用户回车事件
      predictInputChange() {
        this.sendFilterData();
      },
      // 发送筛选框数据请求
      sendFilterData() {
        this.filterData.model_type = this.model_type_selected;
        this.filterData.model_name = this.model_name_inputted;
        return new Promise((resolve, reject) => {
          STORE
            .dispatch("Model/getModelListByFilter", this.filterData)
            .then((res) => {
              this.tableData = this.processModelListData(res.data.data);
              resolve(res);
            })
            .catch((error) => {
              reject(error);
            })
        });
      },
      // 选择模型事件
      selectModel(row) {
        if (row.isSelected == true) {
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].isSelected = false;
          }
          this.model_type_clicked = "";
          this.modelIndex = -1;
        }
        else {
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].isSelected = false;
            if (row.model_id == this.tableData[i].model_id) {
              this.modelIndex = i
              this.model_type_clicked = row.model_type;
            }
          }
          row.isSelected = true;
        }
      },
      // excel文件上传成功事件
      excelUploadSuccess(excelData) {
        if (this.modelIndex == -1) {
          this.$message({
            message: "请勾选需要训练的模型类型",
            type: 'error'
          });
        }
        else {
          let processedData = this.processExcelData(excelData);
          this.generateRequestData(processedData);
          this.$message({
            message: "测试数据上传成功",
            type: 'success'
          });
          this.isPredicting = true;
          if (this.model_type_clicked.indexOf('GA') != -1 || this.model_type_clicked.indexOf('PSO') != -1) {
            this.getMechanismParam(this.requestData.id).then(() => {
              return new Promise((resolve, reject) => {
                STORE
                  .dispatch("Model/mechanismModelPredict", this.requestData)
                  .then((res) => {
                    let model_info = {}
                    let resData = {
                      "model_info": model_info,
                      "model_result": Object.assign({
                        'truth': [],
                      }, res.data),
                    }
                    this.$router.push({
                      path: '/MechanismResult',
                      query: {
                        from: "predict",
                        resultData: resData,
                      }
                    });
                    resolve(res);
                  })
                  .catch((error) => {
                    reject(error);
                  })
              });
            })
          }
          else {
            return new Promise((resolve, reject) => {
              STORE
                .dispatch("Model/modelPredict", this.requestData)
                .then((res) => {
                  this.$router.push({
                    path: '/DatadrivenModelResult',
                    query: {
                      from: "predict",
                      resultData: res.data.data,
                    }
                  });
                  resolve(res);
                })
                .catch((error) => {
                  reject(error);
                })
            });
          }
        }
      },
      // 处理excel文件
      processExcelData(excelData) {
        let resInputData = [];
        let resOutputData = [];
        let excelResults = excelData.results;
        for (let i = 0; i < excelResults.length; i++) {
          let inputData = []
          for (let j = 0; j < 4; j++) {
            inputData.push(excelResults[i][this.dataHeaderIndex[j]]);
          }
          let outputData = []
          for (let j = 4; j < 8; j++) {
            outputData.push(excelResults[i][this.dataHeaderIndex[j]]);
          }
          resInputData.push(inputData);
          resOutputData.push(outputData);
        }
        let resData = {};
        resData.inputData = resInputData;
        resData.outputData = resOutputData;
        return resData;
      },
      // 生成请求数据
      generateRequestData(processedData) {
        this.requestData.id = this.tableData[this.modelIndex].model_id;
        this.requestData.input = processedData.inputData;
        this.requestData.output = processedData.outputData;
      },
      async getMechanismParam(modelID) {
        return new Promise((resolve, reject) => {
          STORE
            .dispatch("Model/getMechanismModelParam", { 'model_id': modelID })
            .then((res) => {
              this.model_param = res.data.data.param;
              this.requestData.model_param = res.data.data.param;
              resolve(res);
            })
            .catch((error) => {
              reject(error);
            })
        });
      }
    },
  }
</script>

<style>
  .modelpredict_framework_predicting {
    height: 600px;
    margin: 16px;
    padding: 24px;
    background-color: #fff;
    border-radius: 6px;
  }

  .loading_layout {
    margin-top: 50px;
  }

  .modelpredict_framework {
    margin: 16px;
    padding: 24px;
    background-color: #fff;
    border-radius: 6px;
  }

  .predict_filter_layout {
    margin-top: 15px;
    margin-left: 30px;
    margin-right: 30px;
  }

  .filter_button_content {
    text-align: left;
  }

  .filter_input_content {
    display: flex;
    text-align: center;
    justify-content: center;
  }

  .filter_select {
    width: 160px;
    margin-right: 10px;
  }

  .filter_input {
    width: 320px;
    margin-left: 10px;
  }

  .predict_table_layout {
    width: 1200px;
    margin-top: 30px;
    margin-left: 30px;
    margin-bottom: 60px;
  }

  .predict_table {
    margin: 0 auto;
  }

  .el-table th {
    padding: 0;
  }

  .empty_image {
    margin: 0 auto;
    width: 160px;
    height: 160px;
  }

  .empty_text {
    margin-top: 0;
    font-size: 16px;
    line-height: 1.7;
  }

  .table_title {
    font-size: 14px;
    font-weight: normal;
    color: #333;
    opacity: 0.8;
  }

  .select_button {
    font-size: 14px;
  }

  .excel_select_layout {
    margin-top: 0;
    margin-left: 30px;
  }

  .el-table__body-wrapper::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  .el-table__body-wrapper::-webkit-scrollbar-track {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 4px rgba(247, 247, 249, 0.8);
    background-color: #eeeeee;
  }

  .el-table__body-wrapper::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 4px rgba(247, 247, 249, 0.8);
    background-color: rgba(144, 147, 153, 0.6);
  }
</style>