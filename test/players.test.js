const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(
    path.resolve(__dirname, "../Players/players.html"),
    "utf8"
);

let playersJs;

describe("Players page tests", () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html;

        Storage.prototype.getItem = jest.fn(() => null);
        Storage.prototype.setItem = jest.fn();

        HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
        HTMLMediaElement.prototype.pause = jest.fn();

        jest.resetModules();
        playersJs = require("../Players/players.js");
    });

    test("You need to add one player when you use addNewPlayer()", () => {
        const input = document.getElementById("playerInput");
        const addBtn = document.getElementById("addPlayerBtn");
        const container = document.getElementById("playersContainer");

        input.value = "Vega";
        addBtn.click();

        expect(container.textContent).toContain("Vega");
    });

    test("The playerInput needs one name", () => {
        const input = document.getElementById("playerInput");
        const addBtn = document.getElementById("addPlayerBtn");

        input.value = "";

        window.alert = jest.fn();
        addBtn.click();

        expect(window.alert).toHaveBeenCalledWith("Please, add a name");
    });

    test("Should not allow duplicate players", () => {
        const input = document.getElementById("playerInput");
        const addBtn = document.getElementById("addPlayerBtn");

        window.alert = jest.fn();

        input.value = "Ana";
        addBtn.click();

        input.value = "Ana";
        addBtn.click();

        expect(window.alert).toHaveBeenCalledWith("Player already exists");
    });

    test("Should save players in localStorage", () => {
        const input = document.getElementById("playerInput");
        const addBtn = document.getElementById("addPlayerBtn");

        input.value = "Mario";
        addBtn.click();

        expect(localStorage.setItem).toHaveBeenCalledWith(
            "kingOfGamblingPlayers",
            JSON.stringify(["Mario"])
        );
    });

    test("startGameBtn should be enabled when there are players", () => {
        const input = document.getElementById("playerInput");
        const addBtn = document.getElementById("addPlayerBtn");
        const startBtn = document.getElementById("startGameBtn");

        input.value = "Pepe";
        addBtn.click();

        expect(startBtn.disabled).toBe(false);
    });

    test("Should remove a player", () => {
        const input = document.getElementById("playerInput");
        const addBtn = document.getElementById("addPlayerBtn");

        input.value = "Laura";
        addBtn.click();

        const deleteBtn = document.querySelector(".remove-button");
        deleteBtn.click();

        const container = document.getElementById("playersContainer");
        expect(container.textContent).not.toContain("Laura");
    });

    test("Save volume in localStorage", () => {
        const slider = document.getElementById("volumeSlider");

        slider.value = "80";
        slider.dispatchEvent(new Event("input"));

        expect(localStorage.setItem).toHaveBeenCalledWith("musicVolume", "80");
    });

    test("Should attempt to play music if it is enabled", () => {
        const audio = document.getElementById("backgroundMusic");

        localStorage.getItem = jest.fn(() => "true");

        window.tryPlayMusic();

        expect(audio.play).toHaveBeenCalled();
    });
});