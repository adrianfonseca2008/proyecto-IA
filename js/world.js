/**
 * ====================================================================
 * SNAKE 3D CLÁSICO - ENTORNO 3D: CAJA DE CARTÓN EN UN BOSQUE VIBRANTE
 * ====================================================================
 * Combina la caja de cartón kraft abierta (según imagen de referencia,
 * con 4 solapas 100% exteriores que dejan la arena totalmente despejada)
 * con un BOSQUE SUPER POBLADO Y COLORIDO:
 * 
 * Naturaleza abundante:
 * - Más de 60 árboles en 3 capas de profundidad: robles frondosos,
 *   árboles con manzanitas rojas, abedules nórdicos blancos, pinos y árboles dorados.
 * - Nubes esponjosas 3D flotando suavemente en el cielo azul celeste radiante.
 * - Alfombra de más de 160 flores silvestres en 7 colores vivos hiper llamativos.
 * - Troncos caídos de madera con musgo verde brillante y setitas.
 * - Rocas de río decorativas con parches de musgo.
 * - Más de 20 arbustos redondos con bayas rojas y doradas.
 * - Setas rojas con motas blancas, setas azules mágicas y violetas.
 * - Suave brisa viva en tiempo real que mece árboles, flores y nubes.
 */

class World3D {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
        this.windSwayables = []; // Follaje y flores mecidos por la brisa
        this.clouds = [];        // Nubes esponjosas en movimiento

