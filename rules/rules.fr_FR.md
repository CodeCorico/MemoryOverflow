# MemoryOverflow - Les règles du jeu

1. [Introduction](#introduction)
2. [Prérequis](#prerequis)
3. [Le déroulement d'une partie](#partie)
  1. [Le plateau de jeu](#plateau)
  2. [Engagements/désengagements](#engagements)
  3. [Débuter une partie](#debut)
  4. [Les phases d'un tour](#tour)
  5. [Les évènements](#evenements)
4. [Les 3 types de cartes jouables](#types)

<a name="introduction"></a>
## Introduction

MemoryOverflow est un jeu de cartes stratégique dans lequel 2 joueurs s'affrontent pour le contrôle de _La Machine_. Le jeu se déroule en tour par tour. Chaque adversaire place des cartes sur la table pour créer un algorithme dont le but est de percer le code de La Machine et ainsi gagner la partie.

Le succès d'une partie se détermine dans la stratégie mais surtout dans la créativité de programmation des joueurs. En alliant plusieurs cartes, il est possible de créer de parfaits combos dont la puissance peut faire changer le cours du jeu et détruire son adversaire. Plus un joueur est bon développeur, plus il a de chances de remporter la victoire.

La Machine aime les braves et les courageux.

<a name="prerequis"></a>
## Prérequis

Pour jouer à MemoryOverflow il faut que chaque joueur dispose d'un set de cartes ainsi qu'un set supplémentaire de cartes _The Machine_ que l'un ou l'autre peut apporter.

Toutes ces cartes sont disponibles **gratuitement** sur le [site officiel](http://memoryoverflow.codecorico.com) et peuvent être imprimées en suivant l'aide disponible sur la page d'impression. La Machine est généreuse.

:heavy_exclamation_mark: Attention, chaque carte utilisée dans un set doit être dans sa dernière version. En cas de doute, il suffit d'inscrire dans le champs de recherche du site l'identifiant de la carte (trouvé dans son coin inférieur droit) pour vérifier qu'elle n'est pas obsolète. La Machine n'aime pas les tricheurs.

<a name="partie"></a>
## Le déroulement d'une partie

Avant de commencer une partie, chaque joueur doit disposer d'un set composé d'au minimum 60 cartes et maximum 70 qui composera son jeu. On appelle ce set _[La Noosphère](http://fr.wikipedia.org/wiki/Noosph%C3%A8re)_ en hommage aux idées qui nous arrivent lorsque l'on code sans savoir exactement d'où elles proviennent. Pour construire une Noosphère il faut choisir parmi les [3 types de cartes](#types) communes. Hormis pour les cartes _[Variable](#variable)_ il n'est pas permis de prendre plus de 2 fois la même carte, sauf bien sur si la carte en question indique le contraire. Il est conseillé de mettre au moins 20% de cartes _Variable_ pour être certain d'en piocher suffisamment rapidement et ne pas bloquer son jeu dés le départ.

Une fois que vous avez votre Noosphère il vous faut créer un set de 10 cartes _Machine_ déjà définies par le jeu, à savoir :
- 3 cartes de valeur _18_
- 3 cartes de valeur _19_
- 3 cartes de valeur _20_
- 1 carte de valeur _22_

Ces cartes constituent le set appelé _La Machine_.

Pendant une partie les joueurs construisent des algorithmes, chacun leur tour, en plaçant des cartes sur la table. Le but du jeu est de créer un ou plusieurs algorithmes qui permettent à une variable d'atteindre le même nombre que le code demandé par La Machine pour la déverrouiller ([lire l'histoire du jeu](story.fr-FR.md)). La Machine affiche son code clairement mais attention, elle le change aussi très souvent. Si jamais une variable dépasse le code demandé, le joueur est détruit par La Machine, il perd la partie. La Machine est colérique.

Il existe de nombreuses stratégies pour décoder La Machine rapidement ou au contaire pour faire perdre l'adversaire. Un joueur qui arrive à combiner ces deux aspects du jeu peut être redoutable.

<a name="plateau"></a>
### Le plateau de jeu

<p align="center">
  <img src="images/game-board.jpg" />
</p>

<a name="engagements"></a>
### Engagements/désengagements

En de nombreux endroits dans les règles du jeu il est question d'_engagement_ et de _désengagement_ des cartes. Engager une carte revient à l'**activer**. Dans ce cas il faut tourner la carte à 90° vers la droite pour qu'elle soit couchée (comme **(3.b)**). La désengager revient à la **désactiver** et à la remettre dans son état original, à la verticale.

<a name="debut"></a>
### Débuter une partie

Pour commencer une partie, les deux adversaires se placent l'un en face de l'autre. Chacun dépose sa Noosphère sur la table **(1)**, bien mélangée et coupée par le joueur opposé.

Chaque fois qu'une carte d'un joueur est détruite elle doit être placé dans une pile sur la droite de la Noosphère, face visible. Cette pile se nomme le _Garbage collector_ **(2)**. Il est possible que certaines cartes utilisent le _Garbage collector_ pour des actions spécifiques.

Il faut ensuite placer le set de cartes _The Machine_ **(5)** (qu'un des deux joueurs aura apporté) faces cachées au milieu de la table entre les deux joueurs.

Les joueurs tirent au sort pour déterminer lequel des deux commence.

Une partie est composée de tours. Un tour appartient à un joueur et contient plusieurs phases expliquées plus loin. Lorsqu'il est terminé, le joueur suivant prend la main et débute son propre tour.

<a name="tour"></a>
### Les phases d'un tour

Un tour est constitué de 5 phases que le joueur doit respecter dans l'ordre :
- La phase de La Machine
- La phase de réfactorisation
- La phase de pioche
- La phase d'action
- La phase d'engagement

#### La phase de La Machine

Avant qu'un joueur ai le droit de jouer, La Machine a son mot à dire.

Lors du tout premier tour, le joueur qui commence pioche une carte _Machine_ puis la place face visible sur le coté **(5.b)**. C'est ce code qui devra être résolu pendant les prochains tours de jeu. Le joueur pioche ensuite une seconde carte Machine qu'il place face visible sur le dessus du tas de carte **(5.a)**. Cette carte sera le prochain code demandé par La Machine. La Machine permet de le voir en avance pour préparer de futures stratégies. La Machine est votre amie.

Lors des autres tours, durant cette phase, le joueur doit faire tourner de 90° la carte Machine active dans le sens des aiguilles d'une montre. Au bout de 4 tours, la carte retourne à sa position d'origine **(5.b)** ce qui indique que le code est périmé. Il est temps de passer au prochain. Il faut donc placer la carte qui est sur le dessus du tas **(5.a)** sur la carte de code actuelle **(5.b)** et tirer une nouvelle carte à placer sur le dessus du tas.

Si jamais il n'y a plus aucun carte Machine à tirer, le joueur reprend toute la pile de La Machine et recommence la suite de codes comme au premier tour. La Machine sait redémarrer.

#### La phase de réfactorisation

Une fois que La Machine a remplit ses actions, le joueur peut enfin commencer son tour. La Machine est gentille.

Cette phase est très simple, il faut au joueur désengager toutes ses cartes _Variable_. Elles n'ont plus d'effet sur La Machine. Il lui faut ensuite engager toutes ses cartes _Événement_ qui ne sont pas encore engagées. A partir de maintenant il peut les utiliser. (Plus de détails dans la suite des explications).

#### La phase de pioche

Le joueur pioche une nouvelle carte dans sa Noosphère. Si jamais il n'y a plus aucune carte à piocher il est obligé de déclarer forfait car il n'a plus aucune idée. La Machine n'aime pas les paresseux.

#### La phase d'action

Cette phase permet au joueur de construire ses algorithmes. Il peut poser sur la table :
- Une seule carte _Variable_ **(4)**.
- Autant de cartes _Code_ qu'il le souhaite **(4)**.
- Une seule carte _Événement_ **(3)** (désengagée et face cachée).

:heavy_exclamation_mark: Attention de bien lire les effets secondaires de certaines cartes qui peuvent s'appliquer immédiatement pendant cette phase.

Le principe est de toujours brancher ses cartes ensemble. Une carte _Code_ ne peut exister seule sur la table si elle n'est pas branchée logiquement à une _Variable_ ou une autre carte _Code_. Dans ce cas là, elle doit être détruite à la fin de cette phase. La Machine n'aime pas le code commenté.

Sur la présentation du [plateau de jeu](#plateau) la carte **(4.a)** est une _Variable_ et les cartes **(4.b)** sont deux cartes _Codes_ branchées les unes derrières les autres, le tout formant un algorithme.

Sur la figure **(4.c)** une carte _Code_ est branchées sur 2 cartes _Variable_.

Il est possible d'avoir des cartes _Variable_ libres comparé aux cartes _Code_.

#### La phase d'engagement

Dans cette dernière phase, le joueur doit engager toutes ses variables. Elles activent donc tous les algorithmes du joueur et calculent leurs points. Ces variables restent engagées jusqu'à la prochaine phase de réfactorisation du joueur, lors de son prochain tour. Si les points d'une _Variable_ dépasse à n'importe quel moment le code de La Machine, cette dernière détruit immédiatement le joueur, il perd la partie. La Machine aime l'odeur de la chair brulée.

Pendant que les variables d'un joueur sont engagées, plusieurs cas peuvent se produire :
- L'adversaire est capable, avec des cartes _Événement_, d'augmenter les variables du joueur et ainsi le faire passer en _Memory Overflow_
- La Machine change de code durant sa phase et peut détruire le joueur si le code est plus petit que les points d'une variable, ou à l'inverse le faire gagner si le code est en phase avec les points.

Il faut donc faire bien attention à préparer en avance sa stratégie car une fois les variables engagées, le risque d'un _Memory Overflow_ augmente considérablement. La Machine vous surveille. Même lorsque ses cartes sont rangées.

A la fin de cette phase, si le joueur possède plus de 7 cartes dans sa main, il est obligé d'en détruire autant qu'il faut pour toujours n'en garder que 7. La Machine est radine en allocation de mémoire.

<a name="evenements"></a>
### Les événements

Les cartes _Événement_ **(3)** ont un statut particulier comparé aux cartes _Variable_ et _Code_. Elles ne peuvent être utilisées le premier tour où elles sont placé sur la table. C'est pourquoi lors de la phase d'action le joueur les place de manière désengagées **(3.a)**. Au prochain tour, lors de la phase de réfactorisation, il engagera les cartes _Événement_ qui n'avaient précédemment pas pu être utilisées.

Il n'est pas possible d'avoir plus de 4 cartes _Événement_ dans le jeu d'un joueur, qu'elles soient engagées ou non.

Une carte _Événement_ engagée peut être jouée à *n'importe quel moment de n'importe quelle phase de n'importe quel joueur*. L'unique phase dans laquelle elle n'a pas le droit d'intervenir est la phase de La Machine. La Machine ne le permet pas. Elle est La Machine. Ces cartes font office de pièges la plupart du temps et s'avèrent être très stratégique pour faire des combos.

Lorsque l'une de ces cartes est jouée, elle est immédiatement détruite, sauf cas contraire indiqué sur la carte.

### Le Memory Overflow

Le _Memory Overflow_ est le grand piège du jeu. Telle la boule 8 d'un billard, il est possible de déclencher la mort subite d'un joueur. Pour remporter la partie, les joueurs doivent se rapprocher le plus possible du code de La Machine tout en se risquant à un _Memory Overflow_ ce qui oblige à créer de véritables stratégies de vitesse et d'intelligence.

:heavy_exclamation_mark: Attention, lorsque les variables d'un joueur sont engagées, il est possible qu'une de ses variables ai le même nombre de points que le code tandis qu'une autre ai le cas d'un _Memory Overflow_. Quoi qu'il arrive, c'est le _Memory Overflow_ qui l'emporte et le joueur est détruit. La Machine ne rigole pas avec ces choses là.

Comme pour le jeu des Echecs, où le joueur perdant abaisse son roi, il est de coutume dans MemoryOverflow de prendre la carte Machine et de la poser face cachée sur le jeu du joueur perdant. La Machine est fière.

<a name="types"></a>
## Les 3 types de cartes jouables

Il existe en tout 4 types de cartes. Les carte de La Machine ainsi que les cartes jouables dans les Noosphères des joueurs.

<a name="variable"></a>
### La variable

La carte _Variable_ est le point de départ des algorithmes. Il est aussi bien possible de brancher des cartes _Code_ dessus que de la brancher elle-même sur ces cartes. Hormis certaines cartes rares, sa seule fonction est d'initialiser une variable qui contiendra des points incrémentés par les algorithmes.

Ce sont les points que va prendre cette carte qui sont comparés au code de La Machine et permettent de déverrouiller cette dernière.

<a name="code"></a>
### Le code

La carte de _Code_ est une partie de l’algorithme qui permet d'ajouter ou supprimer des points aux variables. Pour trouver le code exact de La Machine, il faut faire preuve de ruse et créer des algorithmes modifiables à volonté.

A n'importe quel moment au cours du jeu il est possible de modifier ses branchements de _Code_ et de _Variable_. Cela permet de recycler les cartes qui n'auraient plus de branchement ou tout simplement d'éviter le _Memory Overflow_. Certaines stratégies se basent sur la création de faux algorithmes modifiables en cours de partie pour créer le code de La Machine sans que l'adversaire ne l'ai anticipé.

<a name="evenement"></a>
### L'évènement

La carte _Événement_ est synonyme de carte piège. Elle permet aussi bien de renforcer son jeu que de détruire celui de l'adversaire. Néanmoins il faut faire très attention. Il est possible de contrer une carte _Événement_ par une autre carte _Événement_ ce qui peut déboucher à des suites de contre-attaques où le premier attaquant n'est pas forcement celui qui s'en sort le mieux.

<p align="center">
  <img src="images/the-machine.jpg" />
</p>