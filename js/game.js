/**
 * ====================================================================
 * SNAKE 3D: CYBERNETIC PROTOCOL - MOTOR PRINCIPAL DEL JUEGO
 * ====================================================================
 * Orquesta la máquina de estados ('MENU', 'PLAYING', 'PAUSED', 'GAME_OVER'),
 * el bucle de renderizado WebGL 3D a 60 FPS, el demo autónomo de fondo para
 * el menú principal, el sistema de niveles progresivos, la aceleración,
 * las colisiones, la recolección de núcleos de energía y las pantallas UI.
 */

class GameEngine {
    constructor() {
        this.state = 'MENU';

        this.score = 0;
        this.displayScore = 0; // Para animación de números que suben suavemente
        this.highScore = parseInt(localStorage.getItem('snake3d_cyber_highscore') || '0', 10);
        this.applesEaten = 0;
        this.level = 1;
        this.gameStartTime = 0;
        this.survivalSeconds = 0;

        // Temporizador de Escudo de Fase / Inmunidad
        this.immunityTimer = 0;

        // Ticks y temporizadores
        this.lastTickTime = 0;
        this.lastMenuDemoTick = 0;
        this.tickInterval = CONFIG.INITIAL_TICK_MS;
        this.clock = new THREE.Clock();

        this.initThree();
        this.initComponents();
        this.bindUI();
        this.loadSettings();

        // Inicializar escenario con demo autónomo en el menú
        this.setupMenuDemo();
        this.updateHUD();

        requestAnimationFrame((t) => this.renderLoop(t));
    }

