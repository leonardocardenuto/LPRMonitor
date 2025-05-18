from ..extensions import db

class Owner(db.Model):
    __tablename__ = 'owners'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    # Optional: reverse relationship
    cars = db.relationship('Car', backref='owner', cascade='all, delete-orphan')

    def __repr__(self):
        return f"<Owner id={self.id} name='{self.name}'>"