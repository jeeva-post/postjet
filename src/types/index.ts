export interface Post {
  id: string;
  content: string;
  mediaUrl?: string;
  mediaType?: string;
  platforms: string[];
  status: 'draft' | 'scheduled' | 'posted' | 'failed';
  scheduledAt?: Date;
  userId: string;
}

export interface Platform {
  id: string;
  name: string;
  icon: string;
}