    initThree() {
        const container = document.getElementById('canvas-container');

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(CONFIG.COLORS.SPACE_BG);
        this.scene.fog = new THREE.Fog(CONFIG.COLORS.SPACE_FOG, 45, 130);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        container.appendChild(this.renderer.domElement);

        window.addEventListener('resize', () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });
    }

    initComponents() {
        this.sound = new SoundController();
        this.input = new InputController(this.sound);
        this.world = new World3D(this.scene);
        this.cameraManager = new CameraManager(this.scene, this.renderer);
        this.snake = new Snake3D(this.scene);
        this.food = new FoodManager(this.scene);

        this.input.onPauseToggle = () => {
            if (this.state === 'PLAYING' || this.state === 'PAUSED') {
                this.togglePause();
            }
        };

        this.input.onCameraToggle = () => this.cycleCamera();
        this.input.onMuteToggle = () => this.toggleSound();

        this.input.onRestart = () => {
            if (this.state === 'GAME_OVER') {
                this.startGame();
                return true;
            } else if (this.state === 'PLAYING') {
                this.startGame();
                return true;
            }
            return false;
        };
    }

    /**
     * Carga y aplica configuraciones guardadas de dificultad, volumen y cámara
     */
    loadSettings() {
        const diff = localStorage.getItem('snake3d_difficulty') || 'NORMAL';
        if (CONFIG.DIFFICULTIES[diff]) {
            CONFIG.CURRENT_DIFFICULTY = diff;
            const diffSelect = document.getElementById('setting-difficulty');
            if (diffSelect) diffSelect.value = diff;
        }

        const vol = parseFloat(localStorage.getItem('snake3d_volume') || '0.7');
        const volSlider = document.getElementById('setting-volume');
        if (volSlider) volSlider.value = Math.round(vol * 100);

        const soundIcons = document.querySelectorAll('.sound-toggle-icon');
        soundIcons.forEach(icon => {
            icon.textContent = this.sound.muted ? '🔇' : '🔊';
        });

        document.getElementById('start-high-score').textContent = this.highScore;
    }

    bindUI() {
        // Botones del Menú Principal
        const btnPlay = document.getElementById('btn-play');
        if (btnPlay) {
            btnPlay.addEventListener('click', () => {
                this.sound.playClick();
                this.startGame();
            });
        }

        const btnInstructions = document.getElementById('btn-instructions');
        if (btnInstructions) {
            btnInstructions.addEventListener('click', () => {
                this.sound.playClick();
                this.openModal('instructions-screen');
            });
        }

        const btnSettings = document.getElementById('btn-settings');
        if (btnSettings) {
            btnSettings.addEventListener('click', () => {
                this.sound.playClick();
                this.openModal('settings-screen');
            });
        }

        // Cierres de modales
        document.querySelectorAll('.btn-close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                this.sound.playClick();
                this.closeAllModals();
            });
        });

        // Configuración - Dificultad
        const diffSelect = document.getElementById('setting-difficulty');
        if (diffSelect) {
            diffSelect.addEventListener('change', (e) => {
                const val = e.target.value;
                CONFIG.CURRENT_DIFFICULTY = val;
                localStorage.setItem('snake3d_difficulty', val);
                this.sound.playClick();
            });
        }

        // Configuración - Volumen
        const volSlider = document.getElementById('setting-volume');
        if (volSlider) {
            volSlider.addEventListener('input', (e) => {
                const val = parseInt(e.target.value, 10) / 100;
                this.sound.setVolume(val);
            });
        }

        // Configuración - Sonido
        const soundToggle = document.getElementById('setting-sound-toggle');
        if (soundToggle) {
            soundToggle.addEventListener('click', () => {
                this.toggleSound();
            });
        }

        // Acciones en Pantalla de Game Over
        document.getElementById('btn-restart').addEventListener('click', () => {
            this.sound.playClick();
            this.startGame();
        });

        document.getElementById('btn-menu-from-gameover').addEventListener('click', () => {
            this.sound.playClick();
            this.returnToMenu();
        });

        // Acciones en Pausa
        document.getElementById('btn-resume').addEventListener('click', () => {
            this.sound.playClick();
            this.togglePause();
        });

        document.getElementById('btn-restart-pause').addEventListener('click', () => {
            this.sound.playClick();
            this.startGame();
        });

        document.getElementById('btn-menu-from-pause').addEventListener('click', () => {
            this.sound.playClick();
            this.returnToMenu();
        });

        // Controles de cabecera HUD
        document.getElementById('btn-hud-pause').addEventListener('click', () => this.togglePause());
        document.getElementById('btn-hud-cam').addEventListener('click', () => this.cycleCamera());
        document.getElementById('btn-hud-sound').addEventListener('click', () => this.toggleSound());
        document.getElementById('btn-hud-menu').addEventListener('click', () => {
            this.sound.playClick();
            this.returnToMenu();
        });

        // D-Pad Táctil en Pantalla
        const dpadButtons = {
            'btn-dir-up': CONFIG.DIRECTIONS.UP,
            'btn-dir-down': CONFIG.DIRECTIONS.DOWN,
            'btn-dir-left': CONFIG.DIRECTIONS.LEFT,
            'btn-dir-right': CONFIG.DIRECTIONS.RIGHT
        };

        Object.keys(dpadButtons).forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (this.state === 'PLAYING') {
                        this.input.enqueueDirection(dpadButtons[id]);
                    }
                });
            }
        });

        // Efectos de sonido hover en todos los botones interactivos
        document.querySelectorAll('button, .hud-btn, .dpad-btn, select').forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.sound.playHover();
            });
        });
    }

    openModal(modalId) {
        document.getElementById(modalId).classList.remove('hidden');
    }

    closeAllModals() {
        document.querySelectorAll('.overlay-modal:not(#start-screen)').forEach(m => {
            m.classList.add('hidden');
        });
    }

    /**
     * Inicializa el demo autónomo que se ejecuta en el fondo del Menú Principal
     */
    setupMenuDemo() {
        this.state = 'MENU';
        this.cameraManager.setMenuMode(true);
        this.snake.reset();
        this.food.reset();
        this.food.spawnNormalApple(this.snake.getOccupiedCells());
        this.lastMenuDemoTick = performance.now();
    }

    /**
     * Inicia una partida real
     */
    startGame() {
        const diffConfig = CONFIG.DIFFICULTIES[CONFIG.CURRENT_DIFFICULTY] || CONFIG.DIFFICULTIES.NORMAL;
        this.tickInterval = diffConfig.initialTick;

        this.sound.playStart();
        this.state = 'PLAYING';
        this.score = 0;
        this.displayScore = 0;
        this.applesEaten = 0;
        this.level = 1;
        this.gameStartTime = performance.now();
        this.immunityTimer = 0;

        this.cameraManager.setMenuMode(false);
        this.snake.reset();
        this.food.reset();
        this.world.reset();
        this.input.reset();

        this.food.spawnNormalApple(this.snake.getOccupiedCells());
        this.lastTickTime = performance.now();

        // Ocultar todos los modales
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-over-screen').classList.add('hidden');
        document.getElementById('pause-screen').classList.add('hidden');
        this.closeAllModals();

        // Mostrar HUD
        document.querySelector('.hud-container').classList.remove('hidden-hud');

        // Ocultar banner de inmunidad
        const immunityBadge = document.getElementById('hud-immunity');
        if (immunityBadge) immunityBadge.classList.add('hidden');

        this.updateHUD();
    }

    /**
     * Regresa al Menú Principal y activa el demo 3D autónomo de fondo
     */
    returnToMenu() {
        this.state = 'MENU';
        document.getElementById('game-over-screen').classList.add('hidden');
        document.getElementById('pause-screen').classList.add('hidden');
        this.closeAllModals();

        document.getElementById('start-screen').classList.remove('hidden');
        document.querySelector('.hud-container').classList.add('hidden-hud');

        document.getElementById('start-high-score').textContent = this.highScore;
        this.setupMenuDemo();
    }

    togglePause() {
        if (this.state === 'PLAYING') {
            this.state = 'PAUSED';
            this.sound.playClick();
            document.getElementById('pause-screen').classList.remove('hidden');
        } else if (this.state === 'PAUSED') {
            this.state = 'PLAYING';
            this.sound.playClick();
            this.lastTickTime = performance.now();
            document.getElementById('pause-screen').classList.add('hidden');
        }
    }

    cycleCamera() {
        this.sound.playClick();
        const mode = this.cameraManager.cycleMode();
        const modeNames = {
            'ISOMETRIC_3D': '3D TÁCTICA',
            'TOP_DOWN': 'RADAR 2D',
            'CHASE_3D': 'SEGUIMIENTO'
        };
        const el = document.getElementById('hud-cam-mode');
        if (el) el.textContent = modeNames[mode] || mode;
    }

    toggleSound() {
        const isMuted = this.sound.toggleMute();
        this.sound.playClick();
        const soundIcons = document.querySelectorAll('.sound-toggle-icon');
        soundIcons.forEach(icon => {
            icon.textContent = isMuted ? '🔇' : '🔊';
        });
    }

    /**
     * Activa el estado de Cambio de Fase (Inmunidad) por 2.0 segundos
     */
    activateImmunity(seconds = CONFIG.IMMUNITY_DURATION_SEC) {
        this.immunityTimer = seconds;
        this.snake.setImmunity(true);

        const badge = document.getElementById('hud-immunity');
        if (badge) {
            badge.classList.remove('hidden');
            document.getElementById('immunity-timer').textContent = seconds.toFixed(1);
            const bar = document.getElementById('immunity-progress-bar');
            if (bar) bar.style.width = '100%';
        }
    }

    /**
     * Tick del juego para la partida activa
     */
    gameTick() {
        if (this.state !== 'PLAYING') return;

        const nextDir = this.input.pollNextDirection();
        const isImmune = this.immunityTimer > 0;
        const result = this.snake.step(nextDir, isImmune);

        // 1. Manejo de colisiones fatales
        if (result.collision) {
            this.gameOver(result.type);
            return;
        }

        // 2. Si se teletransportó en una barrera de plasma (Power-Up de Fase)
        if (result.teleported) {
            this.sound.playTeleport();
            this.world.burstTeleport(this.snake.getHeadWorldPosition());
        }

        const headPos = this.snake.getHeadPosition();

        // 3. Colisión con Núcleo Normal (Rojo)
        if (
            headPos.x === this.food.normalGridPos.x &&
            headPos.z === this.food.normalGridPos.z
        ) {
            this.score += CONFIG.POINTS_PER_APPLE;
            this.applesEaten++;
            this.level = Math.floor(this.applesEaten / 5) + 1;
            this.snake.grow(1);
            this.sound.playEat();

            const worldPos = this.food.normalApple.position.clone();
            this.world.burstEat(worldPos, CONFIG.COLORS.CORE_RED_PRIMARY);

            // Aceleración gradual controlada
            const diffConfig = CONFIG.DIFFICULTIES[CONFIG.CURRENT_DIFFICULTY] || CONFIG.DIFFICULTIES.NORMAL;
            this.tickInterval = Math.max(
                diffConfig.minTick,
                diffConfig.initialTick - (this.applesEaten * diffConfig.step)
            );

            this.food.spawnNormalApple(this.snake.getOccupiedCells());
            this.food.maybeSpawnBonusApple(this.snake.getOccupiedCells());
            this.food.maybeSpawnBlueApple(this.snake.getOccupiedCells());
        }

        // 4. Colisión con Núcleo Cuántico (Dorado Bonus +3)
        if (
            this.food.bonusGridPos &&
            headPos.x === this.food.bonusGridPos.x &&
            headPos.z === this.food.bonusGridPos.z
        ) {
            this.score += CONFIG.POINTS_BONUS_APPLE;
            this.snake.grow(2);
            this.sound.playBonus();

            const worldPos = this.food.bonusApple.position.clone();
            this.world.burstEat(worldPos, CONFIG.COLORS.CORE_GOLD_PRIMARY);
            this.food.removeBonusApple();
        }

        // 5. Colisión con Orbe de Fase Azul (Inmunidad + Nokia Warp)
        if (
            this.food.blueGridPos &&
            headPos.x === this.food.blueGridPos.x &&
            headPos.z === this.food.blueGridPos.z
        ) {
            this.score += CONFIG.POINTS_BLUE_APPLE;
            this.applesEaten++;
            this.snake.grow(1);
            this.sound.playPowerup();

            const worldPos = this.food.blueApple.position.clone();
            this.world.burstEat(worldPos, CONFIG.COLORS.CORE_BLUE_EMISSIVE);

            // Activar inmunidad de fase por 2 segundos
            this.activateImmunity(CONFIG.IMMUNITY_DURATION_SEC);
            this.food.removeBlueApple();
        }

        this.food.onTick();
        this.updateHUD();
    }

    /**
     * Tick autónomo del demo en el Menú Principal
     */
    menuDemoTick() {
        if (this.state !== 'MENU') return;

        const foodPos = this.food.normalGridPos;
        const nextDir = this.snake.getSafeDemoDirection(foodPos);
        const result = this.snake.step(nextDir, false);

        if (result.collision) {
            this.setupMenuDemo();
            return;
        }

        const headPos = this.snake.getHeadPosition();
        if (headPos.x === foodPos.x && headPos.z === foodPos.z) {
            this.snake.grow(1);
            const worldPos = this.food.normalApple.position.clone();
            this.world.burstEat(worldPos, CONFIG.COLORS.CORE_RED_PRIMARY);
            this.food.spawnNormalApple(this.snake.getOccupiedCells());
        }
    }

    gameOver(cause) {
        this.state = 'GAME_OVER';
        this.immunityTimer = 0;
        this.snake.setImmunity(false);
        this.sound.playCrash();

        const headWorld = this.snake.getHeadWorldPosition();
        this.world.burstCrash(headWorld);

        const isNewRecord = this.score > this.highScore;
        if (isNewRecord) {
            this.highScore = this.score;
            localStorage.setItem('snake3d_cyber_highscore', this.highScore.toString());
        }

        const causeMsg = cause === 'WALL'
            ? 'COLISIÓN CRÍTICA CON BARRERA DE PLASMA'
            : 'SOBRECARGA: IMPACTO CON CHASIS PROPIO';

        document.getElementById('go-cause').textContent = causeMsg;
        document.getElementById('go-final-score').textContent = this.score;
        document.getElementById('go-high-score').textContent = this.highScore;
        document.getElementById('go-length').textContent = this.snake.segments.length;
        document.getElementById('go-cores').textContent = this.applesEaten;

        const survivalSecs = Math.floor((performance.now() - this.gameStartTime) / 1000);
        document.getElementById('go-time').textContent = `${survivalSecs}s`;

        const recordBadge = document.getElementById('go-new-record-badge');
        if (recordBadge) {
            if (isNewRecord && this.score > 0) {
                recordBadge.classList.remove('hidden');
            } else {
                recordBadge.classList.add('hidden');
            }
        }

        // Ocultar banner de inmunidad
        const immunityBadge = document.getElementById('hud-immunity');
        if (immunityBadge) immunityBadge.classList.add('hidden');

        document.getElementById('game-over-screen').classList.remove('hidden');
        this.updateHUD();
    }

    updateHUD() {
        document.getElementById('hud-high-score').textContent = this.highScore;
        document.getElementById('hud-length').textContent = this.snake.segments.length;
        document.getElementById('hud-level').textContent = `LVL ${this.level}`;

        const diffConfig = CONFIG.DIFFICULTIES[CONFIG.CURRENT_DIFFICULTY] || CONFIG.DIFFICULTIES.NORMAL;
        const speedRatio = Math.round(((diffConfig.initialTick - this.tickInterval) / (diffConfig.initialTick - diffConfig.minTick)) * 100);
        document.getElementById('hud-speed').textContent = `${Math.max(10, speedRatio)}%`;

        document.getElementById('hud-dir').textContent = this.snake.direction.name || 'ESTE';
    }

    renderLoop(now) {
        requestAnimationFrame((t) => this.renderLoop(t));

        const delta = this.clock.getDelta();
        const time = this.clock.getElapsedTime();

        // 1. Suave animación de conteo de números en el HUD
        if (this.displayScore < this.score) {
            this.displayScore = Math.min(this.score, this.displayScore + 1);
            document.getElementById('hud-score').textContent = this.displayScore;
        } else if (this.displayScore > this.score) {
            this.displayScore = this.score;
            document.getElementById('hud-score').textContent = this.displayScore;
        }

        if (this.state === 'PLAYING') {
            // Cuenta regresiva del Escudo de Fase
            if (this.immunityTimer > 0) {
                this.immunityTimer = Math.max(0, this.immunityTimer - delta);

                const timerEl = document.getElementById('immunity-timer');
                if (timerEl) {
                    timerEl.textContent = this.immunityTimer.toFixed(1);
                }

                const bar = document.getElementById('immunity-progress-bar');
                if (bar) {
                    const pct = (this.immunityTimer / CONFIG.IMMUNITY_DURATION_SEC) * 100;
                    bar.style.width = `${pct}%`;
                }

                if (this.immunityTimer === 0) {
                    this.snake.setImmunity(false);
                    const badge = document.getElementById('hud-immunity');
                    if (badge) badge.classList.add('hidden');
                }
            }

            const elapsed = now - this.lastTickTime;
            if (elapsed >= this.tickInterval) {
                this.gameTick();
                this.lastTickTime = now;
            }

            const alpha = Math.min(1.0, (now - this.lastTickTime) / this.tickInterval);
            this.snake.updateInterpolation(alpha);

        } else if (this.state === 'MENU') {
            // Demo autónomo a velocidad constante y agradable
            const elapsed = now - this.lastMenuDemoTick;
            if (elapsed >= 140) {
                this.menuDemoTick();
                this.lastMenuDemoTick = now;
            }
            const alpha = Math.min(1.0, (now - this.lastMenuDemoTick) / 140);
            this.snake.updateInterpolation(alpha);
        }

        this.food.update(time);
        this.world.update(delta, time);
        this.cameraManager.update(this.snake, delta);

        this.renderer.render(this.scene, this.cameraManager.camera);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.game = new GameEngine();
});
