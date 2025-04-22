import re
from werkzeug.security import generate_password_hash, check_password_hash
from app.models.User import Users
from app.extensions import db

class AuthError(Exception):
    def __init__(self, message, code=400):
        self.message = message
        self.code = code
        super().__init__(message)

def get_user_by_name(name):
    return Users.query.filter_by(name=name).first()

def validate_password(password):
    pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{10,}$'
    if not re.match(pattern, password):
        raise AuthError("A senha deve ter pelo menos 10 caracteres, incluindo uma letra maiúscula, uma minúscula e um caractere especial.")

def register_user(name, password):
    if get_user_by_name(name):
        raise AuthError("Usuário já existe!", code=409)

    validate_password(password)

    user = Users(name=name)
    user.password = password
    db.session.add(user)
    db.session.commit()
    return user

def authenticate(name, password):
    user = get_user_by_name(name)
    if not user or not user.check_password(password):
        raise AuthError("Credenciais inválidas", code=401)
    return user