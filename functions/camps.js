exports.handler = async function(event, context) {
  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE_ID = 'app2crPcNCqz50HED';
  const TABLE_ID = 'tblEFmCzTTFXMuN50';

  let allRecords = [];
  let offset = null;

  try {
    do {
      let url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?pageSize=100`;
      if (offset) url += `&offset=${offset}`;

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${TOKEN}` }
      });

      if (!res.ok) throw new Error('Airtable fetch failed');

      const data = await res.json();
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