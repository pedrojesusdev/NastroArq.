# Configuração da Planilha Google Sheets

## Sua Planilha
https://docs.google.com/spreadsheets/d/178w-JxHgrEscy152xACejKjAk7WWhIU4QCLxjQafiuw/edit

## Passo 1: Preparar as Colunas

Na primeira linha da planilha, crie estas colunas:
- **A1**: Data/Hora
- **B1**: Nome
- **C1**: Email
- **D1**: Mensagem
- **E1**: Status

## Passo 2: Criar o Script

1. Na planilha, clique em **Extensões** > **Apps Script**
2. Apague o código existente e cole este código:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    var timestamp = new Date(data.timestamp);
    var name = data.name;
    var email = data.email;
    var message = data.message;
    
    sheet.appendRow([
      timestamp,
      name,
      email,
      message,
      "Novo"
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        'result': 'success',
        'message': 'Dados salvos com sucesso'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        'result': 'error',
        'message': error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Clique em **Salvar** (ícone de disquete)

## Passo 3: Implantar

1. Clique em **Implantar** > **Nova implantação**
2. Clique no ícone ⚙️ e escolha **Aplicativo da web**
3. Configure:
   - **Executar como**: Eu (seu email)
   - **Quem tem acesso**: Qualquer pessoa
4. Clique em **Implantar**
5. **COPIE A URL** (termina com /exec)

## Passo 4: Configurar no Site

Volte aqui no chat do Lovable e me envie a URL que você copiou.
Eu vou configurar automaticamente no código para você!

## ⚠️ IMPORTANTE
- A URL deve terminar com `/exec`
- Você precisará autorizar o script quando solicitado
- Se aparecer aviso de segurança, clique em "Avançado" e depois "Ir para o projeto"
