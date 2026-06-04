import {
  GraduationCap, Wheat, Heart, Handshake, Church, Building2,
  ShoppingCart, Hotel, Truck, Home, Factory, Landmark,
  PiggyBank, Trophy, Users, Package, Stethoscope, Briefcase,
  Globe, Zap, Shield, Code, Coffee, Music, Camera, Utensils,
  Leaf, Sun, Wind, Droplets, Fish, FlaskConical, Scale,
  Wrench, Hammer, BookOpen, Microscope, Plane, Ship,
  Car, Bus, Bike, Train, TreePine, Mountain, Waves,
  type LucideProps
} from "lucide-react";
import { type ComponentType } from "react";

const ICON_MAP: Record<string, ComponentType<LucideProps>> = {
  GraduationCap,
  Wheat,
  Heart,
  Handshake,
  Church,
  Building2,
  ShoppingCart,
  Hotel,
  Truck,
  Home,
  Factory,
  Landmark,
  PiggyBank,
  Trophy,
  Users,
  Package,
  Stethoscope,
  Briefcase,
  Globe,
  Zap,
  Shield,
  Code,
  Coffee,
  Music,
  Camera,
  Utensils,
  Leaf,
  Sun,
  Wind,
  Droplets,
  Fish,
  FlaskConical,
  Scale,
  Wrench,
  Hammer,
  BookOpen,
  Microscope,
  Plane,
  Ship,
  Car,
  Bus,
  Bike,
  Train,
  TreePine,
  Mountain,
  Waves,
};

interface IndustryIconProps extends LucideProps {
  icon: string;
}

export function IndustryIcon({ icon, ...props }: IndustryIconProps) {
  const Icon = ICON_MAP[icon] || Package;
  return <Icon {...props} />;
}
