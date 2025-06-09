from .auth import auth_bp
from .plate_checks import check_plate_bp
from .yolo import yolo_bp
from .stream import stream_bp
from .identify_car import identify_car_bp
from .camera import camera_bp

def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(check_plate_bp)
    app.register_blueprint(yolo_bp)
    app.register_blueprint(stream_bp)  
    app.register_blueprint(identify_car_bp)
    app.register_blueprint(camera_bp)
