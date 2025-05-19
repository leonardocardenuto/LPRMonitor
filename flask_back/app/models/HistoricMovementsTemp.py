from ..extensions import db
from datetime import datetime
from pytz import timezone

def get_sp_time():
    aware_time = datetime.now(timezone('America/Sao_Paulo'))
    return aware_time.replace(tzinfo=None)

class HistoricMovementTemp(db.Model):
    __tablename__ = 'historic_movements_temp'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    car_temp_id = db.Column(db.Integer, nullable=True) 
    from_camera_id = db.Column(db.Integer, nullable=True)
    to_camera_id = db.Column(db.Integer, nullable=True)
    authorized_by_user_id = db.Column(db.Integer, nullable=True)
    reason = db.Column(db.String, nullable=True)
    created_at = db.Column(db.DateTime, default=get_sp_time, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "car_temp_id": self.car_id,
            "from_camera_id": self.from_camera_id,
            "to_camera_id": self.to_camera_id,
            "authorized_by_user_id": self.authorized_by_user_id,
            "reason": self.reason,
            "created_at": self.created_at.isoformat(),
        }

    def __repr__(self):
        return f"<HistoricMovementTemp id={self.id} car_id={self.car_id}>"