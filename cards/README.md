# MemoryOverflow - Cards & Editions

MemoryOverflow game is based on cards. Each one is unique and can be used in many different ways according to the strategy of the player.
Cards are grouped by editions which represent different themes.

 - [Editions](#editions)
 - [Create a new card](#create)
 - [Improve/Fix existing card](#fix)

## <a name="editions"></a> Editions

Here are the list of all editions:
* [Fundamentals edition](https://github.com/XavierBoubert/MemoryOverflow/blob/master/cards/Fundamentals/README.md) (0 card)

## <a name="create"></a> Create a new card

To be used by the [generator](https://github.com/XavierBoubert/MemoryOverflow/blob/master/generator/README.md), each card has a generic configuration.
It's possible to create cards in differents programming languages and translations.

### The folder structure

A card must be located inside an edition. Each card is composed of files inside a folder name.

Here is the folder configuration:
```
/cards/[edition name]/[card name]/
    -> README.md
    -> CHANGELOG.md
    -> [card name].card
    -> [card name].js.card
    -> [card name].en_EN.po
```

A card *must have* these files. It's possible to add all of the programming languages or translation you want but you need to have JavaScript format and english translation.

A programming language file use the code its file extension support, for example you can add:
```
[card name].js.card -> javascript format
[card name].php.card -> PHP format
[card name].py.card -> Python format
[card name].cpp.card -> C++ format
...
```

A translation file use the international ISO language code in a [Gettext format](http://www.gnu.org/software/gettext) (.po):
```
[card name].en_EN.po -> English format
[card name].fr_FR.card -> French format
...
```


### Card configuration



## <a name="fix"></a> Improve/Fix existing card


Explication sur la tructure des cartes
                   - changelog et infos
                   - editions
                   - types
                   - langages
                   - internationalisation