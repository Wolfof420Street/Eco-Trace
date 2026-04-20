import type { ActivityDTO } from "@/src/application/dtos/ActivityDTO";
import type { Activity } from "@/src/domain/entities/Activity";

export function mapActivityToDTO(activity: Activity): ActivityDTO {
  return {
    id: activity.id,
    category: activity.category,
    subcategory: activity.subcategory,
    quantity: activity.quantity,
    unit: activity.unit,
    co2Kg: activity.co2.kg,
    notes: activity.notes,
    source: activity.source,
    loggedAt: activity.loggedAt.toISOString()
  };
}
