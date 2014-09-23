# MemoryOverflow - Generator

## How To Generate

1. Install wkhtmltoimage by downloading the latest version here : http://wkhtmltopdf.org/downloads.html
2. Add wkhtmltoimage to your PATH
3. Run ```npm install```
4. When done, you can start generating your first cards ```gulp generate --template=<template name>``` or generate all cards : ```gulp generate```
5. Look at the `website` folder for your newly generated cards

## Auto-generation while modifying files.

If you are doing modifications on templates, or cards, or touching javascript files, you can run: ```gulp``` and start working. As soon as you save a file, generation will happen automatically.

## Templates

You can check out the list of templates from here : [templates](https://github.com/CodeCorico/MemoryOverflow/tree/master/templates)
