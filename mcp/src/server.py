"""MCP server for local AI-assisted tabletop roleplay."""
import random
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from fastmcp import FastMCP

# Load environment variables
dotenv_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=dotenv_path)

# Initialize FastMCP server
mcp = FastMCP("Arias Tale RPG")

# In-memory storage for campaigns and characters
campaigns: dict[str, dict[str, Any]] = {}
characters: dict[str, dict[str, Any]] = {}


@mcp.tool()
def launch_new_campaign(
    campaign_name: str,
    setting: str = "Aria's Tale",
    difficulty: str = "normal",
) -> str:
    """Launch a new tabletop RPG campaign.

    Args:
        campaign_name: Unique name for the campaign.
        setting: The fantasy setting/world for the campaign. Defaults to "Aria's Tale".
        difficulty: Campaign difficulty level (easy, normal, hard). Defaults to "normal".

    Returns:
        Confirmation message with campaign details.
    """
    if campaign_name in campaigns:
        return f"Campaign '{campaign_name}' already exists. Please choose a different name."

    campaign = {
        "name": campaign_name,
        "setting": setting,
        "difficulty": difficulty,
        "status": "active",
        "session_count": 0,
        "created_at": str(Path(__file__).stat().st_mtime),  # Simple timestamp
    }
    campaigns[campaign_name] = campaign

    return (
        f"Campaign '{campaign_name}' launched successfully!\n"
        f"Setting: {setting}\n"
        f"Difficulty: {difficulty}\n"
        f"Status: Active"
    )


