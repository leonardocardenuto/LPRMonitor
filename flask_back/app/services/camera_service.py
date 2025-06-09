from app.models.Camera import Camera
from app.extensions import db
from datetime import datetime
from pytz import timezone

def get_sp_time():
    aware_time = datetime.now(timezone('America/Sao_Paulo'))
    return aware_time.replace(tzinfo=None)

class CameraServiceError(Exception):
    def __init__(self, message, code=400):
        self.message = message
        self.code = code
        super().__init__(message)

def create_camera(data):
    try:
        existing_camera = Camera.query.filter_by(camera_ip=data["camera_ip"]).first()
        if existing_camera:
            raise CameraServiceError("Câmera já existe", code=409)
        camera = Camera(
            camera_ip=data["camera_ip"],
            place=data["place"],
        )
        db.session.add(camera)
        db.session.commit()
        return camera
    except CameraServiceError:
        raise
    except Exception as e:
        db.session.rollback()
        raise CameraServiceError(f"Erro ao criar câmera: {str(e)}", code=500)

def update_camera(data, camera_id):
    try:
        camera = Camera.query.get(camera_id)
        if not camera:
            raise CameraServiceError("Câmera não encontrada", code=404)

        if "camera_ip" in data:
            existing_camera = Camera.query.filter_by(camera_ip=data["camera_ip"]).first()
            if existing_camera and existing_camera.id != camera_id:
                raise CameraServiceError("Câmera com este IP já existe", code=409)

        for key, value in data.items():
            setattr(camera, key, value)

        db.session.commit()
        return camera
    except CameraServiceError:
        raise
    except Exception as e:
        db.session.rollback()
        raise CameraServiceError(f"Erro ao atualizar câmera: {str(e)}", code=500)