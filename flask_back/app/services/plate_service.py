from app.models.LastCars import LastCars
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
        last_plate = LastCars.query.order_by(LastCars.created_at.desc()).first()

        # Se não houver placa no banco
        if not last_plate:
            return {
                "plate": None,
                "exists": False
            }

        # Verificando se a placa existe no banco (mesmo sabendo que ela já foi buscada)
        plate_str = last_plate.license_plate  # substitua por 'plate' se for esse o nome do campo
        exists = db.session.query(
            LastCars.query.filter_by(license_plate=plate_str).exists()
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
        plates = LastCars.query.order_by(LastCars.created_at.desc()).limit(10).all()
        return [plate.to_dict() for plate in plates] 
    except Exception as e:
        raise PlateServiceError(f"Error retrieving plates: {str(e)}", code=500)
    
def get_all_unverified_plates():
    try:
        # Pegando todas as placas únicas com apenas 1 ocorrência (ou alguma lógica que defina 'não verificada')
        plates = (
            db.session.query(LastCars.license_plate)
            .group_by(LastCars.license_plate)
            .having(db.func.count(LastCars.license_plate) == 1)
            .all()
        )

        return [plate[0] for plate in plates]

    except Exception as e:
        raise PlateServiceError(f"Erro ao buscar placas não verificadas: {str(e)}", code=500)
    
def update_last_seen_in(license_plate, location):
    try:
        plate_check = LastCars.query.filter_by(license_plate=license_plate).first()

        if not plate_check:
            raise PlateServiceError(f"Placa '{license_plate}' não encontrada no banco de dados.", code=404)

        plate_check.last_seen_in = location
        db.session.commit()

        return {
            "license_plate": license_plate,
            "last_seen_in": location
        }

    except PlateServiceError as e:
        raise e 

    except Exception as e:
        raise PlateServiceError(f"Erro ao atualizar localização: {str(e)}", code=500)
