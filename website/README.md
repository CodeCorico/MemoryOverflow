# MemoryOverflow - Website

This part of the project is what you see on http://memoryoverflow.org. But, in this repository, it contains only the website skeleton.
When The Machine is started, she's able to generate the website from the .ejs files and the cards.

Whenever a contributor create/fix a card, a template, the rules or something else, The Machine don't want to sees commmits relates to the final website and cards generated in this repository. This is a "sources" repo.
So The Machine have made a second repository, the [MemoryOverflow-website](https://github.com/CodeCorico/MemoryOverflow-website). Each time she sees a new commit, she regenerates the website and update it on the second repo if necessary.
The second repository is directly plugged on the http://memoryoverflow.org domain.

1. [Contribute!](#contribute)
 - [Improve/Fix website](#fix)

## <a name="contribute"></a> Contribute!

In this project, everyone is free to contribute. To do that, you must first learn how to [use The Machine](../the-machine/). It's very easy and takes 10min to start working on the website. Of course, you don't have to learn writing code or something technical else. The Machine is here to generate the website and its cards automatically.

### <a name="fix"></a> Improve/Fix website

The website can be fixed or upgraded by new features. If you want to do that, follow theses guidelines:
* Add an [issue](https://github.com/CodeCorico/MemoryOverflow/issues)
* Send a new PR linked to your issue (see the [Contribution guidelines](../CONTRIBUTING.md))
