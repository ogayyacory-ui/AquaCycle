from flask import Blueprint


solutions_bp = Blueprint(
    "solutions",
    __name__
)


SOLUTIONS = [

    {
        "id": 1,
        "title": "Rainwater Harvesting",
        "category": "Water Access",
        "description": "Collect and store rainfall for suitable household and community uses.",
        "cost_level": "Low–Medium",
        "benefit": "Reduces pressure on freshwater sources."
    },

    {
        "id": 2,
        "title": "Greywater Recycling",
        "category": "Water Reuse",
        "description": "Reuse suitable wastewater from showers, sinks and laundry.",
        "cost_level": "Medium",
        "benefit": "Reduces freshwater demand."
    },

    {
        "id": 3,
        "title": "Bio-Sand Filtration",
        "category": "Water Quality",
        "description": "Low-cost filtration technology for improving household water quality.",
        "cost_level": "Low",
        "benefit": "Can reduce exposure to contaminants."
    },

    {
        "id": 4,
        "title": "Smart Water Monitoring",
        "category": "Technology",
        "description": "Sensors detect leaks and unusual consumption.",
        "cost_level": "Medium",
        "benefit": "Makes hidden water losses visible."
    },

    {
        "id": 5,
        "title": "Constructed Wetlands",
        "category": "Wastewater",
        "description": "Nature-based wastewater treatment using plants, soil and microorganisms.",
        "cost_level": "Medium–High",
        "benefit": "Supports cleaner waterways."
    }
]


@solutions_bp.get("")
def get_solutions():

    return {
        "solutions": SOLUTIONS
    }