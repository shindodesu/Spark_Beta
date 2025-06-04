export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
        };
      };
      chats: {
        Row: {
          id: string;
          user1_id: string;
          user2_id: string;
          created_at: string;
        };
      };
    };
  };
};