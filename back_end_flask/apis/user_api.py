from flask import make_response
from flask_jwt_extended import create_access_token, get_jwt_identity
from copy import deepcopy
import datetime
from dbs.db_schema import db
from dbs.db_table import UserInfos, MessageInfos
import utils


def user_login(requestData):
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
        elif user_object.access == 0:
            response_data['message'] = '当前用户无权限'
            response_status = 803
        # 登录成功
        else:
            response_data['message'] = '用户登录成功'
            response_data['data']['name'] = user_object.name
            response_data['data']['title'] = user_object.title
            response_data['data']['company'] = user_object.company

            token = create_access_token(identity=username)
            response_data['data']['token'] = token

            response_status = 200

    response_body = make_response(response_data, response_status)
    return response_body


def getUserInfo():
    current_user = get_jwt_identity()
    user_info_object_list = UserInfos.query.filter_by(username=current_user).all()
    user_info_dict_list = utils.object_to_dict_list(user_info_object_list, UserInfos.user_info_attr)
    print(user_info_dict_list)
    response_data = deepcopy(utils.ResponseData)
    response_data['data']['username'] = user_info_dict_list[0]['username']
    response_data['data']['password'] = user_info_dict_list[0]['password']
    response_data['data']['name'] = user_info_dict_list[0]['name']
    response_data['data']['title'] = user_info_dict_list[0]['title']
    response_data['data']['company'] = user_info_dict_list[0]['company']
    response_data['data']['phone'] = user_info_dict_list[0]['phone']
    response_data['data']['email'] = user_info_dict_list[0]['email']
    response_data['data']['access'] = user_info_dict_list[0]['access']
    response_data['data']['photo'] = user_info_dict_list[0]['photo']
    response_data['message'] = '用户信息获取成功'
    return response_data


def changeUserInfo(requestData):
    current_user = get_jwt_identity()

    password = requestData['password']
    phone = requestData['phone']
    email = requestData['email']
    photo = requestData['photo']

    UserInfos.query.filter_by(username=current_user).update({
        'password':password,
        'phone':phone,
        'email':email,
        'photo':photo,
    })
    db.session.commit()

    response_data = deepcopy(utils.ResponseData)
    response_data['message'] = "用户信息修改成功"
    return response_data


def getUserMessage():
    message_info_object_list = MessageInfos.query.all()
    message_info_dict_list = utils.object_to_dict_list(message_info_object_list, MessageInfos.message_info_attr)
    response_data = deepcopy(utils.ResponseData)
    response_data['data'] = message_info_dict_list
    response_data['message'] = "公告获取成功"
    return response_data
