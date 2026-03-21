const SYLLABLES_POOL = [
  // Animales (2-3 silabas)
  'gato', 'perro', 'pato', 'vaca', 'toro', 'rata', 'mono', 'loro', 'sapo', 'tigre',
  'oveja', 'conejo', 'paloma', 'jirafa', 'caballo', 'gallina', 'abeja', 'araña', 'canguro', 'delfin',

  // Familia y personas (2-3 silabas)
  'papa', 'mama', 'hijo', 'hija', 'primo', 'prima', 'nene', 'nena', 'abuelo', 'abuela',
  'hermano', 'hermana', 'amigo', 'amiga', 'vecino', 'vecina', 'sobrino', 'sobrina', 'maestro', 'maestra',

  // Casa y escuela (2-3 silabas)
  'casa', 'puerta', 'ventana', 'techo', 'pared', 'mesa', 'silla', 'cama', 'patio', 'baño',
  'cocina', 'ropero', 'espejo', 'cortina', 'alfombra', 'lampara', 'cuaderno', 'lapiz', 'borrador', 'tijera',

  // Comida (2-3 silabas)
  'queso', 'leche', 'huevo', 'carne', 'pollo', 'arroz', 'papa', 'tomate', 'banana', 'manzana',
  'naranja', 'melon', 'sandia', 'fideo', 'yogur', 'cereza', 'durazno', 'limon', 'galleta', 'frutilla',

  // Cuerpo (2-3 silabas)
  'cabeza', 'nariz', 'boca', 'oreja', 'mano', 'brazo', 'dedo', 'pierna', 'cuello',
  'codo', 'diente', 'lengua', 'talon', 'rodilla', 'espalda', 'mejilla', 'pestaña', 'muñeca', 'garganta',

  // Acciones (2-3 silabas)
  'correr', 'saltar', 'bailar', 'cantar', 'mirar', 'jugar', 'tocar', 'pintar', 'pegar', 'lavar',
  'comer', 'tomar', 'abrir', 'cerrar', 'subir', 'bajar', 'limpiar', 'ordenar', 'recortar', 'dibujar',

  // Objetos y lugares (2-3 silabas)
  'pelota', 'carrito', 'patines', 'mochila', 'camisa', 'zapato', 'media', 'gorra', 'bufanda',
  'escuela', 'plaza', 'parque', 'camino', 'castillo', 'pirata', 'tesoro', 'bandera', 'princesa', 'planeta',

  // Colores y adjetivos (2-3 silabas)
  'rojo', 'verde', 'morado', 'celeste', 'naranja', 'blanco', 'negro', 'bonito', 'grande', 'suave',
  'fuerte', 'alegre', 'triste', 'lento', 'rapido', 'limpio', 'sucio', 'pequeno', 'mediano', 'gigante',

  // Naturaleza (2-3 silabas)
  'rosa', 'hoja', 'rama', 'tronco', 'nube', 'lluvia', 'rio', 'viento',

  // Ropa y accesorios (2-3 silabas)
  'remera', 'cinturon', 'boton', 'guante', 'sombrero', 'campera', 'pijama',

  // Juguetes y juegos (2-3 silabas)
  'trompo', 'globo', 'bloque', 'domino', 'cometa', 'tambor', 'xilofon', 'robot', 'avion', 'barco',

  // Ciudad y transporte (2-3 silabas)
  'calle', 'pasaje', 'puente', 'vereda', 'farol', 'rueda', 'freno', 'motor', 'bocina', 'garaje',

  // Escuela y utiles (2-3 silabas)
  'regla', 'carpeta', 'goma', 'marcador', 'crayon', 'pincel', 'papel', 'libro', 'cuento', 'tempera',

  // Comida (2-3 silabas)
  'pera', 'ciruela', 'kiwi', 'mango', 'anana', 'pepino', 'cebolla', 'lechuga', 'batata', 'vainilla',

  // Acciones (2-3 silabas)
  'soplar', 'girar', 'nadar', 'barrer', 'coser', 'tejer', 'besar', 'reir', 'pensar', 'buscar',

  // Cualidades y sabores (2-3 silabas)
  'feliz', 'calma', 'valiente', 'amable', 'miedoso', 'prolijo', 'contento',

  // Lugares (2-3 silabas)
  'playa', 'bosque', 'isla', 'granja', 'molino', 'huerta', 'sendero', 'montaña', 'cueva', 'laguna',

  // Animales (2-3 silabas)
  'puma', 'zorro', 'koala', 'panda', 'foca', 'lobo', 'burro', 'ciervo', 'iguana', 'tortuga',
];

const TOTAL_ROUNDS = 20;
const TIME_PER_SYLLABLE = 35;
