
//Initial setup
  let scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  let renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

// Meshes
  let cubeGeometry = new THREE.BoxGeometry( 1, 1, 1 );
  let sphereGeometry = new THREE.IcosahedronGeometry(0.5, 2);
  let heroMaterial = new THREE.MeshLambertMaterial( { color: 0x336699 } );
  let villainMaterial = new THREE.MeshLambertMaterial( { color: 0xCC0000 } );
  let bulletMaterial = new THREE.MeshNormalMaterial( { wireframe: true } );
  let cube = new THREE.Mesh( cubeGeometry, heroMaterial );
  let cube2 = new THREE.Mesh( cubeGeometry, villainMaterial );
  let rightWall = new THREE.Mesh()
  scene.add(cube2)
  let spheres = []
  let bulletYAngles = []
  cube.position.x = 1
  scene.add( cube );
// create light sources
  let pointLight1 = new THREE.PointLight(0xFFFFFF);
  let ambientLight = new THREE.AmbientLight(0xFFFFFF);

  pointLight1.position.set(10, 50, 130)
  scene.add(pointLight1);
  scene.add(ambientLight);

  window.Scene = scene

// Camera and Render
  camera.position.z = 3;
  camera.position.y = 1
  camera.position.x = 0
  cube.add(camera)
  function render() {
    requestAnimationFrame( render );


    cube2.rotation.x += 0.01;
    cube2.rotation.y += 0.01;

    spheres.forEach((sphere, index) => {
      sphere.position.x -= Math.sin(bulletYAngles[index])
      sphere.position.z -= Math.cos(bulletYAngles[index])
    })
    renderer.render( scene, camera );
  }
  render();

// Key Listeners for controls
  window.onkeydown = (e) => {
    let key = e.keyCode ? e.keyCode : e.which;

    if (key === 37) {
      cube.rotation.y += 0.1
      console.log("y rot", cube.rotation.y);
    } else if (key === 38) {
      cube.translateZ(-0.1)
    } else if (key === 39){
      cube.rotation.y -= 0.1
      console.log(cube.rotation.y);
    } else if (key === 40){
      cube.translateZ(0.1)
    }
    if (key === 32){
      let sphere = new THREE.Mesh(sphereGeometry, bulletMaterial);
      sphere.position.set(cube.position.x, cube.position.y, cube.position.z)
      sphere.rotation.set(3.28, 3.28, 3.28)

      // sphere.rotation.x = 3.28
      // sphere.rotation.y = 0
      // sphere.rotation.z = 3.28
      scene.add(sphere)
      // sphere.rotation.set(cube.rotation.x, cube.rotation.y, cube.rotation.z)
      // scene.add(sphere)
      spheres.push(sphere)
      bulletYAngles.push(cube.rotation.y)
    }
  }

function setupMap (){
  let map = [ // 1  2  3  4  5  6  7  8  9
             [1, 1, 1, 1, 1, 1, 1, 1, 1, 1,], // 0
             [1, 0, 0, 0, 0, 0, 0, 1, 1, 1,], // 1
             [1, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 2
             [1, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 3
             [1, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 4
             [1, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 5
             [1, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 6
             [1, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 7
             [1, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 8
             [1, 1, 1, 1, 1, 1, 1, 1, 1, 1,], // 9
           ], mapWidth = map.length * 5, mapHeight = 3;

  let floor = new THREE.Mesh(
    new THREE.CubeGeometry(mapWidth, 0.0001, mapWidth),
    new THREE.MeshLambertMaterial({color: 0x336633})
  )
  floor.position.y = -0.5
  scene.add(floor)

  let wallCube = new THREE.CubeGeometry(1, mapHeight, 1);

  let wallMaterial = new THREE.MeshLambertMaterial({color: 0xCC99CC})
  // [
  //   null,
  //   new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('assets/images/wall.jpg')})
  // ]

  for(let i = 0; i < mapWidth; i++) {
    for(let j = 0; j < map[i].length; j++){
      let wall = new THREE.Mesh(wallCube, wallMaterial);
      debugger
      wall.positiion.set(
        ((j * 5) - 5),
        ((i * 5) - 5),
        (-0.5)
      );
      scene.add(wall)
    }
  }
}

setupMap()
