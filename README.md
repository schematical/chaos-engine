wheezy-world
============

http://piq.codeus.net/draw

##NPC Logic:

inputs > outputs

###Inputs:
* find nearest... smell/hear
* in line of site
* in front of
* to the left of
* to the right of
* object in inventory
* commanded(command, By NPC Target)
* stat change(stat, comparison, value) - (Example: Health Low, Energy Full, etc) - (Triggers evasion when dieing)


###Outputs:

* move forward,backward, left, right
* follow(follow until - duration || other condition met)
* catch(Like follow but with a
* run from(specify evade successful distance in tiles)
* equip object
* use equipped object
* interact
* command (target filter) - Broadcast Maybe?

####Random Thought:
Possibly do separate inputs/outputs for economics and interactions.

####NPC Target:
A filter to select which targets to interact with

* Based on attributes
* Based on equipped inventory item
* Based on state...
* Based on effects(Example: Medic looks for anyone injured then triggers healing behavior)
* Based on allegiance

####Memories:
#####Pain/Pleasure Scale:
Each AI-NPC should be wired with a predisposition to equate an action with pain or pleasure

* Eating food has a little positive pleasure
* Eating gold has a large negative amount of pleasure
* Not doing anything for a while should have a little negative amount of pleasure
* Health going down(watch) should have a negitive amount of pleasure.
* Energy Going up(Sleeping/Stimulant embibing)

Those are the defaults. I would like to randomly generate other types of pain/pleasure triggers:

*

If an interaction has one of these effects,
possibly by watching certain stats with in a certain amount of cycles before an event occurs and after,
then it could add a memory to the input node.
These are calculated in real time and affect the NPC's **pleasure** var.

#####Input Node Memory:
For starters I will just add a **pleasure** variable to inputNodes.
If the input node fires a watcher process will fire x cycles later. For now I will call this **reflecting**.

When reflecting the NPC will measure the difference(delta) in its overall pleasure variable from when the action occurred to the present.
It will then weight that difference with the inputNode that fired off.

--> We should also store the number of occurences so the NPC can use that to factor in how certain they are of the outcome of their decisions.

#####Recalling Memory:
When an NPC runs through its **cycle** function it now will weight in the amount of **pleasure delta** on average it has recived.
If the pleasure delta is positive it will be more likely to do the action.
If the pleasure delta is negitive it will be less likely to do the action.



####Relationships:
The same pain pleasure scale maybe applied to NPCs.
* Proximity to an NPC during a pleasure delta event
* Interactions with an NPC that cause a pleasure delta event
* The hiarichial relationship between two NPCs that cause a pleasure delta event

Eventually you could code a NPCTarget condition to find targets that have good or bad relationships with an NPC.

####Teaching:
It is possible that an NPC that feels stong pain/pleasuer and has a high number of occurences of an outcome might try and teach other NPCs.

From a technical standpoint it is as follows:
* An NPC randomly generates inputNodes.
* If invotry has gold => Eat the gold
* This causes a large loss of health
* The loss of health triggers a large negative delta event
* The NPC also has another inputNode - If in proximity to target(random target) => teach a node
* Due to the severity of the delta event the NPC chooses to *teach* the first inputNode to the target
* The target might need a **learn** inputNode to process. We don't want them listening to bad advice.

Exciting stuff that theoretically could happen

* NPC A has a node that makes them follow a NPCTarget
* NPC B matches the target selector attacks them when they get close because of their own node structure.
* NPC A exigences pain when another NPC attacks and stores it with the memory.
* NPC A tells many other NPCs(anyone that will listen) about the encounter and other NPCs avoid NPC B.



####Commands:
Commands are the way NPCs communicate with each other.

This is also how the player can quick interact with other NPCs.

Assuming I get to the hierarchy part I will probably make it so low level NPCs take commands from highlevel NPCs

#####Example:


#####Civilians:
Programmed to obey commands from most NPCs

####Hiarchy:


