import numpy as np
import warnings
from sklearn.svm import SVR
from sklearn.covariance import EllipticEnvelope

warnings.filterwarnings('ignore')
from sklearn.multioutput import MultiOutputRegressor
import xgboost as xgb
from sklearn.ensemble import IsolationForest
from sklearn.metrics import mean_squared_error, mean_absolute_error
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from flask import Flask, jsonify, request, render_template
from hpelm import ELM
import joblib
import sklearn
from sklearn.metrics import r2_score
import pandas as pd
import matplotlib.pyplot as plt


x = ['gw', 'gw1', 'ti', 'pi']
y = ['po', 'to', 'pc', 'tw']
unit = ['Kpa','C','Kpa','C']


def cal_iqr(arr):  # 计算四分位距
    qr1 = np.quantile(arr, 0.25, method='linear')  # 下四分位数
    qr3 = np.quantile(arr, 0.75, method='linear')  # 上四分位数
    iqr = qr3 - qr1  # 计算四分位距
    return iqr, qr1, qr3

def log(x):  # 计算log
    return np.log10(x)


def train(model_type, input_data, output_data, model_path, scaler_path):  # 模型训练
    message = ''

    scaler = StandardScaler()

    cnt_array = np.where(input_data, 0, 1)
    zero_count = np.sum(cnt_array)
    if zero_count > 0.7 * input_data.shape[0] * input_data.shape[1]:
        shutdown = True
    else:
        shutdown = False

    if len(input_data) > 100:
        predictions = np.array([True for i in range(len(input_data))])
        for i in range(input_data.shape[1]):
            IQR, Q1, Q3 = cal_iqr(input_data[:, i])
            q1 = (Q1 - 8 * IQR)
            q2 = (Q3 + 8 * IQR)
            predictions = predictions & (input_data[:, i] > q1) & (input_data[:, i] < q2)

        input_data = input_data[predictions == 1]
        output_data = output_data[predictions == 1]

        predictions = EllipticEnvelope().fit(input_data).predict(input_data)
        input_data = input_data[predictions == 1]
        output_data = output_data[predictions == 1]

    all_data = np.concatenate([input_data, output_data], axis=1)

    na_index = ~np.isnan(all_data).any(axis=1)
    input_data = input_data[na_index]
    output_data = output_data[na_index]

    all_data = np.concatenate([input_data, output_data], axis=1)

    preds = []

    Y = output_data
    X = input_data

    value_mean = Y.mean(axis=0)
    train_per = 0.9
    train_X, test_X, train_y, test_y = X[:int(len(X) * train_per)], X[int(len(X) * train_per):], Y[:int(len(X) * train_per)], Y[int(len(X) * train_per):]
    train_X, train_y = sklearn.utils.shuffle(train_X, train_y)
    train_X = scaler.fit_transform(train_X)
    joblib.dump(scaler, scaler_path)
    test_X = scaler.transform(test_X)
    if train_y.shape[1] == 1:
        if model_type == 'xgb':
            model = xgb.XGBRegressor(objective='reg:squarederror').fit(train_X, train_y)
            preds = model.predict(test_X)
        elif model_type == 'svm':
            model = SVR().fit(train_X, train_y)
            preds = model.predict(test_X)
        elif model_type == 'forest':
            model = RandomForestRegressor()
            model.fit(train_X, train_y)
            preds = model.predict(test_X)
        elif model_type == 'elm':
            model = ELM(train_X.shape[1], train_y.shape[1])
            model.add_neurons(20, "sigm")
            model.train(train_X, train_y, "r")
            preds = model.predict(test_X)
    else:
        if model_type == 'xgb':
            model = MultiOutputRegressor(xgb.XGBRegressor(objective='reg:squarederror')).fit(train_X, train_y)
            preds = model.predict(test_X)
        elif model_type == 'svm':
            model = MultiOutputRegressor(SVR()).fit(train_X, train_y)
            preds = model.predict(test_X)
        elif model_type == 'forest':
            model = RandomForestRegressor()
            model.fit(train_X, train_y)
            preds = model.predict(test_X)
        elif model_type == 'elm':
            model = ELM(train_X.shape[1], train_y.shape[1])
            model.add_neurons(20, "sigm")
            model.train(train_X, train_y, "r")
            preds = model.predict(test_X)
    if model_type != 'elm':
        joblib.dump(model, model_path)
    else:
        model.save(model_path)

    r2s = []
    rmses = []
    maes = []
    preds = preds.reshape(-1, Y.shape[1])
    for i in range(Y.shape[1]):
        r2s.append(r2_score(test_y[:, i], preds[:, i]))

        RMSE = np.linalg.norm(test_y[:, i] - preds[:, i], ord=2) / len(test_y) ** 0.5
        mae = mean_absolute_error(test_y[:, i], preds[:, i])
        rmses.append(RMSE / value_mean[i])
        maes.append(mae / value_mean[i])


    loss_rates = (np.array(maes) + np.array(rmses)) / 2

    std = np.std(preds, axis=0).tolist()

    if shutdown:
        message += '数据中0极多，可能存在停机现象'
    else:
        message += '训练完成'

    results = {
        "message": message,
        'truth': test_y.tolist(),
        'pred': preds.tolist(),
        'loss': loss_rates.sum(),
        'r2': r2s,
        'std': std,
        'mae':maes,
        'rmse':rmses,
    }

    return results


