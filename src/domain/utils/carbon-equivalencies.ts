export function toTreeDays(co2Kg: number): number {
  return Number((co2Kg / 0.06).toFixed(0));
}

export function toDrivingKm(co2Kg: number): number {
  return Number((co2Kg / 0.192).toFixed(1));
}

export function toPhoneCharges(co2Kg: number): number {
  return Number((co2Kg / 0.00822).toFixed(0));
}

export function getCarbonEquivalencies(co2Kg: number) {
  return {
    trees: toTreeDays(co2Kg),
    drivingKm: toDrivingKm(co2Kg),
    phoneCharges: toPhoneCharges(co2Kg)
  };
}
