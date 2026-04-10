export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      estoque: {
        Row: {
          created_at: string
          id: string
          imagem_url: string | null
          marketplace: string | null
          nome: string
          preco_custo: number
          preco_venda: number
          quantidade: number
          sku: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          imagem_url?: string | null
          marketplace?: string | null
          nome: string
          preco_custo?: number
          preco_venda?: number
          quantidade?: number
          sku?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          imagem_url?: string | null
          marketplace?: string | null
          nome?: string
          preco_custo?: number
          preco_venda?: number
          quantidade?: number
          sku?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      livro_caixa: {
        Row: {
          categoria: string | null
          created_at: string
          data: string
          descricao: string
          id: string
          tipo: Database["public"]["Enums"]["livro_caixa_tipo"]
          updated_at: string
          valor: number
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          data?: string
          descricao: string
          id?: string
          tipo: Database["public"]["Enums"]["livro_caixa_tipo"]
          updated_at?: string
          valor: number
        }
        Update: {
          categoria?: string | null
          created_at?: string
          data?: string
          descricao?: string
          id?: string
          tipo?: Database["public"]["Enums"]["livro_caixa_tipo"]
          updated_at?: string
          valor?: number
        }
        Relationships: []
      }
      marketplaces: {
        Row: {
          api_token: string | null
          conectado: boolean
          created_at: string
          id: string
          nome: string
          tipo: Database["public"]["Enums"]["marketplace_tipo"]
          updated_at: string
        }
        Insert: {
          api_token?: string | null
          conectado?: boolean
          created_at?: string
          id?: string
          nome: string
          tipo?: Database["public"]["Enums"]["marketplace_tipo"]
          updated_at?: string
        }
        Update: {
          api_token?: string | null
          conectado?: boolean
          created_at?: string
          id?: string
          nome?: string
          tipo?: Database["public"]["Enums"]["marketplace_tipo"]
          updated_at?: string
        }
        Relationships: []
      }
      mensagens_pedido: {
        Row: {
          conteudo: string
          created_at: string
          id: string
          pedido_id: string
          remetente_id: string | null
        }
        Insert: {
          conteudo: string
          created_at?: string
          id?: string
          pedido_id: string
          remetente_id?: string | null
        }
        Update: {
          conteudo?: string
          created_at?: string
          id?: string
          pedido_id?: string
          remetente_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mensagens_pedido_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mensagens_pedido_remetente_id_fkey"
            columns: ["remetente_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos: {
        Row: {
          cliente: string
          created_at: string
          id: string
          marketplace_id: string | null
          numero: string
          observacoes: string | null
          rastreio: string | null
          responsavel_id: string | null
          status: Database["public"]["Enums"]["pedido_status"]
          updated_at: string
          valor: number
        }
        Insert: {
          cliente: string
          created_at?: string
          id?: string
          marketplace_id?: string | null
          numero: string
          observacoes?: string | null
          rastreio?: string | null
          responsavel_id?: string | null
          status?: Database["public"]["Enums"]["pedido_status"]
          updated_at?: string
          valor?: number
        }
        Update: {
          cliente?: string
          created_at?: string
          id?: string
          marketplace_id?: string | null
          numero?: string
          observacoes?: string | null
          rastreio?: string | null
          responsavel_id?: string | null
          status?: Database["public"]["Enums"]["pedido_status"]
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_marketplace_id_fkey"
            columns: ["marketplace_id"]
            isOneToOne: false
            referencedRelation: "marketplaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          ativo: boolean
          colaborador_id: string | null
          created_at: string
          id: string
          login: string
          nome: string
          permissoes: Json | null
          permite_criar_assistente: boolean
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
          whatsapp: string
        }
        Insert: {
          ativo?: boolean
          colaborador_id?: string | null
          created_at?: string
          id?: string
          login: string
          nome: string
          permissoes?: Json | null
          permite_criar_assistente?: boolean
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
          whatsapp?: string
        }
        Update: {
          ativo?: boolean
          colaborador_id?: string | null
          created_at?: string
          id?: string
          login?: string
          nome?: string
          permissoes?: Json | null
          permite_criar_assistente?: boolean
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
          whatsapp?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_colaborador_id: { Args: never; Returns: string }
      get_profile_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "colaborador" | "assistente"
      livro_caixa_tipo: "entrada" | "saida"
      marketplace_tipo: "mercadolivre" | "shopee" | "outro"
      pedido_status:
        | "novo"
        | "em_analise"
        | "aprovado"
        | "enviado"
        | "entregue"
        | "cancelado"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "colaborador", "assistente"],
      livro_caixa_tipo: ["entrada", "saida"],
      marketplace_tipo: ["mercadolivre", "shopee", "outro"],
      pedido_status: [
        "novo",
        "em_analise",
        "aprovado",
        "enviado",
        "entregue",
        "cancelado",
      ],
    },
  },
} as const
