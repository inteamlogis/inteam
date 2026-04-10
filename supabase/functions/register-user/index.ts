import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function textToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

async function hashPassword(password: string): Promise<string> {
  const data = textToUint8Array(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

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

    const senhaHash = await hashPassword(senha);

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
