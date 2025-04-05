const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/grow', async (req, res) => {
  const { input } = req.body;
  const words = input.trim().split(/\s+/); // Split into array if phrase
  const tree = {};

  // Root word(s)
  tree.root = words;

  // Branching logic (simple for now, expand later)
  for (let word of words) {
    tree[word] = {
      related: [`${word}ful`, `un${word}`, `${word}ness`], // Placeholder
      meanings: await getMeanings(word),
    };
  }

  res.json(tree);
});

async function getMeanings(word) {
  try {
    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    return response.data[0].meanings.map(m => m.definitions[0].definition);
  } catch (e) {
    return ['No definition found'];
  }
}
app.get('/', (req, res) => {
    res.send('Welcome to The Tree of Thought!');
  });
app.listen(port, () => console.log(`Server's running on port ${port}`));