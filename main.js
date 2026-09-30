const ROOM_WIDTH = 20;
const ROOM_DEPTH = 20;
const ROOM_HEIGHT = 10;
const HALF_WIDTH = ROOM_WIDTH / 2;
const HALF_DEPTH = ROOM_DEPTH / 2;

const COLORS = {
  floor: 0x8a7461,
  wallBack: 0xcfe3e8,
  wallLeft: 0xbfd8de,
  ceiling: 0xe9f2f4,
  woodDark: 0x5c3a21,
  woodMedium: 0x7a4e2d,
  woodLight: 0x9c6b3f,
  deskLegs: 0x2b2b2b,
  monitorBody: 0x1c1c1c,
  monitorScreen: 0x2a6fb0,
  chairSeat: 0x222222,
  bedFrame: 0x5c3a21,
  mattress: 0x3b4bb8,
  blanket: 0x263a8c,
  pillow: 0xf2f2f2,
  rug: 0x2a9d8f,
  windowFrame: 0xf5f5f5,
  glass: 0xaee3f5,
  lampShade: 0x4a4a4a,
  lampBase: 0x2f2f2f,
  fanBlade: 0x6b4a2f,
  fanMotor: 0x333333,
  potPlant: 0x7c3f22,
  leaf: 0x3f7a3f,
  shelfWood: 0x6b4226,
  binBody: 0x2b2b2b,
  frameWood: 0x4a2e18,
  pictureSky: 0xa9d8f0,
  pictureGrass: 0x6fa85c,
  pictureHouse: 0xc98a4b,
};

const canvas = document.getElementById("scene-canvas");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1b1f24);
scene.fog = new THREE.Fog(0x1b1f24, 30, 55);

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  200
);
camera.position.set(16, 14, 18);
camera.lookAt(0, 3, 0);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0, 3, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 8;
controls.maxDistance = 32;
controls.maxPolarAngle = Math.PI / 2.05;
controls.update();

function createLights() {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xfff2d6, 0.9);
  sunLight.position.set(8, 14, 6);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(2048, 2048);
  sunLight.shadow.camera.left = -15;
  sunLight.shadow.camera.right = 15;
  sunLight.shadow.camera.top = 15;
  sunLight.shadow.camera.bottom = -15;
  sunLight.shadow.camera.far = 40;
  scene.add(sunLight);

  const lampLight = new THREE.PointLight(0xffcf8a, 0.8, 10, 2);
  lampLight.position.set(6.2, 4.4, -7.2);
  lampLight.castShadow = true;
  scene.add(lampLight);

  const monitorGlow = new THREE.PointLight(0x6fb7ff, 0.35, 6, 2);
  monitorGlow.position.set(-5, 4.5, -8.5);
  scene.add(monitorGlow);
}

function createFloor() {
  const floorGeometry = new THREE.PlaneGeometry(ROOM_WIDTH, ROOM_DEPTH);
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: COLORS.floor,
    roughness: 0.9,
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
}

function createCeiling() {
  const ceilingGeometry = new THREE.PlaneGeometry(ROOM_WIDTH, ROOM_DEPTH);
  const ceilingMaterial = new THREE.MeshStandardMaterial({
    color: COLORS.ceiling,
    roughness: 1,
    side: THREE.DoubleSide,
  });
  const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = ROOM_HEIGHT;
  scene.add(ceiling);
}

