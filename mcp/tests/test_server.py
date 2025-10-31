"""Unit tests for MCP server tools."""
import pytest

from src.server import (
    campaigns,
    characters,
    generate_character,
    launch_new_campaign,
    random_encounter,
    roll_dice,
)


def test_launch_new_campaign():
    """Test launching a new campaign."""
    campaigns.clear()
    result = launch_new_campaign("Test Campaign", "Aria's Tale", "normal")
    assert "Test Campaign" in result
    assert "Aria's Tale" in result
    assert "normal" in result
    assert "Test Campaign" in campaigns


def test_launch_duplicate_campaign():
    """Test that duplicate campaign names are rejected."""
    campaigns.clear()
    launch_new_campaign("Test Campaign")
    result = launch_new_campaign("Test Campaign")
    assert "already exists" in result


def test_generate_character():
    """Test character generation."""
    characters.clear()
    result = generate_character("Test Hero", "warrior", 1)
    assert "Test Hero" in result
    assert "warrior" in result or "Warrior" in result
    assert "Test Hero" in characters
    assert characters["Test Hero"]["level"] == 1


def test_generate_character_with_level():
    """Test character generation with custom level."""
    characters.clear()
    result = generate_character("High Level Hero", "mage", 5)
    assert "High Level Hero" in result
    assert characters["High Level Hero"]["level"] == 5


def test_generate_character_level_bounds():
    """Test that character level is clamped to valid range."""
    characters.clear()
    # Test level too low
    generate_character("Low Hero", "warrior", -5)
    assert characters["Low Hero"]["level"] == 1
    # Test level too high
    generate_character("High Hero", "warrior", 25)
    assert characters["High Hero"]["level"] == 20


def test_generate_character_ability_scores():
    """Test that character has all ability scores."""
    characters.clear()
    generate_character("Stats Hero", "rogue", 1)
    char = characters["Stats Hero"]
    assert "strength" in char["ability_scores"]
    assert "dexterity" in char["ability_scores"]
    assert "constitution" in char["ability_scores"]
    assert "intelligence" in char["ability_scores"]
    assert "wisdom" in char["ability_scores"]
    assert "charisma" in char["ability_scores"]


def test_roll_dice_single():
    """Test rolling a single die."""
    result = roll_dice(20, 1, 0)
    assert "1d20" in result
    assert "=" in result


def test_roll_dice_multiple():
    """Test rolling multiple dice."""
    result = roll_dice(6, 3, 0)
    assert "3d6" in result
    assert "=" in result


def test_roll_dice_with_modifier():
    """Test rolling dice with a modifier."""
    result = roll_dice(20, 1, 5)
    assert "1d20" in result
    assert "+5" in result or "= " in result


def test_roll_dice_negative_modifier():
    """Test rolling dice with negative modifier."""
    result = roll_dice(20, 1, -2)
    assert "1d20" in result
    assert "-2" in result


def test_roll_dice_invalid_sides():
    """Test that invalid die sides are rejected."""
    result = roll_dice(1, 1, 0)
    assert "Error" in result


def test_roll_dice_invalid_count():
    """Test that invalid die count is rejected."""
    result = roll_dice(20, 0, 0)
    assert "Error" in result
    result = roll_dice(20, 101, 0)
    assert "Error" in result


def test_random_encounter():
    """Test generating a random encounter."""
    result = random_encounter(None, "combat", "normal")
    assert "encounter" in result.lower() or "Random" in result


def test_random_encounter_with_campaign():
    """Test generating encounter with campaign context."""
    campaigns.clear()
    launch_new_campaign("Test Campaign", difficulty="hard")
    result = random_encounter("Test Campaign", "combat")
    assert "encounter" in result.lower() or "Random" in result


def test_random_encounter_types():
    """Test different encounter types."""
    combat_result = random_encounter(encounter_type="combat")
    assert "combat" in combat_result.lower() or "Random" in combat_result

    social_result = random_encounter(encounter_type="social")
    assert "social" in social_result.lower() or "Random" in social_result

    exploration_result = random_encounter(encounter_type="exploration")
    assert "exploration" in exploration_result.lower() or "Random" in exploration_result

    puzzle_result = random_encounter(encounter_type="puzzle")
    assert "puzzle" in puzzle_result.lower() or "Random" in puzzle_result

