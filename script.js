let currentIndex = 1;
let maxImages = 5; // default
let currentFolder = "images/kitchen/";

function showDesign() {
  const roomType = document.getElementById("room").value;

  if (roomType === "kitchen") {
    currentFolder = "images/kitchen/";
    maxImages = 10; // set to number of kitchen files
  } else if (roomType === "tv") {
    currentFolder = "images/tv/";
    maxImages = 8; // set to number of tv files
  } else if (roomType === "bedroom") {
    currentFolder = "images/bedroom/";
    maxImages = 120; // set to number of bedroom files
  }

  currentIndex = 1;
  updateImage();
}

function updateImage() {
  const imagePath = currentFolder + "file" + currentIndex + ".jpg";
  document.getElementById("preview").innerHTML =
    `<img src="${imagePath}" alt="Design ${currentIndex}">`;
}

function nextImage() {
  if (currentIndex < maxImages) {
    currentIndex++;
    updateImage();
  }
}

function prevImage() {
  if (currentIndex > 1) {
    currentIndex--;
    updateImage();
  }
}
