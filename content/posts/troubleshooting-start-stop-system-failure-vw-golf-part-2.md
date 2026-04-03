---
title: "Troubleshooting the start-stop system failure on my VW Golf - Part 2"
draft: true
description: "Usually I write these blog posts after I've fixed the problem - but this time I'm writing it as I go. Join me as I gather information and build a list of ideas."
date: 2026-04-03
tags: ["Automotive", "Debugging"]
image: /images/posts/troubleshooting-start-stop-system-failure-vw-golf-part-1/dash.jpg
imageAlt: "VW Golf dashboard with a start-stop system failure warning light illuminated"
---

## Part 2 - The Investigation Continues

If you haven't read part 1 yet, read that first to understand how I shortlisted a bunch of ideas for what might be happening. [Read it here](/posts/troubleshooting-start-stop-system-failure-vw-golf-part-1/)

Let's remind ourselves of the list of ideas we came up with last time around:

```
Idea 1: Weak or failing battery
Idea 2: Faulty sensor or switch
Idea 3: Faulty IBS sensor
Idea 4: Stored ECU fault codes
Idea 5: Alternator or charging faults
Idea 6: Battery coding failure
Idea 7: CAN bus C physical wiring problem
Idea 8: DPF regen is considered active (even if it isn't)
Idea 9: Driver door considered open (even if it isn't)
```

I'll use the same approach as I use with any system that I'm troubleshooting. If there are easy things we can tick off, then let's do those first. It's a bit like the 'fail-fast' approach, reducing the noise so we can concentrate on the more difficult stuff later on if we need to.

## Investigation 1: Battery and charging system

This tackles ideas 1, 3, 5 and 6. 

### Battery voltage

In terms of the battery health, there were a few basic things to be checked first - firstly that the battery was holding a good voltage at rest, and that it was showing a raised voltage when the engine is running. This would tell us if the battery was being charged properly by the alternator. 

I checked this with a multimeter - and these were the results:

- Battery at rest: `12.63V`
- Battery with engine running: `14.78V`

<figure>
<img src="/images/posts/troubleshooting-start-stop-system-failure-vw-golf-part-2/battery-charging.jpeg" alt="Battery charging" />
<figcaption>Battery charging</figcaption>
</figure>

These are both great values, so we can be confident that the battery is healthy and that the alternator is charging it properly. 

### Battery SOC

The other way we can verify this is a VW-specific diagnostic tool built into the car itself. With the ignition off, holding the trip-reset button cycles through a diagnostic menu. Letting go of the button at the right time brings up the `Battery SOC` display which tells us the state of charge of the battery. 

<figure>
<img src="/images/posts/troubleshooting-start-stop-system-failure-vw-golf-part-2/soc-healthy.jpeg" alt="Battery SOC healthy" />
<figcaption>Battery SOC healthy</figcaption>
</figure>

This shows the SOC at `80%`, which seems like a pretty good value to me, and a little searching around confirms this.

I was also able to prove that the Intelligent Battery Sensor (IBS) was working correctly. By disconnecting the IBS, the SOC report then showed `---` instead of a percentage. Plugging it back in restored the percentage. So the IBS seems to be correctly reporting a battery status - so we can believe that this too is working correctly.

<figure>
<img src="/images/posts/troubleshooting-start-stop-system-failure-vw-golf-part-2/ibs-disconnected.jpeg" alt="IBS disconnected" />
<figcaption>IBS disconnected</figcaption>
</figure>

<figure>
<img src="/images/posts/troubleshooting-start-stop-system-failure-vw-golf-part-2/soc-invalid.jpeg" alt="IBS reconnected" />
<figcaption>SOC invalid</figcaption>
</figure>

### Battery coding

TBC

So that's the battery and charging system ticked off the list - all good here! 

Let's take a look at the list of remaining ideas:

```
Idea 2: Faulty sensor or switch
Idea 4: Stored ECU fault codes
Idea 7: CAN bus C physical wiring problem
Idea 8: DPF regen is considered active (even if it isn't)
Idea 9: Driver door considered open (even if it isn't)
```

