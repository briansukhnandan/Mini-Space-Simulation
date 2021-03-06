class Planet {

    constructor(name, geometry, material) {
        this.name = name;
        this.geometry = geometry;
        this.material = material;
    }

    construct_planet(x,y,z) {
        let tmp = new THREE.Mesh(this.geometry, this.material);
        tmp.position.set(x,y,z)
        return tmp;
    }

}

class Orbit_Outline {

    constructor(geometry, material, rotation_angle) {
        this.geometry = geometry;
        this.material = material;
        this.rotation_angle = rotation_angle;
    }

    construct_orbit() {
        let tmp = new THREE.Mesh(this.geometry, this.material);
        tmp.rotateX(this.rotation_angle);
        return tmp;
    }

}

function generate_Moons(n, geometry, material) {

    let moon_list = [];

    var i;
    for (i = 0; i < n; i++) {
        moon_list.push(new THREE.Mesh(geometry, material))
    }

    return moon_list;

}

function calculate_Orbit(speed) { return (0.05 * speed) / 365.0; }
function calculate_Rotation(speed) { return 0.02 * speed; }
// Counter to reuse throughout programs.
var i;

// Create new scene.
let scene = new THREE.Scene();

// Define a camera with a FOV of 100 deg, and an aspect ratio if width:height.
// Also near/far clipping plane. Objects > far && Objects < near won't render.
let camera = new THREE.PerspectiveCamera(
    50, (window.innerWidth / window.innerHeight), 0.1, 20000
);

// Add camera to scene.
scene.add(camera);

// Position camera at z=30 and look downwards at origin.
camera.position.set(-2000,800,1500);
camera.lookAt(0,0,0);

// Create renderer.
let renderer = new THREE.WebGLRenderer();

// Set size at which we render app.
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// Orbit Controls - Allows us to zoom in/out and pan.
let orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

// Set min/max distance to avoid zooming out of skybox.
orbitControls.minDistance = 0.1;
orbitControls.maxDistance = 20000;

/**
    *
    * Adding Skybox.
    *
**/

let materialArray = [];

let texture_ft = new THREE.ImageUtils.loadTexture("images/star.jpg")
let texture_bk = new THREE.ImageUtils.loadTexture("images/star.jpg")
let texture_up = new THREE.ImageUtils.loadTexture("images/star.jpg")
let texture_dn = new THREE.ImageUtils.loadTexture("images/star.jpg")
let texture_rt = new THREE.ImageUtils.loadTexture("images/star.jpg")
let texture_lf = new THREE.ImageUtils.loadTexture("images/star.jpg")

materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));

for (let i = 0; i < 6; i++) {
    materialArray[i].side = THREE.BackSide;
}

let skyboxGeo = new THREE.BoxGeometry( 20000, 20000, 20000);
let skybox = new THREE.Mesh( skyboxGeo, materialArray );
scene.add( skybox );


/**
    *
    * Create Pivot objects array.
    * POA[0] = Mercury
    * POA[1] = Venus
    * POA[2] = Mars
    * POA[3] = Jupiter
    * POA[4] = Saturn
    * POA[5] = Uranus
    * POA[6] = Neptune
    * POA[7] = Pluto
    * POA[8] = Earth
    *
**/

let PivotObjectsArray = [];

// Each of the 8 pivot objects are initialized the same, but will differ in rotation.
for (i = 0; i < 9; i++) {

    let temp_geo = new THREE.SphereGeometry(1,1,1);
    let temp_material = new THREE.MeshBasicMaterial({
                            color: 0x030303
                        });

    PivotObjectsArray.push(new THREE.Mesh(temp_geo, temp_material));
    PivotObjectsArray[i].position.set(0,0,0);
}

for (i = 0; i < 9; i++) {
    scene.add(PivotObjectsArray[i]);
}

/**
    *
    * 	Set up pivots for each moon. This is to keep the moons
    *	with their own independent orbit.
    *
**/

let MoonPivotObjects = [];

for (i = 0; i < 7; i++) {

    let temp_geo = new THREE.SphereGeometry(1,1,1);
    let temp_material = new THREE.MeshBasicMaterial({
                            color: 0x030303
                        });

    MoonPivotObjects.push(new THREE.Mesh(temp_geo, temp_material));
}

