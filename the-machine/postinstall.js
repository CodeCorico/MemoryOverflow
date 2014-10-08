// BINARIES:
// https://code.google.com/p/wkhtmltopdf/downloads/list?can=1

var URL = 'http://cdn.codecorico.com/wkhtmltoimage',
    DESTINATION = 'vendor/wkhtmltoimage',
    LINKS = {
      'windows-32-old': 'win32-old/wkhtmltoimage.exe',
      'windows-64-old': 'win64-old/wkhtmltoimage.exe',
      'windows-32': 'win32/wkhtmltoimage.exe',
      'windows-64': 'win64/wkhtmltoimage.exe',
      'mac': 'mac/wkhtmltoimage',
      'linux': 'linux/wkhtmltoimage'
    },

    os = require('os'),
    fs = require('fs'),
    http = require('http'),
    ProgressBar = require('progress'),
    release = os.release(),
    link = [];

if(fs.existsSync(DESTINATION)) {
  return console.log('Card renderer (wkhtmltoimage) already installed');
}

if(process.platform == 'win32') {
  link.push('windows');
  link.push(process.arch == 'x64' ? '64' : '32');

  if(parseInt(release.split('.')[0], 10) < 6) {
    link.push('old');
  }
}
else if(process.platform == 'darwin') {
  link.push('mac');
}
else if(process.platform == 'linux') {
  link.push('linux');
}

if(!link.length) {
  return console.error('This operating system doesn\'t support The Machine');
}

link = URL + '/' + LINKS[link.join('-')];

var file = link.substr(link.lastIndexOf('/') + 1, link.length - link.lastIndexOf('/') - 1),
    fileDestination = DESTINATION + '/' + file;

console.log('Downloading the card renderer (wkhtmltoimage)')

http.get(link, function(response) {
  fs.mkdirSync(DESTINATION);
  response.pipe(fs.createWriteStream(fileDestination));

  var progressbar = new ProgressBar('[:bar] :percent :etas', {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: parseInt(response.headers['content-length'], 10)
  });

  progressbar.render();

  response.on('end', function() {
    fs.chmod(fileDestination, '755');
    console.log('INSTALLED');
  });

  response.on('data', function(chunk) {
    progressbar.tick(chunk.length);
  })
});