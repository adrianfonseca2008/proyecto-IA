/**
 * ====================================================================
 * SNAKE 3D: CYBERNETIC PROTOCOL - CONTROLADOR DE ENTRADA & EVENTOS
 * ====================================================================
 * Captura comandos por teclado (WASD, Flechas, P, ESC, C, M, R),
 * controles táctiles y pad direccional digital.
 * Amortigua giros de 180° imposibles y encola movimientos para respuesta instantánea.
 */

class InputController {
    constructor(soundController) {
        this.sound = soundController;
        this.inputQueue = [];
        this.currentDirection = { ...CONFIG.DIRECTIONS.RIGHT };
        this.enabled = true;

        this.onPauseToggle = null;
        this.onCameraToggle = null;
        this.onRestart = null;
        this.onMuteToggle = null;

        this.bindEvents();
    }

    reset() {
        this.inputQueue = [];
        this.currentDirection = { ...CONFIG.DIRECTIONS.RIGHT };
    }

    bindEvents() {
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    isOpposite(d1, d2) {
        return (d1.x === -d2.x && d1.z === -d2.z);
    }

    enqueueDirection(newDir) {
        if (!this.enabled) return;

        const lastPending = this.inputQueue.length > 0
            ? this.inputQueue[this.inputQueue.length - 1]
            : this.currentDirection;

        // Evitar el mismo movimiento o girar 180° contra el propio cuerpo
        if (
            (newDir.x === lastPending.x && newDir.z === lastPending.z) ||
            this.isOpposite(newDir, lastPending)
        ) {
            return;
        }

        // Cola máxima de 2 comandos por tick para respuesta instantánea de alta precisión
        if (this.inputQueue.length < 2) {
            this.inputQueue.push(newDir);
            if (this.sound) this.sound.playTurn();
        }
    }

    pollNextDirection() {
        if (this.inputQueue.length > 0) {
            this.currentDirection = this.inputQueue.shift();
        }
        return this.currentDirection;
    }

    handleKeyDown(e) {
        const code = e.code;
        const key = e.key.toLowerCase();

        // Pausa (ESC / P)
        if (code === 'KeyP' || key === 'escape') {
            e.preventDefault();
            if (this.onPauseToggle) this.onPauseToggle();
            return;
        }

        // Alternar Cámara (C)
        if (code === 'KeyC') {
            e.preventDefault();
            if (this.onCameraToggle) this.onCameraToggle();
            return;
        }

        // Alternar Sonido (M)
        if (code === 'KeyM') {
            e.preventDefault();
            if (this.onMuteToggle) this.onMuteToggle();
            return;
        }

        // Reinicio rápido (R)
        if (code === 'KeyR') {
            if (this.onRestart) {
                const consumed = this.onRestart();
                if (consumed) {
                    e.preventDefault();
                    return;
                }
            }
        }

        // Enter o Barra Espaciadora en Game Over o Inicio
        if (code === 'Enter' || code === 'Space') {
            if (this.onRestart) {
                const consumed = this.onRestart();
                if (consumed) {
                    e.preventDefault();
                    return;
                }
            }
        }

        // 4 Direcciones Cardinales (WASD y Flechas)
        switch (code) {
            case 'KeyW':
            case 'ArrowUp':
                e.preventDefault();
                this.enqueueDirection(CONFIG.DIRECTIONS.UP);
                break;

            case 'KeyS':
            case 'ArrowDown':
                e.preventDefault();
                this.enqueueDirection(CONFIG.DIRECTIONS.DOWN);
                break;

            case 'KeyA':
            case 'ArrowLeft':
                e.preventDefault();
                this.enqueueDirection(CONFIG.DIRECTIONS.LEFT);
                break;

            case 'KeyD':
            case 'ArrowRight':
                e.preventDefault();
                this.enqueueDirection(CONFIG.DIRECTIONS.RIGHT);
                break;
        }
    }
}

window.InputController = InputController;
