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

    // Paleta de Colores Vivos y Llamativos (Estilo Google Snake / Arena y Verde)
    COLORS: {
        SKY: 0x93c5fd,             // Azul cielo veraniego
        FOG: 0xa5f3fc,
        
        // Tablero tipo arena con baldosas alternadas estilo ajedrez
        SAND_LIGHT: 0xf3e8cb,      // Arena clara cálida
        SAND_DARK: 0xe5d4ab,       // Arena dorada cálida
        SAND_BORDER: 0xd4bc87,     // Borde de la arena
        
        // Paredes 3D delimitadoras (Terracota / arcilla brillante estilo juguete)
        WALL_BASE: 0xc2410c,       // Terracota vivo
        WALL_TOP: 0xea580c,        // Naranja terracota superior
        
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
