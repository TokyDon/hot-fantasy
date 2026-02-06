// Script to fetch Six Nations 2026 players and their photos from TheSportsDB
const fs = require('fs');
const https = require('https');

// Complete Six Nations 2026 squads from Wikipedia
const squads = {
  "England": [
    { name: "Luke Cowan-Dickie", position: "Hooker", team: "Sale Sharks" },
    { name: "Theo Dan", position: "Hooker", team: "Saracens" },
    { name: "Jamie George", position: "Hooker", team: "Saracens" },
    { name: "Trevor Davison", position: "Prop", team: "Northampton Saints" },
    { name: "Ellis Genge", position: "Prop", team: "Bristol Bears" },
    { name: "Joe Heyes", position: "Prop", team: "Leicester Tigers" },
    { name: "Emmanuel Iyogun", position: "Prop", team: "Northampton Saints" },
    { name: "Bevan Rodd", position: "Prop", team: "Sale Sharks" },
    { name: "Vilikesa Sela", position: "Prop", team: "Bath" },
    { name: "Ollie Chessum", position: "Lock", team: "Leicester Tigers" },
    { name: "Arthur Clark", position: "Lock", team: "Gloucester" },
    { name: "Alex Coles", position: "Lock", team: "Northampton Saints" },
    { name: "Maro Itoje", position: "Lock", team: "Saracens" },
    { name: "Chandler Cunningham-South", position: "Back row", team: "Harlequins" },
    { name: "Tom Curry", position: "Back row", team: "Sale Sharks" },
    { name: "Ben Earl", position: "Back row", team: "Saracens" },
    { name: "Greg Fisilau", position: "Back row", team: "Exeter Chiefs" },
    { name: "Guy Pepper", position: "Back row", team: "Bath" },
    { name: "Henry Pollock", position: "Back row", team: "Northampton Saints" },
    { name: "Sam Underhill", position: "Back row", team: "Bath" },
    { name: "Alex Mitchell", position: "Scrum-half", team: "Northampton Saints" },
    { name: "Ben Spencer", position: "Scrum-half", team: "Bath" },
    { name: "Jack van Poortvliet", position: "Scrum-half", team: "Leicester Tigers" },
    { name: "George Ford", position: "Fly-half", team: "Sale Sharks" },
    { name: "Marcus Smith", position: "Fly-half", team: "Harlequins" },
    { name: "Seb Atkinson", position: "Centre", team: "Gloucester" },
    { name: "Fraser Dingwall", position: "Centre", team: "Northampton Saints" },
    { name: "Max Ojomoh", position: "Centre", team: "Bath" },
    { name: "Henry Slade", position: "Centre", team: "Exeter Chiefs" },
    { name: "Henry Arundell", position: "Wing", team: "Bath" },
    { name: "Imman Feyi-Waboso", position: "Wing", team: "Exeter Chiefs" },
    { name: "Tommy Freeman", position: "Wing", team: "Northampton Saints" },
    { name: "Cadan Murley", position: "Wing", team: "Harlequins" },
    { name: "Elliot Daly", position: "Fullback", team: "Saracens" },
    { name: "George Furbank", position: "Fullback", team: "Northampton Saints" },
    { name: "Freddie Steward", position: "Fullback", team: "Leicester Tigers" }
  ],
  "France": [
    { name: "Maxime Lamothe", position: "Hooker", team: "Bordeaux Bègles" },
    { name: "Julien Marchand", position: "Hooker", team: "Toulouse" },
    { name: "Peato Mauvaka", position: "Hooker", team: "Toulouse" },
    { name: "Dorian Aldegheri", position: "Prop", team: "Toulouse" },
    { name: "Uini Atonio", position: "Prop", team: "La Rochelle" },
    { name: "Cyril Baille", position: "Prop", team: "Toulouse" },
    { name: "Jean-Baptiste Gros", position: "Prop", team: "Toulon" },
    { name: "Régis Montagne", position: "Prop", team: "Clermont" },
    { name: "Rodrigue Neti", position: "Prop", team: "Toulouse" },
    { name: "Dany Priso", position: "Prop", team: "Toulon" },
    { name: "Tevita Tatafu", position: "Prop", team: "Bayonne" },
    { name: "Georges-Henri Colombe", position: "Prop", team: "Toulouse" },
    { name: "Hugo Auradou", position: "Lock", team: "Pau" },
    { name: "Thibaud Flament", position: "Lock", team: "Toulouse" },
    { name: "Mickaël Guillard", position: "Lock", team: "Lyon" },
    { name: "Emmanuel Meafou", position: "Lock", team: "Toulouse" },
    { name: "Tom Staniforth", position: "Lock", team: "Castres" },
    { name: "Cameron Woki", position: "Lock", team: "Bordeaux Bègles" },
    { name: "Joshua Brennan", position: "Lock", team: "Toulouse" },
    { name: "Paul Boudehent", position: "Back row", team: "La Rochelle" },
    { name: "François Cros", position: "Back row", team: "Toulouse" },
    { name: "Alexandre Fischer", position: "Back row", team: "Bayonne" },
    { name: "Oscar Jégou", position: "Back row", team: "La Rochelle" },
    { name: "Anthony Jelonch", position: "Back row", team: "Toulouse" },
    { name: "Temo Matiu", position: "Back row", team: "Bordeaux Bègles" },
    { name: "Lenni Nouchi", position: "Back row", team: "Montpellier" },
    { name: "Charles Ollivon", position: "Back row", team: "Toulon" },
    { name: "Alexandre Roumat", position: "Back row", team: "Toulouse" },
    { name: "Thibault Daubagna", position: "Scrum-half", team: "Pau" },
    { name: "Antoine Dupont", position: "Scrum-half", team: "Toulouse" },
    { name: "Baptiste Serin", position: "Scrum-half", team: "Toulon" },
    { name: "Matthieu Jalibert", position: "Fly-half", team: "Bordeaux Bègles" },
    { name: "Ugo Seunes", position: "Fly-half", team: "Racing 92" },
    { name: "Fabien Brau-Boirie", position: "Centre", team: "Pau" },
    { name: "Nicolas Depoortère", position: "Centre", team: "Bordeaux Bègles" },
    { name: "Kalvin Gourgues", position: "Centre", team: "Toulouse" },
    { name: "Yoram Moefana", position: "Centre", team: "Bordeaux Bègles" },
    { name: "Noah Nene", position: "Centre", team: "Stade Français" },
    { name: "Théo Attissogbé", position: "Wing", team: "Pau" },
    { name: "Louis Bielle-Biarrey", position: "Wing", team: "Bordeaux Bègles" },
    { name: "Gaël Dréan", position: "Wing", team: "Toulon" },
    { name: "Aaron Grandidier-Nkanang", position: "Wing", team: "Pau" },
    { name: "Grégoire Arfeuil", position: "Fullback", team: "Pau" },
    { name: "Romain Buros", position: "Fullback", team: "Bordeaux Bègles" },
    { name: "Thomas Ramos", position: "Fullback", team: "Toulouse" }
  ],
  "Ireland": [
    { name: "Ronan Kelleher", position: "Hooker", team: "Leinster" },
    { name: "Dan Sheehan", position: "Hooker", team: "Leinster" },
    { name: "Tom Stewart", position: "Hooker", team: "Ulster" },
    { name: "Jack Boyle", position: "Prop", team: "Leinster" },
    { name: "Michael Milne", position: "Prop", team: "Munster" },
    { name: "Jeremy Loughman", position: "Prop", team: "Munster" },
    { name: "Tom O'Toole", position: "Prop", team: "Ulster" },
    { name: "Finlay Bealham", position: "Prop", team: "Connacht" },
    { name: "Tom Clarkson", position: "Prop", team: "Leinster" },
    { name: "Tadhg Furlong", position: "Prop", team: "Leinster" },
    { name: "Billy Bohan", position: "Prop", team: "Connacht" },
    { name: "Thomas Ahern", position: "Lock", team: "Munster" },
    { name: "Tadhg Beirne", position: "Lock", team: "Munster" },
    { name: "James Ryan", position: "Lock", team: "Leinster" },
    { name: "Edwin Edogbo", position: "Lock", team: "Munster" },
    { name: "Joe McCarthy", position: "Lock", team: "Leinster" },
    { name: "Cormac Izuchukwu", position: "Lock", team: "Ulster" },
    { name: "Jack Conan", position: "Back row", team: "Leinster" },
    { name: "Caelan Doris", position: "Back row", team: "Leinster" },
    { name: "Cian Prendergast", position: "Back row", team: "Connacht" },
    { name: "Nick Timoney", position: "Back row", team: "Ulster" },
    { name: "Josh van der Flier", position: "Back row", team: "Leinster" },
    { name: "Craig Casey", position: "Scrum-half", team: "Munster" },
    { name: "Jamison Gibson-Park", position: "Scrum-half", team: "Leinster" },
    { name: "Nathan Doak", position: "Scrum-half", team: "Ulster" },
    { name: "Harry Byrne", position: "Fly-half", team: "Leinster" },
    { name: "Jack Crowley", position: "Fly-half", team: "Munster" },
    { name: "Ciarán Frawley", position: "Fly-half", team: "Leinster" },
    { name: "Sam Prendergast", position: "Fly-half", team: "Leinster" },
    { name: "Bundee Aki", position: "Centre", team: "Connacht" },
    { name: "Stuart McCloskey", position: "Centre", team: "Ulster" },
    { name: "Garry Ringrose", position: "Centre", team: "Leinster" },
    { name: "Tom Farrell", position: "Centre", team: "Munster" },
    { name: "Jude Postlethwaite", position: "Centre", team: "Ulster" },
    { name: "James Lowe", position: "Wing", team: "Leinster" },
    { name: "Tommy O'Brien", position: "Wing", team: "Leinster" },
    { name: "Jacob Stockdale", position: "Wing", team: "Ulster" },
    { name: "Robert Baloucoune", position: "Wing", team: "Ulster" },
    { name: "Jamie Osborne", position: "Fullback", team: "Leinster" },
    { name: "Hugo Keenan", position: "Fullback", team: "Leinster" }
  ],
  "Italy": [
    { name: "Tommaso Di Bartolomeo", position: "Hooker", team: "Zebre Parma" },
    { name: "Pablo Dimcheff", position: "Hooker", team: "Colomiers" },
    { name: "Giacomo Nicotera", position: "Hooker", team: "Stade Français" },
    { name: "Simone Ferrari", position: "Prop", team: "Benetton" },
    { name: "Danilo Fischetti", position: "Prop", team: "Northampton Saints" },
    { name: "Muhamed Hasa", position: "Prop", team: "Zebre Parma" },
    { name: "Marco Riccioni", position: "Prop", team: "Saracens" },
    { name: "Mirco Spagnolo", position: "Prop", team: "Benetton" },
    { name: "Giosuè Zilocchi", position: "Prop", team: "Benetton" },
    { name: "Niccolò Cannone", position: "Lock", team: "Benetton" },
    { name: "Riccardo Favretto", position: "Lock", team: "Benetton" },
    { name: "Federico Ruzza", position: "Lock", team: "Benetton" },
    { name: "Andrea Zambonin", position: "Lock", team: "Exeter Chiefs" },
    { name: "Lorenzo Cannone", position: "Back row", team: "Benetton" },
    { name: "Alessandro Izekor", position: "Back row", team: "Benetton" },
    { name: "Michele Lamaro", position: "Back row", team: "Benetton" },
    { name: "Samuele Locatelli", position: "Back row", team: "Zebre Parma" },
    { name: "David Odiase", position: "Back row", team: "Zebre Parma" },
    { name: "Manuel Zuliani", position: "Back row", team: "Benetton" },
    { name: "Alessandro Fusco", position: "Scrum-half", team: "Zebre Parma" },
    { name: "Martin Page-Relo", position: "Scrum-half", team: "Bordeaux" },
    { name: "Stephen Varney", position: "Scrum-half", team: "Exeter Chiefs" },
    { name: "Alessandro Garbisi", position: "Scrum-half", team: "Benetton" },
    { name: "Giacomo Da Re", position: "Fly-half", team: "Zebre Parma" },
    { name: "Paolo Garbisi", position: "Fly-half", team: "Toulon" },
    { name: "Ignacio Brex", position: "Centre", team: "Toulon" },
    { name: "Leonardo Marin", position: "Centre", team: "Benetton" },
    { name: "Damiano Mazza", position: "Centre", team: "Zebre Parma" },
    { name: "Tommaso Menoncello", position: "Centre", team: "Benetton" },
    { name: "Paolo Odogwu", position: "Centre", team: "Benetton" },
    { name: "Monty Ioane", position: "Wing", team: "Lyon" },
    { name: "Louis Lynagh", position: "Wing", team: "Benetton" },
    { name: "Edoardo Todaro", position: "Wing", team: "Northampton Saints" },
    { name: "Matt Gallagher", position: "Fullback", team: "Benetton" },
    { name: "Lorenzo Pani", position: "Fullback", team: "Zebre Parma" }
  ],
  "Scotland": [
    { name: "Ewan Ashman", position: "Hooker", team: "Edinburgh" },
    { name: "Dave Cherry", position: "Hooker", team: "Vannes" },
    { name: "George Turner", position: "Hooker", team: "Harlequins" },
    { name: "Gregor Hiddleston", position: "Hooker", team: "Glasgow Warriors" },
    { name: "Zander Fagerson", position: "Prop", team: "Glasgow Warriors" },
    { name: "Nathan McBeth", position: "Prop", team: "Glasgow Warriors" },
    { name: "Elliott Millar-Mills", position: "Prop", team: "Northampton Saints" },
    { name: "D'Arcy Rae", position: "Prop", team: "Edinburgh" },
    { name: "Pierre Schoeman", position: "Prop", team: "Edinburgh" },
    { name: "Rory Sutherland", position: "Prop", team: "Glasgow Warriors" },
    { name: "Gregor Brown", position: "Lock", team: "Glasgow Warriors" },
    { name: "Alex Craig", position: "Lock", team: "Glasgow Warriors" },
    { name: "Scott Cummings", position: "Lock", team: "Glasgow Warriors" },
    { name: "Grant Gilchrist", position: "Lock", team: "Edinburgh" },
    { name: "Jonny Gray", position: "Lock", team: "Bordeaux" },
    { name: "Max Williamson", position: "Lock", team: "Glasgow Warriors" },
    { name: "Josh Bayliss", position: "Back row", team: "Bath" },
    { name: "Magnus Bradbury", position: "Back row", team: "Edinburgh" },
    { name: "Rory Darge", position: "Back row", team: "Glasgow Warriors" },
    { name: "Jack Dempsey", position: "Back row", team: "Glasgow Warriors" },
    { name: "Freddy Douglas", position: "Back row", team: "Edinburgh" },
    { name: "Matt Fagerson", position: "Back row", team: "Glasgow Warriors" },
    { name: "Liam McConnell", position: "Back row", team: "Edinburgh" },
    { name: "Jamie Ritchie", position: "Back row", team: "Perpignan" },
    { name: "Jamie Dobie", position: "Scrum-half", team: "Glasgow Warriors" },
    { name: "George Horne", position: "Scrum-half", team: "Glasgow Warriors" },
    { name: "Ben White", position: "Scrum-half", team: "Toulon" },
    { name: "Gus Warr", position: "Scrum-half", team: "Sale Sharks" },
    { name: "Fergus Burke", position: "Fly-half", team: "Saracens" },
    { name: "Adam Hastings", position: "Fly-half", team: "Glasgow Warriors" },
    { name: "Finn Russell", position: "Fly-half", team: "Bath" },
    { name: "Rory Hutchinson", position: "Centre", team: "Northampton Saints" },
    { name: "Huw Jones", position: "Centre", team: "Glasgow Warriors" },
    { name: "Tom Jordan", position: "Centre", team: "Bristol Bears" },
    { name: "Stafford McDowall", position: "Centre", team: "Glasgow Warriors" },
    { name: "Sione Tuipulotu", position: "Centre", team: "Glasgow Warriors" },
    { name: "Darcy Graham", position: "Wing", team: "Edinburgh" },
    { name: "Kyle Rowe", position: "Wing", team: "Glasgow Warriors" },
    { name: "Kyle Steyn", position: "Wing", team: "Glasgow Warriors" },
    { name: "Duhan van der Merwe", position: "Wing", team: "Edinburgh" },
    { name: "Blair Kinghorn", position: "Fullback", team: "Toulouse" },
    { name: "Ollie Smith", position: "Fullback", team: "Glasgow Warriors" }
  ],
  "Wales": [
    { name: "Liam Belcher", position: "Hooker", team: "Cardiff" },
    { name: "Ryan Elias", position: "Hooker", team: "Scarlets" },
    { name: "Dewi Lake", position: "Hooker", team: "Ospreys" },
    { name: "Keiron Assiratti", position: "Prop", team: "Cardiff" },
    { name: "Rhys Carré", position: "Prop", team: "Saracens" },
    { name: "Tomas Francis", position: "Prop", team: "Provence" },
    { name: "Archie Griffin", position: "Prop", team: "Bath" },
    { name: "Nicky Smith", position: "Prop", team: "Leicester Tigers" },
    { name: "Gareth Thomas", position: "Prop", team: "Ospreys" },
    { name: "Sam Wainwright", position: "Prop", team: "Cardiff" },
    { name: "Adam Beard", position: "Lock", team: "Montpellier" },
    { name: "Ben Carter", position: "Lock", team: "Dragons" },
    { name: "Dafydd Jenkins", position: "Lock", team: "Exeter Chiefs" },
    { name: "Freddie Thomas", position: "Lock", team: "Gloucester" },
    { name: "Rhys Davies", position: "Lock", team: "Ospreys" },
    { name: "James Botham", position: "Back row", team: "Cardiff" },
    { name: "Olly Cracknell", position: "Back row", team: "Leicester Tigers" },
    { name: "Harri Deaves", position: "Back row", team: "Ospreys" },
    { name: "Alex Mann", position: "Back row", team: "Cardiff" },
    { name: "Josh Macleod", position: "Back row", team: "Scarlets" },
    { name: "Taine Plumtree", position: "Back row", team: "Scarlets" },
    { name: "Aaron Wainwright", position: "Back row", team: "Dragons" },
    { name: "Kieran Hardy", position: "Scrum-half", team: "Ospreys" },
    { name: "Reuben Morgan-Williams", position: "Scrum-half", team: "Ospreys" },
    { name: "Tomos Williams", position: "Scrum-half", team: "Gloucester" },
    { name: "Sam Costelow", position: "Fly-half", team: "Scarlets" },
    { name: "Dan Edwards", position: "Fly-half", team: "Ospreys" },
    { name: "Jarrod Evans", position: "Fly-half", team: "Harlequins" },
    { name: "Joe Hawkins", position: "Centre", team: "Scarlets" },
    { name: "Louie Hennessey", position: "Centre", team: "Bath" },
    { name: "Eddie James", position: "Centre", team: "Scarlets" },
    { name: "Ben Thomas", position: "Centre", team: "Cardiff" },
    { name: "Owen Watkin", position: "Centre", team: "Ospreys" },
    { name: "Josh Adams", position: "Wing", team: "Cardiff" },
    { name: "Mason Grady", position: "Wing", team: "Cardiff" },
    { name: "Louis Rees-Zammit", position: "Wing", team: "Bristol Bears" },
    { name: "Tom Rogers", position: "Wing", team: "Scarlets" },
    { name: "Gabriel Hamer-Webb", position: "Wing", team: "Leicester Tigers" },
    { name: "Blair Murray", position: "Fullback", team: "Scarlets" }
  ]
};

