/**
 * ====================================================================
 * SNAKE 3D CLÁSICO - MANZANAS 3D Y POWER-UPS (FOOD MANAGER)
 * ====================================================================
 * Modela:
 * 1. Manzana Roja Normal: +1 punto, hace crecer al gusano.
 * 2. Manzana Dorada Bonus: +3 puntos, crecimiento rápido.
 * 3. Manzana Azul Power-Up: +2 puntos, otorga INMUNIDAD (2s),
 *    hace al gusano transparente, atraviesa el cuerpo y teletransporta
 *    al chocar con las paredes (estilo Nokia clásico).
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
        // Rojo manzana llamativo y brillante
        this.appleMaterial = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.APPLE_RED,
            roughness: 0.25,
            metalness: 0.1
        });

        // Tallo café
        this.stemMaterial = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.APPLE_STEM,
            roughness: 0.8
        });

        // Hojita verde viva
        this.leafMaterial = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.APPLE_LEAF,
            roughness: 0.3,
            side: THREE.DoubleSide
        });

        // Manzana dorada especial
        this.bonusMaterial = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.APPLE_GOLD,
            roughness: 0.2,
            metalness: 0.8,
            emissive: CONFIG.COLORS.APPLE_GOLD,
            emissiveIntensity: 0.25
        });

        // Manzana azul eléctrica (Power-Up de Inmunidad)
        this.blueMaterial = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.APPLE_BLUE,
            roughness: 0.15,
            metalness: 0.5,
            emissive: CONFIG.COLORS.APPLE_BLUE_EMISSIVE,
            emissiveIntensity: 0.55
        });

        this.blueLeafMaterial = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            roughness: 0.2,
            emissive: 0x0284c7,
            emissiveIntensity: 0.3,
            side: THREE.DoubleSide
        });
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

    /**
     * Construye una malla 3D de manzana según su tipo ('normal', 'bonus', 'blue')
     */
    createAppleMesh(type = 'normal') {
        const appleGroup = new THREE.Group();
        const r = CONFIG.CELL_SIZE * 0.38;

        // 1. Cuerpo redondeado de la manzana
        const bodyGeo = new THREE.SphereGeometry(r, 18, 18);
        let bodyMat = this.appleMaterial;
        let leafMat = this.leafMaterial;

        if (type === 'bonus') {
            bodyMat = this.bonusMaterial;
        } else if (type === 'blue') {
            bodyMat = this.blueMaterial;
            leafMat = this.blueLeafMaterial;
        }

        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.scale.set(1.0, 0.94, 1.0);
        body.castShadow = true;
        body.receiveShadow = true;
        appleGroup.add(body);

        // 2. Tallo marrón curvado
        const stemGeo = new THREE.CylinderGeometry(0.04, 0.05, r * 0.55, 8);
        const stem = new THREE.Mesh(stemGeo, this.stemMaterial);
        stem.position.set(0, r * 0.95, 0);
        stem.rotation.z = -0.15;
        stem.castShadow = true;
        appleGroup.add(stem);

        // 3. Hojita inclinada
        const leafGeo = new THREE.SphereGeometry(r * 0.28, 8, 8);
        const leaf = new THREE.Mesh(leafGeo, leafMat);
        leaf.scale.set(1.4, 0.25, 0.65);
        leaf.position.set(r * 0.22, r * 1.05, 0);
        leaf.rotation.z = 0.35;
        leaf.rotation.y = 0.2;
        leaf.castShadow = true;
        appleGroup.add(leaf);

        // 4. Luz focal propia para la manzana azul de poder
        if (type === 'blue') {
            const blueLight = new THREE.PointLight(CONFIG.COLORS.APPLE_BLUE_EMISSIVE, 1.6, CONFIG.CELL_SIZE * 4);
            blueLight.position.set(0, r * 0.5, 0);
            appleGroup.add(blueLight);
        }

        return appleGroup;
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
            this.normalApple = this.createAppleMesh('normal');
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

            this.bonusApple = this.createAppleMesh('bonus');
            const worldPos = this.gridToWorld(newPos.x, newPos.z);
            this.bonusApple.position.copy(worldPos);
            this.group.add(this.bonusApple);
        }
    }

    /**
     * Genera aleatoriamente la Manzana Azul de Inmunidad
     */
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

            this.blueApple = this.createAppleMesh('blue');
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

    update(time) {
        if (this.normalApple) {
            this.normalApple.rotation.y = time * 2.0;
            const basePos = this.gridToWorld(this.normalGridPos.x, this.normalGridPos.z);
            this.normalApple.position.y = basePos.y + Math.sin(time * 4) * 0.12;
        }

        if (this.bonusApple) {
            this.bonusApple.rotation.y = time * 3.5;
            const basePos = this.gridToWorld(this.bonusGridPos.x, this.bonusGridPos.z);
            this.bonusApple.position.y = basePos.y + Math.cos(time * 5) * 0.16;

            const scale = 1.0 + Math.sin(time * 7) * 0.12;
            this.bonusApple.scale.set(scale, scale, scale);
        }

        if (this.blueApple) {
            this.blueApple.rotation.y = time * 4.0;
            const basePos = this.gridToWorld(this.blueGridPos.x, this.blueGridPos.z);
            this.blueApple.position.y = basePos.y + Math.sin(time * 6) * 0.18;

            // Pulsación y destello brillante
            const pulse = 1.05 + Math.sin(time * 9) * 0.18;
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
