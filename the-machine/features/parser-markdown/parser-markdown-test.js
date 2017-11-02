const expect = require('chai').expect;
const path = require('path');

let parserMarkdown = null;

describe('Parser markdown', function() {

  it('should parse', function() {
    parserMarkdown = require(path.join(__dirname, 'parser-markdown.js'));

    const testArray = [
      '# Title 1',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at elit eu lectus tristique malesuada. Aliquam ut felis eget urna ullamcorper efficitur. Praesent tempus euismod est sed elementum. Aenean ut malesuada est. Nam ullamcorper, odio at sodales varius, lectus ipsum euismod odio, sed vehicula ligula elit eu turpis. Nulla in enim nec urna pretium mollis. In condimentum ut ante a accumsan. Donec fringilla interdum est vel blandit. Donec at malesuada sapien. Sed ut sollicitudin metus. Duis sed dapibus metus, eu convallis velit. In velit turpis, ullamcorper sed erat vitae, interdum aliquet arcu.',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at elit eu lectus tristique malesuada. Aliquam ut felis eget urna ullamcorper efficitur. Praesent tempus euismod est sed elementum. Aenean ut malesuada est. Nam ullamcorper, odio at sodales varius, lectus ipsum euismod odio, sed vehicula ligula elit eu turpis. Nulla in enim nec urna pretium mollis. In condimentum ut ante a accumsan. Donec fringilla interdum est vel blandit. Donec at malesuada sapien. Sed ut sollicitudin metus. Duis sed dapibus metus, eu convallis velit. In velit turpis, ullamcorper sed erat vitae, interdum aliquet arcu.',
      '# Title 2 # fake text',
      'Another text with # for tests',
      '# Title 3',
      '# Title 4',
      '',
      'The Machine is everywhere.'
    ];
    const expected = {
      'Title 1': testArray[1] + '\n' + testArray[2],
      'Title 2 # fake text': testArray[4],
      'Title 3': '',
      'Title 4': testArray[8]
    };

    expect(parserMarkdown(testArray.join('\n'))).to.deep.equal(expected);
  });

  it('should find nothing', function() {
    const testArray = [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at elit eu lectus tristique malesuada. Aliquam ut felis eget urna ullamcorper efficitur. Praesent tempus euismod est sed elementum. Aenean ut malesuada est. Nam ullamcorper, odio at sodales varius, lectus ipsum euismod odio, sed vehicula ligula elit eu turpis. Nulla in enim nec urna pretium mollis. In condimentum ut ante a accumsan. Donec fringilla interdum est vel blandit. Donec at malesuada sapien. Sed ut sollicitudin metus. Duis sed dapibus metus, eu convallis velit. In velit turpis, ullamcorper sed erat vitae, interdum aliquet arcu.'
    ];

    expect(parserMarkdown(testArray.join('\n'))).to.deep.equal(null);
  });

});