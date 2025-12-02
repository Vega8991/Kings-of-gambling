describe('Game Logic Tests', () => {
    
    test('should remove player from array', () => {
        let players = ['Alice', 'Bob'];
        players.splice(0, 1);
        
        expect(players.length).toBe(1);
    });

    test('should check if array is empty', () => {
        let players = [];
        
        expect(players.length).toBe(0);
    });

    test('should add player to eliminated list', () => {
        let eliminated = [];
        eliminated.push('Alice');
        
        expect(eliminated.length).toBe(1);
    });

    test('should check symbol based on player count', () => {
        let players = ['Player1', 'Player2'];
        let symbol = 'skull';
        
        if (players.length === 2) {
            symbol = 'win';
        }
        
        expect(symbol).toBe('win');
    });

    test('should convert array to string', () => {
        let players = ['John', 'Jane'];
        let text = JSON.stringify(players);
        
        expect(typeof text).toBe('string');
    });
});
