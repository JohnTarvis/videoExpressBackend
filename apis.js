import axios from 'axios'

const API_KEYS = {
    rumble: 'MY_RUMBLE_API_KEY',///-still getting
    youtube: 'AIzaSyABILuTbD68uo2ZU4MKY0lTw4RFzDSs2PE',//'MY_YOUTUBE_API_KEY',
    vimeo: 'AIzaSyABILuTbD68uo2ZU4MKY0lTw4RFzDSs2PE',
    vimeo_client_identifier: 'dd51c5c1b053aa43ea5fe4d6dbf3140a001299b7',
    vimeo_client_secret: 'ed5Cyq92SC4LGYaDfHOoIv8ZBZxWAUW4qt1XB+n4YKHlEbuQACsAPpfryYY0WGtCWn/NlumrsiEV5M6ZypeXc7/J+90cobmEZjH8KArFIfZhQVt33ILgdWx+Vz0m24Zh',
    vimeo_token: '2064193fee8f19769da5932f808365ed',


};

////////////////////////////////////////////////////////////

async function youtube_search(searchTerm, limit = 6) {
  const url = 'https://www.googleapis.com/youtube/v3/search';
  const params = {
    part: 'snippet',
    q: searchTerm,
    maxResults: limit,
    key: API_KEYS.youtube
  };

  try {
    const response = await axios.get(url, { params });

    // console.log('youtubeResults: ',response);

    const videoResults = [];
    const rawVideoData = response.data.items;

    // console.log('rawVideoData',rawVideoData);    

    for (const video of rawVideoData) {

      if (!video.id.videoId) {
        continue;
      }

      // console.log('video-',video);

      // console.log('kind',video.id.kind);

      // if (video.id.kind === 'youtube#searchResult') {
      if (video.id.kind === 'youtube#video') {

        const videoId = video.id.videoId;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        const thumbnailUrl = video.snippet.thumbnails.default.url;
        const title = video.snippet.title;
        const description = video.snippet.description;
        const videoResult = {
          platform: 'youtube',
          videoId,
          videoUrl,
          thumbnailUrl,
          title,
          description
        };
        // console.log('videoresult--',videoResult);
        videoResults.push(videoResult);
      }
       else {
        console.log('NOT RESULT');
      }
    }

    // console.log('videoresults--',videoResults);

    const back = videoResults.slice(0,limit);

    // console.log('backlength',back.length);

    return back;

  } catch (error) {
    console.error('Error accessing YouTube API:', error.message);
    return [];
  }
}

async function dm_search(search_term, limit = 6) {
  const url = 'https://api.dailymotion.com/videos';
  const params = { search: search_term, limit: limit };
  const response = await axios.get(url, { params });
  const jsonData = response.data;
  const rawVideoData = jsonData.list;
  const videoResults = [];

  for (const video of rawVideoData) {
    const videoId = video.id;
    const videoUrl = `https://www.dailymotion.com/video/${videoId}`;

    const thumbnailUrlReq = `https://api.dailymotion.com/video/${videoId}?fields=thumbnail_480_url`;
    const thumbnailResponse = await axios.get(thumbnailUrlReq);
    const thumbnailJson = thumbnailResponse.data;
    const thumbnailUrl = thumbnailJson.thumbnail_480_url;

    const title = video.title;
    const description = 'dailymotion video';
    const videoResult = {
      platform: 'dailymotion',
      videoId,
      videoUrl,
      thumbnailUrl,
      title,
      description,
    };
    videoResults.push(videoResult);
  }

  return videoResults.slice(0, limit);
}

async function vimeo_search(search_term, limit = 6) {
  const api_key = API_KEYS.vimeo;
  const url = 'https://api.vimeo.com/videos';
  const client_identifier = API_KEYS.vimeo_client_identifier;
  const client_secret = API_KEYS.vimeo_client_secret;
  const token = API_KEYS.vimeo_token;
  const authorization = `bearer ${token}`;
  const headers = { Authorization: authorization };
  const params = { query: search_term, per_page: limit };

  const response = await axios.get(url, { headers, params });
  const jsonData = response.data;
  const rawVideoData = jsonData.data;
  const videoResults = [];

  for (const video of rawVideoData) {
    const videoId = video.uri.replace('/videos/', '');
    const videoUrl = video.link;
    const thumbnailUrl = video.pictures.sizes[3].link;
    const title = video.name;
    const description = video.description;

    const videoResult = {
      platform: 'vimeo',
      videoId,
      videoUrl,
      thumbnailUrl,
      title,
      description,
    };
    videoResults.push(videoResult);
  }

  return videoResults.slice(0, limit);
}


export default {

  youtube_search,
  vimeo_search,
  dm_search
  
}