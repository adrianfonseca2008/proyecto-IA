/**
 * ====================================================================
 * SNAKE 3D CLÁSICO - SISTEMA DE CÁMARA TIPO 2D/3D (TABLETOP PERSPECTIVE)
 * ====================================================================
 * Ofrece una vista clara y legible de todo el tablero plano de arena,
 * inclinada lo justo para apreciar la tridimensionalidad de las paredes,
 * las manzanas y el gusano verde sin desorientar al jugador.
 */

class CameraManager {
    constructor(scene, renderer) {
        this.scene = scene;
        this.renderer = renderer;

        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(46, aspect, 0.5, 1000);

        this.mode = CONFIG.CAMERA_MODES.ISOMETRIC_3D;
        this.setMode(CONFIG.CAMERA_MODES.ISOMETRIC_3D);

        window.addEventListener('resize', () => this.handleResize());
    }

    setMode(mode) {
        this.mode = mode;
        const totalW = CONFIG.GRID_WIDTH * CONFIG.CELL_SIZE;
        const totalH = CONFIG.GRID_HEIGHT * CONFIG.CELL_SIZE;
        const maxDim = Math.max(totalW, totalH);

        if (this.mode === CONFIG.CAMERA_MODES.ISOMETRIC_3D) {
            // Vista cenital inclinada en 3D (Ángulo óptimo estilo juego de mesa)
            // Permite ver todo el tablero como en 2D, pero apreciando el relieve 3D de paredes y gusano
            this.camera.position.set(0, maxDim * 1.35, maxDim * 0.95);
            this.camera.lookAt(0, 0, 0);

        } else if (this.mode === CONFIG.CAMERA_MODES.TOP_DOWN) {
            // Vista completamente cenital / plana (Clásica 2D con render 3D)
            this.camera.position.set(0, maxDim * 1.6, 0.001);
            this.camera.lookAt(0, 0, 0);

        } else if (this.mode === CONFIG.CAMERA_MODES.CHASE_3D) {
            // Vista cercana detrás del gusano
            this.camera.position.set(0, maxDim * 0.9, maxDim * 0.7);
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
        if (this.mode === CONFIG.CAMERA_MODES.CHASE_3D && snake && snake.segments.length > 0) {
            // Suave seguimiento del centro de masa del gusano
            const head = snake.getHeadWorldPosition();
            const target = new THREE.Vector3(head.x * 0.4, 0, head.z * 0.4);
            this.camera.lookAt(target);
        }
    }

    handleResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }
}

window.CameraManager = CameraManager;
