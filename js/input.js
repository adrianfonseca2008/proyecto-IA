/**
 * ====================================================================
 * SNAKE 3D CLÁSICO - CONTROL DE ENTRADA (4 DIRECCIONES)
 * ====================================================================
 * Captura teclado (WASD / Flechas), botones táctiles y pad direccional.
 * Valida giros prohibidos de 180° y amortigua entradas rápidas.
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

        // Cola máxima de 2 comandos por tick para respuesta instantánea
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

        // Control de pausa y cámara
        if (code === 'KeyP' || key === 'escape') {
            e.preventDefault();
            if (this.onPauseToggle) this.onPauseToggle();
            return;
        }

        if (code === 'KeyC') {
            e.preventDefault();
            if (this.onCameraToggle) this.onCameraToggle();
            return;
        }

        if (code === 'Enter' || code === 'Space') {
            if (this.onRestart) {
                // Si la función de reinicio está activa
                const consumed = this.onRestart();
                if (consumed) {
                    e.preventDefault();
                    return;
                }
            }
        }

        // 4 Direcciones Clásicas (WASD y Flechas)
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
