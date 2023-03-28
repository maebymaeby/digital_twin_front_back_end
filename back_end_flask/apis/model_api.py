import numpy as np
from copy import deepcopy
import datetime
import os
from flask import make_response
from flask_jwt_extended import get_jwt_identity
from dbs.db_schema import db
from dbs.db_table import ModelInfos, DatadrivenModels, MechanismModels
from datadriven import *
import utils


def trainFromRequest(requestData):
    # 根据请求数据初始化模型训练信息
    # 模型创建时间
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    # 模型种类：XGBoost / SVM / RandomForest / ELM
    model_type = requestData['model_type']
    # 特征输入：Gw / Gw1 / ti / pi
    input_data = np.array(requestData['input'])
    # 特征输出：po / to / pc / tw
    output_data = np.array(requestData['output'])
    # 模型ID
    model_id = (requestData['id'].replace(':', '_')).replace('-', '_')+ '_' + model_type
    
    # 模型保存地址
    model_path = './models/Model_{0}.m'.format(model_id)
    # Scaler保存地址
    scaler_path = './models/Scaler_{0}.m'.format(model_id)

    train_result = train(model_type,input_data, output_data, model_path, scaler_path)

    response_data = deepcopy(utils.ResponseData)

    response_data['message'] = train_result['message']

    response_data['data']['model_info'] = {}
    response_data['data']['model_info']['model_id'] = model_id
    response_data['data']['model_info']['model_type'] = model_type
    response_data['data']['model_info']['create_time'] = current_time
    response_data['data']['model_info']['train_length'] = len(input_data)
    response_data['data']['model_info']['train_loss'] = train_result['loss']
    response_data['data']['model_info']['model_path'] = model_path
    response_data['data']['model_info']['scaler_path'] = scaler_path

    response_data['data']['model_result'] = {}
    response_data['data']['model_result']['truth'] = train_result['truth']
    response_data['data']['model_result']['pred'] = train_result['pred']
    response_data['data']['model_result']['r2'] = train_result['r2']
    response_data['data']['model_result']['std'] = train_result['std']
    response_data['data']['model_result']['mae'] = train_result['mae']
    response_data['data']['model_result']['rmse'] = train_result['rmse']

    return response_data


def predictFromRequest(requestData):
    # 模型ID
    model_id = requestData['id']

    # 根据模型ID查询model_path和scaler_path
    datedriven_model_object = DatadrivenModels.query.filter_by(model_id=model_id).first()
    model_path = datedriven_model_object.model_path
    scaler_path = datedriven_model_object.scaler_path

    # 根据模型ID查询model_type
    model_info_object = ModelInfos.query.filter_by(model_id=model_id).first()
    model_type = model_info_object.model_type

    # 获取输入输出数据
    input_data = np.array(requestData['input'])
    output_data = np.array(requestData['output'])

    predict_result = predict(model_type, input_data, model_path, scaler_path,)

    response_data = deepcopy(utils.ResponseData)

    response_data['message'] = predict_result['message']
    response_data['data']['model_result'] = {}
    response_data['data']['model_result']['truth'] = []
    response_data['data']['model_result']['pred'] = predict_result['pred']

    return response_data


