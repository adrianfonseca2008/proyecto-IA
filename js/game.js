/**
 * ====================================================================
 * SNAKE 3D CLÁSICO - MOTOR PRINCIPAL DEL JUEGO
 * ====================================================================
 * Orquesta la máquina de estados ('START', 'PLAYING', 'PAUSED', 'GAME_OVER'),
 * el bucle de ticks sobre la arena, la detección de manzanas y colisiones,
 * el power-up de inmunidad de la Manzana Azul (2s, transparencia, atravesar
 * el propio cuerpo y teletransporte envolvente estilo Nokia) y la UI.
 */

class GameEngine {
    constructor() {
        this.state = 'START';

        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('snake3d_classic_highscore') || '0', 10);
        this.applesEaten = 0;

        // Temporizador de Inmunidad (Manzana Azul)
        this.immunityTimer = 0;

        this.lastTickTime = 0;
        this.tickInterval = CONFIG.INITIAL_TICK_MS;
        this.clock = new THREE.Clock();

        this.initThree();
        this.initComponents();
        this.bindUI();
        this.updateHUD();

        requestAnimationFrame((t) => this.renderLoop(t));
    }

    initThree() {
        const container = document.getElementById('canvas-container');

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(CONFIG.COLORS.SKY);
        this.scene.fog = new THREE.Fog(CONFIG.COLORS.FOG, 60, 160);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.15;

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

        this.input.onPauseToggle = () => this.togglePause();
        this.input.onCameraToggle = () => this.cycleCamera();
        this.input.onRestart = () => {
            if (this.state === 'GAME_OVER' || this.state === 'START') {
                this.startGame();
                return true;
            }
            return false;
        };
    }

    bindUI() {
        document.getElementById('btn-start').addEventListener('click', () => this.startGame());
        document.getElementById('btn-restart').addEventListener('click', () => this.startGame());
        document.getElementById('btn-resume').addEventListener('click', () => this.togglePause());

        document.getElementById('btn-pause').addEventListener('click', () => this.togglePause());
        document.getElementById('btn-cam').addEventListener('click', () => this.cycleCamera());
        document.getElementById('btn-sound').addEventListener('click', () => this.toggleSound());

        // Pad direccional 2D en pantalla (4 flechas grandes)
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
                    this.input.enqueueDirection(dpadButtons[id]);
                });
            }
        });
    }

    startGame() {
        this.sound.playStart();
        this.state = 'PLAYING';
        this.score = 0;
        this.applesEaten = 0;
        this.tickInterval = CONFIG.INITIAL_TICK_MS;
        this.immunityTimer = 0;

        this.snake.reset();
        this.food.reset();
        this.world.reset();
        this.input.reset();

        this.food.spawnNormalApple(this.snake.getOccupiedCells());
        this.lastTickTime = performance.now();

        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-over-screen').classList.add('hidden');
        document.getElementById('pause-screen').classList.add('hidden');

        // Ocultar banner de inmunidad
        const immunityBadge = document.getElementById('hud-immunity');
        if (immunityBadge) immunityBadge.classList.add('hidden');

        this.updateHUD();
    }

    togglePause() {
        if (this.state === 'PLAYING') {
            this.state = 'PAUSED';
            document.getElementById('pause-screen').classList.remove('hidden');
        } else if (this.state === 'PAUSED') {
            this.state = 'PLAYING';
            this.lastTickTime = performance.now();
            document.getElementById('pause-screen').classList.add('hidden');
        }
    }

    cycleCamera() {
        const mode = this.cameraManager.cycleMode();
        const modeNames = {
            'ISOMETRIC_3D': '3D CENITAL',
            'TOP_DOWN': 'PLANA 2D',
            'CHASE_3D': 'SEGUIMIENTO'
        };
        document.getElementById('hud-cam-mode').textContent = modeNames[mode] || mode;
    }

    toggleSound() {
        const isMuted = this.sound.toggleMute();
        document.getElementById('sound-icon').textContent = isMuted ? '🔇' : '🔊';
    }

    /**
     * Activa el estado de inmunidad por 2 segundos
     */
    activateImmunity(seconds = CONFIG.IMMUNITY_DURATION_SEC) {
        this.immunityTimer = seconds;
        this.snake.setImmunity(true);

        const badge = document.getElementById('hud-immunity');
        if (badge) {
            badge.classList.remove('hidden');
            document.getElementById('immunity-timer').textContent = seconds.toFixed(1);
        }
    }

    gameTick() {
        if (this.state !== 'PLAYING') return;

        const nextDir = this.input.pollNextDirection();
        const isImmune = this.immunityTimer > 0;
        const result = this.snake.step(nextDir, isImmune);

        // 1. Manejo de colisiones (Pared 3D o propio cuerpo)
        if (result.collision) {
            this.gameOver(result.type);
            return;
        }

        // 2. Si se teletransportó en una pared (Power-Up de Nokia)
        if (result.teleported) {
            this.sound.playTeleport();
            this.world.burstTeleport(this.snake.getHeadWorldPosition());
        }

        const headPos = this.snake.getHeadPosition();

        // 3. Colisión con Manzana Normal (Roja)
        if (
            headPos.x === this.food.normalGridPos.x &&
            headPos.z === this.food.normalGridPos.z
        ) {
            this.score += CONFIG.POINTS_PER_APPLE;
            this.applesEaten++;
            this.snake.grow(1);
            this.sound.playEat();

            const worldPos = this.food.normalApple.position.clone();
            this.world.burstEat(worldPos, CONFIG.COLORS.APPLE_RED);

            // Aceleración gradual
            this.tickInterval = Math.max(
                CONFIG.MIN_TICK_MS,
                CONFIG.INITIAL_TICK_MS - (this.applesEaten * CONFIG.SPEED_UP_STEP_MS)
            );

            this.food.spawnNormalApple(this.snake.getOccupiedCells());
            this.food.maybeSpawnBonusApple(this.snake.getOccupiedCells());
            this.food.maybeSpawnBlueApple(this.snake.getOccupiedCells());
        }

        // 4. Colisión con Manzana Dorada (Bonus)
        if (
            this.food.bonusGridPos &&
            headPos.x === this.food.bonusGridPos.x &&
            headPos.z === this.food.bonusGridPos.z
        ) {
            this.score += CONFIG.POINTS_BONUS_APPLE;
            this.snake.grow(2);
            this.sound.playBonus();

            const worldPos = this.food.bonusApple.position.clone();
            this.world.burstEat(worldPos, CONFIG.COLORS.APPLE_GOLD);

            this.food.removeBonusApple();
        }

        // 5. Colisión con Manzana Azul (Power-Up de Inmunidad)
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
            this.world.burstEat(worldPos, CONFIG.COLORS.APPLE_BLUE);

            // ACTIVAR INMUNIDAD POR 2 SEGUNDOS
            this.activateImmunity(CONFIG.IMMUNITY_DURATION_SEC);

            this.food.removeBlueApple();
        }

        this.food.onTick();
        this.updateHUD();
    }

    gameOver(cause) {
        this.state = 'GAME_OVER';
        this.immunityTimer = 0;
        this.snake.setImmunity(false);
        this.sound.playCrash();

        const headWorld = this.snake.getHeadWorldPosition();
        this.world.burstCrash(headWorld);

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snake3d_classic_highscore', this.highScore.toString());
        }

        const causeMsg = cause === 'WALL'
            ? '¡Chocaste contra las paredes de la caja de cartón!'
            : '¡El gusano se mordió su propia cola!';

        document.getElementById('go-cause').textContent = causeMsg;
        document.getElementById('go-final-score').textContent = this.score;
        document.getElementById('go-high-score').textContent = this.highScore;
        document.getElementById('go-length').textContent = this.snake.segments.length;

        // Ocultar banner de inmunidad
        const immunityBadge = document.getElementById('hud-immunity');
        if (immunityBadge) immunityBadge.classList.add('hidden');

        document.getElementById('game-over-screen').classList.remove('hidden');
        this.updateHUD();
    }

    updateHUD() {
        document.getElementById('hud-score').textContent = this.score;
        document.getElementById('hud-high-score').textContent = this.highScore;
        document.getElementById('hud-length').textContent = this.snake.segments.length;

        const speedRatio = Math.round(((CONFIG.INITIAL_TICK_MS - this.tickInterval) / (CONFIG.INITIAL_TICK_MS - CONFIG.MIN_TICK_MS)) * 100);
        document.getElementById('hud-speed').textContent = `${Math.max(10, speedRatio)}%`;

        document.getElementById('hud-dir').textContent = this.snake.direction.name || 'Derecha';
    }

    renderLoop(now) {
        requestAnimationFrame((t) => this.renderLoop(t));

        const delta = this.clock.getDelta();
        const time = this.clock.getElapsedTime();

        if (this.state === 'PLAYING') {
            // Actualizar cuenta regresiva de la inmunidad
            if (this.immunityTimer > 0) {
                this.immunityTimer = Math.max(0, this.immunityTimer - delta);

                const timerEl = document.getElementById('immunity-timer');
                if (timerEl) {
                    timerEl.textContent = this.immunityTimer.toFixed(1);
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
