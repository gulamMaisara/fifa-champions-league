export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      matches: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          kickoff_at: string | null;
          result: Database["public"]["Enums"]["match_result"] | null;
          status: Database["public"]["Enums"]["match_status"];
          team_a: string;
          team_a_stats: string | null;
          team_b: string;
          team_b_stats: string | null;
          updated_at: string;
          is_knockout: boolean | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          kickoff_at?: string | null;
          result?: Database["public"]["Enums"]["match_result"] | null;
          status?: Database["public"]["Enums"]["match_status"];
          team_a: string;
          team_a_stats?: string | null;
          team_b: string;
          team_b_stats?: string | null;
          updated_at?: string;
          is_knockout?: boolean | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          kickoff_at?: string | null;
          result?: Database["public"]["Enums"]["match_result"] | null;
          status?: Database["public"]["Enums"]["match_status"];
          team_a?: string;
          team_a_stats?: string | null;
          team_b?: string;
          team_b_stats?: string | null;
          updated_at?: string;
          is_knockout?: boolean | null;
        };
        Relationships: [];
      };
      picks: {
        Row: {
          created_at: string;
          id: string;
          match_id: string;
          picked: Database["public"]["Enums"]["pick_team"];
          player_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          match_id: string;
          picked: Database["public"]["Enums"]["pick_team"];
          player_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          match_id?: string;
          picked?: Database["public"]["Enums"]["pick_team"];
          player_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "picks_match_id_fkey";
            columns: ["match_id"];
            isOneToOne: false;
            referencedRelation: "matches";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "picks_player_id_fkey";
            columns: ["player_id"];
            isOneToOne: false;
            referencedRelation: "players";
            referencedColumns: ["id"];
          },
        ];
      };
      players: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          group_code: string;
          is_admin: boolean | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          group_code?: string;
          is_admin?: boolean | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          group_code?: string;
          is_admin?: boolean | null;
        };
        Relationships: [];
      };
      scoring_settings: {
        Row: {
          draw_points: number;
          id: number;
          loss_points: number;
          max_not_played: number;
          not_played_points: number;
          updated_at: string;
          win_points: number;
        };
        Insert: {
          draw_points?: number;
          id?: number;
          loss_points?: number;
          max_not_played?: number;
          not_played_points?: number;
          updated_at?: string;
          win_points?: number;
        };
        Update: {
          draw_points?: number;
          id?: number;
          loss_points?: number;
          max_not_played?: number;
          not_played_points?: number;
          updated_at?: string;
          win_points?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      match_result: "team_a" | "team_b" | "draw";
      match_status: "scheduled" | "played" | "not_played";
      pick_team: "team_a" | "team_b";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      match_result: ["team_a", "team_b", "draw"],
      match_status: ["scheduled", "played", "not_played"],
      pick_team: ["team_a", "team_b"],
    },
  },
} as const;