// Set location of pivots to be pos of Earth and beyond.
MoonPivotObjects[0].position.set(1130,0,0); // Earth
MoonPivotObjects[1].position.set(1530,0,0); // Mars
MoonPivotObjects[2].position.set(2180,0,0); // Jupiter
MoonPivotObjects[3].position.set(2880,0,0); // Saturn
MoonPivotObjects[4].position.set(3680,0,0); // Uranus
MoonPivotObjects[5].position.set(4580,0,0); // Neptune
MoonPivotObjects[6].position.set(5580,0,0); // Pluto

// Then add to corresponding pivot object to do rotation.
for (i = 0; i < 7; i++) {
    PivotObjectsArray[i+2].add(MoonPivotObjects[i]);
}

/**
    *
    * Create Sun Sphere - Parent of Earth
    *
**/

let Sun = new Planet(
    "Sun",
    new THREE.SphereGeometry(225,30,30),
    new THREE.MeshBasicMaterial({
        map: new THREE.ImageUtils.loadTexture("images/sun.jpg")
    }),
).construct_planet(0,0,0);

scene.add(Sun);

/**
    *
    * Adding Mercury (temp pivot obj + planet).
    *
**/

// Create planet from constructor.
let Mercury = new Planet(
    "Mercury", // Name
    new THREE.SphereGeometry(7.6,30,30), // Geometry.
    new THREE.MeshBasicMaterial({ // Material
        map: new THREE.ImageUtils.loadTexture("images/mercury.jpg")
    })
).construct_planet(400,0,0);

/**
    *
    * Adding Venus (temp pivot obj + planet).
    *
**/

// Create planet from constructor.
let Venus = new Planet(
    "Venus", // Name
    new THREE.SphereGeometry(19,30,30), // Geometry.
    new THREE.MeshBasicMaterial({ // Material
        map: new THREE.ImageUtils.loadTexture("images/venus.png")
    })
).construct_planet(750, 0, 0);

/**
    *
    * Create Earth Sphere
    *
**/

// Create planet from constructor.
let Earth = new Planet(
    "Earth", // Name
    new THREE.SphereGeometry(20, 25, 25), // Geometry.
    new THREE.MeshBasicMaterial({ // Material
        map: new THREE.ImageUtils.loadTexture("images/earth.jpg")
    })
).construct_planet(1130,0,0);

/**
    *
    * Create Earth's Moon.
    *
**/

let EarthMoons = generate_Moons(		
    1, 
    new THREE.SphereGeometry(4.5,30,30),
    new THREE.MeshBasicMaterial({
        map: new THREE.ImageUtils.loadTexture("images/moon.png")
    })
);

for (i = 0; i < 1; i++) { MoonPivotObjects[0].add(EarthMoons[i]); }

/**
    *
    * Adding Mars (temp pivot obj + planet).
    *
**/

// Create planet from constructor.
let Mars = new Planet(
    "Mars", // Name
    new THREE.SphereGeometry(10.6,30,30), // Geometry.
    new THREE.MeshBasicMaterial({ // Material
        map: new THREE.ImageUtils.loadTexture("images/mars.png")
    })
).construct_planet(1530, 0, 0);

/**
    *
    * Adding Mars Moons.
    *
**/

let MarsMoons = generate_Moons(		
    2, 
    new THREE.SphereGeometry(3.1,30,30),
    new THREE.MeshBasicMaterial({
        map: new THREE.ImageUtils.loadTexture("images/phobos.png")
    })
);

for (i = 0; i < 2; i++) { MoonPivotObjects[1].add(MarsMoons[i]); }

/**
    *
    * Adding Jupiter (temp pivot obj + planet).
    *
**/

// Create planet from constructor.
let Jupiter = new Planet(
    "Jupiter", // Name
    new THREE.SphereGeometry(100,30,30), // Geometry.
    new THREE.MeshBasicMaterial({ // Material
        map: new THREE.ImageUtils.loadTexture("images/jupiter.jpg")
    })
).construct_planet(2180,0,0);

/**
    *
    * Adding 10 of Jupiter's Moons.
    *
**/

