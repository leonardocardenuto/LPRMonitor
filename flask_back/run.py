from waitress import serve
from flask_migrate import Migrate
from app.extensions import db 
from app import create_app


app = create_app()
migrate = Migrate(app, db)  

serve(app, host="0.0.0.0", port=5000, threads=4)
