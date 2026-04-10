import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { encode as base64url } from "https://deno.land/std@0.208.0/encoding/base64url.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function textToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

async function createJWT(payload: Record<string, unknown>, secret: string): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = { ...payload, iat: now, exp: now + 60 * 60 * 24 }; // 24h

  const headerB64 = base64url(textToUint8Array(JSON.stringify(header)));
  const payloadB64 = base64url(textToUint8Array(JSON.stringify(fullPayload)));
  const data = `${headerB64}.${payloadB64}`;

  const key = await crypto.subtle.importKey(
    "raw",
    textToUint8Array(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, textToUint8Array(data));
  const sigB64 = base64url(new Uint8Array(signature));

  return `${data}.${sigB64}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { login, senha } = await req.json();

    if (!login || !senha) {
      return new Response(JSON.stringify({ error: "Login e senha são obrigatórios" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: usuario, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("login", login)
      .single();

    if (error || !usuario) {
      return new Response(JSON.stringify({ error: "Usuário não encontrado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!usuario.ativo) {
      return new Response(JSON.stringify({ error: "Usuário desativado" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return new Response(JSON.stringify({ error: "Senha incorreta" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const jwtSecret = Deno.env.get("JWT_SECRET")!;
    const token = await createJWT(
      {
        sub: usuario.id,
        login: usuario.login,
        role: usuario.role,
        nome: usuario.nome,
      },
      jwtSecret
    );

    // Return user data without senha
    const { senha: _, ...userData } = usuario;

    return new Response(JSON.stringify({ token, user: userData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