let JupiterMoons = generate_Moons(
    10,
    new THREE.SphereGeometry(4.2,30,30),
    new THREE.MeshBasicMaterial({
        map: new THREE.ImageUtils.loadTexture("images/europa.jpg")
    })
);

for (i = 0; i < 10; i++) { MoonPivotObjects[2].add(JupiterMoons[i]); }

/**
    *
    * Adding Saturn (temp pivot obj + planet).
    *
**/

// Create planet from constructor.
let Saturn = new Planet(
    "Saturn", // Name
    new THREE.SphereGeometry(92,30,30), // Geometry.
    new THREE.MeshBasicMaterial({ // Material
        map: new THREE.ImageUtils.loadTexture("images/saturn.jpg")
    })
).construct_planet(2880,0,0);

/**
    *
    * Adding Saturn Ring
    *
**/

let saturn_ring = new THREE.Mesh(
    new THREE.RingGeometry(192, 112, 32), 
    new THREE.MeshBasicMaterial({ 
        map: new THREE.ImageUtils.loadTexture("images/saturn_ring.jpg"), 
        side: THREE.DoubleSide 
    })
);

saturn_ring.rotateX(0.8);
saturn_ring.position.set(2880,0,0);
PivotObjectsArray[5].add(saturn_ring);

/**
    *
    * Adding 10 of Saturn's Moons.
    *
**/

let SaturnMoons = generate_Moons(
    10,
    new THREE.SphereGeometry(3.5,30,30),
    new THREE.MeshBasicMaterial({
        map: new THREE.ImageUtils.loadTexture("images/titan.jpg")
    })
);

for (i = 0; i < 10; i++) { MoonPivotObjects[3].add(SaturnMoons[i]); }

/**
    *
    * Adding Uranus (temp pivot obj + planet).
    *
**/

// Create planet from constructor.
let Uranus = new Planet(
    "Uranus", // Name
    new THREE.SphereGeometry(64,30,30), // Geometry.
    new THREE.MeshBasicMaterial({ // Material
        map: new THREE.ImageUtils.loadTexture("images/uranus.jpg")
    })
).construct_planet(3680,0,0);	

/**
    *
    * Adding only Uranus' 5 major moons.
    *
**/

let UranusMoons = generate_Moons(
    5,
    new THREE.SphereGeometry(3.9,30,30),
    new THREE.MeshBasicMaterial({
        map: new THREE.ImageUtils.loadTexture("images/obreon.jpg")
    })
);

for (i = 0; i < 5; i++) { MoonPivotObjects[4].add(UranusMoons[i]); }

/**
    *
    * Adding Neptune (temp pivot obj + planet).
    *
**/

// Create planet from constructor.
let Neptune = new Planet(
    "Neptune", // Name
    new THREE.SphereGeometry(60,30,30), // Geometry.
    new THREE.MeshBasicMaterial({ // Material
        map: new THREE.ImageUtils.loadTexture("images/neptune.jpg")
    })
).construct_planet(4580,0,0);

/**
    *
    * Adding 10 of Neptune's moons.
    *
**/

let NeptuneMoons = generate_Moons(
    10,
    new THREE.SphereGeometry(3.7,30,30),
    new THREE.MeshBasicMaterial({
        map: new THREE.ImageUtils.loadTexture("images/obreon.jpg")
    })
);

for (i = 0; i < 10; i++) { MoonPivotObjects[5].add(NeptuneMoons[i]); }

/**
    *
    * Adding Pluto (temp pivot obj + planet).
    *
**/

// Create planet from constructor.
let Pluto = new Planet(
    "Pluto", // Name
    new THREE.SphereGeometry(5,30,30), // Geometry.
    new THREE.MeshBasicMaterial({ // Material
        map: new THREE.ImageUtils.loadTexture("images/pluto.jpg")
    })
).construct_planet(5580,0,0);

/**
    *
    * Add Charon, Pluto's only moon.
    *
**/

let PlutoMoons = generate_Moons(
    1,
    new THREE.SphereGeometry(2.5,30,30),
    new THREE.MeshBasicMaterial({
        map: new THREE.ImageUtils.loadTexture("images/charon.jpg")
    })
);

