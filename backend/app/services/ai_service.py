import os

import requests


DEFAULT_DISCLAIMER = (
    "AquaAI provides general water-safety information and is not an "
    "emergency service. Do not drink or use water for food preparation "
    "unless its safety is known through appropriate testing or treatment."
)


def _category_for(message):
    text = message.lower()

    categories = {
        "water conservation": [
            "save water",
            "conserve",
            "water conservation",
            "reduce water",
            "wasting water",
        ],
        "rainwater harvesting": [
            "rainwater",
            "rain water",
            "harvesting",
            "rain barrel",
            "rooftop collection",
        ],
        "flooding": [
            "flood",
            "flooding",
            "storm",
            "drainage",
            "overflow",
        ],
        "pollution": [
            "pollution",
            "contamination",
            "contaminated",
            "chemical",
            "oil",
        ],
        "sanitation": [
            "sanitation",
            "sewage",
            "toilet",
            "wastewater",
            "sewer",
        ],
        "water reuse": [
            "reuse",
            "greywater",
            "graywater",
            "recycle water",
        ],
    }

    for category, keywords in categories.items():
        if any(keyword in text for keyword in keywords):
            return category

    return "general water guidance"


def _local_answer(message, context=None):
    text = message.lower()
    category = _category_for(message)

    if "flood" in text or "flooding" in text:
        answer = (
            "During flooding, avoid contact with floodwater when possible "
            "because it can contain sewage, chemicals, sharp objects, and "
            "disease-causing organisms. Keep drinking water containers "
            "covered and move valuable water supplies above expected flood "
            "levels. Clear only safe, accessible drainage areas and never "
            "enter fast-moving water. If your drinking-water source may have "
            "been contaminated, use a known-safe alternative until local "
            "authorities confirm it is safe."
        )

    elif "rainwater" in text or "harvest" in text:
        answer = (
            "For household rainwater harvesting, keep the roof and gutters "
            "clean, divert the initial runoff after a long dry period, use a "
            "covered storage tank, and prevent insects and animals from "
            "entering. Rainwater should not automatically be considered "
            "potable. Drinking use requires an appropriate treatment and "
            "testing approach for the local risks."
        )

    elif "reuse" in text or "greywater" in text or "graywater" in text:
        answer = (
            "Greywater from suitable household sources can sometimes be "
            "reused for tasks such as landscape irrigation, depending on "
            "local rules. Keep it separate from toilet waste, avoid storing "
            "untreated greywater for long periods, and do not use untreated "
            "greywater for drinking, cooking, or personal hygiene."
        )

    elif "pollution" in text or "contaminat" in text:
        answer = (
            "If water may be polluted, first identify and avoid the suspected "
            "source. Do not taste the water to test it. Keep children and "
            "animals away, protect clean water containers from contact, and "
            "seek appropriate water testing or advice from local authorities "
            "before using the water."
        )

    elif "sanitation" in text or "sewage" in text:
        answer = (
            "Good sanitation starts with separating human waste from water "
            "sources. Keep toilets, septic systems, drainage channels, and "
            "wastewater away from wells and storage tanks. After sewage "
            "contamination, normal-looking water should still be treated as "
            "unsafe until properly assessed and treated."
        )

    elif "save water" in text or "conserv" in text or "wast" in text:
        answer = (
            "Start with the biggest sources of household water use: repair "
            "leaks, shorten showers, turn off taps while brushing, run "
            "washing machines only with suitable loads, and reuse appropriate "
            "non-potable water for cleaning or irrigation. During hot or dry "
            "periods, prioritize essential uses and check outdoor irrigation "
            "for unnecessary losses."
        )

    else:
        answer = (
            "A practical starting point is to protect your drinking-water "
            "source, repair leaks, store water in clean covered containers, "
            "and separate potentially contaminated water from clean supplies. "
            "For reuse or treatment decisions, consider the water's source "
            "and intended use rather than assuming that clear-looking water "
            "is safe."
        )

    if context and isinstance(context, dict):
        weather = context.get("weather")

        if isinstance(weather, dict):
            condition = str(weather.get("condition", "")).lower()

            if "rain" in condition or "storm" in condition:
                answer += (
                    " With wet or stormy weather, prioritize safe drainage, "
                    "overflow protection, and keeping collected rainwater "
                    "containers covered."
                )

    return answer, category


def _configured_provider():
    return (
        os.getenv("AQUA_AI_URL")
        or os.getenv("AI_PROVIDER_URL")
    )


def generate_answer(message, context=None):
    provider_url = _configured_provider()
    provider_key = (
        os.getenv("AQUA_AI_API_KEY")
        or os.getenv("AI_PROVIDER_KEY")
    )

    if not provider_url or not provider_key:
        answer, category = _local_answer(message, context)
        return {
            "answer": answer,
            "category": category,
            "disclaimer": DEFAULT_DISCLAIMER,
            "source": "local-fallback",
        }

    payload = {
        "message": message,
        "context": context or {},
    }

    headers = {
        "Authorization": f"Bearer {provider_key}",
        "Content-Type": "application/json",
    }

    try:
        response = requests.post(
            provider_url,
            json=payload,
            headers=headers,
            timeout=20,
        )
        response.raise_for_status()
        data = response.json()
    except (requests.RequestException, ValueError) as error:
        raise RuntimeError(
            "The AI service is currently unavailable."
        ) from error

    answer = data.get("answer") or data.get("response")

    if not isinstance(answer, str) or not answer.strip():
        raise RuntimeError("The AI service returned an invalid response.")

    return {
        "answer": answer.strip(),
        "category": data.get("category") or _category_for(message),
        "disclaimer": data.get("disclaimer") or DEFAULT_DISCLAIMER,
        "source": "configured-provider",
    }