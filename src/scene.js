import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

export function createScene(stage) {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, window.innerWidth < 700 ? 1.5 : 2),
  );
  renderer.setClearColor(0xf5f7fb, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.22;
  renderer.domElement.setAttribute("aria-hidden", "true");
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-4.7, 4.7, 3.5, -3.5, 0.1, 60);
  camera.position.set(7.8, 6.4, 10);
  camera.lookAt(0, 1.1, 0);
  const world = new THREE.Group();
  scene.add(world);
  world.rotation.y = -0.12;
  scene.add(new THREE.HemisphereLight(0xffffff, 0x7487a8, 2.2));
  const key = new THREE.DirectionalLight(0xffffff, 4.2);
  key.position.set(-3, 8, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, {
    left: -5,
    right: 5,
    top: 5,
    bottom: -5,
    near: 0.5,
    far: 20,
  });
  key.shadow.normalBias = 0.025;
  key.shadow.bias = -0.0002;
  key.shadow.radius = 3;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xb6cfff, 2.0);
  fill.position.set(6, 3, -5);
  scene.add(fill);
  const materials = {};
  const textures = [];
  const geometries = new Map();
  function material(name, color, roughness = 0.5, metalness = 0.05) {
    materials[name] = new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness,
    });
    return materials[name];
  }
  material("white", 0xf9fbff, 0.35);
  material("plate", 0xdbe5f5, 0.45);
  material("edge", 0xa4b9d9, 0.4, 0.25);
  material("navy", 0x263e63, 0.3, 0.2);
  material("blue", 0x3b70d5, 0.35, 0.1);
  material("blueLight", 0x99b8ef, 0.4);
  material("glass", 0xb8d4f2, 0.19, 0.2);
  material("silver", 0xa6b5cc, 0.28, 0.65);
  material("parcel", 0xc9d7e9, 0.7);
  material("tape", 0x7c98c5, 0.8);
  material("green", 0x7f9d87, 0.9);
  function box(parent, w, h, d, x, y, z, mat = "white", radius = 0.06) {
    const cacheKey = [w, h, d, radius].join(":");
    if (!geometries.has(cacheKey))
      geometries.set(
        cacheKey,
        new RoundedBoxGeometry(
          w,
          h,
          d,
          3,
          Math.min(radius, w / 3, h / 3, d / 3),
        ),
      );
    const mesh = new THREE.Mesh(
      geometries.get(cacheKey),
      typeof mat === "string" ? materials[mat] : mat,
    );
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function cylinder(parent, rt, rb, h, x, y, z, mat) {
    const geometry = new THREE.CylinderGeometry(rt, rb, h, 24);
    geometries.set(geometry.uuid, geometry);
    const mesh = new THREE.Mesh(geometry, materials[mat]);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function texture(width, height, draw) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    draw(ctx, width, height);
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    textures.push(map);
    return map;
  }
  function panel(parent, w, h, x, y, z, map) {
    const geometry = new THREE.PlaneGeometry(w, h);
    geometries.set(geometry.uuid, geometry);
    const mat = new THREE.MeshBasicMaterial({ map, toneMapped: false });
    materials[mat.uuid] = mat;
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  }
  const rect = (ctx, x, y, w, h, color, r = 5) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
  };
  const screenMap = texture(1000, 610, (ctx, w, h) => {
    ctx.fillStyle = "#f7f9fc";
    ctx.fillRect(0, 0, w, h);
    rect(ctx, 0, 0, 178, h, "#eaf0f8", 0);
    ctx.fillStyle = "#29466d";
    ctx.font = "bold 42px Arial";
    ctx.fillText("seller", 26, 65);
    ["İş sahəsi", "Məhsullar", "Satışlar", "Anbar", "Maliyyə"].forEach(
      (text, i) => {
        if (!i) rect(ctx, 15, 110 + i * 61, 148, 43, "#d8e4f7");
        ctx.fillStyle = i ? "#7b8b9f" : "#3764ae";
        ctx.font = "20px Arial";
        ctx.fillText(text, 29, 139 + i * 61);
      },
    );
    ctx.fillStyle = "#203551";
    ctx.font = "bold 30px Arial";
    ctx.fillText("İş sahəsi", 213, 64);
    ctx.fillStyle = "#7e8fa4";
    ctx.font = "16px Arial";
    ctx.fillText("Bütün əməliyyatlar bir yerdə", 213, 92);
    ["Satış", "Anbar", "Maliyyə"].forEach((text, i) => {
      rect(ctx, 213 + i * 250, 120, 224, 99, i ? "#fff" : "#e0eafa");
      ctx.fillStyle = "#5c738f";
      ctx.font = "19px Arial";
      ctx.fillText(text, 232 + i * 250, 153);
      rect(ctx, 232 + i * 250, 176, 91, 10, i ? "#d8e2f0" : "#739bd9");
    });
    rect(ctx, 213, 245, 724, 310, "#fff");
    ctx.fillStyle = "#3a5577";
    ctx.font = "bold 19px Arial";
    ctx.fillText("Məhsullar və hərəkətlər", 236, 278);
    ["Masa lampası", "Keramika fincan", "Masa aksesuarı", "Ofis dəsti"].forEach(
      (text, i) => {
        const y = 316 + i * 57;
        rect(ctx, 237, y, 31, 31, i % 2 ? "#d1dccd" : "#adc7ee");
        ctx.fillStyle = "#61758d";
        ctx.font = "18px Arial";
        ctx.fillText(text, 285, y + 23);
        rect(ctx, 638, y + 10, 81, 8, "#e2e8f1");
        rect(ctx, 810, y + 6, 87, 20, "#edf3ef");
      },
    );
  });

  // A single platform physically connects management, storefront, and POS.
  box(world, 6.25, 0.25, 4.5, 0, 0.07, 0, "edge", 0.2);
  box(world, 6.3, 0.19, 4.54, 0, 0.26, 0, "plate", 0.2);
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.ShadowMaterial({ opacity: 0.12 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.07;
  ground.receiveShadow = true;
  scene.add(ground);
  geometries.set(ground.geometry.uuid, ground.geometry);
  materials[ground.material.uuid] = ground.material;

  const desktop = new THREE.Group();
  world.add(desktop);
  desktop.position.set(-0.35, 0.35, -0.75);
  box(desktop, 1.4, 0.12, 0.9, 0, 0.08, 0.14, "silver");
  box(desktop, 0.32, 0.78, 0.22, 0, 0.46, -0.06, "silver");
  const screen = new THREE.Group();
  desktop.add(screen);
  screen.position.set(0, 1.95, 0);
  screen.rotation.x = -0.06;
  box(screen, 3.65, 2.35, 0.19, 0, 0, 0, "navy", 0.13);
  box(screen, 3.56, 2.26, 0.1, 0, 0.015, 0.09, "white", 0.1);
  panel(screen, 3.36, 2.05, 0, 0.055, 0.147, screenMap);
  cylinder(screen, 0.035, 0.035, 0.009, 0, -1.075, 0.15, "silver").rotation.x =
    Math.PI / 2;
  box(desktop, 1.95, 0.085, 0.58, 0.2, 0.075, 1.04, "white", 0.06);
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 13; col++)
      box(
        desktop,
        0.105,
        0.014,
        0.08,
        -0.62 + col * 0.135,
        0.127,
        0.88 + row * 0.102,
        "plate",
        0.01,
      );
  }
  box(desktop, 0.36, 0.14, 0.49, 1.48, 0.13, 1.05, "white", 0.08);

  const store = new THREE.Group();
  world.add(store);
  store.position.set(-1.88, 0.37, 1.04);
  box(store, 1.48, 1.44, 1.14, 0, 0.74, 0, "white", 0.06);
  box(store, 1.29, 0.92, 0.06, 0, 0.63, 0.585, "glass", 0.025);
  box(store, 0.065, 0.99, 0.05, 0.14, 0.63, 0.63, "white", 0.015);
  box(store, 0.06, 0.24, 0.07, 0.28, 0.61, 0.69, "silver", 0.018);
  box(store, 1.75, 0.17, 1.48, 0, 1.52, 0.12, "white", 0.05);
  for (let i = 0; i < 8; i++) {
    box(
      store,
      0.214,
      0.1,
      0.71,
      -0.75 + i * 0.215,
      1.45,
      0.67,
      i % 2 ? "white" : "blue",
      0.03,
    ).rotation.x = 0.14;
    const roll = cylinder(
      store,
      0.108,
      0.108,
      0.216,
      -0.75 + i * 0.215,
      1.38,
      1.02,
      i % 2 ? "white" : "blue",
    );
    roll.rotation.z = Math.PI / 2;
  }
  const signMap = texture(480, 120, (ctx) => {
    ctx.fillStyle = "#fbfcfe";
    ctx.fillRect(0, 0, 480, 120);
    ctx.fillStyle = "#49678f";
    ctx.font = "bold 46px Arial";
    ctx.textAlign = "center";
    ctx.fillText("MAĞAZA", 240, 77);
  });
  panel(store, 1.08, 0.27, 0, 1.18, 0.622, signMap);
  box(store, 1.68, 0.1, 0.47, 0, 0.055, 0.68, "edge", 0.04);

  const pos = new THREE.Group();
  world.add(pos);
  pos.position.set(1.8, 0.4, 0.95);
  pos.rotation.y = -0.18;
  box(pos, 1.03, 0.13, 0.72, 0, 0.04, 0, "navy", 0.06);
  box(pos, 0.31, 0.68, 0.27, 0, 0.39, -0.1, "silver", 0.04).rotation.x = -0.15;
  const terminal = new THREE.Group();
  pos.add(terminal);
  terminal.position.set(0, 0.95, 0);
  terminal.rotation.x = -0.2;
  box(terminal, 1.41, 1.12, 0.15, 0, 0, 0, "navy", 0.09);
  const posMap = texture(480, 355, (ctx) => {
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, 480, 355);
    ctx.fillStyle = "#284362";
    ctx.font = "bold 34px Arial";
    ctx.fillText("seller", 25, 48);
    ctx.fillStyle = "#788fae";
    ctx.font = "18px Arial";
    ctx.fillText("POS", 394, 48);
    ["Məhsul seçin", "Səbət", "Ödəniş"].forEach((s, i) => {
      rect(ctx, 25, 79 + i * 65, 430, 49, i === 2 ? "#dce8fa" : "#eaf0f7");
      ctx.fillStyle = "#597392";
      ctx.font = "20px Arial";
      ctx.fillText(s, 43, 111 + i * 65);
    });
    rect(ctx, 25, 286, 430, 46, "#426bb4");
    ctx.fillStyle = "#fff";
    ctx.font = "18px Arial";
    ctx.fillText("Kassa əməliyyatları", 45, 316);
  });
  panel(terminal, 1.25, 0.93, 0, 0.02, 0.081, posMap);
  box(pos, 0.75, 0.48, 0.81, 0.8, 0.26, 0.31, "white", 0.06);
  box(pos, 0.61, 0.05, 0.055, 0.8, 0.44, 0.733, "navy", 0.01);
  const receiptMap = texture(160, 260, (ctx) => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, 160, 260);
    ctx.fillStyle = "#6581a2";
    ctx.font = "bold 22px Arial";
    ctx.textAlign = "center";
    ctx.fillText("seller", 80, 40);
    for (let i = 0; i < 6; i++)
      rect(ctx, 22, 69 + i * 23, i === 5 ? 70 : 116, 5, "#c2cede", 1);
  });
  const receipt = panel(pos, 0.49, 0.69, 0.8, 0.14, 0.769, receiptMap);
  receipt.rotation.x = -0.1;

  const parcels = new THREE.Group();
  world.add(parcels);
  parcels.position.set(2.15, 0.36, -1.22);
  function parcel(x, y, z, scale = 1) {
    box(
      parcels,
      0.77 * scale,
      0.73 * scale,
      0.78 * scale,
      x,
      y,
      z,
      "parcel",
      0.035,
    );
    box(
      parcels,
      0.17 * scale,
      0.012,
      0.79 * scale,
      x,
      y + 0.367 * scale,
      z,
      "tape",
      0.001,
    );
    box(
      parcels,
      0.17 * scale,
      0.73 * scale,
      0.009,
      x,
      y,
      z + 0.395 * scale,
      "tape",
      0.001,
    );
    box(
      parcels,
      0.25 * scale,
      0.15 * scale,
      0.01,
      x - 0.19 * scale,
      y + 0.07 * scale,
      z + 0.405 * scale,
      "white",
      0.001,
    );
  }
  parcel(0, 0.36, 0.12);
  parcel(-0.21, 1.04, 0.05, 0.85);
  parcel(-0.73, 0.28, 0.2, 0.74);
  cylinder(world, 0.19, 0.14, 0.31, -2.57, 0.53, -0.74, "white");
  for (let i = 0; i < 5; i++) {
    const geo = new THREE.SphereGeometry(0.13, 12, 8);
    geometries.set(geo.uuid, geo);
    const leaf = new THREE.Mesh(geo, materials.green);
    leaf.scale.set(0.7, 2.5, 0.6);
    leaf.position.set(
      -2.57 + Math.sin(i * 2) * 0.1,
      0.91,
      -0.74 + Math.cos(i * 2) * 0.08,
    );
    leaf.rotation.set(Math.cos(i) * 0.4, 0, Math.sin(i) * 0.4);
    world.add(leaf);
  }

  let visible = true,
    disposed = false,
    frame = 0,
    yaw = -0.12,
    pitch = 0;
  let selected = "all";
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const target = { yaw, pitch };
  const homes = { store: store.position.y, pos: pos.position.y };
  function draw() {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    const snap = motion.matches;
    yaw = snap ? target.yaw : THREE.MathUtils.lerp(yaw, target.yaw, 0.12);
    pitch = snap
      ? target.pitch
      : THREE.MathUtils.lerp(pitch, target.pitch, 0.12);
    world.rotation.y = yaw;
    world.rotation.x = pitch;
    for (const [name, group] of [
      ["store", store],
      ["pos", pos],
    ]) {
      const destination = homes[name] + (selected === name ? 0.22 : 0);
      group.position.y = snap
        ? destination
        : THREE.MathUtils.lerp(group.position.y, destination, 0.13);
    }
    renderer.render(scene, camera);
    const settling =
      Math.abs(yaw - target.yaw) +
      Math.abs(pitch - target.pitch) +
      Math.abs(
        store.position.y - homes.store - (selected === "store" ? 0.22 : 0),
      ) +
      Math.abs(pos.position.y - homes.pos - (selected === "pos" ? 0.22 : 0));
    if (!snap && settling > 0.0006) frame = requestAnimationFrame(draw);
  }
  function requestDraw() {
    if (!frame && !disposed) frame = requestAnimationFrame(draw);
  }
  function resize() {
    const { width, height } = stage.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    const aspect = width / height;
    const span = Math.max(6.1, 8.55 / aspect);
    camera.left = (-span * aspect) / 2;
    camera.right = (span * aspect) / 2;
    camera.top = span / 2;
    camera.bottom = -span / 2;
    camera.updateProjectionMatrix();
    requestDraw();
  }
  function onPointerMove(event) {
    if (motion.matches || !finePointer.matches) return;
    const rect = stage.getBoundingClientRect();
    target.yaw =
      -0.12 + ((event.clientX - rect.left) / rect.width - 0.5) * 0.24;
    target.pitch = ((event.clientY - rect.top) / rect.height - 0.5) * 0.065;
    requestDraw();
  }
  function reset() {
    target.yaw = -0.12;
    target.pitch = 0;
    requestDraw();
  }
  function onVisibility() {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else requestDraw();
  }
  function onMotion() {
    reset();
  }
  function onLost(event) {
    event.preventDefault();
    stage.classList.remove("is-ready");
    stage.dataset.renderMode = "fallback";
    cancelAnimationFrame(frame);
    frame = 0;
  }
  function onRestored() {
    stage.classList.add("is-ready");
    stage.dataset.renderMode = "webgl";
    requestDraw();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);
  const observer = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible) requestDraw();
    else {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  });
  observer.observe(stage);
  stage.addEventListener("pointermove", onPointerMove);
  stage.addEventListener("pointerleave", reset);
  document.addEventListener("visibilitychange", onVisibility);
  motion.addEventListener("change", onMotion);
  renderer.domElement.addEventListener("webglcontextlost", onLost);
  renderer.domElement.addEventListener("webglcontextrestored", onRestored);
  function dispose(event) {
    if (event?.persisted) return; // bfcache owns the still-live page.
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    resizeObserver.disconnect();
    stage.removeEventListener("pointermove", onPointerMove);
    stage.removeEventListener("pointerleave", reset);
    document.removeEventListener("visibilitychange", onVisibility);
    motion.removeEventListener("change", onMotion);
    window.removeEventListener("pagehide", dispose);
    textures.forEach((map) => map.dispose());
    geometries.forEach((geo) => geo.dispose());
    Object.values(materials).forEach((mat) => mat.dispose());
    renderer.dispose();
  }
  window.addEventListener("pagehide", dispose);
  resize();
  renderer.render(scene, camera);
  stage.classList.add("is-ready");
  stage.dataset.renderMode = "webgl";
  return {
    select(value) {
      selected = value;
      requestDraw();
    },
    reset,
    dispose,
  };
}
