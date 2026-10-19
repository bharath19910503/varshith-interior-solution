function generateDesign() {
  let h = parseFloat(document.getElementById("height").value) || 10;
  let w = parseFloat(document.getElementById("width").value) || 10;
  let l = parseFloat(document.getElementById("length").value) || 10;

  document.getElementById("canvas").innerHTML = "";

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 800/600, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(800, 600);
  document.getElementById("canvas").appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  // Lighting
  const light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(10, 20, 10);
  scene.add(light);

  // Room box
  const roomGeometry = new THREE.BoxGeometry(w, h, l);
  const roomMaterial = new THREE.MeshPhongMaterial({color: 0xf0f0f0, side: THREE.BackSide});
  const room = new THREE.Mesh(roomGeometry, roomMaterial);
  scene.add(room);

  // --- Decision Logic ---
  // Kitchen: straight if width < length, L-shaped if width >= length
  if (w < l) {
    createStraightKitchen(scene, w, h, l);
  } else {
    createLShapedKitchen(scene, w, h, l);
  }

  // Bedroom: single bed if width < 12, double bed otherwise
  if (w < 12) {
    createSingleBed(scene, w, h, l);
  } else {
    createDoubleBed(scene, w, h, l);
  }

  // TV Unit: wall-mounted if height > 8, stand otherwise
  if (h > 8) {
    createWallTV(scene, w, h, l);
  } else {
    createStandTV(scene, w, h, l);
  }

  camera.position.z = Math.max(w, l) * 1.2;

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

// --- Procedural Furniture Functions ---
function createStraightKitchen(scene, w, h, l) {
  const geom = new THREE.BoxGeometry(w/3, h/4, l/10);
  const mat = new THREE.MeshPhongMaterial({color: 0xffcc99});
  const kitchen = new THREE.Mesh(geom, mat);
  kitchen.position.set(-w/4, -h/2 + h/8, -l/2 + l/10);
  scene.add(kitchen);
}

function createLShapedKitchen(scene, w, h, l) {
  const mat = new THREE.MeshPhongMaterial({color: 0xffcc99});
  const part1 = new THREE.Mesh(new THREE.BoxGeometry(w/3, h/4, l/10), mat);
  part1.position.set(-w/4, -h/2 + h/8, -l/2 + l/10);
  scene.add(part1);

  const part2 = new THREE.Mesh(new THREE.BoxGeometry(w/10, h/4, l/3), mat);
  part2.position.set(-w/2 + w/10, -h/2 + h/8, -l/4);
  scene.add(part2);
}

function createSingleBed(scene, w, h, l) {
  const mat = new THREE.MeshPhongMaterial({color: 0x9999ff});
  const bed = new THREE.Mesh(new THREE.BoxGeometry(w/5, h/12, l/5), mat);
  bed.position.set(w/4, -h/2 + h/24, -l/4);
  scene.add(bed);
}

function createDoubleBed(scene, w, h, l) {
  const mat = new THREE.MeshPhongMaterial({color: 0x9999ff});
  const bed = new THREE.Mesh(new THREE.BoxGeometry(w/3, h/12, l/3), mat);
  bed.position.set(w/4, -h/2 + h/24, -l/4);
  scene.add(bed);

  const headboard = new THREE.Mesh(new THREE.BoxGeometry(w/3, h/8, 0.2), new THREE.MeshPhongMaterial({color: 0x6666ff}));
  headboard.position.set(w/4, -h/2 + h/8, -l/2 + 0.2);
  scene.add(headboard);
}

function createWallTV(scene, w, h, l) {
  const tv = new THREE.Mesh(new THREE.BoxGeometry(w/6, h/6, 0.2), new THREE.MeshPhongMaterial({color: 0x000000}));
  tv.position.set(0, 0, l/2 - 0.2);
  scene.add(tv);
}

function createStandTV(scene, w, h, l) {
  const stand = new THREE.Mesh(new THREE.BoxGeometry(w/8, h/12, l/20), new THREE.MeshPhongMaterial({color: 0x333333}));
  stand.position.set(0, -h/2 + h/24, l/4);
  scene.add(stand);

  const tv = new THREE.Mesh(new THREE.BoxGeometry(w/8, h/8, 0.2), new THREE.MeshPhongMaterial({color: 0x000000}));
  tv.position.set(0, -h/2 + h/6, l/4);
  scene.add(tv);
}
