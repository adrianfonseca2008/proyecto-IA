/**
 * ====================================================================
 * SNAKE 3D: CYBERNETIC PROTOCOL - SERPIENTE MECHA CYBER 3D
 * ====================================================================
 * Modela una serpiente cibernética con chasis de fibra de carbono oscura,
 * circuitos de neón esmeralda/cian integrados, visor láser frontal que
 * proyecta luz dinámica en la cuadrícula, y segmentos articulados.
 *
 * Características avanzadas:
 * 1. Cabeza mecha aerodinámica con visor holográfico y propulsores laterales.
 * 2. Segmentos corporales con núcleos de polímero oscuro y anillos de neón.
 * 3. Modo Cambio de Fase Cuántica (Inmunidad): Holograma translúcido cian.
 * 4. Modo Demo Autónomo para el Menú Principal: Navegación libre para fondo 3D vivo.
 * 5. Interpolación continua Lerp a 60 FPS con giro fluido y banking de giro.
 */

class Snake3D {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();
        this.scene.add(this.group);

        this.segments = [];
        this.growPending = 0;
        this.direction = { ...CONFIG.DIRECTIONS.RIGHT };
        this.isImmune = false;
        this.currentTilt = 0;

        this.initMaterials();
        this.reset();
    }

    initMaterials() {
        // Chasis de fibra de carbono oscura para la cabeza mecha
        this.headChassisMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.SNAKE_HEAD_CHASSIS,
            roughness: 0.22,
            metalness: 0.88
        });

        // Visor láser holográfico frontal
        this.visorMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.SNAKE_VISOR,
            emissive: CONFIG.COLORS.SNAKE_VISOR,
            emissiveIntensity: 1.4,
            roughness: 0.1,
            metalness: 0.2
        });

        // Acentos de neón en la cabeza
        this.accentMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.SNAKE_HEAD_ACCENT,
            emissive: CONFIG.COLORS.SNAKE_HEAD_ACCENT,
            emissiveIntensity: 0.9,
            roughness: 0.2
        });

        // Núcleo interno oscuro de los segmentos
        this.bodyCoreMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.SNAKE_CORE_DARK,
            roughness: 0.3,
            metalness: 0.85
        });

        // Anillos de neón alternados (Esmeralda / Cian)
        this.bodyRingMatA = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.SNAKE_BODY_A,
            emissive: CONFIG.COLORS.SNAKE_BODY_A,
            emissiveIntensity: 0.85,
            roughness: 0.2,
            metalness: 0.3
        });

        this.bodyRingMatB = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.SNAKE_BODY_B,
            emissive: CONFIG.COLORS.SNAKE_BODY_B,
            emissiveIntensity: 0.85,
            roughness: 0.2,
            metalness: 0.3
        });

        // Columna vertebral energética
        this.spineMat = new THREE.MeshBasicMaterial({
            color: CONFIG.COLORS.SNAKE_SPINE
        });
    }

    /**
     * Alterna el modo de Cambio de Fase Cuántica (Inmunidad)
     */
    setImmunity(immune) {
        if (this.isImmune === immune) return;
        this.isImmune = immune;

        const allMats = [
            this.headChassisMat,
            this.bodyCoreMat,
            this.bodyRingMatA,
            this.bodyRingMatB,
            this.accentMat
        ];

        if (this.isImmune) {
            allMats.forEach(mat => {
                mat.transparent = true;
                mat.opacity = 0.38;
                mat.emissive.setHex(CONFIG.COLORS.SNAKE_IMMUNE_HOLO);
                mat.emissiveIntensity = 0.95;
            });
            this.visorMat.opacity = 0.6;
        } else {
            allMats.forEach(mat => {
                mat.transparent = false;
                mat.opacity = 1.0;
            });
            this.headChassisMat.emissive.setHex(0x000000);
            this.headChassisMat.emissiveIntensity = 0;
            this.bodyCoreMat.emissive.setHex(0x000000);
            this.bodyCoreMat.emissiveIntensity = 0;
            this.bodyRingMatA.emissive.setHex(CONFIG.COLORS.SNAKE_BODY_A);
            this.bodyRingMatA.emissiveIntensity = 0.85;
            this.bodyRingMatB.emissive.setHex(CONFIG.COLORS.SNAKE_BODY_B);
            this.bodyRingMatB.emissiveIntensity = 0.85;
            this.accentMat.emissive.setHex(CONFIG.COLORS.SNAKE_HEAD_ACCENT);
            this.accentMat.emissiveIntensity = 0.9;
            this.visorMat.opacity = 1.0;
        }
    }

    gridToWorld(x, z) {
        const offX = (CONFIG.GRID_WIDTH - 1) / 2;
        const offZ = (CONFIG.GRID_HEIGHT - 1) / 2;
        return new THREE.Vector3(
            (x - offX) * CONFIG.CELL_SIZE,
            CONFIG.CELL_SIZE * 0.44,
            (z - offZ) * CONFIG.CELL_SIZE
        );
    }

    reset() {
        while (this.group.children.length > 0) {
            this.group.remove(this.group.children[0]);
        }

        this.setImmunity(false);
        this.segments = [];
        this.growPending = 0;
        this.direction = { ...CONFIG.DIRECTIONS.RIGHT };

        const startX = Math.floor(CONFIG.GRID_WIDTH / 2) - 2;
        const startZ = Math.floor(CONFIG.GRID_HEIGHT / 2);

        this.addSegment(startX, startZ, true);
        this.addSegment(startX - 1, startZ, false);
        this.addSegment(startX - 2, startZ, false);
    }

    /**
     * Construye un segmento 3D: cabeza mecha aerodinámica o cápsula corporal
     */
    addSegment(x, z, isHead) {
        let mesh;
        const radius = CONFIG.CELL_SIZE * 0.42;

        if (isHead) {
            mesh = new THREE.Group();

            // 1. Chasis principal de la cabeza (forma de cuña aerodinámica)
            const chassisGeo = new THREE.SphereGeometry(radius, 16, 16);
            chassisGeo.scale(1.05, 0.82, 1.25);
            const chassis = new THREE.Mesh(chassisGeo, this.headChassisMat);
            chassis.castShadow = true;
            chassis.receiveShadow = true;
            mesh.add(chassis);

            // 2. Cresta superior reforzada
            const crestGeo = new THREE.BoxGeometry(radius * 0.45, radius * 0.35, radius * 1.5);
            const crest = new THREE.Mesh(crestGeo, this.headChassisMat);
            crest.position.set(0, radius * 0.5, 0);
            crest.castShadow = true;
            mesh.add(crest);

            // 3. Visor láser holográfico envolvente
            const visorGeo = new THREE.BoxGeometry(radius * 1.35, radius * 0.22, radius * 0.45);
            const visor = new THREE.Mesh(visorGeo, this.visorMat);
            visor.position.set(0, radius * 0.22, radius * 0.85);
            mesh.add(visor);

            // 4. Acentos de neón laterales (Aletas aerodinámicas)
            const finGeo = new THREE.BoxGeometry(0.08, radius * 0.35, radius * 0.8);
            const finL = new THREE.Mesh(finGeo, this.accentMat);
            finL.position.set(-radius * 0.95, radius * 0.1, -radius * 0.1);
            finL.rotation.z = -0.2;
            mesh.add(finL);

            const finR = new THREE.Mesh(finGeo, this.accentMat);
            finR.position.set(radius * 0.95, radius * 0.1, -radius * 0.1);
            finR.rotation.z = 0.2;
            mesh.add(finR);

            // 5. Luz frontal proyectada sobre la pista
            const headLight = new THREE.SpotLight(CONFIG.COLORS.SNAKE_VISOR, 1.4, CONFIG.CELL_SIZE * 5, Math.PI / 4, 0.5);
            headLight.position.set(0, radius * 0.3, radius * 0.7);
            headLight.target.position.set(0, 0, radius * 4.0);
            mesh.add(headLight);
            mesh.add(headLight.target);

        } else {
            mesh = new THREE.Group();
            const idx = this.segments.length;
            const ringMat = idx % 2 === 0 ? this.bodyRingMatA : this.bodyRingMatB;

            // Escala progresiva suave hacia la cola
            const factor = Math.max(0.65, 1.0 - (idx / 40));

            // Núcleo de polímero oscuro
            const coreGeo = new THREE.SphereGeometry(radius * 0.88, 14, 14);
            const core = new THREE.Mesh(coreGeo, this.bodyCoreMat);
            core.scale.set(factor, factor * 0.88, factor);
            core.castShadow = true;
            core.receiveShadow = true;
            mesh.add(core);

            // Anillo exterior de neón luminoso
            const ringGeo = new THREE.TorusGeometry(radius * 0.84 * factor, 0.09 * factor, 8, 16);
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = Math.PI / 2;
            mesh.add(ring);

            // Nodo dorsal luminoso
            const nodeGeo = new THREE.BoxGeometry(0.12 * factor, 0.12 * factor, 0.25 * factor);
            const node = new THREE.Mesh(nodeGeo, this.spineMat);
            node.position.y = radius * 0.8 * factor;
            mesh.add(node);
        }

        const worldPos = this.gridToWorld(x, z);
        mesh.position.copy(worldPos);
        this.group.add(mesh);

        this.segments.push({
            x: x,
            z: z,
            prevX: x,
            prevZ: z,
            mesh: mesh,
            isHead: isHead
        });
    }

    getOccupiedCells() {
        return this.segments.map(s => ({ x: s.x, z: s.z }));
    }

    getHeadPosition() {
        return { x: this.segments[0].x, z: this.segments[0].z };
    }

    getHeadWorldPosition() {
        return this.segments[0].mesh.position.clone();
    }

    /**
     * Avanza el gusano 1 casilla en el tablero cyber
     */
    step(newDirection, isImmune = false) {
        this.direction = newDirection;
        const head = this.segments[0];

        // Guardar posiciones previas para interpolación a 60 FPS
        for (let i = 0; i < this.segments.length; i++) {
            this.segments[i].prevX = this.segments[i].x;
            this.segments[i].prevZ = this.segments[i].z;
        }

        let nextX = head.x + this.direction.x;
        let nextZ = head.z + this.direction.z;
        let teleported = false;

        // Comprobación de barreras perimetrales
        const outOfBounds = (
            nextX < 0 || nextX >= CONFIG.GRID_WIDTH ||
            nextZ < 0 || nextZ >= CONFIG.GRID_HEIGHT
        );

        if (outOfBounds) {
            if (isImmune) {
                // TELETRANSPORTE CUÁNTICO (Estilo Nokia Wrap-around)
                teleported = true;
                if (nextX < 0) nextX = CONFIG.GRID_WIDTH - 1;
                else if (nextX >= CONFIG.GRID_WIDTH) nextX = 0;

                if (nextZ < 0) nextZ = CONFIG.GRID_HEIGHT - 1;
                else if (nextZ >= CONFIG.GRID_HEIGHT) nextZ = 0;
            } else {
                return { collision: true, type: 'WALL', teleported: false };
            }
        }

        // Comprobación de auto-colisión (atravesar cuerpo si es inmune)
        if (!isImmune) {
            const checkLength = this.growPending > 0 ? this.segments.length : this.segments.length - 1;
            for (let i = 1; i < checkLength; i++) {
                if (this.segments[i].x === nextX && this.segments[i].z === nextZ) {
                    return { collision: true, type: 'SELF', teleported: false };
                }
            }
        }

        // Crecimiento
        if (this.growPending > 0) {
            const tail = this.segments[this.segments.length - 1];
            this.addSegment(tail.x, tail.z, false);
            this.growPending--;
        }

        // Desplazar segmentos del cuerpo
        for (let i = this.segments.length - 1; i > 0; i--) {
            this.segments[i].x = this.segments[i - 1].x;
            this.segments[i].z = this.segments[i - 1].z;
        }

        head.x = nextX;
        head.z = nextZ;

        return { collision: false, teleported: teleported };
    }

    grow(amount = 1) {
        this.growPending += amount;
    }

    /**
     * IA Autónoma para el fondo animado del Menú Principal
     */
    getSafeDemoDirection(foodPos) {
        const head = this.segments[0];
        const currentDir = this.direction;
        const candidates = [
            CONFIG.DIRECTIONS.UP,
            CONFIG.DIRECTIONS.RIGHT,
            CONFIG.DIRECTIONS.DOWN,
            CONFIG.DIRECTIONS.LEFT
        ];

        // Filtrar giros imposibles de 180 grados
        const valid = candidates.filter(d => !(d.x === -currentDir.x && d.z === -currentDir.z));

        // Ponderar movimientos que no choquen y se acerquen a la comida
        const safeCandidates = [];
        for (const dir of valid) {
            const nx = head.x + dir.x;
            const nz = head.z + dir.z;

            // Evitar bordes
            if (nx < 1 || nx >= CONFIG.GRID_WIDTH - 1 || nz < 1 || nz >= CONFIG.GRID_HEIGHT - 1) {
                continue;
            }

            // Evitar el propio cuerpo
            let hitSelf = false;
            for (let i = 1; i < this.segments.length; i++) {
                if (this.segments[i].x === nx && this.segments[i].z === nz) {
                    hitSelf = true;
                    break;
                }
            }
            if (hitSelf) continue;

            // Distancia a comida
            const dist = foodPos ? Math.hypot(nx - foodPos.x, nz - foodPos.z) : 0;
            safeCandidates.push({ dir, dist });
        }

        if (safeCandidates.length > 0) {
            safeCandidates.sort((a, b) => a.dist - b.dist);
            // 85% de las veces ir hacia la comida, 15% giro aleatorio seguro
            return Math.random() < 0.85 ? safeCandidates[0].dir : safeCandidates[Math.floor(Math.random() * safeCandidates.length)].dir;
        }

        return currentDir;
    }

    /**
     * Interpolación suave a 60 FPS con teletransporte y banking cinemático
     */
    updateInterpolation(alpha) {
        if (this.isImmune) {
            const pulse = 0.35 + Math.sin(Date.now() * 0.015) * 0.25;
            this.headChassisMat.opacity = pulse;
            this.bodyCoreMat.opacity = pulse;
            this.bodyRingMatA.opacity = pulse;
            this.bodyRingMatB.opacity = pulse;
        }

        for (let i = 0; i < this.segments.length; i++) {
            const seg = this.segments[i];

            let pX = seg.prevX;
            let pZ = seg.prevZ;

            // Coordenadas virtuales para evitar estiramiento en teletransporte Nokia
            if (seg.x - seg.prevX > 1) {
                pX = CONFIG.GRID_WIDTH;
            } else if (seg.prevX - seg.x > 1) {
                pX = -1;
            }

            if (seg.z - seg.prevZ > 1) {
                pZ = CONFIG.GRID_HEIGHT;
            } else if (seg.prevZ - seg.z > 1) {
                pZ = -1;
            }

            const pWorld = this.gridToWorld(pX, pZ);
            const cWorld = this.gridToWorld(seg.x, seg.z);

            seg.mesh.position.x = THREE.MathUtils.lerp(pWorld.x, cWorld.x, alpha);
            seg.mesh.position.z = THREE.MathUtils.lerp(pWorld.z, cWorld.z, alpha);

            // Orientación suave de la cabeza
            if (seg.isHead) {
                let targetAngle = 0;
                if (this.direction.x === 1) targetAngle = Math.PI / 2;
                else if (this.direction.x === -1) targetAngle = -Math.PI / 2;
                else if (this.direction.z === -1) targetAngle = Math.PI;
                else if (this.direction.z === 1) targetAngle = 0;

                seg.mesh.rotation.y = targetAngle;
            }
        }
    }
}

window.Snake3D = Snake3D;
