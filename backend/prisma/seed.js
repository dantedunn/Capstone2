const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');
  
  // Clear existing data
  await prisma.comment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.game.deleteMany();
  await prisma.user.deleteMany();

  console.log('Creating admin user...');
  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin'
    }
  });

  console.log('Creating regular user...');
  // Create regular user
  const regularUser = await prisma.user.create({
    data: {
      username: 'user',
      email: 'user@example.com',
      password: await bcrypt.hash('user123', 10),
      role: 'user'
    }
  });

  // Seed games
  const games = [
    {
      name: 'Halo 3',
      description: 'The epic conclusion to the Halo trilogy.',
      genre: 'Shooter',
      platform: 'Xbox 360',
      publisher: 'Microsoft',
      gameMode: 'Single player, Multi-player',
      theme: 'Sci-Fi',
      releaseDate: new Date('2007-09-25'),
      averageRating: 9.4,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Halo_3_final_boxshot.JPG'
    },
    {
      name: 'Halo',
      description: 'The original Halo: Combat Evolved.',
      genre: 'Shooter',
      platform: 'Xbox',
      publisher: 'Microsoft',
      gameMode: 'Single player, Multi-player',
      theme: 'Sci-Fi',
      releaseDate: new Date('2001-11-15'),
      averageRating: 9.0,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/en/8/80/Halo_-_Combat_Evolved_%28XBox_version_-_box_art%29.jpg'
    },
    {
      name: 'Pokemon Leafgreen',
      description: 'Classic Pokémon adventure in Kanto.',
      genre: 'RPG',
      platform: 'Game Boy Advance',
      publisher: 'Nintendo',
      gameMode: 'Single player',
      theme: 'Fantasy',
      releaseDate: new Date('2004-09-07'),
      averageRating: 8.7,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Pokemon_LeafGreen_box.jpg'
    },
    {
      name: 'Chrono Trigger',
      description: 'Time-traveling RPG masterpiece.',
      genre: 'RPG',
      platform: 'SNES',
      publisher: 'Square',
      gameMode: 'Single player',
      theme: 'Fantasy',
      releaseDate: new Date('1995-03-11'),
      averageRating: 9.7,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNb_rzPILWk3OwCaTC5zdNfxX7eP9CK53kdO0jvK2w_NrOPeVd'
    },
    {
      name: 'Metal Gear Solid',
      description: 'Stealth action classic.',
      genre: 'Action',
      platform: 'PlayStation',
      publisher: 'Konami',
      gameMode: 'Single player',
      theme: 'Espionage',
      releaseDate: new Date('1998-10-21'),
      averageRating: 9.5,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/en/3/33/Metal_Gear_Solid_cover_art.png'
    },
    {
      name: 'Final Fantasy 7',
      description: 'Legendary JRPG adventure.',
      genre: 'RPG',
      platform: 'PlayStation',
      publisher: 'Square',
      gameMode: 'Single player',
      theme: 'Fantasy',
      releaseDate: new Date('1997-01-31'),
      averageRating: 9.6,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c2/Final_Fantasy_VII_Box_Art.jpg'
    },
    {
      name: 'Baldur\'s Gate 3',
      description: 'Epic D&D RPG.',
      genre: 'RPG',
      platform: 'PC',
      publisher: 'Larian Studios',
      gameMode: 'Single player, Multi-player',
      theme: 'Fantasy',
      releaseDate: new Date('2023-08-03'),
      averageRating: 9.8,
      imageUrl: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTfHf00n-K29UJL0yUMLv6-MIsfGv1F7YuGprMdjVequP_n3St8'
    },
    {
      name: 'GTA 4',
      description: 'Open-world crime saga.',
      genre: 'Action',
      platform: 'Xbox 360, PS3, PC',
      publisher: 'Rockstar Games',
      gameMode: 'Single player, Multi-player',
      theme: 'Crime',
      releaseDate: new Date('2008-04-29'),
      averageRating: 9.2,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b7/Grand_Theft_Auto_IV_cover.jpg'
    },
    {
      name: 'Call of Duty: Modern Warfare 2',
      description: 'Blockbuster military shooter.',
      genre: 'Shooter',
      platform: 'Xbox 360, PS3, PC',
      publisher: 'Activision',
      gameMode: 'Single player, Multi-player',
      theme: 'War',
      releaseDate: new Date('2009-11-10'),
      averageRating: 9.1,
      imageUrl: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT9tKqhkBjAkEewXo2S6sv0-oS7irn_zkTdsvlK3bjEMRLUflaB'
    },
    {
      name: 'CyberPunk 2077',
      description: 'Futuristic open-world RPG set in Night City.',
      genre: 'RPG',
      platform: 'PC, PS4, Xbox One, Stadia',
      publisher: 'CD Projekt',
      gameMode: 'Single player',
      theme: 'Sci-Fi',
      releaseDate: new Date('2020-12-10'),
      averageRating: 7.8,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/en/9/9f/Cyberpunk_2077_box_art.jpg'
    }
  ]

  for (const game of games) {
    console.log(`Creating game: ${game.name}`);
    const createdGame = await prisma.game.create({
      data: game
    });

    // Create sample reviews for each game
    if (game.name === 'Halo 3') {
      console.log('Creating reviews for Halo 3...');
      await prisma.review.create({
        data: {
          content: 'One of the best FPS games ever made!',
          rating: 5,
          userId: adminUser.id,
          gameId: createdGame.id
        }
      });

      const review = await prisma.review.create({
        data: {
          content: 'Amazing multiplayer experience.',
          rating: 4,
          userId: regularUser.id,
          gameId: createdGame.id
        }
      });

      // Add some comments to the review
      await prisma.comment.create({
        data: {
          content: 'Totally agree! The multiplayer maps are incredible.',
          userId: adminUser.id,
          reviewId: review.id
        }
      });
    }
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
