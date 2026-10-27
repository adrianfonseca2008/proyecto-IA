/**
 * ====================================================================
 * SNAKE 3D CLÁSICO - ENTORNO 3D: CAJA DE CARTÓN EN EL BOSQUE
 * ====================================================================
 * Transforma el tablero en el interior de una CAJA DE CARTÓN KRAFT
 * colocada en medio de un claro de BOSQUE soleado, con césped fresco,
 * flores silvestres de colores, setas rojas con motitas blancas, árboles
 * frondosos y pinos que se mecen suavemente con la brisa.
 * 
 * Detalles de la caja de cartón:
 * - Suelo interior con cuadrícula ajedrezada en dos tonos kraft para
 *   máxima precisión de juego.
 * - Tiras de cinta adhesiva de embalaje cruzadas en la base.
 * - Sellos estampados (reciclaje, "THIS SIDE UP", frágil).
 * - 4 paredes de cartón corrugado con borde superior biselado.
 * - 4 solapas abiertas desplegadas hacia afuera cayendo sobre el césped.
 * - Etiqueta de envío con código de barras en una de las solapas.
 */

class World3D {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
        this.windSwayables = []; // Elementos del bosque que se mecen con el viento

        this.initLighting();
        this.initForestEnvironment();
        this.initCardboardBox();
        this.initParticleSystem();
    }

    initLighting() {
        // Luz hemisférica: cielo azul fresco arriba, reflejo verde bosque abajo
        const hemiLight = new THREE.HemisphereLight(
            CONFIG.COLORS.SKY,
            CONFIG.COLORS.GRASS_GROUND,
            0.95
        );
        this.scene.add(hemiLight);

        // Luz solar cálida direccional que arroja sombras nítidas y suaves
        this.sunLight = new THREE.DirectionalLight(0xfffaed, 1.35);
        this.sunLight.position.set(24, 38, 20);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.width = 2048;
        this.sunLight.shadow.mapSize.height = 2048;
        this.sunLight.shadow.camera.near = 1;
        this.sunLight.shadow.camera.far = 120;

        const bound = (CONFIG.GRID_WIDTH * CONFIG.CELL_SIZE) / 2 + 10;
        this.sunLight.shadow.camera.left = -bound;
        this.sunLight.shadow.camera.right = bound;
        this.sunLight.shadow.camera.top = bound;
        this.sunLight.shadow.camera.bottom = -bound;
        this.sunLight.shadow.bias = -0.0004;

        this.scene.add(this.sunLight);

        // Luz suave de relleno lateral
        const fillLight = new THREE.DirectionalLight(0xc7d2fe, 0.42);
        fillLight.position.set(-25, 20, -25);
        this.scene.add(fillLight);
    }

    /**
     * ====================================================================
     * 1. EL BOSQUE: CÉSPED, FLORES, SETAS Y ÁRBOLES
     * ====================================================================
     */
    initForestEnvironment() {
        this.forestGroup = new THREE.Group();

        // 1.1 Suelo de Césped Amplio
        const grassGeo = new THREE.BoxGeometry(170, 1.2, 170);
        const grassMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.GRASS_GROUND,
            roughness: 0.92,
            metalness: 0.05
        });
        const grassMesh = new THREE.Mesh(grassGeo, grassMat);
        grassMesh.position.y = -0.72; // Justo por debajo de la base de la caja
        grassMesh.receiveShadow = true;
        this.forestGroup.add(grassMesh);

        // 1.2 Mechoncitos de Hierba 3D cerca de la caja
        this.initGrassTufts();

        // 1.3 Flores Silvestres Coloridas
        this.initWildflowers();

        // 1.4 Setas / Hongos de Cuento
        this.initMushrooms();

        // 1.5 Árboles Frondosos y Pinos alrededor del claro
        this.initTrees();

        this.scene.add(this.forestGroup);
    }

    /**
     * Mechoncitos de hierba 3D (Grass Tufts)
     */
    initGrassTufts() {
        const tuftGroup = new THREE.Group();
        const bladeGeo = new THREE.ConeGeometry(0.08, 0.45, 4);
        const tuftMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.GRASS_TUFT,
            roughness: 0.8
        });

        const totalW = CONFIG.GRID_WIDTH * CONFIG.CELL_SIZE;
        const totalH = CONFIG.GRID_HEIGHT * CONFIG.CELL_SIZE;

        // Repartir mechones alrededor de las paredes y solapas
        for (let i = 0; i < 45; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = (totalW / 2 + 3.2) + Math.random() * 8.0;
            const x = Math.cos(angle) * dist;
            const z = Math.sin(angle) * dist;

            const tuft = new THREE.Group();
            for (let b = 0; b < 3; b++) {
                const blade = new THREE.Mesh(bladeGeo, tuftMat);
                blade.position.set(
                    (b - 1) * 0.07,
                    0.2,
                    (Math.random() - 0.5) * 0.06
                );
                blade.rotation.z = (b - 1) * 0.28 + (Math.random() - 0.5) * 0.15;
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
     * Flores Silvestres (Margaritas blancas, amapolas rojas, celestes, amarillas y violetas)
     */
    initWildflowers() {
        const flowerGroup = new THREE.Group();
        const colors = [
            CONFIG.COLORS.FLOWER_WHITE,
            CONFIG.COLORS.FLOWER_RED,
            CONFIG.COLORS.FLOWER_BLUE,
            CONFIG.COLORS.FLOWER_YELLOW,
            CONFIG.COLORS.FLOWER_PURPLE
        ];

        const stemGeo = new THREE.CylinderGeometry(0.035, 0.04, 0.55, 6);
        const stemMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });

        const centerGeo = new THREE.SphereGeometry(0.12, 8, 8);
        const centerMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.FLOWER_CENTER,
            roughness: 0.3
        });

        const petalGeo = new THREE.SphereGeometry(0.09, 6, 6);
        petalGeo.scale(1.3, 0.4, 0.8);

        const totalW = CONFIG.GRID_WIDTH * CONFIG.CELL_SIZE;
        const count = 65; // Buen número para un bosque florecido

        for (let i = 0; i < count; i++) {
            const flower = new THREE.Group();
            const angle = Math.random() * Math.PI * 2;
            const dist = (totalW / 2 + 2.5) + Math.random() * 16.0;
            const x = Math.cos(angle) * dist;
            const z = Math.sin(angle) * dist;

            // 1. Tallo
            const stem = new THREE.Mesh(stemGeo, stemMat);
            stem.position.y = 0.25;
            stem.rotation.z = (Math.random() - 0.5) * 0.25;
            flower.add(stem);

            // 2. Corola de pétalos
            const chosenColor = colors[Math.floor(Math.random() * colors.length)];
            const petalMat = new THREE.MeshStandardMaterial({
                color: chosenColor,
                roughness: 0.4
            });

            const head = new THREE.Group();
            head.position.y = 0.52;

            // Centro amarillo
            const center = new THREE.Mesh(centerGeo, centerMat);
            center.castShadow = true;
            head.add(center);

            // 5 pétalos en círculo
            const numPetals = 5;
            for (let p = 0; p < numPetals; p++) {
                const petal = new THREE.Mesh(petalGeo, petalMat);
                const pAngle = (p / numPetals) * Math.PI * 2;
                petal.position.set(
                    Math.cos(pAngle) * 0.16,
                    0,
                    Math.sin(pAngle) * 0.16
                );
                petal.rotation.y = -pAngle;
                petal.castShadow = true;
                head.add(petal);
            }

            flower.add(head);

            const scale = 0.85 + Math.random() * 0.45;
            flower.scale.set(scale, scale, scale);
            flower.position.set(x, -0.12, z);
            flower.rotation.y = Math.random() * Math.PI * 2;

            flowerGroup.add(flower);

            // Guardar para que se meza suavemente con el viento
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
     * Setas / Hongos rojos de bosque con motitas blancas
     */
    initMushrooms() {
        const shroomGroup = new THREE.Group();

        const capGeo = new THREE.SphereGeometry(0.35, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.55);
        const capMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.MUSHROOM_CAP,
            roughness: 0.3
        });

        const stemGeo = new THREE.CylinderGeometry(0.12, 0.18, 0.45, 8);
        const stemMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.MUSHROOM_STEM,
            roughness: 0.7
        });

        const dotGeo = new THREE.SphereGeometry(0.045, 6, 6);
        const dotMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });

        const totalW = CONFIG.GRID_WIDTH * CONFIG.CELL_SIZE;
        const totalH = CONFIG.GRID_HEIGHT * CONFIG.CELL_SIZE;

        // Colocar pequeños grupitos de setas en las 4 esquinas de la caja de cartón
        const clusters = [
            { x: totalW / 2 + 2.2, z: totalH / 2 + 2.2 },
            { x: -totalW / 2 - 2.2, z: totalH / 2 + 2.2 },
            { x: totalW / 2 + 2.2, z: -totalH / 2 - 2.2 },
            { x: -totalW / 2 - 2.2, z: -totalH / 2 - 2.2 },
            { x: 0, z: totalH / 2 + 4.8 },
            { x: 0, z: -totalH / 2 - 4.8 }
        ];

        clusters.forEach(c => {
            const countInCluster = 2 + Math.floor(Math.random() * 2);
            for (let k = 0; k < countInCluster; k++) {
                const shroom = new THREE.Group();

                // Tallo
                const stem = new THREE.Mesh(stemGeo, stemMat);
                stem.position.y = 0.2;
                stem.castShadow = true;
                shroom.add(stem);

                // Sombrerito rojo abovedado
                const cap = new THREE.Mesh(capGeo, capMat);
                cap.position.y = 0.38;
                cap.castShadow = true;
                shroom.add(cap);

                // Motitas blancas sobre el sombrero
                const dotPositions = [
                    { x: 0, y: 0.32, z: 0 },
                    { x: 0.18, y: 0.22, z: 0.1 },
                    { x: -0.16, y: 0.22, z: 0.12 },
                    { x: 0.08, y: 0.22, z: -0.18 },
                    { x: -0.12, y: 0.2, z: -0.14 }
                ];
                dotPositions.forEach(dp => {
                    const dot = new THREE.Mesh(dotGeo, dotMat);
                    dot.position.set(dp.x, cap.position.y + dp.y, dp.z);
                    shroom.add(dot);
                });

                const scale = 0.7 + Math.random() * 0.55;
                shroom.scale.set(scale, scale, scale);
                shroom.position.set(
                    c.x + (Math.random() - 0.5) * 1.6,
                    -0.12,
                    c.z + (Math.random() - 0.5) * 1.6
                );
                shroom.rotation.y = Math.random() * Math.PI * 2;
                shroomGroup.add(shroom);
            }
        });

        this.forestGroup.add(shroomGroup);
    }

    /**
     * Árboles Frondosos y Pinos alrededor del claro
     */
    initTrees() {
        const treesGroup = new THREE.Group();
        const totalW = CONFIG.GRID_WIDTH * CONFIG.CELL_SIZE;

        const trunkMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.TREE_TRUNK,
            roughness: 0.85
        });

        const leafMatA = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.TREE_LEAVES_A,
            roughness: 0.55
        });
        const leafMatB = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.TREE_LEAVES_B,
            roughness: 0.55
        });
        const leafMatC = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.TREE_LEAVES_C,
            roughness: 0.55
        });

        // 22 árboles colocados alrededor del claro (distancias de 19 a 45)
        const treeCount = 24;
        for (let i = 0; i < treeCount; i++) {
            const angle = (i / treeCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
            const dist = (totalW / 2 + 6.0) + Math.random() * 24.0;
            const x = Math.cos(angle) * dist;
            const z = Math.sin(angle) * dist;

            const isPine = i % 3 === 0;
            const tree = new THREE.Group();

            if (isPine) {
                // PINO ESTILIZADO CON 3 CONOS ESCALONADOS
                const trunk = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.35, 0.5, 3.2, 8),
                    trunkMat
                );
                trunk.position.y = 1.6;
                trunk.castShadow = true;
                tree.add(trunk);

                const pineGroup = new THREE.Group();
                const cone1 = new THREE.Mesh(new THREE.ConeGeometry(2.4, 2.2, 8), leafMatA);
                cone1.position.y = 3.2;
                cone1.castShadow = true;
                pineGroup.add(cone1);

                const cone2 = new THREE.Mesh(new THREE.ConeGeometry(1.9, 1.9, 8), leafMatB);
                cone2.position.y = 4.4;
                cone2.castShadow = true;
                pineGroup.add(cone2);

                const cone3 = new THREE.Mesh(new THREE.ConeGeometry(1.3, 1.7, 8), leafMatC);
                cone3.position.y = 5.5;
                cone3.castShadow = true;
                pineGroup.add(cone3);

                tree.add(pineGroup);

                this.windSwayables.push({
                    object: pineGroup,
                    baseRotZ: 0,
                    speed: 1.2,
                    phase: i * 0.5,
                    amplitude: 0.025
                });
            } else {
                // ÁRBOL FRONDOSO CON COPAS ESFÉRICAS ESCALONADAS
                const trunkHeight = 3.4 + Math.random() * 1.0;
                const trunk = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.4, 0.65, trunkHeight, 8),
                    trunkMat
                );
                trunk.position.y = trunkHeight / 2;
                trunk.castShadow = true;
                tree.add(trunk);

                const canopyGroup = new THREE.Group();
                const mainCanopy = new THREE.Mesh(
                    new THREE.SphereGeometry(2.3, 10, 10),
                    leafMatB
                );
                mainCanopy.position.y = trunkHeight + 1.6;
                mainCanopy.castShadow = true;
                canopyGroup.add(mainCanopy);

                const subCanopyA = new THREE.Mesh(
                    new THREE.SphereGeometry(1.6, 8, 8),
                    leafMatA
                );
                subCanopyA.position.set(0.9, trunkHeight + 2.5, 0.4);
                subCanopyA.castShadow = true;
                canopyGroup.add(subCanopyA);

                const subCanopyB = new THREE.Mesh(
                    new THREE.SphereGeometry(1.5, 8, 8),
                    leafMatC
                );
                subCanopyB.position.set(-0.8, trunkHeight + 2.3, -0.5);
                subCanopyB.castShadow = true;
                canopyGroup.add(subCanopyB);

                tree.add(canopyGroup);

                this.windSwayables.push({
                    object: canopyGroup,
                    baseRotZ: 0,
                    speed: 1.4,
                    phase: i * 0.7,
                    amplitude: 0.03
                });
            }

            const scale = 0.85 + Math.random() * 0.5;
            tree.scale.set(scale, scale, scale);
            tree.position.set(x, -0.12, z);
            tree.rotation.y = Math.random() * Math.PI * 2;
            treesGroup.add(tree);
        }

        // Arbustos redondeados en los claros
        for (let b = 0; b < 16; b++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = (totalW / 2 + 3.8) + Math.random() * 14.0;
            const bushGeo = new THREE.SphereGeometry(1.1 + Math.random() * 0.5, 8, 8);
            bushGeo.scale(1.3, 0.75, 1.1);
            const bushMat = new THREE.MeshStandardMaterial({
                color: CONFIG.COLORS.BUSH_GREEN,
                roughness: 0.6
            });
            const bush = new THREE.Mesh(bushGeo, bushMat);
            bush.position.set(
                Math.cos(angle) * dist,
                0.35,
                Math.sin(angle) * dist
            );
            bush.castShadow = true;
            bush.receiveShadow = true;
            treesGroup.add(bush);
        }

        this.forestGroup.add(treesGroup);
    }

    /**
     * ====================================================================
     * 2. LA CAJA DE CARTÓN: SUELO AJEDREZADO KRAFT, SOLAPAS Y SELLOS
     * ====================================================================
     */
    initCardboardBox() {
        this.boxGroup = new THREE.Group();

        const tileSize = CONFIG.CELL_SIZE;
        const totalW = CONFIG.GRID_WIDTH * tileSize;
        const totalH = CONFIG.GRID_HEIGHT * tileSize;

        // 2.1 Suelo interior de la caja (Baldosas de Cartón Kraft ajedrezadas)
        this.initCardboardFloor(totalW, totalH, tileSize);

        // 2.2 Base gruesa y cinta adhesiva de embalaje en la unión central
        this.initCardboardBaseAndTape(totalW, totalH);

        // 2.3 Paredes de Cartón Corrugado 3D
        this.initCardboardWalls(totalW, totalH);

        // 2.4 Solapas abiertas de la caja (flaps) desplegadas hacia el césped
        this.initCardboardFlaps(totalW, totalH);

        // 2.5 Sellos impresos ("THIS SIDE UP", Reciclaje) y Etiqueta de envío
        this.initCardboardDetails(totalW, totalH);

        this.scene.add(this.boxGroup);
    }

    /**
     * Suelo de Cartón Kraft ajedrezado (mantiene la cuadrícula nítida de Google Snake)
     */
    initCardboardFloor(totalW, totalH, tileSize) {
        const floorGroup = new THREE.Group();

        const matLight = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.CARDBOARD_LIGHT,
            roughness: 0.88,
            metalness: 0.04
        });

        const matDark = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.CARDBOARD_DARK,
            roughness: 0.88,
            metalness: 0.04
        });

        // Baldosa con pequeña ranura entre casillas para perfecta lectura de juego
        const tileGeo = new THREE.BoxGeometry(tileSize * 0.985, 0.18, tileSize * 0.985);

        for (let x = 0; x < CONFIG.GRID_WIDTH; x++) {
            for (let z = 0; z < CONFIG.GRID_HEIGHT; z++) {
                const isEven = (x + z) % 2 === 0;
                const mat = isEven ? matLight : matDark;

                const tile = new THREE.Mesh(tileGeo, mat);
                tile.position.set(
                    (x - (CONFIG.GRID_WIDTH - 1) / 2) * tileSize,
                    -0.09, // Apoyo exacto para el lomo del gusano en Y=0
                    (z - (CONFIG.GRID_HEIGHT - 1) / 2) * tileSize
                );
                tile.receiveShadow = true;
                floorGroup.add(tile);
            }
        }

        this.boxGroup.add(floorGroup);
    }

    /**
     * Base de soporte y cinta de embalaje adhesiva
     */
    initCardboardBaseAndTape(totalW, totalH) {
        // Base inferior sólida de la caja de cartón
        const baseGeo = new THREE.BoxGeometry(totalW + 0.3, 0.28, totalH + 0.3);
        const baseMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.CARDBOARD_BASE,
            roughness: 0.92
        });
        const baseMesh = new THREE.Mesh(baseGeo, baseMat);
        baseMesh.position.y = -0.22;
        baseMesh.receiveShadow = true;
        this.boxGroup.add(baseMesh);

        // Tiras de Cinta de Embalaje (Packing Tape) transparentes/satinadas
        const tapeMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.CARDBOARD_TAPE,
            roughness: 0.22,
            metalness: 0.1,
            transparent: true,
            opacity: 0.65
        });

        // Cinta central a lo largo (Eje Z)
        const tapeZGeo = new THREE.BoxGeometry(1.1, 0.015, totalH);
        const tapeZ = new THREE.Mesh(tapeZGeo, tapeMat);
        tapeZ.position.set(0, 0.005, 0);
        tapeZ.receiveShadow = true;
        this.boxGroup.add(tapeZ);

        // Cinta central transversal (Eje X)
        const tapeXGeo = new THREE.BoxGeometry(totalW, 0.016, 0.9);
        const tapeX = new THREE.Mesh(tapeXGeo, tapeMat);
        tapeX.position.set(0, 0.006, 0);
        tapeX.receiveShadow = true;
        this.boxGroup.add(tapeX);
    }

    /**
     * Paredes de cartón 3D delimitadoras con borde superior corrugado
     */
    initCardboardWalls(totalW, totalH) {
        const wallsGroup = new THREE.Group();
        const wallThickness = 0.8;
        const wallHeight = CONFIG.WALL_HEIGHT;

        const wallMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.CARDBOARD_WALL,
            roughness: 0.85,
            metalness: 0.05
        });

        const rimMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.CARDBOARD_RIM,
            roughness: 0.75,
            metalness: 0.1
        });

        const createWallSection = (width, length, x, z) => {
            const section = new THREE.Group();

            // Muro principal de cartón
            const bodyGeo = new THREE.BoxGeometry(width, wallHeight, length);
            const body = new THREE.Mesh(bodyGeo, wallMat);
            body.position.y = wallHeight / 2;
            body.castShadow = true;
            body.receiveShadow = true;
            section.add(body);

            // Borde superior biselado corrugado (borde cortado de cartón)
            const rimGeo = new THREE.BoxGeometry(width + 0.06, 0.15, length + 0.06);
            const rim = new THREE.Mesh(rimGeo, rimMat);
            rim.position.y = wallHeight + 0.075;
            rim.castShadow = true;
            section.add(rim);

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

        this.boxGroup.add(wallsGroup);
    }

    /**
     * 4 Solapas Abiertas de la Caja de Cartón (Cardboard Flaps)
     * Salen del borde superior de las paredes y caen abiertas hacia el césped exterior
     */
    initCardboardFlaps(totalW, totalH) {
        const flapsGroup = new THREE.Group();
        const flapThickness = 0.14;
        const flapLength = 4.2; // Longitud de la solapa abierta
        const wallHeight = CONFIG.WALL_HEIGHT;
        const halfW = totalW / 2;
        const halfH = totalH / 2;
        const wallThickness = 0.8;

        const flapMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.CARDBOARD_FLAP,
            roughness: 0.82,
            metalness: 0.05
        });

        const flapRimMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.CARDBOARD_RIM,
            roughness: 0.75
        });

        // Función para ensamblar una solapa con borde cortado
        const buildFlap = (w, len) => {
            const flap = new THREE.Group();
            const bodyGeo = new THREE.BoxGeometry(w, flapThickness, len);
            const body = new THREE.Mesh(bodyGeo, flapMat);
            body.position.z = len / 2;
            body.castShadow = true;
            body.receiveShadow = true;
            flap.add(body);

            // Borde exterior cortado de la solapa
            const edgeGeo = new THREE.BoxGeometry(w, flapThickness * 1.05, 0.12);
            const edge = new THREE.Mesh(edgeGeo, flapRimMat);
            edge.position.z = len;
            edge.castShadow = true;
            flap.add(edge);

            return flap;
        };

        const flapAngle = 0.48; // Inclinación suave hacia abajo (~27 grados)

        // Solapa Norte (Arriba)
        const flapNorth = buildFlap(totalW, flapLength);
        flapNorth.position.set(0, wallHeight + 0.05, -halfH - wallThickness);
        flapNorth.rotation.x = flapAngle;
        flapNorth.rotation.y = Math.PI; // Hacia afuera
        flapsGroup.add(flapNorth);

        // Solapa Sur (Abajo)
        const flapSouth = buildFlap(totalW, flapLength);
        flapSouth.position.set(0, wallHeight + 0.05, halfH + wallThickness);
        flapSouth.rotation.x = flapAngle;
        flapsGroup.add(flapSouth);

        // Solapa Oeste (Izquierda)
        const flapWest = buildFlap(totalH, flapLength);
        flapWest.position.set(-halfW - wallThickness, wallHeight + 0.05, 0);
        flapWest.rotation.y = Math.PI / 2;
        flapWest.rotation.x = flapAngle;
        flapsGroup.add(flapWest);

        // Solapa Este (Derecha)
        const flapEast = buildFlap(totalH, flapLength);
        flapEast.position.set(halfW + wallThickness, wallHeight + 0.05, 0);
        flapEast.rotation.y = -Math.PI / 2;
        flapEast.rotation.x = flapAngle;
        flapsGroup.add(flapEast);

        this.boxGroup.add(flapsGroup);
    }

    /**
     * Sellos impresos sobre el cartón (Reciclaje, THIS SIDE UP) y Etiqueta de Envío
     */
    initCardboardDetails(totalW, totalH) {
        // 1. Sello estampado de reciclaje ♻️ y flechas "THIS SIDE UP"
        const stampTexture = this.generateStampTexture();
        const stampGeo = new THREE.PlaneGeometry(3.6, 3.6);
        const stampMat = new THREE.MeshBasicMaterial({
            map: stampTexture,
            transparent: true,
            opacity: 0.8
        });

        // Sello en la esquina superior izquierda del fondo de la caja
        const stampMesh = new THREE.Mesh(stampGeo, stampMat);
        stampMesh.rotation.x = -Math.PI / 2;
        stampMesh.position.set(-totalW / 2 + 2.8, 0.012, -totalH / 2 + 2.8);
        this.boxGroup.add(stampMesh);

        // 2. Etiqueta blanca de envío adhesiva pegada en la solapa Sur
        const labelTexture = this.generateShippingLabelTexture();
        const labelGeo = new THREE.PlaneGeometry(3.4, 2.2);
        const labelMat = new THREE.MeshBasicMaterial({
            map: labelTexture,
            transparent: false
        });
        const labelMesh = new THREE.Mesh(labelGeo, labelMat);
        labelMesh.position.set(2.5, CONFIG.WALL_HEIGHT - 0.72, totalH / 2 + 2.45);
        labelMesh.rotation.x = -0.48; // Misma inclinación que la solapa Sur
        labelMesh.castShadow = true;
        this.boxGroup.add(labelMesh);
    }

    /**
     * Genera proceduralmente textura de sellos de tinta sobre cartón
     */
    generateStampTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, 256, 256);
        ctx.strokeStyle = '#451a03';
        ctx.fillStyle = '#451a03';
        ctx.lineWidth = 6;

        // Marco exterior punteado/desgastado
        ctx.strokeRect(18, 18, 220, 220);

        // Flechas "THIS SIDE UP" (↑ ↑)
        ctx.beginPath();
        // Flecha izquierda
        ctx.moveTo(70, 110);
        ctx.lineTo(70, 50);
        ctx.lineTo(50, 70);
        ctx.moveTo(70, 50);
        ctx.lineTo(90, 70);
        // Flecha derecha
        ctx.moveTo(186, 110);
        ctx.lineTo(186, 50);
        ctx.lineTo(166, 70);
        ctx.moveTo(186, 50);
        ctx.lineTo(206, 70);
        ctx.stroke();

        // Barra inferior de flechas
        ctx.fillRect(45, 120, 166, 8);

        // Texto estilizado
        ctx.font = 'bold 22px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('THIS SIDE UP', 128, 160);

        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('♻️ 100% RECYCLED', 128, 195);
        ctx.fillText('FRAGILE // HANDLE WITH CARE', 128, 222);

        return new THREE.CanvasTexture(canvas);
    }

    /**
     * Genera proceduralmente etiqueta de paquetería/envío con código de barras
     */
    generateShippingLabelTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 160;
        const ctx = canvas.getContext('2d');

        // Fondo papel blanco marfil
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, 256, 160);

        // Borde fino
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 4;
        ctx.strokeRect(4, 4, 248, 152);

        // Cabecera "EXPRESS DELIVERY"
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('📦 SNAKE 3D EXPRESS', 16, 26);

        ctx.fillStyle = '#64748b';
        ctx.font = '10px monospace';
        ctx.fillText('PRIORITY AIR MAIL — FOREST REGION', 16, 42);

        // Código de barras simulado
        ctx.fillStyle = '#0f172a';
        let barX = 16;
        while (barX < 240) {
            const w = (Math.random() > 0.5 ? 4 : 2);
            ctx.fillRect(barX, 55, w, 55);
            barX += w + (Math.random() > 0.4 ? 3 : 2);
        }

        // Número de seguimiento
        ctx.font = 'bold 12px monospace';
        ctx.fillStyle = '#1e293b';
        ctx.fillText('* SNK-3D-2026-FOREST *', 40, 125);

        // Sellito rojo de inspección
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
                2.5 + Math.random() * 4.0,
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

    /**
     * Actualiza partículas y la suave brisa sobre la vegetación del bosque
     */
    update(delta, time = 0) {
        // 1. Suave balanceo del viento sobre las copas de los árboles y flores
        if (this.windSwayables.length > 0) {
            for (let i = 0; i < this.windSwayables.length; i++) {
                const item = this.windSwayables[i];
                item.object.rotation.z = item.baseRotZ + Math.sin(time * item.speed + item.phase) * item.amplitude;
            }
        }

        // 2. Física de partículas
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

                // Evitar que las partículas caigan debajo del suelo interior de la caja
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
