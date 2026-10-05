import React from 'react';
import {
  Sparkles,
  Flame,
  Hamburger,
  Pizza,
  UtensilsCrossed,
  CupSoda,
  CakeSlice,
  Tag
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
  // Fallback mappings by category ID
  all: Sparkles,
  destaques: Flame,
  burgers: Hamburger,
  pizzas: Pizza,
  porcoes: UtensilsCrossed,
  bebidas: CupSoda,
  sobremesas: CakeSlice,
  combos: Tag
};

export default function CategoryIcon({ name, size = 18, className = '', style = {} }) {
  const IconComponent = ICONS[name] || Sparkles;
  return <IconComponent size={size} className={className} style={style} />;
}
