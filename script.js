let table = document.getElementById("invoiceTable");
let totalSpan = document.getElementById("total");
let gstSpan = document.getElementById("gst");
let finalSpan = document.getElementById("final");

function addRow() {
    let row = table.insertRow();
    row.insertCell(0).innerHTML = '<input type="text">';
    row.insertCell(1).innerHTML = '<input type="text">';
    row.insertCell(2).innerHTML = '<input type="number" value="1" oninput="calculate()">';
    row.insertCell(3).innerHTML = '<input type="number" value="0" oninput="calculate()">';
}

function calculate() {
    let total = 0;
    for (let i = 1; i < table.rows.length; i++) {
        let amount = parseFloat(table.rows[i].cells[3].children[0].value) || 0;
        total += amount;
    }
    let gst = total * 0.18;
    let final = total + gst;
    totalSpan.innerText = total.toFixed(2);
    gstSpan.innerText = gst.toFixed(2);
    finalSpan.innerText = final.toFixed(2);
}

function generateInvoice() {
    let items = [];
    for (let i = 1; i < table.rows.length; i++) {
        items.push({
            name: table.rows[i].cells[0].children[0].value,
            material: table.rows[i].cells[1].children[0].value,
            qty: table.rows[i].cells[2].children[0].value,
            amount: table.rows[i].cells[3].children[0].value
        });
    }
    fetch('/generate_invoice', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            items: items,
            total: parseFloat(totalSpan.innerText),
            gst: parseFloat(gstSpan.innerText),
            final: parseFloat(finalSpan.innerText)
        })
    }).then(response => response.blob())
    .then(blob => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = "invoice.pdf";
        a.click();
    });
}

// 3D Preview
document.getElementById('generate3D').addEventListener('click', () => {
    let fileInput = document.getElementById('designFile');
    if (!fileInput.files.length) return alert("Select a file first!");
    let file = fileInput.files[0];
    let formData = new FormData();
    formData.append('design', file);

    let progressBar = document.getElementById('progress');
    progressBar.style.width = '0%';
    progressBar.innerText = '0%';

    fetch('/upload_design', { method: 'POST', body: formData })
        .then(response => response.json())
        .then(data => {
            progressBar.style.width = '100%';
            progressBar.innerText = '100%';
            load3DPreview(data.file);
        });
});

function load3DPreview(file) {
    let container = document.getElementById('3dContainer');
    container.innerHTML = '';
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(75, 600/400, 0.1, 1000);
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(600, 400);
    container.appendChild(renderer.domElement);

    let geometry = new THREE.BoxGeometry();
    let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    let cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    animate();
}
