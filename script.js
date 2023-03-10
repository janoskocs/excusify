// GIPHY API KEY uMFFBVC9tAJcsqvmqPVgSA4N2PdtJCyn

const EXCUSER_BASE_URL = "https://excuser-three.vercel.app/v1/excuse/";

const GIPHY_BASE_URL = "https://api.giphy.com/v1/gifs/search?";

const GIPHY_API_KEY = "api_key=uMFFBVC9tAJcsqvmqPVgSA4N2PdtJCyn";

const $ = (element) => {
  return document.querySelector(element);
};

const form = $("#input-form");
const excuseParagraph = $(".response__text");
const excuseImgWrapper = $(".response__img-wrapper");
const generateExcuseBtn = $(".input__btn");
const responseReaction = $(".response__reaction");
const saveBtn = $(".response__btn");
const viewExcuses = $(".view-excuses__btn");
const viewExcusesEl = $(".view-excuses");
const delExcuses = $(".view-excuses__btn-delete");
const viewList = $(".view-excuses__list");
const loadingEl = $(".response__loading");
const responseSaveEl = $(".response__save");
const gifWrapper = $(".response__img-wrapper");
//flags

let userSelectedCategory = "";

const handleSubmit = (event) => {
  event.preventDefault();

  for (let i = 0; i < event.target.length - 1; i++) {
    // -1 to exclude the submit button
    if (event.target[i].checked) {
      userSelectedCategory = event.target[i].value;
    }
  }

  axios
    .get(EXCUSER_BASE_URL + userSelectedCategory)
    .then((response) => {
      showExcuse(response.data[0].excuse);
    })
    .catch((error) => {
      console.log(error);
      showExcuse("Mmmhmm... there is no excuse for that, good luck though!");
    });
};

const showExcuse = (excuse) => {
  loadingEl.style.display = "block";
  gifWrapper.style.display = "none";
  setTimeout(() => {
    excuseParagraph.innerText = excuse;

    showGif();
    gifWrapper.style.display = "block";
    loadingEl.style.display = "none";
    viewExcusesEl.style.display = "block";
    responseSaveEl.style.display = "block";
  }, 3000);
};

const moods = ["sus", "dramatic", "lies", "fainting", "shocked", "crying"];

const randomNum = (length) => {
  return Math.floor(Math.random() * length);
};

const showGif = () => {
  axios
    .get(
      GIPHY_BASE_URL + GIPHY_API_KEY + "&q=" + moods[randomNum(moods.length)]
    )
    .then((response) => {
      let imgArrayLength = 50;
      let img = document.createElement("img");
      console.log(response.data.data[randomNum(imgArrayLength)].images);
      img.setAttribute(
        "src",
        response.data.data[randomNum(imgArrayLength)].images.fixed_height.url
      );

      responseReaction.innerText =
        "Predicting your person's reaction to this excuse...";
      gifWrapper.style.display = "none";
      setTimeout(() => {
        gifWrapper.style.display = "block";
        excuseImgWrapper.removeChild(excuseImgWrapper.firstElementChild);
        excuseImgWrapper.append(img);
        generateExcuseBtn.innerText = "I need another one";
        responseReaction.innerText = "Predicted reaction.";
        saveBtn.disabled = false;
      }, 500);
    });
};

const handleSave = () => {
  let arrayOfStrings = [];
  const previousExcuses = localStorage.getItem("excuse");
  const newExcuse = excuseParagraph.innerText;
  if (previousExcuses !== "[]") {
    arrayOfStrings.push(previousExcuses);
  }
  arrayOfStrings.shift();
  arrayOfStrings.push(newExcuse);
  localStorage.setItem("excuse", JSON.stringify(arrayOfStrings));
};

const viewSavedExcuses = () => {
  let arrayOfStrings = [];
  arrayOfStrings.push(JSON.parse(localStorage.getItem("excuse")));
  console.log(arrayOfStrings);

  for (let i = 0; i < arrayOfStrings.length; i++) {
    let item = document.createElement("li");
    item.innerText = arrayOfStrings[i];
    viewList.appendChild(item);
  }
};

const handleDeleteStorage = () => {
  localStorage.clear();
};

form.addEventListener("submit", handleSubmit);
saveBtn.addEventListener("click", handleSave);
viewExcuses.addEventListener("click", viewSavedExcuses);
delExcuses.addEventListener("click", handleDeleteStorage);
