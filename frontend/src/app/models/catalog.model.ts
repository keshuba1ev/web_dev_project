export interface Dorama {
  id: number;
  title: string;
  description: string;
  release_year: number;
  category: number;
  category_name: string;
}

export interface AuthResponse {
  refresh: string;
  access: string;
  username: string;
}
