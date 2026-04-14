/**
 * INDRA 3D CORE v1.1 - TECHNICAL ORBIT EDITION
 * Motor de Proyección Espacial basado en Babylon.js
 */

class Indra3DCore {
    constructor() {
        this.engine = null;
        this.scenes = new Map();
        this.isLibLoaded = false;
        this.libUrl = "https://cdn.babylonjs.com/babylon.js";
        this.loadersUrl = "https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js";
    }

    async _ensureLibrary() {
        if (this.isLibLoaded) return true;
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = this.libUrl;
            script.onload = () => {
                const loaders = document.createElement("script");
                loaders.src = this.loadersUrl;
                loaders.onload = () => {
                    this.isLibLoaded = true;
                    resolve(true);
                };
                document.head.appendChild(loaders);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async init(canvasId) {
        await this._ensureLibrary();
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const engine = new BABYLON.Engine(canvas, true);
        const scene = new BABYLON.Scene(engine);

        // CÁMARA TÉCNICA (ArcRotateCamera con Órbita Real)
        const camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 3, 5, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true); // <--- ESTO ACTIVA EL RATÓN
        camera.lowerRadiusLimit = 0.5;
        camera.upperRadiusLimit = 50;
        camera.wheelPrecision = 50;

        // ILUMINACIÓN PREMIUM (Fase 1.3)
        scene.clearColor = new BABYLON.Color4(0.02, 0.02, 0.02, 1);
        const env = scene.createDefaultEnvironment({ createGround: false, createSkybox: false });
        env.setMainColor(new BABYLON.Color3(0.05, 0.05, 0.1));

        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 1.0;

        // Renderizado bajo demanda
        scene.renderDueToTasks = true;
        engine.runRenderLoop(() => {
            if (scene.activeCamera && (scene.renderDueToTasks || scene.activeCamera._isDirty)) {
                scene.render();
                scene.renderDueToTasks = false;
            }
        });

        this.scenes.set(canvasId, { engine, scene, camera });
        return scene;
    }

    async loadAsset(canvasId, url) {
        if (!url) return;
        const context = this.scenes.get(canvasId);
        if (!context) return;
        
        // Limpieza de escena previa (Soledad del Cascarón)
        context.scene.meshes.forEach(m => m.dispose());

        try {
            const result = await BABYLON.SceneLoader.ImportMeshAsync("", "", url, context.scene);
            
            // Post-procesado PBR
            result.meshes.forEach(m => {
                if (m.material) {
                    m.material.roughness = 0.3;
                    m.material.metallic = 0.1;
                    m.enableEdgesRendering();
                    m.edgesWidth = 1.5;
                    m.edgesColor = new BABYLON.Color4(0.7, 0.5, 0.2, 0.2);
                }
            });

            // Encuadre Automático
            context.scene.createDefaultCameraOrLight(true, true, true);
            const camera = context.scene.activeCamera;
            camera.attachControl(document.getElementById(canvasId), true);
            camera.panningSensibility = 1000;
            
            context.scene.renderDueToTasks = true;
            return result;
        } catch (error) {
            console.error("[INDRA_3D] Critical Load Error:", error);
        }
    }

    getStructure(canvasId) {
        const context = this.scenes.get(canvasId);
        if (!context) return [];
        return context.scene.meshes
            .filter(m => (!m.parent || m.parent.name === "__root__") && !m.name.includes("primitive"))
            .map(m => ({ id: m.id, name: m.name.toUpperCase(), visible: m.isEnabled() }));
    }

    toggleVisibility(canvasId, nodeId, state) {
        const context = this.scenes.get(canvasId);
        if (!context) return;
        const node = context.scene.getNodeById(nodeId);
        if (node) {
            node.setEnabled(state);
            context.scene.renderDueToTasks = true;
        }
    }

    destroy(canvasId) {
        const context = this.scenes.get(canvasId);
        if (context) {
            context.engine.dispose();
            this.scenes.delete(canvasId);
        }
    }
}

export const indra3D = new Indra3DCore();
