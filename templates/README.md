# MemoryOverflow - Templates

In MemoryOverflow game, cards can be printed with differents design templates. It's possible to choose the template of the printed cards and it's possible to make your own.
Cards are grouped by editions which represent different themes.

 - [Templates](#templates)
 - [Create a new card](#create)
 - [Improve/Fix existing template](#fix)

## <a name="templates"></a> Templates

Here are the list of all templates:

<p align="center"><a href="https://github.com/CodeCorico/MemoryOverflow/blob/master/templates/fototse">
<img src="https://raw.githubusercontent.com/CodeCorico/MemoryOverflow/master/templates/fototse/fototse-preview.png" alt="Fototse preview" height="150"/><br />
Fototse by @retovona</a></p>

## <a name="create"></a> Create a new template

To be used by the [generator](https://github.com/CodeCorico/MemoryOverflow/blob/master/generator/), each template has a generic JSON configuration file.

### The folder structure

A template must be located inside the `/templates` folder in its own folder.

Here is the folder configuration:
```
/templates/[template name]/
    -> README.md
    -> [template name].json
    -> [template name]-back.jpg
    -> [template name]-variable.jpg
    -> [template name]-code.jpg
    -> [template name]-event.jpg
    -> [template name]-preview.jpg
```

#### README.md file

This file contains :
* A preview picture
* A link to the configuration file
* The author
* A changelog

It describe the template spirit

#### [template name]-*.jpg

Except for the [template name]-preview.jpg file, all of the pictures files are used to generate cards :
* `[template name]-back.jpg` is the back design of the card
* `[template name]-variable.jpg` is the variable type design of the card
* `[template name]-code.jpg` is the code type design of the card
* `[template name]-event.jpg` is the event type design of the card

#### [template name].json

This file structure areas and styles of cards:

```javascript
{
  // Author can have a twitter user after @
  "author": "Me @me",

  // Full name of the template
  "name": "Fototse",

  // Default style applied for all areas.
  // Styles are CSS convention
  // You can add all of the Google fonts you want in "font-family"
  "default": {
    "color": "#ffffff",
    ...
  },

  // Area of the card title
  // In addition to the styles, you need to add "area" with title position
  "title": {
    ...,

    // "area" need 2 points location to draw a rectangle
    "area": {
      "y1": 4782,
      "x1": 293,
      "y2": 4961,
      "x2": 1742
    }
  },

  // Same as "title" but for the "MemoryOverflow" brand
  "brand": {
    ...
  },

  // Same as "title" but for the card details like Edition and Version
  // Ex: "Fundamentals - F011"
  "edition": {
    ...
  },

  // When the generator create a "Variable" card, it use the [template name]-variable.jpg picture
  // and the "type-variable" configuration area to display card informations
  // Same as "title", you can use an area and styles
  "type-variable": {
    ...
  },

  // Same as "type-variable" but for the "Code" cards
  // It use the [template name]-code.jpg picture
  "type-code": {
    ...
  },

  // Same as "type-variable" but for the "Event" cards
  // It use the [template name]-event.jpg picture
  "type-event": {
    ...
  },

  // Same as "type-variable" but for "The Machine" cards
  // It use the [template name]-the-machine.jpg picture
  "type-the-machine": {
    ...
  },

  // Inside informations area, cards can have many text formats
  // Each format is delcared inside "text-style"
  "text-style": {

    // CSS for the default area text
    "default": {
      ...
    },

    // CSS for the "code" tag
    "code": {
      ...
    },

    // CSS for the "operator" tag
    "operator": {
      ...
    },

    // CSS for the "number" tag
    "number": {
      ...
    },

    // CSS for the "comment" tag
    "comment": {
      ...
    },

    // CSS for the "comment-strong" tag
    "comment-strong": {
      ...
    }
  }
}
```

## <a name="fix"></a> Improve/Fix existing template

If a template needs to be fixed, you can :
* Contact the author of the template so that he corrects himself.
* Add an [issue](https://github.com/CodeCorico/MemoryOverflow/issues)
* Send a new PR linked to your issue (see the [Contribution guidelines](https://github.com/CodeCorico/MemoryOverflow/blob/master/CONTRIBUTING.md))
