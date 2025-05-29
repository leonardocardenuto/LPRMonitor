from app.models.Cars import Car
from app.models.PlateCheck import PlateCheck

from app.models.HistoricMovements import HistoricMovement
from app.models.HistoricMovementsTemp import HistoricMovementTemp

from app.extensions import db
from datetime import datetime

class CarServiceError(Exception):
    def __init__(self, message, code=400):
        self.message = message
        self.code = code
        super().__init__(message)

def handle_register_car_movement(license_plate, last_location, owner_id=None, from_camera_id=None, to_camera_id=1):
    if not license_plate:
        raise CarServiceError("license_plate is required", code=400)

    try:
        # 1. Checar se o carro está cadastrado permanentemente
        car = Car.query.filter_by(license_plate=license_plate).first()
        if car:
            movement = HistoricMovement(
                car_id=car.id,
                from_camera_id=from_camera_id,
                to_camera_id=1,
            )
            db.session.add(movement)
            db.session.commit()
            return car

        # 2. Checar se está na tabela temporária
        temp_car = PlateCheck.query.filter_by(license_plate=license_plate).first()
        if temp_car:
            movement_temp = HistoricMovementTemp(
                car_temp_id=temp_car.id,
                from_camera_id=from_camera_id,
                to_camera_id=1,
            )
            db.session.add(movement_temp)
            db.session.commit()
            return temp_car

        # 3. Se não existe em nenhum dos dois, cria temporário
        new_temp_car = PlateCheck(
            license_plate=license_plate,
            last_seen_in=last_location
        )
        db.session.add(new_temp_car)
        db.session.flush()  # pegar o ID do carro antes do commit

        movement_temp = HistoricMovementTemp(
            car_temp_id=new_temp_car.id,
            from_camera_id=from_camera_id,
            to_camera_id=1,
        )
        db.session.add(movement_temp)
        db.session.commit()
        return new_temp_car

    except Exception as e:
        db.session.rollback()
        raise CarServiceError(f"Error processing car and movement: {str(e)}", code=500)