@mcp.tool()
def generate_character(
    character_name: str,
    character_class: str = "warrior",
    level: int = 1,
    campaign_name: str | None = None,
) -> str:
    """Generate a new character for tabletop roleplay.

    Args:
        character_name: Name of the character.
        character_class: Character class (warrior, mage, rogue, cleric, ranger). Defaults to "warrior".
        level: Starting level (1-20). Defaults to 1.
        campaign_name: Optional campaign to associate this character with.

    Returns:
        Character details as a formatted string.
    """
    if character_name in characters:
        return f"Character '{character_name}' already exists. Please choose a different name."

    # Validate level
    level = max(1, min(20, level))

    # Generate ability scores (using standard D&D-style roll: 4d6 drop lowest)
    def roll_ability_score() -> int:
        rolls = [random.randint(1, 6) for _ in range(4)]
        return sum(sorted(rolls)[1:])  # Drop lowest, sum remaining

    ability_scores = {
        "strength": roll_ability_score(),
        "dexterity": roll_ability_score(),
        "constitution": roll_ability_score(),
        "intelligence": roll_ability_score(),
        "wisdom": roll_ability_score(),
        "charisma": roll_ability_score(),
    }

    # Calculate hit points (simplified: class-based base + constitution modifier)
    con_modifier = (ability_scores["constitution"] - 10) // 2
    base_hp = {"warrior": 10, "mage": 6, "rogue": 8, "cleric": 8, "ranger": 10}.get(
        character_class.lower(), 8
    )
    hit_points = base_hp + (level - 1) * (base_hp // 2) + (con_modifier * level)

    character = {
        "name": character_name,
        "class": character_class.lower(),
        "level": level,
        "ability_scores": ability_scores,
        "hit_points": hit_points,
        "max_hit_points": hit_points,
        "campaign": campaign_name,
    }
    characters[character_name] = character

    # Format ability scores for display
    ability_str = ", ".join(
        [f"{stat.capitalize()}: {score}" for stat, score in ability_scores.items()]
    )

    result = (
        f"Character '{character_name}' generated!\n"
        f"Class: {character_class.capitalize()}\n"
        f"Level: {level}\n"
        f"Hit Points: {hit_points}\n"
        f"Ability Scores: {ability_str}"
    )

    if campaign_name:
        result += f"\nAssociated with campaign: {campaign_name}"

    return result


@mcp.tool()
def random_encounter(
    campaign_name: str | None = None,
    encounter_type: str = "combat",
    difficulty: str | None = None,
) -> str:
    """Generate a random encounter or event for the campaign.

    Args:
        campaign_name: Optional campaign name to use for context.
        encounter_type: Type of encounter (combat, social, exploration, puzzle). Defaults to "combat".
        difficulty: Override difficulty (easy, normal, hard). Uses campaign difficulty if not provided.

    Returns:
        Description of the random encounter or event.
    """
    # Determine difficulty
    if not difficulty and campaign_name and campaign_name in campaigns:
        difficulty = campaigns[campaign_name]["difficulty"]
    difficulty = difficulty or "normal"

    # Encounter tables by type
    combat_encounters = {
        "easy": [
            "A pack of goblins ambushes the party from behind trees.",
            "A single dire wolf blocks the path ahead.",
            "Three bandits demand the party's valuables.",
            "A group of skeletons rises from ancient graves.",
            "A giant spider descends from above.",
        ],
        "normal": [
            "An orc war party emerges from the forest.",
            "A band of undead warriors attacks without warning.",
            "A wyvern circles overhead, preparing to dive.",
            "Merrow (aquatic goblins) emerge from a nearby stream.",
            "A group of cultists performs a dark ritual.",
        ],
        "hard": [
            "A dragon's roar echoes in the distance, getting closer.",
            "An archmage with dark intentions blocks your path.",
            "A horde of undead swarms from all directions.",
            "A powerful demon materializes before you.",
            "An ancient lich rises from its sarcophagus.",
        ],
    }

    social_encounters = [
        "A traveling merchant offers rare goods at inflated prices.",
        "A lost child asks for help finding their parents.",
        "A noble requests an audience with the party.",
        "A bard shares news from distant lands.",
        "A mysterious stranger offers a quest.",
        "A town guard questions the party's presence.",
        "A group of refugees seeks protection.",
    ]

    exploration_events = [
        "An ancient ruin is discovered off the main path.",
        "A hidden cave entrance is revealed after a rockslide.",
        "A magical portal shimmers in the air.",
        "A treasure chest is found partially buried.",
        "A strange inscription appears on a nearby stone.",
        "A natural spring with healing properties is discovered.",
        "A rare herb grows in an unexpected location.",
    ]

    puzzle_events = [
        "A locked door with three keyholes requires specific keys.",
        "A riddle is inscribed on a stone tablet.",
        "A sequence of levers must be pulled in the correct order.",
        "An ancient mechanism requires solving a number puzzle.",
        "A magic circle needs to be activated with the right elements.",
    ]

    # Select encounter based on type
    if encounter_type.lower() == "combat":
        encounter_list = combat_encounters.get(difficulty, combat_encounters["normal"])
        encounter = random.choice(encounter_list)
    elif encounter_type.lower() == "social":
        encounter = random.choice(social_encounters)
    elif encounter_type.lower() == "exploration":
        encounter = random.choice(exploration_events)
    elif encounter_type.lower() == "puzzle":
        encounter = random.choice(puzzle_events)
    else:
        # Mix all types
        all_encounters = (
            combat_encounters.get(difficulty, combat_encounters["normal"])
            + social_encounters
            + exploration_events
            + puzzle_events
        )
        encounter = random.choice(all_encounters)

    result = f"Random {encounter_type} encounter:\n{encounter}"
    if campaign_name:
        result += f"\n(Campaign: {campaign_name})"

    return result


@mcp.tool()
def roll_dice(
    sides: int = 20,
    count: int = 1,
    modifier: int = 0,
    character_name: str | None = None,
) -> str:
    """Roll dice for ability checks, attacks, or other game mechanics.

    Args:
        sides: Number of sides on the die (common: 4, 6, 8, 10, 12, 20, 100). Defaults to 20.
        count: Number of dice to roll. Defaults to 1.
        modifier: Modifier to add to the total (can be negative). Defaults to 0.
        character_name: Optional character name for context.

    Returns:
        Dice roll results with breakdown.
    """
    if sides < 2:
        return "Error: Dice must have at least 2 sides."
    if count < 1:
        return "Error: Must roll at least 1 die."
    if count > 100:
        return "Error: Cannot roll more than 100 dice at once."

    # Roll the dice
    rolls = [random.randint(1, sides) for _ in range(count)]
    total = sum(rolls) + modifier

    # Format results
    if count == 1:
        result = f"Rolled 1d{sides}"
        if modifier != 0:
            result += f" {modifier:+d}"
        result += f": {rolls[0]}"
        if modifier != 0:
            result += f" {modifier:+d} = {total}"
        else:
            result += f" = {total}"
    else:
        rolls_str = " + ".join(map(str, rolls))
        result = f"Rolled {count}d{sides}"
        if modifier != 0:
            result += f" {modifier:+d}"
        result += f": [{rolls_str}]"
        if modifier != 0:
            result += f" {modifier:+d} = {total}"
        else:
            result += f" = {total}"

    if character_name:
        result = f"{character_name}: {result}"

    return result


if __name__ == "__main__":
    # Run the MCP server
    mcp.run()

