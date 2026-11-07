export interface DetallePizza {
  tamano: string;
  ingredientes: string;
  cantidad: number;
  subtotal: number;
}

export interface Pedido {
  cliente: string;
  direccion: string;
  telefono: string;
  fecha_pedido: string;
  total: number;
  detalles: DetallePizza[];
}