        this.initLighting();
        this.initForestEnvironment();
        this.initCardboardBox();
        this.initParticleSystem();
    }

    initLighting() {
        // Luz hemisférica luminosa y alegre: cielo celeste arriba, césped verde vivo abajo
        const hemiLight = new THREE.HemisphereLight(
            CONFIG.COLORS.SKY,
            CONFIG.COLORS.GRASS_GROUND,
            0.65
        );
        this.scene.add(hemiLight);

        // Luz solar cálida dorada (1.15) que da contraste, sombras suaves y colores radiantes
        this.sunLight = new THREE.DirectionalLight(0xfff8e7, 1.15);
        this.sunLight.position.set(22, 38, 20);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.width = 2048;
        this.sunLight.shadow.mapSize.height = 2048;
        this.sunLight.shadow.camera.near = 1;
        this.sunLight.shadow.camera.far = 140;

        const bound = (CONFIG.GRID_WIDTH * CONFIG.CELL_SIZE) / 2 + 14;
        this.sunLight.shadow.camera.left = -bound;
        this.sunLight.shadow.camera.right = bound;
        this.sunLight.shadow.camera.top = bound;
        this.sunLight.shadow.camera.bottom = -bound;
        this.sunLight.shadow.bias = -0.0004;

        this.scene.add(this.sunLight);

        // Luz de relleno lateral celeste para sombras luminosas y coloridas
        const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.35);
        fillLight.position.set(-24, 20, -24);
        this.scene.add(fillLight);
    }

    /**
     * ====================================================================
     * 1. EL BOSQUE REBOSANTE DE NATURALEZA Y COLOR
     * ====================================================================
     */
    initForestEnvironment() {
        this.forestGroup = new THREE.Group();

        // 1.1 Manto de Césped Exterior Verde Esmeralda Radiante
        const grassGeo = new THREE.BoxGeometry(200, 1.2, 200);
        const grassMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.GRASS_GROUND,
            roughness: 0.88,
            metalness: 0.03
        });
        const grassMesh = new THREE.Mesh(grassGeo, grassMat);
        grassMesh.position.y = -0.72;
        grassMesh.receiveShadow = true;
        this.forestGroup.add(grassMesh);

        // 1.2 Nubes esponjosas 3D en el cielo
        this.initClouds();

        // 1.3 Mechoncitos de Hierba 3D (Grass Tufts)
        this.initGrassTufts();

        // 1.4 Densa pradera de Flores Silvestres Coloridas (160+ flores)
        this.initWildflowers();

        // 1.5 Troncos caídos de madera y rocas con musgo
        this.initLogsAndRocks();

        // 1.6 Setas y Hongos Mágicos Variados (rojos, azules, violetas)
        this.initMushrooms();

        // 1.7 Bosque Denso de Árboles (60+ árboles en 3 capas de profundidad)
        this.initDenseForest();

        this.scene.add(this.forestGroup);
    }

    /**
     * Nubes esponjosas 3D que flotan suavemente en el cielo
     */
    initClouds() {
        const cloudGroup = new THREE.Group();
        const cloudMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.CLOUD_WHITE,
            roughness: 0.25,
            emissive: 0xffffff,
            emissiveIntensity: 0.15
        });

        // 6 nubes compuestas en el cielo
        const cloudData = [
            { x: -38, y: 32, z: -55, s: 1.4, speed: 0.8 },
            { x: 15,  y: 35, z: -65, s: 1.8, speed: 0.6 },
            { x: 48,  y: 30, z: -45, s: 1.2, speed: 0.9 },
            { x: -55, y: 34, z: -25, s: 1.5, speed: 0.7 },
            { x: 60,  y: 33, z: 15,  s: 1.3, speed: 0.75 },
            { x: -20, y: 36, z: -75, s: 2.1, speed: 0.5 }
        ];

        cloudData.forEach(cd => {
            const cloud = new THREE.Group();
            // Formar una nube con 4-5 esferas superpuestas
            const puff1 = new THREE.Mesh(new THREE.SphereGeometry(2.4, 8, 8), cloudMat);
            const puff2 = new THREE.Mesh(new THREE.SphereGeometry(1.9, 8, 8), cloudMat);
            puff2.position.set(-2.0, -0.3, 0);
            const puff3 = new THREE.Mesh(new THREE.SphereGeometry(2.1, 8, 8), cloudMat);
            puff3.position.set(2.2, -0.2, 0);
            const puff4 = new THREE.Mesh(new THREE.SphereGeometry(1.6, 8, 8), cloudMat);
            puff4.position.set(0.5, 1.2, 0.4);

            cloud.add(puff1);
            cloud.add(puff2);
            cloud.add(puff3);
            cloud.add(puff4);

            cloud.scale.set(cd.s, cd.s * 0.6, cd.s * 0.8);
            cloud.position.set(cd.x, cd.y, cd.z);
            cloudGroup.add(cloud);

            this.clouds.push({
                mesh: cloud,
                speed: cd.speed,
                minX: -90,
                maxX: 90
            });
        });

        this.forestGroup.add(cloudGroup);
    }

    /**
     * Mechoncitos de hierba 3D en verde lima y verde vivo
     */
    initGrassTufts() {
        const tuftGroup = new THREE.Group();
        const bladeGeo = new THREE.ConeGeometry(0.09, 0.5, 4);
        const matA = new THREE.MeshStandardMaterial({ color: CONFIG.COLORS.GRASS_TUFT, roughness: 0.75 });
        const matB = new THREE.MeshStandardMaterial({ color: CONFIG.COLORS.GRASS_LIME, roughness: 0.75 });

        // 75 mechoncitos de hierba alrededor de las solapas de cartón
        for (let i = 0; i < 75; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 21.0 + Math.random() * 16.0;
            const x = Math.cos(angle) * dist;
            const z = Math.sin(angle) * dist;

            const tuft = new THREE.Group();
            const mat = Math.random() > 0.5 ? matA : matB;
            for (let b = 0; b < 3; b++) {
                const blade = new THREE.Mesh(bladeGeo, mat);
                blade.position.set((b - 1) * 0.08, 0.22, (Math.random() - 0.5) * 0.06);
                blade.rotation.z = (b - 1) * 0.3 + (Math.random() - 0.5) * 0.15;
                blade.rotation.y = Math.random() * Math.PI;
                blade.castShadow = true;
                tuft.add(blade);
            }
            tuft.position.set(x, -0.12, z);
            tuftGroup.add(tuft);
        }

        this.forestGroup.add(tuftGroup);
    }

    /**
     * Densa pradera de Flores Silvestres Coloridas (MÁS DE 160 FLORES EN 7 COLORES LLAMATIVOS)
     */
    initWildflowers() {
        const flowerGroup = new THREE.Group();
        const flowerColors = [
            CONFIG.COLORS.FLOWER_WHITE,
            CONFIG.COLORS.FLOWER_RED,
            CONFIG.COLORS.FLOWER_BLUE,
            CONFIG.COLORS.FLOWER_YELLOW,
            CONFIG.COLORS.FLOWER_PURPLE,
            CONFIG.COLORS.FLOWER_ORANGE,
            CONFIG.COLORS.FLOWER_PINK
        ];

        const stemGeo = new THREE.CylinderGeometry(0.035, 0.04, 0.55, 6);
        const stemMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.75 });

        const centerGeo = new THREE.SphereGeometry(0.13, 8, 8);
        const centerMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.FLOWER_CENTER,
            roughness: 0.25,
            emissive: 0xffd600,
            emissiveIntensity: 0.2
        });

        const petalGeo = new THREE.SphereGeometry(0.1, 6, 6);
        petalGeo.scale(1.35, 0.38, 0.85);

        const flowerCount = 175; // Gran densidad para que se vea como un campo primaveral

        for (let i = 0; i < flowerCount; i++) {
            const flower = new THREE.Group();
            const angle = Math.random() * Math.PI * 2;
            // Distribuir en el césped exterior bordeando las solapas
            const dist = 21.0 + Math.random() * 22.0;
            const x = Math.cos(angle) * dist;
            const z = Math.sin(angle) * dist;

            // 1. Tallo
            const stem = new THREE.Mesh(stemGeo, stemMat);
            stem.position.y = 0.25;
            stem.rotation.z = (Math.random() - 0.5) * 0.25;
            flower.add(stem);

            // 2. Corola de pétalos en color vivo
            const colorHex = flowerColors[i % flowerColors.length];
            const petalMat = new THREE.MeshStandardMaterial({
                color: colorHex,
                roughness: 0.35,
                emissive: colorHex,
                emissiveIntensity: 0.12
            });

            const head = new THREE.Group();
            head.position.y = 0.52;

            // Centro amarillo sol
            const center = new THREE.Mesh(centerGeo, centerMat);
            center.castShadow = true;
            head.add(center);

            // 5 pétalos redondos
            const numPetals = 5;
            for (let p = 0; p < numPetals; p++) {
                const petal = new THREE.Mesh(petalGeo, petalMat);
                const pAngle = (p / numPetals) * Math.PI * 2;
                petal.position.set(
                    Math.cos(pAngle) * 0.18,
                    0,
                    Math.sin(pAngle) * 0.18
                );
                petal.rotation.y = -pAngle;
                petal.castShadow = true;
                head.add(petal);
            }

            flower.add(head);

            const scale = 0.85 + Math.random() * 0.5;
            flower.scale.set(scale, scale, scale);
            flower.position.set(x, -0.12, z);
            flower.rotation.y = Math.random() * Math.PI * 2;

            flowerGroup.add(flower);

            // Mecedura suave por el viento
            this.windSwayables.push({
                object: head,
                baseRotZ: head.rotation.z,
                speed: 1.8 + Math.random() * 0.8,
                phase: Math.random() * Math.PI * 2,
                amplitude: 0.08
            });
        }

        this.forestGroup.add(flowerGroup);
    }

    /**
     * Troncos caídos de madera con musgo verde y rocas decorativas
     */
    initLogsAndRocks() {
        const decoGroup = new THREE.Group();

        const logMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.LOG_WOOD,
            roughness: 0.85
        });

        const mossMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.MOSS_GREEN,
            roughness: 0.7
        });

        const rockMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.STONE_GRAY,
            roughness: 0.9
        });

        // 4 Troncos caídos con musgo alrededor del claro
        const logPositions = [
            { x: -24, z: 23, rotY: 0.6 },
            { x: 26, z: -22, rotY: -0.4 },
            { x: -25, z: -24, rotY: 1.2 },
            { x: 25, z: 24, rotY: -0.8 }
        ];

        logPositions.forEach(lp => {
            const logGroup = new THREE.Group();
            const logGeo = new THREE.CylinderGeometry(0.4, 0.45, 3.8, 8);
            const log = new THREE.Mesh(logGeo, logMat);
            log.rotation.z = Math.PI / 2;
            log.position.y = 0.35;
            log.castShadow = true;
            log.receiveShadow = true;
            logGroup.add(log);

            // Parche de musgo verde sobre el tronco
            const mossGeo = new THREE.BoxGeometry(2.4, 0.12, 0.6);
            const moss = new THREE.Mesh(mossGeo, mossMat);
            moss.position.set(0, 0.72, 0);
            logGroup.add(moss);

            logGroup.position.set(lp.x, -0.12, lp.z);
            logGroup.rotation.y = lp.rotY;
            decoGroup.add(logGroup);
        });

        // Rocas redondeadas con parches de musgo
        for (let r = 0; r < 14; r++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 22.0 + Math.random() * 18.0;
            const rockGeo = new THREE.DodecahedronGeometry(0.55 + Math.random() * 0.45, 1);
            rockGeo.scale(1.2, 0.7, 1.0);
            const rock = new THREE.Mesh(rockGeo, rockMat);
            rock.position.set(Math.cos(angle) * dist, 0.2, Math.sin(angle) * dist);
            rock.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
            rock.castShadow = true;
            rock.receiveShadow = true;
            decoGroup.add(rock);
        }

        this.forestGroup.add(decoGroup);
    }

    /**
     * Setas y Hongos Mágicos Variados (Rojos con motas blancas, Azules y Violetas)
     */
    initMushrooms() {
        const shroomGroup = new THREE.Group();

        const capGeo = new THREE.SphereGeometry(0.38, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.55);
        const stemGeo = new THREE.CylinderGeometry(0.12, 0.18, 0.48, 8);
        const stemMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.MUSHROOM_STEM,
            roughness: 0.65
        });

        const dotGeo = new THREE.SphereGeometry(0.048, 6, 6);
        const dotMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });

        const capColors = [
            CONFIG.COLORS.MUSHROOM_CAP_RED,
            CONFIG.COLORS.MUSHROOM_CAP_RED,
            CONFIG.COLORS.MUSHROOM_CAP_BLUE,
            CONFIG.COLORS.MUSHROOM_CAP_PURPLE
        ];

        // 10 grupitos de setas distribuidos por todo el claro
        const clusters = [
            { x: 21.5, z: 21.5 },
            { x: -21.5, z: 21.5 },
            { x: 21.5, z: -21.5 },
            { x: -21.5, z: -21.5 },
            { x: 0, z: 22.8 },
            { x: 0, z: -22.8 },
            { x: -23.0, z: 0 },
            { x: 23.0, z: 0 },
            { x: 18.0, z: 25.0 },
            { x: -18.0, z: -25.0 }
        ];

        clusters.forEach((c, idx) => {
            const countInCluster = 2 + Math.floor(Math.random() * 2);
            const chosenColor = capColors[idx % capColors.length];
            const capMat = new THREE.MeshStandardMaterial({
                color: chosenColor,
                roughness: 0.28,
                emissive: chosenColor,
                emissiveIntensity: 0.18
            });

            for (let k = 0; k < countInCluster; k++) {
                const shroom = new THREE.Group();

                const stem = new THREE.Mesh(stemGeo, stemMat);
                stem.position.y = 0.22;
                stem.castShadow = true;
                shroom.add(stem);

                const cap = new THREE.Mesh(capGeo, capMat);
                cap.position.y = 0.42;
                cap.castShadow = true;
                shroom.add(cap);

                // Motitas blancas
                const dotPositions = [
                    { x: 0, y: 0.35, z: 0 },
                    { x: 0.2, y: 0.24, z: 0.12 },
                    { x: -0.18, y: 0.24, z: 0.14 },
                    { x: 0.09, y: 0.24, z: -0.2 },
                    { x: -0.14, y: 0.22, z: -0.16 }
                ];
                dotPositions.forEach(dp => {
                    const dot = new THREE.Mesh(dotGeo, dotMat);
                    dot.position.set(dp.x, cap.position.y + dp.y, dp.z);
                    shroom.add(dot);
                });

                const scale = 0.75 + Math.random() * 0.55;
                shroom.scale.set(scale, scale, scale);
                shroom.position.set(
                    c.x + (Math.random() - 0.5) * 1.8,
                    -0.12,
                    c.z + (Math.random() - 0.5) * 1.8
                );
                shroom.rotation.y = Math.random() * Math.PI * 2;
                shroomGroup.add(shroom);
            }
        });

        this.forestGroup.add(shroomGroup);
    }

    /**
     * Bosque Denso de Árboles (MÁS DE 60 ÁRBOLES EN 3 CAPAS DE PROFUNDIDAD)
     */
    initDenseForest() {
        const treesGroup = new THREE.Group();

        // Materiales de corteza
        const oakTrunkMat = new THREE.MeshStandardMaterial({ color: CONFIG.COLORS.TREE_TRUNK, roughness: 0.85 });
        const birchTrunkMat = new THREE.MeshStandardMaterial({ color: CONFIG.COLORS.TREE_BIRCH, roughness: 0.65 });
        const birchSpotMat = new THREE.MeshStandardMaterial({ color: CONFIG.COLORS.TREE_BIRCH_SPOT, roughness: 0.8 });

        // Materiales de hojas súper vibrantes
        const leafMatDeep = new THREE.MeshStandardMaterial({ color: CONFIG.COLORS.TREE_LEAVES_A, roughness: 0.5 });
        const leafMatApple = new THREE.MeshStandardMaterial({ color: CONFIG.COLORS.TREE_LEAVES_B, roughness: 0.5 });
        const leafMatLime = new THREE.MeshStandardMaterial({ color: CONFIG.COLORS.TREE_LEAVES_C, roughness: 0.45, emissive: 0x16a34a, emissiveIntensity: 0.08 });
        const leafMatMint = new THREE.MeshStandardMaterial({ color: CONFIG.COLORS.TREE_LEAVES_MINT, roughness: 0.5 });
        const leafMatGold = new THREE.MeshStandardMaterial({ color: CONFIG.COLORS.TREE_LEAVES_GOLD, roughness: 0.45, emissive: 0xf59e0b, emissiveIntensity: 0.15 });

        const appleMat = new THREE.MeshStandardMaterial({ color: CONFIG.COLORS.TREE_APPLE, roughness: 0.25, emissive: 0x990022, emissiveIntensity: 0.3 });
        const appleGeo = new THREE.SphereGeometry(0.22, 6, 6);

        // 62 árboles distribuidos en 3 capas de distancia
        const treeCount = 62;
        for (let i = 0; i < treeCount; i++) {
            const angle = (i / treeCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.18;
            // Capa 1: 23-32 | Capa 2: 32-44 | Capa 3: 44-58
            const tier = i % 3;
            let dist;
            if (tier === 0) dist = 23.5 + Math.random() * 8.0;
            else if (tier === 1) dist = 32.0 + Math.random() * 11.0;
            else dist = 43.0 + Math.random() * 15.0;

            const x = Math.cos(angle) * dist;
            const z = Math.sin(angle) * dist;

            const treeType = i % 5;
            const tree = new THREE.Group();

            if (treeType === 0) {
                // 1. ÁRBOL FRUTAL CON MANZANITAS ROJAS VIVAS
                const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.65, 3.8, 8), oakTrunkMat);
                trunk.position.y = 1.9;
                trunk.castShadow = true;
                tree.add(trunk);

                const canopyGroup = new THREE.Group();
                const mainCanopy = new THREE.Mesh(new THREE.SphereGeometry(2.4, 9, 9), leafMatApple);
                mainCanopy.position.y = 4.2;
                mainCanopy.castShadow = true;
                canopyGroup.add(mainCanopy);

                const subCanopyA = new THREE.Mesh(new THREE.SphereGeometry(1.6, 7, 7), leafMatLime);
                subCanopyA.position.set(0.9, 5.0, 0.4);
                subCanopyA.castShadow = true;
                canopyGroup.add(subCanopyA);

                // 4 manzanitas rojas colgando en la copa
                const applePos = [
                    { x: 1.2, y: 3.8, z: 1.2 },
                    { x: -1.3, y: 4.1, z: 0.8 },
                    { x: 0.2, y: 3.6, z: 2.1 },
                    { x: -0.8, y: 4.4, z: -1.4 }
                ];
                applePos.forEach(ap => {
                    const app = new THREE.Mesh(appleGeo, appleMat);
                    app.position.set(ap.x, ap.y, ap.z);
                    canopyGroup.add(app);
                });

                tree.add(canopyGroup);

                this.windSwayables.push({
                    object: canopyGroup,
                    baseRotZ: 0,
                    speed: 1.4,
                    phase: i * 0.6,
                    amplitude: 0.032
                });

            } else if (treeType === 1) {
                // 2. PINO CONÍFERO SILVESTRE ESCALONADO
                const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.52, 3.4, 8), oakTrunkMat);
                trunk.position.y = 1.7;
                trunk.castShadow = true;
                tree.add(trunk);

                const pineGroup = new THREE.Group();
                const cone1 = new THREE.Mesh(new THREE.ConeGeometry(2.5, 2.3, 8), leafMatDeep);
                cone1.position.y = 3.3;
                cone1.castShadow = true;
                pineGroup.add(cone1);

                const cone2 = new THREE.Mesh(new THREE.ConeGeometry(2.0, 2.0, 8), leafMatMint);
                cone2.position.y = 4.6;
                cone2.castShadow = true;
                pineGroup.add(cone2);

                const cone3 = new THREE.Mesh(new THREE.ConeGeometry(1.4, 1.8, 8), leafMatLime);
                cone3.position.y = 5.8;
                cone3.castShadow = true;
                pineGroup.add(cone3);

                tree.add(pineGroup);

                this.windSwayables.push({
                    object: pineGroup,
                    baseRotZ: 0,
                    speed: 1.2,
                    phase: i * 0.5,
                    amplitude: 0.026
                });

            } else if (treeType === 2) {
                // 3. ABEDUL BLANCO NÓRDICO CON COPA MINT
                const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.45, 4.2, 8), birchTrunkMat);
                trunk.position.y = 2.1;
                trunk.castShadow = true;
                tree.add(trunk);

                // Motitas oscuras en la corteza blanca
                for (let s = 0; s < 5; s++) {
                    const spot = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.08, 0.04), birchSpotMat);
                    spot.position.set(0.32, 1.2 + s * 0.65, 0);
                    spot.rotation.y = s * 1.3;
                    tree.add(spot);
                }

                const canopyGroup = new THREE.Group();
                const birchCanopy = new THREE.Mesh(new THREE.SphereGeometry(2.2, 8, 8), leafMatMint);
                birchCanopy.scale.set(1.0, 1.3, 1.0);
                birchCanopy.position.y = 4.8;
                birchCanopy.castShadow = true;
                canopyGroup.add(birchCanopy);
                tree.add(canopyGroup);

                this.windSwayables.push({
                    object: canopyGroup,
                    baseRotZ: 0,
                    speed: 1.6,
                    phase: i * 0.7,
                    amplitude: 0.035
                });

            } else if (treeType === 3) {
                // 4. ÁRBOL FRONDOSO VERDE LIMA LUMINOSO
                const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.58, 3.5, 8), oakTrunkMat);
                trunk.position.y = 1.75;
                trunk.castShadow = true;
                tree.add(trunk);

                const canopyGroup = new THREE.Group();
                const c1 = new THREE.Mesh(new THREE.SphereGeometry(2.3, 9, 9), leafMatLime);
                c1.position.y = 4.3;
                c1.castShadow = true;
                canopyGroup.add(c1);

                const c2 = new THREE.Mesh(new THREE.SphereGeometry(1.5, 7, 7), leafMatApple);
                c2.position.set(-0.8, 4.9, 0.5);
                c2.castShadow = true;
                canopyGroup.add(c2);

                tree.add(canopyGroup);

                this.windSwayables.push({
                    object: canopyGroup,
                    baseRotZ: 0,
                    speed: 1.3,
                    phase: i * 0.4,
                    amplitude: 0.03
                });

            } else {
                // 5. ÁRBOL DORADO DE SOL
                const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.58, 3.6, 8), oakTrunkMat);
                trunk.position.y = 1.8;
                trunk.castShadow = true;
                tree.add(trunk);

                const canopyGroup = new THREE.Group();
                const cGold = new THREE.Mesh(new THREE.SphereGeometry(2.2, 8, 8), leafMatGold);
                cGold.position.y = 4.4;
                cGold.castShadow = true;
                canopyGroup.add(cGold);
                tree.add(canopyGroup);

                this.windSwayables.push({
                    object: canopyGroup,
                    baseRotZ: 0,
                    speed: 1.5,
                    phase: i * 0.8,
                    amplitude: 0.032
                });
            }

            const scale = 0.85 + Math.random() * 0.45;
            tree.scale.set(scale, scale, scale);
            tree.position.set(x, -0.12, z);
            tree.rotation.y = Math.random() * Math.PI * 2;
            treesGroup.add(tree);
        }

        // Arbustos de bayas esponjosos en verde y lima
        const bushGeo = new THREE.SphereGeometry(1.15, 8, 8);
        bushGeo.scale(1.3, 0.75, 1.1);
        const bushMat = new THREE.MeshStandardMaterial({ color: CONFIG.COLORS.BUSH_GREEN, roughness: 0.6 });
        const berryMat = new THREE.MeshStandardMaterial({ color: CONFIG.COLORS.BERRY_RED, roughness: 0.2, emissive: 0x990011, emissiveIntensity: 0.3 });
        const berryGeo = new THREE.SphereGeometry(0.12, 5, 5);

        for (let b = 0; b < 24; b++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 22.0 + Math.random() * 18.0;
            const bushGroup = new THREE.Group();
            const bush = new THREE.Mesh(bushGeo, bushMat);
            bush.castShadow = true;
            bush.receiveShadow = true;
            bushGroup.add(bush);

            // 3 bayas brillantes en el arbusto
            for (let by = 0; by < 3; by++) {
                const berry = new THREE.Mesh(berryGeo, berryMat);
                berry.position.set((by - 1) * 0.35, 0.45, 0.55 + Math.random() * 0.2);
                bushGroup.add(berry);
            }

            bushGroup.position.set(Math.cos(angle) * dist, 0.35, Math.sin(angle) * dist);
            treesGroup.add(bushGroup);
        }

        this.forestGroup.add(treesGroup);
    }

    /**
     * ====================================================================
     * 2. LA CAJA DE CARTÓN KRAFT ABIERTA (ESTILO IMAGEN 2)
     * ====================================================================
     * Cuadrícula limpia y contrastada, 4 solapas 100% exteriores que
     * no obstruyen el juego en lo absoluto.
     */
    initCardboardBox() {
        this.boxGroup = new THREE.Group();

        const tileSize = CONFIG.CELL_SIZE;
        const totalW = CONFIG.GRID_WIDTH * tileSize;  // 27.0
        const totalH = CONFIG.GRID_HEIGHT * tileSize; // 27.0

        // 2.1 Fondo interior de la caja (Cuadrícula kraft cálida y nítida)
        this.initCardboardFloor(totalW, totalH, tileSize);

        // 2.2 Base de soporte inferior
        this.initCardboardBase(totalW, totalH);

        // 2.3 Paredes de la caja de cartón (4 lados)
        this.initCardboardWalls(totalW, totalH);

        // 2.4 Las 4 Solapas abiertas desplegadas hacia afuera (según la imagen)
        this.initCardboardFlaps(totalW, totalH);

        // 2.5 Etiqueta de envío en una de las solapas exteriores
        this.initShippingLabel(totalW, totalH);

        this.scene.add(this.boxGroup);
    }

    /**
     * Suelo interior de la caja de cartón (Baldosas kraft cálidas estilo imagen 2)
     */
    initCardboardFloor(totalW, totalH, tileSize) {
        const floorGroup = new THREE.Group();

        const matLight = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.CARDBOARD_LIGHT,
            roughness: 0.85,
            metalness: 0.02
        });

        const matDark = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.CARDBOARD_DARK,
            roughness: 0.85,
            metalness: 0.02
        });

        const tileGeo = new THREE.BoxGeometry(tileSize * 0.985, 0.18, tileSize * 0.985);

        for (let x = 0; x < CONFIG.GRID_WIDTH; x++) {
            for (let z = 0; z < CONFIG.GRID_HEIGHT; z++) {
                const isEven = (x + z) % 2 === 0;
                const mat = isEven ? matLight : matDark;

                const tile = new THREE.Mesh(tileGeo, mat);
                tile.position.set(
                    (x - (CONFIG.GRID_WIDTH - 1) / 2) * tileSize,
                    -0.09,
                    (z - (CONFIG.GRID_HEIGHT - 1) / 2) * tileSize
                );
                tile.receiveShadow = true;
                floorGroup.add(tile);
            }
        }

        // Costura central de solapas en el fondo de la caja
        const seamMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.CARDBOARD_SEAM,
            roughness: 0.9
        });
        const seamGeo = new THREE.BoxGeometry(0.08, 0.015, totalH * 0.98);
        const centerSeam = new THREE.Mesh(seamGeo, seamMat);
        centerSeam.position.set(0, 0.005, 0);
        centerSeam.receiveShadow = true;
        floorGroup.add(centerSeam);

        // Cinta adhesiva de embalaje translúcida a lo largo de la costura
        const tapeMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.CARDBOARD_TAPE,
            roughness: 0.2,
            metalness: 0.05,
            transparent: true,
            opacity: 0.55
        });
        const tapeGeo = new THREE.BoxGeometry(0.85, 0.012, totalH * 0.96);
        const tapeMesh = new THREE.Mesh(tapeGeo, tapeMat);
        tapeMesh.position.set(0, 0.006, 0);
        tapeMesh.receiveShadow = true;
        floorGroup.add(tapeMesh);

        this.boxGroup.add(floorGroup);
    }

    /**
     * Base de soporte inferior de la caja
     */
    initCardboardBase(totalW, totalH) {
        const baseGeo = new THREE.BoxGeometry(totalW + 0.2, 0.26, totalH + 0.2);
        const baseMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.CARDBOARD_BASE,
            roughness: 0.92
        });
        const baseMesh = new THREE.Mesh(baseGeo, baseMat);
        baseMesh.position.y = -0.22;
        baseMesh.receiveShadow = true;
        this.boxGroup.add(baseMesh);
    }

    /**
     * Paredes de cartón 3D (forman el perímetro de la caja)
     */
    initCardboardWalls(totalW, totalH) {
        const wallsGroup = new THREE.Group();
        const wallThickness = 0.6;
        const wallHeight = CONFIG.WALL_HEIGHT;

        const wallMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.CARDBOARD_WALL,
            roughness: 0.84,
            metalness: 0.02
        });

        const rimMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.CARDBOARD_RIM,
            roughness: 0.78,
            metalness: 0.05
        });

        const halfW = totalW / 2;
        const halfH = totalH / 2;
        const halfThick = wallThickness / 2;

        const createWall = (w, len, x, z) => {
            const section = new THREE.Group();

            const bodyGeo = new THREE.BoxGeometry(w, wallHeight, len);
            const body = new THREE.Mesh(bodyGeo, wallMat);
            body.position.y = wallHeight / 2;
            body.castShadow = true;
            body.receiveShadow = true;
            section.add(body);

            const rimGeo = new THREE.BoxGeometry(w + 0.04, 0.14, len + 0.04);
            const rim = new THREE.Mesh(rimGeo, rimMat);
            rim.position.y = wallHeight + 0.07;
            rim.castShadow = true;
            section.add(rim);

            section.position.set(x, 0, z);
            return section;
        };

        // Pared Norte
        wallsGroup.add(createWall(totalW + wallThickness * 2, wallThickness, 0, -halfH - halfThick));
        // Pared Sur
        wallsGroup.add(createWall(totalW + wallThickness * 2, wallThickness, 0, halfH + halfThick));
        // Pared Oeste
        wallsGroup.add(createWall(wallThickness, totalH, -halfW - halfThick, 0));
        // Pared Este
        wallsGroup.add(createWall(wallThickness, totalH, halfW + halfThick, 0));

        this.boxGroup.add(wallsGroup);
    }

    /**
     * Las 4 Solapas Abiertas desplegadas 100% HACIA EL EXTERIOR (en cruz)
     */
    initCardboardFlaps(totalW, totalH) {
        const flapsGroup = new THREE.Group();
        const flapThickness = 0.12;
        const flapLength = 6.2;
        const wallThickness = 0.6;
        const halfW = totalW / 2;
        const halfH = totalH / 2;
        const wallHeight = CONFIG.WALL_HEIGHT;

        const flapMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.CARDBOARD_FLAP,
            roughness: 0.84,
            metalness: 0.02
        });

        const flapRimMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.CARDBOARD_RIM,
            roughness: 0.8
        });

        const creaseMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.CARDBOARD_SEAM,
            roughness: 0.9
        });

        // 1. SOLAPA NORTE (-Z hacia afuera)
        const flapNorth = new THREE.Group();
        const bodyNorth = new THREE.Mesh(new THREE.BoxGeometry(totalW, flapThickness, flapLength), flapMat);
        bodyNorth.position.z = -flapLength / 2;
        bodyNorth.castShadow = true;
        bodyNorth.receiveShadow = true;
        flapNorth.add(bodyNorth);

        const rimNorth = new THREE.Mesh(new THREE.BoxGeometry(totalW, flapThickness * 1.05, 0.12), flapRimMat);
        rimNorth.position.z = -flapLength;
        rimNorth.castShadow = true;
        flapNorth.add(rimNorth);

        const creaseNorth = new THREE.Mesh(new THREE.BoxGeometry(totalW, 0.02, 0.08), creaseMat);
        creaseNorth.position.set(0, flapThickness / 2 + 0.01, -0.15);
        flapNorth.add(creaseNorth);

        flapNorth.position.set(0, wallHeight + 0.04, -halfH - wallThickness);
        flapNorth.rotation.x = 0.12;
        flapsGroup.add(flapNorth);

        // 2. SOLAPA SUR (+Z hacia afuera)
        const flapSouth = new THREE.Group();
        const bodySouth = new THREE.Mesh(new THREE.BoxGeometry(totalW, flapThickness, flapLength), flapMat);
        bodySouth.position.z = flapLength / 2;
        bodySouth.castShadow = true;
        bodySouth.receiveShadow = true;
        flapSouth.add(bodySouth);

        const rimSouth = new THREE.Mesh(new THREE.BoxGeometry(totalW, flapThickness * 1.05, 0.12), flapRimMat);
        rimSouth.position.z = flapLength;
        rimSouth.castShadow = true;
        flapSouth.add(rimSouth);

        const creaseSouth = new THREE.Mesh(new THREE.BoxGeometry(totalW, 0.02, 0.08), creaseMat);
        creaseSouth.position.set(0, flapThickness / 2 + 0.01, 0.15);
        flapSouth.add(creaseSouth);

        flapSouth.position.set(0, wallHeight + 0.04, halfH + wallThickness);
        flapSouth.rotation.x = -0.12;
        flapsGroup.add(flapSouth);

        // 3. SOLAPA OESTE (-X hacia afuera)
        const flapWest = new THREE.Group();
        const bodyWest = new THREE.Mesh(new THREE.BoxGeometry(flapLength, flapThickness, totalH), flapMat);
        bodyWest.position.x = -flapLength / 2;
        bodyWest.castShadow = true;
        bodyWest.receiveShadow = true;
        flapWest.add(bodyWest);

        const rimWest = new THREE.Mesh(new THREE.BoxGeometry(0.12, flapThickness * 1.05, totalH), flapRimMat);
        rimWest.position.x = -flapLength;
        rimWest.castShadow = true;
        flapWest.add(rimWest);

        const creaseWest = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, totalH), creaseMat);
        creaseWest.position.set(-0.15, flapThickness / 2 + 0.01, 0);
        flapWest.add(creaseWest);

        flapWest.position.set(-halfW - wallThickness, wallHeight + 0.04, 0);
        flapWest.rotation.z = 0.12;
        flapsGroup.add(flapWest);

        // 4. SOLAPA ESTE (+X hacia afuera)
        const flapEast = new THREE.Group();
        const bodyEast = new THREE.Mesh(new THREE.BoxGeometry(flapLength, flapThickness, totalH), flapMat);
        bodyEast.position.x = flapLength / 2;
        bodyEast.castShadow = true;
        bodyEast.receiveShadow = true;
        flapEast.add(bodyEast);

        const rimEast = new THREE.Mesh(new THREE.BoxGeometry(0.12, flapThickness * 1.05, totalH), flapRimMat);
        rimEast.position.x = flapLength;
        rimEast.castShadow = true;
        flapEast.add(rimEast);

        const creaseEast = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, totalH), creaseMat);
        creaseEast.position.set(0.15, flapThickness / 2 + 0.01, 0);
        flapEast.add(creaseEast);

        flapEast.position.set(halfW + wallThickness, wallHeight + 0.04, 0);
        flapEast.rotation.z = -0.12;
        flapsGroup.add(flapEast);

        this.boxGroup.add(flapsGroup);
    }

    /**
     * Etiqueta de paquetería y sello estampados sobre las solapas exteriores
     */
    initShippingLabel(totalW, totalH) {
        const labelTexture = this.generateShippingLabelTexture();
        const labelGeo = new THREE.PlaneGeometry(3.6, 2.2);
        const labelMat = new THREE.MeshBasicMaterial({ map: labelTexture, transparent: false });
        const labelMesh = new THREE.Mesh(labelGeo, labelMat);
        labelMesh.rotation.x = -Math.PI / 2 + 0.12;
        labelMesh.position.set(3.5, CONFIG.WALL_HEIGHT + 0.04, totalH / 2 + 3.5);
        labelMesh.receiveShadow = true;
        this.boxGroup.add(labelMesh);

        const stampTexture = this.generateStampTexture();
        const stampGeo = new THREE.PlaneGeometry(3.4, 3.4);
        const stampMat = new THREE.MeshBasicMaterial({ map: stampTexture, transparent: true, opacity: 0.75 });
        const stampMesh = new THREE.Mesh(stampGeo, stampMat);
        stampMesh.rotation.x = -Math.PI / 2 - 0.12;
        stampMesh.position.set(-3.5, CONFIG.WALL_HEIGHT + 0.04, -totalH / 2 - 3.5);
        stampMesh.receiveShadow = true;
        this.boxGroup.add(stampMesh);
    }

    generateStampTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, 256, 256);
        ctx.strokeStyle = '#3d200a';
        ctx.fillStyle = '#3d200a';
        ctx.lineWidth = 6;
        ctx.strokeRect(18, 18, 220, 220);

        ctx.beginPath();
        ctx.moveTo(70, 110);
        ctx.lineTo(70, 50);
        ctx.lineTo(50, 70);
        ctx.moveTo(70, 50);
        ctx.lineTo(90, 70);

        ctx.moveTo(186, 110);
        ctx.lineTo(186, 50);
        ctx.lineTo(166, 70);
        ctx.moveTo(186, 50);
        ctx.lineTo(206, 70);
        ctx.stroke();

        ctx.fillRect(45, 120, 166, 8);
        ctx.font = 'bold 22px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('THIS SIDE UP', 128, 160);

        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('♻️ 100% RECYCLED', 128, 195);
        ctx.fillText('FRAGILE // HANDLE WITH CARE', 128, 222);

        return new THREE.CanvasTexture(canvas);
    }

    generateShippingLabelTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 160;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, 256, 160);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 4;
        ctx.strokeRect(4, 4, 248, 152);

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('📦 SNAKE 3D EXPRESS', 16, 26);

        ctx.fillStyle = '#64748b';
        ctx.font = '10px monospace';
        ctx.fillText('PRIORITY AIR MAIL — ENCHANTED FOREST', 16, 42);

        ctx.fillStyle = '#0f172a';
        let barX = 16;
        while (barX < 240) {
            const w = (Math.random() > 0.5 ? 4 : 2);
            ctx.fillRect(barX, 55, w, 55);
            barX += w + (Math.random() > 0.4 ? 3 : 2);
        }

        ctx.font = 'bold 12px monospace';
        ctx.fillStyle = '#1e293b';
        ctx.fillText('* SNK-3D-2026-FOREST *', 40, 125);

        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2;
        ctx.strokeRect(170, 132, 70, 20);
        ctx.fillStyle = '#dc2626';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText('VERIFIED', 180, 146);

        return new THREE.CanvasTexture(canvas);
    }

    /**
     * ====================================================================
     * 3. SISTEMA DE PARTÍCULAS
     * ====================================================================
     */
    initParticleSystem() {
        this.particleGroup = new THREE.Group();
        this.scene.add(this.particleGroup);
    }

    burstEat(position, colorHex = CONFIG.COLORS.APPLE_RED) {
        const count = 22;
        const geo = new THREE.SphereGeometry(0.2, 8, 8);
        const mat = new THREE.MeshStandardMaterial({
            color: colorHex,
            roughness: 0.25,
            emissive: colorHex,
            emissiveIntensity: 0.35
        });

        for (let i = 0; i < count; i++) {
            const p = new THREE.Mesh(geo, mat.clone());
            p.position.copy(position);

            const angle = Math.random() * Math.PI * 2;
            const speed = 2.2 + Math.random() * 4.5;
            const velocity = new THREE.Vector3(
                Math.cos(angle) * speed,
                2.8 + Math.random() * 4.5,
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

    burstCrash(position) {
        const count = 38;
        const geo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
        const mat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.SNAKE_HEAD,
            roughness: 0.35,
            emissive: 0x059669,
            emissiveIntensity: 0.3
        });

        for (let i = 0; i < count; i++) {
            const p = new THREE.Mesh(geo, mat.clone());
            p.position.copy(position);

            const angle = Math.random() * Math.PI * 2;
            const speed = 3.2 + Math.random() * 5.5;
            const velocity = new THREE.Vector3(
                Math.cos(angle) * speed,
                3.2 + Math.random() * 5.5,
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

    burstTeleport(position) {
        const count = 26;
        const geo = new THREE.BoxGeometry(0.22, 0.22, 0.22);
        const mat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.PARTICLE_WARP,
            emissive: CONFIG.COLORS.PARTICLE_WARP,
            emissiveIntensity: 0.9,
            roughness: 0.2
        });

        for (let i = 0; i < count; i++) {
            const p = new THREE.Mesh(geo, mat.clone());
            p.position.copy(position);

            const angle = Math.random() * Math.PI * 2;
            const speed = 2.8 + Math.random() * 5.0;
            const velocity = new THREE.Vector3(
                Math.cos(angle) * speed,
                1.8 + Math.random() * 4.0,
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

    /**
     * Actualiza el balanceo de brisa en el bosque, el paso de las nubes y las partículas
     */
    update(delta, time = 0) {
        // 1. Brisa viva sobre las copas de árboles y flores
        if (this.windSwayables.length > 0) {
            for (let i = 0; i < this.windSwayables.length; i++) {
                const item = this.windSwayables[i];
                item.object.rotation.z = item.baseRotZ + Math.sin(time * item.speed + item.phase) * item.amplitude;
            }
        }

        // 2. Movimiento suave de las nubes esponjosas
        if (this.clouds.length > 0) {
            for (let c = 0; c < this.clouds.length; c++) {
                const cloud = this.clouds[c];
                cloud.mesh.position.x += cloud.speed * delta * 2.0;
                if (cloud.mesh.position.x > cloud.maxX) {
                    cloud.mesh.position.x = cloud.minX;
                }
            }
        }

        // 3. Partículas
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
