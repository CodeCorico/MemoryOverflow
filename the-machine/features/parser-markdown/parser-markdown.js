module.exports = (data) => {
  let delimiter = /^#.*/gm;
  let headers = data.match(delimiter);
  let contents = data.split(delimiter);
  let results = null;

  if(headers) {
    headers.forEach((header, i) => {
      let headerCleaned = header.replace('#', '').trim();
      let content = contents[i + 1].trim();

      results = results || {};

      results[headerCleaned] = content;
    });
  }

  return results;
};
