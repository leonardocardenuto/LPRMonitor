from flask import Blueprint, request, current_app
from app.services.yolo_service import handle_register_car_movement, get_all_cameras
from app.services.plate_service import update_last_seen_in
from app.utils.response_manager import ResponseManager as DoResponse
import queue

yolo_bp = Blueprint('yolo', __name__, url_prefix='/yolo')

def get_message_queue():
    if not hasattr(current_app, 'message_queue'):
        current_app.message_queue = queue.Queue()
    return current_app.message_queue

@yolo_bp.route('/list-all-cameras', methods=['GET'])
def list_all_cameras():
    try:
        just_active_param = request.args.get('justActive')
        if just_active_param is not None:
            if just_active_param.lower() in ['true', '1']:
                justActive = True
            elif just_active_param.lower() in ['false', '0']:
                justActive = False
            else:
                return DoResponse.bad_request("Invalid value for 'justActive' parameter")
        else:
            justActive = True

        cameras = get_all_cameras(justActive=justActive)
        if not cameras:
            return DoResponse.success(data={"cameras": []}, message="No cameras found")

        return DoResponse.success(data={"cameras": [camera.to_dict() for camera in cameras]})

    except Exception as e:
        return DoResponse.internal_server_error(str(e))

@yolo_bp.route('/register_car', methods=['POST'])
def register_car():
    try:
        data = request.get_json()
        license_plate = data.get('license_plate')
        camera_id = data.get('camera_id')

        if not license_plate:
            return DoResponse.bad_request("license_plate is required")

        car = handle_register_car_movement(license_plate=license_plate, camera_id=camera_id)

        message = f"Carro registrado: {car.license_plate}"
        q = get_message_queue()
        q.put(message)

        return DoResponse.created({
            "message": "RegisteredCars registered successfully",
            "car": car.to_dict()
        })

    except Exception as e:
        return DoResponse.internal_server_error(str(e))
    
@yolo_bp.route('/update_last_location', methods=['PATCH'])
def update_last_location():
    try:
        data = request.get_json()
        license_plate = data.get('license_plate')
        last_location = data.get('last_location')

        if not license_plate or not last_location:
            return DoResponse.bad_request("License plate and last location are required")

        car = update_last_seen_in(license_plate=license_plate, location=last_location)

        message = f"Localização Atualizada: {car['license_plate']}"
        q = get_message_queue()
        q.put(message)

        return DoResponse.success(message={
            "message": "Localization Updated successfully",
            "car": car
        })

    except Exception as e:
        return DoResponse.internal_server_error(str(e))
