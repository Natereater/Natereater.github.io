import pandas as pd
import drg_scoring


# SIMULATION SUCCESS PROBABILITY
# percent_chance = 102 - 2 ^ (score / p_value) + score / (p_value / 2)
# p_value should be between 500 and 2500
# desmos: y=102\ -\ 2^{\frac{x}{c}}+\frac{x}{\frac{c}{2}}

class LeagueName:
    LEAF_LEAGUE = ("The Leaf Lovers League", "L3")
    SALT_PITS = ("The Salt Pits", "SP")
    DIRT_DIGGERS = ("The Dirt Diggers League", "DDL")
    CAVE_CRAWLERS = ("The Cave Crawlers League", "CCL")
    MIGHTY_MINERS = ("The Mighty Miners League", "MML")
    IMU_CHAMPS = ("The Interplanetary Miners Union Championships", "IMUC")
    HOXXES_CHALLENGERS = ("The Hoxxes Challengers League", "HCL")
    FORTMOON = ("The Fortmoon League", "14ML")
    CREUS_CHAMPS = ("The Creus Championship Series", "CCS")


