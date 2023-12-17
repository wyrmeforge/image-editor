const fileInput = document.querySelector(".file-input");
const filterButtons = document.querySelectorAll(".filter button");
const filterInfo = document.querySelector(".filter-info");
const filterSlider = document.querySelector(".slider input");
const filterName = document.querySelector(".filter-info .name");
const filterValue = document.querySelector(".filter-info .value");
const rotateButtons = document.querySelectorAll(".rotate button");
const previewImg = document.querySelector(".preview-img img");
const resetFilterBtn = document.querySelector(".reset-filter");
const chooseImgBtn = document.querySelector(".choose-img");
const saveImgBtn = document.querySelector(".save-img");
const themeBtn = document.getElementById("theme");

let filterSettings = {
    brightness: 100,
    saturation: 100,
    inversion: 0,
    grayscale: 0,
    blur: 0,
    sepia: 0,
};

let transformSettings = {
    rotate: 0,
    flipHorizontal: 1,
    flipVertical: 1,
}

let isWhiteTheme = true;

const loadImage = () => {
    let file = fileInput.files[0];
    if(!file) return;


    previewImg.src = URL.createObjectURL(file);

    previewImg.addEventListener("load", () => {
        resetFilterBtn.click();
        document.querySelector(".container").classList.remove("disable");
    });
}

const saveImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;

    const { brightness, saturation, inversion, grayscale, blur, sepia } = filterSettings;
    const { rotate, flipHorizontal, flipVertical } = transformSettings;
    
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);

    if(rotate !== 0) {
        ctx.rotate(rotate * Math.PI / 180);
    }
    
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    
    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL();
    link.click();
}

const changeTheme = () => {
    const rootVars = document.querySelector(":root");
    const themeIcon = document.querySelector("#theme i");

    const bgColor = isWhiteTheme ? '#525252' : '#f2f0f0'
    const containerColor = isWhiteTheme ? '#414141' : '#fff'
    const textColor = isWhiteTheme ? '#d8d8d8' : '#000'
  
    themeIcon.style.setProperty('color', isWhiteTheme ? '#fff' : '#000')
    rootVars.style.setProperty('--bg-color', bgColor)
    rootVars.style.setProperty('--container-bg', containerColor)
    rootVars.style.setProperty('--text-color', textColor)

    isWhiteTheme = !isWhiteTheme;
}

const applyFilter = () => {
    const { brightness, saturation, inversion, grayscale, blur, sepia } = filterSettings;
    const { rotate, flipHorizontal, flipVertical } = transformSettings;

    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%) blur(${blur}px) sepia(${sepia}%)`;
}

const updateFilter = () => {
    const { value } = filterSlider;

    const selectedFilter = document.querySelector(".filter .active");

    filterSettings[selectedFilter.id] = value;
    filterValue.innerText = `${value}%`;
    applyFilter();
}

const resetFilter = () => {
    filterSettings = { brightness: 100, saturation: 100, inversion: 0, grayscale: 0, blur: 0, sepia: 0 };
    transformSettings = { rotate: 0, flipHorizontal: 1, flipVertical: 1 };

    filterButtons[0].click();
    applyFilter();
}

filterButtons.forEach(option => {
    option.addEventListener("click", () => {
        document.querySelector(".active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;

        const { id } = option;
        filterSlider.max = (id === "brightness" || id === "saturation") ? "200" : "100";

        filterSlider.value = filterSettings[id];
        filterValue.innerText = `${filterSettings[id]}`;
    });
});

rotateButtons.forEach(option => {
    option.addEventListener("click", () => {
        switch (option.id) {
            case 'left':
                transformSettings.rotate -= 90;
                break;
            case 'right':
                transformSettings.rotate += 90;
                break;
            case 'horizontal':
                transformSettings.flipHorizontal *= -1;
                break;
            default:
                transformSettings.flipVertical *= -1;
                break;
        }
        applyFilter();
    });
});


themeBtn.addEventListener("click", changeTheme)
filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);
fileInput.addEventListener("change", loadImage);
chooseImgBtn.addEventListener("click", () => fileInput.click());