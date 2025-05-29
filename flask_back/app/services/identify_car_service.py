from app.models.IdentifyCar import IdentifyCar
from app.models.PlateCheck import PlateCheck
from app.extensions import db
from datetime import datetime
from pytz import timezone

def get_sp_time():
    aware_time = datetime.now(timezone('America/Sao_Paulo'))
    return aware_time.replace(tzinfo=None)

class IdentifyCarServiceError(Exception):
    def __init__(self, message, code=400):
        self.message = message
        self.code = code
        super().__init__(message)

def identify_car_exists(license_plate):
    try:
        return db.session.query(
            db.session.query(PlateCheck).filter_by(license_plate=license_plate).exists()
        ).scalar()
    except Exception as e:
        raise IdentifyCarServiceError(f"Erro ao verificar existência do carro: {str(e)}", code=500)

def create_identify_car(data):
    try:
        # Verifica se o carro já existe
        if not identify_car_exists(data["license_plate"]):
            raise IdentifyCarServiceError("Não existe carro para ser autorizado", code=409)

        car = IdentifyCar(
            license_plate=data["license_plate"],
            status=data["status"],
            extra_info=data["extra_info"],
            expire_date=datetime.strptime(data["expire_date"], "%Y-%m-%d").date(),
            justification=data["justification"]
        )
        db.session.add(car)
        db.session.commit()
        print(f"Carro criado: {car}")
        return car
    except IdentifyCarServiceError:
        raise
    except Exception as e:
        db.session.rollback()
        raise IdentifyCarServiceError(f"Erro ao criar registro de carro: {str(e)}", code=500)

def wipe_expired_identify_cars_service():
    try:
        today = get_sp_time()
        print(f"Data atual para verificação de expiração: {today}")
        for car in IdentifyCar.query.all():
            print(f"Carro: {car.license_plate}, Data de expiração: {car.expire_date}")
        expired_cars = IdentifyCar.query.filter(IdentifyCar.expire_date < today.date()).all()
        
        if not expired_cars:
            return {"msg": "Nenhum carro expirado encontrado", "deleted": 0}
        
        deleted_plates = []
        for car in expired_cars:
            deleted_plates.append(car.license_plate)
            db.session.delete(car)
        
        db.session.commit()
        return {
            "msg": "Carros expirados removidos com sucesso",
            "deleted": len(expired_cars),
            "plates": deleted_plates
        }
    except Exception as e:
        db.session.rollback()
        raise IdentifyCarServiceError(f"Erro ao limpar carros expirados: {str(e)}", code=500)