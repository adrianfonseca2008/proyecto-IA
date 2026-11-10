# ⚡ SNAKE 3D: Cybernetic Protocol

> **Motor Gráfico:** WebGL 2.0 / Three.js r128  
> **Estética:** Cyberpunk / Sci-Fi Futurista Comercial (Plataforma cyber reflectiva, cuadrícula de neón cian, barreras de plasma láser perimetrales, iluminación cinematográfica dual rim-light, partículas de datos estelares y mecha snake 3D con shaders PBR)  
> **Audio:** Sintetizador procedural con Web Audio API (FM, sub-bass, arpegios cuánticos, barridos láser, 100% offline)  
> **UI/UX:** Interfaz táctica con Glassmorphism, tipografía Orbitron & Rajdhani, menú principal con fondo 3D interactivo y modales de configuración y protocolo  

---

## 1. Visión y Arquitectura del Videojuego

Esta versión transforma completamente el juego clásico en una **experiencia de videojuego 3D comercial**, combinando controles de alta precisión con tecnología gráfica contemporánea:

* **Plataforma Cybernetic Arena:** Base flotante de fibra de carbono oscura biselada con baldosas obsidian/grafito PBR reflectivas, cuadrícula de neón cian luminiscente con nodos de intersección y emblema central de precisión.
* **Barreras Perimetrales de Plasma Láser:** Pilones de confinamiento octogonales con núcleos cristalinos en las 4 esquinas y rieles de plasma con haces de láser cian palpitantes que delimitan la arena.
* **Mecha Snake 3D:** Serpiente cibernética aerodinámica con chasis de carbono metálico, visor holográfico frontal que emite un foco de luz dinámico hacia la pista, aletas de neón esmeralda y cápsulas corporales con anillos de poder alternados.
* **Modo Cambio de Fase Cuántica (Phase Shift):** Al recolectar el Orbe Azul, la serpiente se transforma en un holograma cuántico translúcido (`opacity: 0.38` con aura cian) durante 2.0 segundos, permitiendo atravesar su propio cuerpo y **teletransportarse por las barreras perimetrales estilo Nokia**.
* **Menú Principal con Escenario 3D Vivo:** El menú principal cuenta con un fondo interactivo en tiempo real donde la serpiente realiza patrullas autónomas con órbita cinemática de cámara mientras el jugador navega por las opciones.

---

## 2. Coleccionables Holográficos (Energy Cores)

| Núcleo 3D | Visual Holográfico | Efecto en el Sistema |
|---|---|---|
| **🔴 Núcleo Carmesí (Standard)** | Icosaedro facetado carmesí con anillos giroscópicos cuánticos | +1 punto. Extiende el chasis mecha e incrementa la velocidad progresiva de la cuadrícula. |
| **🟡 Núcleo Solar (Quantum Bonus)** | Octaedro solar dorado con corona estelar | +3 puntos y crecimiento acelerado (+2 segmentos). Aparece temporalmente. |
| **🔵 Orbe de Fase (Shield Overdrive)** | Esfera de confinamiento electromagnético cian | +2 puntos y **2.0 segundos de Escudo de Fase Cuántica**: la serpiente se vuelve translúcida, atraviesa su cuerpo y se teletransporta por las barreras estilo Nokia clásico. |

---

## 3. Controles del Sistema

| Acción | Teclas Primarias | Flechas del Teclado | Pad Táctil |
|---|---|---|---|
| **Vector Norte (Arriba)** | `W` | `Flecha Arriba` | Botón `▲` |
| **Vector Sur (Abajo)** | `S` | `Flecha Abajo` | Botón `▼` |
| **Vector Oeste (Izquierda)** | `A` | `Flecha Izquierda` | Botón `◀` |
| **Vector Este (Derecha)** | `D` | `Flecha Derecha` | Botón `▶` |
| **Modo de Cámara** | `C` | Botón HUD 🎥 | Isométrica 3D / Radar 2D / Seguimiento |
| **Pausar Protocolo** | `P` o `Escape` | Botón HUD ⏸️ | Pausa |
| **Alternar Audio** | `M` | Botón HUD 🔊 | Silenciar / Activar |
| **Reinicio Rápido** | `R` | Botón HUD 🔄 | Reiniciar Misión |
| **Despliegue / Continuar** | `Enter` o `Espacio` | Botones de Diálogo | Confirmar |

---

## 4. Estructura Modular del Proyecto

```text
snake_3d/
├── index.html            # Lienzo WebGL, HUD Glassmorphism, Menú Principal y Modales
├── iniciar_juego.bat     # Lanzador para Windows (doble clic)
├── README.md             # Documentación técnica del proyecto
├── css/
│   └── style.css         # Estilos Cyberpunk, efectos neón, animaciones y diseño responsive
└── js/
    ├── constants.js      # Paleta neón/oscura, dificultades, dimensiones y parámetros
    ├── audio.js          # Sintetizador procedural con Web Audio API (FM, sub-bass, arpegios)
    ├── input.js          # Captura y buffer de comandos (teclado, touch dpad)
    ├── world.js          # Plataforma cyber, barreras de plasma, motes estelares y partículas
    ├── camera.js         # Controlador de cámara cinemática y órbita para el menú
    ├── food.js           # Cores holográficos con giroscopios cuánticos y luces dinámicas
    ├── snake.js          # Mecha snake 3D con visor láser, IA para demo de menú e interpolación
    └── game.js           # Máquina de estados (MENU, PLAYING, PAUSED, GAME_OVER), HUD y progreso
```

---

## 5. Instrucciones de Ejecución

1. Entra en la carpeta `snake_3d`.
2. Haz doble clic en `iniciar_juego.bat` o abre directamente `index.html` en cualquier navegador moderno.
3. ¡Comienza tu misión en el protocolo cibernético de Snake 3D!
