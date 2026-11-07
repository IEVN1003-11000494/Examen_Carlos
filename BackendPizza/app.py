import pymysql
pymysql.install_as_MySQLdb()

from flask import Flask, jsonify, request
from flask_mysqldb import MySQL
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['MYSQL_HOST'] = '127.0.0.1'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root' 
app.config['MYSQL_DB'] = 'pizzeria_bd'
app.config['MYSQL_PORT'] = 8889 
app.config['MYSQL_AUTOCOMMIT'] = True

mysql = MySQL(app)

@app.route("/api/pedidos", methods=['POST'])
def registrar_pedido():
    datos = request.get_json(silent=True)
    if not datos: return jsonify({'exito': False}), 400
    
    cursor = None
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("""
            INSERT INTO pedidos (cliente, direccion, telefono, fecha_pedido, total)
            VALUES (%s, %s, %s, %s, %s)
        """, (datos['cliente'], datos['direccion'], datos['telefono'], datos['fecha_pedido'], datos['total']))
        
        pedido_id = cursor.lastrowid

        for pizza in datos['detalles']:
            cursor.execute("""
                INSERT INTO detalle_pedido (pedido_id, tamano, ingredientes, cantidad, subtotal)
                VALUES (%s, %s, %s, %s, %s)
            """, (pedido_id, pizza['tamano'], pizza['ingredientes'], pizza['cantidad'], pizza['subtotal']))

        return jsonify({'exito': True}), 201
    except Exception as ex:
        return jsonify({'exito': False}), 500
    finally:
        if cursor: cursor.close()

@app.route("/api/ventas/dia", methods=['GET'])
def ventas_por_dia():
    fecha = request.args.get('fecha')
    cursor = mysql.connection.cursor()
    

    cursor.execute("SELECT id, cliente, total, fecha_pedido FROM pedidos WHERE fecha_pedido = %s", (fecha,))
    pedidos_db = cursor.fetchall()
    
    ventas = []
    for pedido in pedidos_db:
        pedido_id = pedido[0]
        cursor.execute("SELECT tamano, ingredientes, cantidad, subtotal FROM detalle_pedido WHERE pedido_id = %s", (pedido_id,))
        detalles_db = cursor.fetchall()
        
        lista_pizzas = []
        for d in detalles_db:
            lista_pizzas.append({
                'tamano': d[0],
                'ingredientes': d[1],
                'cantidad': d[2],
                'subtotal': d[3]
            })
            
        ventas.append({
            'id': pedido_id,
            'cliente': pedido[1],
            'total': pedido[2],
            'fecha': str(pedido[3]),
            'detalles': lista_pizzas
        })
        
    cursor.close()
    return jsonify({'ventas': ventas, 'total_dia': sum(v['total'] for v in ventas), 'exito': True})

@app.route("/api/ventas/mes", methods=['GET'])
def ventas_por_mes():
    mes, anio = request.args.get('mes'), request.args.get('anio')
    cursor = mysql.connection.cursor()
    
   
    cursor.execute("SELECT id, cliente, total, fecha_pedido FROM pedidos WHERE MONTH(fecha_pedido) = %s AND YEAR(fecha_pedido) = %s", (mes, anio))
    pedidos_db = cursor.fetchall()
    
    ventas = []
    for pedido in pedidos_db:
        pedido_id = pedido[0]
        cursor.execute("SELECT tamano, ingredientes, cantidad, subtotal FROM detalle_pedido WHERE pedido_id = %s", (pedido_id,))
        detalles_db = cursor.fetchall()
        
        lista_pizzas = []
        for d in detalles_db:
            lista_pizzas.append({
                'tamano': d[0],
                'ingredientes': d[1],
                'cantidad': d[2],
                'subtotal': d[3]
            })
            
        ventas.append({
            'id': pedido_id,
            'cliente': pedido[1],
            'total': pedido[2],
            'fecha': str(pedido[3]), 
            'detalles': lista_pizzas
        })
        
    cursor.close()
    return jsonify({'ventas': ventas, 'total_mes': sum(v['total'] for v in ventas), 'exito': True})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True)