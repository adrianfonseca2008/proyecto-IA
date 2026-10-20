/**
 * ====================================================================
 * SNAKE 3D CLÁSICO - ENTORNO 3D: TABLERO DE ARENA Y PAREDES 3D
 * ====================================================================
 * Crea un tablero plano estilo Google Snake con baldosas de arena
 * de dos tonos alternados, paredes perimetrales 3D llamativas con sombras,
 * detalles de piedritas decorativas y sistema de partículas.
 */

class World3D {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];

        this.initLighting();
        this.initSandBoard();
        this.init3DWalls();
        this.initDecorations();
        this.initParticleSystem();
    }

    initLighting() {
        // Luz hemisférica: cielo azul arriba, reflejo cálido de arena abajo
        const hemiLight = new THREE.HemisphereLight(CONFIG.COLORS.SKY, CONFIG.COLORS.SAND_DARK, 0.95);
        this.scene.add(hemiLight);

        // Luz solar direccional brillante que proyecta sombras suaves sobre la arena
        this.sunLight = new THREE.DirectionalLight(0xfffaed, 1.3);
        this.sunLight.position.set(20, 35, 18);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.width = 2048;
        this.sunLight.shadow.mapSize.height = 2048;
        this.sunLight.shadow.camera.near = 1;
        this.sunLight.shadow.camera.far = 100;

        const bound = (CONFIG.GRID_WIDTH * CONFIG.CELL_SIZE) / 2 + 6;
        this.sunLight.shadow.camera.left = -bound;
        this.sunLight.shadow.camera.right = bound;
        this.sunLight.shadow.camera.top = bound;
        this.sunLight.shadow.camera.bottom = -bound;
        this.sunLight.shadow.bias = -0.0005;

        this.scene.add(this.sunLight);

        // Luz suave de relleno lateral
        const fillLight = new THREE.DirectionalLight(0xbae6fd, 0.4);
        fillLight.position.set(-20, 15, -20);
        this.scene.add(fillLight);
    }

    /**
     * Construye el tablero plano con baldosas de arena alternadas estilo ajedrez (Google Snake)
     */
    initSandBoard() {
        const boardGroup = new THREE.Group();
        const tileSize = CONFIG.CELL_SIZE;
        const halfW = (CONFIG.GRID_WIDTH * tileSize) / 2;
        const halfH = (CONFIG.GRID_HEIGHT * tileSize) / 2;

        const matLight = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.SAND_LIGHT,
            roughness: 0.85,
            metalness: 0.05
        });

        const matDark = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.SAND_DARK,
            roughness: 0.85,
            metalness: 0.05
        });

        const tileGeo = new THREE.BoxGeometry(tileSize * 0.98, 0.2, tileSize * 0.98);

        for (let x = 0; x < CONFIG.GRID_WIDTH; x++) {
            for (let z = 0; z < CONFIG.GRID_HEIGHT; z++) {
                const isEven = (x + z) % 2 === 0;
                const mat = isEven ? matLight : matDark;

                const tile = new THREE.Mesh(tileGeo, mat);
                tile.position.set(
                    (x - (CONFIG.GRID_WIDTH - 1) / 2) * tileSize,
                    -0.1, // Nivel ligeramente bajo para que el lomo de la serpiente esté en Y=0
                    (z - (CONFIG.GRID_HEIGHT - 1) / 2) * tileSize
                );
                tile.receiveShadow = true;
                boardGroup.add(tile);
            }
        }

        // Base/Borde exterior del tablero de arena
        const borderGeo = new THREE.BoxGeometry(
            CONFIG.GRID_WIDTH * tileSize + 1.2,
            0.25,
            CONFIG.GRID_HEIGHT * tileSize + 1.2
        );
        const borderMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.SAND_BORDER,
            roughness: 0.9
        });
        const borderMesh = new THREE.Mesh(borderGeo, borderMat);
        borderMesh.position.y = -0.16;
        borderMesh.receiveShadow = true;
        boardGroup.add(borderMesh);

        this.scene.add(boardGroup);
    }

    /**
     * Construye paredes perimetrales 3D llamativas (estilo juguete / terracota cálida)
     */
    init3DWalls() {
        const wallsGroup = new THREE.Group();
        const totalW = CONFIG.GRID_WIDTH * CONFIG.CELL_SIZE;
        const totalH = CONFIG.GRID_HEIGHT * CONFIG.CELL_SIZE;
        const wallThickness = 0.8;
        const wallHeight = CONFIG.WALL_HEIGHT;

        const wallMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.WALL_BASE,
            roughness: 0.4,
            metalness: 0.1
        });

        const wallCapMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.WALL_TOP,
            roughness: 0.3,
            metalness: 0.15
        });

        // Función auxiliar para crear un tramo de pared con borde superior redondeado
        const createWallSection = (width, length, x, z) => {
            const section = new THREE.Group();

            // Cuerpo principal de la pared 3D
            const bodyGeo = new THREE.BoxGeometry(width, wallHeight, length);
            const body = new THREE.Mesh(bodyGeo, wallMat);
            body.position.y = wallHeight / 2;
            body.castShadow = true;
            body.receiveShadow = true;
            section.add(body);

            // Borde superior biselado brillante
            const capGeo = new THREE.BoxGeometry(width + 0.1, 0.2, length + 0.1);
            const cap = new THREE.Mesh(capGeo, wallCapMat);
            cap.position.y = wallHeight + 0.1;
            cap.castShadow = true;
            section.add(cap);

            section.position.set(x, 0, z);
            return section;
        };

        const halfW = totalW / 2;
        const halfH = totalH / 2;
        const halfThick = wallThickness / 2;

        // Pared Norte (Arriba)
        wallsGroup.add(createWallSection(totalW + wallThickness * 2, wallThickness, 0, -halfH - halfThick));
        // Pared Sur (Abajo)
        wallsGroup.add(createWallSection(totalW + wallThickness * 2, wallThickness, 0, halfH + halfThick));
        // Pared Oeste (Izquierda)
        wallsGroup.add(createWallSection(wallThickness, totalH, -halfW - halfThick, 0));
        // Pared Este (Derecha)
        wallsGroup.add(createWallSection(wallThickness, totalH, halfW + halfThick, 0));

        this.scene.add(wallsGroup);
    }

    /**
     * Detallitos 3D en las esquinas exteriores (piedritas y pequeños adornos)
     */
    initDecorations() {
        const decoGroup = new THREE.Group();
        const pebbleGeo = new THREE.DodecahedronGeometry(0.35, 1);
        const pebbleMat = new THREE.MeshStandardMaterial({ color: 0xa8a29e, roughness: 0.9 });

        const totalW = CONFIG.GRID_WIDTH * CONFIG.CELL_SIZE;
        const totalH = CONFIG.GRID_HEIGHT * CONFIG.CELL_SIZE;

        const corners = [
            { x: totalW / 2 + 1.2, z: totalH / 2 + 1.2 },
            { x: -totalW / 2 - 1.2, z: totalH / 2 + 1.2 },
            { x: totalW / 2 + 1.2, z: -totalH / 2 - 1.2 },
            { x: -totalW / 2 - 1.2, z: -totalH / 2 - 1.2 }
        ];

        corners.forEach(c => {
            for (let i = 0; i < 3; i++) {
                const pebble = new THREE.Mesh(pebbleGeo, pebbleMat);
                pebble.position.set(
                    c.x + (Math.random() - 0.5) * 0.8,
                    0.15,
                    c.z + (Math.random() - 0.5) * 0.8
                );
                pebble.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
                const s = 0.6 + Math.random() * 0.6;
                pebble.scale.set(s, s * 0.6, s);
                pebble.castShadow = true;
                decoGroup.add(pebble);
            }
        });

        this.scene.add(decoGroup);
    }

    initParticleSystem() {
        this.particleGroup = new THREE.Group();
        this.scene.add(this.particleGroup);
    }

    /**
     * Estallido de partículas simpáticas al comer manzana
     */
    burstEat(position, colorHex = CONFIG.COLORS.APPLE_RED) {
        const count = 18;
        const geo = new THREE.SphereGeometry(0.18, 8, 8);
        const mat = new THREE.MeshStandardMaterial({
            color: colorHex,
            roughness: 0.3
        });

        for (let i = 0; i < count; i++) {
            const p = new THREE.Mesh(geo, mat.clone());
            p.position.copy(position);

            const angle = Math.random() * Math.PI * 2;
            const speed = 2.0 + Math.random() * 4.0;
            const velocity = new THREE.Vector3(
                Math.cos(angle) * speed,
                2.5 + Math.random() * 4.0, // Salto hacia arriba
                Math.sin(angle) * speed
            );

            this.particleGroup.add(p);
            this.particles.push({
                mesh: p,
                velocity: velocity,
                life: 1.0,
                decay: 1.8 + Math.random() * 1.0,
                gravity: -12.0
            });
        }
    }

    /**
     * Explosión cómica en Game Over al chocar
     */
    burstCrash(position) {
        const count = 35;
        const geo = new THREE.BoxGeometry(0.28, 0.28, 0.28);
        const mat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.SNAKE_HEAD,
            roughness: 0.4
        });

        for (let i = 0; i < count; i++) {
            const p = new THREE.Mesh(geo, mat.clone());
            p.position.copy(position);

            const angle = Math.random() * Math.PI * 2;
            const speed = 3.0 + Math.random() * 5.0;
            const velocity = new THREE.Vector3(
                Math.cos(angle) * speed,
                3.0 + Math.random() * 5.0,
                Math.sin(angle) * speed
            );

            this.particleGroup.add(p);
            this.particles.push({
                mesh: p,
                velocity: velocity,
                life: 1.0,
                decay: 1.2 + Math.random() * 0.8,
                gravity: -14.0
            });
        }
    }

    /**
     * Efecto de chispas y ondas de teletransporte (Portal Warp estilo Nokia)
     */
    burstTeleport(position) {
        const count = 22;
        const geo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        const mat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.PARTICLE_WARP,
            emissive: CONFIG.COLORS.PARTICLE_WARP,
            emissiveIntensity: 0.8,
            roughness: 0.2
        });

        for (let i = 0; i < count; i++) {
            const p = new THREE.Mesh(geo, mat.clone());
            p.position.copy(position);

            const angle = Math.random() * Math.PI * 2;
            const speed = 2.5 + Math.random() * 4.5;
            const velocity = new THREE.Vector3(
                Math.cos(angle) * speed,
                1.5 + Math.random() * 3.5,
                Math.sin(angle) * speed
            );

            this.particleGroup.add(p);
            this.particles.push({
                mesh: p,
                velocity: velocity,
                life: 1.0,
                decay: 2.2 + Math.random() * 1.0,
                gravity: -8.0
            });
        }
    }

    update(delta) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life -= p.decay * delta;

            if (p.life <= 0) {
                this.particleGroup.remove(p.mesh);
                p.mesh.geometry.dispose();
                p.mesh.material.dispose();
                this.particles.splice(i, 1);
            } else {
                p.velocity.y += p.gravity * delta;
                p.mesh.position.addScaledVector(p.velocity, delta);

                // Evitar que las partículas caigan debajo del suelo
                if (p.mesh.position.y < 0.1) {
                    p.mesh.position.y = 0.1;
                    p.velocity.y *= -0.4;
                    p.velocity.x *= 0.7;
                    p.velocity.z *= 0.7;
                }

                p.mesh.scale.setScalar(p.life);
            }
        }
    }

    reset() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            this.particleGroup.remove(p.mesh);
            p.mesh.geometry.dispose();
            p.mesh.material.dispose();
        }
        this.particles = [];
    }
}

window.World3D = World3D;
