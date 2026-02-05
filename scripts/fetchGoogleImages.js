// Script to fetch player images from Google Custom Search API
const fs = require('fs');
const https = require('https');

// Load existing player data
const playersData = JSON.parse(fs.readFileSync('players-data.json', 'utf-8'));

// Google Custom Search API credentials
// Get yours at: https://developers.google.com/custom-search/v1/overview
const API_KEY = process.env.GOOGLE_API_KEY || 'YOUR_API_KEY_HERE';
const SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID || 'YOUR_SEARCH_ENGINE_ID_HERE';

// Function to search Google Images for a player
function searchGoogleImages(playerName, team) {
  return new Promise((resolve) => {
    // Build search query for better results
    const query = encodeURIComponent(`${playerName} ${team} rugby player headshot portrait`);
    const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${query}&searchType=image&num=3&imgSize=medium&imgType=photo`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          
          if (json.items && json.items.length > 0) {
            // Get the first result (usually best match)
            const imageUrl = json.items[0].link;
            resolve({ found: true, image: imageUrl });
          } else {
            resolve({ found: false });
          }
        } catch (e) {
          console.error(`Error parsing response for ${playerName}:`, e.message);
          resolve({ found: false });
        }
      });
    }).on('error', (e) => {
      console.error(`Request error for ${playerName}:`, e.message);
      resolve({ found: false });
    });
  });
}

// Process all players
async function updatePlayerImages() {
  if (API_KEY === 'YOUR_API_KEY_HERE' || SEARCH_ENGINE_ID === 'YOUR_SEARCH_ENGINE_ID_HERE') {
    console.error('\n⚠️  ERROR: Please set up your Google Custom Search API credentials!\n');
    console.log('Follow these steps:');
    console.log('1. Go to: https://developers.google.com/custom-search/v1/overview');
    console.log('2. Get an API Key');
    console.log('3. Create a Custom Search Engine at: https://programmablesearchengine.google.com/');
    console.log('4. Set environment variables:');
    console.log('   $env:GOOGLE_API_KEY="your_api_key"');
    console.log('   $env:GOOGLE_SEARCH_ENGINE_ID="your_search_engine_id"\n');
    console.log('5. Run this script again: node fetchGoogleImages.js\n');
    return;
  }

  let updated = 0;
  let failed = 0;
  let skipped = 0;

  console.log(`\nProcessing ${playersData.length} players...\n`);

  for (let i = 0; i < playersData.length; i++) {
    const player = playersData[i];
    
    // Skip if already has a real photo
    if (player.hasRealPhoto && player.image) {
      console.log(`⏭  ${player.name} - Already has image, skipping`);
      skipped++;
      continue;
    }

    console.log(`[${i + 1}/${playersData.length}] Searching for ${player.name}...`);
    const result = await searchGoogleImages(player.name, player.team);
    
    if (result.found) {
      player.image = result.image;
      player.hasRealPhoto = true;
      updated++;
      console.log(`   ✓ Found image for ${player.name}`);
    } else {
      failed++;
      console.log(`   ✗ No image found for ${player.name}`);
    }
    
    // Rate limit: Google Custom Search allows 100 queries/day
    // Wait 1 second between requests to be respectful
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n========================================`);
  console.log(`Total players: ${playersData.length}`);
  console.log(`Updated: ${updated}`);
  console.log(`Failed: ${failed}`);
  console.log(`Skipped (already had images): ${skipped}`);
  console.log(`========================================\n`);

  // Save updated data
  fs.writeFileSync('players-data.json', JSON.stringify(playersData, null, 2));
  console.log('✓ Player data saved to players-data.json\n');
}

updatePlayerImages().catch(console.error);
