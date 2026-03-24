---
title: "Tackling badly-written software"
description: "For too long I had grappled with this codebase - tangled, confusing, complicated - and was finally able to turn it into the simple solution that it always could have been - here's how I did it!"
date: 2026-03-18
tags: ["People", "Architecture"]
image: https://a.storyblok.com/f/325167/1536x1024/9683e769b1/chatgpt-image-mar-23-2026-10_51_27-pm.png
imageAlt: ""
---

## What was so bad about it?

- **Inconsistent terminology**: the domain language used was not consistent across the code base. The same things were referred to by multiple different terms
- **Tangled code**: hurried code edits without peer review further compounded the problem of poor terminology and led to duplicated code, _almost-duplicated_ code (code that was so similar it could have been collapsed together with some switches, but it wasn't, hugely increasing the bug space, and causing drift).
- **The bigger picture**: it was difficult to understand where this software sat in the bigger picture of the organisation we were working for - we had failed to extract the full context from the client.
- **Passed around lots of hands**: not necessarily a problem if all of the above points have been suitably met - but learnings, context and terminology were not adequately handed over as the project changed hands.
- **Lack of adequate review**: careful and challenging review of code changes was just not happening - reasons for this are explored later
- **Poor data model**: further to the problems with the domain model, the data model and the design of the database was not optimal - foreign key constraints were missing, columns poorly named.
- **Untestable**: the structure of the code made unit or functional testing very difficult. Classes were long, rambling with many dependencies and had no clear purpose. Data-loading logic was mixed up with domain-specific logic, meaning that trying to target tests at the 'important stuff' was borderline impossible!
- **Intertwined with other products**: this project was also a dependency of another business-critical tool, making changes difficult to co-ordinate and justify.

## What did I do about it?

To me, the most important things in software engineering are:

- Using the correct domain language
- Testability
- Data model is king

Therefore, I took the following approach:

- **Held a clarification session** with the client to talk through the problems - from both a product and a technical perspective - and come up with a plan
- **Started a glossary**, ensuring that terminology could be better shared between team members present and future
- **Better database object naming** - if a table holds a list of apples, call it `Apples` - it makes reasoning about future bugs far easier!
- **Strangle out the old code**. Don't try to salvage the old code in-place - it's the road to madness, as fundamentally its foundations are bad. Create a new, separate API for the new, clean code - fully tested, well separated and very understandable. But - critically - leave the old API in place, and as API endpoints are replaced, forward requests from the old system to the new system, until the old system is fully 'strangled out' - this is known as the [Strangler Fig](https://martinfowler.com/bliki/StranglerFigApplication.html) approach.
- **Don't over-engineer**. As software engineers we can get into habits - introducing high levels of abstraction, very high efficiency, zero code duplication - but often fail to realise that sometimes this is just not necessary, takes a load of time and clouds the software's true intentions. Why optimise your system for 1,000,000 requests per second if it's only used once a week by 3 people?
- **Be right, not fast** - this is the time to be calm, take time and model the right solution - this situation was partly created by trying to be fast in the first place!

## Going forwards

Time will tell whether this has been the right approach - but I'm confident. This solution is now more:

- Testable
- Understandable
- Accurate
- Maintainable

So we're now standing on good foundations!