// Function to get player photo from Wikipedia
function fetchWikipediaPhoto(playerName) {
  return new Promise((resolve) => {
    // Search for the player on Wikipedia
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(playerName + ' rugby')}&format=json&origin=*`;
    
    https.get(searchUrl, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.query && json.query.search && json.query.search.length > 0) {
            const pageTitle = json.query.search[0].title;
            
            // Get the page image
            const imageUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=pageimages&format=json&pithumbsize=800&origin=*`;
            
            https.get(imageUrl, (imageRes) => {
              let imageData = '';
              imageRes.on('data', (chunk) => { imageData += chunk; });
              imageRes.on('end', () => {
                try {
                  const imageJson = JSON.parse(imageData);
                  const pages = imageJson.query.pages;
                  const page = Object.values(pages)[0];
                  
                  if (page.thumbnail && page.thumbnail.source) {
                    resolve({ found: true, photo: page.thumbnail.source, source: 'Wikipedia' });
                  } else {
                    resolve({ found: false });
                  }
                } catch (e) {
                  resolve({ found: false });
                }
              });
            }).on('error', () => resolve({ found: false }));
          } else {
            resolve({ found: false });
          }
        } catch (e) {
          resolve({ found: false });
        }
      });
    }).on('error', () => resolve({ found: false }));
  });
}

