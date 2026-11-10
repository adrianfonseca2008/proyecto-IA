/**
 * ====================================================================
 * SNAKE 3D: CYBERNETIC PROTOCOL - ENTORNO 3D & ESCENARIO CYBER
 * ====================================================================
 * Modela un escenario de videojuego comercial 3D:
 * 1. Plataforma Cyber Arena con suelo de alta precisión, cuadrícula de neón
 *    y nodos de intersección luminiscentes.
 * 2. Barreras perimetrales de plasma láser con pilones de energía en las 4 esquinas.
 * 3. Iluminación cinematográfica dual de borde (rim lighting) cian y magenta.
 * 4. Atmósfera espacial profunda con partículas de datos flotantes (Data Motes)
 *    y monolitos digitales distantes.
 * 5. Sistema de partículas para recolección, sobrecarga/choque y salto cuántico.
 */

class World3D {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
        this.floatingMotes = [];
        this.plasmaBeams = [];

        this.initLighting();
        this.initAtmosphere();
        this.initCyberPlatform();
        this.initPlasmaBoundaries();
        this.initParticleSystem();
    }

    /**
     * Iluminación cinematográfica futurista con sombras suaves y luces de borde neón
     */
    initLighting() {
        // 1. Luz ambiental profunda cósmica
        const ambient = new THREE.AmbientLight(0x0a1128, 0.7);
        this.scene.add(ambient);

        // 2. Luz hemisférica: cielo azul oscuro, reflejo cian en el suelo
        const hemiLight = new THREE.HemisphereLight(0x0f172a, 0x00f5ff, 0.4);
        this.scene.add(hemiLight);

        // 3. Luz principal direccional cenital que arroja sombras suaves
        this.sunLight = new THREE.DirectionalLight(0xe0f2fe, 1.25);
        this.sunLight.position.set(18, 35, 18);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.width = 2048;
        this.sunLight.shadow.mapSize.height = 2048;
        this.sunLight.shadow.camera.near = 1;
        this.sunLight.shadow.camera.far = 100;

        const bound = (CONFIG.GRID_WIDTH * CONFIG.CELL_SIZE) / 2 + 5;
        this.sunLight.shadow.camera.left = -bound;
        this.sunLight.shadow.camera.right = bound;
        this.sunLight.shadow.camera.top = bound;
        this.sunLight.shadow.camera.bottom = -bound;
        this.sunLight.shadow.bias = -0.0004;

        this.scene.add(this.sunLight);

        // 4. Luz de borde izquierda: NEÓN CIAN
        this.rimLightCyan = new THREE.DirectionalLight(0x00f5ff, 0.85);
        this.rimLightCyan.position.set(-25, 15, -20);
        this.scene.add(this.rimLightCyan);

        // 5. Luz de borde derecha: NEÓN MAGENTA
        this.rimLightMagenta = new THREE.DirectionalLight(0xff007f, 0.65);
        this.rimLightMagenta.position.set(25, 15, 20);
        this.scene.add(this.rimLightMagenta);
    }

    /**
     * Atmósfera de espacio profundo con partículas de datos y monolitos distantes
     */
    initAtmosphere() {
        this.atmosphereGroup = new THREE.Group();

        // 1. Nube de partículas de datos (Data Motes) que flotan en el vacío
        const motesCount = 180;
        const moteGeo = new THREE.SphereGeometry(0.08, 6, 6);
        const moteMatCyan = new THREE.MeshBasicMaterial({
            color: CONFIG.COLORS.STAR_COLOR,
            transparent: true,
            opacity: 0.75
        });
        const moteMatMagenta = new THREE.MeshBasicMaterial({
            color: 0xff2a85,
            transparent: true,
            opacity: 0.65
        });

        for (let i = 0; i < motesCount; i++) {
            const isCyan = Math.random() > 0.3;
            const mote = new THREE.Mesh(moteGeo, isCyan ? moteMatCyan : moteMatMagenta);

            const radius = 22 + Math.random() * 45;
            const theta = Math.random() * Math.PI * 2;
            const y = -10 + Math.random() * 40;

            mote.position.set(
                Math.cos(theta) * radius,
                y,
                Math.sin(theta) * radius
            );

            this.atmosphereGroup.add(mote);

            this.floatingMotes.push({
                mesh: mote,
                baseY: y,
                speedY: 0.3 + Math.random() * 0.7,
                wobbleSpeed: 1 + Math.random() * 2,
                wobbleDist: 0.5 + Math.random() * 1.5,
                phase: Math.random() * Math.PI * 2
            });
        }

        // 2. Monolitos digitales distantes (Torres de datos en el horizonte)
        const towerGeo = new THREE.BoxGeometry(4, 60, 4);
        const towerMat = new THREE.MeshStandardMaterial({
            color: 0x060b17,
            roughness: 0.4,
            metalness: 0.9,
            emissive: 0x0284c7,
            emissiveIntensity: 0.08
        });

        const towerCount = 12;
        for (let t = 0; t < towerCount; t++) {
            const angle = (t / towerCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
            const dist = 65 + Math.random() * 25;
            const tower = new THREE.Mesh(towerGeo, towerMat);
            const heightScale = 0.5 + Math.random() * 1.0;
            tower.scale.set(1, heightScale, 1);
            tower.position.set(
                Math.cos(angle) * dist,
                (60 * heightScale) / 2 - 25,
                Math.sin(angle) * dist
            );
            this.atmosphereGroup.add(tower);
        }

        this.scene.add(this.atmosphereGroup);
    }

    /**
     * Construye la plataforma cybernetic con baldosas PBR, líneas de neón y nodos
     */
    initCyberPlatform() {
        this.platformGroup = new THREE.Group();

        const tileSize = CONFIG.CELL_SIZE;
        const totalW = CONFIG.GRID_WIDTH * tileSize;
        const totalH = CONFIG.GRID_HEIGHT * tileSize;

        // 1. Bloque de base flotante metálico oscuro biselado
        const baseThickness = 1.4;
        const baseGeo = new THREE.BoxGeometry(totalW + 1.2, baseThickness, totalH + 1.2);
        const baseMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.PLATFORM_BASE,
            roughness: 0.3,
            metalness: 0.85
        });
        const baseMesh = new THREE.Mesh(baseGeo, baseMat);
        baseMesh.position.y = -baseThickness / 2 - 0.05;
        baseMesh.receiveShadow = true;
        this.platformGroup.add(baseMesh);

        // 2. Marco exterior biselado con resplandor neón
        const rimGeo = new THREE.BoxGeometry(totalW + 1.5, 0.15, totalH + 1.5);
        const rimMat = new THREE.MeshStandardMaterial({
            color: 0x0369a1,
            emissive: 0x00f5ff,
            emissiveIntensity: 0.45,
            roughness: 0.2,
            metalness: 0.9
        });
        const rimMesh = new THREE.Mesh(rimGeo, rimMat);
        rimMesh.position.y = -0.05;
        this.platformGroup.add(rimMesh);

        // 3. Cuadrícula de Baldosas Obsidian / Grafito con reflectividad PBR
        const tileDarkMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.TILE_DARK,
            roughness: 0.22,
            metalness: 0.75
        });

        const tileLightMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.TILE_LIGHT,
            roughness: 0.22,
            metalness: 0.75
        });

        // Baldosa con separación para canal de neón
        const tileGeo = new THREE.BoxGeometry(tileSize * 0.94, 0.16, tileSize * 0.94);

        for (let x = 0; x < CONFIG.GRID_WIDTH; x++) {
            for (let z = 0; z < CONFIG.GRID_HEIGHT; z++) {
                const isEven = (x + z) % 2 === 0;
                const mat = isEven ? tileLightMat : tileDarkMat;

                const tile = new THREE.Mesh(tileGeo, mat);
                tile.position.set(
                    (x - (CONFIG.GRID_WIDTH - 1) / 2) * tileSize,
                    -0.08,
                    (z - (CONFIG.GRID_HEIGHT - 1) / 2) * tileSize
                );
                tile.receiveShadow = true;
                this.platformGroup.add(tile);
            }
        }

        // 4. Red de cuadrícula de neón cian luminiscente en los canales entre baldosas
        const gridCanvas = document.createElement('canvas');
        gridCanvas.width = 1024;
        gridCanvas.height = 1024;
        const gctx = gridCanvas.getContext('2d');

        gctx.fillStyle = '#050a17';
        gctx.fillRect(0, 0, 1024, 1024);

        // Líneas de neón con gradiente de luz
        gctx.strokeStyle = '#00f5ff';
        gctx.lineWidth = 4;
        gctx.shadowColor = '#00f5ff';
        gctx.shadowBlur = 12;

        const step = 1024 / CONFIG.GRID_WIDTH;
        for (let i = 0; i <= CONFIG.GRID_WIDTH; i++) {
            const p = i * step;
            gctx.beginPath();
            gctx.moveTo(p, 0);
            gctx.lineTo(p, 1024);
            gctx.stroke();

            gctx.beginPath();
            gctx.moveTo(0, p);
            gctx.lineTo(1024, p);
            gctx.stroke();
        }

        // Nodos luminosos en intersecciones
        gctx.fillStyle = '#ffffff';
        for (let x = 0; x <= CONFIG.GRID_WIDTH; x++) {
            for (let y = 0; y <= CONFIG.GRID_HEIGHT; y++) {
                gctx.beginPath();
                gctx.arc(x * step, y * step, 3.5, 0, Math.PI * 2);
                gctx.fill();
            }
        }

        // Emblema central de precisión cyber
        gctx.strokeStyle = '#00ff88';
        gctx.lineWidth = 6;
        gctx.shadowColor = '#00ff88';
        gctx.beginPath();
        gctx.arc(512, 512, 110, 0, Math.PI * 2);
        gctx.stroke();

        gctx.strokeStyle = '#00f5ff';
        gctx.lineWidth = 3;
        gctx.beginPath();
        gctx.arc(512, 512, 130, 0, Math.PI * 2);
        gctx.stroke();

        const gridTexture = new THREE.CanvasTexture(gridCanvas);
        const gridPlaneGeo = new THREE.PlaneGeometry(totalW, totalH);
        const gridPlaneMat = new THREE.MeshBasicMaterial({
            map: gridTexture,
            transparent: true,
            opacity: 0.35,
            blending: THREE.AdditiveBlending
        });
        const gridPlane = new THREE.Mesh(gridPlaneGeo, gridPlaneMat);
        gridPlane.rotation.x = -Math.PI / 2;
        gridPlane.position.y = 0.005;
        this.platformGroup.add(gridPlane);

        this.scene.add(this.platformGroup);
    }

    /**
     * Barreras de Plasma Perimetrales (Paredes 3D) con pilones en las 4 esquinas
     */
    initPlasmaBoundaries() {
        this.boundariesGroup = new THREE.Group();

        const tileSize = CONFIG.CELL_SIZE;
        const totalW = CONFIG.GRID_WIDTH * tileSize;
        const totalH = CONFIG.GRID_HEIGHT * tileSize;
        const halfW = totalW / 2;
        const halfH = totalH / 2;
        const wallH = CONFIG.WALL_HEIGHT;

        // Materiales de los Pilones
        const pylonMetalMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.PYLON_DARK,
            roughness: 0.25,
            metalness: 0.9
        });

        const pylonCoreMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.PYLON_CORE,
            emissive: CONFIG.COLORS.PYLON_CORE,
            emissiveIntensity: 1.2,
            roughness: 0.1
        });

        // 1. Pilones de Esquina (Corner Emitter Pylons)
        const corners = [
            { x: -halfW - 0.4, z: -halfH - 0.4 },
            { x:  halfW + 0.4, z: -halfH - 0.4 },
            { x:  halfW + 0.4, z:  halfH + 0.4 },
            { x: -halfW - 0.4, z:  halfH + 0.4 }
        ];

        corners.forEach(pos => {
            const pylon = new THREE.Group();

            // Base octogonal
            const base = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.6, 0.4, 8), pylonMetalMat);
            base.position.y = 0.2;
            base.castShadow = true;
            pylon.add(base);

            // Columna principal
            const col = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, wallH * 1.3, 8), pylonMetalMat);
            col.position.y = (wallH * 1.3) / 2;
            col.castShadow = true;
            pylon.add(col);

            // Núcleo emisor de plasma (cristal neón)
            const core = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, wallH * 0.9, 8), pylonCoreMat);
            core.position.y = wallH * 0.7;
            pylon.add(core);

            // Anillos de confinamiento
            const ringGeo = new THREE.TorusGeometry(0.42, 0.05, 8, 16);
            const ring1 = new THREE.Mesh(ringGeo, pylonCoreMat);
            ring1.rotation.x = Math.PI / 2;
            ring1.position.y = wallH * 0.4;
            pylon.add(ring1);

            const ring2 = new THREE.Mesh(ringGeo, pylonCoreMat);
            ring2.rotation.x = Math.PI / 2;
            ring2.position.y = wallH * 1.1;
            pylon.add(ring2);

            // Luz puntual en cada pilón
            const pLight = new THREE.PointLight(CONFIG.COLORS.PYLON_CORE, 0.9, 6.0);
            pLight.position.y = wallH * 0.8;
            pylon.add(pLight);

            pylon.position.set(pos.x, 0, pos.z);
            this.boundariesGroup.add(pylon);
        });

        // 2. Rieles y Rayos de Plasma (4 Muros Perimetrales)
        const trackMat = new THREE.MeshStandardMaterial({
            color: 0x0f172a,
            roughness: 0.35,
            metalness: 0.85
        });

        const plasmaMat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.BARRIER_BEAM,
            emissive: CONFIG.COLORS.BARRIER_BEAM,
            emissiveIntensity: 0.9,
            roughness: 0.1,
            metalness: 0.3
        });

        const shieldMat = new THREE.MeshBasicMaterial({
            color: CONFIG.COLORS.BARRIER_GLOW,
            transparent: true,
            opacity: 0.14,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });

        const createPlasmaWall = (length, isHorizontal, x, z) => {
            const wallGroup = new THREE.Group();

            // Riel inferior metálico
            const trackGeo = new THREE.BoxGeometry(
                isHorizontal ? length : 0.45,
                0.22,
                isHorizontal ? 0.45 : length
            );
            const track = new THREE.Mesh(trackGeo, trackMat);
            track.position.y = 0.11;
            track.castShadow = true;
            track.receiveShadow = true;
            wallGroup.add(track);

            // Haz de plasma láser superior
            const beamGeo = new THREE.CylinderGeometry(0.12, 0.12, length, 12);
            const beam = new THREE.Mesh(beamGeo, plasmaMat);
            beam.rotation.z = isHorizontal ? Math.PI / 2 : 0;
            if (!isHorizontal) beam.rotation.x = Math.PI / 2;
            beam.position.y = wallH;
            wallGroup.add(beam);
            this.plasmaBeams.push(beam);

            // Cortina de plasma translúcida
            const curtainGeo = new THREE.PlaneGeometry(
                length,
                wallH * 0.9
            );
            const curtain = new THREE.Mesh(curtainGeo, shieldMat);
            curtain.position.y = wallH * 0.52;
            if (!isHorizontal) curtain.rotation.y = Math.PI / 2;
            wallGroup.add(curtain);

            wallGroup.position.set(x, 0, z);
            return wallGroup;
        };

        // Muros Norte, Sur, Este, Oeste
        this.boundariesGroup.add(createPlasmaWall(totalW, true, 0, -halfH - 0.25));
        this.boundariesGroup.add(createPlasmaWall(totalW, true, 0, halfH + 0.25));
        this.boundariesGroup.add(createPlasmaWall(totalH, false, -halfW - 0.25, 0));
        this.boundariesGroup.add(createPlasmaWall(totalH, false, halfW + 0.25, 0));

        this.scene.add(this.boundariesGroup);
    }

    /**
     * Sistema de Partículas Sci-Fi de Alto Rendimiento
     */
    initParticleSystem() {
        this.particleGroup = new THREE.Group();
        this.scene.add(this.particleGroup);
    }

    /**
     * Estallido de energía y chispas al recolectar núcleo
     */
    burstEat(position, colorHex = CONFIG.COLORS.CORE_RED_PRIMARY) {
        const count = 24;
        const sparkGeo = new THREE.SphereGeometry(0.16, 6, 6);
        const sparkMat = new THREE.MeshStandardMaterial({
            color: colorHex,
            emissive: colorHex,
            emissiveIntensity: 1.2,
            roughness: 0.1
        });

        // 1. Chispas de plasma expulsadas en 360 grados
        for (let i = 0; i < count; i++) {
            const p = new THREE.Mesh(sparkGeo, sparkMat);
            p.position.copy(position);

            const angle = Math.random() * Math.PI * 2;
            const elevation = (Math.random() - 0.2) * Math.PI * 0.5;
            const speed = 3.5 + Math.random() * 5.5;

            const velocity = new THREE.Vector3(
                Math.cos(angle) * Math.cos(elevation) * speed,
                Math.sin(elevation) * speed + 2.5,
                Math.sin(angle) * Math.cos(elevation) * speed
            );

            this.particleGroup.add(p);
            this.particles.push({
                mesh: p,
                velocity: velocity,
                life: 1.0,
                decay: 2.2 + Math.random() * 1.0,
                gravity: -10.0,
                type: 'spark'
            });
        }

        // 2. Anillo de onda expansiva holográfica (Shockwave Ring)
        const ringGeo = new THREE.RingGeometry(0.2, 0.45, 24);
        const ringMat = new THREE.MeshBasicMaterial({
            color: colorHex,
            transparent: true,
            opacity: 0.9,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = -Math.PI / 2;
        ring.position.copy(position);
        ring.position.y = 0.08;
        this.particleGroup.add(ring);

        this.particles.push({
            mesh: ring,
            velocity: new THREE.Vector3(0, 0, 0),
            scaleSpeed: 14.0,
            life: 1.0,
            decay: 3.5,
            type: 'shockwave'
        });
    }

    /**
     * Explosión glitch de sobrecarga al colisionar
     */
    burstCrash(position) {
        const count = 42;
        const shardGeo = new THREE.BoxGeometry(0.26, 0.26, 0.26);

        const matA = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.PARTICLE_MAGENTA,
            emissive: CONFIG.COLORS.PARTICLE_MAGENTA,
            emissiveIntensity: 1.4
        });
        const matB = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.PARTICLE_CYAN,
            emissive: CONFIG.COLORS.PARTICLE_CYAN,
            emissiveIntensity: 1.4
        });

        for (let i = 0; i < count; i++) {
            const mat = Math.random() > 0.5 ? matA : matB;
            const p = new THREE.Mesh(shardGeo, mat);
            p.position.copy(position);

            const angle = Math.random() * Math.PI * 2;
            const speed = 4.0 + Math.random() * 6.5;
            const velocity = new THREE.Vector3(
                Math.cos(angle) * speed,
                3.5 + Math.random() * 6.0,
                Math.sin(angle) * speed
            );

            this.particleGroup.add(p);
            this.particles.push({
                mesh: p,
                velocity: velocity,
                life: 1.0,
                decay: 1.4 + Math.random() * 0.8,
                gravity: -14.0,
                rotSpeed: new THREE.Vector3(Math.random() * 10, Math.random() * 10, Math.random() * 10),
                type: 'spark'
            });
        }
    }

    /**
     * Portal cuántico de teletransporte (Salto Warp a través de barreras)
     */
    burstTeleport(position) {
        const count = 30;
        const sparkGeo = new THREE.OctahedronGeometry(0.18, 0);
        const mat = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.PARTICLE_SHIELD,
            emissive: CONFIG.COLORS.PARTICLE_CYAN,
            emissiveIntensity: 1.5
        });

        for (let i = 0; i < count; i++) {
            const p = new THREE.Mesh(sparkGeo, mat);
            p.position.copy(position);

            const angle = Math.random() * Math.PI * 2;
            const speed = 3.0 + Math.random() * 5.0;
            const velocity = new THREE.Vector3(
                Math.cos(angle) * speed,
                2.0 + Math.random() * 4.0,
                Math.sin(angle) * speed
            );

            this.particleGroup.add(p);
            this.particles.push({
                mesh: p,
                velocity: velocity,
                life: 1.0,
                decay: 2.0 + Math.random() * 1.0,
                gravity: -8.0,
                type: 'spark'
            });
        }

        // Doble anillo warp expansivo
        for (let r = 0; r < 2; r++) {
            const ringGeo = new THREE.RingGeometry(0.3, 0.6, 24);
            const ringMat = new THREE.MeshBasicMaterial({
                color: CONFIG.COLORS.PARTICLE_CYAN,
                transparent: true,
                opacity: 0.95,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = -Math.PI / 2;
            ring.position.copy(position);
            ring.position.y = 0.1 + r * 0.1;
            this.particleGroup.add(ring);

            this.particles.push({
                mesh: ring,
                scaleSpeed: 16.0 + r * 6.0,
                life: 1.0,
                decay: 3.2,
                type: 'shockwave'
            });
        }
    }

    /**
     * Bucle de actualización a 60 FPS
     */
    update(delta, time = 0) {
        // 1. Oscilación suave de las partículas de datos en el espacio
        if (this.floatingMotes.length > 0) {
            for (let i = 0; i < this.floatingMotes.length; i++) {
                const m = this.floatingMotes[i];
                m.mesh.position.y = m.baseY + Math.sin(time * m.wobbleSpeed + m.phase) * m.wobbleDist;
            }
        }

        // 2. Pulso de energía en los rayos de plasma
        if (this.plasmaBeams.length > 0) {
            const pulse = 0.75 + Math.sin(time * 6.0) * 0.25;
            for (let b = 0; b < this.plasmaBeams.length; b++) {
                this.plasmaBeams[b].material.emissiveIntensity = pulse;
            }
        }

        // 3. Física de partículas activas
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life -= p.decay * delta;

            if (p.life <= 0) {
                this.particleGroup.remove(p.mesh);
                p.mesh.geometry.dispose();
                p.mesh.material.dispose();
                this.particles.splice(i, 1);
            } else {
                if (p.type === 'shockwave') {
                    p.mesh.scale.addScalar(p.scaleSpeed * delta);
                    p.mesh.material.opacity = p.life;
                } else {
                    p.velocity.y += p.gravity * delta;
                    p.mesh.position.addScaledVector(p.velocity, delta);

                    if (p.rotSpeed) {
                        p.mesh.rotation.x += p.rotSpeed.x * delta;
                        p.mesh.rotation.y += p.rotSpeed.y * delta;
                    }

                    // Rebote elástico contra la superficie de la arena
                    if (p.mesh.position.y < 0.05) {
                        p.mesh.position.y = 0.05;
                        p.velocity.y *= -0.35;
                        p.velocity.x *= 0.65;
                        p.velocity.z *= 0.65;
                    }

                    p.mesh.scale.setScalar(Math.max(0.01, p.life));
                }
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
