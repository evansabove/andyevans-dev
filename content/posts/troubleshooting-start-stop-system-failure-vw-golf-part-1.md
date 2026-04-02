---
title: "Troubleshooting the start-stop system failure on my VW Golf - Part 1"
description: "Usually I write these blog posts after I've fixed the problem - but this time I'm writing it as I go. Join me as I gather information and build a list of ideas."
date: 2026-04-02
tags: ["Automotive", "Debugging"]
image: /images/posts/troubleshooting-start-stop-system-failure-vw-golf-part-1/dash.jpg
imageAlt: "VW Golf dashboard with a start-stop system failure warning light illuminated"
draft: false
---

## The problem

Each time I start my car I'm presented with this message on the dash: "Error: start-stop system".

It does not elaborate further. No other errors are present. Well - apart from one: this car is fitted with an adaptive cruise control system (ACC), which has never worked for as long as I've had the car - and I get an error message for that too. However, when I picked up the car, the start-stop (SS) system _did_ work - so I know that this problem is _probably_ not related to the ACC failure. It just stopped working one day.

## What is the start-stop system?

In many cars, such as this one, the engine should automatically stop when the car is stationary and with the gearbox in neutral and the clutch raised. The engine will then restart automatically when the clutch is depressed or the brake pedal is released. It's intended to reduce fuel consumption and emissions, but has some downsides as well (some argue that increased engine, turbocharger and starter motor wear can occur).

## So why show the debugging process?

Because...well, I've actually already tried to fix this, and haven't managed it yet.

I have tried a number of things, researched a bunch of ideas and haven't really got very far. I'm determined to fix it - and by voicing everything in this blog post, perhaps I might!

## Why not just take it to a garage?

I could absolutely do this, if I wanted to just get the problem solved and learn nothing! I don't have a desperate need for this feature, it won't cause the car to fail an MOT inspection. But it used to work, and all of a sudden it didn't - and I'm curious to know why. And I don't like seeing errors. Oh, and...I don't like spending money!

## Background info

Before we dig in to the debugging process, here's a bit of background information on this particular car. 

It's a 2013 VW Golf Mk7 2.0 TDI, and it did have a couple of water leaks when I bought it. First, it had a leak in the boot - a well documented problem with the Mk7 Golf. Secondly, it had a leak in the driver's footwell. I also fixed both of these leaks myself. Because of the presence of water in the cabin, I could be dealing with some water-induced wiring corrosion. That's just a theory though, and is definite guesswork at this stage!

## The Approach

So what's the idea? 

One of my debugging mottos is: **if you don't know what to do next, just gather information** - even if you think it might be unrelated. Just flesh out the picture. Challenge your assumptions. That thing which you're so sure is right? Go and check it and make sure.

So that's what I'm doing here. Let's gather some information.

## 1. Google

Pretty much my first stop for everything (though that is changing a little in these days of AI and ChatGPT).

I google the exact error message and read a few of the articles which seem to describe my problem. My search term looks something like `vw golf mk7 error: start stop system`.

Google's AI results suggests a weak or failing battery could be to blame - but says that this would most likely be accompanied by an engine warning lamp or limp mode / engine misfires. This is not what I am experiencing. Also, my battery was replaced only a few months ago, so this is an unlikely candidate but I can't rule out the new battery also having problems. Let's start a list of the ideas that come up:

```
Idea 1: Weak or failing battery
```

It also suggests that a problem with a sensor or switch could be to blame - e.g. the clutch pedal switch or engine temperature sensor. This makes sense - in order for the SS system to work, it takes signals from several places around the car in order to sense whether it's safe / efficient to stop the engine. If one of these isn't working, it could disable the SS feature. Let's add that to the list too, keeping it high level for now:

```
Idea 1: Weak or failing battery
Idea 2: Faulty sensor or switch
```

## 2. ChatGPT

I asked ChatGPT the following question:

```
VW Golf Mk7. Getting the following error when starting the vehicle: "Error: SS system". It happens every time I start the car. This used to work, but all of a sudden stopped working.
```

ChatGPT surmises that this is a very common issue on this make and model of vehicle, and that the SS system is very sensitive to a number of conditions, which if not met precisely then cause the SS system to be disabled.

Again it suggests a weak or failing battery, along with the following ideas:

- Faulty IBS (Intelligent Battery Sensor) - located on the negative battery terminal, this tells the ECU the battery voltage. If this isn't working, the ECU won't know the battery's state of health and will disable the SS system.
- Stored ECU fault codes, if there are any, if they are related to the SS system.
- Alternator or charging faults (again, tied into the battery health)
- Battery coding failure - modern batteries need to be coded to the car so that the ECU knows how to charge them properly. If the battery has been replaced without being coded, then the SS system will be disabled. However - I replaced the battery myself and did the coding - and I believe I did that correctly, but it's worth checking! Also, the fault was present before the battery was replaced, and remained afterwards.

These ideas can go on the list as well:

```
Idea 1: Weak or failing battery
Idea 2: Faulty sensor or switch
Idea 3: Faulty IBS sensor
Idea 4: Stored ECU fault codes
Idea 5: Alternator or charging faults
Idea 6: Battery coding failure
```

This is a good list of ideas. Let's see what the car has to say for itself.

## OBD Eleven code reader

I have an <a href="https://obdeleven.com">OBD Eleven code reader</a>. It's not a dealer level tool, just a consumer-level bluetooth code reader that works on a number of brands of car, showing you fault codes and allowing you to make changes to the car's settings from an app. So I plugged it in and took a look at the list of fault codes. Here's what I found:

```
1. Data bus missing message
2. Function restricted due to missing message
3. Function restricted due to communication interruption
4. Lost communication with cruise control front distance range sensor
5. Vehicle communication bus C (-) shorted to Bus C (+)
```

Feels like a lot, doesn't it! In truth, every car I've ever read codes from has had a list of codes like this. Some may be significant, some not, and it's our job to figure it out. A better, or more specific VW tool (like <a href="https://www.ross-tech.com/vag-com/VCDS.php">VCDS</a>) may give us better ideas. But I don't have access to that....yet. Let's unpick these fault codes one-by-one.

### Data bus missing message

This is a generic error message that can be caused by a number of things. It essentially means that some data sent on the vehicle's data bus didn't arrive when or where it was expected to. Many forum threads lay blame at the battery for this problem - but my battery is only a few months old, so it's unlikely to be the cause.

### Function restricted due to missing message

Similar to the message above - a general 'packet lost' sort of message. Again, I'm discounting this error at this point in time. It's likely a symptom of another problem, not the root cause.

### Function restricted due to communication interruption

Again, a generic message. I'm discounting this for now.

### Lost communication with cruise control front distance range sensor

As mentioned before, this is a known issue that was previously present on this car - the adaptive cruise control was not working when purchased. And, I know that the SS used to work, so it's unlikely to be related.

### Vehicle communication bus C (-) shorted to Bus C (+)

Now this is the one that caught my eye. What could be going on here? It suggests that the power and ground wires of the CAN bus system have been shorted together at some point. This is what could be causing the other error messages - a physical wiring problem - but it's also possible that it's related to something else entirely. 

According to Google, The VW Golf CAN Bus C (Powertrain CAN) is "a high-speed, 500 kbit/s network connecting critical modules like the ECM, ABS, and DSG/transmission". However, ChatGPT is telling me that CAN Bus C is actually the 'comfort' bus - things like electric windows and interior lights. So I'll need to do a bit more investigation to figure out which bus this relates to. Let's add it to the list:

```
Idea 1: Weak or failing battery
Idea 2: Faulty sensor or switch
Idea 3: Faulty IBS sensor
Idea 4: Stored ECU fault codes
Idea 5: Alternator or charging faults
Idea 6: Battery coding failure
Idea 7: CAN bus C physical wiring problem
```

## So how does the SS system actually work?

Let's look at this from the other way: how does the SS system actually work? From my research, it seems to need a certain set of conditions to be met before it will allow the engine to be stopped and started automatically. 

From a quick search and ChatGPT prompt, it seems like (at least) the following conditions need to be met for the SS system to work. All of these seem reasonable conditions, and there are a few new ideas in there:

- Good battery condition
- Engine warmed up (though transient)
- AC demand is not too high (though transient)
- DPF regen is not active (though transient)
- Driver door closed

Let's add these new thoughts to our list - all is on the table at this point:

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

## Next steps

This is a great set of ideas. But how to proceed? I'm going to tackle this list, first by the really easy stuff, then the things which are most likely to be causing the problem.

But you'll need to wait for part 2 of this post to see what I've found - I need some time to go away and investigate.

Happy debugging for now!