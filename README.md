# PaulRBerg.github.io

I use this GitHub Pages site to host my presentations.

## Domain

The canonical domain name for this site is [prberg.com](https://prberg.com), but you can also access it via
[PaulRBerg.github.io](https://PaulRBerg.github.io).

## Jekyll

GitHub Pages uses [Jekyll](https://jekyllrb.com/docs/installation/macos/) for building websites from repository
contents.

### Versioning

Check out the latest dependency versions [here](https://pages.github.com/versions).

It is recommended to stick with Ruby@3.2 for the time being to avoid a
[versioning hell](https://ritviknag.com/tech-tips/ruby-versioning-hell-with-jekyll-&-github-pages/).

### Excluded Files

By default, Jekyll excludes certain files from the build process, such as files and folders that start with a dot (`.`)
or an underscore (`_`).

For guidance on how to exclude more files, see my
[conversation with ChatGPT](https://chat.openai.com/share/ebb35efe-114f-4924-a15e-d68db3733163).

## Commands

### Install dependencies

```shell
$ bundle install
```

### Run site locally

```shell
$ bundle exec jekyll serve
```
