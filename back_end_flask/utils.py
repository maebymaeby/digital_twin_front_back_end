import sys
import logging
from logging import handlers

#********************logging日志相关********************#

# 日志级别关系映射
level_relations = {
    'debug': logging.DEBUG,
    'info': logging.INFO,
    'warning': logging.WARNING,
    'error': logging.ERROR,
    'crit': logging.CRITICAL
}

def _get_logger(filename, level='info'):
    # 创建日志对象
    log = logging.getLogger(filename)
    # 设置日志级别
    log.setLevel(level_relations.get(level))
    # 日志输出格式
    fmt = logging.Formatter('%(asctime)s %(thread)d %(filename)s[line:%(lineno)d] - %(levelname)s: %(message)s')
    # 输出到控制台
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(fmt)
    # 输出到文件
    # 日志文件按天进行保存，每天一个日志文件
    file_handler = handlers.TimedRotatingFileHandler(filename=filename, when='D', backupCount=1, encoding='utf-8')
    file_handler.setFormatter(fmt)

    log.addHandler(console_handler)
    log.addHandler(file_handler)
    return log

# 明确指定日志输出的文件路径和日志级别
# logger = _get_logger('../logs/model.log', 'info')


#********************SQLAlchemy相关********************#

# 将SQLAlchemy返回的对象转成字典
def object_to_dict(obj, objAttr):
    dict = {}
    for attr in objAttr:
        dict[attr] = getattr(obj, attr)
    return dict


# 将SQLAlchemy返回的对象列表转为字典列表
def object_to_dict_list(objList, objAttr):
    dictList = []
    for obj in objList:
        dict = {}
        for attr in objAttr:
            dict[attr] = getattr(obj, attr)
        dictList.append(dict)
    return dictList


#********************Response数据相关********************#

# 请求数据
ResponseData = {
    'data': {},
    'message': '',
}