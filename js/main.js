
// var loader = new THREE.TextureLoader();
// var wallTexture = loader.load('http://i.imgur.com/Mtgockn.jpg', );
// var texture2 = loader.load('texture2.jpg');

//Initial setup
  let scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  let renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  let collidableMeshList = []

// Meshes
  let cubeGeometry = new THREE.BoxGeometry( 1, 1, 1 )
  let villainGeometry = new THREE.BoxGeometry( 1, 1, 1 )
  let sphereGeometry = new THREE.IcosahedronGeometry(0.5, 2);
  let heroMaterial = new THREE.MeshLambertMaterial( { color: 0x336699 } );
  let villainMaterial = new THREE.MeshLambertMaterial( { color: 0xCC0000 } );
  let bulletMaterial = new THREE.MeshNormalMaterial( { wireframe: true } );
  let cube = new THREE.Mesh( cubeGeometry, heroMaterial );
  let villain = new THREE.Mesh( villainGeometry, villainMaterial );
  let rightWall = new THREE.Mesh()

  scene.add(villain)

  let spheres = []
  let bulletYAngles = []
  cube.position.x = 1
  villain.position.y = 0.5
  scene.add( cube );
// create light sources
  let pointLight1 = new THREE.PointLight(0xFFFFFF);
  let ambientLight = new THREE.AmbientLight(0xFFFFFF);

  pointLight1.position.set(10, 50, 130)
  scene.add(pointLight1);
  scene.add(ambientLight);


// Camera and Render
  camera.position.z = 1;
  camera.position.y = 1
  camera.position.x = 0
  cube.add(camera)
  function render() {
    requestAnimationFrame( render );


    villain.rotation.x += 0.01;
    villain.rotation.y += 0.01;

    spheres.forEach((sphere, index) => {
      sphere.position.x -= Math.sin(bulletYAngles[index])
      sphere.position.z -= Math.cos(bulletYAngles[index])
    })
    detectCollision()
    renderer.render( scene, camera );
  }
  render();

// Key Listeners for controls
  window.onkeydown = (e) => {
    let key = e.keyCode ? e.keyCode : e.which;

    if (key === 37) {
      cube.rotation.y += 0.1
    } else if (key === 38) {
      // if(cube.translateZ(-0.3))
      if (Math.abs(cube.position.x) <= 22) {
        cube.position.x -= Math.sin(cube.rotation.y)/2
      } else if (cube.position.x >= 22) {
        cube.position.x = 21.999;
      } else if (cube.position.x <= 22) {
        cube.position.x = -21.999;
      }

      if (Math.abs(cube.position.z) <= 22) {
        cube.position.z -= Math.cos(cube.rotation.y)/2
      } else if (cube.position.z >= 22) {
        cube.position.z = 21.999;
      } else if (cube.position.z <= 22) {
        cube.position.z = -21.999;
      }

      // cube.position.x -= Math.sin(cube.rotation.y)/2
      // cube.position.z -= Math.cos(cube.rotation.y)/2
      // cube.translateZ(-0.3)
    } else if (key === 39){
      cube.rotation.y -= 0.1
    } else if (key === 40){
      if (Math.abs(cube.position.x) < 22) {
        cube.position.x += Math.sin(cube.rotation.y)/2
      } else if (cube.position.x >= 22) {
        cube.position.x = 21.999;
      } else if (cube.position.x <= -22) {
        cube.position.x = -21.999;
      }

      if (Math.abs(cube.position.z) < 22) {
        cube.position.z += Math.cos(cube.rotation.y)/2
      } else if (cube.position.z >= 22) {
        cube.position.z = 21.999;
      } else if (cube.position.z <= -22) {
        cube.position.z = -21.999;
      }
      // cube.translateZ(0.3)
    }
    if (key === 32){
      let sphere = new THREE.Mesh(sphereGeometry, bulletMaterial);
      sphere.position.set(cube.position.x, cube.position.y, cube.position.z)
      sphere.rotation.set(3.28, 3.28, 3.28)

      scene.add(sphere)
      // sphere.rotation.set(cube.rotation.x, cube.rotation.y, cube.rotation.z)
      spheres.push(sphere)
      collidableMeshList.push(sphere)

      bulletYAngles.push(cube.rotation.y)
    }
  }

const mapWidth = 50
const mapHeight = 5

function setupMap (){
  let map = [ // 1  2  3  4  5  6  7  8  9 10
             [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 0
             [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 1
             [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 2
             [1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1], // 3
             [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1], // 4
             [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1], // 5
             [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1], // 6
             [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 7
             [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 8
             [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 9
             [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1] // 10
           ]
  let wallCube = new THREE.CubeGeometry(5, mapHeight, 5);

  let wallMaterial = new THREE.MeshLambertMaterial({color: 0x663300})
  // [
  //   null,
  //   new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('assets/images/wall.jpg')})
  // ]

  for(let i = 0; i < map.length; i++) {
    for(let j = 0, length = map[i].length; j < length; j++){
      if  (map[i][j]){
        let wall = new THREE.Mesh(wallCube, wallMaterial);
        wall.position.set((i - 5) * 5, 2, (j - 5) * 5)
        scene.add(wall)
        // collidableMeshList.push(wall)
      }
    }
  }

  let floor = new THREE.Mesh(
    new THREE.CubeGeometry(mapWidth, 0.0001, mapWidth),
    new THREE.MeshLambertMaterial({color: 0x336633})
  )
  floor.position.y = -0.5
  scene.add(floor)

  let ceiling = new THREE.Mesh(
    new THREE.CubeGeometry(mapWidth, 0.0001, mapWidth),
    new THREE.MeshLambertMaterial({color: 0x99CCCC})
  )
  ceiling.position.y = 4
  scene.add(ceiling)

}

setupMap()

function detectCollision(){
  for (var vertexIndex = 0; vertexIndex < villain.geometry.vertices.length; vertexIndex++)
  {
    var localVertex = villain.geometry.vertices[vertexIndex].clone();
    // var globalVertex = villain.matrix.multiplyVector3(localVertex);
    var globalVertex = localVertex.applyMatrix4(villain.matrix);
    var directionVector = globalVertex.sub( villain.position );

    var ray = new THREE.Raycaster( villain.position, directionVector.clone().normalize() );
    var collisionResults = ray.intersectObjects( collidableMeshList );
    if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() )
    {
      // a collision occurred... do something...
      console.log("hit!!!");
    }
  }
}







window.Scene = scene
window.Cube = cube