def predict(model_type, input_data, model_path, scaler_path,):  # 模型测试
    output_size = 4

    na_index = ~np.isnan(input_data).any(axis=1)
    input_data = input_data[na_index]

    preds = []

    X = np.array(input_data)
    scaler = joblib.load(scaler_path)

    test_X = scaler.transform(X)
    if model_type == 'xgb':
        model = joblib.load(model_path)
        preds = model.predict(test_X)
    elif model_type == 'svm':
        model = joblib.load(model_path)
        preds = model.predict(test_X)
    elif model_type == 'forest':
        model = joblib.load(model_path)
        preds = model.predict(test_X)
    elif model_type == 'elm':
        model = ELM(X.shape[1], output_size)
        model.add_neurons(20, "sigm")
        model.load(model_path)
        preds = model.predict(test_X)

    results = {
        "message": "模型预测成功",
        'pred': preds.tolist(),
    }

    return results


from sklearn.metrics import mean_absolute_error
import math

def addNewdata(labels, preds):
    avg_mae = []
    avgs = [np.mean(labels[:, i]) for i in range(preds.shape[1])]
    for i in range(preds.shape[1]):
        result = mean_absolute_error(labels[:, i].reshape(-1, 1), preds[:, i].reshape(-1, 1))
        avg_mae.append(result)
    if np.mean(avg_mae) < 0.01 * np.mean(avgs):
        return None
    else:
        indexs = []
        avgs = [np.mean(labels[:, i]) for i in range(preds.shape[1])]
        for j in range(len(preds)):
            loss = 0
            for i in range(preds.shape[1]):
                loss += math.fabs((preds[j][i] - labels[j][i])) / (avgs[i] + 0.0000000001)
            if loss / preds.shape[1] > 0.05:
                indexs.append(j)
        return indexs

