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
* command (target filter)

####Random Thought:
Possibly do separate inputs/outputs for economics and interactions.

####NPC Target:
A filter to select which targets to interact with

* Based on attributes
* Based on equipped inventory item
* Based on state...
* Based on effects(Example: Medic looks for anyone injured then triggers healing behavior)
* Based on allegiance


####Relationships:

####Commands:
Commands are the way NPCs communicate with each other.

This is also how the player can quick interact with other NPCs.

Assuming I get to the hierarchy part I will probably make it so low level NPCs take commands from highlevel NPCs

#####Example:


#####Civilians:
Programmed to obey commands from most NPCs

####Hiarchy:
