# MemoryOverflow - Generator

## Prerequisite

You will need [nodejs](http://nodejs.org/) installed on your computer in order to generate the cards.

## How To Generate

1. Install wkhtmltoimage by downloading the latest version here : http://wkhtmltopdf.org/downloads.html
2. Add wkhtmltoimage to your PATH
3. Go to the `generator` folder
3. Run ```npm install```
4. When done, you can start generating your first cards with: ```gulp generate```
5. Look in the `data` folder under `website` (root of the project) for your newly generated cards

### Generation options

While running `gulp generate`, you can use the following options:

| Parameter       | Description |
| -------------:  | ----------- |
| --template      | no template means all. name of the [template](https://github.com/CodeCorico/MemoryOverflow/tree/master/templates) to generate the cards with |
| --lang          | no lang means all. language of the cards to generate: en, fr |

Example: ```gulp generate --template=fototse --lang=en```

## Auto-generation while modifying files.

If you are doing modifications on templates, or cards, or touching javascript files, you can run: ```gulp``` and start working. As soon as you save a file, generation will happen automatically.
