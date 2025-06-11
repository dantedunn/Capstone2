const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Clear existing data
  await prisma.comment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.game.deleteMany();
  await prisma.user.deleteMany();

  console.log("Creating admin user...");
  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@example.com",
      password: await bcrypt.hash("admin123", 10),
      role: "admin",
    },
  });

  console.log("Creating regular user...");
  // Create regular user
  const regularUser = await prisma.user.create({
    data: {
      username: "user",
      email: "user@example.com",
      password: await bcrypt.hash("user123", 10),
      role: "user",
    },
  });

  // Seed games
  const games = [
    {
      name: "Halo 3",
      description:
        "Halo 3 is a shooter game where players primarily experience gameplay from a first-person perspective. Much of the gameplay takes place on foot, but also includes segments focused on vehicular combat. The balance of weapons and objects in the game was adjusted to better adhere to the \"Golden Triangle of Halo\": these are weapons, grenades, and melee attacks, which are available to a player in most situations. Players may dual-wield some weapons, forgoing the use of grenades and melee attacks in favor of the combined firepower of two weapons. Many weapons available in previous installments of the series return with minor cosmetic and power alterations. Unlike previous installments, the player's secondary weapon is visible on their player model, holstered or slung across the player's back.",
      genre: "Shooter",
      platform: "Xbox 360",
      publisher: "Microsoft",
      gameMode: "Single player, Multi-player",
      theme: "Sci-Fi",
      releaseDate: new Date("2007-09-25"),
      averageRating: 4.7,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/en/b/b4/Halo_3_final_boxshot.JPG",
    },
    {
      name: "Halo",
      description:
        "Bent on Humankind's extermination, a powerful fellowship of alien races known as the Covenant is wiping out Earth's fledgling interstellar empire. Climb into the boots of Master Chief, a biologically altered super-soldier, as you and the other surviving defenders of a devastated colony-world make a desperate attempt to lure the alien fleet away from earth. Shot down and marooned on the ancient ring-world Halo, you begin a guerilla-war against the Covenant. Fight for humanity against an alien onslaught as you race to uncover the mysteries of Halo.",
      genre: "Shooter",
      platform: "Xbox",
      publisher: "Microsoft",
      gameMode: "Single player, Multi-player",
      theme: "Sci-Fi",
      releaseDate: new Date("2001-11-15"),
      averageRating: 4.5,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/en/8/80/Halo_-_Combat_Evolved_%28XBox_version_-_box_art%29.jpg",
    },
    {
      name: "Pokemon Leafgreen",
      description:
        "Classic Pokémon adventure in Kanto.Pokémon LeafGreen Version and Pokémon FireRed Version are a pair of core series Generation III games that are set in the Kanto region. They were released in Japan on January 29, 2004, in North America on September 9, 2004, in Australia on September 23, 2004 and in Europe on October 1, 2004.",
      genre: "RPG",
      platform: "Game Boy Advance",
      publisher: "Nintendo",
      gameMode: "Single player",
      theme: "Fantasy",
      releaseDate: new Date("2004-09-07"),
      averageRating: 4.35,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/en/a/a7/Pokemon_LeafGreen_box.jpg",
    },
    {
      name: "Chrono Trigger",
      description:
        "In this turn-based Japanese RPG, young Crono must travel through time through a misfunctioning teleporter to rescue his misfortunate companion and take part in an intricate web of past and present perils. The adventure that ensues soon unveils an evil force set to destroy the world, triggering Crono's race against time to change the course of history and bring about a brighter future",
      genre: "RPG",
      platform: "SNES",
      publisher: "Square",
      gameMode: "Single player",
      theme: "Fantasy",
      releaseDate: new Date("1995-03-11"),
      averageRating: 4.35,
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNb_rzPILWk3OwCaTC5zdNfxX7eP9CK53kdO0jvK2w_NrOPeVd",
    },
    {
      name: "Metal Gear Solid",
      description:
        "Metal Gear Solid is a stealth game created by Hideo Kojima which follows the MSX2 video games Metal Gear and Metal Gear 2: Solid Snake. Despite a transition to 3D, Metal Gear Solid's gameplay remains similar to his predecessors. The game utilizes a traditional top-down view and the player must navigate the protagonist Solid Snake through the game's areas without being detected. Detection will set off an alarm which draws armed enemies to his location. Conversations with Snake's allies and cutscenes are used extensively to advance the plot and gain more insight into it. Metal Gear Solid is regarded as one of the greatest and most important video games of all time, and helped popularize the stealth genre and in-engine cinematic cutscenes.",
      genre: "Action",
      platform: "PlayStation",
      publisher: "Konami",
      gameMode: "Single player",
      theme: "Espionage",
      releaseDate: new Date("1998-10-21"),
      averageRating: 4.25,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/en/3/33/Metal_Gear_Solid_cover_art.png",
    },
    {
      name: "Final Fantasy 7",
      description:
        "Final Fantasy VII is a role-playing game set in a post-modern, steampunk world where technology and fantasy elements coexist. Players control Cloud Strife, an ex-soldier who joins the eco-terrorist group AVALANCHE to oppose Shinra Inc., a corporation draining the planet's life energy. The game features turn-based combat with an active time element, a customizable Materia system for abilities, and unique Limit Break attacks for each character. Players explore 3D environments, engage in various mini-games, and uncover a complex plot involving Cloud's mysterious past and a powerful threat to the world. As the story progresses, players gain access to different vehicles, allowing them to explore new areas and uncover additional content",
      genre: "RPG",
      platform: "PlayStation",
      publisher: "Square",
      gameMode: "Single player",
      theme: "Fantasy",
      releaseDate: new Date("1997-01-31"),
      averageRating: 4.3,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/en/c/c2/Final_Fantasy_VII_Box_Art.jpg",
    },
    {
      name: "Baldur's Gate 3",
      description:
        "An ancient evil has returned to Baldur's Gate, intent on devouring it from the inside out. The fate of Faerun lies in your hands. Alone, you may resist. But together, you can overcome.",
      genre: "RPG",
      platform: "PC",
      publisher: "Larian Studios",
      gameMode: "Single player, Multi-player",
      theme: "Fantasy",
      releaseDate: new Date("2023-08-03"),
      averageRating: 4.9,
      imageUrl:
        "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTfHf00n-K29UJL0yUMLv6-MIsfGv1F7YuGprMdjVequP_n3St8",
    },
    {
      name: "GTA 4",
      description:
        "The game is played from a third-person perspective and its world is navigated on-foot or by vehicle. Throughout the single-player mode, players play as Niko Bellic. An online multiplayer mode is included with the game, allowing up to 32 players to engage in both co-operative and competitive gameplay in a recreation of the single-player setting.",
      genre: "Action",
      platform: "Xbox 360, PS3, PC",
      publisher: "Rockstar Games",
      gameMode: "Single player, Multi-player",
      theme: "Crime",
      releaseDate: new Date("2008-04-29"),
      averageRating: 4.6,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/en/b/b7/Grand_Theft_Auto_IV_cover.jpg",
    },
    {
      name: "Call of Duty: Modern Warfare 2",
      description:
        "Call of Duty: Modern Warfare 2 is a first-person shooter video game developed by Infinity Ward and published by Activision for the Xbox 360 and PlayStation 3 video game consoles and the Microsoft Windows operating system. Officially announced on February 11, 2009, the game was released worldwide on November 10, 2009. It is the sixth installment of the Call of Duty series and the direct sequel to Call of Duty 4: Modern Warfare, continuing the same storyline, with Call of Duty: Modern Warfare 3 set to end the storyline.",
      genre: "Shooter",
      platform: "Xbox 360, PS3, PC",
      publisher: "Activision",
      gameMode: "Single player, Multi-player",
      theme: "War",
      releaseDate: new Date("2009-11-10"),
      averageRating: 4.55,
      imageUrl:
        "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT9tKqhkBjAkEewXo2S6sv0-oS7irn_zkTdsvlK3bjEMRLUflaB",
    },
    {
      name: "CyberPunk 2077",
      description:
        "Cyberpunk 2077 is an open-world, action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification. You play as V, a mercenary outlaw going after a one-of-a-kind implant that is the key to immortality. You can customize your character’s cyberware, skillset and playstyle, and explore a vast city where the choices you make shape the story and the world around you.",
      genre: "RPG",
      platform: "PC, PS4, Xbox One, Stadia",
      publisher: "CD Projekt",
      gameMode: "Single player",
      theme: "Sci-Fi",
      releaseDate: new Date("2020-12-10"),
      averageRating: 3.9,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/en/9/9f/Cyberpunk_2077_box_art.jpg",
    },
  ];

  for (const game of games) {
    console.log(`Creating game: ${game.name}`);
    const createdGame = await prisma.game.create({
      data: game,
    });

    // Create sample reviews for each game
    if (game.name === "Halo 3") {
      console.log("Creating reviews for Halo 3...");
      await prisma.review.create({
        data: {
          content: "One of the best FPS games ever made!",
          rating: 5,
          userId: adminUser.id,
          gameId: createdGame.id,
        },
      });

      const review = await prisma.review.create({
        data: {
          content: "Amazing multiplayer experience.",
          rating: 4,
          userId: regularUser.id,
          gameId: createdGame.id,
        },
      });

      // Add some comments to the review
      await prisma.comment.create({
        data: {
          content: "Totally agree! The multiplayer maps are incredible.",
          userId: adminUser.id,
          reviewId: review.id,
        },
      });
    }
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
