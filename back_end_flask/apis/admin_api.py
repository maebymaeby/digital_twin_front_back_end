from flask import make_response
from flask_jwt_extended import create_access_token, get_jwt_identity
from copy import deepcopy
from dbs.db_schema import db
from dbs.db_table import UserInfos, ModelInfos, MessageInfos
import utils


def admin_login(requestData):
    response_data = deepcopy(utils.ResponseData)
    response_status = 100
    username = requestData['username']
    password = requestData['password']
    user_object = UserInfos.query.filter_by(username=username).first()
    # 801 用户名或密码错误
    if not user_object:
        response_data['message'] = '用户名或密码错误'
        response_status = 801
    else:
        if user_object.password != password:
            response_data['message'] = '用户名或密码错误'
            response_status = 801
        # 802 当前用户未激活
        elif user_object.available == 0:
            response_data['message'] = '当前用户未激活'
            response_status = 802
        # 803 当前用户无权限
        elif user_object.access == 1:
            response_data['message'] = '当前用户无权限'
            response_status = 803
        # 登录成功
        else:
            response_data['message'] = '管理员登录成功'
            response_data['data']['name'] = user_object.name
            response_data['data']['title'] = user_object.title
            response_data['data']['company'] = user_object.company

            token = create_access_token(identity=username)
            response_data['data']['token'] = token

            response_status = 200

    response_body = make_response(response_data, response_status)
    return response_body


def getModelList():
    model_info_object_list = ModelInfos.query.all()
    model_info_dict_list = utils.object_to_dict_list(model_info_object_list, ModelInfos.model_info_attr)
    response_data = deepcopy(utils.ResponseData)
    response_data['data'] = model_info_dict_list
    response_data['message'] = '模型列表请求成功'
    return response_data

def getModelListByFilter(requestData):
    model_name = requestData['model_name']
    model_type = requestData['model_type']
    if(model_name == "" and model_type == ""):
        model_info_object_list = ModelInfos.query.all()
    elif(model_name == ""):
        model_info_object_list = ModelInfos.query.filter(ModelInfos.model_type == model_type).all()
    elif (model_type == ""):
        model_info_object_list = ModelInfos.query.filter(ModelInfos.model_name.like("%"+model_name+"%")).all()
    else:
        model_info_object_list = ModelInfos.query.filter(ModelInfos.model_type == model_type, ModelInfos.model_name.like("%"+model_name+"%")).all()
    model_info_dict_list = utils.object_to_dict_list(model_info_object_list, ModelInfos.model_info_attr)
    response_data = deepcopy(utils.ResponseData)
    response_data['data'] = model_info_dict_list
    response_data['message'] = '模型列表请求成功'
    return response_data


def getUserList():
    user_info_object_list = UserInfos.query.all()
    user_info_dict_list = utils.object_to_dict_list(user_info_object_list, UserInfos.user_info_attr)
    response_data = deepcopy(utils.ResponseData)
    response_data['data'] = user_info_dict_list
    response_data['message'] = '用户列表请求成功'
    return response_data

def registerUser(requestData):
    username = requestData['username']
    password = requestData['password']
    name = requestData['name']
    company = requestData['company']
    title = requestData['title']
    email = requestData['email']
    phone = requestData['phone']
    access = requestData['access']
    available = requestData['available']
    user_info_object = UserInfos(
        username=username,
        password=password,
        name=name,
        company=company,
        title=title,
        email=email,
        phone=phone,
        access=access,
        available=available,)
    db.session.add(user_info_object)
    db.session.commit()
    response_data = deepcopy(utils.ResponseData)
    response_data['message'] = "新用户注册成功"
    return response_data

def updateUser(requestData):
    username = requestData['username']
    password = requestData['password']
    name = requestData['name']
    company = requestData['company']
    title = requestData['title']
    email = requestData['email']
    phone = requestData['phone']
    access = requestData['access']
    available = requestData['available']
    UserInfos.query.filter_by(username=username).update({
        'password':password,
        'name':name,
        'company':company,
        'title':title,
        'email':email,
        'phone':phone,
        'access':access,
        'available':available,
    })
    db.session.commit()
    response_data = deepcopy(utils.ResponseData)
    response_data['message'] = "用户信息修改成功"
    return response_data

def deleteUser(requestData):
    username = requestData['username']
    UserInfos.query.filter_by(username=username).delete()
    db.session.commit()
    response_data = deepcopy(utils.ResponseData)
    response_data['message'] = "用户删除成功"
    return response_data


def sendMessage(requestData):
    current_user = get_jwt_identity()

    create_time = requestData['create_time']
    message_title = requestData['message_title']
    message_content = requestData['message_content']

    message_info_object = MessageInfos(
        username_from = current_user,
        create_time=create_time,
        message_title=message_title,
        message_content=message_content, )
    
    db.session.add(message_info_object)
    db.session.commit()
    response_data = deepcopy(utils.ResponseData)
    response_data['message'] = "公告发送成功"
    return response_data