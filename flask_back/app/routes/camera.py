from flask import Blueprint, request, jsonify
from app.services.camera_service import create_camera,  update_camera, CameraServiceError
from app.utils.response_manager import ResponseManager as DoResponse

camera_bp = Blueprint('camera', __name__, url_prefix='/camera')


def handle_camera_error(error):
    code_map = {
        400: DoResponse.bad_request,
        401: DoResponse.unauthorized,
        409: DoResponse.conflict,
    }
    handler = code_map.get(error.code, DoResponse.bad_request)
    return handler(error.message)

@camera_bp.route('/create', methods=['POST'])
def create_camera_route():
    try:
        data = request.get_json()

        required_fields = ["camera_ip", "place"]
        missing = [field for field in required_fields if field not in data]
        if missing:
            return DoResponse.bad_request(f"Missing required fields: {', '.join(missing)}")

        new_camera = create_camera(data)

        return DoResponse.success(data=new_camera.to_dict(), message="Camera created successfully")

    except CameraServiceError as e:
        return handle_camera_error(e)
    except Exception as e:
        return DoResponse.internal_server_error(str(e))

@camera_bp.route('/update/<int:camera_id>', methods=['PATCH'])
def update_camera_route(camera_id):
    try:
        data = request.get_json()
        print(camera_id)
        print(f"Received data for camera update: {data}")
        if not camera_id:
            return DoResponse.bad_request("Camera ID is required")

        updated_camera = update_camera(data, camera_id=camera_id)

        return DoResponse.success(data=updated_camera.to_dict(), message="Camera updated successfully")

    except CameraServiceError as e:
        return handle_camera_error(e)
    except Exception as e:
        return DoResponse.internal_server_error(str(e))