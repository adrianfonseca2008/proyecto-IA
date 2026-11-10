/**
 * ====================================================================
 * SNAKE 3D: CYBERNETIC PROTOCOL - NÚCLEOS DE ENERGÍA 3D (FOOD MANAGER)
 * ====================================================================
 * Modela los coleccionables holográficos con Three.js:
 * 1. Núcleo de Plasma Rojo (Standard Core): +1 punto, alarga la serpiente.
 *    Esfera de cristal facetada con anillos giroscópicos cuánticos giratorios.
 * 2. Núcleo Cuántico Dorado (Solar Core): +3 puntos, bonus temporal de alto valor.
 *    Octaedro solar pulsante con corona dorada.
 * 3. Orbe de Cambio de Fase Azul (Phase Shield): +2 puntos e inmunidad de 2s.
 *    Esfera de confinamiento electromagnético con anillos de electrones y teletransporte.
 */

class FoodManager {
    constructor(scene) {
        this.scene = scene;
        this.normalApple = null;
        this.bonusApple = null;
        this.blueApple = null;

        this.normalGridPos = { x: 0, z: 0 };
        this.bonusGridPos = null;
        this.blueGridPos = null;

        this.bonusRemainingTicks = 0;
        this.blueRemainingTicks = 0;

        this.group = new THREE.Group();
        this.scene.add(this.group);

        this.initMaterials();
    }

