/**
 * ====================================================================
 * SNAKE 3D: CYBERNETIC PROTOCOL - CONSTANTES Y CONFIGURACIÓN
 * ====================================================================
 * Arquitectura de videojuego 3D profesional: estética Cyberpunk / Sci-Fi
 * con fondos oscuros, iluminación de neón (cian, esmeralda, magenta, oro),
 * materiales PBR metálicos y configuración modular de juego.
 */

const CONFIG = {
    // Dimensiones del tablero cyber (X x Z celdas)
    GRID_WIDTH: 18,            // 18 columnas
    GRID_HEIGHT: 18,           // 18 filas
    CELL_SIZE: 1.5,            // Tamaño físico de cada celda en unidades Three.js
    WALL_HEIGHT: 1.1,          // Altura de las barreras de plasma perimetrales

    // Dificultades y velocidades (en ms por tick)
    DIFFICULTIES: {
        NORMAL: { name: 'Normal', initialTick: 150, minTick: 70, step: 3 },
        HYPER:  { name: 'Hyper',  initialTick: 120, minTick: 55, step: 3 },
        INSANE: { name: 'Insane', initialTick: 90,  minTick: 45, step: 2 }
    },
    CURRENT_DIFFICULTY: 'NORMAL',

    INITIAL_TICK_MS: 150,      // Velocidad base
    MIN_TICK_MS: 65,           // Velocidad máxima permitida
    SPEED_UP_STEP_MS: 3,       // Aceleración por cada núcleo de energía recolectado

    // Puntuación y Orbes de Energía (Food)
    POINTS_PER_APPLE: 1,       // Núcleo rojo normal
    POINTS_BONUS_APPLE: 3,     // Núcleo cuántico dorado
    POINTS_BLUE_APPLE: 2,      // Orbe de fase azul (Shield)
    BONUS_SPAWN_CHANCE: 0.20,  // Probabilidad de núcleo cuántico
    BONUS_LIFETIME_TICKS: 36,  // Duración del bonus antes de expirar
    BLUE_SPAWN_CHANCE: 0.25,   // Probabilidad de orbe de fase
    BLUE_LIFETIME_TICKS: 45,   // Ticks de duración en el mapa
    IMMUNITY_DURATION_SEC: 2.0,// Duración del cambio de fase (Inmunidad + Nokia Wall Teleport)

    // Paleta de Colores Cyberpunk / Sci-Fi Neón sobre Oscuro
    COLORS: {
        // Entorno y Espacio Profundo
        SPACE_BG: 0x050811,         // Negro espacial profundo
        SPACE_FOG: 0x070c18,        // Niebla atmosférica cósmica
        STAR_COLOR: 0x67e8f9,       // Partículas de datos estelares
        
        // Plataforma Cybernetic Arena
        PLATFORM_BASE: 0x0a1122,    // Metal oscuro de soporte
        PLATFORM_BORDER: 0x0ea5e9,  // Borde biselado azul cyber
        TILE_DARK: 0x0c1527,        // Baldosa obsidiana A
        TILE_LIGHT: 0x111e38,       // Baldosa grafito B
        GRID_LINE: 0x00f5ff,        // Líneas de cuadrícula neón cian
        GRID_DOT: 0x38bdf8,         // Puntos de intersección
        
        // Barreras de Plasma Perimetrales (Paredes 3D)
        PYLON_DARK: 0x0f172a,       // Pilones de esquina metálicos
        PYLON_CORE: 0x00f5ff,       // Cristal de energía del pilón
        BARRIER_BASE: 0x0369a1,     // Riel inferior
        BARRIER_BEAM: 0x00f5ff,     // Rayo de plasma cian resplandeciente
        BARRIER_GLOW: 0x38bdf8,     // Resplandor de contención
        
        // Serpiente Mecha Cyber (Snake 3D)
        SNAKE_HEAD_CHASSIS: 0x0f172a, // Chasis de fibra de carbono oscura
        SNAKE_HEAD_ACCENT: 0x00ff88,  // Neón esmeralda / cian en la cabeza
        SNAKE_VISOR: 0x00f5ff,        // Visor holográfico frontal
        SNAKE_BODY_A: 0x00e676,       // Neón esmeralda brillante (anillo primario)
        SNAKE_BODY_B: 0x00b4d8,       // Neón cian eléctrico (anillo secundario)
        SNAKE_CORE_DARK: 0x0a0f1d,    // Núcleo interno de polímero oscuro
        SNAKE_SPINE: 0x38bdf8,        // Columna vertebral con pulso de energía
        SNAKE_IMMUNE_HOLO: 0x00f5ff,  // Holograma translúcido en inmunidad de fase
        
        // Coleccionables (Holographic Energy Cores)
        CORE_RED_PRIMARY: 0xff0055,   // Núcleo carmesí neón
        CORE_RED_EMISSIVE: 0xff2a6d,  // Resplandor rojo/magenta intenso
        CORE_RED_RINGS: 0xff5376,     // Anillos giroscópicos cuánticos
        
        CORE_GOLD_PRIMARY: 0xffb703,  // Núcleo solar dorado
        CORE_GOLD_EMISSIVE: 0xffd166, // Resplandor dorado estelar
        
        CORE_BLUE_PRIMARY: 0x00b4d8,  // Orbe de fase cian
        CORE_BLUE_EMISSIVE: 0x00f5ff, // Luz eléctrica de escudo
        
        // Sistema de Partículas y FX
        PARTICLE_CYAN: 0x00f5ff,
        PARTICLE_MAGENTA: 0xff007f,
        PARTICLE_GOLD: 0xffb703,
        PARTICLE_EMERALD: 0x00ff88,
        PARTICLE_SHIELD: 0x38bdf8
    },

    // 4 Direcciones cardinales clásicas
    DIRECTIONS: {
        UP:    { x:  0, z: -1, name: 'NORTE' },
        DOWN:  { x:  0, z:  1, name: 'SUR' },
        LEFT:  { x: -1, z:  0, name: 'OESTE' },
        RIGHT: { x:  1, z:  0, name: 'ESTE' }
    },

    // Modos de cámara cinemáticos
    CAMERA_MODES: {
        ISOMETRIC_3D: 'ISOMETRIC_3D', // Vista táctica 3D inclinada (Recomendada)
        TOP_DOWN: 'TOP_DOWN',         // Vista táctica radar 2D/3D
        CHASE_3D: 'CHASE_3D'          // Vista en tercera persona dinámica
    }
};

window.CONFIG = CONFIG;