def finetune(model_type, input_data, output_data, old_model_path, old_scaler_path, new_model_path, new_scaler_path):  # 增量学习
    preds = np.array(predict(model_type, input_data[:int(len(input_data)*0.9)], old_model_path, old_scaler_path)['pred'])
    message = ''
    if len(preds.shape) == 1:
        preds = preds.reshape(-1, 1)
    finetune_flag = True

    input_data_valid = input_data[int(len(input_data)*0.9):]
    output_data_valid = output_data[int(len(output_data)*0.9):]

    newdata = addNewdata(output_data[:int(len(output_data)*0.9)], preds)
    if newdata == None or len(newdata) == 0:
        finetune_flag = False
        message += "当前数据不需要增量学习"
    else:
        input_data = input_data[newdata, :]
        output_data = output_data[newdata, :]

        cnt_array = np.where(input_data, 0, 1)
        zero_count = np.sum(cnt_array)
        if zero_count > 0.7 * input_data.shape[0] * input_data.shape[1]:
            shutdown = True
        else:
            shutdown = False
        
        if len(input_data) > 150:
            predictions = np.array([True for i in range(len(input_data))])
            for i in range(input_data.shape[1]):
                IQR, Q1, Q3 = cal_iqr(input_data[:, i])
                q1 = (Q1 - 5 * IQR)
                q2 = (Q3 + 5 * IQR)
                predictions = predictions & (input_data[:, i] > q1) & (input_data[:, i] < q2)
            input_data = input_data[predictions == 1]
            output_data = output_data[predictions == 1]

            el = IsolationForest().fit(input_data)
            predictions = el.predict(input_data)
            input_data = input_data[predictions == 1]
            output_data = output_data[predictions == 1]

        all_data = np.concatenate([input_data, output_data], axis=1)
        na_index = ~np.isnan(all_data).any(axis=1)
        input_data = input_data[na_index]
        output_data = output_data[na_index]

        all_data_valid = np.concatenate([input_data_valid, output_data_valid], axis=1)
        na_index_iov = ~np.isnan(all_data_valid).any(axis=1)
        input_data_valid = input_data_valid[na_index_iov]
        output_data_valid = output_data_valid[na_index_iov]

        preds = []

        Y = output_data
        X = input_data
        Y_valid = output_data_valid
        X_valid = input_data_valid
        value_mean = Y.mean(axis=0)
        train_X, test_X, train_y, test_y = X, X_valid, Y, Y_valid
        train_X, train_y = sklearn.utils.shuffle(train_X, train_y)
        scaler = MinMaxScaler()
        train_X = scaler.fit_transform(train_X)

        test_X = scaler.transform(test_X)
        if train_y.shape[1] == 1:
            if model_type == 'xgb':
                model = joblib.load(old_model_path)
                preds = model.predict(test_X)
            elif model_type == 'svm':
                model = joblib.load(old_model_path)
                preds = model.predict(test_X)
            elif model_type == 'forest':
                model = joblib.load(old_model_path)
                model.fit(train_X, train_y)
                preds = model.predict(test_X)
            elif model_type == 'elm':
                model = ELM(X.shape[1], Y.shape[1])
                model.add_neurons(20, "sigm")
                model.load(old_model_path)
                model.train(train_X, train_y, "r")
                preds = model.predict(test_X)
        else:
            if model_type == 'xgb':
                model = joblib.load(old_model_path)
                preds = model.predict(test_X)
            elif model_type == 'svm':
                model = joblib.load(old_model_path)
                preds = model.predict(test_X)
            elif model_type == 'forest':
                model = joblib.load(old_model_path)
                model.fit(train_X, train_y)
                preds = model.predict(test_X)
            elif model_type == 'elm':
                model = ELM(X.shape[1], Y.shape[1])
                model.add_neurons(20, "sigm")
                model.load(old_model_path)
                model.train(train_X, train_y, "r")
                preds = model.predict(test_X)

        loss_rates = []
        r2s = []
        rmses = []
        maes = []
        preds = preds.reshape(-1, Y.shape[1])
        for i in range(Y.shape[1]):
            r2s.append(r2_score(test_y[:, i], preds[:, i]))
            RMSE = np.linalg.norm(test_y[:, i] - preds[:, i], ord=2) / len(test_y) ** 0.5
            mae = mean_absolute_error(test_y[:, i], preds[:, i])
            rmses.append(RMSE / value_mean[i])
            maes.append(mae / value_mean[i])

        loss_rates = (np.array(maes) + np.array(rmses)) / 2

        if model_type != 'elm':
            joblib.dump(model, new_model_path)
        else:
            model.save(new_model_path)

        joblib.dump(scaler, new_scaler_path)
        std = np.std(preds, axis=0).tolist()

        if shutdown:
            message += '数据中0极多，可能存在停机现象'
        else:
            message += '模型增量学习完成'

    if finetune_flag:
        results = {
            'finetuned': finetune_flag,
            'message': message,
            'truth': test_y.tolist(),
            'pred': preds.tolist(),
            'loss': loss_rates.sum(),
            'r2': r2s,
            'std': std,
            'mae':maes,
            'rmse':rmses,
        }
    else:
            results = {
            'finetuned': finetune_flag,
            'message': message,
            }
    return results