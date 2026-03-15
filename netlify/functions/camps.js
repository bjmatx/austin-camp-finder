const https = require('https');

exports.handler = async function(event, context) {
  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE_ID = 'app2crPcNCqz50HED';
  const TABLE_ID = 'tblEFmCzTTFXMuN50';

  function httpsGet(url, token) {
    return new Promise((resolve, reject) => {
      const options = {
        headers: { 'Authorization': `Bearer ${token}` }
      };
      https.get(url, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });
  }

  try {
    let allRecords = [];
    let offset = null;

    do {
      let url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?pageSize=100`;
      if (offset) url += `&offset=${offset}`;
      const data = await httpsGet(url, TOKEN);
      allRecords = allRecords.concat(data.records);
      offset = data.offset;
    } while (offset);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(allRecords)
    };
  } catch(e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};
