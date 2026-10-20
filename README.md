# 🐍 Snake 3D Clásico — Tablero de Arena (Estilo Google Snake)

> **Motor Gráfico:** WebGL 2.0 / Three.js  
> **Estética:** Visuales 3D llamativos estilo Google Snake (Tablero plano de arena con baldosas ajedrezadas, gusano verde con ojos expresivos, manzanas rojas 3D y paredes perimetrales en relieve)  
> **Controles:** Sistema clásico 2D de 4 direcciones (Arriba, Abajo, Izquierda, Derecha)  
> **Audio:** Síntesis procedural con Web Audio API (100% offline)  

---

## 1. Visión y Enfoque del Juego

Esta versión rediseñada combina la **jugabilidad clásica y adictiva del Snake tradicional** (movimiento en un plano 2D sin necesidad de ascender ni descender) con la **riqueza visual del modelado 3D contemporáneo**:

* **Mapa Plano de Arena:** Tablero estilo Google Snake con baldosas de arena alternadas en dos tonos cálidos (`#f3e8cb` y `#e5d4ab`) y pequeñas piedritas decorativas en las esquinas.
* **Paredes 3D Reales:** Las fronteras del mapa son muros elevados 3D en tono terracota brillante (`#ea580c`), que proyectan sombras suaves sobre el suelo arenoso para una noción táctil de profundidad.
* **Gusano Verde 3D:** Un simpático personaje verde vibrante (`#22c55e`) con cabeza redondeada, ojos saltones blancos con pupilas negras, lengüita rosada y segmentos corporales que se desplazan de forma continua y fluida a 60 FPS mediante interpolación (`Vector3.lerp`).
* **Manzanas Rojitas en 3D:** Frutas tridimensionales de color rojo brillante (`#ef4444`) con tallo marrón y hojita verde, que flotan y rotan suavemente sobre las casillas de arena (+1 punto).
* **🔷 Manzana Azul (Power-Up de Inmunidad):** Ítem especial resplandeciente con luz puntual propia. Al ser consumido otorga:
  * **2.0 segundos de Inmunidad** exacta con un contador visual flotante en pantalla (`HUD`).
  * **Gusano Translúcido / Fantasmal:** El cuerpo verde se vuelve semitransparente con un suave resplandor cian parpadeante.
  * **Atravesar el Propio Cuerpo:** La serpiente puede cruzar libremente sobre sus propios segmentos sin morir.
  * **Teletransporte Envolvente (Estilo Nokia):** Al impactar contra cualquier muro perimetral 3D, la serpiente se teletransporta instantáneamente al extremo opuesto de la arena, acompañada de efectos de partículas de portal y sonido de salto cuántico.
* **Cámara Tipo 2D/3D (Tabletop Perspective):** Ángulo cenital inclinado que ofrece una vista despejada de todo el tablero sin puntos ciegos, apreciando el relieve de todos los elementos 3D.

---

## 2. Tipos de Manzanas y Mecánicas

| Manzana | Visual 3D | Efecto al Comer |
|---|---|---|
| **Manzana Roja** | Esfera roja brillante con tallo y hoja verde | +1 punto y la serpiente alarga su cuerpo. Aumenta sutilmente la velocidad del juego. |
| **Manzana Azul (Power-Up)** | Esfera azul eléctrica pulsante con luz cian | +2 puntos y **2 segundos de inmunidad**: el gusano se vuelve transparente, atraviesa su propio cuerpo y se teletransporta a través de las paredes como en el Snake clásico de Nokia. |
| **Manzana Dorada (Bonus)** | Esfera de oro metalizada con destellos dorados | +3 puntos y crecimiento rápido (Aparece temporalmente por tiempo limitado). |

---

## 3. Controles de Juego

| Acción | Teclado Principal | Flechas del Teclado | Pad en Pantalla |
|---|---|---|---|
| **Arriba** | `W` | `Flecha Arriba` | Botón `▲` |
| **Abajo** | `S` | `Flecha Abajo` | Botón `▼` |
| **Izquierda** | `A` | `Flecha Izquierda` | Botón `◀` |
| **Derecha** | `D` | `Flecha Derecha` | Botón `▶` |
| **Alternar Cámara** | `C` | Botón HUD 🎥 | 3D Cenital / Plana / Seguimiento |
| **Pausar / Reanudar** | `P` o `Escape` | Botón HUD ⏸️ | Pausa |
| **Reiniciar Juego** | `Enter` o `Espacio` | Botón Modal | Reintentar |

---

## 4. Estructura de Archivos

```text
snake_3d/
├── index.html            # Lienzo 3D, HUD superior, badge de inmunidad y modales
├── iniciar_juego.bat     # Lanzador para Windows (doble clic)
├── README.md             # Documentación técnica del proyecto
├── css/
│   └── style.css         # Estilo visual limpio, badge de inmunidad pulsante y pad táctil
└── js/
    ├── constants.js      # Constantes de juego, tiempos de inmunidad, colores y física
    ├── audio.js          # Efectos sonoros arcade (comer, choque, power-up eléctrico y teletransporte)
    ├── input.js          # Captura 4 direcciones y filtro anti-giro de 180°
    ├── world.js          # Tablero de arena ajedrezado, paredes 3D y partículas de teletransporte
    ├── camera.js         # Vista 3D cenital de lectura instantánea sin ángulos ciegos
    ├── food.js           # Manzanas 3D: Roja básica, Dorada bonus y Azul power-up con punto de luz
    ├── snake.js          # Gusano verde con ojos, lengua, modo translúcido y salto envolvente
    └── game.js           # Bucle principal, temporizador de inmunidad y gestión de estados
```

---

## 5. Instrucciones de Ejecución

1. Entra en la carpeta `snake_3d`.
2. Haz doble clic en `index.html` (o ejecuta `iniciar_juego.bat`).
3. ¡Diviértete recolectando manzanas rojas, cazando la manzana azul para activar el modo Nokia y superando tu propio récord!