    initMaterials() {
        // 1. Núcleo de Plasma Rojo Carmesí
        this.redCoreMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.CORE_RED_PRIMARY,
            emissive: CONFIG.COLORS.CORE_RED_EMISSIVE,
            emissiveIntensity: 1.1,
            roughness: 0.15,
            metalness: 0.3
        });

        this.redRingMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.CORE_RED_RINGS,
            emissive: CONFIG.COLORS.CORE_RED_PRIMARY,
            emissiveIntensity: 1.3,
            roughness: 0.1,
            metalness: 0.5
        });

        // 2. Núcleo Cuántico Dorado
        this.goldCoreMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.CORE_GOLD_PRIMARY,
            emissive: CONFIG.COLORS.CORE_GOLD_EMISSIVE,
            emissiveIntensity: 1.3,
            roughness: 0.1,
            metalness: 0.8
        });

        this.goldRingMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: CONFIG.COLORS.CORE_GOLD_PRIMARY,
            emissiveIntensity: 1.5,
            roughness: 0.1
        });

        // 3. Orbe de Cambio de Fase Azul
        this.blueCoreMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.CORE_BLUE_PRIMARY,
            emissive: CONFIG.COLORS.CORE_BLUE_EMISSIVE,
            emissiveIntensity: 1.4,
            roughness: 0.1,
            metalness: 0.4
        });

        this.blueRingMat = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            emissive: 0x00f5ff,
            emissiveIntensity: 1.6,
            roughness: 0.1
        });
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

    /**
     * Construye un coleccionable 3D holográfico según tipo ('normal', 'bonus', 'blue')
     */
    createCoreMesh(type = 'normal') {
        const coreGroup = new THREE.Group();
        const r = CONFIG.CELL_SIZE * 0.32;

        if (type === 'normal') {
            // Núcleo Icosaedro facetado carmesí
            const coreGeo = new THREE.IcosahedronGeometry(r, 1);
            const core = new THREE.Mesh(coreGeo, this.redCoreMat);
            core.castShadow = true;
            coreGroup.add(core);

            // Anillo giroscópico cuántico exterior
            const ring1Geo = new THREE.TorusGeometry(r * 1.35, 0.045, 8, 24);
            const ring1 = new THREE.Mesh(ring1Geo, this.redRingMat);
            coreGroup.add(ring1);

            // Anillo giroscópico cuántico interior
            const ring2Geo = new THREE.TorusGeometry(r * 1.1, 0.035, 8, 20);
            const ring2 = new THREE.Mesh(ring2Geo, this.redRingMat);
            ring2.rotation.x = Math.PI / 2;
            coreGroup.add(ring2);

            // Luz dinámica proyectada sobre las baldosas
            const redLight = new THREE.PointLight(CONFIG.COLORS.CORE_RED_PRIMARY, 1.2, CONFIG.CELL_SIZE * 3.5);
            redLight.position.set(0, 0, 0);
            coreGroup.add(redLight);

            coreGroup.userData = { ring1, ring2, core, type: 'normal' };

        } else if (type === 'bonus') {
            // Octaedro solar brillante
            const coreGeo = new THREE.OctahedronGeometry(r * 1.15, 0);
            const core = new THREE.Mesh(coreGeo, this.goldCoreMat);
            core.castShadow = true;
            coreGroup.add(core);

            // Anillo orbital dorado
            const ringGeo = new THREE.TorusGeometry(r * 1.45, 0.05, 8, 24);
            const ring = new THREE.Mesh(ringGeo, this.goldRingMat);
            coreGroup.add(ring);

            const goldLight = new THREE.PointLight(CONFIG.COLORS.CORE_GOLD_PRIMARY, 1.8, CONFIG.CELL_SIZE * 4.5);
            coreGroup.add(goldLight);

            coreGroup.userData = { ring, core, type: 'bonus' };

        } else if (type === 'blue') {
            // Esfera de energía de fase cian
            const coreGeo = new THREE.SphereGeometry(r * 0.95, 16, 16);
            const core = new THREE.Mesh(coreGeo, this.blueCoreMat);
            core.castShadow = true;
            coreGroup.add(core);

            // Dos anillos cruzados a 45 grados
            const ringGeo = new THREE.TorusGeometry(r * 1.38, 0.05, 8, 24);
            const ring1 = new THREE.Mesh(ringGeo, this.blueRingMat);
            ring1.rotation.x = Math.PI / 4;
            coreGroup.add(ring1);

            const ring2 = new THREE.Mesh(ringGeo, this.blueRingMat);
            ring2.rotation.y = Math.PI / 4;
            coreGroup.add(ring2);

            const blueLight = new THREE.PointLight(CONFIG.COLORS.CORE_BLUE_EMISSIVE, 2.0, CONFIG.CELL_SIZE * 5.0);
            coreGroup.add(blueLight);

            coreGroup.userData = { ring1, ring2, core, type: 'blue' };
        }

        return coreGroup;
    }

    getFreeRandomCell(occupiedCells) {
        const occupiedSet = new Set(
            occupiedCells.map(c => `${c.x},${c.z}`)
        );

        if (this.bonusGridPos) {
            occupiedSet.add(`${this.bonusGridPos.x},${this.bonusGridPos.z}`);
        }
        if (this.blueGridPos) {
            occupiedSet.add(`${this.blueGridPos.x},${this.blueGridPos.z}`);
        }

        const freeCells = [];
        for (let x = 0; x < CONFIG.GRID_WIDTH; x++) {
            for (let z = 0; z < CONFIG.GRID_HEIGHT; z++) {
                if (!occupiedSet.has(`${x},${z}`)) {
                    freeCells.push({ x, z });
                }
            }
        }

        if (freeCells.length === 0) return null;
        const idx = Math.floor(Math.random() * freeCells.length);
        return freeCells[idx];
    }

    spawnNormalApple(occupiedCells) {
        const newPos = this.getFreeRandomCell(occupiedCells);
        if (!newPos) return false;

        this.normalGridPos = newPos;
        const worldPos = this.gridToWorld(newPos.x, newPos.z);

        if (!this.normalApple) {
            this.normalApple = this.createCoreMesh('normal');
            this.group.add(this.normalApple);
        }

        this.normalApple.position.copy(worldPos);
        return true;
    }

    maybeSpawnBonusApple(occupiedCells) {
        if (this.bonusApple) return;

        if (Math.random() < CONFIG.BONUS_SPAWN_CHANCE) {
            const newPos = this.getFreeRandomCell([
                ...occupiedCells,
                this.normalGridPos
            ]);
            if (!newPos) return;

            this.bonusGridPos = newPos;
            this.bonusRemainingTicks = CONFIG.BONUS_LIFETIME_TICKS;

            this.bonusApple = this.createCoreMesh('bonus');
            const worldPos = this.gridToWorld(newPos.x, newPos.z);
            this.bonusApple.position.copy(worldPos);
            this.group.add(this.bonusApple);
        }
    }

    maybeSpawnBlueApple(occupiedCells) {
        if (this.blueApple) return;

        if (Math.random() < CONFIG.BLUE_SPAWN_CHANCE) {
            const newPos = this.getFreeRandomCell([
                ...occupiedCells,
                this.normalGridPos
            ]);
            if (!newPos) return;

            this.blueGridPos = newPos;
            this.blueRemainingTicks = CONFIG.BLUE_LIFETIME_TICKS;

            this.blueApple = this.createCoreMesh('blue');
            const worldPos = this.gridToWorld(newPos.x, newPos.z);
            this.blueApple.position.copy(worldPos);
            this.group.add(this.blueApple);
        }
    }

    onTick() {
        if (this.bonusApple) {
            this.bonusRemainingTicks--;
            if (this.bonusRemainingTicks <= 0) {
                this.removeBonusApple();
            }
        }

        if (this.blueApple) {
            this.blueRemainingTicks--;
            if (this.blueRemainingTicks <= 0) {
                this.removeBlueApple();
            }
        }
    }

    removeBonusApple() {
        if (this.bonusApple) {
            this.group.remove(this.bonusApple);
            this.bonusApple = null;
            this.bonusGridPos = null;
        }
    }

    removeBlueApple() {
        if (this.blueApple) {
            this.group.remove(this.blueApple);
            this.blueApple = null;
            this.blueGridPos = null;
        }
    }

    /**
     * Animación continua de levitación y rotación cuántica a 60 FPS
     */
    update(time) {
        if (this.normalApple) {
            const basePos = this.gridToWorld(this.normalGridPos.x, this.normalGridPos.z);
            this.normalApple.position.y = basePos.y + Math.sin(time * 3.5) * 0.14;

            const u = this.normalApple.userData;
            if (u.core) {
                u.core.rotation.y = time * 2.0;
                u.core.rotation.x = time * 1.2;
            }
            if (u.ring1) {
                u.ring1.rotation.y = time * 3.0;
                u.ring1.rotation.x = time * 1.5;
            }
            if (u.ring2) {
                u.ring2.rotation.z = -time * 2.5;
                u.ring2.rotation.x = time * 2.0;
            }
        }

        if (this.bonusApple) {
            const basePos = this.gridToWorld(this.bonusGridPos.x, this.bonusGridPos.z);
            this.bonusApple.position.y = basePos.y + Math.cos(time * 4.5) * 0.18;

            const u = this.bonusApple.userData;
            if (u.core) {
                u.core.rotation.y = time * 4.0;
                u.core.rotation.z = time * 2.5;
            }
            if (u.ring) {
                u.ring.rotation.x = time * 3.5;
                u.ring.rotation.y = time * 2.8;
            }

            const pulse = 1.0 + Math.sin(time * 8.0) * 0.15;
            this.bonusApple.scale.set(pulse, pulse, pulse);
        }

        if (this.blueApple) {
            const basePos = this.gridToWorld(this.blueGridPos.x, this.blueGridPos.z);
            this.blueApple.position.y = basePos.y + Math.sin(time * 5.0) * 0.18;

            const u = this.blueApple.userData;
            if (u.core) {
                u.core.rotation.y = time * 3.0;
            }
            if (u.ring1) {
                u.ring1.rotation.y = time * 4.5;
                u.ring1.rotation.z = time * 2.0;
            }
            if (u.ring2) {
                u.ring2.rotation.x = -time * 4.5;
                u.ring2.rotation.y = time * 3.0;
            }

            const pulse = 1.05 + Math.sin(time * 10.0) * 0.18;
            this.blueApple.scale.set(pulse, pulse, pulse);
        }
    }

    reset() {
        this.removeBonusApple();
        this.removeBlueApple();
        if (this.normalApple) {
            this.group.remove(this.normalApple);
            this.normalApple = null;
        }
    }
}

window.FoodManager = FoodManager;
