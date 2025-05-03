import { useEffect } from 'react';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';


const Map3D = ({ map }: { map: google.maps.Map | null }) => {
    useEffect(() => {
        let scene: THREE.Scene,
            renderer: THREE.WebGLRenderer,
            camera: THREE.PerspectiveCamera,
            loader: GLTFLoader,
            directionalLight: THREE.DirectionalLight;

        if (!map || !google.maps.WebGLOverlayView) return;

        const overlay = new google.maps.WebGLOverlayView();

        overlay.onAdd = () => {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera();

            const ambientLight = new THREE.AmbientLight( 0xffffff, 1.5 );
            scene.add(ambientLight);
            directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
            directionalLight.position.set(0, 0, 3);
            scene.add(directionalLight);

            loader = new GLTFLoader();
            const source = "./CH.gltf";
            loader.load(
                source,
                gltf => {
                    gltf.scene.scale.set(0.75,0.8,0.75);
                    gltf.scene.rotation.z = 185 * (Math.PI / 180);
                    gltf.scene.translateX(-3)
                    gltf.scene.translateY(-4)
                    scene.add(gltf.scene);
                }
            );

        };

        overlay.onContextRestored = ({gl}) => {
            renderer = new THREE.WebGLRenderer({
                canvas: gl.canvas,
                context: gl,
                ...gl.getContextAttributes(),
            });

            renderer.autoClear = false;
        };

        overlay.onDraw = ({gl, transformer}) => {
            const latLngAltitudeLiteral = {
                lat: 42.32594590768938,
                lng: -71.14970830931031,
                altitude: 2,
            }

            const matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral);
            camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);

            overlay.requestRedraw();
            renderer.render(scene, camera);
            renderer.resetState();

        };

        overlay.setMap(map)


    }, []);

    return (
        <></>
    )
}

export default Map3D;