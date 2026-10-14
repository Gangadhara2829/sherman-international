export interface GalleryItem {
  id: string;
  title: string;
  caption?: string | null;
  altText?: string | null;
  imageUrl: string;
  category?: string | null;
  displayOrder: number;
  isPublished: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export const DEFAULT_GALLERY_CATEGORIES: string[] = [
  'Engineering',
  'Equipment',
  'Facilities',
  'Projects',
  'General',
];
