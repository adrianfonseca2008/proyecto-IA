/**
 * ====================================================================
 * SNAKE 3D CLÁSICO - GUSANO VERDE EN 3D (ESTILO GOOGLE SNAKE)
 * ====================================================================
 * Modela un gusano verde 3D con ojos animados, lengua rosada,
 * segmentos redondeados con sombras y movimiento fluido sobre el plano
 * de arena mediante interpolación continua (Lerp).
 * 
 * Incorpora modo INMUNIDAD (Manzana Azul):
 * - El gusano se vuelve translúcido/transparente con resplandor cian.
 * - Atraviesa su propio cuerpo sin colisionar.
 * - Al chocar con los muros, se teletransporta al extremo opuesto (estilo Nokia).
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

        // Geometrías compartidas
        const radius = CONFIG.CELL_SIZE * 0.44;
        this.headGeometry = new THREE.SphereGeometry(radius, 20, 20);
        this.bodyGeometry = new THREE.SphereGeometry(radius * 0.94, 16, 16);
        this.eyeWhiteGeometry = new THREE.SphereGeometry(radius * 0.28, 12, 12);
        this.pupilGeometry = new THREE.SphereGeometry(radius * 0.14, 10, 10);
        this.tongueGeometry = new THREE.BoxGeometry(radius * 0.22, 0.08, radius * 0.5);

        this.initMaterials();
        this.reset();
    }

    initMaterials() {
        // Verde brillante y llamativo para la cabeza
        this.headMaterial = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.SNAKE_HEAD,
            roughness: 0.22,
            metalness: 0.05,
            emissive: 0x064e3b,
            emissiveIntensity: 0.18
        });

        // Verdes alternados vibrantes para el cuerpo
        this.bodyMaterialA = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.SNAKE_BODY_A,
            roughness: 0.25,
            metalness: 0.05,
            emissive: 0x065f46,
            emissiveIntensity: 0.12
        });

        this.bodyMaterialB = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.SNAKE_BODY_B,
            roughness: 0.25,
            metalness: 0.05,
            emissive: 0x064e3b,
            emissiveIntensity: 0.12
        });

        // Ojos saltones blancos
        this.eyeWhiteMaterial = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.SNAKE_EYES_WHITE,
            roughness: 0.1
        });

        // Pupilas negras
        this.pupilMaterial = new THREE.MeshBasicMaterial({
            color: CONFIG.COLORS.SNAKE_PUPIL
        });

        // Lengüita rosa
        this.tongueMaterial = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.SNAKE_TONGUE,
            roughness: 0.3
        });
    }

    /**
     * Aplica o remueve el estado visual de inmunidad (Transparencia y resplandor)
     */
    setImmunity(immune) {
        if (this.isImmune === immune) return;
        this.isImmune = immune;

        const allMaterials = [
            this.headMaterial,
            this.bodyMaterialA,
            this.bodyMaterialB,
            this.tongueMaterial
        ];

        if (this.isImmune) {
            // Activar transparencia y brillo cian eléctrico
            allMaterials.forEach(mat => {
                mat.transparent = true;
                mat.opacity = 0.45;
                mat.emissive.setHex(CONFIG.COLORS.SNAKE_IMMUNE_GLOW);
                mat.emissiveIntensity = 0.55;
            });
            this.eyeWhiteMaterial.transparent = true;
            this.eyeWhiteMaterial.opacity = 0.6;
        } else {
            // Restaurar opacidad total normal
            allMaterials.forEach(mat => {
                mat.transparent = false;
                mat.opacity = 1.0;
                mat.emissive.setHex(0x000000);
                mat.emissiveIntensity = 0;
            });
            this.eyeWhiteMaterial.transparent = false;
            this.eyeWhiteMaterial.opacity = 1.0;
        }
    }

    gridToWorld(x, z) {
        const offX = (CONFIG.GRID_WIDTH - 1) / 2;
        const offZ = (CONFIG.GRID_HEIGHT - 1) / 2;
        return new THREE.Vector3(
            (x - offX) * CONFIG.CELL_SIZE,
            CONFIG.CELL_SIZE * 0.45,
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

    addSegment(x, z, isHead) {
        let mesh;

        if (isHead) {
            mesh = new THREE.Group();

            const headSphere = new THREE.Mesh(this.headGeometry, this.headMaterial);
            headSphere.castShadow = true;
            headSphere.receiveShadow = true;
            mesh.add(headSphere);

            // Ojo izquierdo
            const eyeL = new THREE.Group();
            const whiteL = new THREE.Mesh(this.eyeWhiteGeometry, this.eyeWhiteMaterial);
            const pupilL = new THREE.Mesh(this.pupilGeometry, this.pupilMaterial);
            pupilL.position.set(0, 0, this.eyeWhiteGeometry.parameters.radius * 0.8);
            eyeL.add(whiteL);
            eyeL.add(pupilL);
            eyeL.position.set(-CONFIG.CELL_SIZE * 0.22, CONFIG.CELL_SIZE * 0.24, CONFIG.CELL_SIZE * 0.25);
            mesh.add(eyeL);

            // Ojo derecho
            const eyeR = new THREE.Group();
            const whiteR = new THREE.Mesh(this.eyeWhiteGeometry, this.eyeWhiteMaterial);
            const pupilR = new THREE.Mesh(this.pupilGeometry, this.pupilMaterial);
            pupilR.position.set(0, 0, this.eyeWhiteGeometry.parameters.radius * 0.8);
            eyeR.add(whiteR);
            eyeR.add(pupilR);
            eyeR.position.set(CONFIG.CELL_SIZE * 0.22, CONFIG.CELL_SIZE * 0.24, CONFIG.CELL_SIZE * 0.25);
            mesh.add(eyeR);

            // Lengüita
            const tongue = new THREE.Mesh(this.tongueGeometry, this.tongueMaterial);
            tongue.position.set(0, -CONFIG.CELL_SIZE * 0.08, CONFIG.CELL_SIZE * 0.44);
            mesh.add(tongue);

        } else {
            const idx = this.segments.length;
            const mat = idx % 2 === 0 ? this.bodyMaterialA : this.bodyMaterialB;

            mesh = new THREE.Mesh(this.bodyGeometry, mat);
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            const factor = Math.max(0.68, 1.0 - (idx / 45));
            mesh.scale.set(factor, factor * 0.95, factor);
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
     * Avanza el gusano 1 casilla en el tablero
     * @param {Object} newDirection - Dirección actual
     * @param {boolean} isImmune - Si está activo el power-up de inmunidad
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

        // Comprobación de paredes
        const outOfBounds = (
            nextX < 0 || nextX >= CONFIG.GRID_WIDTH ||
            nextZ < 0 || nextZ >= CONFIG.GRID_HEIGHT
        );

        if (outOfBounds) {
            if (isImmune) {
                // TELETRANSPORTE AL OTRO EXTREMO (Estilo Nokia)
                teleported = true;
                if (nextX < 0) nextX = CONFIG.GRID_WIDTH - 1;
                else if (nextX >= CONFIG.GRID_WIDTH) nextX = 0;

                if (nextZ < 0) nextZ = CONFIG.GRID_HEIGHT - 1;
                else if (nextZ >= CONFIG.GRID_HEIGHT) nextZ = 0;
            } else {
                return { collision: true, type: 'WALL', teleported: false };
            }
        }

        // Comprobación de auto-colisión (atravesarse a sí mismo en inmunidad)
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
     * Interpolación suave a 60 FPS con soporte para teletransporte envolvente
     */
    updateInterpolation(alpha) {
        // Si tiene inmunidad, hacer un suave efecto de parpadeo/pulsación translúcida
        if (this.isImmune) {
            const pulseOpacity = 0.38 + Math.sin(Date.now() * 0.012) * 0.18;
            this.headMaterial.opacity = pulseOpacity;
            this.bodyMaterialA.opacity = pulseOpacity;
            this.bodyMaterialB.opacity = pulseOpacity;
        }

        for (let i = 0; i < this.segments.length; i++) {
            const seg = this.segments[i];

            let pX = seg.prevX;
            let pZ = seg.prevZ;

            // Manejo de continuidad visual en teletransporte:
            // Proyecta la posición previa a las afueras de la pared contraria para que entre naturalmente
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

            // Orientación rotacional de la cabeza
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