def finetuneFromRequest(requestData):
    # 旧模型ID
    old_model_id = requestData['id']
    # 根据旧模型ID查询model_path和scaler_path
    datedriven_model_object = DatadrivenModels.query.filter_by(model_id=old_model_id).first()
    old_model_path = datedriven_model_object.model_path
    old_scaler_path = datedriven_model_object.scaler_path

    # 根据旧模型ID查询model_type
    model_info_object = ModelInfos.query.filter_by(model_id=old_model_id).first()
    model_type = model_info_object.model_type

    # 模型创建时间
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    # 特征输入：Gw / Gw1 / ti / pi
    input_data = np.array(requestData['input'])
    # 特征输出：po / to / pc / tw
    output_data = np.array(requestData['output'])
    # 新模型ID
    new_model_id = (requestData['id'].replace(':', '_')).replace('-', '_') + '_' + model_type
    
    # 模型保存地址
    new_model_path = './models/Model_{0}.m'.format(new_model_id)
    # Scaler保存地址
    new_scaler_path = './models/Scaler_{0}.m'.format(new_model_id)
    print("New Scaler Path: ", new_scaler_path)

    finetune_result = finetune(model_type,input_data, output_data, old_model_path, old_scaler_path, new_model_path, new_scaler_path)

    response_data = deepcopy(utils.ResponseData)
    response_status = -1

    response_data['message'] = finetune_result['message']

    if(finetune_result['finetuned']):
        response_data['data']['model_info'] = {}
        response_data['data']['model_info']['model_id'] = new_model_id
        response_data['data']['model_info']['model_type'] = model_type
        response_data['data']['model_info']['create_time'] = current_time
        response_data['data']['model_info']['train_length'] = len(input_data)
        response_data['data']['model_info']['train_loss'] = finetune_result['loss']
        response_data['data']['model_info']['model_path'] = new_model_path
        response_data['data']['model_info']['scaler_path'] = new_scaler_path

        response_data['data']['model_result'] = {}
        response_data['data']['model_result']['truth'] = finetune_result['truth']
        response_data['data']['model_result']['pred'] = finetune_result['pred']
        response_data['data']['model_result']['r2'] = finetune_result['r2']
        response_data['data']['model_result']['std'] = finetune_result['std']
        response_data['data']['model_result']['mae'] = finetune_result['mae']
        response_data['data']['model_result']['rmse'] = finetune_result['rmse']
        # 增量学习成功
        response_status = 200

    else:
        response_data['data']['model_info'] = {}
        response_data['data']['model_result'] = {}
        # 当前数据不需要增量学习
        response_status = 702

    response_body = make_response(response_data, response_status)
    return response_body


def getModelList():
    current_user = get_jwt_identity()
    model_info_object_list = ModelInfos.query.filter_by(username=current_user).all()
    model_info_dict_list = utils.object_to_dict_list(model_info_object_list, ModelInfos.model_info_attr)
    response_data = deepcopy(utils.ResponseData)
    response_data['data'] = model_info_dict_list
    return response_data

def getModelListByFilter(requestData):
    current_user = get_jwt_identity()
    model_name = requestData['model_name']
    model_type = requestData['model_type']
    if(model_name == "" and model_type == ""):
        model_info_object_list = ModelInfos.query.filter_by(username=current_user).all()
    elif(model_name == ""):
        model_info_object_list = ModelInfos.query.filter(ModelInfos.username == current_user, ModelInfos.model_type == model_type).all()
    elif (model_type == ""):
        model_info_object_list = ModelInfos.query.filter(ModelInfos.username == current_user, ModelInfos.model_name.like("%"+model_name+"%")).all()
    else:
        model_info_object_list = ModelInfos.query.filter(ModelInfos.username == current_user, ModelInfos.model_type == model_type, ModelInfos.model_name.like("%"+model_name+"%")).all()
    model_info_dict_list = utils.object_to_dict_list(model_info_object_list, ModelInfos.model_info_attr)
    response_data = deepcopy(utils.ResponseData)
    response_data['data'] = model_info_dict_list
    return response_data


def saveModel(requestData):
    save_model_flag = requestData['save_model_flag']

    current_user = get_jwt_identity()

    model_id = requestData['model_id']
    model_type = requestData['model_type']
    create_time = requestData['create_time']
    train_length = requestData['train_length']
    train_loss = requestData['train_loss']

    model_path = requestData['model_path']
    scaler_path = requestData['scaler_path']

    model_name = requestData['model_name']
    model_description = requestData['model_description']

    message = ''

    if save_model_flag:
        model_info_object = ModelInfos(
            model_id=model_id,
            model_name=model_name,
            model_type=model_type,
            model_description=model_description,
            create_time=create_time,
            train_length=train_length,
            train_loss=train_loss,
            username=current_user,)
        db.session.add(model_info_object)
        db.session.commit()

        datadriven_model_object = DatadrivenModels(
            model_id=model_id,
            model_path=model_path,
            scaler_path=scaler_path)
        db.session.add(datadriven_model_object)
        db.session.commit()

        message += '保存模型成功'
    else:
        for root, dirs, files in os.walk("./models"):
            for file in files:
                if model_id in file:
                    os.remove(os.path.join(root, file))
        
        message += '未保存模型'
    
    response_data = deepcopy(utils.ResponseData)
    response_data['data']['message'] = message
    return response_data

