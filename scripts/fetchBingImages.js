// Script to fetch player images from Bing Image Search API
const fs = require('fs');
const https = require('https');

// Load existing player data
const playersData = JSON.parse(fs.readFileSync('players-data.json', 'utf-8'));

// Bing Image Search API key
// Get yours at: https://portal.azure.com/ (free tier: 1000 searches/month)
const BING_API_KEY = process.env.BING_API_KEY || 'YOUR_BING_API_KEY_HERE';

// Function to search Bing Images for a player
function searchBingImages(playerName, team) {
  return new Promise((resolve) => {
    const query = encodeURIComponent(`${playerName} ${team} rugby portrait`);
    const options = {
      hostname: 'api.bing.microsoft.com',
      path: `/v7.0/images/search?q=${query}&count=3&imageType=Photo&size=Medium&aspect=Portrait`,
      headers: {
        'Ocp-Apim-Subscription-Key': BING_API_KEY
      }
    };
    
    https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          
          if (json.value && json.value.length > 0) {
            // Get the best image (first result is usually best)
            const imageUrl = json.value[0].contentUrl;
            resolve({ found: true, image: imageUrl });
          } else {
            resolve({ found: false });
          }
        } catch (e) {
          console.error(`Error for ${playerName}:`, e.message);
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
  if (BING_API_KEY === 'YOUR_BING_API_KEY_HERE') {
    console.error('\n⚠️  Please set up Bing Image Search API:\n');
    console.log('1. Go to: https://portal.azure.com/');
    console.log('2. Create a "Bing Search v7" resource (FREE tier available)');
    console.log('3. Copy your API key');
    console.log('4. Set environment variable:');
    console.log('   $env:BING_API_KEY="your_api_key"\n');
    console.log('5. Run: node fetchBingImages.js\n');
    console.log('Free tier: 1000 searches/month (237 players = 237 searches)\n');
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
      console.log(`⏭  ${player.name} - Has image, skipping`);
      skipped++;
      continue;
    }

    console.log(`[${i + 1}/${playersData.length}] ${player.name}...`);
    const result = await searchBingImages(player.name, player.team);
    
    if (result.found) {
      player.image = result.image;
      player.hasRealPhoto = true;
      updated++;
      console.log(`   ✓ Image found`);
    } else {
      failed++;
      console.log(`   ✗ No image`);
    }
    
    // Rate limit: wait 500ms between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n========================================`);
  console.log(`Total: ${playersData.length}`);
  console.log(`Updated: ${updated}`);
  console.log(`Failed: ${failed}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Total with images: ${playersData.filter(p => p.hasRealPhoto).length}`);
  console.log(`========================================\n`);

  // Save
  fs.writeFileSync('players-data.json', JSON.stringify(playersData, null, 2));
  console.log('✓ Saved to players-data.json\n');
}

updatePlayerImages().catch(console.error);
