const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(
    path.resolve(__dirname, "../Game/game.html"),
    "utf8"
);

describe("Sounds tests", () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html;

        Storage.prototype.getItem = jest.fn(() => null);
        Storage.prototype.setItem = jest.fn();

        HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
        HTMLMediaElement.prototype.pause = jest.fn();

        jest.resetModules();
        require("../Game/sounds.js");
    });

    test("Should save volume in localStorage", () => {
        const slider = document.getElementById("volumeSlider");

        slider.value = "50";
        slider.dispatchEvent(new Event("input"));

        expect(localStorage.setItem).toHaveBeenCalledWith("musicVolume", "50");
    });

    test("Should pause music when button is clicked", () => {
        const volumeBtn = document.getElementById("volumeBtn");
        const gameMusic = document.getElementById("gameMusic");

        volumeBtn.click();

        expect(gameMusic.pause).toHaveBeenCalled();
    });

    test("Should save music state", () => {
        const volumeBtn = document.getElementById("volumeBtn");

        volumeBtn.click();

        expect(localStorage.setItem).toHaveBeenCalled();
    });

    test("Should change volume of game music", () => {
        const slider = document.getElementById("volumeSlider");
        const gameMusic = document.getElementById("gameMusic");

        slider.value = "75";
        slider.dispatchEvent(new Event("input"));

        expect(gameMusic.volume).toBe(0.75);
    });

    test("Should update sound effects volume", () => {
        const slider = document.getElementById("volumeSlider");
        const leverSound = document.getElementById("leverSound");

        slider.value = "60";
        slider.dispatchEvent(new Event("input"));

        expect(leverSound.volume).toBe(0.6);
    });

    test("Volume button should add class", () => {
        const volumeBtn = document.getElementById("volumeBtn");

        volumeBtn.click();

        expect(volumeBtn.classList.contains("music-off")).toBe(true);
    });
});
