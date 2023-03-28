from dbs.db_schema import db
from passlib.hash import sha256_crypt

class UserInfos(db.Model):
    __tablename__ = 'user_info'
    username = db.Column(db.String(255), primary_key=True, nullable=True,)
    password = db.Column(db.String(255),)
    name = db.Column(db.String(255), nullable=True,)
    company = db.Column(db.String(255), nullable=True,)
    title = db.Column(db.String(255), nullable=True,)
    phone = db.Column(db.String(255),)
    email = db.Column(db.String(255),)
    access = db.Column(db.Integer, nullable=True,)
    available = db.Column(db.Integer, nullable=True,)
    photo = db.Column(db.Integer,)
    user_info_attr = ['username', 'password', 'name', 'company', 'title', 'phone', 'email', 'access', 'available','photo']

    def hash_password(self, password):
        self.password = sha256_crypt(password)

    def verify_password(self, password):
        return sha256_crypt.verify(password, self.password)


class ModelInfos(db.Model):
    __tablename__ = 'model_info'
    model_id = db.Column(db.String(255), primary_key=True, nullable=True, )
    model_name = db.Column(db.String(255), nullable=True, )
    model_type = db.Column(db.String(255), nullable=True, )
    model_description = db.Column(db.String(255), )
    create_time = db.Column(db.DateTime, nullable=True, )
    train_length = db.Column(db.Integer, nullable=True, )
    train_loss = db.Column(db.Float, nullable=True, )
    username = db.Column(db.String(255), nullable=True, )
    model_info_attr = ['model_id', 'model_name', 'model_type', 'model_description', 'create_time', 'train_length', 'train_loss', 'username']


class DatadrivenModels(db.Model):
    __tablename__ = 'datadriven_model'
    model_id = db.Column(db.String(255), primary_key=True, nullable=True, )
    model_path = db.Column(db.String(255), nullable=True, )
    scaler_path = db.Column(db.String(255), nullable=True, )


class MechanismModels(db.Model):
    __tablename__ = 'mechanism_model'
    model_id = db.Column(db.String(255), primary_key=True, nullable=True, )
    param1 = db.Column(db.Float, nullable=True, )
    param2 = db.Column(db.Float, nullable=True, )
    param3 = db.Column(db.Float, nullable=True, )
    param4 = db.Column(db.Float, nullable=True, )
    param5 = db.Column(db.Float, nullable=True, )
    param6 = db.Column(db.Float, nullable=True, )


class MessageInfos(db.Model):
    __tablename__ = 'message_info'
    message_id = db.Column(db.Integer, primary_key=True, nullable=True, autoincrement=True)
    username_from = db.Column(db.String(255), nullable=True,)
    create_time = db.Column(db.DateTime, nullable=True, )
    message_title = db.Column(db.String(255), nullable=True,)
    message_content = db.Column(db.String(255), nullable=True,)
    message_info_attr = ['message_id', 'username_from', 'create_time', 'message_title', 'message_content',]

    