const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(
    path.resolve(__dirname, "../Init/Init.html"),
    "utf8"
);

let initJs;

describe("Init page tests", () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html;

        Storage.prototype.getItem = jest.fn(() => null);
        Storage.prototype.setItem = jest.fn();

        HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
        HTMLMediaElement.prototype.pause = jest.fn();

        jest.resetModules();
        initJs = require("../Init/Init.js");
    });

    test("Music should be enabled by default", () => {
        expect(window.musicEnabled).toBe(true);
    });

    test("volumeBtn should have music-off class when music is disabled", () => {
        window.musicEnabled = false;
        window.updateVolumeButton();

        const volumeBtn = document.getElementById("volumeBtn");
        expect(volumeBtn.classList.contains("music-off")).toBe(true);
    });

    test("Should save volume in localStorage when slider changes", () => {
        const slider = document.getElementById("volumeSlider");

        slider.value = "50";
        slider.dispatchEvent(new Event("input"));

        expect(localStorage.setItem).toHaveBeenCalledWith("musicVolume", "50");
    });

    test("Should play music when tryPlayMusic is called and music is enabled", () => {
        window.musicEnabled = true;
        const audio = document.getElementById("backgroundMusic");

        window.tryPlayMusic();

        expect(audio.play).toHaveBeenCalled();
    });

    test("volumeBtn click should pause music when enabled", () => {
        window.musicEnabled = true;
        const volumeBtn = document.getElementById("volumeBtn");
        const audio = document.getElementById("backgroundMusic");

        volumeBtn.click();

        expect(audio.pause).toHaveBeenCalled();
    });

    test("Should save music state in localStorage", () => {
        window.musicEnabled = true;
        const volumeBtn = document.getElementById("volumeBtn");

        volumeBtn.click();

        expect(localStorage.setItem).toHaveBeenCalledWith("musicaActivada", false);
    });

    test("Should have start button that redirects to players page", () => {
        const startBtn = document.querySelector(".start-button");
        
        expect(startBtn).toBeTruthy();
    });
});
