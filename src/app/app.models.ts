export class Post {
  id: number;
  title: string;
  body: string;
  userId: number;

  constructor(post: Partial<Post>) {
    Object.assign(this, post);
  }
}

export type PostData = Partial<Omit<Post, 'id'>>;