function createWalls() {
  const backWallGeometry = new THREE.PlaneGeometry(ROOM_WIDTH, ROOM_HEIGHT);
  const backWallMaterial = new THREE.MeshStandardMaterial({
    color: COLORS.wallBack,
    roughness: 0.95,
  });
  const backWall = new THREE.Mesh(backWallGeometry, backWallMaterial);
  backWall.position.set(0, ROOM_HEIGHT / 2, -HALF_DEPTH);
  backWall.receiveShadow = true;
  scene.add(backWall);

  const leftWallGeometry = new THREE.PlaneGeometry(ROOM_DEPTH, ROOM_HEIGHT);
  const leftWallMaterial = new THREE.MeshStandardMaterial({
    color: COLORS.wallLeft,
    roughness: 0.95,
  });
  const leftWall = new THREE.Mesh(leftWallGeometry, leftWallMaterial);
  leftWall.position.set(-HALF_WIDTH, ROOM_HEIGHT / 2, 0);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.receiveShadow = true;
  scene.add(leftWall);

  const baseboardMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

  const backBaseboard = new THREE.Mesh(
    new THREE.BoxGeometry(ROOM_WIDTH, 0.4, 0.15),
    baseboardMaterial
  );
  backBaseboard.position.set(0, 0.2, -HALF_DEPTH + 0.08);
  scene.add(backBaseboard);

  const leftBaseboard = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.4, ROOM_DEPTH),
    baseboardMaterial
  );
  leftBaseboard.position.set(-HALF_WIDTH + 0.08, 0.2, 0);
  scene.add(leftBaseboard);
}

function createWindow(positionX) {
  const windowGroup = new THREE.Group();

  const frameMaterial = new THREE.MeshStandardMaterial({
    color: COLORS.windowFrame,
    roughness: 0.6,
  });
  const glassMaterial = new THREE.MeshStandardMaterial({
    color: COLORS.glass,
    roughness: 0.1,
    metalness: 0.1,
    transparent: true,
    opacity: 0.55,
  });

  const outerFrame = new THREE.Mesh(
    new THREE.BoxGeometry(5.2, 3.7, 0.2),
    frameMaterial
  );
  windowGroup.add(outerFrame);

  const glass = new THREE.Mesh(new THREE.BoxGeometry(4.8, 3.3, 0.06), glassMaterial);
  glass.position.z = 0.08;
  windowGroup.add(glass);

  const verticalMullion = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 3.5, 0.1),
    frameMaterial
  );
  verticalMullion.position.z = 0.1;
  windowGroup.add(verticalMullion);

  const horizontalMullion = new THREE.Mesh(
    new THREE.BoxGeometry(4.8, 0.12, 0.1),
    frameMaterial
  );
  horizontalMullion.position.z = 0.1;
  windowGroup.add(horizontalMullion);

  // Small sill
  const sill = new THREE.Mesh(
    new THREE.BoxGeometry(5.6, 0.15, 0.5),
    frameMaterial
  );
  sill.position.set(0, -1.95, 0.25);
  windowGroup.add(sill);

  windowGroup.position.set(positionX, 6, -HALF_DEPTH + 0.05);
  scene.add(windowGroup);
}

function createDesk(positionX, positionZ) {
  const deskGroup = new THREE.Group();

  const topMaterial = new THREE.MeshStandardMaterial({
    color: COLORS.woodMedium,
    roughness: 0.6,
  });
  const legMaterial = new THREE.MeshStandardMaterial({
    color: COLORS.deskLegs,
    roughness: 0.5,
    metalness: 0.3,
  });

  const deskTop = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.2, 2.4), topMaterial);
  deskTop.position.y = 3;
  deskTop.castShadow = true;
  deskTop.receiveShadow = true;
  deskGroup.add(deskTop);

  const legGeometry = new THREE.BoxGeometry(0.15, 3, 0.15);
  const legOffsets = [
    [-2.6, -1.05],
    [2.6, -1.05],
    [-2.6, 1.05],
    [2.6, 1.05],
  ];
  legOffsets.forEach(([x, z]) => {
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    leg.position.set(x, 1.5, z);
    leg.castShadow = true;
    deskGroup.add(leg);
  });

  deskGroup.position.set(positionX, 0, positionZ);
  scene.add(deskGroup);

  createMonitor(positionX - 0.3, 3.1, positionZ - 0.4);
  createKeyboard(positionX - 0.3, 3.11, positionZ + 0.5);
}

