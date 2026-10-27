# 🐍 Snake 3D — Caja de Cartón en el Bosque (Estilo Google Snake)

> **Motor Gráfico:** WebGL 2.0 / Three.js  
> **Estética:** Diorama 3D vibrante y cálido (Arena/tablero en el interior de una caja de cartón kraft con solapas y cinta de embalaje, rodeada de un bosque soleado con césped, flores silvestres, setas y árboles que se mecen con la brisa)  
> **Controles:** Sistema clásico 2D de 4 direcciones (Arriba, Abajo, Izquierda, Derecha)  
> **Audio:** Síntesis procedural con Web Audio API (100% offline)  

---

## 1. Visión y Enfoque del Juego

Esta versión combina la **jugabilidad clásica y adictiva del Snake tradicional** (movimiento en un plano 2D sin necesidad de ascender ni descender) con la **riqueza visual de una maqueta 3D tipo diorama**:

* **Caja de Cartón Kraft (Arena de Juego):** El tablero donde se mueve el gusanito es el interior de una caja de cartón con baldosas ajedrezadas en dos tonos kraft (`#dcb285` y `#cfa070`), sellos de envío ("THIS SIDE UP", reciclaje ♻️), tiras de cinta de embalaje adhesiva y paredes de cartón corrugado con sus 4 solapas abiertas desplegadas hacia el césped exterior.
* **Fondo de Bosque Vivo:** Un claro de bosque soleado que rodea la caja, con un manto de césped fresco, decenas de flores silvestres de colores (margaritas blancas, amapolas rojas, flores celestes, amarillas y violetas), pequeños grupos de setas rojas con motas blancas, arbustos redondeados y árboles (frondosos y coníferas) que tienen una suave animación de balanceo con el viento.
* **Gusano Verde 3D:** Un simpático personaje verde vibrante (`#22c55e`) con cabeza redondeada, ojos saltones blancos con pupilas negras, lengüita rosada y segmentos corporales que se desplazan de forma continua y fluida a 60 FPS mediante interpolación (`Vector3.lerp`).
* **Manzanas Rojitas en 3D:** Frutas tridimensionales de color rojo brillante (`#ef4444`) con tallo marrón y hojita verde, que flotan y rotan suavemente sobre las casillas de la caja (+1 punto).
* **🔷 Manzana Azul (Power-Up de Inmunidad):** Ítem especial resplandeciente con luz puntual propia. Al ser consumido otorga:
  * **2.0 segundos de Inmunidad** exacta con un contador visual flotante en pantalla (`HUD`).
  * **Gusano Translúcido / Fantasmal:** El cuerpo verde se vuelve semitransparente con un suave resplandor cian parpadeante.
  * **Atravesar el Propio Cuerpo:** La serpiente puede cruzar libremente sobre sus propios segmentos sin morir.
  * **Teletransporte Envolvente (Estilo Nokia):** Al impactar contra cualquier muro de cartón 3D, la serpiente se teletransporta instantáneamente al extremo opuesto de la arena, acompañada de efectos de partículas de portal y sonido de salto cuántico.
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
