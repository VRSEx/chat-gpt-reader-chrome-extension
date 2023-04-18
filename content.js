let prevText = "";
let isPlaying = false;
let playbackInterval;

function readAloud(text, lang) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  window.speechSynthesis.speak(utterance);
}

function processParagraphs() {
  const paragraphs = document.querySelectorAll("p");
  let allText = "";

  paragraphs.forEach((paragraph) => {
    allText += paragraph.textContent;
  });

  const newText = allText.substring(prevText.length);

  if (newText) {
    const lang = document.querySelector("#language-selector").value;
    readAloud(newText, lang);
    prevText = allText;
  }
}

function togglePlayback(play) {
  isPlaying = play;

  if (isPlaying) {
    playbackInterval = setInterval(processParagraphs, 1000);
  } else {
    clearInterval(playbackInterval);
    window.speechSynthesis.cancel();
  }
}

function isChatOpenAIUrl() {
  return window.location.href.startsWith("https://chat.openai.com");
}

function addLanguageSelector() {
  const chatHeader = document.querySelector(".chat-header");

  const languageSelector = document.createElement("select");
  languageSelector.id = "language-selector";

  const englishOption = document.createElement("option");
  englishOption.value = "en-US";
  englishOption.textContent = "English";
  languageSelector.appendChild(englishOption);

  const japaneseOption = document.createElement("option");
  japaneseOption.value = "ja-JP";
  japaneseOption.textContent = "Japanese";
  languageSelector.appendChild(japaneseOption);

  const spanishOption = document.createElement("option");
  spanishOption.value = "es-ES";
  spanishOption.textContent = "Spanish";
  languageSelector.appendChild(spanishOption);

  chatHeader.appendChild(languageSelector);
}

addLanguageSelector();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (!isChatOpenAIUrl()) {
    return;
  }

  if (request.type === "TOGGLE_PLAYBACK") {
    togglePlayback(!isPlaying);
    sendResponse(isPlaying);
  } else if (request.type === "GET_PLAYBACK_STATE") {
    sendResponse(isPlaying);
  }
});