// Function to make API request with retry logic for rate limiting
async function makeAPIRequest(url, retries = 5, baseDelay = 3000) {
  for (let attempt = 0; attempt < retries; attempt++) {
    const result = await new Promise((resolve) => {
      https.get(url, (res) => {
        // Check for rate limiting
        if (res.statusCode === 429) {
          resolve({ rateLimited: true, statusCode: 429 });
          return;
        }
        
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve({ success: true, data: json });
          } catch (e) {
            resolve({ success: false, error: 'Parse error' });
          }
        });
      }).on('error', (err) => {
        resolve({ success: false, error: err.message });
      });
    });
    
    if (result.rateLimited) {
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`  ⚠ Rate limited, waiting ${delay/1000}s before retry (attempt ${attempt + 1}/${retries})...`);
      await new Promise(r => setTimeout(r, delay));
      continue;
    }
    
    return result;
  }
  
  return { success: false, error: 'Max retries exceeded' };
}

// Function to query TheSportsDB API with multiple name variations
async function fetchPlayerPhoto(playerName) {
  // Try different name variations
  const nameParts = playerName.split(' ');
  const nameWithoutHyphens = playerName.replace(/-/g, ' ');
  const searchVariations = [
    playerName,
    nameWithoutHyphens,
    nameParts.filter(n => n.length > 2).join(' '),
    nameParts.length > 1 ? `${nameParts[nameParts.length - 1]}, ${nameParts[0]}` : playerName,
    nameParts.length > 2 ? `${nameParts[0]} ${nameParts[nameParts.length - 1]}` : playerName,
    nameParts[nameParts.length - 1]
  ];
  
  const uniqueVariations = [...new Set(searchVariations)];
  
  for (const variation of uniqueVariations) {
    const url = `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(variation)}`;
    
    const response = await makeAPIRequest(url);
    
    if (response.success && response.data.player && response.data.player.length > 0) {
      const rugbyPlayer = response.data.player.find(p => 
        p.strSport === 'Rugby' || p.strSport === 'Rugby Union' || p.strSport === 'Rugby League'
      );
      
      if (rugbyPlayer) {
        const photo = rugbyPlayer.strCutout || rugbyPlayer.strThumb || rugbyPlayer.strFanart1;
        if (photo) {
          return { found: true, photo };
        }
      }
    }
    
    // Small delay between variations
    await new Promise(r => setTimeout(r, 200));
  }
  
  return { found: false };
}

