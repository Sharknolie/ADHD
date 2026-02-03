
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

// Configuration
const COIN_COUNT = 400; // Increased to 400
const TIME_STEP = 1 / 60;

// Three.js Globals
let scene, camera, renderer;
let coins = []; // Array of { mesh, body }

// Cannon.js Globals
let world;

// Mouse Interaction
let mouse = new THREE.Vector2();
let raycaster = new THREE.Raycaster();
let mouseBody; // Kinematic body following mouse
let planeBody; // Invisible plane for raycasting

// Initialization
init();
animate();

function init() {
    // 1. Setup Three.js Scene
    const container = document.getElementById('hero-canvas');
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.05); // Add depth

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 10, 20);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // High visible light
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffd700, 2); // Double intensity
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    const spotLight = new THREE.SpotLight(0xffaa00, 150); // Tripled intensity
    spotLight.position.set(-10, 20, -5);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 1;
    scene.add(spotLight);

    // 2. Setup Cannon.js Physics
    world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 10;

    // Materials
    const groundMat = new CANNON.Material();
    const coinMat = new CANNON.Material();
    const coinContactMat = new CANNON.ContactMaterial(groundMat, coinMat, {
        friction: 0.3,
        restitution: 0.5 // Bounciness
    });
    const coinCoinContactMat = new CANNON.ContactMaterial(coinMat, coinMat, {
        friction: 0.3,
        restitution: 0.3
    });
    world.addContactMaterial(coinContactMat);
    world.addContactMaterial(coinCoinContactMat);

    // 3. Create Walls (Invisible container)
    createContainer(groundMat);

    // 4. Create Coins
    // Larger coins: Radius 0.8 -> 1.2, Thickness 0.15 -> 0.25
    const coinGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.25, 20);
    const coinThreeMat = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 1.0,
        roughness: 0.15, // Shiny
        envMapIntensity: 1.0
    });

    // Cannon shapes must match
    const coinShape = new CANNON.Cylinder(1.2, 1.2, 0.25, 12);

    for (let i = 0; i < COIN_COUNT; i++) {
        // Three Mesh
        const mesh = new THREE.Mesh(coinGeo, coinThreeMat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);

        // Cannon Body
        const body = new CANNON.Body({
            mass: 1, // Dynamic
            material: coinMat,
            shape: coinShape
        });

        // Random position spread above
        const x = (Math.random() - 0.5) * 15;
        const y = 10 + Math.random() * 20;
        const z = (Math.random() - 0.5) * 10;
        body.position.set(x, y, z);

        // Random rotation
        body.quaternion.setFromEuler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

        world.addBody(body);
        coins.push({ mesh, body });
    }

    // 5. Mouse Interaction Kinematic Body
    const sphereShape = new CANNON.Sphere(2); // Large invisible pusher
    mouseBody = new CANNON.Body({
        mass: 0, // Kinematic/Static
        type: CANNON.Body.KINEMATIC,
        position: new CANNON.Vec3(0, -100, 0) // Initially far away
    });
    mouseBody.addShape(sphereShape);
    world.addBody(mouseBody);

    // Raycasting Plane (Analytical, invisible)
    planeBody = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // Z=0 plane approximation

    // Event Listeners
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onWindowResize);
}

function createContainer(material) {
    // Floor
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({ mass: 0, material: material });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // Rotate to horizontal
    groundBody.position.set(0, -5, 0); // Floor level
    world.addBody(groundBody);

    // Walls to keep coins in view
    // Left
    const wallShape = new CANNON.Plane();
    const leftWall = new CANNON.Body({ mass: 0 });
    leftWall.addShape(wallShape);
    leftWall.quaternion.setFromEuler(0, Math.PI / 2, 0);
    leftWall.position.set(-12, 0, 0);
    world.addBody(leftWall);

    // Right
    const rightWall = new CANNON.Body({ mass: 0 });
    rightWall.addShape(wallShape);
    rightWall.quaternion.setFromEuler(0, -Math.PI / 2, 0);
    rightWall.position.set(12, 0, 0);
    world.addBody(rightWall);

    // Back
    const backWall = new CANNON.Body({ mass: 0 });
    backWall.addShape(wallShape);
    backWall.position.set(0, 0, -8);
    world.addBody(backWall);

    // Front (Glass?)
    const frontWall = new CANNON.Body({ mass: 0 });
    frontWall.addShape(wallShape);
    frontWall.quaternion.setFromEuler(0, Math.PI, 0);
    frontWall.position.set(0, 0, 8);
    world.addBody(frontWall);
}

function onMouseMove(event) {
    // Normalized coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Raycast to find intersection with a plane at depth 0
    raycaster.setFromCamera(mouse, camera);
    const targetZ = 0;
    const dist = (targetZ - camera.position.z) / raycaster.ray.direction.z;
    const pos = raycaster.ray.origin.clone().add(raycaster.ray.direction.clone().multiplyScalar(dist));

    // Update kinematic body position
    mouseBody.position.set(pos.x, pos.y, pos.z);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    // Step Physics
    world.step(TIME_STEP);

    // Sync meshes
    for (const obj of coins) {
        obj.mesh.position.copy(obj.body.position);
        obj.mesh.quaternion.copy(obj.body.quaternion);
    }

    renderer.render(scene, camera);
}
