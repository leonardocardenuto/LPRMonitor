from ..extensions import db
from datetime import datetime
import hashlib

class Users(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    _password = db.Column("password", db.String(40), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    

    def __repr__(self):
        return f"<User {self.name}>"


    def get_user_by_name(name):
        return Users.query.filter_by(name=name).first()

    @property
    def password(self):
        return self._password

    @password.setter
    def password(self, plaintext_password):
        self._password = hashlib.sha1(plaintext_password.encode('utf-8')).hexdigest()

    def check_password(self, attempt):
        return self._password == hashlib.sha1(attempt.encode('utf-8')).hexdigest()