// Process all players
async function processAllPlayers() {
  const allPlayers = [];
  let playersWithPhotos = 0;
  let playersWithoutPhotos = 0;

  for (const [country, players] of Object.entries(squads)) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`Processing ${country} (${players.length} players)...`);
    console.log('='.repeat(50));
    
    for (const player of players) {
      const photo = await fetchPlayerPhoto(player.name);
      
      const playerData = {
        name: player.name,
        team: country,
        position: player.position,
        club: player.team,
        image: photo.found ? photo.photo : '',
        hasRealPhoto: photo.found
      };
      
      allPlayers.push(playerData);
      
      if (photo.found) {
        playersWithPhotos++;
        console.log(`✓ ${player.name} - Photo found`);
      } else {
        playersWithoutPhotos++;
        console.log(`✗ ${player.name} - No photo available`);
      }
      
      // Rate limit: wait 1.5 seconds between players to avoid throttling
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`FINAL RESULTS`);
  console.log('='.repeat(50));
  console.log(`Total players: ${allPlayers.length}`);
  console.log(`With real photos: ${playersWithPhotos} (${Math.round(playersWithPhotos/allPlayers.length*100)}%)`);
  console.log(`Without photos: ${playersWithoutPhotos}`);
  console.log('='.repeat(50));

  // Save to file
  fs.writeFileSync(
    'players-data.json',
    JSON.stringify(allPlayers, null, 2)
  );
  
  console.log(`\n✓ Player data saved to players-data.json`);
  return allPlayers;
}

processAllPlayers().catch(console.error);
