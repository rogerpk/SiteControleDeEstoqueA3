# 🚀 Guia de Hospedagem - Como Publicar o Site

Este guia explica como tornar o site acessível para outras pessoas na internet.

---

## 📌 Opção 1: GitHub Pages (Recomendado - GRATUITO)

### Passo a Passo:

1. **Certifique-se de que todos os arquivos estão commitados:**
   ```bash
   git add .
   git commit -m "Preparar para deploy no GitHub Pages"
   git push origin main
   ```

2. **Ative o GitHub Pages:**
   - Acesse: https://github.com/rogerpk/SiteControleDeEstoqueA3
   - Clique em **Settings** (Configurações)
   - No menu lateral, clique em **Pages**
   - Em **Source**, selecione **Deploy from a branch**
   - Escolha a branch **main** e a pasta **/ (root)**
   - Clique em **Save**

3. **Aguarde alguns minutos** e acesse:
   ```
   https://rogerpk.github.io/SiteControleDeEstoqueA3/
   ```

### ⚠️ Importante sobre localStorage:
- Cada usuário terá seu próprio armazenamento local no navegador
- Os dados não são compartilhados entre usuários
- Para dados compartilhados, seria necessário um backend (não implementado)

---

## 📌 Opção 2: Netlify (GRATUITO - Mais fácil)

1. Acesse: https://www.netlify.com
2. Faça login com sua conta GitHub
3. Clique em **Add new site** → **Import an existing project**
4. Conecte seu repositório do GitHub
5. Configure:
   - **Build command:** (deixe vazio)
   - **Publish directory:** `/` (raiz)
6. Clique em **Deploy site**
7. Seu site estará disponível em: `https://seu-site.netlify.app`

**Vantagem:** Deploy automático a cada push no GitHub!

---

## 📌 Opção 3: Vercel (GRATUITO)

1. Acesse: https://vercel.com
2. Faça login com GitHub
3. Clique em **Add New Project**
4. Importe o repositório
5. Configure:
   - **Framework Preset:** Other
   - **Root Directory:** `./`
6. Clique em **Deploy**
7. Seu site estará em: `https://seu-site.vercel.app`

---

## 📌 Opção 4: Servidor Local Temporário (Para testes)

Se você quer testar localmente com outras pessoas na mesma rede:

### Usando Python (se tiver instalado):
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Depois acesse: `http://seu-ip-local:8000`

### Usando Node.js (se tiver instalado):
```bash
npx http-server -p 8000
```

### Usando ngrok (para acesso externo):
1. Baixe: https://ngrok.com
2. Execute: `ngrok http 8000`
3. Compartilhe a URL gerada (ex: `https://abc123.ngrok.io`)

---

## 🔒 Considerações de Segurança

- **localStorage é local ao navegador:** Cada pessoa terá seus próprios dados
- **Sem autenticação:** Qualquer pessoa que acessar o link pode usar o sistema
- **Dados não são sincronizados:** Cada usuário trabalha independentemente

---

## 📝 Recomendações

Para um projeto acadêmico, **GitHub Pages** é a melhor opção:
- ✅ Gratuito
- ✅ Fácil de configurar
- ✅ Integrado com seu repositório
- ✅ URL personalizada disponível
- ✅ HTTPS automático

---

## 🆘 Problemas Comuns

**Site não carrega:**
- Verifique se todos os arquivos foram commitados
- Confirme que a branch `main` está selecionada no GitHub Pages
- Aguarde 5-10 minutos após ativar

**Erros 404:**
- Certifique-se de que `index.html` está na raiz do repositório
- Verifique os caminhos dos arquivos CSS e JS

**Dados não aparecem:**
- localStorage é específico de cada navegador/usuário
- Dados de exemplo são carregados automaticamente na primeira visita

