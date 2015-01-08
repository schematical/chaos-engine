Chaos Engine
============

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

####Random Notes on Inputs:
#####Smell:
It would be cool to have certain thins emit smells that could attract creatures(NPCs) with better smell and hearing, but worse vision.

Objects could emit a certain smell for a range. Dead NPCs might emit a smell for 10 tiles starting 100 cycles after they are dead and incrasing.

Ideally creatures would detect this smell and come to feed.

Human NPCs that did not want to encounter creature NPCs  would dispose of the bodies or possibly use them as bait.

#####Sound:
Sound is another sense that could be added.
Sound would travel faster but last much shorter durations then smell.
NPCs moving would trigger sounds.
NPCs attacking would trigger different distances and types of sounds depending on what is equipped.

An NPCs reaction to sound might vary. Some might follow a sound and others might trigger an evade.
It is even possible that an NPC might start to eat inventory items when they hear a sound. The dog and the bell expirment.

Command Outputs would cary only over a certain amount of tiles and might trigger behaviors in NPCs they are not trying to command.
#####Sight:
Sight allows an NPC to detect any object/action on the tiles in a funnel in the direction they are facing.

Variables:
* Width: The amount of tiles wider the vision field gets with each tile further away from the NPC they can percive.
* Distance: The amount of tiles in the direction the NPC is facing that the NPC can percive.



###Outputs:

