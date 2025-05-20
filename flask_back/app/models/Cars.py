from ..extensions import db
from datetime import datetime
from pytz import timezone

def get_sp_time():
    aware_time =    aware_time = datetime.now(timezone('America/Sao_Paulo'))   
    return aware_time.replace(tzinfo=None)

class Car(db.Model):
    __tablename__ = 'cars'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    license_plate = db.Column(db.String, nullable=False)
    owner_id = db.Column(db.Integer, nullable=True)    
    created_at = db.Column(db.DateTime, default=get_sp_time, nullable=True)
    updated_at = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "license_plate": self.license_plate,
            "owner_id": self.owner_id,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.created_at.isoformat(),
        }

    def __repr__(self):
        return f"<Car id={self.id} license_plate='{self.license_plate}'>"