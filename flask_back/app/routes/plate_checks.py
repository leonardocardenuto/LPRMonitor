# app/routes/check_plate_routes.py

from flask import Blueprint, request, jsonify
from app.services.plate_service import check_plate_exists, PlateServiceError

check_plate_bp = Blueprint('check_plate', __name__, url_prefix='/check_plate')

@check_plate_bp.route('/check_plate', methods=['POST'])
def check_plate():
    try:
        data = request.get_json()
        plate_id = data.get('plate_id')

        exists = check_plate_exists(plate_id)
        return jsonify({'exists': exists}), 200 if exists else 404

    except PlateServiceError as e:
        return jsonify({'error': e.message}), e.code
    except Exception as e:
        return jsonify({'error': str(e)}), 500