* move forward,backward, left, right
* follow(follow until - duration || other condition met)
* catch(Like follow but with a
* run from(specify evade successful distance in tiles)
* equip object
* use equipped object
* interact
* command (target filter) - Broadcast Maybe?

###Chaining Logic:
Some inputNodes might get chained together.

####Input Chaining:
* Input: If I have food
* Input: If I have energy above 50%
* Input: If I am near to a NPCTarget with low energy
* Output: Give NPC Food

####Output Chaining:
* Input: If I have food
* Input: If I have energy above 50%
* Input: If I see an NPC Target with low energy
* Output: Go tward NPC
* Output: Give NPC Food

####Random Thought:
Possibly do separate inputs/outputs for economics and interactions.

####NPC Target:
A filter to select which targets to interact with

* Based on attributes
* Based on equipped inventory item
* Based on state...
* Based on effects(Example: Medic looks for anyone injured then triggers healing behavior)
* Based on allegiance
* Based on gender
* Based on age
* Based on family/hiarchy relationship

####Memories:
#####Pain/Pleasure Scale:
Each AI-NPC should be wired with a predisposition to equate an action with pain or pleasure

* Eating food has a little positive pleasure
* Eating gold has a large negative amount of pleasure
* Not doing anything for a while should have a little negative amount of pleasure
* Health going down(watch) should have a negitive amount of pleasure.
* Energy Going up(Sleeping/Stimulant embibing)

Those are the defaults. I would like to randomly generate other types of pain/pleasure triggers:

* Ingesting other inventory_items(drugs, food, etc).
* Killing, injurying, healing or other various interactions
* Bartering with others.

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

####InputNode - Boredom:
An input Node called 'boredom' could be created when an NPC has not done an action in a while and has energy.
Different NPC's would get Bored at varying amounts of cycles(some get bored quicker, some not so much).

If the NPC gets boered it would then try to occupy it self by creating new inputNode>outputNode's.
This allows for an increase in complexity of behavior faster then just when the NPC is spawned.

Sample Output Nodes:
* Eat x in inventory
* Explore
* Attack NPC
* Interact with x

####OutputNode - Observe:
Observing allows an NPC to watch other NPCs in their sight radius and depending on their




####Relationships:
The same pain pleasure scale maybe applied to NPCs.
* Proximity to an NPC during a pleasure delta event
* Interactions with an NPC that cause a pleasure delta event
* The hiarichial relationship between two NPCs that cause a pleasure delta event

Eventually you could code a NPCTarget condition to find targets that have good or bad relationships with an NPC.


####Relationship Memory:
It might be a good idea to store ineractions and information in some type of relationship array

~~~
{
    npc_id_a:[
        { action:'gave', object:'inventory_object.food' },
        { action:'attacked', object:'npc_id_c' },
        { relationship: 'father' }
    ],
    npc_id_b:{
        { relationship: 'boss' },
        { action:'commanded.attack', object:'npc_id_c' },
    },
    npc_id_c:{
         { action:'attacked', object:'my_npc_id' },
         { action:'attacked', object:'npc_id_a' },
    }
}
Just like human brains they can fill up. Weighting memories might be a good idea based on how strong the **pleasure delta event** might be important.
Example attacking me will not be forgotten.
Watching someone eat will be.
Also weighting things permantly like flat out relationships(father, mother, child) etc might be important.
 Low weighted interactions will be removed when the memory fills up.
 The commonality of an event might be something to consider. How often do you see an NPC eat food?
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

#####Families:
It might also be cool to factor in bloodlines into logic.
Degrees of seperation from an NPC could affect its decision to act on certain things.

Theoretically NPC's that dont attack their families and nuture them will increase the likley hood that their bloodline will flourish.

NPCs that neglect or attach their bloodline will quickly die out

##Spawning NPC's:
Like in life it will take 2 NPCs to create a child NPC.
The female will remain in a 'pregnent' state for a while.
Then a child (aprox 12 years of age) will show up. It will remain displayed as a child until it has existed 2000(cycles) aprox.
The female might take damage during birth.

###Aging:
NPC's max health and energy will increase up to a point then begin to decrease until they are really fragile or just run out of health.
If they run out of energy first the simply will not be able to feed them selfs unless another NPC has developed a 'feed the hungry' node set.(That will be so fucking cool).


###NPC's Many Brains:
Taking a note from the book [Brain Rules](http://www.amazon.com/Brain-Rules-Principles-Surviving-Thriving/dp/0979777747).

####1st Brain Behaviors:
First brain manages life support. For our purposes here NPC's can still breathe and handle basic plumbing on their own.
That logic will probablly be hard coded for now and not subject to Evolution.
####2nd Brain Behaviors:
2nd brain covers our more animalistic instaicts

* Feeding
* Fighting
* Flighting(run away ~Monty Python reference)
* Fucking(Mating)


I have created a class [LogicFactory](./lib/engine/logic/logic_factory.js) that will have some basic survival logic nodes.
I realize that predefining this makes the evolution aspect less organic.
That is why I intend to create anomalies and only teach some when passed through the factory.
Some NPC might get more agressive behaviors from the factory and be eager to fight.
Some NPCs might get more evasive behaviors from the factory

Also when 2 parents create a child we may not pass all of these logic nodes to the child so their behavior wont be bound to it.

Finally these 2nd brain behaviors are the only logicNodes directly passed to the child at birth.

#####Mirror Neurons:
I also intend to play with adding two behaviors to each child at birth:

* If parent is near > follow it
* If parent is near > observe it

Ideally this will encourage the child to follow the parent.
Now the child could get stuck in a loop following the parent everywhere like a lemings for its entire life.
This can be mitigated by a couple of things such as:

* Parents initially have more energy then the child. The child will have to rest and might lose track of the parent during this rest state.
* The parent goes to sleep and the child gets boerd of observing the parent sleeping then runs off.
* Parents might have logic that says "If an NPC is attacking then command the child to evade". The chances of this generating randomly is not great but I might jump forward and add it to the LogicFactory.survival_101
* The parent dies


####3rd Brain Behaviors:
3rd brain behaviors is what makes us intelligent. They are learned behaviors.

* Using inventory_items. Ex: Don't ingest grenades
* NPCTarget specific behaviors. Ex: Evading a specific person.

These behaviors are NOT passed down to a child at birth. They are learned through the following ways:
* Observing
* Trying Random things when bored
* Some one trys to teach you because they had an expirence of their own.

##Sprites:
Because I have no money and no time and no skill and I love the Fallout series.

[http://www.spriters-resource.com/pc_computer/fallout2/](http://www.spriters-resource.com/pc_computer/fallout2/)

[http://www.spriters-resource.com/pc_computer/fallouttactics/](http://www.spriters-resource.com/pc_computer/fallouttactics/)

##Random Other Resources:

http://piq.codeus.net/draw
