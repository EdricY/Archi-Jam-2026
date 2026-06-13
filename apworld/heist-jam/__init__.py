from typing import Dict

from BaseClasses import Item, Location, Region, ItemClassification
from worlds.generic.Rules import set_rule, add_rule
from worlds.AutoWorld import World


heist_jam_base_id = 2785000

class HeistJamItem(Item):
    game = "HeistJam"


class HeistJamLocation(Location):
    game = "HeistJam"


class HeistJamWorld(World):
    game = "HeistJam"

    item_name_to_id = {
        "World 2 Key": heist_jam_base_id + 0,
        "World 3 Key": heist_jam_base_id + 1,
        "World 4 Key": heist_jam_base_id + 2,
        "World 5 Key": heist_jam_base_id + 3,
        "Filler Item": heist_jam_base_id + 4,
    }

    location_name_to_id = {
        "Level 1 Chest 1": heist_jam_base_id + 100,
        "Level 1 Chest 2": heist_jam_base_id + 101,
        "Level 2 Chest 1": heist_jam_base_id + 102,
        "Level 2 Chest 2": heist_jam_base_id + 103,
        "Level 3 Chest 1": heist_jam_base_id + 104,
        "Level 3 Chest 2": heist_jam_base_id + 105,
        "Level 4 Chest 1": heist_jam_base_id + 106,
        "Level 4 Chest 2": heist_jam_base_id + 107,
        "Level 5 Chest 1": heist_jam_base_id + 108,
        "Level 5 Chest 2": heist_jam_base_id + 109,
        "Level 6 Chest 1": heist_jam_base_id + 110,
        "Level 6 Chest 2": heist_jam_base_id + 111,
        "Level 7 Chest 1": heist_jam_base_id + 112,
        "Level 7 Chest 2": heist_jam_base_id + 113,
        "Level 8 Chest 1": heist_jam_base_id + 114,
        "Level 8 Chest 2": heist_jam_base_id + 115,
        "Level 9 Chest 1": heist_jam_base_id + 116,
        "Level 9 Chest 2": heist_jam_base_id + 117,
        "Level 10 Chest 1": heist_jam_base_id + 118,
        "Level 10 Chest 2": heist_jam_base_id + 119,
        "Level 11 Chest 1": heist_jam_base_id + 120,
        "Level 11 Chest 2": heist_jam_base_id + 121,
        "Level 12 Chest 1": heist_jam_base_id + 122,
        "Level 12 Chest 2": heist_jam_base_id + 123,
        "Level 13 Chest 1": heist_jam_base_id + 124,
        "Level 13 Chest 2": heist_jam_base_id + 125,
        "Level 14 Chest 1": heist_jam_base_id + 126,
        "Level 14 Chest 2": heist_jam_base_id + 127,
        "Level 15 Chest 1": heist_jam_base_id + 128,
        "Level 15 Chest 2": heist_jam_base_id + 129,
    }

    def create_item(self, name: str) -> HeistJamItem:
        classification = ItemClassification.filler if name.startswith("Filler") else ItemClassification.progression
        return HeistJamItem(name, classification, self.item_name_to_id[name], self.player)

    def create_items(self) -> None:
        # Add the 4 world keys
        for key in ["World 2 Key", "World 3 Key", "World 4 Key", "World 5 Key"]:
            self.multiworld.itempool.append(self.create_item(key))

        # Add fillers to match locations
        location_count = len(self.multiworld.get_unfilled_locations(self.player))
        leftover = location_count - len(self.multiworld.itempool)
        for _ in range(leftover):
            self.multiworld.itempool.append(self.create_item("Filler Item"))

    def create_regions(self) -> None:
        menu = Region("Menu", self.player, self.multiworld)
        self.multiworld.regions.append(menu)

        world1 = Region("World 1", self.player, self.multiworld)
        world1.locations += [
            HeistJamLocation(self.player, "Level 1 Chest 1", self.location_name_to_id["Level 1 Chest 1"], world1),
            HeistJamLocation(self.player, "Level 1 Chest 2", self.location_name_to_id["Level 1 Chest 2"], world1),
            HeistJamLocation(self.player, "Level 2 Chest 1", self.location_name_to_id["Level 2 Chest 1"], world1),
            HeistJamLocation(self.player, "Level 2 Chest 2", self.location_name_to_id["Level 2 Chest 2"], world1),
            HeistJamLocation(self.player, "Level 3 Chest 1", self.location_name_to_id["Level 3 Chest 1"], world1),
            HeistJamLocation(self.player, "Level 3 Chest 2", self.location_name_to_id["Level 3 Chest 2"], world1),
        ]
        self.multiworld.regions.append(world1)

        world2 = Region("World 2", self.player, self.multiworld)
        world2.locations += [
            HeistJamLocation(self.player, "Level 4 Chest 1", self.location_name_to_id["Level 4 Chest 1"], world2),
            HeistJamLocation(self.player, "Level 4 Chest 2", self.location_name_to_id["Level 4 Chest 2"], world2),
            HeistJamLocation(self.player, "Level 5 Chest 1", self.location_name_to_id["Level 5 Chest 1"], world2),
            HeistJamLocation(self.player, "Level 5 Chest 2", self.location_name_to_id["Level 5 Chest 2"], world2),
            HeistJamLocation(self.player, "Level 6 Chest 1", self.location_name_to_id["Level 6 Chest 1"], world2),
            HeistJamLocation(self.player, "Level 6 Chest 2", self.location_name_to_id["Level 6 Chest 2"], world2),
        ]
        self.multiworld.regions.append(world2)

        world3 = Region("World 3", self.player, self.multiworld)
        world3.locations += [
            HeistJamLocation(self.player, "Level 7 Chest 1", self.location_name_to_id["Level 7 Chest 1"], world3),
            HeistJamLocation(self.player, "Level 7 Chest 2", self.location_name_to_id["Level 7 Chest 2"], world3),
            HeistJamLocation(self.player, "Level 8 Chest 1", self.location_name_to_id["Level 8 Chest 1"], world3),
            HeistJamLocation(self.player, "Level 8 Chest 2", self.location_name_to_id["Level 8 Chest 2"], world3),
            HeistJamLocation(self.player, "Level 9 Chest 1", self.location_name_to_id["Level 9 Chest 1"], world3),
            HeistJamLocation(self.player, "Level 9 Chest 2", self.location_name_to_id["Level 9 Chest 2"], world3),
        ]
        self.multiworld.regions.append(world3)

        world4 = Region("World 4", self.player, self.multiworld)
        world4.locations += [
            HeistJamLocation(self.player, "Level 10 Chest 1", self.location_name_to_id["Level 10 Chest 1"], world4),
            HeistJamLocation(self.player, "Level 10 Chest 2", self.location_name_to_id["Level 10 Chest 2"], world4),
            HeistJamLocation(self.player, "Level 11 Chest 1", self.location_name_to_id["Level 11 Chest 1"], world4),
            HeistJamLocation(self.player, "Level 11 Chest 2", self.location_name_to_id["Level 11 Chest 2"], world4),
            HeistJamLocation(self.player, "Level 12 Chest 1", self.location_name_to_id["Level 12 Chest 1"], world4),
            HeistJamLocation(self.player, "Level 12 Chest 2", self.location_name_to_id["Level 12 Chest 2"], world4),
        ]
        self.multiworld.regions.append(world4)

        world5 = Region("World 5", self.player, self.multiworld)
        world5.locations += [
            HeistJamLocation(self.player, "Level 13 Chest 1", self.location_name_to_id["Level 13 Chest 1"], world5),
            HeistJamLocation(self.player, "Level 13 Chest 2", self.location_name_to_id["Level 13 Chest 2"], world5),
            HeistJamLocation(self.player, "Level 14 Chest 1", self.location_name_to_id["Level 14 Chest 1"], world5),
            HeistJamLocation(self.player, "Level 14 Chest 2", self.location_name_to_id["Level 14 Chest 2"], world5),
            HeistJamLocation(self.player, "Level 15 Chest 1", self.location_name_to_id["Level 15 Chest 1"], world5),
            HeistJamLocation(self.player, "Level 15 Chest 2", self.location_name_to_id["Level 15 Chest 2"], world5),
        ]
        self.multiworld.regions.append(world5)

        # Connections
        menu.connect(world1, "World 1 Entrance")
        world1.connect(world2, "World 2 Entrance")
        world2.connect(world3, "World 3 Entrance")
        world3.connect(world4, "World 4 Entrance")
        world4.connect(world5, "World 5 Entrance")

        # setup win con in world 5
        victory_location = HeistJamLocation(self.player, "Level 15 Chest 2", None, world5)
        victory_item = HeistJamItem("Victory", ItemClassification.progression, None, self.player)
        victory_location.place_locked_item(victory_item)
        world5.locations.append(victory_location)
        self.multiworld.completion_condition[self.player] = lambda state: state.has("Victory", self.player)

    def set_rules(self) -> None:
        add_rule(self.get_entrance("World 2 Entrance"),
            lambda state: state.has("World 2 Key", self.player))
        add_rule(self.get_entrance("World 3 Entrance"),
            lambda state: state.has("World 3 Key", self.player))
        add_rule(self.get_entrance("World 4 Entrance"),
            lambda state: state.has("World 4 Key", self.player))

