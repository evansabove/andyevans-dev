---
title: "Being ignored? Find out why with git check-ignore"
description: "Have you got files being ignored in source control and you don't know why? Git's got your back. Here I demonstrate git's secret weapon: check-ignore"
date: 2025-07-14
tags: ["Git"]
image: https://a.storyblok.com/f/325167/1792x1024/6dcaf02cf9/automating-pr-descriptions.webp
imageAlt: ""
---

I'm the first to admit that my git knowledge isn't the greatest. Sure, I can get by - do what I need to do - but I'm by no means an expert.  I'm hoping that by doing a few of these posts on my favourite git features it will inspire me to learn more!

## Situation

I had picked up a project from someone else, and wasn't too familiar with the code base. I needed to add a file to the repository - an executable file that was needed as a dependency to run the code locally.

I added it to the repository but it didn't show up in the pending changes section of my editor.

Instantly I recognised that this file was being ignored with the `.gitignore` file - it was just a case of finding the rule! This particular repository was home to a number of different sub-projects in different languages. Each of these directories had a different `.gitignore`, and there was one at the top level. I started scratching round in these files, trying to find the rule causing the exclusion. I thought that there must be a better way to find it. On a whim, I did a quick google search and sure enough I found a solution!

## Solution

The `check-ignore` feature of git can help us here. Simply, I ran the following in my repository:

`git check-ignore -v bin/my-ignored-file` 

And this tells my exactly which rule in which gitignore file is causing me the problem:

`my-project/.gitignore:99:bin/    "bin/my-ignored-file"`

## Explanation

Let's unpack what all this means:

- `my-project/.gitignore` is the location of the `.gitignore` containing the offending rule.
- `:99:bin/` this means that on line 99 of the .ignore file, there is a `bin/` rule, and it's this one that's causing the problem.
- `bin/my-ignored-file` the missing file.

Then you can make any adjustments you like. For me, I wanted to keep the `bin/` rule, but include one the one dependency. So I added the following rule to my `.gitignore`:

`!bin/my-ignored-file` 

And then I could commit my file  

Happy committing!
