const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;

//animaciones
//const geometry = new THREE.CircleGeometry(.01, 32);
const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
const circle = [];
const trail = [];
const velocity = [];

const num = 3000; //numero de particulas
const nc = 3; //numero de puntos de la cola
const radio = 0.003; //dispercion x,y
const z_deep = 0.026; //profundidad de la cola
const cola_activa = false //activar cola
const aceleracion = 0.0002;

for (let i = 0; i < num; i++) {
    let geometry = new THREE.CircleGeometry(getRandomNumberBetween(0.005, 0.02), 32);
    circle.push(new THREE.Mesh(geometry, material));

    /*COLA */
    if(cola_activa){
        trail.push(puntos_cola(nc,geometry,material));
    }

    const x = getRandomNumberBetween(-8, 8);
    const y = getRandomNumberBetween(-8, 8);

    circle[i].position.x = x;
    circle[i].position.y = y;

    /*COLA */
    if(cola_activa){
        cola(trail[i],x,y,true);
    }

    const randomVelocity = determinarVelocidades(circle[i]);

    velocity.push(randomVelocity);

    scene.add(circle[i]);
}

/*COLA */
function puntos_cola(n,geometry,material){
    const aux = [];
    for(let i=0;i<n;i++){
        aux.push(new THREE.Mesh(geometry, material))
    }
    return aux;
}

/*COLA */
function cola(trail,x,y,add){
    const coord = direccion_cola(x,y,radio);
    for(let i = 0;i<nc;i++){
        trail[i].position.x = x +coord[0]*i;
        trail[i].position.y = y -coord[1]*i;
        trail[i].position.z = 0 -z_deep*i;
        if(add){
            scene.add(trail[i]);
        }
    }
}

/*COLA */
function cola_reset_z(trail){
    for(let i = 0;i<nc;i++){
      trail[i].position.z = 0-z_deep*i;  
    }
}

/*COLA */
function direccion_cola(x1,y1,radio){
    let x = 0;
    let y = 0;

    if (x1 >= 0 && y1 >= 0) {
        x = -radio;
        y = +radio;
    }

    if (x1 < 0 && y1 >= 0) {
        x = +radio;
        y = +radio;
    }

    if (x1 < 0 && y1 < 0) {
        x = +radio;
        y = -radio;
    }

    if (x1 >= 0 && y1 < 0) {
        x = -radio;
        y = -radio;
    }

    return [x,y];
}

function determinarVelocidades(circle) {
    let x = 0;
    let y = 0;

    if (circle.position.x >= 0 && circle.position.y >= 0) {
        x = Math.abs(randomNumber());
        y = Math.abs(randomNumber());
    }

    if (circle.position.x < 0 && circle.position.y >= 0) {
        x = -Math.abs(randomNumber());
        y = Math.abs(randomNumber());
    }

    if (circle.position.x < 0 && circle.position.y < 0) {
        x = -Math.abs(randomNumber());
        y = -Math.abs(randomNumber());
    }

    if (circle.position.x >= 0 && circle.position.y < 0) {
        x = Math.abs(randomNumber());
        y = -Math.abs(randomNumber());
    }
    return [x, y]
}

function randomNumber() {
    return (2 * Math.random() - 1) / 100;
}

function getRandomNumberBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function estaEnPantalla(circle){
    return  (
            circle.position.x > -8   && 
            circle.position.x < 8    &&
            circle.position.y > -8   && 
            circle.position.y < 8    
    )
}

function determinarAceleracion(x1,y1){
    let x = 0;
    let y = 0;

    if (x1 >= 0 && y1 >= 0) {
        x = -1
        y = -1
    }

    if (x1 < 0 && y1 >= 0) {
        x = -1
        y = +1
    }

    if (x1 < 0 && y1 < 0) {
        x = -1
        y = -1
    }

    if (x1 >= 0 && y1 < 0) {
        x = +1
        y = -1
    }
    return [x, y]
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    for (i = 0; i < num; i++) {
        if (estaEnPantalla(circle[i])) {
            circle[i].position.x += velocity[i][0];
            circle[i].position.y += velocity[i][1];
            
            const as = determinarAceleracion(circle[i].position.x,circle[i].position.y)

            velocity[i][0] += as[0] * aceleracion;
            velocity[i][1] += as[1] * aceleracion;

            /*COLA */
            if(cola_activa){
                for(let j=0;j<nc;j++){
                    trail[i][j].position.x += velocity[i][0];
                    trail[i][j].position.y += velocity[i][1];
                    trail[i][j].position.z += 0.02;
                }
            }


            circle[i].position.z += 0.02;
        } else {
            const cordenadas = [getRandomNumberBetween(-8,8),getRandomNumberBetween(-3,3)];
            circle[i].position.x = cordenadas[0];
            circle[i].position.y = cordenadas[1];
            circle[i].position.z = 0;

            velocity[i][0] = 0;
            velocity[i][1] = 0;

            /*COLA */
            if(cola_activa){
                cola(trail[i],cordenadas[0],cordenadas[1],false);
                cola_reset_z(trail[i]);
            }
            velocity[i] = determinarVelocidades(circle[i]);         
        }
    }
}
animate();