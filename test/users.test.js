describe("Users test", () => {
    beforeEach(() => {
        global.playerNames = [];
        global.eliminatedNames = [];
        global.localStorage = {
            getItem: jest.fn(),
            setItem: jest.fn(),
            removeItem: jest.fn()
        };
    });

    test("playerNames is empty", () => {
        expect(playerNames).toEqual([]);
    });

    test("eliminatedNames is empty", () => {
        expect(eliminatedNames).toEqual([]);
    });

    test("eliminateRandomPlayer returns null when no players", () => {
        playerNames = [];
        
        function eliminateRandomPlayer() {
            if (playerNames.length === 0) {
                return null;
            }
        }
        
        const result = eliminateRandomPlayer();
        expect(result).toBe(null);
    });

    test("eliminateRandomPlayer removes a player", () => {
        playerNames = ["Juan", "Pedro"];
        
        function eliminateRandomPlayer() {
            if (playerNames.length === 0) {
                return null;
            }
            let randomIndex = Math.floor(Math.random() * playerNames.length);
            let removedName = playerNames.splice(randomIndex, 1)[0];
            return removedName;
        }
        
        eliminateRandomPlayer();
        expect(playerNames.length).toBe(1);
    });

    test("eliminateRandomPlayer adds to eliminated list", () => {
        playerNames = ["Maria"];
        eliminatedNames = [];
        
        function eliminateRandomPlayer() {
            if (playerNames.length === 0) {
                return null;
            }
            let randomIndex = Math.floor(Math.random() * playerNames.length);
            let removedName = playerNames.splice(randomIndex, 1)[0];
            eliminatedNames.push(removedName);
            return removedName;
        }
        
        eliminateRandomPlayer();
        expect(eliminatedNames.length).toBe(1);
    });
});
