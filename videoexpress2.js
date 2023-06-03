"use strict"

import apis from "./apis.js";
import express from "express";

const app = express();
const PORT = 3333;

let searchTerm = 'cats';
let limit = 10;

////////////////////////////////////////////////////////////

app.get('/', async (req, res) => {

  console.log('HOME');

});

app.get('/search/:term', async (req, res) => {
    searchTerm = req.params.term;
    try {
      const youtubeResults = await apis.youtube_search(searchTerm,limit);

      // console.log('youtubeResults',youtubeResults);

      const dmResults = await apis.dm_search(searchTerm,limit);
      const vimeoResults = await apis.vimeo_search(searchTerm,limit);      
      const results = {
        youtube:youtubeResults,
        dailymotion:dmResults,
        vimeoResults:vimeoResults
      }

      console.log('allresults-',results);

      res.json(results);
    } catch(error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
