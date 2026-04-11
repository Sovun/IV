export type CategoryKey =
  | 'Kitchens'
  | 'Study'
  | 'Wardrobes_and_Bedroom'
  | 'Bathroom_and_Sauna'
  | 'Interior_Decorations'
  | 'Doors'
  | 'Tables'
  | 'Stairs'

// Display labels for each category (English)
export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  Kitchens: 'Kitchens',
  Study: 'Study',
  Wardrobes_and_Bedroom: 'Wardrobes & Bedroom',
  Bathroom_and_Sauna: 'Bathroom & Sauna',
  Interior_Decorations: 'Interior Decorations',
  Doors: 'Doors',
  Tables: 'Tables',
  Stairs: 'Stairs',
}

// Ordered list — categories without a matching folder are hidden automatically
export const CATEGORIES: CategoryKey[] = [
  'Kitchens',
  'Study',
  'Wardrobes_and_Bedroom',
  'Bathroom_and_Sauna',
  'Interior_Decorations',
  'Doors',
  'Tables',
  'Stairs',
]
