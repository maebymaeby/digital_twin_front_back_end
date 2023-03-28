<template>
  <el-row class="usermodel_framework">
    <!-- 筛选框部分 -->
    <el-col class="user_filter_layout" :span="24">
      <el-col :span="4" class="filter_button_content">
        <el-button type="primary" @click="gotoModelTrain">新建模型</el-button>
      </el-col>
      <el-col :span="8" :offset="11" class="filter_input_content">
        <el-select v-model="model_type_selected" class="filter_select" placeholder="全部模型" @change="userSelectChange()" clearable>
          <el-option v-for="item in model_type_list" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-input v-model="model_name_inputted" class="filter_input" placeholder="请输入模型名称" @change="userInputChange()" clearable>
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-col>
    </el-col>
    <!-- 表格部分 -->
    <el-col class="user_table_layout" :span="24">
      <el-table class="user_table" :data="tableData" :header-cell-style="tabelHeaderCellStyle" max-height="390" border>
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
            <p class="table_title">模型操作</p>
          </template>
          <template slot-scope="scope">
            <div class="select_operation">
              <el-button type="text" @click="editModel(scope.row)">修改</el-button>
              <el-button type="text" @click="deleteModel(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <!-- 模型信息填写对话框 -->
    <el-dialog :visible.sync="editModelVisible" :append-to-body="true" width="600px">
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
        <el-button @click="cofirmEditModel()" style="margin-right:20px;">确认</el-button>
        <el-button @click="exitEditModel()">取消</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
  import STORE from '@/store'

  export default {
    name: "ModelPredict",
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
        // 修改模型对话框
        editModelVisible: false,
        willEditRow: {},
        modelInfoForm: {
          name: "",
          type: "",
          description: "",
        },
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
      userSelectChange() {
        this.sendFilterData();
      },
      // 输入框失去焦点或用户回车事件
      userInputChange() {
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
      // 修改模型信息
      editModel(row) {
        this.editModelVisible = true;
        this.willEditRow = row;
        this.modelInfoForm.name = row.model_name;
        this.modelInfoForm.type = row.model_type;
        this.modelInfoForm.description = row.model_description;
      },
      cofirmEditModel() {
        let requestData = {
          'model_id': this.willEditRow.model_id,
          'model_name': this.modelInfoForm.name,
          'model_description': this.modelInfoForm.description,
        }
        return new Promise((resolve, reject) => {
          STORE
            .dispatch("Model/editModelInfo", requestData)
            .then((res) => {
              this.$message({
                message: res.data.message,
                type: 'success'
              });
              this.getModelList();
              this.exitEditModel();
              resolve(res);
            })
            .catch((error) => {
              reject(error);
            })
        });
      },
      exitEditModel() {
        this.willEditRow = {};
        this.editModelVisible = false;
      },
      // 删除模型
      deleteModel(row) {
        let requestData = {
          'model_id': row.model_id,
        }
        this.$confirm('此操作将永久删除该模型, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            let model_type_clicked = row.model_type
            if ((model_type_clicked.indexOf('GA')) != -1 || model_type_clicked.indexOf('PSO') != -1) {
              return new Promise((resolve, reject) => {
                STORE
                  .dispatch("Model/deleteMechanismModel", requestData)
                  .then((res) => {
                    this.$message({
                      message: res.data.message,
                      type: 'success'
                    });
                    this.getModelList();
                    resolve(res);
                  })
                  .catch((error) => {
                    reject(error);
                  })
              });
            }
            else {
              return new Promise((resolve, reject) => {
                STORE
                  .dispatch("Model/deleteModel", requestData)
                  .then((res) => {
                    this.$message({
                      message: res.data.message,
                      type: 'success'
                    });
                    this.getModelList();
                    resolve(res);
                  })
                  .catch((error) => {
                    reject(error);
                  })
              });
            }
          })
      },
    },
  }
</script>

<style>
  .usermodel_framework_usering {
    height: 600px;
    margin: 16px;
    padding: 24px;
    background-color: #fff;
    border-radius: 6px;
  }

  .loading_layout {
    margin-top: 50px;
  }

  .usermodel_framework {
    margin: 16px;
    padding: 24px;
    background-color: #fff;
    border-radius: 6px;
  }

  .user_filter_layout {
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

  .user_table_layout {
    width: 1200px;
    margin-top: 30px;
    margin-left: 30px;
    margin-bottom: 60px;
  }

  .user_table {
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