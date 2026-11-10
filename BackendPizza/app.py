import pymysql
pymysql.install_as_MySQLdb()

from flask import Flask
from flask_cors import CORS


from db import mysql
from blueprints.pizzeria.routes import pizzeria_bp

app = Flask(__name__)
CORS(app)


app.config['MYSQL_HOST'] = '127.0.0.1'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root' 
app.config['MYSQL_DB'] = 'pizzeria_bd'
app.config['MYSQL_PORT'] = 8889 
app.config['MYSQL_AUTOCOMMIT'] = True


mysql.init_app(app)


app.register_blueprint(pizzeria_bp, url_prefix='/api')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True)