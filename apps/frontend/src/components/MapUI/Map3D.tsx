import { useEffect } from 'react';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {myNode} from "common/src/classes/classes.ts";


function AddAltitudeToPath(path: PathPoint[]): { lat: number; lng: number }[] {
    return path.map((point) => ({
        lat: point.lat,
        lng: point.lng,
        altitude: 2
    }));
}

interface PathPoint {
    lat: number;
    lng: number;
}


interface Map3DProps {
    map: google.maps.Map | null;
    pathPoints?: PathPoint[];
    buildingId: string;
}

const Map3D = ({map,
                   pathPoints = [], buildingId
               }: Map3DProps) =>{


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
            let source ;
            if (buildingId === "1") {
                source = "./CH.gltf"
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
            }
            else if (buildingId === "2") {
                source = "./PP01.gltf"
                loader.load(
                    source,
                    gltf => {
                        gltf.scene.scale.set(0.75,0.8,0.75);
                        scene.add(gltf.scene);
                    }
                );
            }


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
            let latLngAltitudeLiteral
            if (buildingId === "1") {
                latLngAltitudeLiteral = {
                    lat: 42.32594590768938,
                    lng: -71.14970830931031,
                    altitude: 2,
                }
            }
            else if (buildingId === "2") { // patriot place
                 latLngAltitudeLiteral = {
                     lat:42.09281215868838,
                     lng: -71.26614168403535,
                     altitude: 2,
                }
            }
            else { // no 3d map :(
                latLngAltitudeLiteral = {
                    lat:0,
                    lng: 0,
                    altitude: 2,
                }
            }

            const matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral);
            camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);

            overlay.requestRedraw();
            renderer.render(scene, camera);
            renderer.resetState();

        };

        overlay.setMap(map)


    }, [map, buildingId]);

    return (
        <></>
    )
}

export default Map3D;