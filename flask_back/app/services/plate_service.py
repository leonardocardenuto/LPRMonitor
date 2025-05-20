from app.models.PlateCheck import PlateCheck
from app.extensions import db
from flask import jsonify

class PlateServiceError(Exception):
    def __init__(self, message, code=400):
        self.message = message
        self.code = code
        super().__init__(message)

def check_last_plate_exists():
    try:
        # Pegando o último registro
        last_plate = PlateCheck.query.order_by(PlateCheck.created_at.desc()).first()

        # Se não houver placa no banco
        if not last_plate:
            return {
                "plate": None,
                "exists": False
            }

        # Verificando se a placa existe no banco (mesmo sabendo que ela já foi buscada)
        plate_str = last_plate.license_plate  # substitua por 'plate' se for esse o nome do campo
        exists = db.session.query(
            PlateCheck.query.filter_by(license_plate=plate_str).exists()
        ).scalar()

        # Retornando para o front
        return {
            "plate": plate_str,
            "exists": exists
        }

    except Exception as e:
        raise PlateServiceError(f"Erro ao verificar existência da última placa: {str(e)}", code=500)

def get_last_plates():
    try:
        plates = PlateCheck.query.order_by(PlateCheck.created_at.desc()).limit(10).all()
        return [plate.to_dict() for plate in plates] 
    except Exception as e:
        raise PlateServiceError(f"Error retrieving plates: {str(e)}", code=500)