function createMonitor(positionX, positionY, positionZ) {
  const monitorGroup = new THREE.Group();

  const bodyMaterial = new THREE.MeshStandardMaterial({ color: COLORS.monitorBody });
  const screenMaterial = new THREE.MeshStandardMaterial({
    color: COLORS.monitorScreen,
    emissive: 0x1f4d78,
    emissiveIntensity: 0.6,
  });

  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, 0.4, 12), bodyMaterial);
  stand.position.y = 0.2;
  monitorGroup.add(stand);

  const standBase = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.05, 20), bodyMaterial);
  standBase.position.y = 0.02;
  monitorGroup.add(standBase);

  const screenFrame = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1, 0.08), bodyMaterial);
  screenFrame.position.y = 0.9;
  monitorGroup.add(screenFrame);

  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.44, 0.84), screenMaterial);
  screen.position.set(0, 0.9, 0.045);
  monitorGroup.add(screen);

  monitorGroup.traverse((child) => {
    if (child.isMesh) child.castShadow = true;
  });

  monitorGroup.position.set(positionX, positionY, positionZ);
  scene.add(monitorGroup);
}

function createKeyboard(positionX, positionY, positionZ) {
  const keyboard = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.06, 0.45),
    new THREE.MeshStandardMaterial({ color: 0xe4e4e4 })
  );
  keyboard.position.set(positionX, positionY, positionZ);
  keyboard.castShadow = true;
  scene.add(keyboard);

  const mouse = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.08, 0.4),
    new THREE.MeshStandardMaterial({ color: 0xe4e4e4 })
  );
  mouse.position.set(positionX + 0.9, positionY, positionZ);
  mouse.castShadow = true;
  scene.add(mouse);
}

function createChair(positionX, positionZ) {
  const chairGroup = new THREE.Group();

  const seatMaterial = new THREE.MeshStandardMaterial({ color: COLORS.chairSeat });
  const metalMaterial = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa,
    metalness: 0.7,
    roughness: 0.3,
  });

  const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.15, 24), seatMaterial);
  seat.position.y = 1.5;
  chairGroup.add(seat);

  const backrest = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 0.12), seatMaterial);
  backrest.position.set(0, 2.25, 0.55);
  chairGroup.add(backrest);

  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.3, 12), metalMaterial);
  post.position.y = 0.85;
  chairGroup.add(post);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.08, 24), metalMaterial);
  base.position.y = 0.18;
  chairGroup.add(base);

  chairGroup.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  chairGroup.position.set(positionX, 0, positionZ);
  scene.add(chairGroup);
}

function createBed(positionX, positionZ) {
  const bedGroup = new THREE.Group();

  const frameMaterial = new THREE.MeshStandardMaterial({
    color: COLORS.bedFrame,
    roughness: 0.6,
  });
  const mattressMaterial = new THREE.MeshStandardMaterial({ color: COLORS.mattress });
  const blanketMaterial = new THREE.MeshStandardMaterial({ color: COLORS.blanket });
  const pillowMaterial = new THREE.MeshStandardMaterial({ color: COLORS.pillow });

  const base = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.5, 4.5), frameMaterial);
  base.position.y = 0.9;
  bedGroup.add(base);

  const legGeometry = new THREE.BoxGeometry(0.3, 0.7, 0.3);
  const legOffsets = [
    [-3, -2],
    [3, -2],
    [-3, 2],
    [3, 2],
  ];
  legOffsets.forEach(([x, z]) => {
    const leg = new THREE.Mesh(legGeometry, frameMaterial);
    leg.position.set(x, 0.35, z);
    bedGroup.add(leg);
  });

  const mattress = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.6, 4.2), mattressMaterial);
  mattress.position.y = 1.45;
  bedGroup.add(mattress);

  const headboard = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3, 4.6), frameMaterial);
  headboard.position.set(-3.2, 2.3, 0);
  bedGroup.add(headboard);

  const blanket = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.35, 4), blanketMaterial);
  blanket.position.set(2.3, 1.95, 0);
  bedGroup.add(blanket);

  const sheet = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.15, 4.1), blanketMaterial);
  sheet.position.set(0, 1.85, 0);
  bedGroup.add(sheet);

  const pillow = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.35, 1.6), pillowMaterial);
  pillow.position.set(-2.5, 2, -1.2);
  pillow.rotation.y = 0.15;
  bedGroup.add(pillow);

  const pillowTwo = pillow.clone();
  pillowTwo.position.z = 1.2;
  pillowTwo.rotation.y = -0.15;
  bedGroup.add(pillowTwo);

  bedGroup.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  bedGroup.position.set(positionX, 0, positionZ);
  scene.add(bedGroup);
}

