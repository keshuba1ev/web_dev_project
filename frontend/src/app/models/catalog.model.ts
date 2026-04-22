export interface Dorama {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  release_year: number;
  category: number;
  category_name: string;
  cast?: {name: string, image_url: string}[];
}

export interface AuthResponse {
  refresh: string;
  access: string;
  username: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Bookmark {
  id: number;
  dorama: number;
  dorama_details?: Dorama;
  status: string;
  created_at: string;
}

export interface Review {
  id: number;
  dorama: number;
  user: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}