def updateModel(requestData):
    model_id = requestData['model_id']
    model_name = requestData['model_name']
    model_description = requestData['model_description']
    ModelInfos.query.filter_by(model_id=model_id).update({
        'model_name':model_name,
        'model_description':model_description,
    })
    db.session.commit()
    response_data = deepcopy(utils.ResponseData)
    response_data['message'] = "模型信息更新成功"
    return response_data

def deleteModel(requestData):
    model_id = requestData['model_id']

    DatadrivenModels.query.filter_by(model_id=model_id).delete()
    db.session.commit()
    ModelInfos.query.filter_by(model_id=model_id).delete()
    db.session.commit()

    for root, dirs, files in os.walk("./models"):
        for file in files:
            if model_id in file:
                os.remove(os.path.join(root, file))
                break

    response_data = deepcopy(utils.ResponseData)
    response_data['message'] = '模型删除成功'
    return response_data


def saveMechanismModel(requestData):
    save_model_flag = requestData['save_model_flag']

    current_user = get_jwt_identity()

    model_id = requestData['model_id']
    model_type = requestData['model_type']
    create_time = requestData['create_time']
    train_length = requestData['train_length']
    train_loss = requestData['train_loss']

    param1 = requestData['best_str'][0]
    param2 = requestData['best_str'][1]
    param3 = requestData['best_str'][2]
    param4 = requestData['best_str'][3]
    param5 = requestData['best_str'][4]
    param6 = requestData['best_str'][5]

    model_name = requestData['model_name']
    model_description = requestData['model_description']

    message = ''

    if save_model_flag:
        model_info_object = ModelInfos(
            model_id=model_id,
            model_name=model_name,
            model_type=model_type,
            model_description=model_description,
            create_time=create_time,
            train_length=train_length,
            train_loss=train_loss,
            username=current_user,)
        db.session.add(model_info_object)
        db.session.commit()

        mechanism_model_object = MechanismModels(
            model_id=model_id,
            param1 = param1,
            param2 = param2,
            param3 = param3,
            param4 = param4,
            param5 = param5,
            param6 = param6,
            )
        db.session.add(mechanism_model_object)
        db.session.commit()

        message += '保存模型成功'
    else:
        message += '未保存模型'
    
    response_data = deepcopy(utils.ResponseData)
    response_data['data']['message'] = message
    return response_data

def getMechanismModelParam(requestData):
    model_id = requestData['model_id']
    mechanism_model_object = MechanismModels.query.filter_by(model_id=model_id).first()
    response_data = deepcopy(utils.ResponseData)
    response_data['data']['param'] = []
    response_data['data']['param'].append(mechanism_model_object.param1)
    response_data['data']['param'].append(mechanism_model_object.param2)
    response_data['data']['param'].append(mechanism_model_object.param3)
    response_data['data']['param'].append(mechanism_model_object.param4)
    response_data['data']['param'].append(mechanism_model_object.param5)
    response_data['data']['param'].append(mechanism_model_object.param6)
    return response_data

def deleteMechanismModel(requestData):
    model_id = requestData['model_id']

    MechanismModels.query.filter_by(model_id=model_id).delete()
    db.session.commit()
    ModelInfos.query.filter_by(model_id=model_id).delete()
    db.session.commit()

    response_data = deepcopy(utils.ResponseData)
    response_data['message'] = '删除成功'
    return response_data