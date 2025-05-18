from ..extensions import db
from datetime import datetime

class HistoricMovement(db.Model):
    __tablename__ = 'historic_movements'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    car_id = db.Column(db.Integer, db.ForeignKey('cars.id', ondelete='CASCADE'), nullable=True)
    from_camera_id = db.Column(db.Integer, nullable=True)
    to_camera_id = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "car_id": self.car_id,
            "from_camera_id": self.from_camera_id,
            "to_camera_id": self.to_camera_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return (f"<HistoricMovement id={self.id} car_id={self.car_id} "
                f"from_camera_id={self.from_camera_id} to_camera_id={self.to_camera_id}>")