for (i = 0; i < 1; i++) { MoonPivotObjects[6].add(PlutoMoons[i]); }


/**
    *
    * Keep a list of planets, for later.
    *
**/

let Planet_List = [

    Mercury, 
    Venus, 
    Earth, 
    Mars, 
    Saturn, 
    Uranus, 
    Neptune, 
    Pluto

];

/**
    *
    * Set all pivot objects.
    *
**/

PivotObjectsArray[0].add(Mercury);
PivotObjectsArray[1].add(Venus);
PivotObjectsArray[2].add(Earth);
PivotObjectsArray[3].add(Mars);
PivotObjectsArray[4].add(Jupiter);
PivotObjectsArray[5].add(Saturn);
PivotObjectsArray[6].add(Uranus);
PivotObjectsArray[7].add(Neptune);
PivotObjectsArray[8].add(Pluto);

/**
    *
    * Set positions of all moons for planets.
    *
**/

EarthMoons[0].position.set(40,6,-3);

MarsMoons[0].position.set(20,5,-3);
MarsMoons[1].position.set(17,8,5);

JupiterMoons[0].position.set(150,5,-3);
JupiterMoons[1].position.set(-197,-25,-5);
JupiterMoons[2].position.set(160,-25,-12);
JupiterMoons[3].position.set(-180,58,5);
JupiterMoons[4].position.set(0,-170,-3);
JupiterMoons[5].position.set(0,100,75);
JupiterMoons[6].position.set(165,-10,165);
JupiterMoons[7].position.set(0,100,-175);
JupiterMoons[8].position.set(0,-120,-70);
JupiterMoons[9].position.set(0,-20,175);

SaturnMoons[0].position.set(172,5,-3);
SaturnMoons[1].position.set(-97,-145,-5);
SaturnMoons[2].position.set(190,-125,-12);
SaturnMoons[3].position.set(-80,18,105);
SaturnMoons[4].position.set(0,-170,-130);
SaturnMoons[5].position.set(0,100,175);
SaturnMoons[6].position.set(165,-120,165);
SaturnMoons[7].position.set(100,100,-75);
SaturnMoons[8].position.set(0,-120,-170);
SaturnMoons[9].position.set(0,-120,175);

UranusMoons[0].position.set(112,45,-3);
UranusMoons[1].position.set(-97,-115,-5);
UranusMoons[2].position.set(90,-75,-12);
UranusMoons[3].position.set(-80,8,5);
UranusMoons[4].position.set(0,-70,-3);

NeptuneMoons[0].position.set(112,5,-3);
NeptuneMoons[1].position.set(-97,-85,-5);
NeptuneMoons[2].position.set(90,-65,-12);
NeptuneMoons[3].position.set(-80,80,5);
NeptuneMoons[4].position.set(0,-70,-3);
NeptuneMoons[5].position.set(0,10,75);
NeptuneMoons[6].position.set(65,-10,65);
NeptuneMoons[7].position.set(0,10,-75);
NeptuneMoons[8].position.set(0,-60,-70);
NeptuneMoons[9].position.set(0,-60,75);

PlutoMoons[0].position.set(10,5,-3);

/**
    *
    * Create and set positions for all orbit indications.
    *
**/

let Mercury_Orbit = new Orbit_Outline(
    new THREE.RingGeometry( 400, 399.5, 256 ),
    new THREE.MeshBasicMaterial({
        color: 0xfffdfb, side: THREE.DoubleSide
    }),
    Math.PI/2
).construct_orbit();

let Venus_Orbit = new Orbit_Outline(
    new THREE.RingGeometry( 750, 749.5, 256 ),
    new THREE.MeshBasicMaterial({
        color: 0xfffdfb, side: THREE.DoubleSide
    }),
    Math.PI/2
).construct_orbit();

let Earth_Orbit = new Orbit_Outline(
    new THREE.RingGeometry( 1130, 1129.5, 256 ),
    new THREE.MeshBasicMaterial({
        color: 0xfffdfb, side: THREE.DoubleSide
    }),
    Math.PI/2
).construct_orbit();

