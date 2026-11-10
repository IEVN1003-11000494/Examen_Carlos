from flask import Blueprint, jsonify, request
from db import mysql

pizzeria_bp = Blueprint('pizzeria', __name__)

@pizzeria_bp.route("/pedidos", methods=['POST'])
def registrar_pedido():
    datos = request.get_json(silent=True)
    if not datos: return jsonify({'exito': False}), 400
    
    cursor = None
    try:
        cursor = mysql.connection.cursor()
        
    
        cursor.execute("SELECT id FROM cliente WHERE nombre = %s AND telefono = %s", (datos['cliente'], datos['telefono']))
        cliente_db = cursor.fetchone()
        
        if cliente_db:
            id_cliente = cliente_db[0]
        else:
            cursor.execute("INSERT INTO cliente (nombre, direccion, telefono) VALUES (%s, %s, %s)", 
                           (datos['cliente'], datos['direccion'], datos['telefono']))
            id_cliente = cursor.lastrowid
            
     
        cursor.execute("INSERT INTO venta (id_cliente, fecha_compra, total) VALUES (%s, %s, %s)",
                       (id_cliente, datos['fecha_pedido'], datos['total']))
        id_venta = cursor.lastrowid
        
   
        for pizza in datos['detalles']:
         
            cursor.execute("SELECT id FROM producto WHERE tamano = %s AND ingredientes = %s", 
                           (pizza['tamano'], pizza['ingredientes']))
            producto_db = cursor.fetchone()
            
            if producto_db:
                id_producto = producto_db[0]
            else:
                cursor.execute("INSERT INTO producto (tamano, ingredientes) VALUES (%s, %s)", 
                               (pizza['tamano'], pizza['ingredientes']))
                id_producto = cursor.lastrowid
            
            # Relacionar en Detalle Venta
            cursor.execute("INSERT INTO detalle_venta (id_venta, id_producto, cantidad, subtotal) VALUES (%s, %s, %s, %s)",
                           (id_venta, id_producto, pizza['cantidad'], pizza['subtotal']))
            
        return jsonify({'exito': True}), 201
    except Exception as ex:
        print("Error:", ex)
        return jsonify({'exito': False}), 500
    finally:
        if cursor: cursor.close()

@pizzeria_bp.route("/ventas/dia", methods=['GET'])
def ventas_por_dia():
    fecha = request.args.get('fecha')
    return _consultar_ventas("WHERE v.fecha_compra = %s", (fecha,))

@pizzeria_bp.route("/ventas/mes", methods=['GET'])
def ventas_por_mes():
    mes, anio = request.args.get('mes'), request.args.get('anio')
    return _consultar_ventas("WHERE MONTH(v.fecha_compra) = %s AND YEAR(v.fecha_compra) = %s", (mes, anio))

def _consultar_ventas(condicion_sql, parametros):
    cursor = mysql.connection.cursor()
    
  
    query_venta = f"""
        SELECT v.id, c.nombre, v.total, v.fecha_compra 
        FROM venta v 
        JOIN cliente c ON v.id_cliente = c.id 
        {condicion_sql}
    """
    cursor.execute(query_venta, parametros)
    ventas_db = cursor.fetchall()
    
    ventas = []
    for v in ventas_db:
        id_venta = v[0]
        
        
        query_detalles = """
            SELECT p.tamano, p.ingredientes, d.cantidad, d.subtotal 
            FROM detalle_venta d
            JOIN producto p ON d.id_producto = p.id
            WHERE d.id_venta = %s
        """
        cursor.execute(query_detalles, (id_venta,))
        detalles_db = cursor.fetchall()
        
        lista_pizzas = [{'tamano': d[0], 'ingredientes': d[1], 'cantidad': d[2], 'subtotal': d[3]} for d in detalles_db]
            
        ventas.append({
            'id': id_venta,
            'cliente': v[1],
            'total': float(v[2]),
            'fecha': str(v[3]),
            'detalles': lista_pizzas
        })
        
    cursor.close()
    return jsonify({'ventas': ventas, 'total': sum(v['total'] for v in ventas), 'exito': True})