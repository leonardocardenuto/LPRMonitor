from flask import Blueprint, request, jsonify
from app.services.plate_service import check_last_plate_exists, get_all_unverified_plates, get_all_registered_plates, get_last_plates, PlateServiceError
from app.utils.response_manager import ResponseManager as DoResponse

check_plate_bp = Blueprint('check_plate', __name__, url_prefix='/check_plate')

@check_plate_bp.route('/check_plate', methods=['POST'])
def check_plate():
    try:
        # Busca a última placa e verifica se ela existe
        result = check_last_plate_exists()

        if not result["plate"]:
            return DoResponse.not_found("No plate found in the database")

        return DoResponse.success(data={
            "plate": result["plate"],
            "exists": result["exists"]
        })

    except PlateServiceError as e:
        return DoResponse.with_code(e.code, e.message)
    except Exception as e:
        return DoResponse.internal_server_error(str(e))

@check_plate_bp.route('/get_last_plates', methods=['GET'])
def get_last_plates_route():
    try:
        plates = get_last_plates()
        
        return DoResponse.success(data={"plates": plates})

    except PlateServiceError as e:
        return DoResponse.with_code(e.code, e.message)
    except Exception as e:
        return DoResponse.internal_server_error(str(e))
    

@check_plate_bp.route('/unverified_plates', methods=['GET'])
def get_unverified_plates():
    try:
        plates = get_all_unverified_plates()

        if not plates:
            return DoResponse.not_found("No unverified plates found")

        return DoResponse.success(data={"plates": plates})

    except PlateServiceError as e:
        return DoResponse.with_code(e.code, e.message)
    except Exception as e:
        return DoResponse.internal_server_error(str(e))

@check_plate_bp.route('/registered_plates', methods=['GET'])
def get_registered_plates():
    try:
        plates = get_all_registered_plates()
        
        return DoResponse.success(data={"plates": plates})

    except PlateServiceError as e:
        return DoResponse.with_code(e.code, e.message)
    except Exception as e:
        return DoResponse.internal_server_error(str(e))
