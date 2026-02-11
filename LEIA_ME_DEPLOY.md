# 🏦 Protocolo de Deploy: LA CASAS DE APOSTA

Este dossiê contém as instruções técnicas para subir a plataforma na VPS. O sistema é uma aplicação **React (Vite)** que deve ser servida como conteúdo estático de alta performance.

---

## 📋 Pré-requisitos do Servidor (VPS)

Certifique-se de que o ambiente possui:
1.  **Node.js** (Versão 18 ou superior recomendada)
2.  **Nginx** (ou Apache) para servir os arquivos
3.  **Git** (opcional, se for clonar direto)

---

## 🚀 Fase 1: Preparação do Artefato

1.  **Descompactar o Projeto:**
    Envie a pasta do projeto para a VPS (ex: via SFTP ou Git).

2.  **Instalar Dependências:**
    Acesse a pasta raiz do projeto e execute:
    ```bash
    npm install
    # ou
    pnpm install
    ```

3.  **Gerar o Build de Produção:**
    Este passo cria a versão otimizada e protegida do código na pasta `dist`.
    ```bash
    npm run build
    ```
    *Isso criará uma pasta chamada `dist` na raiz. É essa pasta que contém o site pronto.*

---

## 🌐 Fase 2: Servindo a Aplicação (Nginx)

Recomendamos usar o **Nginx** para servir os arquivos estáticos da pasta `dist` com máxima velocidade.

1.  **Criar configuração do site:**
    ```bash
    sudo nano /etc/nginx/sites-available/lacasa
    ```

2.  **Cole a configuração abaixo (ajuste o domínio):**

    ```nginx
    server {
        listen 80;
        server_name seudominio.com www.seudominio.com;

        # Aponta para a pasta 'dist' que foi gerada no build
        root /var/www/lacasa/dist;
        index index.html;

        # Configuração para React Router (SPA)
        # Redireciona todas as rotas para o index.html
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache de arquivos estáticos (Performance)
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, no-transform";
        }
    }
    ```

3.  **Ativar o site:**
    ```bash
    sudo ln -s /etc/nginx/sites-available/lacasa /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```

---

## 🛠️ Fase 3: Deploy com Docker (Alternativa)

Se preferir usar Docker, crie um `Dockerfile` na raiz:

```dockerfile
# Estágio de Build
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio de Servidor
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Copie uma config customizada do nginx se necessário para lidar com o SPA
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

E rode com:
```bash
docker build -t lacasa-app .
docker run -d -p 80:80 lacasa-app
```

---

## 🔒 Notas de Segurança

*   O comando `npm run build` minifica e ofusca o código, dificultando a engenharia reversa.
*   Certifique-se de configurar o **SSL (HTTPS)** usando o Certbot:
    ```bash
    sudo certbot --nginx -d seudominio.com
    ```

**Boa sorte na operação.** 🎭
