/**
 * ====================================================================
 * SNAKE 3D: CYBERNETIC PROTOCOL - CONTROLADOR DE CÁMARA CINEMÁTICA
 * ====================================================================
 * Gestiona perspectivas cinemáticas del juego:
 * 1. ISOMETRIC_3D: Vista táctica 3D inclinada sin ángulos ciegos.
 * 2. TOP_DOWN: Vista táctica radar 2D/3D con renderizado PBR completo.
 * 3. CHASE_3D: Cámara en tercera persona dinámica con amortiguación suave.
 * 4. Modo Órbita de Menú: Rotación cinemática suave para el fondo del menú.
 */

class CameraManager {
    constructor(scene, renderer) {
        this.scene = scene;
        this.renderer = renderer;

        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(46, aspect, 0.5, 1000);

        this.mode = CONFIG.CAMERA_MODES.ISOMETRIC_3D;
        this.menuOrbitAngle = 0;
        this.isMenuMode = true;

        this.setMode(CONFIG.CAMERA_MODES.ISOMETRIC_3D);
        window.addEventListener('resize', () => this.handleResize());
    }

    setMenuMode(isMenu) {
        this.isMenuMode = isMenu;
        if (!isMenu) {
            this.setMode(this.mode);
        }
    }

    setMode(mode) {
        this.mode = mode;
        const totalW = CONFIG.GRID_WIDTH * CONFIG.CELL_SIZE;
        const totalH = CONFIG.GRID_HEIGHT * CONFIG.CELL_SIZE;
        const maxDim = Math.max(totalW, totalH);

        if (this.mode === CONFIG.CAMERA_MODES.ISOMETRIC_3D) {
            // Vista isométrica 3D táctica óptima
            this.camera.position.set(0, maxDim * 1.25, maxDim * 0.98);
            this.camera.lookAt(0, -0.2, 0);

        } else if (this.mode === CONFIG.CAMERA_MODES.TOP_DOWN) {
            // Vista táctica cenital
            this.camera.position.set(0, maxDim * 1.55, 0.001);
            this.camera.lookAt(0, 0, 0);

        } else if (this.mode === CONFIG.CAMERA_MODES.CHASE_3D) {
            // Vista de seguimiento dinámico
            this.camera.position.set(0, maxDim * 0.75, maxDim * 0.65);
            this.camera.lookAt(0, 0, 0);
        }
    }

    cycleMode() {
        const modes = [
            CONFIG.CAMERA_MODES.ISOMETRIC_3D,
            CONFIG.CAMERA_MODES.TOP_DOWN,
            CONFIG.CAMERA_MODES.CHASE_3D
        ];
        const nextIdx = (modes.indexOf(this.mode) + 1) % modes.length;
        this.setMode(modes[nextIdx]);
        return this.mode;
    }

    update(snake, delta) {
        const totalW = CONFIG.GRID_WIDTH * CONFIG.CELL_SIZE;
        const maxDim = totalW;

        if (this.isMenuMode) {
            // Suave órbita cinemática para el fondo del Menú Principal
            this.menuOrbitAngle += delta * 0.18;
            const dist = maxDim * 1.25;
            const height = maxDim * 0.95;

            this.camera.position.x = Math.sin(this.menuOrbitAngle) * dist;
            this.camera.position.z = Math.cos(this.menuOrbitAngle) * dist;
            this.camera.position.y = height + Math.sin(this.menuOrbitAngle * 0.5) * 2.0;
            this.camera.lookAt(0, 0, 0);
            return;
        }

        if (this.mode === CONFIG.CAMERA_MODES.CHASE_3D && snake && snake.segments.length > 0) {
            // Seguimiento suave del gusano en tercera persona
            const head = snake.getHeadWorldPosition();
            const targetCamX = head.x * 0.35;
            const targetCamZ = head.z * 0.35 + maxDim * 0.65;
            const targetCamY = maxDim * 0.68;

            this.camera.position.x += (targetCamX - this.camera.position.x) * (delta * 4.0);
            this.camera.position.y += (targetCamY - this.camera.position.y) * (delta * 4.0);
            this.camera.position.z += (targetCamZ - this.camera.position.z) * (delta * 4.0);

            const lookTarget = new THREE.Vector3(head.x * 0.7, 0, head.z * 0.7);
            this.camera.lookAt(lookTarget);
        }
    }

    handleResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }
}

window.CameraManager = CameraManager;
