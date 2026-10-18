import React from 'react';
import {
  Sparkles,
  Flame,
  Hamburger,
  Pizza,
  UtensilsCrossed,
  CupSoda,
  CakeSlice,
  Tag,
  IceCream,
  GlassWater,
  Utensils
} from 'lucide-react';

const ICONS = {
  Sparkles,
  Flame,
  Hamburger,
  Pizza,
  UtensilsCrossed,
  CupSoda,
  CakeSlice,
  Tag,
  IceCream,
  GlassWater,
  Utensils,
  // Fallback mappings by category ID
  all: Sparkles,
  destaques: Flame,
  burgers: Hamburger,
  pizzas: Pizza,
  esfihas: Utensils,
  refrigerante: CupSoda,
  milkshake: IceCream,
  soda_artesanal: GlassWater,
  porcoes: UtensilsCrossed,
  bebidas: CupSoda,
  sobremesas: CakeSlice,
  combos: Tag
};

export default function CategoryIcon({ name, size = 14, className = '', style = {} }) {
  const IconComponent = ICONS[name] || Sparkles;
  return <IconComponent size={size} className={className} style={style} />;
}
