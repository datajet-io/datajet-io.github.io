Datajet's homepage uses Jekyll, a blog-aware, static site generator. For more info and installation instructions check: [Jekyll](http://jekyllrb.com/)

## Adding a blog post

**1. Write your post**

Jekyll lets you write the blog posts in Markdown right out of the box. If you'd like to use some other format, check their documentation [here](http://jekyllrb.com/docs/posts/#content-formats).

Checkout these packages for atom, they might help: [markdown-preview-plus](https://github.com/Galadirith/markdown-preview-plus) and [markdown-writer](https://atom.io/packages/markdown-writer).

**Important:** Blog posts must be named according to the following format: _YEAR-MONTH-DAY-title.MARKUP_ (MARKUP is the file extension corresponding to the format you're using; e.g. _md_ for markdown).

**Important:** All blog post files must start with the following YAML front matter:

    ---
    layout: post
    title: Blogging Like a Hacker
    ---

**2. Save your post under _ _posts_**

**3. Preview**

Run `jekyll serve` and navigate to your local instance of datajet's homepage.

**4. git add, commit, push**
