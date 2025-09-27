function addRow() {
  const tbody = document.getElementById("invoiceBody");
  const rowCount = tbody.rows.length + 1;
  const row = tbody.insertRow();
  row.innerHTML = `
    <td>${rowCount}</td>
    <td><input type="text"></td>
    <td><input type="text"></td>
    <td><input type="number" class="price"></td>
  `;
}

function calculateTotal() {
  let total = 0;
  document.querySelectorAll(".price").forEach(input => {
    total += parseFloat(input.value) || 0;
  });
  const gst = total * 0.18;
  const final = total + gst;

  document.getElementById("totalAmount").textContent = total.toFixed(2);
  document.getElementById("gstAmount").textContent = gst.toFixed(2);
  document.getElementById("finalAmount").textContent = final.toFixed(2);
}

function loadInvoice(input) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const data = JSON.parse(e.target.result);
    const tbody = document.getElementById("invoiceBody");
    tbody.innerHTML = "";
    data.forEach((item, i) => {
      const row = tbody.insertRow();
      row.innerHTML = `
        <td>${i + 1}</td>
        <td><input type="text" value="${item.name}"></td>
        <td><input type="text" value="${item.material}"></td>
        <td><input type="number" class="price" value="${item.price}"></td>
      `;
    });
    calculateTotal();
  };
  reader.readAsText(input.files[0]);
}

function downloadInvoice() {
  const rows = document.querySelectorAll("#invoiceBody tr");
  const data = Array.from(rows).map(row => {
    const inputs = row.querySelectorAll("input");
    return {
      name: inputs[0].value,
      material: inputs[1].value,
      price: parseFloat(inputs[2].value)
    };
  });
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "invoice.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Basic 3D Viewer with Walls
let scene, camera, renderer;
function initThree() {
  const canvas = document.getElementById("threeCanvas");
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  camera.position.z = 5;

  const light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(10, 10, 10);
  scene.add(light);

  const wallGeometry = new THREE.BoxGeometry(5, 3, 0.2);
  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xa0a0a0 });
  const wall = new THREE.Mesh(wallGeometry, wallMaterial);
  scene.add(wall);

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

initThree();
