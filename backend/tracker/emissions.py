# tracker/emissions.py

# Factores aproximados (kg CO2e por unidad indicada)
# Nota: son valores de referencia para MVP. Luego puedes localizarlos a tu contexto.
TRANSPORT_FACTORS_PER_KM = {
    "bus": 0.089,              # kg CO2e / pasajero-km
    "auto_gasolina": 0.171,    # kg CO2e / km
    "auto_diesel": 0.200,
    "moto": 0.103,
    "metro": 0.041,
}

# Energía (kg CO2e por minuto) – ducha eléctrica típica ~7 kW
# 7 kW * (1/60 h) = 0.1167 kWh/min; con 0.40 kgCO2/kWh ≈ 0.047 kg/min
ENERGY_FACTORS_PER_MIN = {
    "ducha_electrica": 0.047,   # kg CO2e / min
}

# Alimentación (kg CO2e por kg de alimento)
FOOD_FACTORS_PER_KG = {
    "res": 27.0,
    "pollo": 6.9,
    "cerdo": 12.1,
    "pescado": 6.1,
    "arroz": 2.7,
    "verduras": 2.0,
    "lacteos": 1.3,
}

def estimate_co2(category: str, subtype: str, quantity: float, unit: str) -> float:
    """Devuelve kg CO2e estimados para la actividad ingresada."""
    if not quantity or quantity < 0:
        return 0.0

    category = (category or "").lower()
    subtype = (subtype or "").lower()
    unit = (unit or "").lower()

    if category == "transporte":
        factor = TRANSPORT_FACTORS_PER_KM.get(subtype, 0.15)
        # esperamos km
        return float(quantity) * factor

    if category == "energia":
        factor = ENERGY_FACTORS_PER_MIN.get(subtype, 0.03)
        # esperamos minutos
        return float(quantity) * factor

    if category == "alimentacion":
        factor = FOOD_FACTORS_PER_KG.get(subtype, 2.0)
        # esperamos kg
        return float(quantity) * factor

    return 0.0
