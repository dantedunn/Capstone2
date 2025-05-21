const createTables = async () => {
  const SQL = `
    DROP TABLE IF EXISTS comments;
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS games;
    DROP TABLE IF EXISTS users;

    CREATE TABLE users (
        id UUID PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password TEXT NOT NULL
    );
  
    CREATE TABLE games (
        id UUID PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        genre VARCHAR(50),
        platform VARCHAR(50),
        publisher VARCHAR(100),
        game_mode VARCHAR(50),
        theme VARCHAR(50),
        release_date DATE,
        average_rating DECIMAL(3,1),
        image_url TEXT
    );
  
    CREATE TABLE reviews (
        id UUID PRIMARY KEY,
        content TEXT NOT NULL,
        rating INT NOT NULL,
        user_id UUID NOT NULL REFERENCES users(id),
        game_id UUID NOT NULL REFERENCES games(id),
        CONSTRAINT unique_user_id_per_review UNIQUE (user_id, game_id)
    );

    CREATE TABLE comments (
        id UUID PRIMARY KEY,
        content TEXT NOT NULL,
        user_id UUID NOT NULL REFERENCES users(id),
        review_id UUID NOT NULL REFERENCES reviews(id) NOT NULL
    );

    -- Insert 10 games
    INSERT INTO games (id, name, description, genre, platform, publisher, game_mode, theme, release_date, average_rating, image_url) VALUES
      (gen_random_uuid(), 'Halo 3', 'The epic conclusion to the Halo trilogy.', 'Shooter', 'Xbox 360', 'Microsoft', 'Single player, Multi-player', 'Sci-Fi', '2007-09-25', 9.4, 'https://example.com/halo3.jpg'),
      (gen_random_uuid(), 'Halo', 'The original Halo: Combat Evolved.', 'Shooter', 'Xbox', 'Microsoft', 'Single player, Multi-player', 'Sci-Fi', '2001-11-15', 9.0, 'https://example.com/halo.jpg'),
      (gen_random_uuid(), 'Pokemon Leafgreen', 'Classic Pokémon adventure in Kanto.', 'RPG', 'Game Boy Advance', 'Nintendo', 'Single player', 'Fantasy', '2004-09-07', 8.7, 'https://example.com/leafgreen.jpg'),
      (gen_random_uuid(), 'Chrono Trigger', 'Time-traveling RPG masterpiece.', 'RPG', 'SNES', 'Square', 'Single player', 'Fantasy', '1995-03-11', 9.7, 'https://example.com/chrono.jpg'),
      (gen_random_uuid(), 'Metal Gear Solid', 'Stealth action classic.', 'Action', 'PlayStation', 'Konami', 'Single player', 'Espionage', '1998-10-21', 9.5, 'https://example.com/mgs.jpg'),
      (gen_random_uuid(), 'Final Fantasy 7', 'Legendary JRPG adventure.', 'RPG', 'PlayStation', 'Square', 'Single player', 'Fantasy', '1997-01-31', 9.6, 'https://example.com/ff7.jpg'),
      (gen_random_uuid(), 'Baldur''s Gate 3', 'Epic D&D RPG.', 'RPG', 'PC', 'Larian Studios', 'Single player, Multi-player', 'Fantasy', '2023-08-03', 9.8, 'https://example.com/bg3.jpg'),
      (gen_random_uuid(), 'GTA 4', 'Open-world crime saga.', 'Action', 'Xbox 360, PS3, PC', 'Rockstar Games', 'Single player, Multi-player', 'Crime', '2008-04-29', 9.2, 'https://example.com/gta4.jpg'),
      (gen_random_uuid(), 'Call of Duty: Modern Warfare 2', 'Blockbuster military shooter.', 'Shooter', 'Xbox 360, PS3, PC', 'Activision', 'Single player, Multi-player', 'War', '2009-11-10', 9.1, 'https://example.com/mw2.jpg'),
      (gen_random_uuid(), 'CyberPunk 2077', 'Futuristic open-world RPG set in Night City.', 'RPG', 'PC, PS4, Xbox One, Stadia', 'CD Projekt', 'Single player', 'Sci-Fi', '2020-12-10', 7.8, 'https://example.com/cyberpunk2077.jpg');
  `
  await client.query(SQL)
}