let Mars_Orbit = new Orbit_Outline(
    new THREE.RingGeometry( 1530, 1529.5, 256 ),
    new THREE.MeshBasicMaterial({
        color: 0xfffdfb, side: THREE.DoubleSide
    }),
    Math.PI/2
).construct_orbit();

let Jupiter_Orbit = new Orbit_Outline(
    new THREE.RingGeometry( 2180, 2179.5, 256 ),
    new THREE.MeshBasicMaterial({
        color: 0xfffdfb, side: THREE.DoubleSide
    }),
    Math.PI/2
).construct_orbit();

let Saturn_Orbit = new Orbit_Outline(
    new THREE.RingGeometry( 2880, 2879.5, 256 ),
    new THREE.MeshBasicMaterial({
        color: 0xfffdfb, side: THREE.DoubleSide
    }),
    Math.PI/2
).construct_orbit();

let Uranus_Orbit = new Orbit_Outline(
    new THREE.RingGeometry( 3680, 3679.5, 256 ),
    new THREE.MeshBasicMaterial({
        color: 0xfffdfb, side: THREE.DoubleSide
    }),
    Math.PI/2
).construct_orbit();

let Neptune_Orbit = new Orbit_Outline(
    new THREE.RingGeometry( 4580, 4579.5, 256 ),
    new THREE.MeshBasicMaterial({
        color: 0xfffdfb, side: THREE.DoubleSide
    }),
    Math.PI/2
).construct_orbit();

let Pluto_Orbit = new Orbit_Outline(
    new THREE.RingGeometry( 5580, 5579.5, 256 ),
    new THREE.MeshBasicMaterial({
        color: 0xfffdfb, side: THREE.DoubleSide
    }),
    Math.PI/2
).construct_orbit();

/**
    *
    * Add all orbit objects
    *
**/

Sun.add(Mercury_Orbit);
Sun.add(Venus_Orbit);
Sun.add(Earth_Orbit);
Sun.add(Mars_Orbit);
Sun.add(Jupiter_Orbit);
Sun.add(Saturn_Orbit);
Sun.add(Uranus_Orbit);
Sun.add(Neptune_Orbit);
Sun.add(Pluto_Orbit);

/**
    *
    * Animate objects
    *
**/

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    render();
}

/**
    *
    * Render function to keep animate clutter free.
    *
**/

function render() {

    Sun.rotation.y += 0.006;

    // Planets
    Mercury.rotation.y += .00034;
    Venus.rotation.y += -1*.000082;
    Earth.rotation.y += 0.02;
    Mars.rotation.y += .019;
    Jupiter.rotation.y += .0488;
    Saturn.rotateZ(-0.07);
    
    Uranus.rotateZ(0.055); // Uranus has a special case where it rotates on 2 axes.
    Uranus.rotateX(0.08);
    
    Neptune.rotation.y += .0298;
    Pluto.rotation.y += 0.00313

    // Pivot Objects
    PivotObjectsArray[0].rotation.y += 0.024; // Mercury
    PivotObjectsArray[1].rotation.y += 0.009; // Venus
    PivotObjectsArray[2].rotation.y += 0.005; // Earth
    PivotObjectsArray[3].rotation.y += 0.0035; // Mars
    PivotObjectsArray[4].rotation.y += 0.00054; // Jupiter
    PivotObjectsArray[5].rotation.y += 0.00020; // Saturn
    PivotObjectsArray[6].rotation.y += 0.00007; // Uranus
    PivotObjectsArray[7].rotation.y += 0.000035; // Neptune
    PivotObjectsArray[8].rotation.y += 0.000023; // Pluto

    EarthMoons[0].rotation.y += 0.2;
    PlutoMoons[0].rotation.y += 0.2;

    // Mars Moon rotations
    MarsMoons[0].rotation.y += 0.2;
    MarsMoons[1].rotation.y += 0.2;

    // Jupiter-Neptune Moon rotations
    var i;
    for (i = 0; i < 10; i++) {

        if (i < 5) {
            UranusMoons[i].rotation.y += 0.2;
        }
        
        JupiterMoons[i].rotation.y += 0.2;
        SaturnMoons[i].rotation.y += 0.2;
        NeptuneMoons[i].rotation.y += 0.2;
    }
    
}

// Add event listener to resize window.
window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

animate();