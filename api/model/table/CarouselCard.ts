
export interface CarouselCard {
  id: number;
  title?: string;
  image_url?: string;
  content?: string;
  sort_order: number;
  archived: boolean;
  created_at: Date;
  updated_at?: Date;
}