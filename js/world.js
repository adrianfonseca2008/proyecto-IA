/**
 * ====================================================================
 * SNAKE 3D CLÁSICO - ENTORNO 3D: CAJA DE CARTÓN ABIERTA EN EL BOSQUE
 * ====================================================================
 * Modela con precisión la CAJA DE CARTÓN KRAFT ABIERTA (según imagen de
 * referencia), donde las 4 solapas (flaps) se abren 100% hacia afuera
 * en cruz (horizontalmente / apoyadas hacia el césped exterior), dejando
 * el interior de la arena y el gusanito COMPLETAMENTE DESPEJADOS Y VISIBLES.
 * 
 * En el fondo exterior: bosque encantador con pradera de césped verde,
 * decenas de flores silvestres de colores, setas rojas con motitas blancas
 * y árboles frondosos y pinos que se mecen con una suave brisa.
 */

class World3D {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
        this.windSwayables = []; // Flores y copas de árboles con brisa

        this.initLighting();
        this.initForestEnvironment();
        this.initCardboardBox();
        this.initParticleSystem();
    }

    initLighting() {
        // Luz hemisférica balanceada: cielo azul arriba, reflejo cálido/verde abajo
        // Intensidad moderada (0.55) para evitar quemar o blanquear los colores del cartón
        const hemiLight = new THREE.HemisphereLight(
            CONFIG.COLORS.SKY,
            CONFIG.COLORS.GRASS_GROUND,
            0.55
        );
        this.scene.add(hemiLight);

        // Luz solar cálida dorada pero natural (0.95)
        this.sunLight = new THREE.DirectionalLight(0xfff6e5, 0.95);
        this.sunLight.position.set(20, 36, 18);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.width = 2048;
        this.sunLight.shadow.mapSize.height = 2048;
        this.sunLight.shadow.camera.near = 1;
        this.sunLight.shadow.camera.far = 120;

        const bound = (CONFIG.GRID_WIDTH * CONFIG.CELL_SIZE) / 2 + 12;
        this.sunLight.shadow.camera.left = -bound;
        this.sunLight.shadow.camera.right = bound;
        this.sunLight.shadow.camera.top = bound;
        this.sunLight.shadow.camera.bottom = -bound;
        this.sunLight.shadow.bias = -0.0004;

        this.scene.add(this.sunLight);

        // Luz suave de relleno lateral
        const fillLight = new THREE.DirectionalLight(0xb2d6e8, 0.28);
        fillLight.position.set(-22, 18, -22);
        this.scene.add(fillLight);
    }

    /**
     * ====================================================================
     * 1. EL BOSQUE: CÉSPED, FLORES SILVESTRES, SETAS Y ÁRBOLES
     * ====================================================================
     */
    initForestEnvironment() {
        this.forestGroup = new THREE.Group();

        // 1.1 Manto de Césped Exterior Amplio
        const grassGeo = new THREE.BoxGeometry(170, 1.2, 170);
        const grassMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.GRASS_GROUND,
            roughness: 0.92,
            metalness: 0.04
        });
        const grassMesh = new THREE.Mesh(grassGeo, grassMat);
        grassMesh.position.y = -0.72;
        grassMesh.receiveShadow = true;
        this.forestGroup.add(grassMesh);

        // 1.2 Mechoncitos de Hierba 3D
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

        // Repartir mechones por fuera de las solapas de la caja (radio > 21)
        for (let i = 0; i < 48; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 21.0 + Math.random() * 12.0;
            const x = Math.cos(angle) * dist;
            const z = Math.sin(angle) * dist;

            const tuft = new THREE.Group();
            for (let b = 0; b < 3; b++) {
                const blade = new THREE.Mesh(bladeGeo, tuftMat);
                blade.position.set(
                    (b - 1) * 0.08,
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

        const count = 70;

        for (let i = 0; i < count; i++) {
            const flower = new THREE.Group();
            const angle = Math.random() * Math.PI * 2;
            // Distribuir fuera del alcance de las solapas abiertas (distancia > 21)
            const dist = 21.2 + Math.random() * 16.0;
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

            // Guardar para mecerse suavemente con la brisa
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

        // Ubicaciones de grupitos de setas en los 4 rincones diagonales exteriores
        const clusters = [
            { x: 21.0, z: 21.0 },
            { x: -21.0, z: 21.0 },
            { x: 21.0, z: -21.0 },
            { x: -21.0, z: -21.0 },
            { x: 0, z: 22.5 },
            { x: 0, z: -22.5 }
        ];

        clusters.forEach(c => {
            const countInCluster = 2 + Math.floor(Math.random() * 2);
            for (let k = 0; k < countInCluster; k++) {
                const shroom = new THREE.Group();

                const stem = new THREE.Mesh(stemGeo, stemMat);
                stem.position.y = 0.2;
                stem.castShadow = true;
                shroom.add(stem);

                const cap = new THREE.Mesh(capGeo, capMat);
                cap.position.y = 0.38;
                cap.castShadow = true;
                shroom.add(cap);

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
     * Árboles Frondosos y Pinos alrededor del claro
     */
    initTrees() {
        const treesGroup = new THREE.Group();

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

        const treeCount = 24;
        for (let i = 0; i < treeCount; i++) {
            const angle = (i / treeCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
            const dist = 24.0 + Math.random() * 26.0;
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

        // Arbustos redondeados
        for (let b = 0; b < 16; b++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 22.0 + Math.random() * 16.0;
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
     * 2. LA CAJA DE CARTÓN KRAFT (ESTILO IMAGEN DE REFERENCIA)
     * ====================================================================
     * La caja está completamente abierta. Las 4 solapas se extienden
     * ÚNICAMENTE HACIA AFUERA (Norte hacia -Z, Sur hacia +Z, Oeste hacia -X,
     * Este hacia +X). El interior del tablero y el gusanito quedan 100%
     * visibles, libres y despejados.
     */
    initCardboardBox() {
        this.boxGroup = new THREE.Group();

        const tileSize = CONFIG.CELL_SIZE;
        const totalW = CONFIG.GRID_WIDTH * tileSize;  // 27.0
        const totalH = CONFIG.GRID_HEIGHT * tileSize; // 27.0

        // 2.1 Fondo interior de la caja (Cuadrícula kraft cálida con costura de solapas)
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
            roughness: 0.88,
            metalness: 0.02
        });

        const matDark = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.CARDBOARD_DARK,
            roughness: 0.88,
            metalness: 0.02
        });

        // Baldosas con sutil micro-ranura entre casillas
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

        // Costura central de solapas en el fondo de la caja (como se aprecia en la imagen 2)
        const seamMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.CARDBOARD_SEAM,
            roughness: 0.9
        });
        const seamGeo = new THREE.BoxGeometry(0.08, 0.015, totalH * 0.98);
        const centerSeam = new THREE.Mesh(seamGeo, seamMat);
        centerSeam.position.set(0, 0.005, 0);
        centerSeam.receiveShadow = true;
        floorGroup.add(centerSeam);

        // Tira de cinta adhesiva de embalaje translúcida a lo largo de la costura
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
        const wallThickness = 0.6; // Grosor estilizado de pared de cartón
        const wallHeight = CONFIG.WALL_HEIGHT; // 1.2

        const wallMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.CARDBOARD_WALL,
            roughness: 0.86,
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

            // Muro de cartón
            const bodyGeo = new THREE.BoxGeometry(w, wallHeight, len);
            const body = new THREE.Mesh(bodyGeo, wallMat);
            body.position.y = wallHeight / 2;
            body.castShadow = true;
            body.receiveShadow = true;
            section.add(body);

            // Borde superior biselado corrugado (corte del cartón)
            const rimGeo = new THREE.BoxGeometry(w + 0.04, 0.14, len + 0.04);
            const rim = new THREE.Mesh(rimGeo, rimMat);
            rim.position.y = wallHeight + 0.07;
            rim.castShadow = true;
            section.add(rim);

            section.position.set(x, 0, z);
            return section;
        };

        // Pared Norte (Arriba)
        wallsGroup.add(createWall(totalW + wallThickness * 2, wallThickness, 0, -halfH - halfThick));
        // Pared Sur (Abajo)
        wallsGroup.add(createWall(totalW + wallThickness * 2, wallThickness, 0, halfH + halfThick));
        // Pared Oeste (Izquierda)
        wallsGroup.add(createWall(wallThickness, totalH, -halfW - halfThick, 0));
        // Pared Este (Derecha)
        wallsGroup.add(createWall(wallThickness, totalH, halfW + halfThick, 0));

        this.boxGroup.add(wallsGroup);
    }

    /**
     * ====================================================================
     * SOLAPAS ABIERTAS (FLAPS) — EXACTAMENTE COMO LA IMAGEN DE REFERENCIA 2
     * ====================================================================
     * Las 4 solapas se abren 100% HACIA EL EXTERIOR (en cruz alrededor de la caja):
     * - Solapa Norte se extiende hacia -Z (arriba/afuera)
     * - Solapa Sur se extiende hacia +Z (abajo/afuera)
     * - Solapa Oeste se extiende hacia -X (izquierda/afuera)
     * - Solapa Este se extiende hacia +X (derecha/afuera)
     * 
     * Cada solapa yace prácticamente horizontal / con un pequeñísimo declive
     * hacia el césped exterior. NINGUNA solapa entra ni un milímetro dentro
     * de la arena ni obstruye al gusanito ni a las manzanas.
     */
    initCardboardFlaps(totalW, totalH) {
        const flapsGroup = new THREE.Group();
        const flapThickness = 0.12;
        const flapLength = 6.2; // Longitud proporcional a la imagen 2
        const wallThickness = 0.6;
        const halfW = totalW / 2;  // 13.5
        const halfH = totalH / 2;  // 13.5
        const wallHeight = CONFIG.WALL_HEIGHT; // 1.2

        const flapMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.CARDBOARD_FLAP,
            roughness: 0.85,
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

        // ---------------------------------------------------------------
        // 1. SOLAPA NORTE (Top Flap en imagen 2)
        // Se extiende hacia -Z (completamente fuera de la caja hacia arriba)
        // ---------------------------------------------------------------
        const flapNorth = new THREE.Group();
        const bodyNorthGeo = new THREE.BoxGeometry(totalW, flapThickness, flapLength);
        const bodyNorth = new THREE.Mesh(bodyNorthGeo, flapMat);
        bodyNorth.position.z = -flapLength / 2;
        bodyNorth.castShadow = true;
        bodyNorth.receiveShadow = true;
        flapNorth.add(bodyNorth);

        // Borde exterior cortado de la solapa
        const rimNorthGeo = new THREE.BoxGeometry(totalW, flapThickness * 1.05, 0.12);
        const rimNorth = new THREE.Mesh(rimNorthGeo, flapRimMat);
        rimNorth.position.z = -flapLength;
        rimNorth.castShadow = true;
        flapNorth.add(rimNorth);

        // Línea de hendidura/doblez junto a la bisagra
        const creaseNorth = new THREE.Mesh(new THREE.BoxGeometry(totalW, 0.02, 0.08), creaseMat);
        creaseNorth.position.set(0, flapThickness / 2 + 0.01, -0.15);
        flapNorth.add(creaseNorth);

        // Posicionar en la bisagra exterior del muro Norte y aplicar leve caída hacia afuera (-X rot)
        flapNorth.position.set(0, wallHeight + 0.04, -halfH - wallThickness);
        flapNorth.rotation.x = 0.12; // Cae suavemente hacia el césped en -Z
        flapsGroup.add(flapNorth);

        // ---------------------------------------------------------------
        // 2. SOLAPA SUR (Bottom Flap en imagen 2)
        // Se extiende hacia +Z (completamente fuera de la caja hacia abajo)
        // ---------------------------------------------------------------
        const flapSouth = new THREE.Group();
        const bodySouthGeo = new THREE.BoxGeometry(totalW, flapThickness, flapLength);
        const bodySouth = new THREE.Mesh(bodySouthGeo, flapMat);
        bodySouth.position.z = flapLength / 2;
        bodySouth.castShadow = true;
        bodySouth.receiveShadow = true;
        flapSouth.add(bodySouth);

        const rimSouth = new THREE.Mesh(rimNorthGeo, flapRimMat);
        rimSouth.position.z = flapLength;
        rimSouth.castShadow = true;
        flapSouth.add(rimSouth);

        const creaseSouth = new THREE.Mesh(new THREE.BoxGeometry(totalW, 0.02, 0.08), creaseMat);
        creaseSouth.position.set(0, flapThickness / 2 + 0.01, 0.15);
        flapSouth.add(creaseSouth);

        flapSouth.position.set(0, wallHeight + 0.04, halfH + wallThickness);
        flapSouth.rotation.x = -0.12; // Cae suavemente hacia el césped en +Z
        flapsGroup.add(flapSouth);

        // ---------------------------------------------------------------
        // 3. SOLAPA OESTE (Left Flap en imagen 2)
        // Se extiende hacia -X (completamente fuera de la caja hacia la izquierda)
        // ---------------------------------------------------------------
        const flapWest = new THREE.Group();
        const bodyWestGeo = new THREE.BoxGeometry(flapLength, flapThickness, totalH);
        const bodyWest = new THREE.Mesh(bodyWestGeo, flapMat);
        bodyWest.position.x = -flapLength / 2;
        bodyWest.castShadow = true;
        bodyWest.receiveShadow = true;
        flapWest.add(bodyWest);

        const rimWestGeo = new THREE.BoxGeometry(0.12, flapThickness * 1.05, totalH);
        const rimWest = new THREE.Mesh(rimWestGeo, flapRimMat);
        rimWest.position.x = -flapLength;
        rimWest.castShadow = true;
        flapWest.add(rimWest);

        const creaseWest = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, totalH), creaseMat);
        creaseWest.position.set(-0.15, flapThickness / 2 + 0.01, 0);
        flapWest.add(creaseWest);

        flapWest.position.set(-halfW - wallThickness, wallHeight + 0.04, 0);
        flapWest.rotation.z = 0.12; // Cae suavemente hacia la izquierda en -X
        flapsGroup.add(flapWest);

        // ---------------------------------------------------------------
        // 4. SOLAPA ESTE (Right Flap en imagen 2)
        // Se extiende hacia +X (completamente fuera de la caja hacia la derecha)
        // ---------------------------------------------------------------
        const flapEast = new THREE.Group();
        const bodyEastGeo = new THREE.BoxGeometry(flapLength, flapThickness, totalH);
        const bodyEast = new THREE.Mesh(bodyEastGeo, flapMat);
        bodyEast.position.x = flapLength / 2;
        bodyEast.castShadow = true;
        bodyEast.receiveShadow = true;
        flapEast.add(bodyEast);

        const rimEast = new THREE.Mesh(rimWestGeo, flapRimMat);
        rimEast.position.x = flapLength;
        rimEast.castShadow = true;
        flapEast.add(rimEast);

        const creaseEast = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, totalH), creaseMat);
        creaseEast.position.set(0.15, flapThickness / 2 + 0.01, 0);
        flapEast.add(creaseEast);

        flapEast.position.set(halfW + wallThickness, wallHeight + 0.04, 0);
        flapEast.rotation.z = -0.12; // Cae suavemente hacia la derecha en +X
        flapsGroup.add(flapEast);

        this.boxGroup.add(flapsGroup);
    }

    /**
     * Etiqueta de paquetería colocada sobre la solapa EXTERIOR Sur
     * (fuera del área de juego)
     */
    initShippingLabel(totalW, totalH) {
        const labelTexture = this.generateShippingLabelTexture();
        const labelGeo = new THREE.PlaneGeometry(3.6, 2.2);
        const labelMat = new THREE.MeshBasicMaterial({
            map: labelTexture,
            transparent: false
        });
        const labelMesh = new THREE.Mesh(labelGeo, labelMat);
        // Colocada de forma horizontal sobre la solapa Sur exterior
        labelMesh.rotation.x = -Math.PI / 2 + 0.12;
        labelMesh.position.set(3.5, CONFIG.WALL_HEIGHT + 0.04, totalH / 2 + 3.5);
        labelMesh.receiveShadow = true;
        this.boxGroup.add(labelMesh);

        // Sello estampado "THIS SIDE UP" y reciclaje sobre la solapa Norte exterior
        const stampTexture = this.generateStampTexture();
        const stampGeo = new THREE.PlaneGeometry(3.4, 3.4);
        const stampMat = new THREE.MeshBasicMaterial({
            map: stampTexture,
            transparent: true,
            opacity: 0.75
        });
        const stampMesh = new THREE.Mesh(stampGeo, stampMat);
        stampMesh.rotation.x = -Math.PI / 2 - 0.12;
        stampMesh.position.set(-3.5, CONFIG.WALL_HEIGHT + 0.04, -totalH / 2 - 3.5);
        stampMesh.receiveShadow = true;
        this.boxGroup.add(stampMesh);
    }

    /**
     * Genera proceduralmente sello de tinta sobre cartón
     */
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

        // Flechas "THIS SIDE UP" (↑ ↑)
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

    /**
     * Genera proceduralmente etiqueta de paquetería con código de barras
     */
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

        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('📦 SNAKE 3D EXPRESS', 16, 26);

        ctx.fillStyle = '#64748b';
        ctx.font = '10px monospace';
        ctx.fillText('PRIORITY AIR MAIL — FOREST REGION', 16, 42);

        // Código de barras
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
     * Efecto de chispas de teletransporte (Portal Warp estilo Nokia)
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
     * Actualiza física de partículas y el suave balanceo de brisa en el bosque
     */
    update(delta, time = 0) {
        // Brisa viva sobre las copas de árboles y flores
        if (this.windSwayables.length > 0) {
            for (let i = 0; i < this.windSwayables.length; i++) {
                const item = this.windSwayables[i];
                item.object.rotation.z = item.baseRotZ + Math.sin(time * item.speed + item.phase) * item.amplitude;
            }
        }

        // Partículas
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
