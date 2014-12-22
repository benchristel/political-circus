political-circus
================

Fractal modeling of geopolitical entities

## Circles Within Circles

Every entity in the simulation, from bugbears to humans to guilds and gangs to religions and civilizations, is modeled as a circle wandering around a plane.

As the simulation runs, circles will mine natural resources, increase their spheres of influence, move around the map, forge alliances, fight battles, crush uprisings, pay taxes, reproduce, and die.

The simulation proceeds in discrete steps, called _turns_.

## Natural Resources

The map is dotted with natural resource mines. Each turn, these produce an amount of resources based on the number and size of the circles overlapping them. The resources produced at each mine are then divided among the circles overlapping that mine. Small circles produce more resources, but larger circles take the lion's share of the bounty. Resources consumed by a circle increase its size.

Each circle mining a resource gains _first-strike points_ for each larger circle mining the same resource. First-strike points help out in combat. Basically, paying taxes gets you a defensive bonus.

> _TODO: is this needed?_ As circles grow, they eventually become too large to efficiently collect the resources produced by smaller circles. This puts a soft upper bound on the size of a circle.

As more circles extract resources from a single point, returns diminish. Sharing a resource is not as good as exploiting it alone.

## Combat

When the boundaries of two similar-sized circles touch or intersect, they fight. Each turn, the fighting circles each have a chance to do damage to the other. Damage decreases a circle's size, and the chance to do damage is proportional to the attacker's size. An early advantage in combat can therefore cascade into a victory.

By paying taxes to a larger circle, a circle gains a first-strike advantage, in which the first attack in a combat has a higher chance to hit and does more damage.

Combat occurs only when the edges of circles touch. If one circle is completely contained within the other, combat is not possible. However, if both circles are sitting on a resource point, the inner circle will grow faster, and eventually the two will fight.

Since fighting causes circles to shrink, circles that were touching before combat may not be after damage is dealt. This means that fights to the death are rare. However, a circle is more likely to die a "natural" death after sustaining injury, since smaller circles lose life faster (see the section on death).

## Movement

Circles move at a constant rate based on their size. Smaller circles move faster. The direction of movement is determined by nearby resources and circles. In general, circles move toward resources and away from circles of similar size.

## Reproduction

Circles randomly spawn new circles at their edges. The chance for this to happen is higher the smaller the circle is.

A circle spawns at 10% the size of its parent. The parent loses 20% of its size.

## Death

Each circle is born with a certain amount of life proportional to its size. Moving across the map decreases a circle's life proportional to the distance moved. Having life < 0 decreases the circle's size each turn. If a circle's area is zero, it is dead.

Since smaller circles move faster, they also die sooner. All circles eventually die, since their life decreases monotonically and at some point the toll taken on their size by negative life will overwhelm their resource production.
