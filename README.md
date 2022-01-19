# Repositorio para aprender las bases de three js 

## Conceptos generales

En three js se necesitan 3 cosas para crear animaciones, la primera es una escena, la segunda es una camara
y la tercera es un renderer.

### Escena

Se define la escena.

```js
const scene = new THREE.Scene();
```

### Cámara 

La cámara más básica es la de perspectiva recibe 4 argumentos el primero es el campo de vista d una escena en determinado
momento es recibido en grados. Es segundo es el aspect ratio casi siempre es la relación del ancho y el alto. Los otros
dos parametros indican la cercanía y el alejamiento de los objetos que serán renderizados cuando lleguen a ese valor.

```js
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
```

### Renderer

El renderer es donde la magia ocurre.

```js
const renderer = new THREE.WebGLRenderer();
```

Fijamos el tamaño y lo añadimos al DOM.

```js
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
```

### Creando cosas

```js
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;
```

### Renderizar la escena

Para renderizar las escena se crea un función ciclica que constantemente renderiza los objetos dentro de la escena.

```js
function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();
```

### Animar

Para animar las escenas simplemente cambiamos los atributos de nuestros objetos dentro de la función animate.

```js
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
}
```