function createNightstand(positionX, positionZ) {
  const nightstandGroup = new THREE.Group();

  const woodMaterial = new THREE.MeshStandardMaterial({ color: COLORS.woodDark });

  const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.6, 1.4), woodMaterial);
  body.position.y = 0.8;
  nightstandGroup.add(body);

  const drawerHandle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 0.35, 8),
    new THREE.MeshStandardMaterial({ color: 0xd8b878, metalness: 0.6 })
  );
  drawerHandle.rotation.z = Math.PI / 2;
  drawerHandle.position.set(0, 1.1, 0.72);
  nightstandGroup.add(drawerHandle);

  nightstandGroup.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  nightstandGroup.position.set(positionX, 0, positionZ);
  scene.add(nightstandGroup);

  createLamp(positionX, 1.6, positionZ);
}

function createLamp(positionX, positionY, positionZ) {
  const lampGroup = new THREE.Group();

  const baseMaterial = new THREE.MeshStandardMaterial({ color: COLORS.lampBase });
  const shadeMaterial = new THREE.MeshStandardMaterial({
    color: COLORS.lampShade,
    emissive: 0xffcf8a,
    emissiveIntensity: 0.3,
  });

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.08, 16), baseMaterial);
  lampGroup.add(base);

  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 10), baseMaterial);
  pole.position.y = 0.29;
  lampGroup.add(pole);

  const shade = new THREE.Mesh(
    new THREE.ConeGeometry(0.32, 0.4, 16, 1, true),
    shadeMaterial
  );
  shade.position.y = 0.65;
  lampGroup.add(shade);

  lampGroup.traverse((child) => {
    if (child.isMesh) child.castShadow = true;
  });

  lampGroup.position.set(positionX, positionY, positionZ);
  scene.add(lampGroup);
}

let ceilingFanBlades;

function createCeilingFan(positionX, positionZ) {
  const fanGroup = new THREE.Group();

  const mount = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.6, 10),
    new THREE.MeshStandardMaterial({ color: COLORS.fanMotor })
  );
  mount.position.y = 0.3;
  fanGroup.add(mount);

  const motor = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.3, 0.3, 20),
    new THREE.MeshStandardMaterial({ color: COLORS.fanMotor })
  );
  motor.position.y = -0.05;
  fanGroup.add(motor);

  const bladesGroup = new THREE.Group();
  const bladeMaterial = new THREE.MeshStandardMaterial({ color: COLORS.fanBlade });
  const bladeCount = 4;
  for (let i = 0; i < bladeCount; i++) {
    const blade = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.05, 0.35), bladeMaterial);
    blade.position.x = 1;
    const pivot = new THREE.Group();
    pivot.add(blade);
    pivot.rotation.y = (i * Math.PI * 2) / bladeCount;
    bladesGroup.add(pivot);
  }
  bladesGroup.position.y = -0.1;
  fanGroup.add(bladesGroup);
  ceilingFanBlades = bladesGroup;

  fanGroup.traverse((child) => {
    if (child.isMesh) child.castShadow = true;
  });

  fanGroup.position.set(positionX, ROOM_HEIGHT - 0.5, positionZ);
  scene.add(fanGroup);
}


function createRug(positionX, positionZ) {
  const rug = new THREE.Mesh(
    new THREE.CylinderGeometry(2.6, 2.6, 0.05, 32),
    new THREE.MeshStandardMaterial({ color: COLORS.rug, roughness: 1 })
  );
  rug.position.set(positionX, 0.03, positionZ);
  rug.receiveShadow = true;
  scene.add(rug);
}

