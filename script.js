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
//flags

let userSelectedCategory = "";

const handleSubmit = (event) => {
  event.preventDefault();

  for (let i = 0; i < event.target.length - 1; i++) {
    // -1 to exclude the submit button
    console.log(event.target[i].checked);
    if (event.target[i].checked) {
      userSelectedCategory = event.target[i].value;
    }
  }

  axios
    .get(EXCUSER_BASE_URL + userSelectedCategory)
    .then((response) => {
      console.log(response.data[0].excuse);
      showExcuse(response.data[0].excuse);
      showGif(userSelectedCategory);
    })
    .catch((error) => {
      console.log(error);
      showExcuse("Mmmhmm... there is no excuse for that, good luck though!");
    });
};

const showExcuse = (excuse) => {
  excuseParagraph.innerText = excuse;
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
      console.log(response);
      let img = document.createElement("img");

      img.setAttribute(
        "src",
        response.data.data[randomNum(imgArrayLength)].images.original.url
      );

      responseReaction.innerText =
        "Predicting your person's reaction to this excuse...";

      setTimeout(() => {
        excuseImgWrapper.removeChild(excuseImgWrapper.firstElementChild);
        excuseImgWrapper.append(img);
        generateExcuseBtn.innerText = "I need another one";
        responseReaction.innerText = "Predicted reaction.";
      }, 3000);
    });
};

form.addEventListener("submit", handleSubmit);
