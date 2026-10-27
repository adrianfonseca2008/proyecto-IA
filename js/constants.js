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

    // Paleta de Colores Super Vivos y Llamativos (Estilo Google Snake / Nintendo / Bosque Vibrante)
    COLORS: {
        SKY: 0x38bdf8,             // Azul celeste radiante y cristalino
        FOG: 0x7dd3fc,             // Niebla atmosférica suave y luminosa
        
        // Caja de cartón (Tablero / Arena donde se mueve el gusanito)
        CARDBOARD_LIGHT: 0xdeb887, // Cartón kraft dorado cálido luminoso (baldosas A)
        CARDBOARD_DARK: 0xc99859,  // Cartón kraft cálido para patrón ajedrezado nítido (baldosas B)
        CARDBOARD_BASE: 0xad7339,  // Base inferior de la caja
        CARDBOARD_WALL: 0xba7f43,  // Paredes interiores y exteriores de cartón
        CARDBOARD_RIM: 0x874e1d,   // Borde superior corrugado del cartón
        CARDBOARD_FLAP: 0xd49b5f,  // Solapas exteriores abiertas de la caja
        CARDBOARD_SEAM: 0x753e16,  // Líneas de pliegue y uniones del cartón
        CARDBOARD_TAPE: 0xffeed6,  // Cinta adhesiva de embalaje con brillo satinado
        CARDBOARD_STAMP: 0x3d200a, // Tinta oscura para sellos en el cartón

        // Compatibilidad con referencias anteriores
        SAND_LIGHT: 0xdeb887,
        SAND_DARK: 0xc99859,
        SAND_BORDER: 0xad7339,
        WALL_BASE: 0xba7f43,
        WALL_TOP: 0x874e1d,

        // Bosque exterior (Césped vibrante, flores vivas, árboles y vegetación)
        GRASS_GROUND: 0x22c55e,    // Césped verde esmeralda super vivo y radiante
        GRASS_DARK: 0x16a34a,      // Verde bosque profundo
        GRASS_TUFT: 0x4ade80,      // Briznas de hierba verde lima brillante
        GRASS_LIME: 0x86efac,      // Hierba verde claro radiante
        
        // Madera y Árboles
        TREE_TRUNK: 0x78350f,      // Tronco de roble marrón cálido
        TREE_BIRCH: 0xf8fafc,      // Tronco de abedul blanco puro
        TREE_BIRCH_SPOT: 0x1e293b, // Motitas oscuras de abedul
        TREE_LEAVES_A: 0x15803d,   // Verde bosque profundo
        TREE_LEAVES_B: 0x22c55e,   // Verde manzana viva
        TREE_LEAVES_C: 0x4ade80,   // Verde lima radiante
        TREE_LEAVES_MINT: 0x10b981,// Verde menta / esmeralda
        TREE_LEAVES_GOLD: 0xfbbf24,// Follaje dorado de sol
        TREE_APPLE: 0xff1744,      // Manzanitas rojas colgando de los árboles
        
        // Elementos de la naturaleza
        BUSH_GREEN: 0x16a34a,      // Arbustos redondos
        BUSH_LIME: 0x22c55e,       // Arbusto verde vivo
        BERRY_RED: 0xff1744,       // Bayas rojas brillantes en arbustos
        BERRY_GOLD: 0xffd600,      // Bayas doradas
        LOG_WOOD: 0x603813,        // Tronco caído de madera
        MOSS_GREEN: 0x4ade80,      // Musgo verde en troncos y rocas
        STONE_GRAY: 0x94a3b8,      // Piedras de río
        CLOUD_WHITE: 0xffffff,     // Nubes esponjosas en el cielo
        
        // Hongos y Setas Mágicas
        MUSHROOM_CAP_RED: 0xff1744,// Hongo rojo vivo
        MUSHROOM_CAP_BLUE: 0x0ea5e9,// Hongo azul mágico
        MUSHROOM_CAP_PURPLE: 0xa855f7,// Hongo violeta
        MUSHROOM_STEM: 0xfffbeb,   // Tallo blanco crema
        
        // Flores silvestres hiper llamativas
        FLOWER_CENTER: 0xffd600,   // Centro amarillo sol brillante
        FLOWER_WHITE: 0xffffff,    // Margarita blanca pura
        FLOWER_RED: 0xff0055,      // Amapola rojo carmesí vivo
        FLOWER_BLUE: 0x00b4d8,     // Nomeolvides celeste neón
        FLOWER_YELLOW: 0xffea00,   // Diente de león amarillo sol
        FLOWER_PURPLE: 0xc084fc,   // Orquídea violeta brillante
        FLOWER_ORANGE: 0xff7a00,   // Caléndula naranja vivo
        FLOWER_PINK: 0xff3b94,     // Flor rosa fucsia vibrante
        
        // Serpiente 3D (Verde vivo Google Snake ultra llamativo)
        SNAKE_HEAD: 0x10b981,      // Verde esmeralda vivo
        SNAKE_HEAD_DARK: 0x059669,
        SNAKE_BODY_A: 0x22c55e,    // Verde brillante
        SNAKE_BODY_B: 0x16a34a,    // Verde vivo alternado
        SNAKE_EYES_WHITE: 0xffffff,// Ojos saltones blancos
        SNAKE_PUPIL: 0x0f172a,     // Pupila negra
        SNAKE_TONGUE: 0xff0055,    // Lengüita rojo fresa viva
        SNAKE_IMMUNE_GLOW: 0x00f5ff,// Resplandor cian eléctrico en inmunidad
        
        // Manzanas 3D súper apetitosas y brillantes
        APPLE_RED: 0xff1744,       // Rojo rubí saturado y brillante
        APPLE_STEM: 0x5c2c0e,      // Tronquito café chocolate
        APPLE_LEAF: 0x00e676,      // Hoja verde esmeralda brillante
        APPLE_GOLD: 0xffb703,      // Oro radiante reluciente
        APPLE_BLUE: 0x00b4d8,      // Azul cian eléctrico vibrante
        APPLE_BLUE_EMISSIVE: 0x00f5ff, // Brillo cian neón intenso
        
        // Partículas
        PARTICLE_EAT: 0x22c55e,
        PARTICLE_CRASH: 0xff1744,
        PARTICLE_BLUE: 0x00f5ff,
        PARTICLE_WARP: 0x38bdf8
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
