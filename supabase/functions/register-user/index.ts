import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { nome, login, senha, whatsapp } = await req.json();

    if (!nome || !login || !senha) {
      return new Response(JSON.stringify({ error: "Nome, login e senha são obrigatórios" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check if login already exists
    const { data: existing } = await supabase
      .from("usuarios")
      .select("id")
      .eq("login", login)
      .single();

    if (existing) {
      return new Response(JSON.stringify({ error: "Login já existe" }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const senhaHash = await bcrypt.hash(senha);

    const { data, error } = await supabase
      .from("usuarios")
      .insert({
        nome,
        login,
        senha: senhaHash,
        whatsapp: whatsapp || "",
        role: "colaborador",
        ativo: true,
      })
      .select("id, nome, login, role")
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, user: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