function createWallArt(positionX, positionY) {
  const artGroup = new THREE.Group();

  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 1.8, 0.1),
    new THREE.MeshStandardMaterial({ color: COLORS.frameWood })
  );
  artGroup.add(frame);

  const sky = new THREE.Mesh(
    new THREE.PlaneGeometry(2.3, 1.5),
    new THREE.MeshStandardMaterial({ color: COLORS.pictureSky })
  );
  sky.position.z = 0.06;
  artGroup.add(sky);

  const grass = new THREE.Mesh(
    new THREE.PlaneGeometry(2.3, 0.5),
    new THREE.MeshStandardMaterial({ color: COLORS.pictureGrass })
  );
  grass.position.set(0, -0.5, 0.07);
  artGroup.add(grass);

  const house = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.5, 0.02),
    new THREE.MeshStandardMaterial({ color: COLORS.pictureHouse })
  );
  house.position.set(-0.4, -0.15, 0.08);
  artGroup.add(house);

  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(0.55, 0.35, 4),
    new THREE.MeshStandardMaterial({ color: 0x8a4a2b })
  );
  roof.rotation.y = Math.PI / 4;
  roof.position.set(-0.4, 0.25, 0.08);
  artGroup.add(roof);

  artGroup.position.set(positionX, positionY, -HALF_DEPTH + 0.1);
  scene.add(artGroup);
}

function createTrashBin(positionX, positionZ) {
  const bin = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.3, 0.7, 16, 1, true),
    new THREE.MeshStandardMaterial({
      color: COLORS.binBody,
      side: THREE.DoubleSide,
    })
  );
  bin.position.set(positionX, 0.35, positionZ);
  bin.castShadow = true;
  scene.add(bin);
}
function createBookshelf(positionX, positionZ) {
  const shelfGroup = new THREE.Group();
  const woodMaterial = new THREE.MeshStandardMaterial({ color: COLORS.shelfWood });

  const frame = new THREE.Mesh(new THREE.BoxGeometry(1.6, 4, 0.5), woodMaterial);
  frame.position.y = 2;
  shelfGroup.add(frame);

  const shelfHeights = [0.6, 1.6, 2.6, 3.6];
  const bookColors = [0xd94f4f, 0x4f8fd9, 0xe0c34f, 0x4fd98a, 0x9a4fd9];

  shelfHeights.forEach((y) => {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.06, 0.45), woodMaterial);
    shelf.position.y = y;
    shelfGroup.add(shelf);
  });

  for (let i = 0; i < 5; i++) {
    const book = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.5, 0.35),
      new THREE.MeshStandardMaterial({ color: bookColors[i % bookColors.length] })
    );
    book.position.set(-0.55 + i * 0.18, 1.9, 0);
    shelfGroup.add(book);
  }

  shelfGroup.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  shelfGroup.position.set(positionX, 0, positionZ);
  shelfGroup.rotation.y = Math.PI / 2;
  scene.add(shelfGroup);
}

function createPottedPlant(positionX, positionZ) {
  const plantGroup = new THREE.Group();

  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.25, 0.5, 16),
    new THREE.MeshStandardMaterial({ color: COLORS.potPlant })
  );
  pot.position.y = 0.25;
  plantGroup.add(pot);

  const foliageMaterial = new THREE.MeshStandardMaterial({ color: COLORS.leaf });
  const foliagePositions = [
    [0, 1.1, 0, 0.5],
    [0.25, 0.9, 0.15, 0.35],
    [-0.25, 0.95, -0.1, 0.35],
  ];
  foliagePositions.forEach(([x, y, z, radius]) => {
    const foliage = new THREE.Mesh(new THREE.SphereGeometry(radius, 12, 12), foliageMaterial);
    foliage.position.set(x, y, z);
    plantGroup.add(foliage);
  });

  plantGroup.traverse((child) => {
    if (child.isMesh) child.castShadow = true;
  });

  plantGroup.position.set(positionX, 0, positionZ);
  scene.add(plantGroup);
}

function buildRoom() {
  createLights();
  createFloor();
  createCeiling();
  createWalls();

  createWindow(4.5);

  createDesk(-5, -7.5);
  createChair(-5, -5);
  createRug(-5, -5.5);

  createBed(3, -7.2);
  createNightstand(7, -7.5);

  createCeilingFan(-5, -7.5);
  createWallArt(-5, 7);

  createTrashBin(-2, -6.5);
  createBookshelf(9.3, 1);
  createPottedPlant(-9, 8.5);
}

buildRoom();

function animate() {
  requestAnimationFrame(animate);

  if (ceilingFanBlades) {
    ceilingFanBlades.rotation.y += 0.03;
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize);