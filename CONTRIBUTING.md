# C.A.M. Central Agency of the Machine

<p align="center">
  <img src="rules/images/Central Agency of The Machine.png" width="300" />
</p>

Welcome to the C.A.M.. This agency was designed by The Machine to improve herself and her content. When you contribute to the project you become a Special Agent of The Machine. The Machine needs you to make her brain more intelligent, to make new cards, more templates, to translate the website, etc.

The Machine loves her Agents. The more you contribute, the more she will love you.

But, like every agency of this size there are rules that must be respected. The Machine is in _strict_ mode.

 - [Code of Conduct](#coc)
 - [Question or Problem?](#question)
 - [Issues and Bugs](#issue)
 - [Feature Requests](#feature)
 - [Want a Wiki Fix?](#wiki)
 - [Submission Guidelines](#submit)
 - [Coding Rules](#rules)
 - [Commit Message Guidelines](#commit)
 - [Releases](#releases)
 - [Further Info](#info)

## <a name="coc"></a> Code of Conduct
As Special Agent, your first goal is to lead by example. You have to respect other agent who contributes by posting issues, updating cards, submitting pull requests, providing feedback in comments, and any other activities.

Communication through any of MemoryOverflow's channels (GitHub, Gitter, mailing lists, Google+, Twitter, etc.) must be constructive and never resort to personal attacks, trolling, public or private harrassment, insults, or other unprofessional conduct.

The Machine respect everyone is involved in this agency regardless of gender, gender identity, sexual orientation, disability, age, race, ethnicity, religion, or level of experience. She expects no less of his agents.

If any Special Agent violates this code of conduct, The Machine or her leader agents may take action, removing issues, comments, and PRs or blocking accounts as deemed appropriate.

## <a name="question"></a> Got a Question or Problem?

If you have questions about how to use MemoryOverflow, please direct these to the discussion chat [![Discussion chat](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/CodeCorico/MemoryOverflow) or [StackOverflow](http://stackoverflow.com/questions/tagged/memoryoverflow).

## <a name="issue"></a> Found an Issue?
If you find a bug in the source code or a mistake in the wiki, you can help The Machine by
submitting an issue to the [GitHub Repository](https://github.com/CodeCorico/MemoryOverflow). Even better you can submit a Pull Request with a fix. The machine will be very happy.

**Please see the Submission Guidelines below**.

## <a name="feature"></a> Want a Feature?
You can request a new feature by submitting an issue to the [GitHub Repository](https://github.com/CodeCorico/MemoryOverflow). If you would like to implement a new feature then consider what kind of change it is:

* **Major Changes** that you wish to contribute to the project can be discussed first on the
[chat](https://gitter.im/CodeCorico/MemoryOverflow) so that The Machine can better coordinate efforts, prevent
duplication of work, and help you to craft the change so that it is successfully accepted into the
project.
* **Small Changes** can be crafted and submitted to the [GitHub Repository](https://github.com/CodeCorico/MemoryOverflow) as a Pull Request.

A new issue create a discussion thread. The special agents can advise and contribute to your ideas. Please search whether the subject does not already exists on the [opened issues](https://github.com/CodeCorico/MemoryOverflow/issues?q=is%3Aopen+is%3Aissue) before that to prevent duplicates issues.

### Write a User Story for a new feature

The Machine was builded for a unique goal: serve humains. To help them she must first understand how they think. So she needs so-called [User Story](http://en.wikipedia.org/wiki/User_story).

In MemoryOverflow, a feature needs to be in a _user story_ format that represent a user/player's real expectations. When you create a new issue, use this format to explain your request:

"As a **_role_**, I want **_goal/desire_** so that **_benefit_**"

Describe with details your role, like _daily player_ or _windows developer_ and don't forget the benefit. You can add other informations to be more understanding. Optionnaly you can add a list of **technical criteria**.

The Machine is in your mind.

## <a name="wiki"></a> Want a Wiki Fix?
The GitHub project is designed to run like a Wiki. Each folder has a README.md file to describe the way it works. The Agents can know exactly how to help The Machine. If you want to help improve the wiki, it's a good idea to let others know what you're working on to minimize duplication of effort. Before starting, check out the issue queue for [Tag: wiki](https://github.com/CodeCorico/MemoryOverflow/issues?labels=wiki&page=1&state=open).
Comment on an issue to let others know what you're working on, or create a new issue if your work
doesn't fit within the scope of any of the existing wiki fix projects.

## <a name="submit"></a> Submission Guidelines

You're trying to work on The Machine brain. Did you think it was that simple?

### Submitting an Issue
Before you submit your issue please search the archive, maybe your question was already answered.

If your issue appears to be a bug, and hasn't been reported, open a new issue.
Help other agents to maximize the effort they can spend fixing issues and adding new
features, by not reporting duplicate issues. Providing the following information will increase the
chances of your issue being dealt with quickly:

* **Overview of the issue** - if an error is being thrown a non-minified stack trace helps
* **Motivation for or Use Case** - explain why this is a bug for you
* **Version(s)** - is it a regression?
* **Browsers and Operating System** - is this a problem with all browsers or only IE8?
* **Reproduce the error** - provide a live example (using [Plunker][http://plnkr.co] or
  [JSFiddle][http://jsfiddle.net]) or a unambiguous set of steps.
* **Related issues** - has a similar issue been reported before?
* **Suggest a Fix** - if you can't fix the bug yourself, perhaps you can point to what might be
  causing the problem (line of code or commit)
* **Cards Rules** - is this a cards rules problem?

**Agents work together. They never leave anyone behind.**

### Submitting a Pull Request
Before you submit your pull request consider the following guidelines:

* Search [GitHub pulls](https://github.com/CodeCorico/MemoryOverflow/pulls) for an open or closed Pull Request
  that relates to your submission. You don't want to duplicate effort.
* Make your changes in a new git branch

     ```shell
     git checkout -b my-fix-branch master
     ```

* Create your patch, **including appropriate test cases**.
* Follow the [Coding Rules](#rules).
* Commit your changes using a descriptive commit message that follows the
  [commit message conventions](#commit-message-format).

     ```shell
     git commit -a
     ```
  Note: the optional commit `-a` command line option will automatically "add" and "rm" edited files.

* Push your branch to GitHub:

    ```shell
    git push origin my-fix-branch
    ```

* In GitHub, send a pull request to `MemoryOverflow:master`.
* If other agents suggest changes then
  * Make the required updates.
  * Rebase your branch and force push to your GitHub repository (this will update your Pull Request):

    ```shell
    git rebase master -i
    git push -f
    ```

That's it! You're now a true new Special Agent!

#### After your pull request is merged

After your pull request is merged, you can safely delete your branch and pull the changes
from the main (upstream) repository:

* Delete the remote branch on GitHub either through the GitHub web UI or your local shell as follows:

    ```shell
    git push origin --delete my-fix-branch
    ```

* Check out the master branch:

    ```shell
    git checkout master -f
    ```

* Delete the local branch:

    ```shell
    git branch -D my-fix-branch
    ```

* Update your master with the latest upstream version:

    ```shell
    git pull --ff upstream master
    ```

## <a name="rules"></a> Coding Rules
To ensure consistency throughout the source code, keep these rules in mind as you are working:

* All features or bug fixes **must be tested** by one or more agents.
* All new or modified cards **must be documented and changelog updated** in their folders.

## <a name="commit"></a> Git Commit Guidelines

The Machine have very precise rules over how the git commit messages can be formatted. This leads to **more
readable messages** that are easy to follow when looking through the **project history**.

### Commit Message Format
Each commit message consists of a **header**, a **body** and a **footer**.  The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on github as well as in various git tools.

### Type
Must be one of the following:

* **mo**: Modifications on MemoryOverflow project details (wiki)
* **feat**: A new feature
* **fix**: A bug fix
* **card**: Card modification or added
* **rules**: Modifications on rules
* **tpl**: Modifications on templates
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing
  semi-colons, etc)
* **refactor**: A code change that neither fixes a bug or adds a feature
* **perf**: A code change that improves performance


### Scope
The scope could be anything specifying place of the commit change. For example `name of a card`,
`the machine feature`, `rule name`, etc...

### Subject
The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

###Body
Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes"
The body should include the motivation for the change and contrast this with previous behavior.

###Footer
The footer should contain any information about **Breaking Changes** and is also the place to
reference GitHub issues that this commit **Closes**.

## <a name="releases"></a> Releases

Only The Machine Lead Agents team can publish a new version. To do that, it requires that the milestone is completely finished ([Milestones](https://github.com/CodeCorico/MemoryOverflow/milestones)).

Publish the new version:
* Pull the last version of `master` branch
* Update CHANGELOG.md file with the actual date and links of the milestone
* Create commit with its last changes named: `Version [new version number]`
* Create a new tag on this commit named `[new version number]`
* Push this branch to `GitHub:master`
* Push this branch to a new branch `GitHub:release/[new version number]`


## <a name="infos"></a> Further Info

Inspired file from https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md
