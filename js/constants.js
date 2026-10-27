/**
 * ====================================================================
 * SNAKE 3D CLÁSICO - CONSTANTES Y CONFIGURACIÓN (ESTILO GOOGLE SNAKE)
 * ====================================================================
 * Configura la cuadrícula plana, direcciones en 2D (4 cardinales),
 * paleta de colores vivos tipo arena y vegetación, y parámetros del juego.
 */

const CONFIG = {
    // Dimensiones del tablero plano (Tablero de X x Z celdas)
    GRID_WIDTH: 18,            // 18 columnas
    GRID_HEIGHT: 18,           // 18 filas
    CELL_SIZE: 1.5,            // Tamaño físico de cada celda en unidades 3D
    WALL_HEIGHT: 1.2,          // Altura 3D de las paredes del perímetro

    // Velocidades del juego (en milisegundos por paso)
    INITIAL_TICK_MS: 160,      // Velocidad inicial agradable y fluida
    MIN_TICK_MS: 75,           // Velocidad máxima permitida
    SPEED_UP_STEP_MS: 3,       // Aceleración por cada manzana comida

    // Puntuación y Power-Ups
    POINTS_PER_APPLE: 1,       // 1 manzana = 1 punto (estilo clásico Google)
    POINTS_BONUS_APPLE: 3,     // Manzana dorada = 3 puntos
    POINTS_BLUE_APPLE: 2,      // Manzana azul de poder = 2 puntos
    BONUS_SPAWN_CHANCE: 0.18,  // 18% probabilidad de manzana dorada
    BONUS_LIFETIME_TICKS: 35,  // Ticks antes de que expire la manzana dorada
    BLUE_SPAWN_CHANCE: 0.25,   // 25% probabilidad de manzana azul (Power-Up)
    BLUE_LIFETIME_TICKS: 45,   // Ticks antes de que expire la manzana azul
    IMMUNITY_DURATION_SEC: 2.0,// Duración exacta de inmunidad: 2 segundos

    // Paleta de Colores Vivos y Llamativos (Estilo Google Snake / Caja de Cartón en el Bosque)
    COLORS: {
        SKY: 0x7dd3fc,             // Azul cielo fresco y luminoso
        FOG: 0xbae6fd,             // Niebla atmosférica suave de bosque
        
        // Caja de cartón (Tablero / Arena donde se mueve el gusanito)
        CARDBOARD_LIGHT: 0xdcb285, // Cartón kraft claro cálido (baldosas A)
        CARDBOARD_DARK: 0xcfa070,  // Cartón kraft cálido para patrón ajedrezado (baldosas B)
        CARDBOARD_BASE: 0xb88655,  // Base inferior de la caja
        CARDBOARD_WALL: 0xba895c,  // Paredes de cartón de la caja
        CARDBOARD_RIM: 0x9c673d,   // Borde superior corrugado del cartón
        CARDBOARD_FLAP: 0xc49366,  // Solapas exteriores de la caja
        CARDBOARD_TAPE: 0xf3dfc8,  // Cinta adhesiva de embalaje (kraft clara / satinada)
        CARDBOARD_STAMP: 0x451a03, // Tinta oscura para sellos en el cartón

        // Compatibilidad con referencias anteriores
        SAND_LIGHT: 0xdcb285,
        SAND_DARK: 0xcfa070,
        SAND_BORDER: 0xb88655,
        WALL_BASE: 0xba895c,
        WALL_TOP: 0x9c673d,

        // Bosque exterior (Césped, vegetación, flores y árboles)
        GRASS_GROUND: 0x489d74,    // Césped verde vivo de bosque
        GRASS_DARK: 0x2d6a4f,      // Sombras de vegetación
        GRASS_TUFT: 0x52b788,      // Mechones de hierba 3D
        TREE_TRUNK: 0x78350f,      // Tronco de madera
        TREE_LEAVES_A: 0x15803d,   // Copa de árbol verde bosque
        TREE_LEAVES_B: 0x16a34a,   // Copa de árbol verde esmeralda
        TREE_LEAVES_C: 0x10b981,   // Copa de árbol verde menta
        BUSH_GREEN: 0x22c55e,      // Arbustos redondos
        MUSHROOM_CAP: 0xef4444,    // Hongo rojo de bosque
        MUSHROOM_STEM: 0xfef08a,   // Tallo de hongo crema
        FLOWER_CENTER: 0xfacc15,   // Centro amarillo de flores
        FLOWER_WHITE: 0xffffff,    // Margarita blanca
        FLOWER_RED: 0xf43f5e,      // Flor amapola roja
        FLOWER_BLUE: 0x38bdf8,     // Flor silvestre celeste
        FLOWER_YELLOW: 0xfde047,   // Flor silvestre amarilla
        FLOWER_PURPLE: 0xc084fc,   // Flor lavanda violeta
        
        // Serpiente 3D (Verde vivo Google Snake)
        SNAKE_HEAD: 0x22c55e,      // Verde brillante vivo
        SNAKE_HEAD_DARK: 0x16a34a,
        SNAKE_BODY_A: 0x16a34a,    // Verde esmeralda vivo
        SNAKE_BODY_B: 0x15803d,    // Verde bosque para patrón alternado
        SNAKE_EYES_WHITE: 0xffffff,// Ojos saltones blancos
        SNAKE_PUPIL: 0x0f172a,     // Pupila negra
        SNAKE_TONGUE: 0xf43f5e,    // Lengüita rosa / roja
        SNAKE_IMMUNE_GLOW: 0x38bdf8,// Resplandor cian eléctrico en inmunidad
        
        // Manzanas 3D
        APPLE_RED: 0xef4444,       // Rojo manzana vibrante
        APPLE_STEM: 0x78350f,      // Tronquito café
        APPLE_LEAF: 0x22c55e,      // Hoja verde viva
        APPLE_GOLD: 0xfbbf24,      // Manzana dorada brillante
        APPLE_BLUE: 0x0284c7,      // Azul eléctrico vibrante (Power-Up)
        APPLE_BLUE_EMISSIVE: 0x38bdf8, // Brillo cian neón
        
        // Partículas
        PARTICLE_EAT: 0x22c55e,
        PARTICLE_CRASH: 0xef4444,
        PARTICLE_BLUE: 0x00f5ff,    // Chispas azules de power-up
        PARTICLE_WARP: 0x38bdf8     // Destello de teletransporte
    },

    // Las 4 direcciones cardinales del Snake Clásico (en el plano X, Z)
    DIRECTIONS: {
        UP:    { x:  0, z: -1, name: 'Arriba' },
        DOWN:  { x:  0, z:  1, name: 'Abajo' },
        LEFT:  { x: -1, z:  0, name: 'Izquierda' },
        RIGHT: { x:  1, z:  0, name: 'Derecha' }
    },

    // Modos de cámara
    CAMERA_MODES: {
        ISOMETRIC_3D: 'ISOMETRIC_3D', // Vista cenital inclinada en 3D (Recomendada)
        TOP_DOWN: 'TOP_DOWN',         // Vista superior clásica
        CHASE_3D: 'CHASE_3D'          // Vista cercana en 3D
    }
};

window.CONFIG = CONFIG;
