export type CO2Amount = {
  readonly _brand: "CO2Amount";
  readonly kg: number;
};

export function createCO2Amount(kg: number): CO2Amount {
  if (!Number.isFinite(kg) || kg < 0) {
    throw new Error("CO2Amount cannot be negative");
  }

  return {
    _brand: "CO2Amount",
    kg: Number(kg.toFixed(3))
  };
}

export function addCO2(a: CO2Amount, b: CO2Amount): CO2Amount {
  return createCO2Amount(a.kg + b.kg);
}
