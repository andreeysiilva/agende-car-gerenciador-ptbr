export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agendamentos: {
        Row: {
          created_at: string | null
          data_agendamento: string
          empresa_id: string | null
          horario: string
          id: string
          nome_carro: string
          nome_cliente: string
          observacoes: string | null
          servico: string
          status: string | null
          telefone: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_agendamento: string
          empresa_id?: string | null
          horario: string
          id?: string
          nome_carro: string
          nome_cliente: string
          observacoes?: string | null
          servico: string
          status?: string | null
          telefone: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_agendamento?: string
          empresa_id?: string | null
          horario?: string
          id?: string
          nome_carro?: string
          nome_cliente?: string
          observacoes?: string | null
          servico?: string
          status?: string | null
          telefone?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agendamentos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          created_at: string | null
          data_vencimento: string | null
          email: string
          endereco: string | null
          id: string
          logo_url: string | null
          nome: string
          plano_id: string | null
          senha_temporaria: string | null
          status: string | null
          subdominio: string
          telefone: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_vencimento?: string | null
          email: string
          endereco?: string | null
          id?: string
          logo_url?: string | null
          nome: string
          plano_id?: string | null
          senha_temporaria?: string | null
          status?: string | null
          subdominio: string
          telefone: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_vencimento?: string | null
          email?: string
          endereco?: string | null
          id?: string
          logo_url?: string | null
          nome?: string
          plano_id?: string | null
          senha_temporaria?: string | null
          status?: string | null
          subdominio?: string
          telefone?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "empresas_plano_id_fkey"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "planos"
            referencedColumns: ["id"]
          },
        ]
      }
      horarios_funcionamento: {
        Row: {
          created_at: string | null
          dia_semana: number
          empresa_id: string | null
          funcionando: boolean | null
          horario_abertura: string | null
          horario_fechamento: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dia_semana: number
          empresa_id?: string | null
          funcionando?: boolean | null
          horario_abertura?: string | null
          horario_fechamento?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dia_semana?: number
          empresa_id?: string | null
          funcionando?: boolean | null
          horario_abertura?: string | null
          horario_fechamento?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "horarios_funcionamento_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      planos: {
        Row: {
          ativo: boolean | null
          caracteristicas: string[] | null
          created_at: string | null
          descricao: string | null
          id: string
          limite_agendamentos: number
          limite_usuarios: number
          nome: string
          popular: boolean | null
          preco: number
          suporte: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          caracteristicas?: string[] | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          limite_agendamentos?: number
          limite_usuarios?: number
          nome: string
          popular?: boolean | null
          preco: number
          suporte?: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          caracteristicas?: string[] | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          limite_agendamentos?: number
          limite_usuarios?: number
          nome?: string
          popular?: boolean | null
          preco?: number
          suporte?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      servicos: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          descricao: string | null
          duracao_minutos: number | null
          empresa_id: string | null
          id: string
          nome: string
          preco: number | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          duracao_minutos?: number | null
          empresa_id?: string | null
          id?: string
          nome: string
          preco?: number | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          duracao_minutos?: number | null
          empresa_id?: string | null
          id?: string
          nome?: string
          preco?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "servicos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      transacoes: {
        Row: {
          created_at: string | null
          data_pagamento: string | null
          data_vencimento: string | null
          descricao: string | null
          empresa_id: string | null
          id: string
          metodo_pagamento: string | null
          status: string | null
          tipo: string
          updated_at: string | null
          valor: number
        }
        Insert: {
          created_at?: string | null
          data_pagamento?: string | null
          data_vencimento?: string | null
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          metodo_pagamento?: string | null
          status?: string | null
          tipo: string
          updated_at?: string | null
          valor: number
        }
        Update: {
          created_at?: string | null
          data_pagamento?: string | null
          data_vencimento?: string | null
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          metodo_pagamento?: string | null
          status?: string | null
          tipo?: string
          updated_at?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "transacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          ativo: boolean | null
          auth_user_id: string | null
          created_at: string | null
          email: string
          empresa_id: string | null
          id: string
          nome: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          auth_user_id?: string | null
          created_at?: string | null
          email: string
          empresa_id?: string | null
          id?: string
          nome: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          auth_user_id?: string | null
          created_at?: string | null
          email?: string
          empresa_id?: string | null
          id?: string
          nome?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
